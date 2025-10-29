import {getFromBytes} from 'jooby-codec/analog/message/wrappers.js';
import uplinkNames from 'jooby-codec/analog/constants/uplinkNames.js';

import * as correctTime2000 from 'jooby-codec/analog/commands/uplink/correctTime2000.js';
import * as currentMc from 'jooby-codec/analog/commands/uplink/currentMc.js';
import * as dayMc from 'jooby-codec/analog/commands/uplink/dayMc.js';
import * as getArchiveDaysMc from 'jooby-codec/analog/commands/uplink/getArchiveDaysMc.js';
import * as getArchiveHoursMc from 'jooby-codec/analog/commands/uplink/getArchiveHoursMc.js';
import * as getParameter from 'jooby-codec/analog/commands/uplink/getParameter.js';
import * as hourMc from 'jooby-codec/analog/commands/uplink/hourMc.js';
import * as newEvent from 'jooby-codec/analog/commands/uplink/newEvent.js';
import * as setParameter from 'jooby-codec/analog/commands/uplink/setParameter.js';
import * as setTime2000 from 'jooby-codec/analog/commands/uplink/setTime2000.js';
import * as status from 'jooby-codec/analog/commands/uplink/status.js';
import * as time2000 from 'jooby-codec/analog/commands/uplink/time2000.js';


const fromBytesMap = {
    [correctTime2000.id]: correctTime2000.fromBytes,
    [currentMc.id]: currentMc.fromBytes,
    [dayMc.id]: dayMc.fromBytes,
    [getArchiveDaysMc.id]: getArchiveDaysMc.fromBytes,
    [getArchiveHoursMc.id]: getArchiveHoursMc.fromBytes,
    [getParameter.id]: getParameter.fromBytes,
    [hourMc.id]: hourMc.fromBytes,
    [newEvent.id]: newEvent.fromBytes,
    [setParameter.id]: setParameter.fromBytes,
    [setTime2000.id]: setTime2000.fromBytes,
    [status.id]: status.fromBytes,
    [time2000.id]: time2000.fromBytes
};


// partial command set
fromBytes = getFromBytes(fromBytesMap, uplinkNames);
