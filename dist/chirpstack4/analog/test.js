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
            return result & 0x80 ? result ^ -0x100 : result;
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
            return result & 0x8000 ? result ^ -0x10000 : result;
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
            return result & 0x800000 ? result ^ -0x1000000 : result;
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
            return result & 0x80000000 ? result ^ -0x100000000 : result;
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
    const toBytes$V = (commandId, commandSize) => {
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

    const toBytes$U = (commandId, commandData = []) => {
        const headerData = toBytes$V(commandId, commandData.length);
        return [...headerData, ...commandData];
    };

    const id$T = 0x0c;
    const name$T = 'correctTime2000';
    const headerSize$T = 2;
    const COMMAND_BODY_SIZE$u = 2;
    const examples$T = {
        'correct time 120 seconds to the past': {
            id: id$T,
            name: name$T,
            headerSize: headerSize$T,
            parameters: { sequenceNumber: 45, seconds: -120 },
            bytes: [
                0x0c, 0x02,
                0x2d, 0x88
            ]
        },
        'correct time 95 seconds to the future': {
            id: id$T,
            name: name$T,
            headerSize: headerSize$T,
            parameters: { sequenceNumber: 46, seconds: 95 },
            bytes: [
                0x0c, 0x02,
                0x2e, 0x5f
            ]
        }
    };
    const fromBytes$T = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$u) {
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
    const toBytes$T = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$u, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt8(seconds);
        return toBytes$U(id$T, buffer.data);
    };

    var correctTime2000$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$T,
        id: id$T,
        name: name$T,
        toBytes: toBytes$T
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

    const INITIAL_YEAR_TIMESTAMP = 946684800000;
    const MILLISECONDS_IN_SECONDS = 1000;
    const getDateFromTime2000 = (time2000) => new Date(INITIAL_YEAR_TIMESTAMP + (time2000 * MILLISECONDS_IN_SECONDS));
    const getTime2000FromDate = (date) => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;

    var getHexFromBytes = (bytes, options = {}) => {
        const { separator, prefix } = Object.assign({}, hexFormatOptions, options);
        return bytes
            .map((byte) => `${prefix}${byte.toString(16).padStart(2, '0')}`)
            .join(separator);
    };

    var getBytesFromHex = (hex) => {
        let cleanHex = hex.replace(/\s+|0x/g, '');
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

    var invertObject = (source) => {
        const target = {};
        for (const property in source) {
            const value = source[property];
            target[value] = property;
        }
        return target;
    };

    const INITIAL_YEAR = 2000;
    const MONTH_BIT_SIZE = 4;
    const DATE_BIT_SIZE = 5;
    const YEAR_START_INDEX = 1;
    const UNKNOWN_BATTERY_VOLTAGE = 4095;
    const EXTEND_BIT_MASK = 0x80;
    const LAST_BIT_INDEX = 7;
    const DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
    const DATA_SENDING_INTERVAL_RESERVED_BYTES = 3;
    const PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
    const SERIAL_NUMBER_SIZE = 6;
    const MAGNETIC_INFLUENCE_BIT_INDEX = 8;
    const LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
    const LEGACY_HOUR_DIFF_SIZE = 2;
    const GAS_HARDWARE_TYPES = [
        GASI2,
        GASI3,
        GASI1,
        GASIC
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
        isForthChannelInactive: Math.pow(2, 7)
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
        [MQTT_DATA_RECEIVE_CONFIG]: 1 + 1,
        [MQTT_DATA_SEND_CONFIG]: 1 + 5,
        [NBIOT_SSL_CONFIG]: 1 + 2,
        [NBIOT_SSL_CACERT_SET]: 1 + 4,
        [NBIOT_SSL_CLIENT_CERT_SET]: 1 + 4,
        [NBIOT_SSL_CLIENT_KEY_SET]: 1 + 4,
        [REPORTING_DATA_CONFIG]: 1 + 4,
        [EVENTS_CONFIG]: 1 + 4
    };
    const fourChannelsBitMask = {
        channel1: Math.pow(2, 0),
        channel2: Math.pow(2, 1),
        channel3: Math.pow(2, 2),
        channel4: Math.pow(2, 3)
    };
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
    const getChannelValue = (buffer) => buffer.getUint8() + 1;
    const setChannelValue = (buffer, value) => {
        if (value < 1) {
            throw new Error('channel must be 1 or greater');
        }
        buffer.setUint8(value - 1);
    };
    const getNbiotSslWrite = (buffer) => ({
        size: buffer.getUint16(false),
        position: buffer.getUint16(false),
        chunk: buffer.getBytesLeft()
    });
    const setNbiotSslWrite = (buffer, parameter) => {
        if (parameter.size !== parameter.chunk.length) {
            throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
        }
        buffer.setUint16(parameter.size, false);
        buffer.setUint16(parameter.position, false);
        buffer.setBytes(parameter.chunk);
    };
    const getNbiotSslSet = (buffer) => ({ crc32: buffer.getUint32(false) });
    const setNbiotSslSet = (buffer, parameter) => {
        buffer.setUint32(parameter.crc32, false);
    };
    const deviceParameterConvertersMap = {
        [REPORTING_DATA_INTERVAL]: {
            get: (buffer) => {
                buffer.seek(buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);
                return {
                    value: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
                };
            },
            set: (buffer, parameter) => {
                buffer.seek(buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);
                buffer.setUint8(parameter.value / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
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
                loadTime: buffer.getUint16(false),
                internalResistance: buffer.getUint16(false),
                lowVoltage: buffer.getUint16(false)
            }),
            set: (buffer, parameter) => {
                buffer.setUint16(parameter.loadTime, false);
                buffer.setUint16(parameter.internalResistance, false);
                buffer.setUint16(parameter.lowVoltage, false);
            }
        },
        [BATTERY_MINIMAL_LOAD_TIME]: {
            get: (buffer) => ({
                value: buffer.getUint32(false)
            }),
            set: (buffer, parameter) => {
                buffer.setUint32(parameter.value, false);
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
            get: (buffer) => ({
                spreadFactor: buffer.getUint8(),
                frequency: buffer.getUint24(false) * PARAMETER_RX2_FREQUENCY_COEFFICIENT
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.spreadFactor);
                buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT, false);
            }
        },
        [ABSOLUTE_DATA]: {
            get: (buffer) => ({
                meterValue: buffer.getUint32(false),
                pulseCoefficient: buffer.getPulseCoefficient(),
                value: buffer.getUint32(false)
            }),
            set: (buffer, parameter) => {
                buffer.setUint32(parameter.meterValue, false);
                buffer.setPulseCoefficient(parameter.pulseCoefficient);
                buffer.setUint32(parameter.value, false);
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
                channel: getChannelValue(buffer),
                meterValue: buffer.getUint32(false),
                pulseCoefficient: buffer.getPulseCoefficient(),
                value: buffer.getUint32(false)
            }),
            set: (buffer, parameter) => {
                setChannelValue(buffer, parameter.channel);
                buffer.setUint32(parameter.meterValue, false);
                buffer.setPulseCoefficient(parameter.pulseCoefficient);
                buffer.setUint32(parameter.value, false);
            }
        },
        [ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: {
            get: (buffer) => ({
                channel: getChannelValue(buffer),
                state: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                setChannelValue(buffer, parameter.channel);
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
            get: (buffer) => {
                const object = toObject(fourChannelsBitMask, buffer.getUint8());
                return { channel1: object.channel1, channel2: object.channel2, channel3: object.channel3, channel4: object.channel4 };
            },
            set: (buffer, parameter) => {
                const { channel1, channel2, channel3, channel4 } = parameter;
                buffer.setUint8(fromObject(fourChannelsBitMask, { channel1, channel2, channel3, channel4 }));
            }
        },
        [BATTERY_DEPASSIVATION_CONFIG]: {
            get: (buffer) => ({
                resistanceStartThreshold: buffer.getUint16(false),
                resistanceStopThreshold: buffer.getUint16(false)
            }),
            set: (buffer, parameter) => {
                buffer.setUint16(parameter.resistanceStartThreshold, false);
                buffer.setUint16(parameter.resistanceStopThreshold, false);
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
                port: buffer.getUint16(false)
            }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.hostName);
                buffer.setUint16(parameter.port, false);
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
                qos: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.qos);
            }
        },
        [MQTT_DATA_SEND_CONFIG]: {
            get: (buffer) => ({
                qos: buffer.getUint8(),
                retain: buffer.getUint8(),
                newestSendFirst: buffer.getUint8(),
                sendCountAttempts: buffer.getUint8(),
                sendTimeoutBetweenAttempts: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.qos);
                buffer.setUint8(parameter.retain);
                buffer.setUint8(parameter.newestSendFirst);
                buffer.setUint8(parameter.sendCountAttempts);
                buffer.setUint8(parameter.sendTimeoutBetweenAttempts);
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
            get: (buffer) => ({ softwareImageUrl: buffer.getString() }),
            set: (buffer, parameter) => {
                buffer.setString(parameter.softwareImageUrl);
            }
        },
        [NBIOT_MODULE_FIRMWARE_UPDATE]: {
            get: (buffer) => ({ moduleFirmwareImageUrl: buffer.getString() }),
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
                enableEvent: buffer.getUint8(),
                sendEvent: buffer.getUint8(),
                saveEvent: buffer.getUint8()
            }),
            set: (buffer, parameter) => {
                buffer.setUint8(parameter.eventId);
                buffer.setUint8(parameter.enableEvent);
                buffer.setUint8(parameter.sendEvent);
                buffer.setUint8(parameter.saveEvent);
            }
        },
        [NBIOT_MODULE_INFO]: {
            get: (buffer) => ({ moduleInfo: buffer.getString() }),
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
    function CommandBinaryBuffer(dataOrLength, isLittleEndian = true) {
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
            value += (byte & 0x7f) << (7 * position);
            ++position;
        }
        if (value < 0) {
            value = 0;
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
            encodedValue >>= 7;
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
        return this.getUint32(false);
    };
    CommandBinaryBuffer.prototype.setTime = function (value) {
        this.setUint32(value, false);
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
        return this.getUint24(false);
    };
    CommandBinaryBuffer.prototype.setLegacyCounterValue = function (value) {
        this.setUint24(value, false);
    };
    CommandBinaryBuffer.prototype.getLegacyCounter = function (byte = this.getUint8()) {
        return {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: this.getLegacyCounterValue()
        };
    };
    CommandBinaryBuffer.prototype.setLegacyCounter = function (counter, byte = 0) {
        this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, counter.isMagneticInfluence));
        this.setLegacyCounterValue(counter.value);
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
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiff = function () {
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
                value,
                diff,
                index: channelIndex
            });
        });
        return { startTime2000: getTime2000FromDate(date), hours, channelList };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiff = function (hours, startTime2000, channelList) {
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        this.setDate(date);
        this.setHours(hour, hours);
        this.setChannels(channelList);
        channelList.forEach(({ value, diff }) => {
            this.setExtendedValue(value);
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
            status = toObject(fourChannelBitMask, this.getExtendedValue());
        }
        else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            status = toObject(mtxBitMask, this.getUint16());
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
            this.setExtendedValue(fromObject(fourChannelBitMask, status));
        }
        else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
            this.setUint16(fromObject(mtxBitMask, status));
        }
        else {
            throw new Error('wrong hardwareType');
        }
    };
    CommandBinaryBuffer.prototype.getParameter = function () {
        const id = this.getUint8();
        if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
            throw new Error(`parameter ${id} is not supported`);
        }
        const data = deviceParameterConvertersMap[id].get(this);
        return { id, data };
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
        let data = null;
        switch (id) {
            case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            case ABSOLUTE_DATA_MULTI_CHANNEL:
                data = { channel: getChannelValue(this) };
                break;
            case REPORTING_DATA_CONFIG:
                data = { dataType: this.getUint8() };
                break;
            case EVENTS_CONFIG:
                data = { eventId: this.getUint8() };
                break;
        }
        return { id, data };
    };
    CommandBinaryBuffer.prototype.setRequestParameter = function (parameter) {
        const { id, data: parameterData } = parameter;
        let data;
        this.setUint8(id);
        switch (id) {
            case ABSOLUTE_DATA_MULTI_CHANNEL:
            case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                data = parameterData;
                setChannelValue(this, data.channel);
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
        return { id, data };
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
    CommandBinaryBuffer.prototype.getLegacyHourCounterWithDiff = function () {
        const date = this.getDate();
        const byte = this.getUint8();
        const { hour } = this.getHours(byte);
        const counter = {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: this.getLegacyCounterValue()
        };
        const diff = [];
        while (this.offset < this.data.length) {
            diff.push(this.getLegacyHourDiff());
        }
        date.setUTCHours(hour);
        return { startTime2000: getTime2000FromDate(date), counter, diff };
    };
    CommandBinaryBuffer.prototype.setLegacyHourCounterWithDiff = function (hourCounter) {
        const date = getDateFromTime2000(hourCounter.startTime2000);
        const hour = date.getUTCHours();
        this.setDate(date);
        this.setHours(hour, 1);
        this.seek(this.offset - 1);
        const byte = this.getUint8();
        this.seek(this.offset - 1);
        this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, hourCounter.counter.isMagneticInfluence));
        this.setLegacyCounterValue(hourCounter.counter.value);
        hourCounter.diff.forEach(diffItem => this.setLegacyHourDiff(diffItem));
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiffExtended = function () {
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
                value,
                diff,
                index: channelIndex
            });
        });
        return { startTime2000: getTime2000FromDate(date), hour, hours, channelList };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiffExtended = function (parameters) {
        const date = getDateFromTime2000(parameters.startTime2000);
        this.setDate(date);
        this.setUint8(parameters.hour);
        this.setUint8(parameters.hours);
        this.setChannels(parameters.channelList);
        parameters.channelList.forEach(({ value, diff }) => {
            this.setExtendedValue(value);
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

    const id$S = 0x1e;
    const name$S = 'dataSegment';
    const headerSize$S = 2;
    const COMMAND_BODY_MIN_SIZE$3 = 2;
    const examples$S = {
        'DataSegment request': {
            id: id$S,
            name: name$S,
            headerSize: headerSize$S,
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
    const fromBytes$S = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getDataSegment();
    };
    const toBytes$S = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$3 + parameters.data.length);
        buffer.setDataSegment(parameters);
        return toBytes$U(id$S, buffer.data);
    };

    var dataSegment$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        name: name$S,
        toBytes: toBytes$S
    });

    const id$R = 0x06;
    const name$R = 'getArchiveDays';
    const headerSize$R = 2;
    const COMMAND_BODY_SIZE$t = 3;
    const examples$R = {
        '1 day counter from 2023.03.10 00:00:00 GMT': {
            id: id$R,
            name: name$R,
            headerSize: headerSize$R,
            parameters: { startTime2000: 731721600, days: 1 },
            bytes: [
                0x06, 0x03,
                0x2e, 0x6a, 0x01
            ]
        }
    };
    const fromBytes$R = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$t) {
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
    const toBytes$R = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$t);
        const { startTime2000, days } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setUint8(days);
        return toBytes$U(id$R, buffer.data);
    };

    var getArchiveDays$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$R,
        id: id$R,
        name: name$R,
        toBytes: toBytes$R
    });

    const id$Q = 0x1b;
    const name$Q = 'getArchiveDaysMc';
    const headerSize$Q = 2;
    const COMMAND_BODY_SIZE$s = 4;
    const examples$Q = {
        '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
            id: id$Q,
            name: name$Q,
            headerSize: headerSize$Q,
            parameters: { startTime2000: 731721600, days: 1, channelList: [1] },
            bytes: [
                0x1b, 0x04,
                0x2e, 0x6a, 0x01, 0x01
            ]
        }
    };
    const fromBytes$Q = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$s) {
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
    const toBytes$Q = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$s);
        const { startTime2000, days, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({ index })));
        buffer.setUint8(days);
        return toBytes$U(id$Q, buffer.data);
    };

    var getArchiveDaysMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$Q,
        fromBytes: fromBytes$Q,
        headerSize: headerSize$Q,
        id: id$Q,
        name: name$Q,
        toBytes: toBytes$Q
    });

    const id$P = 0x0b;
    const name$P = 'getArchiveEvents';
    const headerSize$P = 2;
    const COMMAND_BODY_SIZE$r = 5;
    const examples$P = {
        'request 4 events from 2023.04.03 14:01:17 GMT': {
            id: id$P,
            name: name$P,
            headerSize: headerSize$P,
            parameters: { startTime2000: 733845677, events: 4 },
            bytes: [
                0x0b, 0x05,
                0x2b, 0xbd, 0x98, 0xad, 0x04
            ]
        }
    };
    const fromBytes$P = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$r) {
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
    const toBytes$P = (parameters) => {
        const { startTime2000, events } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$r);
        buffer.setTime(startTime2000);
        buffer.setUint8(events);
        return toBytes$U(id$P, buffer.data);
    };

    var getArchiveEvents$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$P,
        fromBytes: fromBytes$P,
        headerSize: headerSize$P,
        id: id$P,
        name: name$P,
        toBytes: toBytes$P
    });

    const id$O = 0x05;
    const name$O = 'getArchiveHours';
    const headerSize$O = 2;
    const COMMAND_BODY_SIZE$q = 4;
    const examples$O = {
        '2 hours counter from 2023.12.23 12:00:00 GMT': {
            id: id$O,
            name: name$O,
            headerSize: headerSize$O,
            parameters: { startTime2000: 756648000, hours: 2 },
            bytes: [
                0x05, 0x04,
                0x2f, 0x97, 0x0c, 0x02
            ]
        }
    };
    const fromBytes$O = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$q) {
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
    const toBytes$O = (parameters) => {
        const { startTime2000, hours } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$q);
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, 1);
        buffer.setUint8(hours);
        return toBytes$U(id$O, buffer.data);
    };

    var getArchiveHours$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$O,
        fromBytes: fromBytes$O,
        headerSize: headerSize$O,
        id: id$O,
        name: name$O,
        toBytes: toBytes$O
    });

    const id$N = 0x1a;
    const name$N = 'getArchiveHoursMc';
    const headerSize$N = 2;
    const COMMAND_BODY_SIZE$p = 4;
    const examples$N = {
        'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            parameters: { startTime2000: 756648000, hours: 2, channelList: [1] },
            bytes: [
                0x1a, 0x04,
                0x2f, 0x97, 0x2c, 0x01
            ]
        }
    };
    const fromBytes$N = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$p) {
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
    const toBytes$N = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$p);
        const { hours, startTime2000, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$U(id$N, buffer.data);
    };

    var getArchiveHoursMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$N,
        fromBytes: fromBytes$N,
        headerSize: headerSize$N,
        id: id$N,
        name: name$N,
        toBytes: toBytes$N
    });

    const id$M = 0x051f;
    const name$M = 'getBatteryStatus';
    const headerSize$M = 3;
    const COMMAND_BODY_SIZE$o = 0;
    const examples$M = {
        'simple request': {
            id: id$M,
            name: name$M,
            headerSize: headerSize$M,
            parameters: {},
            bytes: [
                0x1f, 0x05, 0x00
            ]
        }
    };
    const fromBytes$M = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$o) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$M = () => toBytes$U(id$M);

    var getBatteryStatus$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$M,
        id: id$M,
        name: name$M,
        toBytes: toBytes$M
    });

    const id$L = 0x07;
    const name$L = 'getCurrent';
    const headerSize$L = 2;
    const COMMAND_BODY_SIZE$n = 0;
    const examples$L = {
        'simple request': {
            id: id$L,
            headerSize: headerSize$L,
            name: name$L,
            parameters: {},
            bytes: [
                0x07, 0x00
            ]
        }
    };
    const fromBytes$L = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$n) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$L = () => toBytes$U(id$L);

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$L,
        fromBytes: fromBytes$L,
        headerSize: headerSize$L,
        id: id$L,
        name: name$L,
        toBytes: toBytes$L
    });

    const id$K = 0x18;
    const name$K = 'getCurrentMc';
    const headerSize$K = 2;
    const COMMAND_BODY_SIZE$m = 0;
    const examples$K = {
        'simple request': {
            id: id$K,
            name: name$K,
            headerSize: headerSize$K,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$K = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$m) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$K = () => toBytes$U(id$K);

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        name: name$K,
        toBytes: toBytes$K
    });

    const id$J = 0x0d1f;
    const name$J = 'getExAbsArchiveDaysMc';
    const headerSize$J = 3;
    const COMMAND_BODY_SIZE$l = 4;
    const examples$J = {
        '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT': {
            id: id$J,
            name: name$J,
            headerSize: headerSize$J,
            parameters: { startTime2000: 756691200, days: 1, channelList: [1] },
            bytes: [
                0x1f, 0x0d, 0x04,
                0x2f, 0x98, 0x01, 0x01
            ]
        }
    };
    const fromBytes$J = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$l) {
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
    const toBytes$J = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$l);
        const { startTime2000, days, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList.map(index => ({ index })));
        buffer.setUint8(days);
        return toBytes$U(id$J, buffer.data);
    };

    var getExAbsArchiveDaysMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$J,
        id: id$J,
        name: name$J,
        toBytes: toBytes$J
    });

    const id$I = 0x0c1f;
    const name$I = 'getExAbsArchiveHoursMc';
    const headerSize$I = 3;
    const COMMAND_BODY_SIZE$k = 4;
    const examples$I = {
        '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$I,
            name: name$I,
            headerSize: headerSize$I,
            parameters: { channelList: [1], hours: 1, startTime2000: 756648000 },
            bytes: [
                0x1f, 0x0c, 0x04,
                0x2f, 0x97, 0x0c, 0x01
            ]
        }
    };
    const fromBytes$I = (data) => {
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
    const toBytes$I = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$k);
        const { startTime2000, hours, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$U(id$I, buffer.data);
    };

    var getExAbsArchiveHoursMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$I,
        id: id$I,
        name: name$I,
        toBytes: toBytes$I
    });

    const id$H = 0x301f;
    const name$H = 'getArchiveHoursMcEx';
    const headerSize$H = 3;
    const COMMAND_BODY_SIZE$j = 5;
    const examples$H = {
        '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            parameters: { startTime2000: 756648000, hour: 12, hours: 2, channelList: [1] },
            bytes: [
                0x1f, 0x30, 0x05,
                0x2f, 0x97, 0x0c, 0x02, 0x01
            ]
        }
    };
    const fromBytes$H = (data) => {
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
    const toBytes$H = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$j);
        const { channelList, hour, hours, startTime2000 } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setUint8(hour);
        buffer.setUint8(hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$U(id$H, buffer.data);
    };

    var getArchiveHoursMcEx$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$H,
        fromBytes: fromBytes$H,
        headerSize: headerSize$H,
        id: id$H,
        name: name$H,
        toBytes: toBytes$H
    });

    const id$G = 0x0f1f;
    const name$G = 'getExAbsCurrentMC';
    const headerSize$G = 3;
    const COMMAND_BODY_SIZE$i = 0;
    const examples$G = {
        'simple request': {
            id: id$G,
            name: name$G,
            headerSize: headerSize$G,
            parameters: {},
            bytes: [
                0x1f, 0x0f, 0x00
            ]
        }
    };
    const fromBytes$G = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$i) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$G = () => toBytes$U(id$G);

    var getExAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$G,
        id: id$G,
        name: name$G,
        toBytes: toBytes$G
    });

    const id$F = 0x021f;
    const name$F = 'getLmicInfo';
    const headerSize$F = 3;
    const COMMAND_BODY_SIZE$h = 0;
    const examples$F = {
        'simple request': {
            id: id$F,
            name: name$F,
            headerSize: headerSize$F,
            parameters: {},
            bytes: [
                0x1f, 0x02, 0x00
            ]
        }
    };
    const fromBytes$F = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$h) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$F = () => toBytes$U(id$F);

    var getLmicInfo$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$F,
        id: id$F,
        name: name$F,
        toBytes: toBytes$F
    });

    const id$E = 0x04;
    const name$E = 'getParameter';
    const headerSize$E = 2;
    const examples$E = {
        'request absolute data (not multichannel device)': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 23, data: null },
            bytes: [
                0x04, 0x01,
                0x17
            ]
        },
        'request for state of absolute data (not multichannel device)': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 24, data: null },
            bytes: [
                0x04, 0x01,
                0x18
            ]
        },
        'request for state of absolute for multichannel device (1 channel)': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 29, data: { channel: 1 } },
            bytes: [
                0x04, 0x02,
                0x1d, 0x00
            ]
        },
        'request for state of absolute data for multichannel device (1 channel)': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 30, data: { channel: 1 } },
            bytes: [
                0x04, 0x02,
                0x1e, 0x00
            ]
        },
        'request for configuration for specific reporting data type': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 49, data: { dataType: 0 } },
            bytes: [
                0x04, 0x02,
                0x31, 0x00
            ]
        },
        'request for configuration for specific event id': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            parameters: { id: 50, data: { eventId: 1 } },
            bytes: [
                0x04, 0x02,
                0x32, 0x01
            ]
        }
    };
    const fromBytes$E = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getRequestParameter();
    };
    const toBytes$E = (parameters) => {
        const buffer = new CommandBinaryBuffer(getRequestParameterSize(parameters));
        buffer.setRequestParameter(parameters);
        return toBytes$U(id$E, buffer.data);
    };

    var getParameter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$E,
        fromBytes: fromBytes$E,
        headerSize: headerSize$E,
        id: id$E,
        name: name$E,
        toBytes: toBytes$E
    });

    const id$D = 0x14;
    const name$D = 'getStatus';
    const headerSize$D = 2;
    const COMMAND_BODY_SIZE$g = 0;
    const examples$D = {
        'simple request': {
            id: id$D,
            name: name$D,
            headerSize: headerSize$D,
            parameters: {},
            bytes: [
                0x14, 0x00
            ]
        }
    };
    const fromBytes$D = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$g) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$D = () => toBytes$U(id$D);

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$D,
        id: id$D,
        name: name$D,
        toBytes: toBytes$D
    });

    const id$C = 0x09;
    const name$C = 'getTime2000';
    const headerSize$C = 2;
    const COMMAND_BODY_SIZE$f = 0;
    const examples$C = {
        'simple request': {
            id: id$C,
            name: name$C,
            headerSize: headerSize$C,
            parameters: {},
            bytes: [
                0x09, 0x00
            ]
        }
    };
    const fromBytes$C = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$f) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$C = () => toBytes$U(id$C, []);

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        name: name$C,
        toBytes: toBytes$C
    });

    const id$B = 0x03;
    const name$B = 'setParameter';
    const headerSize$B = 2;
    const examples$B = {
        'set minimal reporting data interval to 1 hour': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 1, data: { value: 3600 } },
            bytes: [
                0x03, 0x05,
                0x01, 0x00, 0x00, 0x00, 0x06
            ]
        },
        'set day checkout hour to 12:00': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 4, data: { value: 12 } },
            bytes: [
                0x03, 0x02,
                0x04, 0x0c
            ]
        },
        'set reporting data type to "day"': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 5, data: { type: 1 } },
            bytes: [
                0x03, 0x02,
                0x05, 0x01
            ]
        },
        'set "with confirmation" for delivery of priority data': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 8, data: { value: 0 } },
            bytes: [
                0x03, 0x02,
                0x08, 0x00
            ]
        },
        'set activation method to "ABP"': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 9, data: { type: 1 } },
            bytes: [
                0x03, 0x02,
                0x09, 0x01
            ]
        },
        'set battery depassivation info': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 10, data: { loadTime: 100, internalResistance: 3222, lowVoltage: 233 } },
            bytes: [
                0x03, 0x07,
                0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9
            ]
        },
        'set battery minimal load time to "100"': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 11, data: { value: 100 } },
            bytes: [
                0x03, 0x05,
                0x0b, 0x00, 0x00, 0x00, 0x64
            ]
        },
        'enable 1-4 channels, and disable serial channel for device': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 13, data: { value: 0 } },
            bytes: [
                0x03, 0x02,
                0x0d, 0x00
            ]
        },
        'set spread factor and frequency for RX2 window': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 18, data: { spreadFactor: 5, frequency: 20000 } },
            bytes: [
                0x03, 0x05,
                0x12, 0x05, 0x00, 0x00, 0xc8
            ]
        },
        'set absolute data (not multichannel device)': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 23, data: { meterValue: 204, pulseCoefficient: 100, value: 2023 } },
            bytes: [
                0x03, 0x0a,
                0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
            ]
        },
        'enable absolute data (not multichannel device)': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 24, data: { state: 1 } },
            bytes: [
                0x03, 0x02,
                0x18, 0x01
            ]
        },
        'set device serial number': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 25, data: { value: '1b 0a 3e dc 3e 22' } },
            bytes: [
                0x03, 0x07,
                0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22
            ]
        },
        'set device geolocation': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 26, data: { latitude: 34.43, longitude: 43.43, altitude: 23 } },
            bytes: [
                0x03, 0x0b,
                0x1a, 0x52, 0xb8, 0x09, 0x42, 0x52, 0xb8, 0x2d, 0x42, 0x17, 0x00
            ]
        },
        'set interval to send EXTRA FRAME': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 28, data: { value: 3600 } },
            bytes: [
                0x03, 0x03,
                0x1c, 0x10, 0x0e
            ]
        },
        'set absolute data for multichannel device (1 channel)': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 29, data: { channel: 1, meterValue: 402, pulseCoefficient: 1000, value: 2032 } },
            bytes: [
                0x03, 0x0b,
                0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
            ]
        },
        'enable absolute data for multichannel device (2 channel)': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 30, data: { channel: 2, state: 1 } },
            bytes: [
                0x03, 0x03,
                0x1e, 0x01, 0x01
            ]
        },
        'set pulse channels config': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 31, data: { channelList: [1, 4], pullUpTime: 18, scanTime: 23 } },
            bytes: [
                0x03, 0x04,
                0x1f, 0x09, 0x12, 0x17
            ]
        },
        'enable channels: 1, 2, disable channels: 3, 4, for pulse device': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 32, data: { channel1: true, channel2: true, channel3: false, channel4: false } },
            bytes: [
                0x03, 0x02,
                0x20, 0x03
            ]
        },
        'set depassivation config for device': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: { id: 33, data: { resistanceStartThreshold: 36000, resistanceStopThreshold: 26000 } },
            bytes: [
                0x03, 0x05,
                0x21, 0x8c, 0xa0, 0x65, 0x90
            ]
        },
        'set nbiot bands': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            parameters: {
                id: 52,
                data: { bands: [3, 8, 20] }
            },
            bytes: [
                0x03, 0x05,
                0x34, 0x03, 0x03, 0x08, 0x14
            ]
        }
    };
    const fromBytes$B = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getParameter();
    };
    const toBytes$B = (parameters) => {
        const buffer = new CommandBinaryBuffer(getParameterSize(parameters));
        buffer.setParameter(parameters);
        return toBytes$U(id$B, buffer.data);
    };

    var setParameter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$B,
        fromBytes: fromBytes$B,
        headerSize: headerSize$B,
        id: id$B,
        name: name$B,
        toBytes: toBytes$B
    });

    const id$A = 0x02;
    const name$A = 'setTime2000';
    const headerSize$A = 2;
    const COMMAND_BODY_SIZE$e = 5;
    const examples$A = {
        'set time to 2023.04.03 14:01:17 GMT': {
            id: id$A,
            headerSize: headerSize$A,
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
    const fromBytes$A = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$e) {
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
    const toBytes$A = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$e, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt32(seconds);
        return toBytes$U(id$A, buffer.data);
    };

    var setTime2000$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$A,
        fromBytes: fromBytes$A,
        headerSize: headerSize$A,
        id: id$A,
        name: name$A,
        toBytes: toBytes$A
    });

    const id$z = 0x19;
    const name$z = 'softRestart';
    const headerSize$z = 2;
    const COMMAND_BODY_SIZE$d = 0;
    const examples$z = {
        'simple request': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$z = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$d) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$z = () => toBytes$U(id$z);

    var softRestart$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$z,
        fromBytes: fromBytes$z,
        headerSize: headerSize$z,
        id: id$z,
        name: name$z,
        toBytes: toBytes$z
    });

    const id$y = 0x2a1f;
    const name$y = 'writeImage';
    const headerSize$y = 3;
    const COMMAND_BODY_MIN_SIZE$2 = 4;
    const examples$y = {
        'write image': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
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
    const fromBytes$y = (data) => {
        if (data.length < COMMAND_BODY_MIN_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const offset = buffer.getUint32(false);
        return { offset, data: data.slice(COMMAND_BODY_MIN_SIZE$2) };
    };
    const toBytes$y = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$2);
        buffer.setUint32(parameters.offset, false);
        buffer.setBytes(parameters.data);
        return toBytes$U(id$y, buffer.data);
    };
    const toJson$1 = (parameters) => JSON.stringify(parameters);

    var writeImage$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$y,
        id: id$y,
        name: name$y,
        toBytes: toBytes$y,
        toJson: toJson$1
    });

    const id$x = 0x2b1f;
    const name$x = 'verifyImage';
    const headerSize$x = 3;
    const COMMAND_BODY_SIZE$c = 0;
    const examples$x = {
        'simple request': {
            id: id$x,
            name: name$x,
            headerSize: headerSize$x,
            parameters: {},
            bytes: [
                0x1f, 0x2b, 0x00
            ]
        }
    };
    const fromBytes$x = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$c) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$x = () => toBytes$U(id$x);

    var verifyImage$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$x,
        fromBytes: fromBytes$x,
        headerSize: headerSize$x,
        id: id$x,
        name: name$x,
        toBytes: toBytes$x
    });

    const id$w = 0x2c1f;
    const name$w = 'updateRun';
    const headerSize$w = 3;
    const COMMAND_BODY_SIZE$b = 0;
    const examples$w = {
        'simple request': {
            id: id$w,
            name: name$w,
            headerSize: headerSize$w,
            parameters: {},
            bytes: [
                0x1f, 0x2c, 0x00
            ]
        }
    };
    const fromBytes$w = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$b) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$w = () => toBytes$U(id$w);

    var updateRun$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$w,
        fromBytes: fromBytes$w,
        headerSize: headerSize$w,
        id: id$w,
        name: name$w,
        toBytes: toBytes$w
    });

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000$1,
        dataSegment: dataSegment$1,
        getArchiveDays: getArchiveDays$1,
        getArchiveDaysMc: getArchiveDaysMc$1,
        getArchiveEvents: getArchiveEvents$1,
        getArchiveHours: getArchiveHours$1,
        getArchiveHoursMc: getArchiveHoursMc$1,
        getArchiveHoursMcEx: getArchiveHoursMcEx$1,
        getBatteryStatus: getBatteryStatus$1,
        getCurrent: getCurrent,
        getCurrentMc: getCurrentMc,
        getExAbsArchiveDaysMc: getExAbsArchiveDaysMc$1,
        getExAbsArchiveHoursMc: getExAbsArchiveHoursMc$1,
        getExAbsCurrentMc: getExAbsCurrentMc,
        getLmicInfo: getLmicInfo$1,
        getParameter: getParameter$1,
        getStatus: getStatus,
        getTime2000: getTime2000,
        setParameter: setParameter$1,
        setTime2000: setTime2000$1,
        softRestart: softRestart$1,
        updateRun: updateRun$1,
        verifyImage: verifyImage$1,
        writeImage: writeImage$1
    });

    const id$v = 0x0c;
    const name$v = 'correctTime2000';
    const headerSize$v = 2;
    const COMMAND_BODY_SIZE$a = 1;
    const examples$v = {
        'time correction failure': {
            id: id$v,
            name: name$v,
            headerSize: headerSize$v,
            parameters: { status: 0 },
            bytes: [
                0x0c, 0x01,
                0x00
            ]
        },
        'time correction success': {
            id: id$v,
            name: name$v,
            headerSize: headerSize$v,
            parameters: { status: 1 },
            bytes: [
                0x0c, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$v = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$a) {
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
    const toBytes$v = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$a, false);
        buffer.setUint8(status);
        return toBytes$U(id$v, buffer.data);
    };

    var correctTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$v,
        fromBytes: fromBytes$v,
        headerSize: headerSize$v,
        id: id$v,
        name: name$v,
        toBytes: toBytes$v
    });

    const id$u = 0x07;
    const name$u = 'current';
    const headerSize$u = 2;
    const COMMAND_BODY_MAX_SIZE$e = 4;
    const examples$u = {
        'simple response channels': {
            id: id$u,
            name: name$u,
            headerSize: headerSize$u,
            parameters: { isMagneticInfluence: true, value: 342 },
            bytes: [
                0x07, 0x04,
                0x80, 0x00, 0x01, 0x56
            ]
        }
    };
    const fromBytes$u = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$e) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyCounter();
    };
    const toBytes$u = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$e);
        buffer.setLegacyCounter(parameters);
        return toBytes$U(id$u, buffer.data);
    };

    var current = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$u,
        fromBytes: fromBytes$u,
        headerSize: headerSize$u,
        id: id$u,
        name: name$u,
        toBytes: toBytes$u
    });

    const id$t = 0x18;
    const name$t = 'currentMc';
    const headerSize$t = 2;
    const COMMAND_BODY_MAX_SIZE$d = 37;
    const examples$t = {
        '4 first channels': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
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
        'single channel 2': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
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
        'channels 5, 6, 12': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
            parameters: {
                channelList: [
                    { value: 8146, index: 5 },
                    { value: 164, index: 6 },
                    { value: 75, index: 12 }
                ]
            },
            bytes: [
                0x18, 0x07,
                0xb0, 0x10, 0xd2, 0x3f, 0xa4, 0x01, 0x4b
            ]
        }
    };
    const fromBytes$t = (data) => {
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
    const toBytes$t = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$d);
        const { channelList } = parameters;
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$U(id$t, buffer.getBytesToOffset());
    };

    var currentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$t,
        fromBytes: fromBytes$t,
        headerSize: headerSize$t,
        id: id$t,
        name: name$t,
        toBytes: toBytes$t
    });

    var dataSegment = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        name: name$S,
        toBytes: toBytes$S
    });

    const id$s = 0x20;
    const name$s = 'day';
    const headerSize$s = 1;
    const COMMAND_BODY_SIZE$9 = 6;
    const examples$s = {
        'day value for 2023.12.23 00:00:00 GMT': {
            id: id$s,
            name: name$s,
            headerSize: headerSize$s,
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
    const fromBytes$s = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const byte = buffer.getUint8();
        const { hour } = buffer.getHours(byte);
        const isMagneticInfluence = CommandBinaryBuffer.getMagneticInfluenceBit(byte);
        const value = buffer.getLegacyCounterValue();
        date.setUTCHours(hour);
        return { value, isMagneticInfluence, startTime2000: getTime2000FromDate(date) };
    };
    const toBytes$s = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$9);
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
        return toBytes$U(id$s, buffer.getBytesToOffset());
    };

    var day = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$s,
        fromBytes: fromBytes$s,
        headerSize: headerSize$s,
        id: id$s,
        name: name$s,
        toBytes: toBytes$s
    });

    const id$r = 0x16;
    const name$r = 'dayMc';
    const headerSize$r = 2;
    const COMMAND_BODY_MAX_SIZE$c = 32;
    const examples$r = {
        '4 channels at 2023.12.23 00:00:00 GMT': {
            id: id$r,
            name: name$r,
            headerSize: headerSize$r,
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
    const fromBytes$r = (data) => {
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
    const toBytes$r = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$c);
        const { channelList, startTime2000 } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$U(id$r, buffer.getBytesToOffset());
    };

    var dayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$r,
        fromBytes: fromBytes$r,
        headerSize: headerSize$r,
        id: id$r,
        name: name$r,
        toBytes: toBytes$r
    });

    const id$q = 0x0f1f;
    const name$q = 'exAbsCurrentMc';
    const headerSize$q = 3;
    const COMMAND_BODY_MAX_SIZE$b = 87;
    const examples$q = {
        'absolute current value from channel 3': {
            id: id$q,
            name: name$q,
            headerSize: headerSize$q,
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
    const fromBytes$q = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return { channelList: buffer.getChannelsWithAbsoluteValues() };
    };
    const toBytes$q = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$b);
        buffer.setChannelsWithAbsoluteValues(parameters.channelList);
        return toBytes$U(id$q, buffer.getBytesToOffset());
    };

    var exAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$q,
        fromBytes: fromBytes$q,
        headerSize: headerSize$q,
        id: id$q,
        name: name$q,
        toBytes: toBytes$q
    });

    const id$p = 0x0b1f;
    const name$p = 'exAbsDayMc';
    const headerSize$p = 3;
    const COMMAND_BODY_MAX_SIZE$a = 89;
    const examples$p = {
        'absolute day value for 2023.03.10 00:00:00 GMT': {
            id: id$p,
            name: name$p,
            headerSize: headerSize$p,
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
    const fromBytes$p = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$a) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannelsWithAbsoluteValues();
        return { startTime2000: getTime2000FromDate(date), channelList };
    };
    const toBytes$p = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$a);
        const { startTime2000, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannelsWithAbsoluteValues(channelList);
        return toBytes$U(id$p, buffer.getBytesToOffset());
    };

    var exAbsDayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$p,
        fromBytes: fromBytes$p,
        headerSize: headerSize$p,
        id: id$p,
        name: name$p,
        toBytes: toBytes$p
    });

    const id$o = 0x0a1f;
    const name$o = 'exAbsHourMc';
    const headerSize$o = 3;
    const COMMAND_BODY_MAX_SIZE$9 = 168;
    const examples$o = {
        '1 channel at 2023.03.10 12:00:00 GMT': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
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
    const fromBytes$o = (data) => {
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
    const toBytes$o = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$9);
        const { startTime2000, hours, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(startTime2000);
        buffer.setHours(hour, hours);
        buffer.setChannelsAbsoluteValuesWithHourDiff(channelList);
        return toBytes$U(id$o, buffer.getBytesToOffset());
    };

    var exAbsHourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$o,
        fromBytes: fromBytes$o,
        headerSize: headerSize$o,
        id: id$o,
        name: name$o,
        toBytes: toBytes$o
    });

    const id$n = 0x06;
    const name$n = 'getArchiveDays';
    const headerSize$n = 2;
    const COMMAND_BODY_MIN_SIZE$1 = 2;
    const DAY_COUNTER_SIZE = 4;
    const examples$n = {
        'get day values from 2001.03.10': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
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
    const fromBytes$n = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const dayList = [];
        while (buffer.offset < buffer.data.length) {
            dayList.push(buffer.getLegacyCounter());
        }
        return { startTime2000: getTime2000FromDate(date), dayList };
    };
    const toBytes$n = (parameters) => {
        const { startTime2000, dayList } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$1 + (dayList.length * DAY_COUNTER_SIZE));
        buffer.setDate(startTime2000);
        dayList.forEach(dayCounter => buffer.setLegacyCounter(dayCounter));
        return toBytes$U(id$n, buffer.getBytesToOffset());
    };

    var getArchiveDays = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        name: name$n,
        toBytes: toBytes$n
    });

    const id$m = 0x1b;
    const name$m = 'getArchiveDaysMc';
    const headerSize$m = 2;
    const COMMAND_BODY_MAX_SIZE$8 = 5104;
    const examples$m = {
        'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
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
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            parameters: {
                startTime2000: 339897600,
                days: 1,
                channelList: [{ dayList: [0], index: 1 }]
            },
            bytes: [
                0x1b, 0x05,
                0x15, 0x49, 0x01, 0x01, 0x00
            ]
        }
    };
    const fromBytes$m = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList = [];
        channels.forEach(channelIndex => {
            const dayList = [];
            channelList.push({ dayList, index: channelIndex });
            for (let day = 0; day < days; ++day) {
                dayList.push(buffer.getExtendedValue());
            }
        });
        return { startTime2000: getTime2000FromDate(date), days, channelList };
    };
    const toBytes$m = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$8);
        const { startTime2000, days, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);
        channelList.forEach(({ dayList }) => {
            dayList.forEach(value => {
                buffer.setExtendedValue(value);
            });
        });
        return toBytes$U(id$m, buffer.getBytesToOffset());
    };

    var getArchiveDaysMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        name: name$m,
        toBytes: toBytes$m
    });

    const id$l = 0x0b;
    const name$l = 'getArchiveEvents';
    const headerSize$l = 2;
    const COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    const examples$l = {
        '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: {
                eventList: [
                    {
                        time2000: 734015840,
                        id: 1,
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
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: {
                eventList: [
                    {
                        time2000: 734015840,
                        id: 2,
                        sequenceNumber: 1
                    },
                    {
                        time2000: 734025840,
                        id: 1,
                        sequenceNumber: 2
                    },
                    {
                        time2000: 734035840,
                        id: 3,
                        sequenceNumber: 3
                    },
                    {
                        time2000: 734045840,
                        id: 4,
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
    const getEvent = (buffer) => ({
        time2000: buffer.getTime(),
        id: buffer.getUint8(),
        sequenceNumber: buffer.getUint8()
    });
    const setEvent = (buffer, event) => {
        buffer.setTime(event.time2000);
        buffer.setUint8(event.id);
        buffer.setUint8(event.sequenceNumber);
    };
    const fromBytes$l = (data) => {
        const buffer = new CommandBinaryBuffer(data, false);
        const eventList = [];
        while (buffer.bytesLeft > 0) {
            eventList.push(getEvent(buffer));
        }
        return { eventList };
    };
    function toBytes$l(parameters) {
        const { eventList } = parameters;
        const buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE, false);
        eventList.forEach(event => setEvent(buffer, event));
        return toBytes$U(id$l, buffer.data);
    }

    var getArchiveEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        name: name$l,
        toBytes: toBytes$l
    });

    const id$k = 0x05;
    const name$k = 'getArchiveHours';
    const headerSize$k = 2;
    const examples$k = {
        '1 hour archive from 2023.12.23 12:00:00 GMT': {
            id: id$k,
            name: name$k,
            headerSize: headerSize$k,
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
    const fromBytes$k = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyHourCounterWithDiff();
    };
    const toBytes$k = (parameters) => {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
        buffer.setLegacyHourCounterWithDiff(parameters);
        return toBytes$U(id$k, buffer.getBytesToOffset());
    };

    var getArchiveHours = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        name: name$k,
        toBytes: toBytes$k
    });

    const id$j = 0x1a;
    const name$j = 'getArchiveHoursMc';
    const headerSize$j = 2;
    const COMMAND_BODY_MAX_SIZE$7 = 164;
    const examples$j = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
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
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
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
    const fromBytes$j = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$7) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$j = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
        const { hours, startTime2000, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);
        return toBytes$U(id$j, buffer.getBytesToOffset());
    };

    var getArchiveHoursMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        name: name$j,
        toBytes: toBytes$j
    });

    const id$i = 0x301f;
    const name$i = 'getArchiveHoursMcEx';
    const headerSize$i = 3;
    const COMMAND_BODY_MAX_SIZE$6 = 164;
    const examples$i = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
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
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
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
    const fromBytes$i = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$6) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiffExtended();
    };
    const toBytes$i = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
        buffer.setChannelsValuesWithHourDiffExtended(parameters);
        return toBytes$U(id$i, buffer.getBytesToOffset());
    };

    var getArchiveHoursMcEx = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$i,
        fromBytes: fromBytes$i,
        headerSize: headerSize$i,
        id: id$i,
        name: name$i,
        toBytes: toBytes$i
    });

    const id$h = 0x051f;
    const name$h = 'getBatteryStatus';
    const headerSize$h = 3;
    const COMMAND_BODY_SIZE$8 = 11;
    const examples$h = {
        'simple response': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
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
                0x10, 0x0e, 0x10, 0x0e, 0x0a, 0x04, 0x0f, 0x29, 0x00, 0x22, 0x00
            ]
        }
    };
    const fromBytes$h = (data) => {
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
    const toBytes$h = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$8);
        buffer.setUint16(parameters.voltageUnderLowLoad);
        buffer.setUint16(parameters.voltageUnderHighLoad);
        buffer.setUint16(parameters.internalResistance);
        buffer.setUint8(parameters.temperature);
        buffer.setUint8(parameters.remainingCapacity);
        buffer.setUint8(parameters.isLastDayOverconsumption ? 1 : 0);
        buffer.setUint16(parameters.averageDailyOverconsumptionCounter);
        return toBytes$U(id$h, buffer.data);
    };

    var getBatteryStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        name: name$h,
        toBytes: toBytes$h
    });

    const id$g = 0x0d1f;
    const name$g = 'getExAbsArchiveDaysMc';
    const headerSize$g = 3;
    const COMMAND_BODY_MAX_SIZE$5 = 6124;
    const examples$g = {
        'archive days values at 4 channel from 2023.03.10 00:00:00 GMT': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
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
    const fromBytes$g = (data) => {
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
                dayList.push(buffer.getExtendedValue());
            }
        });
        return { channelList, days, startTime2000: getTime2000FromDate(date) };
    };
    const toBytes$g = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$5);
        const { channelList, startTime2000, days } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);
        channelList.forEach(({ pulseCoefficient, dayList }) => {
            buffer.setPulseCoefficient(pulseCoefficient);
            dayList.forEach(value => {
                buffer.setExtendedValue(value);
            });
        });
        return toBytes$U(id$g, buffer.getBytesToOffset());
    };

    var getExAbsArchiveDaysMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$g,
        fromBytes: fromBytes$g,
        headerSize: headerSize$g,
        id: id$g,
        name: name$g,
        toBytes: toBytes$g
    });

    const id$f = 0x1a;
    const name$f = 'getExAbsArchiveHoursMc';
    const headerSize$f = 2;
    const COMMAND_BODY_MAX_SIZE$4 = 164;
    const examples$f = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
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
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
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
    const fromBytes$f = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$f = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
        buffer.setChannelsValuesWithHourDiff(parameters.hours, parameters.startTime2000, parameters.channelList);
        return toBytes$U(id$f, buffer.getBytesToOffset());
    };

    var getExAbsArchiveHoursMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$f,
        fromBytes: fromBytes$f,
        headerSize: headerSize$f,
        id: id$f,
        name: name$f,
        toBytes: toBytes$f
    });

    const id$e = 0x021f;
    const name$e = 'getLmicInfo';
    const headerSize$e = 3;
    const COMMAND_BODY_SIZE$7 = 2;
    const lmicCapabilitiesBitMask = {
        isMulticastSupported: 1 << 0,
        isFragmentedDataSupported: 1 << 1
    };
    const examples$e = {
        'version: 5, support only multicast': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
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
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
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
    const fromBytes$e = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$7) {
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
    const toBytes$e = (parameters) => {
        const { capabilities, version } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$7);
        buffer.setUint8(fromObject(lmicCapabilitiesBitMask, capabilities));
        buffer.setUint8(version);
        return toBytes$U(id$e, buffer.data);
    };

    var getLmicInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$e,
        fromBytes: fromBytes$e,
        headerSize: headerSize$e,
        id: id$e,
        name: name$e,
        toBytes: toBytes$e
    });

    const id$d = 0x04;
    const name$d = 'getParameter';
    const headerSize$d = 2;
    const examples$d = {
        'reporting data interval': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 1,
                data: { value: 2400 }
            },
            bytes: [
                0x04, 0x05,
                0x01, 0x00, 0x00, 0x00, 0x04
            ]
        },
        'absolute data (not multichannel device)': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 23,
                data: { meterValue: 204, pulseCoefficient: 100, value: 2023 }
            },
            bytes: [
                0x04, 0x0a,
                0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
            ]
        },
        'state of absolute data (not multichannel device)': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 24,
                data: { state: 1 }
            },
            bytes: [
                0x04, 0x02,
                0x18, 0x01
            ]
        },
        'absolute data for multichannel device (1 channel)': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 29,
                data: { channel: 1, meterValue: 402, pulseCoefficient: 1000, value: 2032 }
            },
            bytes: [
                0x04, 0x0b,
                0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
            ]
        },
        'state of absolute data for multichannel device (1 channel)': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 30,
                data: { channel: 2, state: 1 }
            },
            bytes: [
                0x04, 0x03,
                0x1e, 0x01, 0x01
            ]
        },
        'nbiot module info': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 51,
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
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            parameters: {
                id: 52,
                data: { bands: [3, 20] }
            },
            bytes: [
                0x04, 0x04,
                0x34, 0x02, 0x03, 0x14
            ]
        }
    };
    const fromBytes$d = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getResponseParameter();
    };
    const toBytes$d = (parameters) => {
        const buffer = new CommandBinaryBuffer(getResponseParameterSize(parameters));
        buffer.setResponseParameter(parameters);
        return toBytes$U(id$d, buffer.data);
    };

    var getParameter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$d,
        fromBytes: fromBytes$d,
        headerSize: headerSize$d,
        id: id$d,
        name: name$d,
        toBytes: toBytes$d
    });

    const id$c = 0x40;
    const name$c = 'hour';
    const headerSize$c = 1;
    const examples$c = {
        '1 hour from 2023.12.23 12:00:00 GMT': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
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
    const fromBytes$c = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getLegacyHourCounterWithDiff();
    };
    const toBytes$c = (parameters) => {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
        buffer.setLegacyHourCounterWithDiff(parameters);
        return toBytes$U(id$c, buffer.getBytesToOffset());
    };

    var hour = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$c,
        fromBytes: fromBytes$c,
        headerSize: headerSize$c,
        id: id$c,
        name: name$c,
        toBytes: toBytes$c
    });

    const id$b = 0x17;
    const name$b = 'hourMc';
    const headerSize$b = 2;
    const COMMAND_BODY_MAX_SIZE$3 = 164;
    const examples$b = {
        '4 first channels at 2023.12.23 12:00:00 GMT': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
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
    const fromBytes$b = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$3) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$b = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
        const { startTime2000, hours, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);
        return toBytes$U(id$b, buffer.getBytesToOffset());
    };

    var hourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$b,
        fromBytes: fromBytes$b,
        headerSize: headerSize$b,
        id: id$b,
        name: name$b,
        toBytes: toBytes$b
    });

    const id$a = 0x311f;
    const name$a = 'hourMcEx';
    const headerSize$a = 3;
    const COMMAND_BODY_MAX_SIZE$2 = 5125;
    const examples$a = {
        '1 channel at 2023.12.23 12:00:00 GMT': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
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
    const fromBytes$a = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiffExtended();
    };
    const toBytes$a = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
        buffer.setChannelsValuesWithHourDiffExtended(parameters);
        return toBytes$U(id$a, buffer.getBytesToOffset());
    };

    var hourMcEx = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$a,
        fromBytes: fromBytes$a,
        headerSize: headerSize$a,
        id: id$a,
        name: name$a,
        toBytes: toBytes$a
    });

    const id$9 = 0x60;
    const name$9 = 'lastEvent';
    const headerSize$9 = 1;
    const examples$9 = {
        'status for GASI3': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
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
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
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
        'status for MTXLORA': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
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
        }
    };
    const fromBytes$9 = (data, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        const status = buffer.getEventStatus(config.hardwareType);
        return { sequenceNumber, status };
    };
    const toBytes$9 = (parameters, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
        const { sequenceNumber, status } = parameters;
        buffer.setUint8(sequenceNumber);
        buffer.setEventStatus(config.hardwareType, status);
        return toBytes$U(id$9, buffer.data);
    };

    var lastEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$9,
        fromBytes: fromBytes$9,
        headerSize: headerSize$9,
        id: id$9,
        name: name$9,
        toBytes: toBytes$9
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
    const ACTIVATE_MTX = 11;
    const CONNECT = 12;
    const DISCONNECT = 13;
    const OPTOLOW = 15;
    const OPTOFLASH = 16;
    const MTX = 17;
    const JOIN_ACCEPT = 18;

    const id$8 = 0x15;
    const name$8 = 'newEvent';
    const headerSize$8 = 2;
    const COMMAND_BODY_MAX_SIZE$1 = 14;
    const MTX_ADDRESS_SIZE = 8;
    const examples$8 = {
        'event for MAGNET_ON': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 1,
                sequenceNumber: 2,
                data: { time2000: 734015840 }
            },
            bytes: [
                0x15, 0x06,
                0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60
            ]
        },
        'event for BATTERY_ALARM': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 5,
                sequenceNumber: 2,
                data: { voltage: 3308 }
            },
            bytes: [
                0x15, 0x04,
                0x05, 0x02, 0x0c, 0xec
            ]
        },
        'event for ACTIVATE_MTX': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 11,
                sequenceNumber: 2,
                data: { time2000: 734015840, deviceId: '00 1a 79 88 17 01 23 56' }
            },
            bytes: [
                0x15, 0x0e,
                0x0b, 0x02, 0x2b, 0xc0, 0x31, 0x60, 0x00, 0x1a, 0x79, 0x88, 0x17, 0x01, 0x23, 0x56
            ]
        },
        'event for CONNECT': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 12,
                sequenceNumber: 2,
                data: { channel: 1, value: 131 }
            },
            bytes: [
                0x15, 0x05,
                0x0c, 0x02, 0x00, 0x83, 0x01
            ]
        },
        'event for DISCONNECT': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 13,
                sequenceNumber: 2,
                data: { channel: 1, value: 131 }
            },
            bytes: [
                0x15, 0x05,
                0x0d, 0x02, 0x00, 0x83, 0x01
            ]
        },
        'event for EV_MTX': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            parameters: {
                id: 17,
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
    const getVoltage = (buffer) => buffer.getUint16(false);
    const setVoltage = (buffer, value) => buffer.setUint16(value, false);
    const getDeviceId = (buffer) => (getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE)));
    const setDeviceId = (buffer, value) => {
        getBytesFromHex(value).forEach(byte => buffer.setUint8(byte));
    };
    const fromBytes$8 = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$1) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const eventId = buffer.getUint8();
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
            default:
                throw new Error(`Event ${id$8} is not supported`);
        }
        return { id: eventId, sequenceNumber, data: eventData };
    };
    const toBytes$8 = (parameters) => {
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
            default:
                throw new Error(`Event ${id$8} is not supported`);
        }
        return toBytes$U(id$8, buffer.getBytesToOffset());
    };

    var newEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$8,
        fromBytes: fromBytes$8,
        headerSize: headerSize$8,
        id: id$8,
        name: name$8,
        toBytes: toBytes$8
    });

    const id$7 = 0x03;
    const name$7 = 'setParameter';
    const headerSize$7 = 2;
    const COMMAND_BODY_SIZE$6 = 2;
    const examples$7 = {
        'activation method set successfully': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
            parameters: { id: 9, status: 1 },
            bytes: [
                0x03, 0x02,
                0x09, 0x01
            ]
        },
        'configuration for battery depassivation set successfully': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
            parameters: { id: 33, status: 1 },
            bytes: [
                0x03, 0x02,
                0x21, 0x01
            ]
        }
    };
    const fromBytes$7 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$6) {
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
    const toBytes$7 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$6);
        buffer.setUint8(parameters.id);
        buffer.setUint8(parameters.status);
        return toBytes$U(id$7, buffer.data);
    };

    var setParameter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$7,
        fromBytes: fromBytes$7,
        headerSize: headerSize$7,
        id: id$7,
        name: name$7,
        toBytes: toBytes$7
    });

    const id$6 = 0x02;
    const name$6 = 'setTime2000';
    const headerSize$6 = 2;
    const COMMAND_BODY_SIZE$5 = 1;
    const examples$6 = {
        success: {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            parameters: { status: 1 },
            bytes: [
                0x02, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$6 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$5) {
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
    const toBytes$6 = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$5, false);
        buffer.setUint8(status);
        return toBytes$U(id$6, buffer.data);
    };

    var setTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$6,
        fromBytes: fromBytes$6,
        headerSize: headerSize$6,
        id: id$6,
        name: name$6,
        toBytes: toBytes$6
    });

    const id$5 = 0x19;
    const name$5 = 'softRestart';
    const headerSize$5 = 2;
    const COMMAND_BODY_SIZE$4 = 0;
    const examples$5 = {
        'simple response': {
            id: id$5,
            name: name$5,
            headerSize: headerSize$5,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$5 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$4) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$5 = () => toBytes$U(id$5);

    var softRestart = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$5,
        fromBytes: fromBytes$5,
        headerSize: headerSize$5,
        id: id$5,
        name: name$5,
        toBytes: toBytes$5
    });

    const id$4 = 0x14;
    const name$4 = 'status';
    const headerSize$4 = 2;
    const COMMAND_BODY_MAX_SIZE = 20;
    const UNKNOWN_BATTERY_RESISTANCE = 65535;
    const UNKNOWN_BATTERY_CAPACITY = 255;
    const examples$4 = {
        'status for GASI3': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
            parameters: {
                software: { type: 2, version: 10 },
                hardware: { type: GASI3, version: 1 },
                data: {
                    batteryVoltage: { underLowLoad: 3158, underHighLoad: 3522 },
                    batteryInternalResistance: 10034,
                    temperature: 14,
                    remainingBatteryCapacity: 41,
                    lastEventSequenceNumber: 34
                }
            },
            bytes: [
                0x14, 0x0c,
                0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22
            ]
        },
        'status for MTX': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
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
                0x02, 0x0a, 0x07, 0x01, 0x5c, 0x11, 0x00, 0x00,
                0x01, 0x02, 0x06, 0x2a, 0x53, 0x8f, 0x02, 0x05,
                0x0c, 0x0a, 0x02, 0x21
            ]
        }
    };
    const fromBytes$4 = (bytes) => {
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
                        batteryInternalResistance: buffer.getUint16(false),
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
                        statusData.remainingBatteryCapacity = roundNumber((statusData.remainingBatteryCapacity * 100) / (UNKNOWN_BATTERY_CAPACITY - 1), 0);
                    }
                    data = statusData;
                }
                break;
            case MTXLORA:
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
                throw new Error(`${id$4}: hardware type ${hardware.type} is not supported`);
        }
        return { software, hardware, data };
    };
    const toBytes$4 = (parameters) => {
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
                        buffer.setUint16(UNKNOWN_BATTERY_RESISTANCE, false);
                    }
                    else {
                        buffer.setUint16(statusData.batteryInternalResistance, false);
                    }
                    buffer.setUint8(statusData.temperature);
                    if (statusData.remainingBatteryCapacity === undefined) {
                        buffer.setUint8(UNKNOWN_BATTERY_CAPACITY);
                    }
                    else {
                        buffer.setUint8((UNKNOWN_BATTERY_CAPACITY - 1) * (statusData.remainingBatteryCapacity / 100));
                    }
                    buffer.setUint8(statusData.lastEventSequenceNumber);
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
                throw new Error(`${id$4}: hardware type ${hardware.type} is not supported`);
        }
        return toBytes$U(id$4, buffer.getBytesToOffset());
    };

    var status = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$4,
        fromBytes: fromBytes$4,
        headerSize: headerSize$4,
        id: id$4,
        name: name$4,
        toBytes: toBytes$4
    });

    const id$3 = 0x09;
    const name$3 = 'time2000';
    const headerSize$3 = 2;
    const COMMAND_BODY_SIZE$3 = 5;
    const examples$3 = {
        'time is 2023.04.03 14:01:17 GMT': {
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
            parameters: { sequenceNumber: 77, time2000: 733845677 },
            bytes: [
                0x09, 0x05,
                0x4d, 0x2b, 0xbd, 0x98, 0xad
            ]
        }
    };
    const fromBytes$3 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$3) {
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
    function toBytes$3(parameters) {
        const { sequenceNumber, time2000 } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$3);
        buffer.setUint8(sequenceNumber);
        buffer.setTime(time2000);
        return toBytes$U(id$3, buffer.data);
    }

    var time2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$3,
        fromBytes: fromBytes$3,
        headerSize: headerSize$3,
        id: id$3,
        name: name$3,
        toBytes: toBytes$3
    });

    const id$2 = 0x2c1f;
    const name$2 = 'updateRun';
    const headerSize$2 = 3;
    const COMMAND_BODY_SIZE$2 = 0;
    const examples$2 = {
        'simple response': {
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            parameters: {},
            bytes: [
                0x1f, 0x2c, 0x00
            ]
        }
    };
    const fromBytes$2 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$2 = () => toBytes$U(id$2);

    var updateRun = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$2,
        fromBytes: fromBytes$2,
        headerSize: headerSize$2,
        id: id$2,
        name: name$2,
        toBytes: toBytes$2
    });

    const id$1 = 0x2b1f;
    const name$1 = 'verifyImage';
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
        return toBytes$U(id$1, buffer.data);
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

    const id = 0x2a1f;
    const name = 'writeImage';
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
            offset: buffer.getUint32(false),
            status: buffer.getUint8()
        };
    };
    const toBytes = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        buffer.setUint32(parameters.offset, false);
        buffer.setUint8(parameters.status);
        return toBytes$U(id, buffer.data);
    };
    const toJson = (parameters) => JSON.stringify(parameters);

    var writeImage = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples,
        fromBytes: fromBytes,
        headerSize: headerSize,
        id: id,
        name: name,
        toBytes: toBytes,
        toJson: toJson
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
        softRestart: softRestart,
        status: status,
        time2000: time2000,
        updateRun: updateRun,
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
