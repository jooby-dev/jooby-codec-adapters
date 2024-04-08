export const equal = ( actual, expected ) => {
    if ( actual !== expected ) {
        return 'Assertion error!' + ' actual: ' + actual + ' expected: ' + expected;
    }

    return '';
};

export const deepEqual = ( actual, expected ) => {
    return equal(JSON.stringify(actual), JSON.stringify(expected));
};

export const testCommands = ( commands ) => {
    let output = '';

    for ( const commandName in commands ) {
        const command = commands[commandName];
        const examples = command?.examples;

        if ( command ) {
            output += commandName + ' ';

            for ( const exampleName in examples ) {
                const exampleData = examples[exampleName];

                output += deepEqual(
                    command.toBytes(exampleData.parameters, exampleData.config),
                    exampleData.bytes
                );

                output += deepEqual(
                    command.fromBytes(exampleData.bytes.slice(command.headerSize), exampleData.config),
                    exampleData.parameters
                );
            }
        }
    }

    return output;
};
