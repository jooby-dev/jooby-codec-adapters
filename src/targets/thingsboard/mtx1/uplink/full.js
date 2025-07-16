import './polyfills.js';

import * as message from 'jooby-codec/mtx1/message/uplink';
import * as dataSegment from '../../../../utils/dataSegment.js';


// full command set
fromBytes = message.fromBytes;
getDataSegment = dataSegment.get;
