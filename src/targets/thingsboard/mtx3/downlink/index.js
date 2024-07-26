import './polyfills.js';

import * as message from 'jooby-codec/mtx3/message/downlink';
import * as utils from 'jooby-codec/utils';
import * as dataSegment from '../../../../utils/dataSegment.js';


// export
getBase64FromBytes = utils.getBase64FromBytes;
toBytes = message.toBytes;
setDataSegment = dataSegment.set;
