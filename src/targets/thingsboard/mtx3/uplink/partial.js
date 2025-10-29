import {getFromBytes} from 'jooby-codec/mtx1/message/wrappers.js';
import uplinkNames from 'jooby-codec/mtx3/constants/uplinkNames.js';

import * as getEventStatus from 'jooby-codec/mtx1/commands/uplink/getEventStatus.js';
import * as getEnergyDayPrevious from 'jooby-codec/mtx1/commands/uplink/getEnergyDayPrevious.js';
import * as getDeviceType from 'jooby-codec/mtx1/commands/uplink/getDeviceType.js';
import * as getDeviceId from 'jooby-codec/mtx1/commands/uplink/getDeviceId.js';
import * as getDateTime from 'jooby-codec/mtx1/commands/uplink/getDateTime.js';
import * as setDateTime from 'jooby-codec/mtx1/commands/uplink/setDateTime.js';
import * as getEnergy from 'jooby-codec/mtx1/commands/uplink/getEnergy.js';
import * as getHalfHourDemand from 'jooby-codec/mtx1/commands/uplink/getHalfHourDemand.js';
import * as getDayDemand from 'jooby-codec/mtx3/commands/uplink/getDayDemand.js';
import * as getVersion from 'jooby-codec/mtx1/commands/uplink/getVersion.js';
import * as getCriticalEvent from 'jooby-codec/mtx3/commands/uplink/getCriticalEvent.js';
import * as getDemand from 'jooby-codec/mtx3/commands/uplink/getDemand.js';

import * as dataSegment from '../../../../utils/dataSegment.js';


const fromBytesMap = {
    [getEventStatus.id]: getEventStatus.toBytes,
    [getEnergyDayPrevious.id]: getEnergyDayPrevious.toBytes,
    [getDeviceType.id]: getDeviceType.toBytes,
    [getDeviceId.id]: getDeviceId.toBytes,
    [getDateTime.id]: getDateTime.toBytes,
    [setDateTime.id]: setDateTime.toBytes,
    [getEnergy.id]: getEnergy.toBytes,
    [getHalfHourDemand.id]: getHalfHourDemand.toBytes,
    [getDayDemand.id]: getDayDemand.toBytes,
    [getVersion.id]: getVersion.toBytes,
    [getCriticalEvent.id]: getCriticalEvent.toBytes,
    [getDemand.id]: getDemand.toBytes
};


// partial command set
fromBytes = getFromBytes(fromBytesMap, uplinkNames);
getDataSegment = dataSegment.get;
