//import 'core-js/actual/symbol';
import '../polyfills.js';

import * as message from 'jooby-codec/analog/message';
//import * as downlink from 'jooby-codec/analog/message/downlink';
//import * as uplink from 'jooby-codec/analog/message/uplink';
//import * as downlinkCommands from 'jooby-codec/analog/commands/downlink';
//import {getHexFromBytes} from 'jooby-codec/utils/index.js';
import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
import getBytesFromHex from 'jooby-codec/utils/getBytesFromHex.js';
//import {hexFormatOptions} from 'jooby-codec/config.js';


//console.log((123).toString(16));

//hexFormatOptions.separator = '-';

//console.log(getHexFromBytes([0x00, 0x0a, 0xff]));
//console.log(getBytesFromHex('0xaa 05  cc'));
//console.log(exports);

decodeUplink = ( {bytes, fPort, variables} ) => {
    const {commands} = message.uplink.fromBytes(bytes);

    return {
        data: commands.map(({id, parameters}) => ({id, parameters}))
    };
};

encodeDownlink = ( {data, variables} ) => {
    return {bytes: message.downlink.toBytes(data)};
};
