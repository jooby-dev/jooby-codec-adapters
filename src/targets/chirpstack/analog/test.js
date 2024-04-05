import '../polyfills.js';

import * as downlink from 'jooby-codec/analog/commands/downlink';
import * as uplink from 'jooby-codec/analog/commands/uplink';


const equal = ( actual, expected ) => {
    if ( actual !== expected ) {
        console.log('actual:', actual);
        console.log('expected:', expected);
        throw new Error('Assertion error!', actual, expected);
    }
};

const deepEqual = ( actual, expected ) => {
    equal(JSON.stringify(actual), JSON.stringify(expected));
};

const testCommands = ( direction, commands ) => {
    console.log(direction);

    for ( const commandName in commands ) {
        const command = commands[commandName];
        const examples = command?.examples;

        if ( command ) {
            console.log(' *', commandName);

            for ( const exampleName in examples ) {
                const exampleData = examples[exampleName];

                deepEqual(
                    command.toBytes(exampleData.parameters),
                    exampleData.bytes
                );

                deepEqual(
                    command.fromBytes(exampleData.bytes.slice(command.headerSize)),
                    exampleData.parameters
                );
            }
        }
    }
};


testCommands('downlink', downlink);
testCommands('uplink', uplink);
