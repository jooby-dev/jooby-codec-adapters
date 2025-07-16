import './polyfills.js';

import * as message from 'jooby-codec/mtx3/message/downlink';

import * as utils from 'jooby-codec/utils';
import * as dataSegment from '../../../../utils/dataSegment.js';


// full command set
toBytes = message.toBytes;
getBase64FromBytes = utils.getBase64FromBytes;
setDataSegment = dataSegment.set;
