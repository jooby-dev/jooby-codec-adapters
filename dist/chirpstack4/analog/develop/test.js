(function () {
    'use strict';

    const hexFormatOptions = {
        separator: ' ',
        prefix: ''
    };

    const INT8_SIZE = 1;
    const INT16_SIZE = 2;
    const INT24_SIZE = 3;
    const INT32_SIZE = 4;
    const { log, pow, LN2 } = Math;
    const readFloat = (buffer, offset, isLittleEndian, mLen, bytes) => {
        var e, m, eLen = bytes * 8 - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i = isLittleEndian ? bytes - 1 : 0, d = isLittleEndian ? -1 : 1, s = buffer[offset + i];
        i += d;
        e = s & ((1 << (-nBits)) - 1);
        s >>= (-nBits);
        nBits += eLen;
        for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8)
            ;
        m = e & ((1 << (-nBits)) - 1);
        e >>= (-nBits);
        nBits += mLen;
        for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8)
            ;
        if (e === 0) {
            e = 1 - eBias;
        }
        else if (e === eMax) {
            return m ? NaN : s ? -Infinity : Infinity;
        }
        else {
            m = m + pow(2, mLen);
            e = e - eBias;
        }
        return (s ? -1 : 1) * m * pow(2, e - mLen);
    };
    const writeFloat = (buffer, offset, value, isLittleEndian, mLen, bytes) => {
        var e, m, c, eLen = bytes * 8 - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = (mLen === 23 ? pow(2, -24) - pow(2, -77) : 0), i = isLittleEndian ? 0 : bytes - 1, d = isLittleEndian ? 1 : -1, s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
        value < 0 && (value = -value);
        if (value !== value || value === Infinity) {
            m = value !== value ? 1 : 0;
            e = eMax;
        }
        else {
            e = (log(value) / LN2) | 0;
            if (value * (c = pow(2, -e)) < 1) {
                e--;
                c *= 2;
            }
            if (e + eBias >= 1) {
                value += rt / c;
            }
            else {
                value += rt * pow(2, 1 - eBias);
            }
            if (value * c >= 2) {
                e++;
                c /= 2;
            }
            if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
            }
            else if (e + eBias >= 1) {
                m = (value * c - 1) * pow(2, mLen);
                e = e + eBias;
            }
            else {
                m = value * pow(2, eBias - 1) * pow(2, mLen);
                e = 0;
            }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 0x100, mLen -= 8)
            ;
        e = (e << mLen) | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 0x100, eLen -= 8)
            ;
        buffer[offset + i - d] |= s * 0x80;
    };
    const be2 = [1, 0];
    const be3 = [2, 1, 0];
    const be4 = [3, 2, 1, 0];
    const le2 = [0, 1];
    const le3 = [0, 1, 2];
    const le4 = [0, 1, 2, 3];
    const readUint8 = (buffer, offset) => buffer[offset];
    const readUint16 = (buffer, offset, isLittleEndian) => {
        const order = isLittleEndian ? le2 : be2;
        const b0 = buffer[offset + order[0]];
        const b1 = buffer[offset + order[1]] << 8;
        return b0 | b1;
    };
    const readUint24 = (buffer, offset, isLittleEndian) => {
        const order = isLittleEndian ? le3 : be3;
        const b0 = buffer[offset + order[0]];
        const b1 = buffer[offset + order[1]] << 8;
        const b2 = buffer[offset + order[2]] << 16;
        return b0 | b1 | b2;
    };
    const readUint32 = (buffer, offset, isLittleEndian) => {
        const order = isLittleEndian ? le4 : be4;
        const b0 = buffer[offset + order[3]] * 0x1000000;
        const b1 = buffer[offset + order[2]] * 0x10000;
        const b2 = buffer[offset + order[1]] * 0x100;
        const b3 = buffer[offset + order[0]];
        return b0 + b1 + b2 + b3;
    };
    const writeUint8 = (buffer, offset, value) => {
        buffer[offset] = value & 0xff;
    };
    const writeUint16 = (buffer, offset, value, isLittleEndian) => {
        const order = isLittleEndian ? le2 : be2;
        buffer[offset + order[0]] = value & 0xff;
        buffer[offset + order[1]] = value >>> 8 & 0xff;
    };
    const writeUint24 = (buffer, offset, value, isLittleEndian) => {
        const order = isLittleEndian ? le3 : be3;
        buffer[offset + order[0]] = value & 0xff;
        buffer[offset + order[1]] = value >>> 8 & 0xff;
        buffer[offset + order[2]] = value >>> 16 & 0xff;
    };
    const writeUint32 = (buffer, offset, value, isLittleEndian) => {
        const order = isLittleEndian ? le4 : be4;
        buffer[offset + order[0]] = value & 0xff;
        buffer[offset + order[1]] = value >>> 8 & 0xff;
        buffer[offset + order[2]] = value >>> 16 & 0xff;
        buffer[offset + order[3]] = value >>> 24 & 0xff;
    };
    function BinaryBuffer(dataOrLength, isLittleEndian = true) {
        if (typeof dataOrLength === 'number') {
            const bytes = new Array(dataOrLength).fill(0);
            this.data = bytes;
        }
        else {
            this.data = dataOrLength;
        }
        this.offset = 0;
        this.isLittleEndian = isLittleEndian;
    }
    BinaryBuffer.prototype = {
        toUint8Array() {
            return this.data;
        },
        seek(position) {
            if (position < 0 || position >= this.data.length) {
                throw new Error('Invalid position.');
            }
            this.offset = position;
        },
        setInt8(value) {
            writeUint8(this.data, this.offset, value < 0 ? value | 0x100 : value);
            this.offset += INT8_SIZE;
        },
        getInt8() {
            const result = readUint8(this.data, this.offset);
            this.offset += INT8_SIZE;
            return result & 0x80 ? result ^ -256 : result;
        },
        setUint8(value) {
            writeUint8(this.data, this.offset, value);
            this.offset += INT8_SIZE;
        },
        getUint8() {
            const result = readUint8(this.data, this.offset);
            this.offset += INT8_SIZE;
            return result;
        },
        setInt16(value, isLittleEndian = this.isLittleEndian) {
            writeUint16(this.data, this.offset, value < 0 ? value | 0x10000 : value, isLittleEndian);
            this.offset += INT16_SIZE;
        },
        getInt16(isLittleEndian = this.isLittleEndian) {
            const result = readUint16(this.data, this.offset, isLittleEndian);
            this.offset += INT16_SIZE;
            return result & 0x8000 ? result ^ -65536 : result;
        },
        setUint16(value, isLittleEndian = this.isLittleEndian) {
            writeUint16(this.data, this.offset, value, isLittleEndian);
            this.offset += INT16_SIZE;
        },
        getUint16(isLittleEndian = this.isLittleEndian) {
            const result = readUint16(this.data, this.offset, isLittleEndian);
            this.offset += INT16_SIZE;
            return result;
        },
        setInt24(value, isLittleEndian = this.isLittleEndian) {
            writeUint24(this.data, this.offset, value < 0 ? value | 0x1000000 : value, isLittleEndian);
            this.offset += INT24_SIZE;
        },
        getInt24(isLittleEndian = this.isLittleEndian) {
            const result = readUint24(this.data, this.offset, isLittleEndian);
            this.offset += INT24_SIZE;
            return result & 0x800000 ? result ^ -16777216 : result;
        },
        setUint24(value, isLittleEndian = this.isLittleEndian) {
            writeUint24(this.data, this.offset, value, isLittleEndian);
            this.offset += INT24_SIZE;
        },
        getUint24(isLittleEndian = this.isLittleEndian) {
            const result = readUint24(this.data, this.offset, isLittleEndian);
            this.offset += INT24_SIZE;
            return result;
        },
        setInt32(value, isLittleEndian = this.isLittleEndian) {
            writeUint32(this.data, this.offset, value < 0 ? value | 0x100000000 : value, isLittleEndian);
            this.offset += INT32_SIZE;
        },
        getInt32(isLittleEndian = this.isLittleEndian) {
            const result = readUint32(this.data, this.offset, isLittleEndian);
            this.offset += INT32_SIZE;
            return result & 0x80000000 ? result ^ -4294967296 : result;
        },
        setUint32(value, isLittleEndian = this.isLittleEndian) {
            writeUint32(this.data, this.offset, value, isLittleEndian);
            this.offset += INT32_SIZE;
        },
        getUint32(isLittleEndian = this.isLittleEndian) {
            const result = readUint32(this.data, this.offset, isLittleEndian);
            this.offset += INT32_SIZE;
            return result;
        },
        setFloat32(value, isLittleEndian = this.isLittleEndian) {
            writeFloat(this.data, this.offset, value, isLittleEndian, 23, 4);
            this.offset += INT32_SIZE;
        },
        getFloat32(isLittleEndian = this.isLittleEndian) {
            const result = readFloat(this.data, this.offset, isLittleEndian, 23, 4);
            this.offset += INT32_SIZE;
            return result;
        },
        setString(value) {
            this.setUint8(value.length);
            for (let index = 0; index < value.length; ++index) {
                this.setUint8(value.charCodeAt(index));
            }
        },
        getString() {
            const size = this.getUint8();
            const endIndex = this.offset + size;
            const chars = [];
            while (this.offset < endIndex) {
                chars.push(String.fromCharCode(this.getUint8()));
            }
            return chars.join('');
        },
        getBytesToOffset(offset = this.offset) {
            return this.data.slice(0, offset);
        },
        getBytesLeft() {
            return this.getBytes(this.bytesLeft);
        },
        getBytes(length, offset = this.offset) {
            this.offset = offset + length;
            return this.data.slice(offset, this.offset);
        },
        setBytes(data, offset = this.offset) {
            const bytes = this.data;
            bytes.splice(offset, data.length, ...data);
            this.data = bytes;
            this.offset = offset + data.length;
        }
    };
    Object.defineProperties(BinaryBuffer.prototype, {
        size: {
            get() {
                return this.data.length;
            }
        },
        isEmpty: {
            get() {
                if (this.offset > this.data.length) {
                    throw new Error(`current offset ${this.offset} is outside the bounds of the buffer`);
                }
                return this.data.length - this.offset === 0;
            }
        },
        bytesLeft: {
            get() {
                return this.data.length - this.offset;
            }
        },
        position: {
            get() {
                return this.offset;
            }
        }
    });

    const extraCommandMask = 0x1f;
    const toBytes$12 = (commandId, commandSize) => {
        if ((commandId & extraCommandMask) === 0) {
            if (commandSize > extraCommandMask) {
                throw new Error(`Wrong command id/size. Id: ${commandId}, size: ${commandSize}.`);
            }
            return [commandId | commandSize];
        }
        if (commandId > extraCommandMask) {
            return [
                extraCommandMask,
                (commandId >> 8),
                commandSize
            ];
        }
        return [
            commandId,
            commandSize
        ];
    };

    const toBytes$11 = (commandId, commandData = []) => {
        const headerData = toBytes$12(commandId, commandData.length);
        return [...headerData, ...commandData];
    };

    const setTime2000$3 = 0x02;
    const setParameter$3 = 0x03;
    const getParameter$3 = 0x04;
    const getArchiveHours$3 = 0x05;
    const getArchiveDays$3 = 0x06;
    const getCurrent$1 = 0x07;
    const getTime2000$1 = 0x09;
    const getArchiveEvents$3 = 0x0b;
    const correctTime2000$3 = 0x0c;
    const getStatus$1 = 0x14;
    const getCurrentMc$1 = 0x18;
    const softRestart$3 = 0x19;
    const getArchiveHoursMc$3 = 0x1a;
    const getArchiveDaysMc$3 = 0x1b;
    const dataSegment$3 = 0x1e;
    const getLmicInfo$3 = 0x21f;
    const getBatteryStatus$3 = 0x51f;
    const usWaterMeterCommand$3 = 0x71f;
    const getExAbsArchiveHoursMc$3 = 0xc1f;
    const getExAbsArchiveDaysMc$3 = 0xd1f;
    const getExAbsCurrentMc$1 = 0xf1f;
    const writeImage$3 = 0x2a1f;
    const verifyImage$3 = 0x2b1f;
    const updateRun$3 = 0x2c1f;
    const getArchiveHoursMcEx$3 = 0x301f;
    const getChannelsStatus$3 = 0x321f;
    const getChannelsTypes$3 = 0x331f;
    const getSignalQuality$1 = 0x341f;

    var downlinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000$3,
        dataSegment: dataSegment$3,
        getArchiveDays: getArchiveDays$3,
        getArchiveDaysMc: getArchiveDaysMc$3,
        getArchiveEvents: getArchiveEvents$3,
        getArchiveHours: getArchiveHours$3,
        getArchiveHoursMc: getArchiveHoursMc$3,
        getArchiveHoursMcEx: getArchiveHoursMcEx$3,
        getBatteryStatus: getBatteryStatus$3,
        getChannelsStatus: getChannelsStatus$3,
        getChannelsTypes: getChannelsTypes$3,
        getCurrent: getCurrent$1,
        getCurrentMc: getCurrentMc$1,
        getExAbsArchiveDaysMc: getExAbsArchiveDaysMc$3,
        getExAbsArchiveHoursMc: getExAbsArchiveHoursMc$3,
        getExAbsCurrentMc: getExAbsCurrentMc$1,
        getLmicInfo: getLmicInfo$3,
        getParameter: getParameter$3,
        getSignalQuality: getSignalQuality$1,
        getStatus: getStatus$1,
        getTime2000: getTime2000$1,
        setParameter: setParameter$3,
        setTime2000: setTime2000$3,
        softRestart: softRestart$3,
        updateRun: updateRun$3,
        usWaterMeterCommand: usWaterMeterCommand$3,
        verifyImage: verifyImage$3,
        writeImage: writeImage$3
    });

    var invertObject = (source) => {
        const target = {};
        for (const property in source) {
            const value = source[property];
            target[value] = property;
        }
        return target;
    };

    var commandNames$1 = invertObject(downlinkIds);

    const id$10 = correctTime2000$3;
    const name$10 = commandNames$1[correctTime2000$3];
    const headerSize$10 = 2;
    const COMMAND_BODY_SIZE$y = 2;
    const examples$10 = {
        'correct time 120 seconds to the past': {
            id: id$10,
            name: name$10,
            headerSize: headerSize$10,
            parameters: { sequenceNumber: 45, seconds: -120 },
            bytes: [
                0x0c, 0x02,
                0x2d, 0x88
            ]
        },
        'correct time 95 seconds to the future': {
            id: id$10,
            name: name$10,
            headerSize: headerSize$10,
            parameters: { sequenceNumber: 46, seconds: 95 },
            bytes: [
                0x0c, 0x02,
                0x2e, 0x5f
            ]
        }
    };
    const fromBytes$10 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$y) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            seconds: buffer.getInt8()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$10 = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$y, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt8(seconds);
        return toBytes$11(id$10, buffer.data);
    };

    var correctTime2000$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$10,
        fromBytes: fromBytes$10,
        headerSize: headerSize$10,
        id: id$10,
        name: name$10,
        toBytes: toBytes$10
    });

    const fromObject = (bitMask = {}, booleanObject = {}) => {
        let result = 0;
        for (const name in booleanObject) {
            if (name in bitMask && booleanObject[name]) {
                result |= bitMask[name];
            }
        }
        return result;
    };
    const toObject = (bitMask = {}, value = 0) => {
        const result = {};
        for (const name in bitMask) {
            result[name] = (value & bitMask[name]) !== 0;
        }
        return result;
    };
    const extractBits = (value, bitsNumber, startIndex) => (((1 << bitsNumber) - 1) & (value >> (startIndex - 1)));
    const fillBits = (value, bitsNumber, startIndex, valueToSet) => {
        const mask = ((1 << bitsNumber) - 1) << (startIndex - 1);
        let newValueToSet = valueToSet;
        let result = value;
        result &= ~mask;
        newValueToSet <<= (startIndex - 1);
        result |= newValueToSet;
        return result;
    };

    var getHexFromBytes = (bytes, options = {}) => {
        const { separator, prefix } = Object.assign({}, hexFormatOptions, options);
        return bytes
            .map((byte) => `${prefix}${byte.toString(16).padStart(2, '0')}`)
            .join(separator);
    };

    var getBytesFromHex = (hex) => {
        let cleanHex = hex.trim();
        if (!cleanHex) {
            return [];
        }
        cleanHex = cleanHex
            .replace(/0x/g, '')
            .split(/\s+/)
            .map(byte => byte.padStart(2, '0'))
            .join('');
        if (cleanHex.length % 2 !== 0) {
            cleanHex = `0${cleanHex}`;
        }
        const resultLength = cleanHex.length / 2;
        const bytes = new Array(resultLength);
        for (let index = 0; index < resultLength; index++) {
            bytes[index] = parseInt(cleanHex.substring(index * 2, index * 2 + 2), 16);
        }
        return bytes;
    };

    var roundNumber = (value, decimalPlaces = 4) => {
        const places = Math.pow(10, decimalPlaces);
        return Math.round((value * places) * (1 + Number.EPSILON)) / places;
    };

    const INITIAL_YEAR_TIMESTAMP = 946684800000;
    const MILLISECONDS_IN_SECONDS = 1000;
    const getDateFromTime2000 = (time2000) => new Date(INITIAL_YEAR_TIMESTAMP + (time2000 * MILLISECONDS_IN_SECONDS));
    const getTime2000FromDate = (date) => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;

    const GASI1 = 1;
    const GASI2 = 2;
    const GASI3 = 3;
    const NOVATOR = 4;
    const IMP2EU = 5;
    const IMP4EU = 6;
    const MTXLORA = 7;
    const IMP2AS = 8;
    const IMP2IN = 9;
    const IMP4IN = 10;
    const ELIMP = 11;
    const GASIC = 12;
    const US_WATER = 13;
    const PLC2LORA = 14;
    const LORA = 21;
    const NBIOT = 24;

    const REPORTING_DATA_INTERVAL = 1;
    const DAY_CHECKOUT_HOUR = 4;
    const REPORTING_DATA_TYPE = 5;
    const PRIORITY_DATA_DELIVERY_TYPE = 8;
    const ACTIVATION_METHOD = 9;
    const BATTERY_DEPASSIVATION_INFO = 10;
    const BATTERY_MINIMAL_LOAD_TIME = 11;
    const CHANNELS_CONFIG = 13;
    const RX2_CONFIG = 18;
    const ABSOLUTE_DATA = 23;
    const ABSOLUTE_DATA_ENABLE = 24;
    const SERIAL_NUMBER = 25;
    const GEOLOCATION = 26;
    const EXTRA_FRAME_INTERVAL = 28;
    const ABSOLUTE_DATA_MULTI_CHANNEL = 29;
    const ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL = 30;
    const PULSE_CHANNELS_SCAN_CONFIG = 31;
    const PULSE_CHANNELS_SET_CONFIG = 32;
    const BATTERY_DEPASSIVATION_CONFIG = 33;
    const MQTT_SESSION_CONFIG = 34;
    const MQTT_BROKER_ADDRESS = 35;
    const MQTT_SSL_ENABLE = 36;
    const MQTT_TOPIC_PREFIX = 37;
    const MQTT_DATA_RECEIVE_CONFIG = 38;
    const MQTT_DATA_SEND_CONFIG = 39;
    const NBIOT_SSL_CONFIG = 40;
    const NBIOT_SSL_CACERT_WRITE = 41;
    const NBIOT_SSL_CACERT_SET = 42;
    const NBIOT_SSL_CLIENT_CERT_WRITE = 43;
    const NBIOT_SSL_CLIENT_CERT_SET = 44;
    const NBIOT_SSL_CLIENT_KEY_WRITE = 45;
    const NBIOT_SSL_CLIENT_KEY_SET = 46;
    const NBIOT_DEVICE_SOFTWARE_UPDATE = 47;
    const NBIOT_MODULE_FIRMWARE_UPDATE = 48;
    const REPORTING_DATA_CONFIG = 49;
    const EVENTS_CONFIG = 50;
    const NBIOT_MODULE_INFO = 51;
    const NBIOT_BANDS = 52;
    const NBIOT_APN = 53;
    const NBIOT_LED_INDICATION = 54;
    const NBIOT_SIM = 55;
    const CHANNEL_TYPE = 56;
    const EXTRA_PAYLOAD_ENABLE = 57;
    const TIME_SYNCHRONIZATION_PERIOD_VIA_MAC = 58;
    const KEEP_LORA_CONNECTION_ON_REMOVAL = 59;

    var deviceParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ABSOLUTE_DATA: ABSOLUTE_DATA,
        ABSOLUTE_DATA_ENABLE: ABSOLUTE_DATA_ENABLE,
        ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL: ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
        ABSOLUTE_DATA_MULTI_CHANNEL: ABSOLUTE_DATA_MULTI_CHANNEL,
        ACTIVATION_METHOD: ACTIVATION_METHOD,
        BATTERY_DEPASSIVATION_CONFIG: BATTERY_DEPASSIVATION_CONFIG,
        BATTERY_DEPASSIVATION_INFO: BATTERY_DEPASSIVATION_INFO,
        BATTERY_MINIMAL_LOAD_TIME: BATTERY_MINIMAL_LOAD_TIME,
        CHANNELS_CONFIG: CHANNELS_CONFIG,
        CHANNEL_TYPE: CHANNEL_TYPE,
        DAY_CHECKOUT_HOUR: DAY_CHECKOUT_HOUR,
        EVENTS_CONFIG: EVENTS_CONFIG,
        EXTRA_FRAME_INTERVAL: EXTRA_FRAME_INTERVAL,
        EXTRA_PAYLOAD_ENABLE: EXTRA_PAYLOAD_ENABLE,
        GEOLOCATION: GEOLOCATION,
        KEEP_LORA_CONNECTION_ON_REMOVAL: KEEP_LORA_CONNECTION_ON_REMOVAL,
        MQTT_BROKER_ADDRESS: MQTT_BROKER_ADDRESS,
        MQTT_DATA_RECEIVE_CONFIG: MQTT_DATA_RECEIVE_CONFIG,
        MQTT_DATA_SEND_CONFIG: MQTT_DATA_SEND_CONFIG,
        MQTT_SESSION_CONFIG: MQTT_SESSION_CONFIG,
        MQTT_SSL_ENABLE: MQTT_SSL_ENABLE,
        MQTT_TOPIC_PREFIX: MQTT_TOPIC_PREFIX,
        NBIOT_APN: NBIOT_APN,
        NBIOT_BANDS: NBIOT_BANDS,
        NBIOT_DEVICE_SOFTWARE_UPDATE: NBIOT_DEVICE_SOFTWARE_UPDATE,
        NBIOT_LED_INDICATION: NBIOT_LED_INDICATION,
        NBIOT_MODULE_FIRMWARE_UPDATE: NBIOT_MODULE_FIRMWARE_UPDATE,
        NBIOT_MODULE_INFO: NBIOT_MODULE_INFO,
        NBIOT_SIM: NBIOT_SIM,
        NBIOT_SSL_CACERT_SET: NBIOT_SSL_CACERT_SET,
        NBIOT_SSL_CACERT_WRITE: NBIOT_SSL_CACERT_WRITE,
        NBIOT_SSL_CLIENT_CERT_SET: NBIOT_SSL_CLIENT_CERT_SET,
        NBIOT_SSL_CLIENT_CERT_WRITE: NBIOT_SSL_CLIENT_CERT_WRITE,
        NBIOT_SSL_CLIENT_KEY_SET: NBIOT_SSL_CLIENT_KEY_SET,
        NBIOT_SSL_CLIENT_KEY_WRITE: NBIOT_SSL_CLIENT_KEY_WRITE,
        NBIOT_SSL_CONFIG: NBIOT_SSL_CONFIG,
        PRIORITY_DATA_DELIVERY_TYPE: PRIORITY_DATA_DELIVERY_TYPE,
        PULSE_CHANNELS_SCAN_CONFIG: PULSE_CHANNELS_SCAN_CONFIG,
        PULSE_CHANNELS_SET_CONFIG: PULSE_CHANNELS_SET_CONFIG,
        REPORTING_DATA_CONFIG: REPORTING_DATA_CONFIG,
        REPORTING_DATA_INTERVAL: REPORTING_DATA_INTERVAL,
        REPORTING_DATA_TYPE: REPORTING_DATA_TYPE,
        RX2_CONFIG: RX2_CONFIG,
        SERIAL_NUMBER: SERIAL_NUMBER,
        TIME_SYNCHRONIZATION_PERIOD_VIA_MAC: TIME_SYNCHRONIZATION_PERIOD_VIA_MAC
    });

    var deviceParameterNames = invertObject(deviceParameters);

    const EMPTY_VALUE = 0xffffffff;

    const IDLE = 0;
    const POWER_CHANNEL = 2;
    const BINARY_SENSOR = 3;
    const TEMPERATURE_SENSOR = 4;

    var channelTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BINARY_SENSOR: BINARY_SENSOR,
        IDLE: IDLE,
        POWER_CHANNEL: POWER_CHANNEL,
        TEMPERATURE_SENSOR: TEMPERATURE_SENSOR
    });

    const SF12B125 = 0;
    const SF11B125 = 1;
    const SF10B125 = 2;
    const SF9B125 = 3;
    const SF8B125 = 4;
    const SF7B125 = 5;
    const SF7B250 = 6;

    var rx2SpreadFactors = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SF10B125: SF10B125,
        SF11B125: SF11B125,
        SF12B125: SF12B125,
        SF7B125: SF7B125,
        SF7B250: SF7B250,
        SF8B125: SF8B125,
        SF9B125: SF9B125
    });

    var spreadFactorNames = invertObject(rx2SpreadFactors);

    const INITIAL_YEAR = 2000;
    const MONTH_BIT_SIZE = 4;
    const DATE_BIT_SIZE = 5;
    const YEAR_START_INDEX = 1;
    const UNKNOWN_BATTERY_VOLTAGE = 4095;
    const EXTEND_BIT_MASK = 0x80;
    const LAST_BIT_INDEX = 7;
    const DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
    const PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
    const SERIAL_NUMBER_SIZE = 6;
    const MAGNETIC_INFLUENCE_BIT_INDEX = 8;
    const LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
    const LEGACY_HOUR_DIFF_SIZE = 2;
    const GAS_HARDWARE_TYPES = [
        GASI2,
        GASI3,
        GASI1,
        GASIC,
        NBIOT
    ];
    const TWO_CHANNELS_HARDWARE_TYPES = [
        IMP2AS,
        IMP2EU,
        IMP2IN,
        NOVATOR
    ];
    const ELIMP_HARDWARE_TYPES = [
        ELIMP
    ];
    const FOUR_CHANNELS_HARDWARE_TYPES = [
        IMP4EU,
        IMP4IN
    ];
    const MTX_HARDWARE_TYPES = [
        MTXLORA
    ];
    const TWO_BYTES_HARDWARE_TYPES = [...FOUR_CHANNELS_HARDWARE_TYPES, ...MTX_HARDWARE_TYPES];
    const gasBitMask = {
        isBatteryLow: Math.pow(2, 0),
        isMagneticInfluence: Math.pow(2, 1),
        isButtonReleased: Math.pow(2, 2),
        isConnectionLost: Math.pow(2, 3)
    };
    const twoChannelBitMask = {
        isBatteryLow: Math.pow(2, 0),
        isConnectionLost: Math.pow(2, 3),
        isFirstChannelInactive: Math.pow(2, 4),
        isSecondChannelInactive: Math.pow(2, 5)
    };
    const elimpBitMask = {
        isConnectionLost: Math.pow(2, 3)
    };
    const fourChannelBitMask = {
        isBatteryLow: Math.pow(2, 0),
        isConnectionLost: Math.pow(2, 3),
        isFirstChannelInactive: Math.pow(2, 4),
        isSecondChannelInactive: Math.pow(2, 5),
        isThirdChannelInactive: Math.pow(2, 6),
        isForthChannelInactive: Math.pow(2, 8)
    };
    const mtxBitMask = {
        isMeterCaseOpen: Math.pow(2, 0),
        isMagneticInfluence: Math.pow(2, 1),
        isParametersSetRemotely: Math.pow(2, 2),
        isParametersSetLocally: Math.pow(2, 3),
        isMeterProgramRestarted: Math.pow(2, 4),
        isLockedOut: Math.pow(2, 5),
        isTimeSet: Math.pow(2, 6),
        isTimeCorrected: Math.pow(2, 7),
        isMeterFailure: Math.pow(2, 8),
        isMeterTerminalBoxOpen: Math.pow(2, 9),
        isModuleCompartmentOpen: Math.pow(2, 10),
        isTariffPlanChanged: Math.pow(2, 11),
        isNewTariffPlanReceived: Math.pow(2, 12)
    };
    const usWaterMeterEventBitMask = {
        transportMode: 0x01,
        frequencyOutput: 0x02,
        reverseFlow: 0x04,
        tamperBreak: 0x08,
        leakage: 0x10,
        pipeBreak: 0x20,
        pipeEmpty: 0x40,
        batteryDischarge: 0x80
    };
    const getChannelTypeSize = ({ type }) => {
        let size = 1;
        switch (type) {
            case IDLE:
            case POWER_CHANNEL:
                break;
            case BINARY_SENSOR:
                size += 2;
                break;
            case TEMPERATURE_SENSOR:
                size += 5;
                break;
        }
        return size;
    };
    const parametersSizeMap = {
        [REPORTING_DATA_INTERVAL]: 1 + 4,
        [DAY_CHECKOUT_HOUR]: 1 + 1,
        [REPORTING_DATA_TYPE]: 1 + 1,
        [PRIORITY_DATA_DELIVERY_TYPE]: 1 + 1,
        [ACTIVATION_METHOD]: 1 + 1,
        [BATTERY_DEPASSIVATION_INFO]: 1 + 6,
        [BATTERY_MINIMAL_LOAD_TIME]: 1 + 4,
        [CHANNELS_CONFIG]: 1 + 1,
        [RX2_CONFIG]: 1 + 4,
        [ABSOLUTE_DATA]: 1 + 9,
        [ABSOLUTE_DATA_ENABLE]: 1 + 1,
        [SERIAL_NUMBER]: 1 + 6,
        [GEOLOCATION]: 1 + 10,
        [EXTRA_FRAME_INTERVAL]: 1 + 2,
        [ABSOLUTE_DATA_MULTI_CHANNEL]: 1 + 10,
        [ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: 1 + 2,
        [PULSE_CHANNELS_SCAN_CONFIG]: 1 + 3,
        [PULSE_CHANNELS_SET_CONFIG]: 1 + 1,
        [BATTERY_DEPASSIVATION_CONFIG]: 1 + 4,
        [MQTT_SSL_ENABLE]: 1 + 1,
        [MQTT_DATA_RECEIVE_CONFIG]: 1 + 3,
        [MQTT_DATA_SEND_CONFIG]: 1 + 3,
        [NBIOT_SSL_CONFIG]: 1 + 2,
        [NBIOT_SSL_CACERT_SET]: 1 + 4,
        [NBIOT_SSL_CLIENT_CERT_SET]: 1 + 4,
        [NBIOT_SSL_CLIENT_KEY_SET]: 1 + 4,
        [REPORTING_DATA_CONFIG]: 1 + 4,
        [EVENTS_CONFIG]: 1 + 3,
        [NBIOT_LED_INDICATION]: 1 + 2,
        [NBIOT_SIM]: 1 + 3,
        [EXTRA_PAYLOAD_ENABLE]: 1 + 1,
        [TIME_SYNCHRONIZATION_PERIOD_VIA_MAC]: 1 + 4,
        [KEEP_LORA_CONNECTION_ON_REMOVAL]: 1 + 1
    };
    const fourChannelsBitMask = {
        channel1: Math.pow(2, 0),
        channel2: Math.pow(2, 1),
        channel3: Math.pow(2, 2),
        channel4: Math.pow(2, 3)
    };
    const getChannelsMaskFromNumber = (value) => {
        const object = toObject(fourChannelsBitMask, value);
        return { channel1: object.channel1, channel2: object.channel2, channel3: object.channel3, channel4: object.channel4 };
    };
    const setChannelsMaskToNumber = (channelsMask) => {
        const { channel1, channel2, channel3, channel4 } = channelsMask;
        return fromObject(fourChannelsBitMask, { channel1, channel2, channel3, channel4 });
    };
    const getChannelsMask = (buffer) => getChannelsMaskFromNumber(buffer.getUint8());
    const setChannelsMask = (buffer, channelsMask) => (buffer.setUint8(setChannelsMaskToNumber(channelsMask)));
    const byteToPulseCoefficientMap = {
        128: 1,
        129: 5,
        130: 10,
        131: 100,
        132: 1000,
        133: 10000,
        134: 100000
    };
    const pulseCoefficientToByteMap = invertObject(byteToPulseCoefficientMap);
    const isMSBSet = (value) => !!(value & 0x80);
    const getNbiotSslWrite = (buffer) => ({
        size: buffer.getUint16(),
        position: buffer.getUint16(),
        chunk: buffer.getBytesLeft()
    });
    const setNbiotSslWrite = (buffer, parameter) => {
        if (parameter.size !== parameter.chunk.length) {
            throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
        }
        buffer.setUint16(parameter.size);
        buffer.setUint16(parameter.position);
        buffer.setBytes(parameter.chunk);
    };
    const getNbiotSslSet = (buffer) => ({ crc32: buffer.getUint32() });
    const setNbiotSslSet = (buffer, parameter) => {
        buffer.setUint32(parameter.crc32);
    };
    const deviceParameterConvertersMap = {
        [REPORTING_DATA_INTERVAL]: {
            get: (buffer) => ({
                specialSchedulePeriod: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT,
                firstDaysSpecialSchedule: buffer.getUint8(),
                lastDaysSpecialSchedule: buffer.getUint8(),
                period: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.specialSchedulePeriod / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
                buffer.setUint8(parameter.firstDaysSpecialSchedule);
                buffer.setUint8(parameter.lastDaysSpecialSchedule);
                buffer.setUint8(parameter.period / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
            }
        },
        [DAY_CHECKOUT_HOUR]: {
            get: (buffer) => ({
                value: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.value);
            }
        },
        [REPORTING_DATA_TYPE]: {
            get: (buffer) => ({
                type: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.type);
            }
        },
        [PRIORITY_DATA_DELIVERY_TYPE]: {
            get: (buffer) => ({ value: buffer.getUint8() }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.value);
            }
        },
        [ACTIVATION_METHOD]: {
            get: (buffer) => ({
                type: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.type);
            }
        },
        [BATTERY_DEPASSIVATION_INFO]: {
            get: (buffer) => ({
                loadTime: buffer.getUint16(),
                internalResistance: buffer.getUint16(),
                lowVoltage: buffer.getUint16()
            }),
            set: (buffer, parameter) => {
                buffer.setUint16(parameter.loadTime);
                buffer.setUint16(parameter.internalResistance);
                buffer.setUint16(parameter.lowVoltage);
            }
        },
        [BATTERY_MINIMAL_LOAD_TIME]: {
            get: (buffer) => ({
                value: buffer.getUint32()
            }),
            set: (buffer, parameter) => {
                buffer.setUint32(parameter.value);
            }
        },
        [CHANNELS_CONFIG]: {
            get: (buffer) => ({ value: buffer.getUint8() }),
            set: (buffer, parameter) => {
                if (parameter.value < 0 || parameter.value > 18) {
                    throw new Error('channels config must be between 0-18');
                }
                buffer.setUint8(parameter.value);
            }
        },
        [RX2_CONFIG]: {
            get: (buffer) => {
                const spreadFactor = buffer.getUint8();
                const spreadFactorName = spreadFactorNames[spreadFactor];
                const frequency = buffer.getUint24() * PARAMETER_RX2_FREQUENCY_COEFFICIENT;
                return { spreadFactor, spreadFactorName, frequency };
            },
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.spreadFactor);
                buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT);
            }
        },
        [ABSOLUTE_DATA]: {
            get: (buffer) => ({
                meterValue: buffer.getUint32(),
                pulseCoefficient: buffer.getPulseCoefficient(),
                value: buffer.getUint32()
            }),
            set: (buffer, parameter) => {
                buffer.setUint32(parameter.meterValue);
                buffer.setPulseCoefficient(parameter.pulseCoefficient);
                buffer.setUint32(parameter.value);
            }
        },
        [ABSOLUTE_DATA_ENABLE]: {
            get: (buffer) => ({ state: buffer.getUint8() }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.state);
            }
        },
        [SERIAL_NUMBER]: {
            get: (buffer) => ({
                value: getHexFromBytes(buffer.getBytes(SERIAL_NUMBER_SIZE))
            }),
            set: (buffer, parameter) => {
                getBytesFromHex(parameter.value).forEach(byte => buffer.setUint8(byte));
            }
        },
        [GEOLOCATION]: {
            get: (buffer) => ({
                latitude: roundNumber(buffer.getFloat32()),
                longitude: roundNumber(buffer.getFloat32()),
                altitude: roundNumber(buffer.getUint16())
            }),
            set: (buffer, parameter) => {
                buffer.setFloat32(roundNumber(parameter.latitude));
                buffer.setFloat32(roundNumber(parameter.longitude));
                buffer.setUint16(roundNumber(parameter.altitude));
            }
        },
        [EXTRA_FRAME_INTERVAL]: {
            get: (buffer) => ({ value: buffer.getUint16() }),
            set: (buffer, parameter) => {
                buffer.setUint16(parameter.value);
            }
        },
        [ABSOLUTE_DATA_MULTI_CHANNEL]: {
            get: (buffer) => ({
                channel: buffer.getChannelValue(),
                meterValue: buffer.getUint32(),
                pulseCoefficient: buffer.getPulseCoefficient(),
                value: buffer.getUint32()
            }),
            set: (buffer, parameter) => {
                buffer.setChannelValue(parameter.channel);
                buffer.setUint32(parameter.meterValue);
                buffer.setPulseCoefficient(parameter.pulseCoefficient);
                buffer.setUint32(parameter.value);
            }
        },
        [ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: {
            get: (buffer) => ({
                channel: buffer.getChannelValue(),
                state: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setChannelValue(parameter.channel);
                buffer.setUint8(parameter.state);
            }
        },
        [PULSE_CHANNELS_SCAN_CONFIG]: {
            get: (buffer) => ({
                channelList: buffer.getChannels(),
                pullUpTime: buffer.getUint8(),
                scanTime: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                if (parameter.pullUpTime < 17) {
                    throw new Error('minimal value for pullUpTime - 17');
                }
                if (parameter.scanTime < 15) {
                    throw new Error('minimal value for scanTime - 15');
                }
                buffer.setChannels(parameter.channelList.map(index => ({ index })));
                buffer.setUint8(parameter.pullUpTime);
                buffer.setUint8(parameter.scanTime);
            }
        },
        [PULSE_CHANNELS_SET_CONFIG]: {
            get: getChannelsMask,
            set: setChannelsMask
        },
        [BATTERY_DEPASSIVATION_CONFIG]: {
            get: (buffer) => ({
                resistanceStartThreshold: buffer.getUint16(),
                resistanceStopThreshold: buffer.getUint16()
            }),
            set: (buffer, parameter) => {
                buffer.setUint16(parameter.resistanceStartThreshold);
                buffer.setUint16(parameter.resistanceStopThreshold);
            }
        },
        [MQTT_SESSION_CONFIG]: {
            get: (buffer) => ({
                clientId: buffer.getString(),
                username: buffer.getString(),
                password: buffer.getString(),
                cleanSession: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.clientId);
                buffer.setString(parameter.username);
                buffer.setString(parameter.password);
                buffer.setUint8(parameter.cleanSession);
            }
        },
        [MQTT_BROKER_ADDRESS]: {
            get: (buffer) => ({
                hostName: buffer.getString(),
                port: buffer.getUint16()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.hostName);
                buffer.setUint16(parameter.port);
            }
        },
        [MQTT_SSL_ENABLE]: {
            get: (buffer) => ({
                enable: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.enable);
            }
        },
        [MQTT_TOPIC_PREFIX]: {
            get: (buffer) => ({
                topicPrefix: buffer.getString()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.topicPrefix);
            }
        },
        [MQTT_DATA_RECEIVE_CONFIG]: {
            get: (buffer) => ({
                qos: buffer.getUint8(),
                count: buffer.getUint8(),
                timeout: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.qos);
                buffer.setUint8(parameter.count);
                buffer.setUint8(parameter.timeout);
            }
        },
        [MQTT_DATA_SEND_CONFIG]: {
            get: (buffer) => ({
                qos: buffer.getUint8(),
                retain: buffer.getUint8(),
                newestSendFirst: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.qos);
                buffer.setUint8(parameter.retain);
                buffer.setUint8(parameter.newestSendFirst);
            }
        },
        [NBIOT_SSL_CONFIG]: {
            get: (buffer) => ({
                securityLevel: buffer.getUint8(),
                version: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.securityLevel);
                buffer.setUint8(parameter.version);
            }
        },
        [NBIOT_SSL_CACERT_WRITE]: {
            get: getNbiotSslWrite,
            set: setNbiotSslWrite
        },
        [NBIOT_SSL_CACERT_SET]: {
            get: getNbiotSslSet,
            set: setNbiotSslSet
        },
        [NBIOT_SSL_CLIENT_CERT_WRITE]: {
            get: getNbiotSslWrite,
            set: setNbiotSslWrite
        },
        [NBIOT_SSL_CLIENT_CERT_SET]: {
            get: getNbiotSslSet,
            set: setNbiotSslSet
        },
        [NBIOT_SSL_CLIENT_KEY_WRITE]: {
            get: getNbiotSslWrite,
            set: setNbiotSslWrite
        },
        [NBIOT_SSL_CLIENT_KEY_SET]: {
            get: getNbiotSslSet,
            set: setNbiotSslSet
        },
        [NBIOT_DEVICE_SOFTWARE_UPDATE]: {
            get: (buffer) => ({
                softwareImageUrl: buffer.getString()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.softwareImageUrl);
            }
        },
        [NBIOT_MODULE_FIRMWARE_UPDATE]: {
            get: (buffer) => ({
                moduleFirmwareImageUrl: buffer.getString()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.moduleFirmwareImageUrl);
            }
        },
        [REPORTING_DATA_CONFIG]: {
            get: (buffer) => ({
                dataType: buffer.getUint8(),
                hour: buffer.getUint8(),
                minutes: buffer.getUint8(),
                countToSend: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.dataType);
                buffer.setUint8(parameter.hour);
                buffer.setUint8(parameter.minutes);
                buffer.setUint8(parameter.countToSend);
            }
        },
        [EVENTS_CONFIG]: {
            get: (buffer) => ({
                eventId: buffer.getUint8(),
                sendEvent: buffer.getUint8(),
                saveEvent: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.eventId);
                buffer.setUint8(parameter.sendEvent);
                buffer.setUint8(parameter.saveEvent);
            }
        },
        [NBIOT_MODULE_INFO]: {
            get: (buffer) => ({
                moduleInfo: buffer.getString()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.moduleInfo);
            }
        },
        [NBIOT_BANDS]: {
            get: (buffer) => {
                const count = buffer.getUint8();
                const bands = [];
                for (let index = 0; index < count; index++) {
                    bands.push(buffer.getUint8());
                }
                return { bands };
            },
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.bands.length);
                for (const band of parameter.bands) {
                    buffer.setUint8(band);
                }
            }
        },
        [NBIOT_APN]: {
            get: (buffer) => ({
                apn: buffer.getString()
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.apn);
            }
        },
        [NBIOT_LED_INDICATION]: {
            get: (buffer) => ({
                enableLed: buffer.getUint8(),
                enableNbiotNetworkLed: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.enableLed);
                buffer.setUint8(parameter.enableNbiotNetworkLed);
            }
        },
        [NBIOT_SIM]: {
            get: (buffer) => ({
                enable: buffer.getUint8(),
                pin: buffer.getUint16()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.enable);
                buffer.setUint16(parameter.pin);
            }
        },
        [CHANNEL_TYPE]: {
            get: (buffer) => (buffer.getChannelType()),
            set: (buffer, parameter) => (buffer.setChannelType(parameter))
        },
        [EXTRA_PAYLOAD_ENABLE]: {
            get: (buffer) => ({
                enable: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.enable);
            }
        },
        [TIME_SYNCHRONIZATION_PERIOD_VIA_MAC]: {
            get: (buffer) => ({
                period: buffer.getUint32()
            }),
            set: (buffer, parameter) => {
                buffer.setUint32(parameter.period);
            }
        },
        [KEEP_LORA_CONNECTION_ON_REMOVAL]: {
            get: (buffer) => ({
                value: buffer.getUint8() !== 0
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.value ? 1 : 0);
            }
        }
    };
    const getEventStatusSize = (hardwareType) => (TWO_BYTES_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ? 2 : 1);
    const getParameterSize = (parameter) => {
        let size;
        let data;
        switch (parameter.id) {
            case MQTT_SESSION_CONFIG:
                data = parameter.data;
                size = 1 + 1;
                size += data.clientId.length + 1;
                size += data.username.length + 1;
                size += data.password.length + 1;
                break;
            case MQTT_BROKER_ADDRESS:
                data = parameter.data;
                size = 1 + 2;
                size += data.hostName.length + 1;
                break;
            case MQTT_TOPIC_PREFIX:
                data = parameter.data;
                size = 1;
                size += data.topicPrefix.length + 1;
                break;
            case NBIOT_SSL_CACERT_WRITE:
            case NBIOT_SSL_CLIENT_CERT_WRITE:
            case NBIOT_SSL_CLIENT_KEY_WRITE:
                data = parameter.data;
                size = 1 + 2 + 2;
                size += data.chunk.length;
                break;
            case NBIOT_DEVICE_SOFTWARE_UPDATE:
                data = parameter.data;
                size = 1;
                size += data.softwareImageUrl.length + 1;
                break;
            case NBIOT_MODULE_FIRMWARE_UPDATE:
                data = parameter.data;
                size = 1;
                size += data.moduleFirmwareImageUrl.length + 1;
                break;
            case NBIOT_MODULE_INFO:
                data = parameter.data;
                size = 1 + 1 + data.moduleInfo.length;
                break;
            case NBIOT_BANDS:
                data = parameter.data;
                size = 1 + 1;
                size += data.bands.length;
                break;
            case NBIOT_APN:
                data = parameter.data;
                size = 1 + 1 + data.apn.length;
                break;
            case CHANNEL_TYPE:
                data = parameter.data;
                size = 1 + getChannelTypeSize(data);
                break;
            default:
                size = parametersSizeMap[parameter.id];
        }
        if (size === undefined) {
            throw new Error('unknown parameter id');
        }
        return size;
    };
    const getRequestParameterSize = (parameter) => {
        let size;
        switch (parameter.id) {
            case ABSOLUTE_DATA_MULTI_CHANNEL:
            case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            case REPORTING_DATA_CONFIG:
            case EVENTS_CONFIG:
            case CHANNEL_TYPE:
                size = 2;
                break;
            default:
                size = 1;
                break;
        }
        return size;
    };
    const getResponseParameterSize = (parameter) => {
        let size;
        switch (parameter.id) {
            case MQTT_SESSION_CONFIG:
            case NBIOT_SSL_CACERT_WRITE:
            case NBIOT_SSL_CLIENT_CERT_WRITE:
            case NBIOT_SSL_CLIENT_KEY_WRITE:
            case NBIOT_SSL_CACERT_SET:
            case NBIOT_SSL_CLIENT_CERT_SET:
            case NBIOT_SSL_CLIENT_KEY_SET:
            case NBIOT_DEVICE_SOFTWARE_UPDATE:
            case NBIOT_MODULE_FIRMWARE_UPDATE:
                size = 1;
                break;
            case MQTT_BROKER_ADDRESS:
            case MQTT_TOPIC_PREFIX:
            case NBIOT_MODULE_INFO:
            case NBIOT_BANDS:
            case NBIOT_APN:
            case CHANNEL_TYPE:
                size = getParameterSize(parameter);
                break;
            default:
                size = parametersSizeMap[parameter.id];
        }
        if (size === undefined) {
            throw new Error('unknown parameter id');
        }
        return size;
    };
    function CommandBinaryBuffer(dataOrLength, isLittleEndian = false) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.getMagneticInfluenceBit = (byte) => (!!extractBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX));
    CommandBinaryBuffer.setMagneticInfluenceBit = (byte, value) => (fillBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX, +value));
    CommandBinaryBuffer.getLegacyHourCounterSize = (hourCounter) => (LEGACY_HOUR_COUNTER_SIZE + (hourCounter.diff.length * LEGACY_HOUR_DIFF_SIZE));
    CommandBinaryBuffer.prototype.getExtendedValue = function () {
        let value = 0;
        let isByteExtended = true;
        let position = 0;
        while (isByteExtended && this.offset <= this.data.length) {
            const byte = this.getUint8();
            isByteExtended = !!(byte & EXTEND_BIT_MASK);
            value += ((byte & 0x7f) << (7 * position)) >>> 0;
            ++position;
        }
        return value;
    };
    CommandBinaryBuffer.prototype.setExtendedValue = function (value) {
        if (value === 0) {
            this.setUint8(0);
            return;
        }
        const data = [];
        let encodedValue = value;
        while (encodedValue) {
            data.push(EXTEND_BIT_MASK | (encodedValue & 0x7f));
            encodedValue >>>= 7;
        }
        const lastByte = data.pop();
        if (lastByte) {
            data.push(lastByte & 0x7f);
        }
        data.forEach(extendedValue => this.setUint8(extendedValue));
    };
    CommandBinaryBuffer.prototype.getExtendedValueSize = function (bits) {
        const extBits = Math.ceil(bits / 7);
        const totalBits = bits + extBits;
        const extBytes = Math.ceil(totalBits / 8);
        return extBytes;
    };
    CommandBinaryBuffer.prototype.getTime = function () {
        return this.getUint32();
    };
    CommandBinaryBuffer.prototype.setTime = function (value) {
        this.setUint32(value);
    };
    CommandBinaryBuffer.prototype.getBatteryVoltage = function () {
        const lowVoltageByte = this.getUint8();
        const lowAndHightVoltageByte = this.getUint8();
        const highVoltageByte = this.getUint8();
        let underLowLoad = lowVoltageByte << 4;
        underLowLoad |= (lowAndHightVoltageByte & 0xf0) >> 4;
        let underHighLoad = ((lowAndHightVoltageByte & 0x0f) << 8) | highVoltageByte;
        if (underHighLoad === UNKNOWN_BATTERY_VOLTAGE) {
            underHighLoad = undefined;
        }
        if (underLowLoad === UNKNOWN_BATTERY_VOLTAGE) {
            underLowLoad = undefined;
        }
        return { underLowLoad, underHighLoad };
    };
    CommandBinaryBuffer.prototype.setBatteryVoltage = function (batteryVoltage) {
        let { underLowLoad, underHighLoad } = batteryVoltage;
        if (underLowLoad === undefined) {
            underLowLoad = UNKNOWN_BATTERY_VOLTAGE;
        }
        if (underHighLoad === undefined) {
            underHighLoad = UNKNOWN_BATTERY_VOLTAGE;
        }
        const lowVoltageByte = (underLowLoad >> 4) & 0xff;
        const lowAndHighVoltageByte = ((underLowLoad & 0x0f) << 4) | ((underHighLoad >> 8) & 0x0f);
        const highVoltageByte = underHighLoad & 0xff;
        [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(byte => this.setUint8(byte));
    };
    CommandBinaryBuffer.prototype.getLegacyCounterValue = function () {
        return this.getUint24();
    };
    CommandBinaryBuffer.prototype.setLegacyCounterValue = function (value) {
        this.setUint24(value);
    };
    CommandBinaryBuffer.prototype.getLegacyCounter = function (byte = this.getUint8(), isArchiveValue = false) {
        const value = this.getLegacyCounterValue();
        return {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: isArchiveValue && value === EMPTY_VALUE ? 0 : value
        };
    };
    CommandBinaryBuffer.prototype.setLegacyCounter = function (counter, byte = 0, isArchiveValue = false) {
        this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, counter.isMagneticInfluence));
        this.setLegacyCounterValue(isArchiveValue && counter.value === 0 ? EMPTY_VALUE : counter.value);
    };
    CommandBinaryBuffer.prototype.getChannels = function () {
        const channelList = [];
        let extended = true;
        let channelIndex = 1;
        while (extended) {
            const byte = this.getUint8();
            const bits = byte.toString(2).padStart(LAST_BIT_INDEX + 1, '0').split('').reverse();
            bits.forEach((bit, index) => {
                const value = Number(bit);
                if (index === LAST_BIT_INDEX) {
                    extended = !!value;
                }
                else {
                    if (value) {
                        channelList.push(channelIndex);
                    }
                    ++channelIndex;
                }
            });
        }
        return channelList;
    };
    CommandBinaryBuffer.prototype.setChannels = function (channelList) {
        if (channelList.length === 0) {
            this.setUint8(0);
            return;
        }
        channelList.sort((a, b) => a.index - b.index);
        const maxChannel = Math.max(...channelList.map(({ index }) => index));
        const size = (maxChannel - (maxChannel % 8)) / 8;
        const data = new Array(size + 1).fill(0);
        let byte = 0;
        data.forEach((_, byteIndex) => {
            let channelIndex = (byteIndex * LAST_BIT_INDEX) + 1;
            const maxChannelIndex = channelIndex + LAST_BIT_INDEX;
            while (channelIndex < maxChannelIndex) {
                const channel = channelList.find((item => item.index === channelIndex));
                if (channel !== undefined) {
                    byte |= 1 << ((channel.index - 1) % LAST_BIT_INDEX);
                }
                ++channelIndex;
            }
            if (data[byteIndex + 1] !== undefined) {
                byte |= 1 << LAST_BIT_INDEX;
            }
            data[byteIndex] = byte;
            byte = 0;
        });
        data.forEach((value) => this.setUint8(value));
    };
    CommandBinaryBuffer.prototype.getChannelValue = function () {
        return this.getUint8() + 1;
    };
    CommandBinaryBuffer.prototype.setChannelValue = function (value) {
        if (value < 1) {
            throw new Error('channel must be 1 or greater');
        }
        this.setUint8(value - 1);
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiff = function (isArchiveValue = false) {
        const date = this.getDate();
        const { hour, hours } = this.getHours();
        const channels = this.getChannels();
        const channelList = [];
        date.setUTCHours(hour);
        channels.forEach(channelIndex => {
            const diff = [];
            const value = this.getExtendedValue();
            for (let diffHour = 1; diffHour < hours; ++diffHour) {
                diff.push(this.getExtendedValue());
            }
            channelList.push({
                value: value === isArchiveValue && EMPTY_VALUE ? 0 : value,
                diff,
                index: channelIndex
            });
        });
        return { startTime2000: getTime2000FromDate(date), hours, channelList };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiff = function (hours, startTime2000, channelList, isArchiveValue = false) {
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        this.setDate(date);
        this.setHours(hour, hours);
        this.setChannels(channelList);
        channelList.forEach(({ value, diff }) => {
            this.setExtendedValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        });
    };
    CommandBinaryBuffer.prototype.getHours = function (byte = this.getUint8()) {
        if (byte === 0) {
            return { hours: 0, hour: 0 };
        }
        const hours = ((byte & 0xe0) >> 5) + 1;
        const hour = byte & 0x1f;
        return { hours, hour };
    };
    CommandBinaryBuffer.prototype.setHours = function (hour, hours) {
        if (hour === 0 && hours === 0) {
            this.setUint8(0);
            return;
        }
        this.setUint8((((hours - 1) & 0x07) << 5) | (hour & 0x1f));
    };
    CommandBinaryBuffer.prototype.getDate = function () {
        const yearMonthByte = this.getUint8();
        const monthDateByte = this.getUint8();
        const year = yearMonthByte >> YEAR_START_INDEX;
        const month = ((yearMonthByte & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX) | (monthDateByte >> DATE_BIT_SIZE);
        const monthDay = monthDateByte & 0x1f;
        return new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0));
    };
    CommandBinaryBuffer.prototype.setDate = function (dateOrTime) {
        let date;
        if (dateOrTime instanceof Date) {
            date = dateOrTime;
        }
        else {
            date = getDateFromTime2000(dateOrTime);
        }
        const year = date.getUTCFullYear() - INITIAL_YEAR;
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const yearMonthByte = (year << YEAR_START_INDEX) | (month >> MONTH_BIT_SIZE - YEAR_START_INDEX);
        const monthDateByte = ((month & 0x07) << DATE_BIT_SIZE) | day;
        [yearMonthByte, monthDateByte].forEach(byte => this.setUint8(byte));
    };
    CommandBinaryBuffer.prototype.getPulseCoefficient = function () {
        const pulseCoefficient = this.getUint8();
        if (isMSBSet(pulseCoefficient)) {
            const value = byteToPulseCoefficientMap[pulseCoefficient];
            if (value) {
                return value;
            }
            throw new Error('pulseCoefficient MSB is set, but value unknown');
        }
        return pulseCoefficient;
    };
    CommandBinaryBuffer.prototype.setPulseCoefficient = function (value) {
        if (value in pulseCoefficientToByteMap) {
            const byte = pulseCoefficientToByteMap[value];
            if (byte) {
                this.setUint8(byte);
            }
            else {
                throw new Error('pulseCoefficient MSB is set, but value unknown');
            }
        }
        else {
            this.setUint8(value);
        }
    };
    CommandBinaryBuffer.prototype.getChannelsWithAbsoluteValues = function () {
        const channels = this.getChannels();
        const channelList = [];
        channels.forEach(channelIndex => {
            channelList.push({
                pulseCoefficient: this.getPulseCoefficient(),
                value: this.getExtendedValue(),
                index: channelIndex
            });
        });
        return channelList;
    };
    CommandBinaryBuffer.prototype.setChannelsWithAbsoluteValues = function (channelList) {
        this.setChannels(channelList);
        channelList.forEach(({ value, pulseCoefficient }) => {
            this.setPulseCoefficient(pulseCoefficient);
            this.setExtendedValue(value);
        });
    };
    CommandBinaryBuffer.prototype.getChannelsAbsoluteValuesWithHourDiff = function (hours) {
        const channels = this.getChannels();
        const channelList = [];
        channels.forEach(channelIndex => {
            const pulseCoefficient = this.getPulseCoefficient();
            const value = this.getExtendedValue();
            const diff = [];
            for (let hourIndex = 1; hourIndex < hours; ++hourIndex) {
                diff.push(this.getExtendedValue());
            }
            channelList.push({
                diff,
                value,
                pulseCoefficient,
                index: channelIndex
            });
        });
        return channelList;
    };
    CommandBinaryBuffer.prototype.setChannelsAbsoluteValuesWithHourDiff = function (channelList) {
        this.setChannels(channelList);
        channelList.forEach(({ value, diff, pulseCoefficient }) => {
            this.setPulseCoefficient(pulseCoefficient);
            this.setExtendedValue(value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        });
    };
    CommandBinaryBuffer.prototype.getEventStatus = function (hardwareType) {
        let status;
        if (GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(gasBitMask, this.getUint8());
        }
        else if (TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(twoChannelBitMask, this.getUint8());
        }
        else if (ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(elimpBitMask, this.getUint8());
        }
        else if (FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(fourChannelBitMask, this.getUint16(true));
        }
        else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(mtxBitMask, this.getUint16(true));
        }
        else if (hardwareType === US_WATER) {
            const event = toObject(usWaterMeterEventBitMask, this.getUint8());
            status = { event, error: this.getUint8() };
        }
        else {
            throw new Error('wrong hardwareType');
        }
        return status;
    };
    CommandBinaryBuffer.prototype.setEventStatus = function (hardwareType, status) {
        if (GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint8(fromObject(gasBitMask, status));
        }
        else if (TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint8(fromObject(twoChannelBitMask, status));
        }
        else if (ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint8(fromObject(elimpBitMask, status));
        }
        else if (FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint16(fromObject(fourChannelBitMask, status) | (1 << 7), true);
        }
        else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint16(fromObject(mtxBitMask, status), true);
        }
        else if (hardwareType === US_WATER) {
            const data = status;
            this.setUint8(fromObject(usWaterMeterEventBitMask, data.event));
            this.setUint8(data.error);
        }
        else {
            throw new Error('wrong hardwareType');
        }
    };
    CommandBinaryBuffer.prototype.getParameter = function () {
        const id = this.getUint8();
        const name = deviceParameterNames[id];
        if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
            throw new Error(`parameter ${id} is not supported`);
        }
        const data = deviceParameterConvertersMap[id].get(this);
        return { id, name, data };
    };
    CommandBinaryBuffer.prototype.setParameter = function (parameter) {
        const { id, data } = parameter;
        if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set) {
            throw new Error(`parameter ${id} is not supported`);
        }
        this.setUint8(id);
        deviceParameterConvertersMap[id].set(this, data);
    };
    CommandBinaryBuffer.prototype.getRequestParameter = function () {
        const id = this.getUint8();
        const name = deviceParameterNames[id];
        let data = null;
        switch (id) {
            case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            case ABSOLUTE_DATA_MULTI_CHANNEL:
            case CHANNEL_TYPE:
                data = { channel: this.getChannelValue() };
                break;
            case REPORTING_DATA_CONFIG:
                data = { dataType: this.getUint8() };
                break;
            case EVENTS_CONFIG:
                data = { eventId: this.getUint8() };
                break;
        }
        return { id, name, data };
    };
    CommandBinaryBuffer.prototype.setRequestParameter = function (parameter) {
        const { id, data: parameterData } = parameter;
        let data;
        this.setUint8(id);
        switch (id) {
            case ABSOLUTE_DATA_MULTI_CHANNEL:
            case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            case CHANNEL_TYPE:
                data = parameterData;
                this.setChannelValue(data.channel);
                break;
            case REPORTING_DATA_CONFIG:
                data = parameterData;
                this.setUint8(data.dataType);
                break;
            case EVENTS_CONFIG:
                data = parameterData;
                this.setUint8(data.eventId);
                break;
        }
    };
    CommandBinaryBuffer.prototype.getResponseParameter = function () {
        const id = this.getUint8();
        const name = deviceParameterNames[id];
        let data;
        if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
            throw new Error(`parameter ${id} is not supported`);
        }
        switch (id) {
            case MQTT_SESSION_CONFIG:
            case NBIOT_SSL_CACERT_WRITE:
            case NBIOT_SSL_CLIENT_CERT_WRITE:
            case NBIOT_SSL_CLIENT_KEY_WRITE:
            case NBIOT_SSL_CACERT_SET:
            case NBIOT_SSL_CLIENT_CERT_SET:
            case NBIOT_SSL_CLIENT_KEY_SET:
            case NBIOT_DEVICE_SOFTWARE_UPDATE:
            case NBIOT_MODULE_FIRMWARE_UPDATE:
                data = null;
                break;
            default:
                data = deviceParameterConvertersMap[id].get(this);
        }
        return { id, name, data };
    };
    CommandBinaryBuffer.prototype.setResponseParameter = function (parameter) {
        const { id, data } = parameter;
        if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set) {
            throw new Error(`parameter ${id} is not supported`);
        }
        this.setUint8(id);
        switch (id) {
            case MQTT_SESSION_CONFIG:
            case NBIOT_SSL_CACERT_WRITE:
            case NBIOT_SSL_CLIENT_CERT_WRITE:
            case NBIOT_SSL_CLIENT_KEY_WRITE:
            case NBIOT_SSL_CACERT_SET:
            case NBIOT_SSL_CLIENT_CERT_SET:
            case NBIOT_SSL_CLIENT_KEY_SET:
            case NBIOT_DEVICE_SOFTWARE_UPDATE:
            case NBIOT_MODULE_FIRMWARE_UPDATE:
                break;
            default:
                deviceParameterConvertersMap[id].set(this, data);
        }
    };
    CommandBinaryBuffer.prototype.getLegacyHourDiff = function () {
        const stateWithValueByte = this.getUint8();
        const valueLowerByte = this.getUint8();
        return {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(stateWithValueByte),
            value: ((stateWithValueByte & 0x1f) << 8) | valueLowerByte
        };
    };
    CommandBinaryBuffer.prototype.setLegacyHourDiff = function (diff) {
        const bytes = [diff.value >> 8, diff.value & 0xff];
        bytes[0] = CommandBinaryBuffer.setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);
        bytes.forEach(byte => this.setUint8(byte));
    };
    CommandBinaryBuffer.prototype.getLegacyHourCounterWithDiff = function (isArchiveValue = false) {
        const date = this.getDate();
        const byte = this.getUint8();
        const { hour } = this.getHours(byte);
        const value = this.getLegacyCounterValue();
        const counter = {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: isArchiveValue && value === EMPTY_VALUE ? 0 : value
        };
        const diff = [];
        while (this.offset < this.data.length) {
            diff.push(this.getLegacyHourDiff());
        }
        date.setUTCHours(hour);
        return { startTime2000: getTime2000FromDate(date), counter, diff };
    };
    CommandBinaryBuffer.prototype.setLegacyHourCounterWithDiff = function (hourCounter, isArchiveValue = false) {
        const date = getDateFromTime2000(hourCounter.startTime2000);
        const hour = date.getUTCHours();
        const { value } = hourCounter.counter;
        this.setDate(date);
        this.setHours(hour, 1);
        this.seek(this.offset - 1);
        const byte = this.getUint8();
        this.seek(this.offset - 1);
        this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, hourCounter.counter.isMagneticInfluence));
        this.setLegacyCounterValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
        hourCounter.diff.forEach(diffItem => this.setLegacyHourDiff(diffItem));
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiffExtended = function (isArchiveValue = false) {
        const date = this.getDate();
        const hour = this.getUint8();
        const hours = this.getUint8();
        const channels = this.getChannels();
        const channelList = [];
        date.setUTCHours(hour);
        channels.forEach(channelIndex => {
            const diff = [];
            const value = this.getExtendedValue();
            for (let diffHour = 0; diffHour < hours; ++diffHour) {
                diff.push(this.getExtendedValue());
            }
            channelList.push({
                value: value === isArchiveValue && EMPTY_VALUE ? 0 : value,
                diff,
                index: channelIndex
            });
        });
        return { startTime2000: getTime2000FromDate(date), hour, hours, channelList };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiffExtended = function (parameters, isArchiveValue = false) {
        const date = getDateFromTime2000(parameters.startTime2000);
        this.setDate(date);
        this.setUint8(parameters.hour);
        this.setUint8(parameters.hours);
        this.setChannels(parameters.channelList);
        parameters.channelList.forEach(({ value, diff }) => {
            this.setExtendedValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        });
    };
    CommandBinaryBuffer.prototype.getDataSegment = function () {
        const segmentationSessionId = this.getUint8();
        const flag = this.getUint8();
        return {
            segmentationSessionId,
            segmentIndex: extractBits(flag, 3, 1),
            segmentsNumber: extractBits(flag, 3, 5),
            isLast: Boolean(extractBits(flag, 1, 8)),
            data: this.getBytesLeft()
        };
    };
    CommandBinaryBuffer.prototype.setDataSegment = function (parameters) {
        let flag = fillBits(0, 3, 1, parameters.segmentIndex);
        flag = fillBits(flag, 3, 5, parameters.segmentsNumber);
        flag = fillBits(flag, 1, 8, +parameters.isLast);
        this.setUint8(parameters.segmentationSessionId);
        this.setUint8(flag);
        this.setBytes(parameters.data);
    };
    CommandBinaryBuffer.prototype.getBinarySensor = function () {
        const activeStateTimeMs = this.getUint16();
        return { activeStateTimeMs };
    };
    CommandBinaryBuffer.prototype.setBinarySensor = function (parameters) {
        this.setUint16(parameters.activeStateTimeMs);
    };
    CommandBinaryBuffer.prototype.getTemperatureSensor = function () {
        const measurementPeriod = this.getUint16();
        const hysteresisSec = this.getUint8();
        const highTemperatureThreshold = this.getInt8();
        const lowTemperatureThreshold = this.getInt8();
        return {
            measurementPeriod,
            hysteresisSec,
            highTemperatureThreshold,
            lowTemperatureThreshold
        };
    };
    CommandBinaryBuffer.prototype.setTemperatureSensor = function (parameters) {
        this.setInt16(parameters.measurementPeriod);
        this.setInt8(parameters.hysteresisSec);
        this.setInt8(parameters.highTemperatureThreshold);
        this.setInt8(parameters.lowTemperatureThreshold);
    };
    CommandBinaryBuffer.prototype.getChannelType = function () {
        const channel = this.getChannelValue();
        const type = this.getUint8();
        let parameters = {};
        switch (type) {
            case BINARY_SENSOR:
                parameters = this.getBinarySensor();
                break;
            case TEMPERATURE_SENSOR:
                parameters = this.getTemperatureSensor();
                break;
        }
        return {
            channel,
            type,
            parameters
        };
    };
    CommandBinaryBuffer.prototype.setChannelType = function ({ type, channel, parameters }) {
        this.setChannelValue(channel);
        this.setUint8(type);
        switch (type) {
            case BINARY_SENSOR:
                this.setBinarySensor(parameters);
                break;
            case TEMPERATURE_SENSOR:
                this.setTemperatureSensor(parameters);
                break;
        }
    };

    const HEX = 1;

    var getBase64FromBytes = (bytes) => btoa(bytes
        .map(byte => String.fromCharCode(byte))
        .join(''));

    const defaultFormatOptions = {
        bytesConversionFormat: HEX,
        bytesConversionFormatOptions: {}
    };
    const getStringFromBytes = (bytes, options = defaultFormatOptions) => {
        const { bytesConversionFormat = defaultFormatOptions.bytesConversionFormat, bytesConversionFormatOptions = defaultFormatOptions.bytesConversionFormatOptions } = options;
        return bytesConversionFormat === HEX
            ? getHexFromBytes(bytes, bytesConversionFormatOptions)
            : getBase64FromBytes(bytes);
    };

    const id$$ = dataSegment$3;
    const name$$ = commandNames$1[dataSegment$3];
    const headerSize$$ = 2;
    const COMMAND_BODY_MIN_SIZE$3 = 2;
    const examples$$ = {
        'DataSegment request': {
            id: id$$,
            name: name$$,
            headerSize: headerSize$$,
            parameters: {
                segmentationSessionId: 2,
                segmentIndex: 3,
                segmentsNumber: 5,
                isLast: false,
                data: [0x00, 0x01, 0x02, 0x03, 0x04]
            },
            bytes: [
                0x1e, 0x07,
                0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04
            ]
        }
    };
    const fromBytes$$ = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getDataSegment();
    };
    const toBytes$$ = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$3 + parameters.data.length);
        buffer.setDataSegment(parameters);
        return toBytes$11(id$$, buffer.data);
    };
    const toJson$1 = (parameters, options) => (JSON.stringify({
        ...parameters,
        data: getStringFromBytes(parameters.data, options)
    }));

    var dataSegment$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$$,
        fromBytes: fromBytes$$,
        headerSize: headerSize$$,
        id: id$$,
        name: name$$,
        toBytes: toBytes$$,
        toJson: toJson$1
    });

    const id$_ = getArchiveDays$3;
    const name$_ = commandNames$1[getArchiveDays$3];
    const headerSize$_ = 2;
    const COMMAND_BODY_SIZE$x = 3;
    const examples$_ = {
        '1 day counter from 2023.03.10 00:00:00 GMT': {
            id: id$_,
            name: name$_,
            headerSize: headerSize$_,
            parameters: { startTime2000: 731721600, days: 1 },
            bytes: [
                0x06, 0x03,
                0x2e, 0x6a, 0x01
            ]
        }
    };
    const fromBytes$_ = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$x) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const days = buffer.getUint8();
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), days };
    };
    const toBytes$_ = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$x);
        const { startTime2000, days } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setUint8(days);
        return toBytes$11(id$_, buffer.data);
    };

    var getArchiveDays$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$_,
        fromBytes: fromBytes$_,
        headerSize: headerSize$_,
        id: id$_,
        name: name$_,
        toBytes: toBytes$_
    });

    const id$Z = getArchiveDaysMc$3;
    const name$Z = commandNames$1[getArchiveDaysMc$3];
    const headerSize$Z = 2;
    const COMMAND_BODY_SIZE$w = 4;
    const examples$Z = {
        '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
            id: id$Z,
            name: name$Z,
            headerSize: headerSize$Z,
            parameters: { startTime2000: 731721600, days: 1, channelList: [1] },
            bytes: [
                0x1b, 0x04,
                0x2e, 0x6a, 0x01, 0x01
            ]
        }
    };
    const fromBytes$Z = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$w) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannels();
        const days = buffer.getUint8();
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), days, channelList };
    };
    const toBytes$Z = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$w);
        const { startTime2000, days, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({ index })));
        buffer.setUint8(days);
        return toBytes$11(id$Z, buffer.data);
    };

    var getArchiveDaysMc$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$Z,
        fromBytes: fromBytes$Z,
        headerSize: headerSize$Z,
        id: id$Z,
        name: name$Z,
        toBytes: toBytes$Z
    });

    const id$Y = getArchiveEvents$3;
    const name$Y = commandNames$1[getArchiveEvents$3];
    const headerSize$Y = 2;
    const COMMAND_BODY_SIZE$v = 5;
    const examples$Y = {
        'request 4 events from 2023.04.03 14:01:17 GMT': {
            id: id$Y,
            name: name$Y,
            headerSize: headerSize$Y,
            parameters: { startTime2000: 733845677, events: 4 },
            bytes: [
                0x0b, 0x05,
                0x2b, 0xbd, 0x98, 0xad, 0x04
            ]
        }
    };
    const fromBytes$Y = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$v) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const startTime2000 = buffer.getTime();
        const events = buffer.getUint8();
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000, events };
    };
    const toBytes$Y = (parameters) => {
        const { startTime2000, events } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$v);
        buffer.setTime(startTime2000);
        buffer.setUint8(events);
        return toBytes$11(id$Y, buffer.data);
    };

    var getArchiveEvents$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$Y,
        fromBytes: fromBytes$Y,
        headerSize: headerSize$Y,
        id: id$Y,
        name: name$Y,
        toBytes: toBytes$Y
    });

    const id$X = getArchiveHours$3;
    const name$X = commandNames$1[getArchiveHours$3];
    const headerSize$X = 2;
    const COMMAND_BODY_SIZE$u = 4;
    const examples$X = {
        '2 hours counter from 2023.12.23 12:00:00 GMT': {
            id: id$X,
            name: name$X,
            headerSize: headerSize$X,
            parameters: { startTime2000: 756648000, hours: 2 },
            bytes: [
                0x05, 0x04,
                0x2f, 0x97, 0x0c, 0x02
            ]
        }
    };
    const fromBytes$X = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$u) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const { hour } = buffer.getHours();
        const hours = buffer.getUint8();
        date.setUTCHours(hour);
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), hours };
    };
    const toBytes$X = (parameters) => {
        const { startTime2000, hours } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$u);
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, 1);
        buffer.setUint8(hours);
        return toBytes$11(id$X, buffer.data);
    };

    var getArchiveHours$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$X,
        fromBytes: fromBytes$X,
        headerSize: headerSize$X,
        id: id$X,
        name: name$X,
        toBytes: toBytes$X
    });

    const id$W = getArchiveHoursMc$3;
    const name$W = commandNames$1[getArchiveHoursMc$3];
    const headerSize$W = 2;
    const COMMAND_BODY_SIZE$t = 4;
    const examples$W = {
        'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$W,
            name: name$W,
            headerSize: headerSize$W,
            parameters: { startTime2000: 756648000, hours: 2, channelList: [1] },
            bytes: [
                0x1a, 0x04,
                0x2f, 0x97, 0x2c, 0x01
            ]
        }
    };
    const fromBytes$W = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$t) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const { hour, hours } = buffer.getHours();
        const channelList = buffer.getChannels();
        date.setUTCHours(hour);
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), hours, channelList };
    };
    const toBytes$W = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$t);
        const { hours, startTime2000, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$11(id$W, buffer.data);
    };

    var getArchiveHoursMc$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$W,
        fromBytes: fromBytes$W,
        headerSize: headerSize$W,
        id: id$W,
        name: name$W,
        toBytes: toBytes$W
    });

    const id$V = getArchiveHoursMcEx$3;
    const name$V = commandNames$1[getArchiveHoursMcEx$3];
    const headerSize$V = 3;
    const COMMAND_BODY_SIZE$s = 5;
    const examples$V = {
        '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$V,
            name: name$V,
            headerSize: headerSize$V,
            parameters: { startTime2000: 756648000, hour: 12, hours: 2, channelList: [1] },
            bytes: [
                0x1f, 0x30, 0x05,
                0x2f, 0x97, 0x0c, 0x02, 0x01
            ]
        }
    };
    const fromBytes$V = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const hour = buffer.getUint8();
        const hours = buffer.getUint8();
        const channelList = buffer.getChannels();
        date.setUTCHours(hour);
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), hour, hours, channelList };
    };
    const toBytes$V = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$s);
        const { channelList, hour, hours, startTime2000 } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setUint8(hour);
        buffer.setUint8(hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$11(id$V, buffer.data);
    };

    var getArchiveHoursMcEx$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$V,
        fromBytes: fromBytes$V,
        headerSize: headerSize$V,
        id: id$V,
        name: name$V,
        toBytes: toBytes$V
    });

    const id$U = getBatteryStatus$3;
    const name$U = commandNames$1[getBatteryStatus$3];
    const headerSize$U = 3;
    const COMMAND_BODY_SIZE$r = 0;
    const examples$U = {
        'simple request': {
            id: id$U,
            name: name$U,
            headerSize: headerSize$U,
            parameters: {},
            bytes: [
                0x1f, 0x05, 0x00
            ]
        }
    };
    const fromBytes$U = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$r) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$U = () => toBytes$11(id$U);

    var getBatteryStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$U,
        fromBytes: fromBytes$U,
        headerSize: headerSize$U,
        id: id$U,
        name: name$U,
        toBytes: toBytes$U
    });

    const id$T = getChannelsStatus$3;
    const name$T = commandNames$1[getChannelsStatus$3];
    const headerSize$T = 3;
    const examples$T = {
        'request the status of all channels': {
            id: id$T,
            name: name$T,
            headerSize: headerSize$T,
            parameters: {},
            bytes: [
                0x1f, 0x32, 0x00
            ]
        },
        'request the status of the subsystems assigned to channels 0 and 1': {
            id: id$T,
            name: name$T,
            headerSize: headerSize$T,
            parameters: { channel1: true, channel2: true, channel3: false, channel4: false },
            bytes: [
                0x1f, 0x32, 0x01, 0x03
            ]
        }
    };
    const fromBytes$T = (data) => (data.length === 0 ? {} : getChannelsMaskFromNumber(data[0]));
    const toBytes$T = (parameters) => (toBytes$11(id$T, Object.keys(parameters).length !== 0 ? [setChannelsMaskToNumber(parameters)] : []));

    var getChannelsStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$T,
        id: id$T,
        name: name$T,
        toBytes: toBytes$T
    });

    const id$S = getChannelsTypes$3;
    const name$S = commandNames$1[getChannelsTypes$3];
    const headerSize$S = 3;
    const COMMAND_BODY_SIZE$q = 0;
    const examples$S = {
        'request the channels map': {
            id: id$S,
            name: name$S,
            headerSize: headerSize$S,
            parameters: {},
            bytes: [
                0x1f, 0x33, 0x00
            ]
        }
    };
    const fromBytes$S = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$q) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$S = () => toBytes$11(id$S);

    var getChannelsTypes$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        name: name$S,
        toBytes: toBytes$S
    });

    const id$R = getCurrent$1;
    const name$R = commandNames$1[getCurrent$1];
    const headerSize$R = 2;
    const COMMAND_BODY_SIZE$p = 0;
    const examples$R = {
        'simple request': {
            id: id$R,
            headerSize: headerSize$R,
            name: name$R,
            parameters: {},
            bytes: [
                0x07, 0x00
            ]
        }
    };
    const fromBytes$R = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$p) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$R = () => toBytes$11(id$R);

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$R,
        id: id$R,
        name: name$R,
        toBytes: toBytes$R
    });

    const id$Q = getCurrentMc$1;
    const name$Q = commandNames$1[getCurrentMc$1];
    const headerSize$Q = 2;
    const COMMAND_BODY_SIZE$o = 0;
    const examples$Q = {
        'simple request': {
            id: id$Q,
            name: name$Q,
            headerSize: headerSize$Q,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$Q = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$o) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$Q = () => toBytes$11(id$Q);

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$Q,
        fromBytes: fromBytes$Q,
        headerSize: headerSize$Q,
        id: id$Q,
        name: name$Q,
        toBytes: toBytes$Q
    });

    const id$P = getExAbsArchiveDaysMc$3;
    const name$P = commandNames$1[getExAbsArchiveDaysMc$3];
    const headerSize$P = 3;
    const COMMAND_BODY_SIZE$n = 4;
    const examples$P = {
        '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT': {
            id: id$P,
            name: name$P,
            headerSize: headerSize$P,
            parameters: { startTime2000: 756691200, days: 1, channelList: [1] },
            bytes: [
                0x1f, 0x0d, 0x04,
                0x2f, 0x98, 0x01, 0x01
            ]
        }
    };
    const fromBytes$P = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$n) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannels();
        const days = buffer.getUint8();
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { startTime2000: getTime2000FromDate(date), days, channelList };
    };
    const toBytes$P = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$n);
        const { startTime2000, days, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList.map(index => ({ index })));
        buffer.setUint8(days);
        return toBytes$11(id$P, buffer.data);
    };

    var getExAbsArchiveDaysMc$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$P,
        fromBytes: fromBytes$P,
        headerSize: headerSize$P,
        id: id$P,
        name: name$P,
        toBytes: toBytes$P
    });

    const id$O = getExAbsArchiveHoursMc$3;
    const name$O = commandNames$1[getExAbsArchiveHoursMc$3];
    const headerSize$O = 3;
    const COMMAND_BODY_SIZE$m = 4;
    const examples$O = {
        '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$O,
            name: name$O,
            headerSize: headerSize$O,
            parameters: { channelList: [1], hours: 1, startTime2000: 756648000 },
            bytes: [
                0x1f, 0x0c, 0x04,
                0x2f, 0x97, 0x0c, 0x01
            ]
        }
    };
    const fromBytes$O = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const { hour, hours } = buffer.getHours();
        const channelList = buffer.getChannels();
        date.setUTCHours(hour);
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { channelList, hours, startTime2000: getTime2000FromDate(date) };
    };
    const toBytes$O = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$m);
        const { startTime2000, hours, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$11(id$O, buffer.data);
    };

    var getExAbsArchiveHoursMc$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$O,
        fromBytes: fromBytes$O,
        headerSize: headerSize$O,
        id: id$O,
        name: name$O,
        toBytes: toBytes$O
    });

    const id$N = getExAbsCurrentMc$1;
    const name$N = commandNames$1[getExAbsCurrentMc$1];
    const headerSize$N = 3;
    const COMMAND_BODY_SIZE$l = 0;
    const examples$N = {
        'simple request': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            parameters: {},
            bytes: [
                0x1f, 0x0f, 0x00
            ]
        }
    };
    const fromBytes$N = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$l) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$N = () => toBytes$11(id$N);

    var getExAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$N,
        fromBytes: fromBytes$N,
        headerSize: headerSize$N,
        id: id$N,
        name: name$N,
        toBytes: toBytes$N
    });

    const id$M = getLmicInfo$3;
    const name$M = commandNames$1[getLmicInfo$3];
    const headerSize$M = 3;
    const COMMAND_BODY_SIZE$k = 0;
    const examples$M = {
        'simple request': {
            id: id$M,
            name: name$M,
            headerSize: headerSize$M,
            parameters: {},
            bytes: [
                0x1f, 0x02, 0x00
            ]
        }
    };
    const fromBytes$M = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$k) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$M = () => toBytes$11(id$M);

    var getLmicInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$M,
        id: id$M,
        name: name$M,
        toBytes: toBytes$M
    });

    const id$L = getParameter$3;
    const name$L = commandNames$1[getParameter$3];
    const headerSize$L = 2;
    const examples$L = {
        'request absolute data (not multichannel device)': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 23,
                name: 'ABSOLUTE_DATA',
                data: null
            },
            bytes: [
                0x04, 0x01,
                0x17
            ]
        },
        'request for state of absolute data (not multichannel device)': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 24,
                name: 'ABSOLUTE_DATA_ENABLE',
                data: null
            },
            bytes: [
                0x04, 0x01,
                0x18
            ]
        },
        'request for state of absolute for multichannel device (1 channel)': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 29,
                name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
                data: { channel: 1 }
            },
            bytes: [
                0x04, 0x02,
                0x1d, 0x00
            ]
        },
        'request for state of absolute data for multichannel device (1 channel)': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 30,
                name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
                data: { channel: 1 }
            },
            bytes: [
                0x04, 0x02,
                0x1e, 0x00
            ]
        },
        'request for configuration for specific reporting data type': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 49,
                name: 'REPORTING_DATA_CONFIG',
                data: { dataType: 0 }
            },
            bytes: [
                0x04, 0x02,
                0x31, 0x00
            ]
        },
        'request for configuration for specific event id': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 50,
                name: 'EVENTS_CONFIG',
                data: { eventId: 1 }
            },
            bytes: [
                0x04, 0x02,
                0x32, 0x01
            ]
        },
        'get channel settings. channel: 2': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            parameters: {
                id: 56,
                name: 'CHANNEL_TYPE',
                data: { channel: 2 }
            },
            bytes: [
                0x04, 0x02,
                0x38, 0x01
            ]
        }
    };
    const fromBytes$L = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getRequestParameter();
    };
    const toBytes$L = (parameters) => {
        const buffer = new CommandBinaryBuffer(getRequestParameterSize(parameters));
        buffer.setRequestParameter(parameters);
        return toBytes$11(id$L, buffer.data);
    };

    var getParameter$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$L,
        fromBytes: fromBytes$L,
        headerSize: headerSize$L,
        id: id$L,
        name: name$L,
        toBytes: toBytes$L
    });

    const id$K = getSignalQuality$1;
    const name$K = commandNames$1[getSignalQuality$1];
    const headerSize$K = 3;
    const COMMAND_BODY_SIZE$j = 0;
    const examples$K = {
        'simple request': {
            id: id$K,
            name: name$K,
            headerSize: headerSize$K,
            parameters: {},
            bytes: [
                0x1f, 0x34, 0x00
            ]
        }
    };
    const fromBytes$K = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$j) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$K = () => toBytes$11(id$K, []);

    var getSignalQuality = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        name: name$K,
        toBytes: toBytes$K
    });

    const id$J = getStatus$1;
    const name$J = commandNames$1[getStatus$1];
    const headerSize$J = 2;
    const COMMAND_BODY_SIZE$i = 0;
    const examples$J = {
        'simple request': {
            id: id$J,
            name: name$J,
            headerSize: headerSize$J,
            parameters: {},
            bytes: [
                0x14, 0x00
            ]
        }
    };
    const fromBytes$J = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$i) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$J = () => toBytes$11(id$J);

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$J,
        id: id$J,
        name: name$J,
        toBytes: toBytes$J
    });

    const id$I = getTime2000$1;
    const name$I = commandNames$1[getTime2000$1];
    const headerSize$I = 2;
    const COMMAND_BODY_SIZE$h = 0;
    const examples$I = {
        'simple request': {
            id: id$I,
            name: name$I,
            headerSize: headerSize$I,
            parameters: {},
            bytes: [
                0x09, 0x00
            ]
        }
    };
    const fromBytes$I = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$h) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$I = () => toBytes$11(id$I, []);

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$I,
        id: id$I,
        name: name$I,
        toBytes: toBytes$I
    });

    const id$H = setParameter$3;
    const name$H = commandNames$1[setParameter$3];
    const headerSize$H = 2;
    const examples$H = {
        'set minimal reporting data interval to 1 hour': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 1,
                name: 'REPORTING_DATA_INTERVAL',
                data: {
                    specialSchedulePeriod: 0,
                    firstDaysSpecialSchedule: 0,
                    lastDaysSpecialSchedule: 0,
                    period: 3600
                }
            },
            bytes: [
                0x03, 0x05,
                0x01, 0x00, 0x00, 0x00, 0x06
            ]
        },
        'set day checkout hour to 12:00': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 4,
                name: 'DAY_CHECKOUT_HOUR',
                data: { value: 12 }
            },
            bytes: [
                0x03, 0x02,
                0x04, 0x0c
            ]
        },
        'set reporting data type to "day"': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 5,
                name: 'REPORTING_DATA_TYPE',
                data: { type: 1 }
            },
            bytes: [
                0x03, 0x02,
                0x05, 0x01
            ]
        },
        'set "with confirmation" for delivery of priority data': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 8,
                name: 'PRIORITY_DATA_DELIVERY_TYPE',
                data: { value: 0 }
            },
            bytes: [
                0x03, 0x02,
                0x08, 0x00
            ]
        },
        'set activation method to "ABP"': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 9,
                name: 'ACTIVATION_METHOD',
                data: { type: 1 }
            },
            bytes: [
                0x03, 0x02,
                0x09, 0x01
            ]
        },
        'set battery depassivation info': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 10,
                name: 'BATTERY_DEPASSIVATION_INFO',
                data: {
                    loadTime: 100,
                    internalResistance: 3222,
                    lowVoltage: 233
                }
            },
            bytes: [
                0x03, 0x07,
                0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9
            ]
        },
        'set battery minimal load time to "100"': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 11,
                name: 'BATTERY_MINIMAL_LOAD_TIME',
                data: { value: 100 }
            },
            bytes: [
                0x03, 0x05,
                0x0b, 0x00, 0x00, 0x00, 0x64
            ]
        },
        'enable 1-4 channels, and disable serial channel for device': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 13,
                name: 'CHANNELS_CONFIG',
                data: { value: 0 }
            },
            bytes: [
                0x03, 0x02,
                0x0d, 0x00
            ]
        },
        'set spread factor and frequency for RX2 window': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 18,
                name: 'RX2_CONFIG',
                data: {
                    spreadFactor: 5,
                    spreadFactorName: 'SF7B125',
                    frequency: 20000
                }
            },
            bytes: [
                0x03, 0x05,
                0x12, 0x05, 0x00, 0x00, 0xc8
            ]
        },
        'set absolute data (not multichannel device)': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 23,
                name: 'ABSOLUTE_DATA',
                data: {
                    meterValue: 204,
                    pulseCoefficient: 100,
                    value: 2023
                }
            },
            bytes: [
                0x03, 0x0a,
                0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
            ]
        },
        'enable absolute data (not multichannel device)': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 24,
                name: 'ABSOLUTE_DATA_ENABLE',
                data: { state: 1 }
            },
            bytes: [
                0x03, 0x02,
                0x18, 0x01
            ]
        },
        'set device serial number': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 25,
                name: 'SERIAL_NUMBER',
                data: { value: '1b 0a 3e dc 3e 22' }
            },
            bytes: [
                0x03, 0x07,
                0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22
            ]
        },
        'set device geolocation': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 26,
                name: 'GEOLOCATION',
                data: {
                    latitude: 34.43,
                    longitude: 43.43,
                    altitude: 23
                }
            },
            bytes: [
                0x03, 0x0b,
                0x1a, 0x42, 0x09, 0xb8, 0x52, 0x42, 0x2d, 0xb8, 0x52, 0x00, 0x17
            ]
        },
        'set interval to send EXTRA FRAME': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 28,
                name: 'EXTRA_FRAME_INTERVAL',
                data: { value: 3600 }
            },
            bytes: [
                0x03, 0x03,
                0x1c, 0x0e, 0x10
            ]
        },
        'set absolute data for multichannel device (1 channel)': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 29,
                name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
                data: {
                    channel: 1,
                    meterValue: 402,
                    pulseCoefficient: 1000,
                    value: 2032
                }
            },
            bytes: [
                0x03, 0x0b,
                0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
            ]
        },
        'enable absolute data for multichannel device (2 channel)': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 30,
                name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
                data: {
                    channel: 2,
                    state: 1
                }
            },
            bytes: [
                0x03, 0x03,
                0x1e, 0x01, 0x01
            ]
        },
        'set pulse channels config': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 31,
                name: 'PULSE_CHANNELS_SCAN_CONFIG',
                data: {
                    channelList: [1, 4],
                    pullUpTime: 18,
                    scanTime: 23
                }
            },
            bytes: [
                0x03, 0x04,
                0x1f, 0x09, 0x12, 0x17
            ]
        },
        'enable channels: 1, 2, disable channels: 3, 4, for pulse device': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 32,
                name: 'PULSE_CHANNELS_SET_CONFIG',
                data: {
                    channel1: true,
                    channel2: true,
                    channel3: false,
                    channel4: false
                }
            },
            bytes: [
                0x03, 0x02,
                0x20, 0x03
            ]
        },
        'set depassivation config for device': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 33,
                name: 'BATTERY_DEPASSIVATION_CONFIG',
                data: {
                    resistanceStartThreshold: 36000,
                    resistanceStopThreshold: 26000
                }
            },
            bytes: [
                0x03, 0x05,
                0x21, 0x8c, 0xa0, 0x65, 0x90
            ]
        },
        'set nbiot bands': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 52,
                name: 'NBIOT_BANDS',
                data: { bands: [3, 8, 20] }
            },
            bytes: [
                0x03, 0x05,
                0x34, 0x03, 0x03, 0x08, 0x14
            ]
        },
        'set nbiot apn': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 53,
                name: 'NBIOT_APN',
                data: { apn: 'nbiot' }
            },
            bytes: [
                0x03, 0x07,
                0x35, 0x05, 0x6e, 0x62, 0x69, 0x6f, 0x74
            ]
        },
        'set nbiot led indication': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 54,
                name: 'NBIOT_LED_INDICATION',
                data: {
                    enableLed: 1,
                    enableNbiotNetworkLed: 1
                }
            },
            bytes: [
                0x03, 0x03,
                0x36, 0x01, 0x01
            ]
        },
        'set nbiot sim pin code': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 55,
                name: 'NBIOT_SIM',
                data: {
                    enable: 1,
                    pin: 9999
                }
            },
            bytes: [
                0x03, 0x04,
                0x37, 0x01, 0x27, 0x0f
            ]
        },
        'set channel type. Channel index: 1, type: power channel': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 56,
                name: 'CHANNEL_TYPE',
                data: {
                    channel: 1,
                    type: POWER_CHANNEL,
                    parameters: {}
                }
            },
            bytes: [
                0x03, 0x03,
                0x38, 0x00, 0x02
            ]
        },
        'set channel type. Channel index: 2, type: binary sensor': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 56,
                name: 'CHANNEL_TYPE',
                data: {
                    channel: 2,
                    type: BINARY_SENSOR,
                    parameters: {
                        activeStateTimeMs: 5000
                    }
                }
            },
            bytes: [
                0x03, 0x05,
                0x38, 0x01, 0x03, 0x13, 0x88
            ]
        },
        'set channel type. Channel index: 3, type: temperature sensor': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 56,
                name: 'CHANNEL_TYPE',
                data: {
                    channel: 3,
                    type: TEMPERATURE_SENSOR,
                    parameters: {
                        measurementPeriod: 3600,
                        hysteresisSec: 2,
                        highTemperatureThreshold: 40,
                        lowTemperatureThreshold: 5
                    }
                }
            },
            bytes: [
                0x03, 0x08,
                0x38, 0x02, 0x04, 0x0e, 0x10, 0x02, 0x28, 0x05
            ]
        },
        'set channel type. Channel index: 4, type: idle': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 56,
                name: 'CHANNEL_TYPE',
                data: {
                    channel: 4,
                    type: IDLE,
                    parameters: {}
                }
            },
            bytes: [
                0x03, 0x03,
                0x38, 0x03, 0x00
            ]
        },
        'enable extra payload with signal quality on every uplink command': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 57,
                name: 'EXTRA_PAYLOAD_ENABLE',
                data: { enable: 1 }
            },
            bytes: [
                0x03, 0x02,
                0x39, 0x01
            ]
        },
        'time synchronization period in seconds via MAC commands': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 58,
                name: 'TIME_SYNCHRONIZATION_PERIOD_VIA_MAC',
                data: {
                    period: 1440
                }
            },
            bytes: [
                0x03, 0x05,
                0x3a, 0x00, 0x00, 0x05, 0xa0
            ]
        },
        'keep its lora connection even after being removed': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: {
                id: 59,
                name: 'KEEP_LORA_CONNECTION_ON_REMOVAL',
                data: {
                    value: true
                }
            },
            bytes: [
                0x03, 0x02,
                0x3b, 0x01
            ]
        }
    };
    const fromBytes$H = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getParameter();
    };
    const toBytes$H = (parameters) => {
        const buffer = new CommandBinaryBuffer(getParameterSize(parameters));
        buffer.setParameter(parameters);
        return toBytes$11(id$H, buffer.data);
    };

    var setParameter$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$H,
        fromBytes: fromBytes$H,
        headerSize: headerSize$H,
        id: id$H,
        name: name$H,
        toBytes: toBytes$H
    });

    const id$G = setTime2000$3;
    const name$G = commandNames$1[setTime2000$3];
    const headerSize$G = 2;
    const COMMAND_BODY_SIZE$g = 5;
    const examples$G = {
        'set time to 2023.04.03 14:01:17 GMT': {
            id: id$G,
            headerSize: headerSize$G,
            parameters: {
                sequenceNumber: 78,
                seconds: 733845677
            },
            bytes: [
                0x02, 0x05,
                0x4e, 0x2b, 0xbd, 0x98, 0xad
            ]
        }
    };
    const fromBytes$G = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$g) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            seconds: buffer.getInt32()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$G = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$g, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt32(seconds);
        return toBytes$11(id$G, buffer.data);
    };

    var setTime2000$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$G,
        id: id$G,
        name: name$G,
        toBytes: toBytes$G
    });

    const id$F = softRestart$3;
    const name$F = commandNames$1[softRestart$3];
    const headerSize$F = 2;
    const COMMAND_BODY_SIZE$f = 0;
    const examples$F = {
        'simple request': {
            id: id$F,
            name: name$F,
            headerSize: headerSize$F,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$F = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$f) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$F = () => toBytes$11(id$F);

    var softRestart$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$F,
        id: id$F,
        name: name$F,
        toBytes: toBytes$F
    });

    const id$E = updateRun$3;
    const name$E = commandNames$1[updateRun$3];
    const headerSize$E = 3;
    const COMMAND_BODY_SIZE$e = 0;
    const examples$E = {
        'simple request': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: {},
            bytes: [
                0x1f, 0x2c, 0x00
            ]
        }
    };
    const fromBytes$E = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$e) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$E = () => toBytes$11(id$E);

    var updateRun$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$E,
        fromBytes: fromBytes$E,
        headerSize: headerSize$E,
        id: id$E,
        name: name$E,
        toBytes: toBytes$E
    });

    const id$D = usWaterMeterCommand$3;
    const name$D = commandNames$1[usWaterMeterCommand$3];
    const headerSize$D = 3;
    const examples$D = {
        'request for current values': {
            id: id$D,
            headerSize: headerSize$D,
            parameters: {
                length: 3,
                data: [0x21, 0x02]
            },
            bytes: [
                0x1f, 0x07, 0x03,
                0x03, 0x21, 0x02
            ]
        }
    };
    const fromBytes$D = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const length = buffer.getUint8();
        return { length, data: data.slice(1) };
    };
    const toBytes$D = (parameters) => {
        const { data, length } = parameters;
        const buffer = new CommandBinaryBuffer(length);
        buffer.setUint8(length);
        buffer.setBytes(data);
        return toBytes$11(id$D, buffer.data);
    };

    var usWaterMeterCommand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$D,
        id: id$D,
        name: name$D,
        toBytes: toBytes$D
    });

    const id$C = verifyImage$3;
    const name$C = commandNames$1[verifyImage$3];
    const headerSize$C = 3;
    const COMMAND_BODY_SIZE$d = 0;
    const examples$C = {
        'simple request': {
            id: id$C,
            name: name$C,
            headerSize: headerSize$C,
            parameters: {},
            bytes: [
                0x1f, 0x2b, 0x00
            ]
        }
    };
    const fromBytes$C = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$d) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$C = () => toBytes$11(id$C);

    var verifyImage$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        name: name$C,
        toBytes: toBytes$C
    });

    const id$B = writeImage$3;
    const name$B = commandNames$1[writeImage$3];
    const headerSize$B = 3;
    const COMMAND_BODY_MIN_SIZE$2 = 4;
    const examples$B = {
        'write image': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: {
                offset: 64,
                data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
            },
            bytes: [
                0x1f, 0x2a, 0x14,
                0x00, 0x00, 0x00, 0x40, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
            ]
        }
    };
    const fromBytes$B = (data) => {
        if (data.length < COMMAND_BODY_MIN_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const offset = buffer.getUint32();
        return { offset, data: data.slice(COMMAND_BODY_MIN_SIZE$2) };
    };
    const toBytes$B = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$2);
        buffer.setUint32(parameters.offset);
        buffer.setBytes(parameters.data);
        return toBytes$11(id$B, buffer.data);
    };
    const toJson = (parameters) => JSON.stringify(parameters);

    var writeImage$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$B,
        fromBytes: fromBytes$B,
        headerSize: headerSize$B,
        id: id$B,
        name: name$B,
        toBytes: toBytes$B,
        toJson: toJson
    });

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000$2,
        dataSegment: dataSegment$2,
        getArchiveDays: getArchiveDays$2,
        getArchiveDaysMc: getArchiveDaysMc$2,
        getArchiveEvents: getArchiveEvents$2,
        getArchiveHours: getArchiveHours$2,
        getArchiveHoursMc: getArchiveHoursMc$2,
        getArchiveHoursMcEx: getArchiveHoursMcEx$2,
        getBatteryStatus: getBatteryStatus$2,
        getChannelsStatus: getChannelsStatus$2,
        getChannelsTypes: getChannelsTypes$2,
        getCurrent: getCurrent,
        getCurrentMc: getCurrentMc,
        getExAbsArchiveDaysMc: getExAbsArchiveDaysMc$2,
        getExAbsArchiveHoursMc: getExAbsArchiveHoursMc$2,
        getExAbsCurrentMc: getExAbsCurrentMc,
        getLmicInfo: getLmicInfo$2,
        getParameter: getParameter$2,
        getSignalQuality: getSignalQuality,
        getStatus: getStatus,
        getTime2000: getTime2000,
        setParameter: setParameter$2,
        setTime2000: setTime2000$2,
        softRestart: softRestart$2,
        updateRun: updateRun$2,
        usWaterMeterCommand: usWaterMeterCommand$2,
        verifyImage: verifyImage$2,
        writeImage: writeImage$2
    });

    const setTime2000$1 = 0x02;
    const setParameter$1 = 0x03;
    const getParameter$1 = 0x04;
    const getArchiveHours$1 = 0x05;
    const getArchiveDays$1 = 0x06;
    const current$1 = 0x07;
    const time2000$1 = 0x09;
    const getArchiveEvents$1 = 0x0b;
    const correctTime2000$1 = 0x0c;
    const status$1 = 0x14;
    const newEvent$1 = 0x15;
    const dayMc$1 = 0x16;
    const hourMc$1 = 0x17;
    const currentMc$1 = 0x18;
    const softRestart$1 = 0x19;
    const getArchiveHoursMc$1 = 0x1a;
    const getArchiveDaysMc$1 = 0x1b;
    const dataSegment$1 = 0x1e;
    const day$1 = 0x20;
    const hour$1 = 0x40;
    const lastEvent$1 = 0x60;
    const getLmicInfo$1 = 0x21f;
    const getBatteryStatus$1 = 0x51f;
    const usWaterMeterCommand$1 = 0x71f;
    const exAbsHourMc$1 = 0xa1f;
    const exAbsDayMc$1 = 0xb1f;
    const getExAbsArchiveHoursMc$1 = 0xc1f;
    const getExAbsArchiveDaysMc$1 = 0xd1f;
    const exAbsCurrentMc$1 = 0xf1f;
    const usWaterMeterBatteryStatus$1 = 0x141f;
    const writeImage$1 = 0x2a1f;
    const verifyImage$1 = 0x2b1f;
    const updateRun$1 = 0x2c1f;
    const getArchiveHoursMcEx$1 = 0x301f;
    const hourMcEx$1 = 0x311f;
    const getChannelsStatus$1 = 0x321f;
    const getChannelsTypes$1 = 0x331f;
    const signalQuality$1 = 0x341f;

    var uplinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000$1,
        current: current$1,
        currentMc: currentMc$1,
        dataSegment: dataSegment$1,
        day: day$1,
        dayMc: dayMc$1,
        exAbsCurrentMc: exAbsCurrentMc$1,
        exAbsDayMc: exAbsDayMc$1,
        exAbsHourMc: exAbsHourMc$1,
        getArchiveDays: getArchiveDays$1,
        getArchiveDaysMc: getArchiveDaysMc$1,
        getArchiveEvents: getArchiveEvents$1,
        getArchiveHours: getArchiveHours$1,
        getArchiveHoursMc: getArchiveHoursMc$1,
        getArchiveHoursMcEx: getArchiveHoursMcEx$1,
        getBatteryStatus: getBatteryStatus$1,
        getChannelsStatus: getChannelsStatus$1,
        getChannelsTypes: getChannelsTypes$1,
        getExAbsArchiveDaysMc: getExAbsArchiveDaysMc$1,
        getExAbsArchiveHoursMc: getExAbsArchiveHoursMc$1,
        getLmicInfo: getLmicInfo$1,
        getParameter: getParameter$1,
        hour: hour$1,
        hourMc: hourMc$1,
        hourMcEx: hourMcEx$1,
        lastEvent: lastEvent$1,
        newEvent: newEvent$1,
        setParameter: setParameter$1,
        setTime2000: setTime2000$1,
        signalQuality: signalQuality$1,
        softRestart: softRestart$1,
        status: status$1,
        time2000: time2000$1,
        updateRun: updateRun$1,
        usWaterMeterBatteryStatus: usWaterMeterBatteryStatus$1,
        usWaterMeterCommand: usWaterMeterCommand$1,
        verifyImage: verifyImage$1,
        writeImage: writeImage$1
    });

    var commandNames = invertObject(uplinkIds);

    const id$A = correctTime2000$1;
    const name$A = commandNames[correctTime2000$1];
    const headerSize$A = 2;
    const COMMAND_BODY_SIZE$c = 1;
    const examples$A = {
        'time correction failure': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            parameters: { status: 0 },
            bytes: [
                0x0c, 0x01,
                0x00
            ]
        },
        'time correction success': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            parameters: { status: 1 },
            bytes: [
                0x0c, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$A = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$c) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            status: buffer.getUint8()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$A = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$c, false);
        buffer.setUint8(status);
        return toBytes$11(id$A, buffer.data);
    };

    var correctTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$A,
        fromBytes: fromBytes$A,
        headerSize: headerSize$A,
        id: id$A,
        name: name$A,
        toBytes: toBytes$A
    });

    const id$z = current$1;
    const name$z = commandNames[current$1];
    const headerSize$z = 2;
    const COMMAND_BODY_MAX_SIZE$e = 4;
    const examples$z = {
        'simple response channels': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            parameters: { isMagneticInfluence: true, value: 342 },
            bytes: [
                0x07, 0x04,
                0x80, 0x00, 0x01, 0x56
            ]
        }
    };
    const fromBytes$z = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$e) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyCounter();
    };
    const toBytes$z = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$e);
        buffer.setLegacyCounter(parameters);
        return toBytes$11(id$z, buffer.data);
    };

    var current = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$z,
        fromBytes: fromBytes$z,
        headerSize: headerSize$z,
        id: id$z,
        name: name$z,
        toBytes: toBytes$z
    });

    const id$y = currentMc$1;
    const name$y = commandNames[currentMc$1];
    const headerSize$y = 2;
    const COMMAND_BODY_MAX_SIZE$d = 37;
    const examples$y = {
        '4 channels for IMP4EU': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            parameters: {
                channelList: [
                    { value: 131, index: 1 },
                    { value: 8, index: 2 },
                    { value: 10, index: 3 },
                    { value: 12, index: 4 }
                ]
            },
            bytes: [
                0x18, 0x06,
                0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c
            ]
        },
        'single channel for IMP2EU': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            parameters: {
                channelList: [
                    { value: 50, index: 2 }
                ]
            },
            bytes: [
                0x18, 0x02,
                0x02, 0x32
            ]
        },
        '3 channels for IMP4EU': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            parameters: {
                channelList: [
                    { value: 8146, index: 1 },
                    { value: 164, index: 3 },
                    { value: 75, index: 4 }
                ]
            },
            bytes: [
                0x18, 0x06,
                0x0d, 0xd2, 0x3f, 0xa4, 0x01, 0x4b
            ]
        },
        'single channel for ELIMP - max module value': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            parameters: {
                channelList: [
                    { value: 4294967295, index: 1 }
                ]
            },
            bytes: [
                0x18, 0x06,
                0x01, 0xff, 0xff, 0xff, 0xff, 0x0f
            ]
        }
    };
    const fromBytes$y = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$d) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const parameters = { channelList: [] };
        const buffer = new CommandBinaryBuffer(data);
        const channelList = buffer.getChannels();
        parameters.channelList = channelList.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));
        return parameters;
    };
    const toBytes$y = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$d);
        const { channelList } = parameters;
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$11(id$y, buffer.getBytesToOffset());
    };

    var currentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$y,
        id: id$y,
        name: name$y,
        toBytes: toBytes$y
    });

    var dataSegment = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$$,
        fromBytes: fromBytes$$,
        headerSize: headerSize$$,
        id: id$$,
        name: name$$,
        toBytes: toBytes$$,
        toJson: toJson$1
    });

    const id$x = day$1;
    const name$x = commandNames[day$1];
    const headerSize$x = 1;
    const COMMAND_BODY_SIZE$b = 6;
    const examples$x = {
        'day value for 2023.12.23 00:00:00 GMT': {
            id: id$x,
            name: name$x,
            headerSize: headerSize$x,
            parameters: {
                value: 122,
                isMagneticInfluence: true,
                startTime2000: 756604800
            },
            bytes: [
                0x26,
                0x2f, 0x97, 0x80, 0x00, 0x00, 0x7a
            ]
        }
    };
    const fromBytes$x = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const byte = buffer.getUint8();
        const { hour } = buffer.getHours(byte);
        const isMagneticInfluence = CommandBinaryBuffer.getMagneticInfluenceBit(byte);
        const value = buffer.getLegacyCounterValue();
        date.setUTCHours(hour);
        return { value, isMagneticInfluence, startTime2000: getTime2000FromDate(date) };
    };
    const toBytes$x = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$b);
        const { value, isMagneticInfluence, startTime2000 } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, 1);
        buffer.seek(buffer.offset - 1);
        const byte = buffer.getUint8();
        buffer.seek(buffer.offset - 1);
        buffer.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, isMagneticInfluence));
        buffer.setLegacyCounterValue(value);
        return toBytes$11(id$x, buffer.getBytesToOffset());
    };

    var day = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$x,
        fromBytes: fromBytes$x,
        headerSize: headerSize$x,
        id: id$x,
        name: name$x,
        toBytes: toBytes$x
    });

    const id$w = dayMc$1;
    const name$w = commandNames[dayMc$1];
    const headerSize$w = 2;
    const COMMAND_BODY_MAX_SIZE$c = 32;
    const examples$w = {
        '4 channels at 2023.12.23 00:00:00 GMT': {
            id: id$w,
            name: name$w,
            headerSize: headerSize$w,
            parameters: {
                startTime2000: 756604800,
                channelList: [
                    { value: 131, index: 3 },
                    { value: 8, index: 5 },
                    { value: 10, index: 7 },
                    { value: 12, index: 1 }
                ]
            },
            bytes: [
                0x16, 0x08,
                0x2f, 0x97, 0x55, 0x0c, 0x83, 0x01, 0x08, 0x0a
            ]
        }
    };
    const fromBytes$w = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$c) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const channelList = channels.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));
        return { startTime2000: getTime2000FromDate(date), channelList };
    };
    const toBytes$w = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$c);
        const { channelList, startTime2000 } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$11(id$w, buffer.getBytesToOffset());
    };

    var dayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$w,
        fromBytes: fromBytes$w,
        headerSize: headerSize$w,
        id: id$w,
        name: name$w,
        toBytes: toBytes$w
    });

    const id$v = exAbsCurrentMc$1;
    const name$v = commandNames[exAbsCurrentMc$1];
    const headerSize$v = 3;
    const COMMAND_BODY_MAX_SIZE$b = 87;
    const examples$v = {
        'absolute current value from channel 3': {
            id: id$v,
            name: name$v,
            headerSize: headerSize$v,
            parameters: {
                channelList: [
                    { pulseCoefficient: 100, value: 342, index: 3 }
                ]
            },
            bytes: [
                0x1f, 0x0f, 0x04,
                0x04, 0x83, 0xd6, 0x02
            ]
        }
    };
    const fromBytes$v = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return { channelList: buffer.getChannelsWithAbsoluteValues() };
    };
    const toBytes$v = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$b);
        buffer.setChannelsWithAbsoluteValues(parameters.channelList);
        return toBytes$11(id$v, buffer.getBytesToOffset());
    };

    var exAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$v,
        fromBytes: fromBytes$v,
        headerSize: headerSize$v,
        id: id$v,
        name: name$v,
        toBytes: toBytes$v
    });

    const id$u = exAbsDayMc$1;
    const name$u = commandNames[exAbsDayMc$1];
    const headerSize$u = 3;
    const COMMAND_BODY_MAX_SIZE$a = 89;
    const examples$u = {
        'absolute day value for 2023.03.10 00:00:00 GMT': {
            id: id$u,
            name: name$u,
            headerSize: headerSize$u,
            parameters: {
                startTime2000: 731721600,
                channelList: [
                    { pulseCoefficient: 100, value: 342, index: 1 }
                ]
            },
            bytes: [
                0x1f, 0x0b, 0x06,
                0x2e, 0x6a, 0x01, 0x83, 0xd6, 0x02
            ]
        }
    };
    const fromBytes$u = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$a) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannelsWithAbsoluteValues();
        return { startTime2000: getTime2000FromDate(date), channelList };
    };
    const toBytes$u = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$a);
        const { startTime2000, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannelsWithAbsoluteValues(channelList);
        return toBytes$11(id$u, buffer.getBytesToOffset());
    };

    var exAbsDayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$u,
        fromBytes: fromBytes$u,
        headerSize: headerSize$u,
        id: id$u,
        name: name$u,
        toBytes: toBytes$u
    });

    const id$t = exAbsHourMc$1;
    const name$t = commandNames[exAbsHourMc$1];
    const headerSize$t = 3;
    const COMMAND_BODY_MAX_SIZE$9 = 168;
    const examples$t = {
        '1 channel at 2023.03.10 12:00:00 GMT': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
            parameters: {
                startTime2000: 731764800,
                hours: 2,
                channelList: [
                    {
                        diff: [128],
                        value: 342457,
                        pulseCoefficient: 100,
                        index: 1
                    }
                ]
            },
            bytes: [
                0x1f, 0x0a, 0x0a,
                0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01
            ]
        }
    };
    const fromBytes$t = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$9) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const { hour, hours } = buffer.getHours();
        const channelList = buffer.getChannelsAbsoluteValuesWithHourDiff(hours);
        date.setUTCHours(hour);
        return { startTime2000: getTime2000FromDate(date), hours, channelList };
    };
    const toBytes$t = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$9);
        const { startTime2000, hours, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(startTime2000);
        buffer.setHours(hour, hours);
        buffer.setChannelsAbsoluteValuesWithHourDiff(channelList);
        return toBytes$11(id$t, buffer.getBytesToOffset());
    };

    var exAbsHourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$t,
        fromBytes: fromBytes$t,
        headerSize: headerSize$t,
        id: id$t,
        name: name$t,
        toBytes: toBytes$t
    });

    const id$s = getArchiveDays$1;
    const name$s = commandNames[getArchiveDays$1];
    const headerSize$s = 2;
    const COMMAND_BODY_MIN_SIZE$1 = 2;
    const DAY_COUNTER_SIZE = 4;
    const examples$s = {
        'get day values from 2001.03.10': {
            id: id$s,
            name: name$s,
            headerSize: headerSize$s,
            parameters: {
                startTime2000: 2678227200,
                dayList: [
                    { isMagneticInfluence: true, value: 234 }
                ]
            },
            bytes: [
                0x06, 0x06,
                0xa9, 0x6d, 0x80, 0x00, 0x00, 0xea
            ]
        }
    };
    const fromBytes$s = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const dayList = [];
        while (buffer.offset < buffer.data.length) {
            dayList.push(buffer.getLegacyCounter(undefined, true));
        }
        return { startTime2000: getTime2000FromDate(date), dayList };
    };
    const toBytes$s = (parameters) => {
        const { startTime2000, dayList } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$1 + (dayList.length * DAY_COUNTER_SIZE));
        buffer.setDate(startTime2000);
        dayList.forEach(dayCounter => buffer.setLegacyCounter(dayCounter, undefined, true));
        return toBytes$11(id$s, buffer.getBytesToOffset());
    };

    var getArchiveDays = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$s,
        fromBytes: fromBytes$s,
        headerSize: headerSize$s,
        id: id$s,
        name: name$s,
        toBytes: toBytes$s
    });

    const id$r = getArchiveDaysMc$1;
    const name$r = commandNames[getArchiveDaysMc$1];
    const headerSize$r = 2;
    const COMMAND_BODY_MAX_SIZE$8 = 255;
    const examples$r = {
        'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
            id: id$r,
            name: name$r,
            headerSize: headerSize$r,
            parameters: {
                startTime2000: 2678227200,
                days: 2,
                channelList: [{ dayList: [234, 332], index: 1 }]
            },
            bytes: [
                0x1b, 0x08,
                0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02
            ]
        },
        'empty result from 2010.10.09 00:00:00 GMT for channel 1': {
            id: id$r,
            name: name$r,
            headerSize: headerSize$r,
            parameters: {
                startTime2000: 339897600,
                days: 1,
                channelList: [{ dayList: [0], index: 1 }]
            },
            bytes: [
                0x1b, 0x09,
                0x15, 0x49, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0x0f
            ]
        }
    };
    const fromBytes$r = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList = [];
        channels.forEach(channelIndex => {
            const dayList = [];
            channelList.push({ dayList, index: channelIndex });
            for (let day = 0; day < days; ++day) {
                const value = buffer.getExtendedValue();
                dayList.push(value === EMPTY_VALUE ? 0 : value);
            }
        });
        return { startTime2000: getTime2000FromDate(date), days, channelList };
    };
    const toBytes$r = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$8);
        const { startTime2000, days, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);
        channelList.forEach(({ dayList }) => {
            dayList.forEach(value => {
                buffer.setExtendedValue(value === 0 ? EMPTY_VALUE : value);
            });
        });
        return toBytes$11(id$r, buffer.getBytesToOffset());
    };

    var getArchiveDaysMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$r,
        fromBytes: fromBytes$r,
        headerSize: headerSize$r,
        id: id$r,
        name: name$r,
        toBytes: toBytes$r
    });

    const MAGNET_ON = 1;
    const MAGNET_OFF = 2;
    const ACTIVATE = 3;
    const DEACTIVATE = 4;
    const BATTERY_ALARM = 5;
    const CAN_OFF = 6;
    const INSERT = 7;
    const REMOVE = 8;
    const COUNTER_OVER = 9;
    const SET_TIME = 10;
    const ACTIVATE_MTX = 11;
    const CONNECT = 12;
    const DISCONNECT = 13;
    const DEPASS_DONE = 14;
    const OPTOLOW = 15;
    const OPTOFLASH = 16;
    const MTX = 17;
    const JOIN_ACCEPT = 18;
    const WATER_EVENT = 19;
    const WATER_NO_RESPONSE = 20;
    const OPTOSENSOR_ERROR = 21;
    const BINARY_SENSOR_ON = 22;
    const BINARY_SENSOR_OFF = 23;
    const TEMPERATURE_SENSOR_HYSTERESIS = 24;
    const TEMPERATURE_SENSOR_LOW_TEMPERATURE = 25;
    const TEMPERATURE_SENSOR_HIGH_TEMPERATURE = 26;

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIVATE: ACTIVATE,
        ACTIVATE_MTX: ACTIVATE_MTX,
        BATTERY_ALARM: BATTERY_ALARM,
        BINARY_SENSOR_OFF: BINARY_SENSOR_OFF,
        BINARY_SENSOR_ON: BINARY_SENSOR_ON,
        CAN_OFF: CAN_OFF,
        CONNECT: CONNECT,
        COUNTER_OVER: COUNTER_OVER,
        DEACTIVATE: DEACTIVATE,
        DEPASS_DONE: DEPASS_DONE,
        DISCONNECT: DISCONNECT,
        INSERT: INSERT,
        JOIN_ACCEPT: JOIN_ACCEPT,
        MAGNET_OFF: MAGNET_OFF,
        MAGNET_ON: MAGNET_ON,
        MTX: MTX,
        OPTOFLASH: OPTOFLASH,
        OPTOLOW: OPTOLOW,
        OPTOSENSOR_ERROR: OPTOSENSOR_ERROR,
        REMOVE: REMOVE,
        SET_TIME: SET_TIME,
        TEMPERATURE_SENSOR_HIGH_TEMPERATURE: TEMPERATURE_SENSOR_HIGH_TEMPERATURE,
        TEMPERATURE_SENSOR_HYSTERESIS: TEMPERATURE_SENSOR_HYSTERESIS,
        TEMPERATURE_SENSOR_LOW_TEMPERATURE: TEMPERATURE_SENSOR_LOW_TEMPERATURE,
        WATER_EVENT: WATER_EVENT,
        WATER_NO_RESPONSE: WATER_NO_RESPONSE
    });

    var eventNames = invertObject(events);

    const id$q = getArchiveEvents$1;
    const name$q = commandNames[getArchiveEvents$1];
    const headerSize$q = 2;
    const COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    const examples$q = {
        '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
            id: id$q,
            name: name$q,
            headerSize: headerSize$q,
            parameters: {
                eventList: [
                    {
                        time2000: 734015840,
                        id: 1,
                        name: 'MAGNET_ON',
                        sequenceNumber: 1
                    }
                ]
            },
            bytes: [
                0x0b, 0x06,
                0x2b, 0xc0, 0x31, 0x60, 0x01, 0x01
            ]
        },
        '4 events': {
            id: id$q,
            name: name$q,
            headerSize: headerSize$q,
            parameters: {
                eventList: [
                    {
                        time2000: 734015840,
                        id: 2,
                        name: 'MAGNET_OFF',
                        sequenceNumber: 1
                    },
                    {
                        time2000: 734025840,
                        id: 1,
                        name: 'MAGNET_ON',
                        sequenceNumber: 2
                    },
                    {
                        time2000: 734035840,
                        id: 3,
                        name: 'ACTIVATE',
                        sequenceNumber: 3
                    },
                    {
                        time2000: 734045840,
                        id: 4,
                        name: 'DEACTIVATE',
                        sequenceNumber: 4
                    }
                ]
            },
            bytes: [
                0x0b, 0x18,
                0x2b, 0xc0, 0x31, 0x60, 0x02, 0x01, 0x2b, 0xc0,
                0x58, 0x70, 0x01, 0x02, 0x2b, 0xc0, 0x7f, 0x80,
                0x03, 0x03, 0x2b, 0xc0, 0xa6, 0x90, 0x04, 0x04
            ]
        }
    };
    const getEvent = (buffer) => {
        const time2000 = buffer.getTime();
        const eventId = buffer.getUint8();
        const sequenceNumber = buffer.getUint8();
        return {
            time2000,
            id: eventId,
            name: eventNames[eventId],
            sequenceNumber
        };
    };
    const setEvent = (buffer, event) => {
        buffer.setTime(event.time2000);
        buffer.setUint8(event.id);
        buffer.setUint8(event.sequenceNumber);
    };
    const fromBytes$q = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const eventList = [];
        while (buffer.bytesLeft > 0) {
            eventList.push(getEvent(buffer));
        }
        return { eventList };
    };
    function toBytes$q(parameters) {
        const { eventList } = parameters;
        const buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE);
        eventList.forEach(event => setEvent(buffer, event));
        return toBytes$11(id$q, buffer.data);
    }

    var getArchiveEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$q,
        fromBytes: fromBytes$q,
        headerSize: headerSize$q,
        id: id$q,
        name: name$q,
        toBytes: toBytes$q
    });

    const id$p = getArchiveHours$1;
    const name$p = commandNames[getArchiveHours$1];
    const headerSize$p = 2;
    const examples$p = {
        '1 hour archive from 2023.12.23 12:00:00 GMT': {
            id: id$p,
            name: name$p,
            headerSize: headerSize$p,
            parameters: {
                startTime2000: 756648000,
                counter: { isMagneticInfluence: true, value: 163 },
                diff: [
                    { isMagneticInfluence: true, value: 10 }
                ]
            },
            bytes: [
                0x05, 0x08,
                0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a
            ]
        }
    };
    const fromBytes$p = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyHourCounterWithDiff(true);
    };
    const toBytes$p = (parameters) => {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
        buffer.setLegacyHourCounterWithDiff(parameters, true);
        return toBytes$11(id$p, buffer.getBytesToOffset());
    };

    var getArchiveHours = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$p,
        fromBytes: fromBytes$p,
        headerSize: headerSize$p,
        id: id$p,
        name: name$p,
        toBytes: toBytes$p
    });

    const id$o = getArchiveHoursMc$1;
    const name$o = commandNames[getArchiveHoursMc$1];
    const headerSize$o = 2;
    const COMMAND_BODY_MAX_SIZE$7 = 164;
    const examples$o = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            parameters: {
                startTime2000: 756648000,
                hours: 2,
                channelList: [
                    { value: 131, diff: [10], index: 1 },
                    { value: 8, diff: [10], index: 2 },
                    { value: 8, diff: [10], index: 3 },
                    { value: 12, diff: [10], index: 4 }
                ]
            },
            bytes: [
                0x1a, 0x0d,
                0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
            ]
        },
        'empty result at 2023.11.19 00:00:00 GMT': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            parameters: {
                startTime2000: 752889600,
                hours: 0,
                channelList: []
            },
            bytes: [
                0x1a, 0x04,
                0x2f, 0x6a, 0x00, 0x00
            ]
        }
    };
    const fromBytes$o = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$7) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff(true);
    };
    const toBytes$o = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
        const { hours, startTime2000, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList, true);
        return toBytes$11(id$o, buffer.getBytesToOffset());
    };

    var getArchiveHoursMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$o,
        fromBytes: fromBytes$o,
        headerSize: headerSize$o,
        id: id$o,
        name: name$o,
        toBytes: toBytes$o
    });

    const id$n = getArchiveHoursMcEx$1;
    const name$n = commandNames[getArchiveHoursMcEx$1];
    const headerSize$n = 3;
    const COMMAND_BODY_MAX_SIZE$6 = 255;
    const examples$n = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
            parameters: {
                startTime2000: 756648000,
                hour: 12,
                hours: 1,
                channelList: [
                    { value: 131, diff: [10], index: 1 },
                    { value: 8, diff: [10], index: 2 },
                    { value: 8, diff: [10], index: 3 },
                    { value: 12, diff: [10], index: 4 }
                ]
            },
            bytes: [
                0x1f, 0x30, 0x0e,
                0x2f, 0x97, 0x0c, 0x01, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
            ]
        },
        'empty result at 2023.11.19 00:00:00 GMT': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
            parameters: {
                startTime2000: 752889600,
                hour: 0,
                hours: 0,
                channelList: []
            },
            bytes: [
                0x1f, 0x30, 0x05,
                0x2f, 0x6a, 0x00, 0x00, 0x00
            ]
        }
    };
    const fromBytes$n = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$6) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiffExtended(true);
    };
    const toBytes$n = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
        buffer.setChannelsValuesWithHourDiffExtended(parameters, true);
        return toBytes$11(id$n, buffer.getBytesToOffset());
    };

    var getArchiveHoursMcEx = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        name: name$n,
        toBytes: toBytes$n
    });

    const id$m = getBatteryStatus$1;
    const name$m = commandNames[getBatteryStatus$1];
    const headerSize$m = 3;
    const COMMAND_BODY_SIZE$a = 11;
    const examples$m = {
        'simple response': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            parameters: {
                voltageUnderLowLoad: 3600,
                voltageUnderHighLoad: 3600,
                internalResistance: 1034,
                temperature: 15,
                remainingCapacity: 41,
                isLastDayOverconsumption: false,
                averageDailyOverconsumptionCounter: 34
            },
            bytes: [
                0x1f, 0x05, 0x0b,
                0x0e, 0x10, 0x0e, 0x10, 0x04, 0x0a, 0x0f, 0x29, 0x00, 0x00, 0x22
            ]
        }
    };
    const fromBytes$m = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return {
            voltageUnderLowLoad: buffer.getUint16(),
            voltageUnderHighLoad: buffer.getUint16(),
            internalResistance: buffer.getUint16(),
            temperature: buffer.getUint8(),
            remainingCapacity: buffer.getUint8(),
            isLastDayOverconsumption: buffer.getUint8() === 1,
            averageDailyOverconsumptionCounter: buffer.getUint16()
        };
    };
    const toBytes$m = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$a);
        buffer.setUint16(parameters.voltageUnderLowLoad);
        buffer.setUint16(parameters.voltageUnderHighLoad);
        buffer.setUint16(parameters.internalResistance);
        buffer.setUint8(parameters.temperature);
        buffer.setUint8(parameters.remainingCapacity);
        buffer.setUint8(parameters.isLastDayOverconsumption ? 1 : 0);
        buffer.setUint16(parameters.averageDailyOverconsumptionCounter);
        return toBytes$11(id$m, buffer.data);
    };

    var getBatteryStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        name: name$m,
        toBytes: toBytes$m
    });

    var channelNames = invertObject(channelTypes);

    const id$l = getChannelsStatus$1;
    const name$l = commandNames[getChannelsStatus$1];
    const headerSize$l = 3;
    const examples$l = {
        'binary sensor, channel: 1, state: true': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: [
                {
                    type: BINARY_SENSOR,
                    typeName: 'BINARY_SENSOR',
                    channel: 1,
                    status: {
                        state: true
                    }
                }
            ],
            bytes: [
                0x1f, 0x32, 0x03, 0x03, 0x00, 0x01
            ]
        },
        'temperature sensor, channel: 3, temperature: 24': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: [
                {
                    type: TEMPERATURE_SENSOR,
                    typeName: 'TEMPERATURE_SENSOR',
                    channel: 3,
                    status: {
                        temperature: 24,
                        time2000: 22720
                    }
                }
            ],
            bytes: [
                0x1f, 0x32, 0x07, 0x04, 0x02, 0x18, 0x00, 0x00, 0x58, 0xc0
            ]
        },
        'binary and temperature sensors': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: [
                {
                    type: BINARY_SENSOR,
                    typeName: 'BINARY_SENSOR',
                    channel: 1,
                    status: {
                        state: true
                    }
                },
                {
                    type: TEMPERATURE_SENSOR,
                    typeName: 'TEMPERATURE_SENSOR',
                    channel: 3,
                    status: {
                        temperature: 20,
                        time2000: 22720
                    }
                }
            ],
            bytes: [
                0x1f, 0x32, 0x0a, 0x03, 0x00, 0x01, 0x04, 0x02, 0x14, 0x00, 0x00, 0x58, 0xc0
            ]
        }
    };
    const getBufferSize = (channelsStatus) => {
        let size = 0;
        for (let index = 0; index < channelsStatus.length; index++) {
            size += 2;
            switch (channelsStatus[index].type) {
                case BINARY_SENSOR:
                case TEMPERATURE_SENSOR:
                    size += 1;
                    break;
            }
        }
        return size;
    };
    const getBinarySensorStatus = (buffer) => ({
        state: buffer.getUint8() !== 0
    });
    const setBinarySensorStatus = (status, buffer) => {
        buffer.setUint8(status.state ? 1 : 0);
    };
    const getTemperatureSensorStatus = (buffer) => ({
        temperature: buffer.getInt8(),
        time2000: buffer.getTime()
    });
    const setTemperatureSensorStatus = (status, buffer) => {
        buffer.setInt8(status.temperature);
        buffer.setTime(status.time2000);
    };
    const fromBytes$l = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const result = [];
        while (buffer.bytesLeft !== 0) {
            const type = buffer.getUint8();
            const channelStatus = {
                type,
                typeName: channelNames[type],
                channel: buffer.getChannelValue()
            };
            switch (channelStatus.type) {
                case BINARY_SENSOR:
                    channelStatus.status = getBinarySensorStatus(buffer);
                    break;
                case TEMPERATURE_SENSOR:
                    channelStatus.status = getTemperatureSensorStatus(buffer);
                    break;
                default:
                    return result;
            }
            result.push(channelStatus);
        }
        return result;
    };
    const toBytes$l = (channelsStatus) => {
        const buffer = new CommandBinaryBuffer(getBufferSize(channelsStatus));
        for (let index = 0; index < channelsStatus.length; index++) {
            const { type, channel, status } = channelsStatus[index];
            buffer.setUint8(type);
            buffer.setChannelValue(channel);
            switch (type) {
                case BINARY_SENSOR:
                    setBinarySensorStatus(status, buffer);
                    break;
                case TEMPERATURE_SENSOR:
                    setTemperatureSensorStatus(status, buffer);
                    break;
            }
        }
        return toBytes$11(id$l, buffer.data);
    };

    var getChannelsStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        name: name$l,
        toBytes: toBytes$l
    });

    const id$k = getChannelsTypes$1;
    const name$k = commandNames[getChannelsTypes$1];
    const headerSize$k = 3;
    const examples$k = {
        'channels: [POWER_CHANNEL (2), BINARY_SENSOR (3), TEMPERATURE_SENSOR (4), IDLE (0)]': {
            id: id$k,
            name: name$k,
            headerSize: headerSize$k,
            parameters: {
                channels: [
                    { type: 2, typeName: 'POWER_CHANNEL' },
                    { type: 3, typeName: 'BINARY_SENSOR' },
                    { type: 4, typeName: 'TEMPERATURE_SENSOR' },
                    { type: 0, typeName: 'IDLE' }
                ]
            },
            bytes: [
                0x1f, 0x33, 0x04, 0x02, 0x03, 0x04, 0x00
            ]
        }
    };
    const fromBytes$k = (data) => ({
        channels: data.map(type => ({ type, typeName: channelNames[type] }))
    });
    const toBytes$k = ({ channels }) => (toBytes$11(id$k, channels.map(channel => channel.type)));

    var getChannelsTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        name: name$k,
        toBytes: toBytes$k
    });

    const id$j = getExAbsArchiveDaysMc$1;
    const name$j = commandNames[getExAbsArchiveDaysMc$1];
    const headerSize$j = 3;
    const COMMAND_BODY_MAX_SIZE$5 = 255;
    const examples$j = {
        'archive days values at 4 channel from 2023.03.10 00:00:00 GMT': {
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
            parameters: {
                channelList: [
                    {
                        pulseCoefficient: 100,
                        dayList: [5524, 5674],
                        index: 4
                    }
                ],
                days: 2,
                startTime2000: 731721600
            },
            bytes: [
                0x1f, 0x0d, 0x09,
                0x2e, 0x6a, 0x08, 0x02, 0x83, 0x94, 0x2b, 0xaa, 0x2c
            ]
        }
    };
    const fromBytes$j = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList = [];
        channels.forEach(channelIndex => {
            const dayList = [];
            const pulseCoefficient = buffer.getPulseCoefficient();
            channelList.push({
                pulseCoefficient,
                dayList,
                index: channelIndex
            });
            for (let day = 0; day < days; ++day) {
                const value = buffer.getExtendedValue();
                dayList.push(value === EMPTY_VALUE ? 0 : value);
            }
        });
        return { channelList, days, startTime2000: getTime2000FromDate(date) };
    };
    const toBytes$j = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$5);
        const { channelList, startTime2000, days } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);
        channelList.forEach(({ pulseCoefficient, dayList }) => {
            buffer.setPulseCoefficient(pulseCoefficient);
            dayList.forEach(value => {
                buffer.setExtendedValue(value === 0 ? EMPTY_VALUE : value);
            });
        });
        return toBytes$11(id$j, buffer.getBytesToOffset());
    };

    var getExAbsArchiveDaysMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        name: name$j,
        toBytes: toBytes$j
    });

    const id$i = getExAbsArchiveHoursMc$1;
    const name$i = commandNames[getExAbsArchiveHoursMc$1];
    const headerSize$i = 3;
    const COMMAND_BODY_MAX_SIZE$4 = 164;
    const examples$i = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
            parameters: {
                startTime2000: 756648000,
                hours: 2,
                channelList: [
                    { value: 131, diff: [10], index: 1 },
                    { value: 8, diff: [10], index: 2 },
                    { value: 8, diff: [10], index: 3 },
                    { value: 12, diff: [10], index: 4 }
                ]
            },
            bytes: [
                0x1f, 0x0c, 0x0d,
                0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
            ]
        },
        'empty result at 2023.11.19 00:00:00 GMT': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
            parameters: {
                startTime2000: 752889600,
                hours: 0,
                channelList: []
            },
            bytes: [
                0x1f, 0x0c, 0x04,
                0x2f, 0x6a, 0x00, 0x00
            ]
        }
    };
    const fromBytes$i = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff(true);
    };
    const toBytes$i = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
        buffer.setChannelsValuesWithHourDiff(parameters.hours, parameters.startTime2000, parameters.channelList, true);
        return toBytes$11(id$i, buffer.getBytesToOffset());
    };

    var getExAbsArchiveHoursMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$i,
        fromBytes: fromBytes$i,
        headerSize: headerSize$i,
        id: id$i,
        name: name$i,
        toBytes: toBytes$i
    });

    const id$h = getLmicInfo$1;
    const name$h = commandNames[getLmicInfo$1];
    const headerSize$h = 3;
    const COMMAND_BODY_SIZE$9 = 2;
    const lmicCapabilitiesBitMask = {
        isMulticastSupported: 1 << 0,
        isFragmentedDataSupported: 1 << 1
    };
    const examples$h = {
        'version: 5, support only multicast': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
            parameters: {
                capabilities: {
                    isMulticastSupported: true,
                    isFragmentedDataSupported: false
                },
                version: 5
            },
            bytes: [
                0x1f, 0x02, 0x02,
                0x01, 0x05
            ]
        },
        'version: 8, support multicast and fragmented data': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
            parameters: {
                capabilities: {
                    isMulticastSupported: true,
                    isFragmentedDataSupported: true
                },
                version: 8
            },
            bytes: [
                0x1f, 0x02, 0x02,
                0x03, 0x08
            ]
        }
    };
    const fromBytes$h = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$9) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data);
        const capabilities = toObject(lmicCapabilitiesBitMask, buffer.getUint8());
        const version = buffer.getUint8();
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return { capabilities, version };
    };
    const toBytes$h = (parameters) => {
        const { capabilities, version } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$9);
        buffer.setUint8(fromObject(lmicCapabilitiesBitMask, capabilities));
        buffer.setUint8(version);
        return toBytes$11(id$h, buffer.data);
    };

    var getLmicInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        name: name$h,
        toBytes: toBytes$h
    });

    const id$g = getParameter$1;
    const name$g = commandNames[getParameter$1];
    const headerSize$g = 2;
    const examples$g = {
        'reporting data interval': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 1,
                name: 'REPORTING_DATA_INTERVAL',
                data: {
                    specialSchedulePeriod: 0,
                    firstDaysSpecialSchedule: 0,
                    lastDaysSpecialSchedule: 0,
                    period: 2400
                }
            },
            bytes: [
                0x04, 0x05,
                0x01, 0x00, 0x00, 0x00, 0x04
            ]
        },
        'get spread factor and frequency for RX2 window': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 18,
                name: 'RX2_CONFIG',
                data: {
                    spreadFactor: 5,
                    spreadFactorName: 'SF7B125',
                    frequency: 20000
                }
            },
            bytes: [
                0x04, 0x05,
                0x12, 0x05, 0x00, 0x00, 0xc8
            ]
        },
        'absolute data (not multichannel device)': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 23,
                name: 'ABSOLUTE_DATA',
                data: { meterValue: 204, pulseCoefficient: 100, value: 2023 }
            },
            bytes: [
                0x04, 0x0a,
                0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
            ]
        },
        'state of absolute data (not multichannel device)': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 24,
                name: 'ABSOLUTE_DATA_ENABLE',
                data: { state: 1 }
            },
            bytes: [
                0x04, 0x02,
                0x18, 0x01
            ]
        },
        'absolute data for multichannel device (1 channel)': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 29,
                name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
                data: { channel: 1, meterValue: 402, pulseCoefficient: 1000, value: 2032 }
            },
            bytes: [
                0x04, 0x0b,
                0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
            ]
        },
        'state of absolute data for multichannel device (1 channel)': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 30,
                name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
                data: { channel: 2, state: 1 }
            },
            bytes: [
                0x04, 0x03,
                0x1e, 0x01, 0x01
            ]
        },
        'nbiot module info': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 51,
                name: 'NBIOT_MODULE_INFO',
                data: {
                    moduleInfo: 'BC660KGLAAR01A05'
                }
            },
            bytes: [
                0x04, 0x12,
                0x33, 0x10, 0x42, 0x43, 0x36, 0x36, 0x30, 0x4B, 0x47, 0x4C, 0x41, 0x41, 0x52, 0x30, 0x31, 0x41, 0x30, 0x35
            ]
        },
        'nbiot bands': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 52,
                name: 'NBIOT_BANDS',
                data: { bands: [3, 20] }
            },
            bytes: [
                0x04, 0x04,
                0x34, 0x02, 0x03, 0x14
            ]
        },
        'time synchronization period in seconds via MAC commands': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 58,
                name: 'TIME_SYNCHRONIZATION_PERIOD_VIA_MAC',
                data: {
                    period: 1440
                }
            },
            bytes: [
                0x04, 0x05,
                0x3a, 0x00, 0x00, 0x05, 0xa0
            ]
        },
        'keep lora connection even after being removed': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {
                id: 59,
                name: 'KEEP_LORA_CONNECTION_ON_REMOVAL',
                data: {
                    value: true
                }
            },
            bytes: [
                0x04, 0x02,
                0x3b, 0x01
            ]
        }
    };
    const fromBytes$g = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getResponseParameter();
    };
    const toBytes$g = (parameters) => {
        const buffer = new CommandBinaryBuffer(getResponseParameterSize(parameters));
        buffer.setResponseParameter(parameters);
        return toBytes$11(id$g, buffer.data);
    };

    var getParameter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$g,
        fromBytes: fromBytes$g,
        headerSize: headerSize$g,
        id: id$g,
        name: name$g,
        toBytes: toBytes$g
    });

    const id$f = signalQuality$1;
    const name$f = commandNames[signalQuality$1];
    const headerSize$f = 3;
    const COMMAND_BODY_SIZE$8 = 6;
    const examples$f = {
        'response for signal quality': {
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
            parameters: {
                rssi: -73,
                rsrp: -77,
                rsrq: -4,
                sinr: 18,
                txPower: 1,
                ecl: 0
            },
            bytes: [
                0x1f, 0x34, 0x06,
                0xb7, 0xb3, 0xfc, 0x12, 0x01, 0x00
            ]
        }
    };
    const fromBytes$f = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$8) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            rssi: buffer.getInt8(),
            rsrp: buffer.getInt8(),
            rsrq: buffer.getInt8(),
            sinr: buffer.getInt8(),
            txPower: buffer.getInt8(),
            ecl: buffer.getUint8()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$f = (parameters) => {
        const { rssi, rsrp, rsrq, sinr, txPower, ecl } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$8, false);
        buffer.setInt8(rssi);
        buffer.setInt8(rsrp);
        buffer.setInt8(rsrq);
        buffer.setInt8(sinr);
        buffer.setInt8(txPower);
        buffer.setUint8(ecl);
        return toBytes$11(id$f, buffer.data);
    };

    var signalQuality = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$f,
        fromBytes: fromBytes$f,
        headerSize: headerSize$f,
        id: id$f,
        name: name$f,
        toBytes: toBytes$f
    });

    const id$e = hour$1;
    const name$e = commandNames[hour$1];
    const headerSize$e = 1;
    const examples$e = {
        '1 hour from 2023.12.23 12:00:00 GMT': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            parameters: {
                startTime2000: 756648000,
                counter: { isMagneticInfluence: true, value: 163 },
                diff: [
                    { isMagneticInfluence: true, value: 10 }
                ]
            },
            bytes: [
                0x48,
                0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a
            ]
        }
    };
    const fromBytes$e = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyHourCounterWithDiff();
    };
    const toBytes$e = (parameters) => {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
        buffer.setLegacyHourCounterWithDiff(parameters);
        return toBytes$11(id$e, buffer.getBytesToOffset());
    };

    var hour = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$e,
        fromBytes: fromBytes$e,
        headerSize: headerSize$e,
        id: id$e,
        name: name$e,
        toBytes: toBytes$e
    });

    const id$d = hourMc$1;
    const name$d = commandNames[hourMc$1];
    const headerSize$d = 2;
    const COMMAND_BODY_MAX_SIZE$3 = 164;
    const examples$d = {
        '4 first channels at 2023.12.23 12:00:00 GMT': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                startTime2000: 756648000,
                hours: 2,
                channelList: [
                    { value: 131, diff: [10], index: 1 },
                    { value: 832, diff: [12], index: 2 },
                    { value: 38, diff: [8], index: 3 },
                    { value: 234, diff: [11], index: 4 }
                ]
            },
            bytes: [
                0x17, 0x0f,
                0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0xc0,
                0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b
            ]
        }
    };
    const fromBytes$d = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$3) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$d = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
        const { startTime2000, hours, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);
        return toBytes$11(id$d, buffer.getBytesToOffset());
    };

    var hourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$d,
        fromBytes: fromBytes$d,
        headerSize: headerSize$d,
        id: id$d,
        name: name$d,
        toBytes: toBytes$d
    });

    const id$c = hourMcEx$1;
    const name$c = commandNames[hourMcEx$1];
    const headerSize$c = 3;
    const COMMAND_BODY_MAX_SIZE$2 = 255;
    const examples$c = {
        '1 channel at 2023.12.23 12:00:00 GMT': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
            parameters: {
                startTime2000: 756648000,
                hour: 12,
                hours: 7,
                channelList: [
                    { value: 131, diff: [10, 10, 10, 10, 10, 10, 10], index: 1 }
                ]
            },
            bytes: [
                0x1f, 0x31, 0x0e,
                0x2f, 0x97, 0x0c, 0x07, 0x01, 0x83, 0x01, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a
            ]
        }
    };
    const fromBytes$c = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiffExtended();
    };
    const toBytes$c = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
        buffer.setChannelsValuesWithHourDiffExtended(parameters);
        return toBytes$11(id$c, buffer.getBytesToOffset());
    };

    var hourMcEx = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$c,
        fromBytes: fromBytes$c,
        headerSize: headerSize$c,
        id: id$c,
        name: name$c,
        toBytes: toBytes$c
    });

    const id$b = lastEvent$1;
    const name$b = commandNames[lastEvent$1];
    const headerSize$b = 1;
    const examples$b = {
        'status for GASI3': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            parameters: {
                sequenceNumber: 32,
                status: {
                    isBatteryLow: true,
                    isMagneticInfluence: false,
                    isButtonReleased: false,
                    isConnectionLost: true
                }
            },
            config: {
                hardwareType: GASI3
            },
            bytes: [
                0x62,
                0x20, 0x09
            ]
        },
        'status for IMP4EU': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            parameters: {
                sequenceNumber: 16,
                status: {
                    isBatteryLow: true,
                    isConnectionLost: false,
                    isFirstChannelInactive: false,
                    isSecondChannelInactive: true,
                    isThirdChannelInactive: true,
                    isForthChannelInactive: true
                }
            },
            config: {
                hardwareType: IMP4EU
            },
            bytes: [
                0x63,
                0x10, 0xe1, 0x01
            ]
        },
        'status for IMP4EU (all false)': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            parameters: {
                sequenceNumber: 16,
                status: {
                    isBatteryLow: false,
                    isConnectionLost: false,
                    isFirstChannelInactive: false,
                    isSecondChannelInactive: false,
                    isThirdChannelInactive: false,
                    isForthChannelInactive: false
                }
            },
            config: {
                hardwareType: IMP4EU
            },
            bytes: [
                0x63,
                0x10, 0x80, 0x00
            ]
        },
        'status for MTXLORA': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            parameters: {
                sequenceNumber: 48,
                status: {
                    isMeterCaseOpen: true,
                    isMagneticInfluence: true,
                    isParametersSetRemotely: false,
                    isParametersSetLocally: false,
                    isMeterProgramRestarted: false,
                    isLockedOut: false,
                    isTimeSet: false,
                    isTimeCorrected: true,
                    isMeterFailure: false,
                    isMeterTerminalBoxOpen: true,
                    isModuleCompartmentOpen: false,
                    isTariffPlanChanged: true,
                    isNewTariffPlanReceived: false
                }
            },
            config: {
                hardwareType: MTXLORA
            },
            bytes: [
                0x63,
                0x30, 0x83, 0x0a
            ]
        },
        'status for Ultrasound water meter': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            parameters: {
                sequenceNumber: 48,
                status: {
                    event: {
                        transportMode: false,
                        frequencyOutput: false,
                        reverseFlow: true,
                        tamperBreak: false,
                        leakage: true,
                        pipeBreak: true,
                        pipeEmpty: false,
                        batteryDischarge: false
                    },
                    error: 0
                }
            },
            config: {
                hardwareType: US_WATER
            },
            bytes: [
                0x63,
                0x30, 0x34, 0x00
            ]
        }
    };
    const fromBytes$b = (data, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        const status = buffer.getEventStatus(config.hardwareType);
        return { sequenceNumber, status };
    };
    const toBytes$b = (parameters, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
        const { sequenceNumber, status } = parameters;
        buffer.setUint8(sequenceNumber);
        buffer.setEventStatus(config.hardwareType, status);
        return toBytes$11(id$b, buffer.data);
    };

    var lastEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$b,
        fromBytes: fromBytes$b,
        headerSize: headerSize$b,
        id: id$b,
        name: name$b,
        toBytes: toBytes$b
    });

    const id$a = newEvent$1;
    const name$a = commandNames[newEvent$1];
    const headerSize$a = 2;
    const COMMAND_BODY_MAX_SIZE$1 = 14;
    const MTX_ADDRESS_SIZE = 8;
    const examples$a = {
        'event for MAGNET_ON': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 1,
                name: 'MAGNET_ON',
                sequenceNumber: 2,
                data: { time2000: 734015840 }
            },
            bytes: [
                0x15, 0x06,
                0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60
            ]
        },
        'event for BATTERY_ALARM': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 5,
                name: 'BATTERY_ALARM',
                sequenceNumber: 2,
                data: { voltage: 3308 }
            },
            bytes: [
                0x15, 0x04,
                0x05, 0x02, 0x0c, 0xec
            ]
        },
        'event for ACTIVATE_MTX': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 11,
                name: 'ACTIVATE_MTX',
                sequenceNumber: 2,
                data: { time2000: 734015840, deviceId: '00 1a 79 88 17 01 23 56' }
            },
            bytes: [
                0x15, 0x0e,
                0x0b, 0x02, 0x2b, 0xc0, 0x31, 0x60, 0x00, 0x1a, 0x79, 0x88, 0x17, 0x01, 0x23, 0x56
            ]
        },
        'event for CONNECT': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 12,
                name: 'CONNECT',
                sequenceNumber: 2,
                data: { channel: 1, value: 131 }
            },
            bytes: [
                0x15, 0x05,
                0x0c, 0x02, 0x00, 0x83, 0x01
            ]
        },
        'event for DISCONNECT': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 13,
                name: 'DISCONNECT',
                sequenceNumber: 2,
                data: { channel: 1, value: 131 }
            },
            bytes: [
                0x15, 0x05,
                0x0d, 0x02, 0x00, 0x83, 0x01
            ]
        },
        'event for EV_MTX': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            parameters: {
                id: 17,
                name: 'MTX',
                sequenceNumber: 2,
                data: {
                    status: {
                        isMeterCaseOpen: true,
                        isMagneticInfluence: true,
                        isParametersSetRemotely: false,
                        isParametersSetLocally: false,
                        isMeterProgramRestarted: false,
                        isLockedOut: false,
                        isTimeSet: false,
                        isTimeCorrected: true,
                        isMeterFailure: false,
                        isMeterTerminalBoxOpen: true,
                        isModuleCompartmentOpen: false,
                        isTariffPlanChanged: true,
                        isNewTariffPlanReceived: false
                    }
                }
            },
            bytes: [
                0x15, 0x04,
                0x11, 0x02, 0x83, 0x0a
            ]
        }
    };
    const getVoltage = (buffer) => buffer.getUint16();
    const setVoltage = (buffer, value) => buffer.setUint16(value);
    const getDeviceId = (buffer) => (getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE)));
    const setDeviceId = (buffer, value) => {
        getBytesFromHex(value).forEach(byte => buffer.setUint8(byte));
    };
    const fromBytes$a = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$1) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const eventId = buffer.getUint8();
        const eventName = eventNames[eventId];
        const sequenceNumber = buffer.getUint8();
        let eventData;
        switch (eventId) {
            case MAGNET_ON:
            case MAGNET_OFF:
            case ACTIVATE:
            case DEACTIVATE:
            case CAN_OFF:
            case INSERT:
            case REMOVE:
            case COUNTER_OVER:
            case OPTOLOW:
            case OPTOFLASH:
            case JOIN_ACCEPT:
                eventData = { time2000: buffer.getTime() };
                break;
            case BATTERY_ALARM:
                eventData = { voltage: getVoltage(buffer) };
                break;
            case ACTIVATE_MTX:
                eventData = { time2000: buffer.getTime(), deviceId: getDeviceId(buffer) };
                break;
            case CONNECT:
            case DISCONNECT:
                eventData = { channel: buffer.getUint8() + 1, value: buffer.getExtendedValue() };
                break;
            case MTX:
                eventData = { status: buffer.getEventStatus(MTXLORA) };
                break;
            case BINARY_SENSOR_ON:
            case BINARY_SENSOR_OFF:
                eventData = { time2000: buffer.getTime(), channel: buffer.getChannelValue() };
                break;
            case TEMPERATURE_SENSOR_HYSTERESIS:
            case TEMPERATURE_SENSOR_LOW_TEMPERATURE:
            case TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
                eventData = { time2000: buffer.getTime(), channel: buffer.getChannelValue(), temperature: buffer.getInt8() };
                break;
            default:
                throw new Error(`Event ${id$a} is not supported`);
        }
        return { id: eventId, name: eventName, sequenceNumber, data: eventData };
    };
    const toBytes$a = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$1);
        const { id: eventId, sequenceNumber, data } = parameters;
        buffer.setUint8(eventId);
        buffer.setUint8(sequenceNumber);
        switch (eventId) {
            case MAGNET_ON:
            case MAGNET_OFF:
            case ACTIVATE:
            case DEACTIVATE:
            case CAN_OFF:
            case INSERT:
            case REMOVE:
            case COUNTER_OVER:
            case OPTOLOW:
            case OPTOFLASH:
            case JOIN_ACCEPT:
                buffer.setTime(data.time2000);
                break;
            case BATTERY_ALARM:
                setVoltage(buffer, data.voltage);
                break;
            case ACTIVATE_MTX:
                buffer.setTime(data.time2000);
                setDeviceId(buffer, data.deviceId);
                break;
            case CONNECT:
            case DISCONNECT:
                buffer.setUint8(data.channel - 1);
                buffer.setExtendedValue(data.value);
                break;
            case MTX:
                buffer.setEventStatus(MTXLORA, data.status);
                break;
            case BINARY_SENSOR_ON:
            case BINARY_SENSOR_OFF:
                buffer.setTime(data.time2000);
                buffer.setChannelValue(data.channel);
                break;
            case TEMPERATURE_SENSOR_HYSTERESIS:
            case TEMPERATURE_SENSOR_LOW_TEMPERATURE:
            case TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
                buffer.setTime(data.time2000);
                buffer.setChannelValue(data.channel);
                buffer.setInt8(data.temperature);
                break;
            default:
                throw new Error(`Event ${id$a} is not supported`);
        }
        return toBytes$11(id$a, buffer.getBytesToOffset());
    };

    var newEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$a,
        fromBytes: fromBytes$a,
        headerSize: headerSize$a,
        id: id$a,
        name: name$a,
        toBytes: toBytes$a
    });

    const id$9 = setParameter$1;
    const name$9 = commandNames[setParameter$1];
    const headerSize$9 = 2;
    const COMMAND_BODY_SIZE$7 = 2;
    const examples$9 = {
        'activation method set successfully': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
            parameters: { id: 9, status: 1 },
            bytes: [
                0x03, 0x02,
                0x09, 0x01
            ]
        },
        'configuration for battery depassivation set successfully': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
            parameters: { id: 33, status: 1 },
            bytes: [
                0x03, 0x02,
                0x21, 0x01
            ]
        }
    };
    const fromBytes$9 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$7) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const parameters = {
            id: buffer.getUint8(),
            status: buffer.getUint8()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$9 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$7);
        buffer.setUint8(parameters.id);
        buffer.setUint8(parameters.status);
        return toBytes$11(id$9, buffer.data);
    };

    var setParameter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$9,
        fromBytes: fromBytes$9,
        headerSize: headerSize$9,
        id: id$9,
        name: name$9,
        toBytes: toBytes$9
    });

    const id$8 = setTime2000$1;
    const name$8 = commandNames[setTime2000$1];
    const headerSize$8 = 2;
    const COMMAND_BODY_SIZE$6 = 1;
    const examples$8 = {
        success: {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: { status: 1 },
            bytes: [
                0x02, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$8 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$6) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            status: buffer.getUint8()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    const toBytes$8 = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$6, false);
        buffer.setUint8(status);
        return toBytes$11(id$8, buffer.data);
    };

    var setTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$8,
        fromBytes: fromBytes$8,
        headerSize: headerSize$8,
        id: id$8,
        name: name$8,
        toBytes: toBytes$8
    });

    const id$7 = softRestart$1;
    const name$7 = commandNames[softRestart$1];
    const headerSize$7 = 2;
    const COMMAND_BODY_SIZE$5 = 0;
    const examples$7 = {
        'simple response': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$7 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$5) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$7 = () => toBytes$11(id$7);

    var softRestart = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$7,
        fromBytes: fromBytes$7,
        headerSize: headerSize$7,
        id: id$7,
        name: name$7,
        toBytes: toBytes$7
    });

    const id$6 = status$1;
    const name$6 = commandNames[status$1];
    const headerSize$6 = 2;
    const COMMAND_BODY_MAX_SIZE = 20;
    const UNKNOWN_BATTERY_RESISTANCE = 65535;
    const UNKNOWN_BATTERY_CAPACITY = 255;
    const examples$6 = {
        'status for GASI3 (old)': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            parameters: {
                software: { type: 2, version: 10 },
                hardware: { type: GASI3, version: 1 },
                data: {
                    batteryVoltage: { underLowLoad: 3158, underHighLoad: 3522 },
                    batteryInternalResistance: 10034,
                    temperature: 14,
                    remainingBatteryCapacity: 40.9,
                    lastEventSequenceNumber: 34
                }
            },
            bytes: [
                0x14, 0x0c,
                0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22
            ]
        },
        'status for GASI3 (new)': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            parameters: {
                software: { type: 2, version: 10 },
                hardware: { type: GASI3, version: 1 },
                data: {
                    batteryVoltage: { underLowLoad: 3158, underHighLoad: 3522 },
                    batteryInternalResistance: 10034,
                    temperature: 14,
                    remainingBatteryCapacity: 40.9,
                    lastEventSequenceNumber: 34,
                    downlinkQuality: 42
                }
            },
            bytes: [
                0x14, 0x0d,
                0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22, 0x2a
            ]
        },
        'status for MTX': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            parameters: {
                software: { type: 2, version: 10 },
                hardware: { type: MTXLORA, version: 1 },
                data: {
                    time2000: 4444,
                    resetReason: 1,
                    rssiLastDownlinkFrame: 2,
                    snrLastDownlinkFrame: 6,
                    downlinkRequestsNumber: 42,
                    downlinkFragmentsNumber: 83,
                    uplinkResponsesNumber: 143,
                    uplinkFragmentsNumber: 2,
                    signalMarginToGateway: 5,
                    signalMarginFromGateway: 12,
                    detectedGatewaysNumber: 10,
                    gatewayDownlinkErrorRate: 2,
                    lastEventSequenceNumber: 33
                }
            },
            bytes: [
                0x14, 0x14,
                0x02, 0x0a, 0x07, 0x01, 0x00, 0x00, 0x11, 0x5c,
                0x01, 0x02, 0x06, 0x2a, 0x53, 0x8f, 0x02, 0x05,
                0x0c, 0x0a, 0x02, 0x21
            ]
        }
    };
    const fromBytes$6 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const software = { type: buffer.getUint8(), version: buffer.getUint8() };
        const hardware = { type: buffer.getUint8(), version: buffer.getUint8() };
        let data;
        switch (hardware.type) {
            case GASI1:
            case GASI2:
            case GASI3:
            case NOVATOR:
            case IMP2EU:
            case IMP4EU:
            case IMP2AS:
            case IMP2IN:
            case IMP4IN:
            case GASIC:
            case NBIOT:
                {
                    const statusData = {
                        batteryVoltage: buffer.getBatteryVoltage(),
                        batteryInternalResistance: buffer.getUint16(),
                        temperature: buffer.getUint8(),
                        remainingBatteryCapacity: buffer.getUint8(),
                        lastEventSequenceNumber: buffer.getUint8()
                    };
                    if (statusData.batteryInternalResistance === UNKNOWN_BATTERY_RESISTANCE) {
                        statusData.batteryInternalResistance = undefined;
                    }
                    if (statusData.remainingBatteryCapacity === UNKNOWN_BATTERY_CAPACITY) {
                        statusData.remainingBatteryCapacity = undefined;
                    }
                    else if (statusData.remainingBatteryCapacity !== undefined) {
                        statusData.remainingBatteryCapacity = roundNumber((statusData.remainingBatteryCapacity * 100) / (UNKNOWN_BATTERY_CAPACITY - 1), 1);
                    }
                    if (!buffer.isEmpty) {
                        statusData.downlinkQuality = buffer.getUint8();
                    }
                    data = statusData;
                }
                break;
            case MTXLORA:
            case PLC2LORA:
            case LORA:
                data = {
                    time2000: buffer.getUint32(),
                    resetReason: buffer.getUint8(),
                    rssiLastDownlinkFrame: buffer.getUint8(),
                    snrLastDownlinkFrame: buffer.getUint8(),
                    downlinkRequestsNumber: buffer.getUint8(),
                    downlinkFragmentsNumber: buffer.getUint8(),
                    uplinkResponsesNumber: buffer.getUint8(),
                    uplinkFragmentsNumber: buffer.getUint8(),
                    signalMarginToGateway: buffer.getUint8(),
                    signalMarginFromGateway: buffer.getUint8(),
                    detectedGatewaysNumber: buffer.getUint8(),
                    gatewayDownlinkErrorRate: buffer.getUint8(),
                    lastEventSequenceNumber: buffer.getUint8()
                };
                break;
            case ELIMP:
            default:
                throw new Error(`${id$6}: hardware type ${hardware.type} is not supported`);
        }
        return { software, hardware, data };
    };
    const toBytes$6 = (parameters) => {
        const { software, hardware, data } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        buffer.setUint8(software.type);
        buffer.setUint8(software.version);
        buffer.setUint8(hardware.type);
        buffer.setUint8(hardware.version);
        switch (hardware.type) {
            case GASI1:
            case GASI2:
            case GASI3:
            case NOVATOR:
            case IMP2EU:
            case IMP4EU:
            case IMP2AS:
            case IMP2IN:
            case IMP4IN:
            case GASIC:
                {
                    const statusData = data;
                    buffer.setBatteryVoltage(statusData.batteryVoltage);
                    if (statusData.batteryInternalResistance === undefined) {
                        buffer.setUint16(UNKNOWN_BATTERY_RESISTANCE);
                    }
                    else {
                        buffer.setUint16(statusData.batteryInternalResistance);
                    }
                    buffer.setUint8(statusData.temperature);
                    if (statusData.remainingBatteryCapacity === undefined) {
                        buffer.setUint8(UNKNOWN_BATTERY_CAPACITY);
                    }
                    else {
                        buffer.setUint8(roundNumber((UNKNOWN_BATTERY_CAPACITY - 1) * (statusData.remainingBatteryCapacity / 100), 0));
                    }
                    buffer.setUint8(statusData.lastEventSequenceNumber);
                    if ('downlinkQuality' in statusData) {
                        buffer.setUint8(statusData.downlinkQuality);
                    }
                }
                break;
            case MTXLORA:
                {
                    const statusData = data;
                    buffer.setUint32(statusData.time2000);
                    buffer.setUint8(statusData.resetReason);
                    buffer.setUint8(statusData.rssiLastDownlinkFrame);
                    buffer.setUint8(statusData.snrLastDownlinkFrame);
                    buffer.setUint8(statusData.downlinkRequestsNumber);
                    buffer.setUint8(statusData.downlinkFragmentsNumber);
                    buffer.setUint8(statusData.uplinkResponsesNumber);
                    buffer.setUint8(statusData.uplinkFragmentsNumber);
                    buffer.setUint8(statusData.signalMarginToGateway);
                    buffer.setUint8(statusData.signalMarginFromGateway);
                    buffer.setUint8(statusData.detectedGatewaysNumber);
                    buffer.setUint8(statusData.gatewayDownlinkErrorRate);
                    buffer.setUint8(statusData.lastEventSequenceNumber);
                }
                break;
            case ELIMP:
            default:
                throw new Error(`${id$6}: hardware type ${hardware.type} is not supported`);
        }
        return toBytes$11(id$6, buffer.getBytesToOffset());
    };

    var status = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$6,
        fromBytes: fromBytes$6,
        headerSize: headerSize$6,
        id: id$6,
        name: name$6,
        toBytes: toBytes$6
    });

    const id$5 = time2000$1;
    const name$5 = commandNames[time2000$1];
    const headerSize$5 = 2;
    const COMMAND_BODY_SIZE$4 = 5;
    const examples$5 = {
        'time is 2023.04.03 14:01:17 GMT': {
            id: id$5,
            name: name$5,
            headerSize: headerSize$5,
            parameters: { sequenceNumber: 77, time2000: 733845677 },
            bytes: [
                0x09, 0x05,
                0x4d, 0x2b, 0xbd, 0x98, 0xad
            ]
        }
    };
    const fromBytes$5 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$4) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            time2000: buffer.getTime()
        };
        if (!buffer.isEmpty) {
            throw new Error('BinaryBuffer is not empty.');
        }
        return parameters;
    };
    function toBytes$5(parameters) {
        const { sequenceNumber, time2000 } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$4);
        buffer.setUint8(sequenceNumber);
        buffer.setTime(time2000);
        return toBytes$11(id$5, buffer.data);
    }

    var time2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$5,
        fromBytes: fromBytes$5,
        headerSize: headerSize$5,
        id: id$5,
        name: name$5,
        toBytes: toBytes$5
    });

    const id$4 = updateRun$1;
    const name$4 = commandNames[updateRun$1];
    const headerSize$4 = 3;
    const COMMAND_BODY_SIZE$3 = 0;
    const examples$4 = {
        'simple response': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
            parameters: {},
            bytes: [
                0x1f, 0x2c, 0x00
            ]
        }
    };
    const fromBytes$4 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$3) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$4 = () => toBytes$11(id$4);

    var updateRun = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$4,
        fromBytes: fromBytes$4,
        headerSize: headerSize$4,
        id: id$4,
        name: name$4,
        toBytes: toBytes$4
    });

    const id$3 = usWaterMeterBatteryStatus$1;
    const name$3 = commandNames[usWaterMeterBatteryStatus$1];
    const headerSize$3 = 3;
    const COMMAND_BODY_SIZE$2 = 7;
    const examples$3 = {
        event: {
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
            parameters: {
                voltage: {
                    underLowLoad: 3600,
                    underHighLoad: 3600
                },
                internalResistance: 1034,
                lastDepassivationTime: 100
            },
            bytes: [
                0x1f, 0x14, 0x07,
                0xe1, 0x0e, 0x10, 0x04, 0x0a, 0x00, 0x64
            ]
        }
    };
    const fromBytes$3 = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return {
            voltage: buffer.getBatteryVoltage(),
            internalResistance: buffer.getUint16(),
            lastDepassivationTime: buffer.getUint16()
        };
    };
    const toBytes$3 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$2);
        buffer.setBatteryVoltage(parameters.voltage);
        buffer.setUint16(parameters.internalResistance);
        buffer.setUint16(parameters.lastDepassivationTime);
        return toBytes$11(id$3, buffer.data);
    };

    var usWaterMeterBatteryStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$3,
        fromBytes: fromBytes$3,
        headerSize: headerSize$3,
        id: id$3,
        name: name$3,
        toBytes: toBytes$3
    });

    const id$2 = usWaterMeterCommand$1;
    const name$2 = commandNames[usWaterMeterCommand$1];
    const headerSize$2 = 3;
    const examples$2 = {
        'response for current values': {
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            parameters: {
                length: 4,
                data: [0x04, 0x22, 0x35, 0x28]
            },
            bytes: [
                0x1f, 0x07, 0x05,
                0x04, 0x04, 0x22, 0x35, 0x28
            ]
        }
    };
    const fromBytes$2 = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const length = buffer.getUint8();
        return { length, data: data.slice(1) };
    };
    const toBytes$2 = (parameters) => {
        const { data, length } = parameters;
        const buffer = new CommandBinaryBuffer(length);
        buffer.setUint8(length);
        buffer.setBytes(data);
        return toBytes$11(id$2, buffer.data);
    };

    var usWaterMeterCommand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$2,
        fromBytes: fromBytes$2,
        headerSize: headerSize$2,
        id: id$2,
        name: name$2,
        toBytes: toBytes$2
    });

    const id$1 = verifyImage$1;
    const name$1 = commandNames[verifyImage$1];
    const headerSize$1 = 3;
    const COMMAND_BODY_SIZE$1 = 1;
    const examples$1 = {
        'image is valid': {
            id: id$1,
            name: name$1,
            headerSize: headerSize$1,
            parameters: { status: 1 },
            bytes: [
                0x1f, 0x2b, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$1) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return { status: buffer.getUint8() };
    };
    const toBytes$1 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$1);
        buffer.setUint8(parameters.status);
        return toBytes$11(id$1, buffer.data);
    };

    var verifyImage = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$1,
        fromBytes: fromBytes$1,
        headerSize: headerSize$1,
        id: id$1,
        name: name$1,
        toBytes: toBytes$1
    });

    const id = writeImage$1;
    const name = commandNames[writeImage$1];
    const headerSize = 3;
    const COMMAND_BODY_SIZE = 5;
    const examples = {
        'write image': {
            id,
            name,
            headerSize,
            parameters: { offset: 64, status: 1 },
            bytes: [
                0x1f, 0x2a, 0x05,
                0x00, 0x00, 0x00, 0x40, 0x01
            ]
        }
    };
    const fromBytes = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return {
            offset: buffer.getUint32(),
            status: buffer.getUint8()
        };
    };
    const toBytes = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        buffer.setUint32(parameters.offset);
        buffer.setUint8(parameters.status);
        return toBytes$11(id, buffer.data);
    };

    var writeImage = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples,
        fromBytes: fromBytes,
        headerSize: headerSize,
        id: id,
        name: name,
        toBytes: toBytes
    });

    var uplink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000,
        current: current,
        currentMc: currentMc,
        dataSegment: dataSegment,
        day: day,
        dayMc: dayMc,
        exAbsCurrentMc: exAbsCurrentMc,
        exAbsDayMc: exAbsDayMc,
        exAbsHourMc: exAbsHourMc,
        getArchiveDays: getArchiveDays,
        getArchiveDaysMc: getArchiveDaysMc,
        getArchiveEvents: getArchiveEvents,
        getArchiveHours: getArchiveHours,
        getArchiveHoursMc: getArchiveHoursMc,
        getArchiveHoursMcEx: getArchiveHoursMcEx,
        getBatteryStatus: getBatteryStatus,
        getChannelsStatus: getChannelsStatus,
        getChannelsTypes: getChannelsTypes,
        getExAbsArchiveDaysMc: getExAbsArchiveDaysMc,
        getExAbsArchiveHoursMc: getExAbsArchiveHoursMc,
        getLmicInfo: getLmicInfo,
        getParameter: getParameter,
        hour: hour,
        hourMc: hourMc,
        hourMcEx: hourMcEx,
        lastEvent: lastEvent,
        newEvent: newEvent,
        setParameter: setParameter,
        setTime2000: setTime2000,
        signalQuality: signalQuality,
        softRestart: softRestart,
        status: status,
        time2000: time2000,
        updateRun: updateRun,
        usWaterMeterBatteryStatus: usWaterMeterBatteryStatus,
        usWaterMeterCommand: usWaterMeterCommand,
        verifyImage: verifyImage,
        writeImage: writeImage
    });

    const equal = ( actual, expected ) => {
        if ( actual !== expected ) {
            console.log('actual:', actual);
            console.log('expected:', expected);
            throw new Error('Assertion error!', actual, expected);
        }
    };

    const deepEqual = ( actual, expected ) => {
        equal(JSON.stringify(actual), JSON.stringify(expected));
    };

    const testCommands = ( direction, commands ) => {
        console.log(direction);

        for ( const commandName in commands ) {
            const command = commands[commandName];
            const examples = command?.examples;

            if ( command ) {
                console.log(' *', commandName);

                for ( const exampleName in examples ) {
                    const exampleData = examples[exampleName];

                    deepEqual(
                        command.toBytes(exampleData.parameters, exampleData.config),
                        exampleData.bytes
                    );

                    deepEqual(
                        command.fromBytes(exampleData.bytes.slice(command.headerSize), exampleData.config),
                        exampleData.parameters
                    );
                }
            }
        }
    };


    testCommands('downlink', downlink);
    testCommands('uplink', uplink);

})();
