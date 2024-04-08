import '../../../../polyfills/array-fill.js';
import '../../../../polyfills/number.js';

import * as message from 'jooby-codec/analog/message/downlink';
import * as utils from 'jooby-codec/utils';


// export
getBase64FromBytes = utils.getBase64FromBytes;
toBytes = message.toBytes;
