import {getFromBytes, getToBytes} from 'jooby-codec/analog/message/wrappers.js';
import uplinkNames from 'jooby-codec/analog/constants/uplinkNames.js';

import * as downlinkCorrectTime2000 from 'jooby-codec/analog/commands/downlink/correctTime2000.js';
import * as downlinkGetArchiveDaysMc from 'jooby-codec/analog/commands/downlink/getArchiveDaysMc.js';
import * as downlinkGetArchiveHoursMc from 'jooby-codec/analog/commands/downlink/getArchiveHoursMc.js';
import * as downlinkGetCurrentMc from 'jooby-codec/analog/commands/downlink/getCurrentMc.js';
import * as downlinkGetParameter from 'jooby-codec/analog/commands/downlink/getParameter.js';
import * as downlinkGetStatus from 'jooby-codec/analog/commands/downlink/getStatus.js';
import * as downlinkGetTime2000 from 'jooby-codec/analog/commands/downlink/getTime2000.js';
import * as downlinkSetParameter from 'jooby-codec/analog/commands/downlink/setParameter.js';
import * as downlinkSetTime2000 from 'jooby-codec/analog/commands/downlink/setTime2000.js';

import * as uplinkCorrectTime2000 from 'jooby-codec/analog/commands/uplink/correctTime2000.js';
import * as uplinkCurrentMc from 'jooby-codec/analog/commands/uplink/currentMc.js';
import * as uplinkDayMc from 'jooby-codec/analog/commands/uplink/dayMc.js';
import * as uplinkGetArchiveDaysMc from 'jooby-codec/analog/commands/uplink/getArchiveDaysMc.js';
import * as uplinkGetArchiveHoursMc from 'jooby-codec/analog/commands/uplink/getArchiveHoursMc.js';
import * as uplinkGetParameter from 'jooby-codec/analog/commands/uplink/getParameter.js';
import * as uplinkHourMc from 'jooby-codec/analog/commands/uplink/hourMc.js';
import * as uplinkNewEvent from 'jooby-codec/analog/commands/uplink/newEvent.js';
import * as uplinkSetParameter from 'jooby-codec/analog/commands/uplink/setParameter.js';
import * as uplinkSetTime2000 from 'jooby-codec/analog/commands/uplink/setTime2000.js';
import * as uplinkStatus from 'jooby-codec/analog/commands/uplink/status.js';
import * as uplinkTime2000 from 'jooby-codec/analog/commands/uplink/time2000.js';


const toBytesMap = {
    [downlinkCorrectTime2000.id]: downlinkCorrectTime2000.toBytes,
    [downlinkGetArchiveDaysMc.id]: downlinkGetArchiveDaysMc.toBytes,
    [downlinkGetArchiveHoursMc.id]: downlinkGetArchiveHoursMc.toBytes,
    [downlinkGetCurrentMc.id]: downlinkGetCurrentMc.toBytes,
    [downlinkGetParameter.id]: downlinkGetParameter.toBytes,
    [downlinkGetStatus.id]: downlinkGetStatus.toBytes,
    [downlinkGetTime2000.id]: downlinkGetTime2000.toBytes,
    [downlinkSetParameter.id]: downlinkSetParameter.toBytes,
    [downlinkSetTime2000.id]: downlinkSetTime2000.toBytes
};

const fromBytesMap = {
    [uplinkCorrectTime2000.id]: uplinkCorrectTime2000.fromBytes,
    [uplinkCurrentMc.id]: uplinkCurrentMc.fromBytes,
    [uplinkDayMc.id]: uplinkDayMc.fromBytes,
    [uplinkGetArchiveDaysMc.id]: uplinkGetArchiveDaysMc.fromBytes,
    [uplinkGetArchiveHoursMc.id]: uplinkGetArchiveHoursMc.fromBytes,
    [uplinkGetParameter.id]: uplinkGetParameter.fromBytes,
    [uplinkHourMc.id]: uplinkHourMc.fromBytes,
    [uplinkNewEvent.id]: uplinkNewEvent.fromBytes,
    [uplinkSetParameter.id]: uplinkSetParameter.fromBytes,
    [uplinkSetTime2000.id]: uplinkSetTime2000.fromBytes,
    [uplinkStatus.id]: uplinkStatus.fromBytes,
    [uplinkTime2000.id]: uplinkTime2000.fromBytes
};


// partial command set
fromBytes = getFromBytes(fromBytesMap, uplinkNames);
toBytes = getToBytes(toBytesMap);
