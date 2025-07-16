import {getToBytes} from 'jooby-codec/analog/message/wrappers.js';
import * as utils from 'jooby-codec/utils';

import * as correctTime2000 from 'jooby-codec/analog/commands/downlink/correctTime2000.js';
import * as getArchiveDaysMc from 'jooby-codec/analog/commands/downlink/getArchiveDaysMc.js';
import * as getArchiveHoursMc from 'jooby-codec/analog/commands/downlink/getArchiveHoursMc.js';
import * as getCurrentMc from 'jooby-codec/analog/commands/downlink/getCurrentMc.js';
import * as getParameter from 'jooby-codec/analog/commands/downlink/getParameter.js';
import * as getStatus from 'jooby-codec/analog/commands/downlink/getStatus.js';
import * as getTime2000 from 'jooby-codec/analog/commands/downlink/getTime2000.js';
import * as setParameter from 'jooby-codec/analog/commands/downlink/setParameter.js';
import * as setTime2000 from 'jooby-codec/analog/commands/downlink/setTime2000.js';


const toBytesMap = {
    [correctTime2000.id]: correctTime2000.toBytes,
    [getArchiveDaysMc.id]: getArchiveDaysMc.toBytes,
    [getArchiveHoursMc.id]: getArchiveHoursMc.toBytes,
    [getCurrentMc.id]: getCurrentMc.toBytes,
    [getParameter.id]: getParameter.toBytes,
    [getStatus.id]: getStatus.toBytes,
    [getTime2000.id]: getTime2000.toBytes,
    [setParameter.id]: setParameter.toBytes,
    [setTime2000.id]: setTime2000.toBytes
};


// partial command set
toBytes = getToBytes(toBytesMap);
getBase64FromBytes = utils.getBase64FromBytes;
