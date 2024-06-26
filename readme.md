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


# Development

```sh
git clone --branch v4 git@github.com:jooby-dev/jooby-codec.git jooby-codec-v4
cd jooby-codec-v4
npm i
npm run build:js:watch

cd ..
git clone git@github.com:jooby-dev/jooby-codec-adapters.git
cd jooby-codec-adapters
npm i

# this is not required after `npm install`
#ln -s ../../jooby-codec-v4/dist ./node_modules/jooby-codec

npx webpack -w
npx rollup -c -w

npm run dev
```
