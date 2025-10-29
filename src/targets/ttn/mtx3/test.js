import {describe, it} from 'node:test';
import assert from 'node:assert';

import {getHexFromBytes, getBytesFromHex} from 'jooby-codec/utils';
import {commands} from 'jooby-codec/mtx3/index.js';
import * as accessLevels from 'jooby-codec/mtx1/constants/accessLevels.js';
import './index.js';


const {uplink, downlink} = commands;

const checkExample = ( {headerSize, fromBytes, toBytes}, commandExample ) => {
    // valid command
    if ( 'bytes' in commandExample ) {
        const parametersFromBytes = fromBytes(commandExample.bytes?.slice(headerSize) || [], commandExample.config);
        const bytesFromParameters = toBytes(commandExample.parameters, commandExample.config);

        assert.equal(getHexFromBytes(bytesFromParameters), getHexFromBytes(commandExample.bytes || []));
        assert.deepEqual(parametersFromBytes, commandExample.parameters);
        assert.equal(JSON.stringify(parametersFromBytes), JSON.stringify(commandExample.parameters));
    } else {
        // everything else
        throw new Error('wrong command format');
    }
};

const processExamples = ( commandMap ) => {
    for ( const [commandName, commandImplementation] of Object.entries(commandMap) ) {
        // each command should export at least 1 example
        assert.equal(Object.keys(commandImplementation.examples).length > 0, true);

        describe(`${commandName} ${getHexFromBytes([commandImplementation.id])}/${commandImplementation.id}`, () => {
            for ( const [exampleName, example] of Object.entries(commandImplementation.examples) ) {
                it(exampleName, () => checkExample(commandImplementation, example));
            }
        });
    }
};


describe('mtx3 downlink commands', () => {
    processExamples(downlink);
});

describe('mtx3 uplink commands', () => {
    processExamples(uplink);
});

describe('analog encodeDownlink/decodeDownlink functions', () => {
    const commands = [
        {id: 0x07, name: 'getDateTime'},
        {id: 0x3e, name: 'getCorrectTime'},
        {id: 0x5d, name: 'setDisplayParam', parameters: {displayMode: 1, order: [4, 5, 6, 7]}},
        {id: 0x19, name: 'turnRelayOff'}
    ];
    const hex = '1e 14 00 91 da 10 10 07 00 3e 00 5d 05 01 04 05 06 07 19 00 00 3c 51';
    const result = encodeDownlink({
        data: {
            commands,
            config: {
                messageId: 218,
                accessLevel: accessLevels.UNENCRYPTED
            }
        }
    });

    assert.equal(getHexFromBytes(result.bytes), hex);

    const {data, errors} = decodeDownlink({bytes: result.bytes});

    assert.deepEqual(errors, []);

    data.message.commands.forEach(({id, name, parameters}, index) => {
        const command = commands[index];

        assert.equal(command.id, id);
        assert.equal(command.name, name);
        assert.deepEqual(command.parameters || {}, parameters);
    });
});

describe('analog decodeUplink function', () => {
    const commands = [
        {
            id: 0x6f,
            name: 'getHalfHourEnergies',
            parameters: {
                date: {year: 24, month: 8, date: 27},
                firstHalfhour: 27,
                halfhoursNumber: 3,
                energies: {'A+': [92, 98, 77]}
            }
        }
    ];
    const hex = '1e 14 dd 91 d9 10 10 6f 0b 31 1b 01 1b 03 00 5c 00 62 00 4d 00 00 63 fd ad 55 88';
    const bytes = getBytesFromHex(hex);
    const result = decodeUplink({bytes});

    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, []);
    assert.deepEqual(result.data.bytes, bytes);

    result.data.message.commands.forEach(({id, name, parameters}, index) => {
        const command = commands[index];

        console.log('command:', command);
        console.log('command.parameters:', command.parameters);
        console.log('parameters:', parameters);

        assert.equal(command.id, id);
        assert.equal(command.name, name);
        assert.deepEqual(command.parameters || {}, parameters);
    });
});
