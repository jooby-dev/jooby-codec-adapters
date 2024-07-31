import './polyfills.js';

import * as message from 'jooby-codec/mtx/message';
import * as dataSegment from '../../../utils/dataSegment.js';


// export
fromBytes = message.uplink.fromBytes;
toBytes = message.downlink.toBytes;
getDataSegment = dataSegment.get;
setDataSegment = dataSegment.set;
