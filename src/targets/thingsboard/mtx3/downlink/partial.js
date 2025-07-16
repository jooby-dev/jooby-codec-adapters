import './polyfills.js';

import {getToBytes} from 'jooby-codec/mtx1/message/wrappers.js';

import * as getEventStatus from 'jooby-codec/mtx1/commands/downlink/getEventStatus.js';
import * as getEnergyDayPrevious from 'jooby-codec/mtx1/commands/downlink/getEnergyDayPrevious.js';
import * as getDeviceType from 'jooby-codec/mtx1/commands/downlink/getDeviceType.js';
import * as getDeviceId from 'jooby-codec/mtx1/commands/downlink/getDeviceId.js';
import * as getDateTime from 'jooby-codec/mtx1/commands/downlink/getDateTime.js';
import * as setDateTime from 'jooby-codec/mtx1/commands/downlink/setDateTime.js';
import * as getEnergy from 'jooby-codec/mtx1/commands/downlink/getEnergy.js';
import * as getHalfHourDemand from 'jooby-codec/mtx1/commands/downlink/getHalfHourDemand.js';
import * as getDayDemand from 'jooby-codec/mtx3/commands/downlink/getDayDemand.js';
import * as getVersion from 'jooby-codec/mtx1/commands/downlink/getVersion.js';
import * as getCriticalEvent from 'jooby-codec/mtx3/commands/downlink/getCriticalEvent.js';
import * as getDemand from 'jooby-codec/mtx3/commands/downlink/getDemand.js';

import * as utils from 'jooby-codec/utils';
import * as dataSegment from '../../../../utils/dataSegment.js';


const toBytesMap = {
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
toBytes = getToBytes(toBytesMap);
getBase64FromBytes = utils.getBase64FromBytes;
setDataSegment = dataSegment.set;
