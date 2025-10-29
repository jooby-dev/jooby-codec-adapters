import {describe, it} from 'node:test';
import assert from 'node:assert';

import {getHexFromBytes, getBytesFromHex} from 'jooby-codec/utils';
import {commands} from 'jooby-codec/analog/index.js';
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

        describe(`${commandName} 0x${getHexFromBytes([commandImplementation.id])}/${commandImplementation.id}`, () => {
            for ( const [exampleName, example] of Object.entries(commandImplementation.examples) ) {
                it(exampleName, () => checkExample(commandImplementation, example));
            }
        });
    }
};


describe('analog downlink commands', () => {
    processExamples(downlink);
});

describe('analog uplink commands', () => {
    processExamples(uplink);
});

describe('analog encodeDownlink/decodeDownlink functions', () => {
    const commands = [
        {id: 0x02, name: 'setTime2000', parameters: {sequenceNumber: 78, seconds: 733845677}},
        {id: 0x09, name: 'getTime2000'},
        {id: 0x051f, name: 'getBatteryStatus'},
        {id: 0x19, name: 'softRestart'}
    ];
    const hex = '02 05 4e 2b bd 98 ad 09 00 1f 05 00 19 00 b5';
    const result = encodeDownlink({data: {commands}});

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
            id: 0x04,
            name: 'getParameter',
            parameters: {
                id: 1,
                name: 'REPORTING_DATA_INTERVAL',
                data: {
                    firstDaysSpecialSchedule: 0,
                    lastDaysSpecialSchedule: 0,
                    period: 2400,
                    specialSchedulePeriod: 0
                }
            }
        },
        {id: 0x07, name: 'current', parameters: {isMagneticInfluence: true, value: 342}},
        {id: 0x09, name: 'time2000', parameters: {sequenceNumber: 77, time2000: 733845677}},
        {id: 0x19, name: 'softRestart'}
    ];
    const hex = '04 05 01 00 00 00 04 07 04 80 00 01 56 09 05 4d 2b bd 98 ad 19 00 7e';
    const bytes = getBytesFromHex(hex);
    const result = decodeUplink({bytes});

    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.data.bytes, bytes);

    result.data.message.commands.forEach(({id, name, parameters}, index) => {
        const command = commands[index];

        assert.equal(command.id, id);
        assert.equal(command.name, name);
        assert.deepEqual(command.parameters || {}, parameters);
    });
});
