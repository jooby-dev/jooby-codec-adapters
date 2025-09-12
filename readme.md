# Jooby encoders/decoders adapters


## Postprocessing

In some cases it may be necessary to adapt decoded result.
<br/>
Here is a simple example how to get rid of all low-level info (for ChirpStack v4):

```js
function decodeUplink ( input ) {
    const message = fromBytes(input.bytes, config);
    const commands = (message.message || message).commands;
    const filteredCommands = commands.map(({id, name, parameters}) => ({id, name, parameters}));

    return {data: {commands: filteredCommands}};
};
```

To rework it completely and get result object with only some fields:

```js
function decodeUplink ( input ) {
    const message = fromBytes(input.bytes, config);
    const commands = (message.message || message).commands;
    const data = {};

    commands.forEach(({id, name, parameters}) => {
        // lastEvent
        if ( id === 96 ) {
            // take only some properties from parameters
            data.isBatteryLow = parameters.status.isBatteryLow;
            data.isConnectionLost = parameters.status.isConnectionLost;
        }

        // currentMc
        if ( id === 24 ) {
            // take first two channel values
            data.directFlowValue = parameters.channelList.find(({index}) => index === 1)?.value;
            data.reverseFlowValue = parameters.channelList.find(({index}) => index === 2)?.value;
        }
    });

    return {data};
};
```


# Custom builds for special list of commands

```sh
git clone git@github.com:jooby-dev/jooby-codec-adapters.git
cd jooby-codec-adapters
npm ci
# edit src/target/%TARGET% files
# to change command list edit src/target/%TARGET%/full.js like src/targets/thingpark/analog/partial.js
npm run build:clean
# use files from dist/%TARGET%
```
