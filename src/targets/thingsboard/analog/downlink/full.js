import './polyfills.js';

import * as message from 'jooby-codec/analog/message/downlink';
import * as utils from 'jooby-codec/utils';


// full command set
toBytes = message.toBytes;
getBase64FromBytes = utils.getBase64FromBytes;
