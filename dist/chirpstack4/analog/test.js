(function () {
    'use strict';

    const hexFormatOptions = {
        separator: ' ',
        prefix: ''
    };

    const INT8_SIZE = 1;
    const INT16_SIZE = 2;
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
    const be4 = [3, 2, 1, 0];
    const le2 = [0, 1];
    const le4 = [0, 1, 2, 3];
    const readUint8 = (buffer, offset) => buffer[offset];
    const readUint16 = (buffer, offset, isLittleEndian) => {
        const order = isLittleEndian ? le2 : be2;
        const b0 = buffer[offset + order[0]];
        const b1 = buffer[offset + order[1]] << 8;
        return b0 | b1;
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
    const toBytes$q = (commandId, commandSize) => {
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

    const toBytes$p = (commandId, commandData = []) => {
        const headerData = toBytes$q(commandId, commandData.length);
        return [...headerData, ...commandData];
    };

    const id$o = 0x0c;
    const name$o = 'correctTime2000';
    const headerSize$o = 2;
    const COMMAND_BODY_SIZE$d = 2;
    const examples$o = {
        'correct time 120 seconds to the past': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            parameters: { sequenceNumber: 45, seconds: -120 },
            bytes: [
                0x0c, 0x02,
                0x2d, 0x88
            ]
        },
        'correct time 95 seconds to the future': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            parameters: { sequenceNumber: 46, seconds: 95 },
            bytes: [
                0x0c, 0x02,
                0x2e, 0x5f
            ]
        }
    };
    const fromBytes$o = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$d) {
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
    const toBytes$o = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$d, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt8(seconds);
        return toBytes$p(id$o, buffer.data);
    };

    var correctTime2000$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$o,
        fromBytes: fromBytes$o,
        headerSize: headerSize$o,
        id: id$o,
        name: name$o,
        toBytes: toBytes$o
    });

    const INITIAL_YEAR_TIMESTAMP = 946684800000;
    const MILLISECONDS_IN_SECONDS = 1000;
    const getDateFromTime2000 = (time2000) => new Date(INITIAL_YEAR_TIMESTAMP + (time2000 * MILLISECONDS_IN_SECONDS));
    const getTime2000FromDate = (date) => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;

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
    const getEventStatusSize = (hardwareType) => (TWO_BYTES_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ? 2 : 1);
    function CommandBinaryBuffer(dataOrLength, isLittleEndian = true) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
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

    const id$n = 0x1b;
    const name$n = 'getArchiveDaysMc';
    const headerSize$n = 2;
    const COMMAND_BODY_SIZE$c = 4;
    const examples$n = {
        '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
            parameters: { startTime2000: 731721600, days: 1, channelList: [1] },
            bytes: [
                0x1b, 0x04,
                0x2e, 0x6a, 0x01, 0x01
            ]
        }
    };
    const fromBytes$n = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$c) {
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
    const toBytes$n = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$c);
        const { startTime2000, days, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        buffer.setDate(date);
        buffer.setChannels(channelList.map(index => ({ index })));
        buffer.setUint8(days);
        return toBytes$p(id$n, buffer.data);
    };

    var getArchiveDaysMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        name: name$n,
        toBytes: toBytes$n
    });

    const id$m = 0x0b;
    const name$m = 'getArchiveEvents';
    const headerSize$m = 2;
    const COMMAND_BODY_SIZE$b = 5;
    const examples$m = {
        'request 4 events from 2023.04.03 14:01:17 GMT': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            parameters: { startTime2000: 733845677, events: 4 },
            bytes: [
                0x0b, 0x05,
                0x2b, 0xbd, 0x98, 0xad, 0x04
            ]
        }
    };
    const fromBytes$m = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$b) {
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
    const toBytes$m = (parameters) => {
        const { startTime2000, events } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$b);
        buffer.setTime(startTime2000);
        buffer.setUint8(events);
        return toBytes$p(id$m, buffer.data);
    };

    var getArchiveEvents$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        name: name$m,
        toBytes: toBytes$m
    });

    const id$l = 0x1a;
    const name$l = 'getArchiveHoursMc';
    const headerSize$l = 2;
    const COMMAND_BODY_SIZE$a = 4;
    const examples$l = {
        'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            parameters: { startTime2000: 756648000, hours: 2, channelList: [1] },
            bytes: [
                0x1a, 0x04,
                0x2f, 0x97, 0x2c, 0x01
            ]
        }
    };
    const fromBytes$l = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$a) {
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
    const toBytes$l = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$a);
        const { hours, startTime2000, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({ index })));
        return toBytes$p(id$l, buffer.data);
    };

    var getArchiveHoursMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        name: name$l,
        toBytes: toBytes$l
    });

    const id$k = 0x07;
    const name$k = 'getCurrent';
    const headerSize$k = 2;
    const COMMAND_BODY_SIZE$9 = 0;
    const examples$k = {
        'simple request': {
            id: id$k,
            headerSize: headerSize$k,
            name: name$k,
            parameters: {},
            bytes: [
                0x07, 0x00
            ]
        }
    };
    const fromBytes$k = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$9) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$k = () => toBytes$p(id$k);

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        name: name$k,
        toBytes: toBytes$k
    });

    const id$j = 0x18;
    const name$j = 'getCurrentMc';
    const headerSize$j = 2;
    const COMMAND_BODY_SIZE$8 = 0;
    const examples$j = {
        'simple request': {
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$j = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$8) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$j = () => toBytes$p(id$j);

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        name: name$j,
        toBytes: toBytes$j
    });

    const id$i = 0x021f;
    const name$i = 'getLmicInfo';
    const headerSize$i = 3;
    const COMMAND_BODY_SIZE$7 = 0;
    const examples$i = {
        'simple request': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
            parameters: {},
            bytes: [
                0x1f, 0x02, 0x00
            ]
        }
    };
    const fromBytes$i = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$7) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$i = () => toBytes$p(id$i);

    var getLmicInfo$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$i,
        fromBytes: fromBytes$i,
        headerSize: headerSize$i,
        id: id$i,
        name: name$i,
        toBytes: toBytes$i
    });

    const id$h = 0x14;
    const name$h = 'getStatus';
    const headerSize$h = 2;
    const COMMAND_BODY_SIZE$6 = 0;
    const examples$h = {
        'simple request': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
            parameters: {},
            bytes: [
                0x14, 0x00
            ]
        }
    };
    const fromBytes$h = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$6) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$h = () => toBytes$p(id$h);

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        name: name$h,
        toBytes: toBytes$h
    });

    const id$g = 0x09;
    const name$g = 'getTime2000';
    const headerSize$g = 2;
    const COMMAND_BODY_SIZE$5 = 0;
    const examples$g = {
        'simple request': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            parameters: {},
            bytes: [
                0x09, 0x00
            ]
        }
    };
    const fromBytes$g = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$5) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$g = () => toBytes$p(id$g, []);

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$g,
        fromBytes: fromBytes$g,
        headerSize: headerSize$g,
        id: id$g,
        name: name$g,
        toBytes: toBytes$g
    });

    const id$f = 0x02;
    const name$f = 'setTime2000';
    const headerSize$f = 2;
    const COMMAND_BODY_SIZE$4 = 5;
    const examples$f = {
        'set time to 2023.04.03 14:01:17 GMT': {
            id: id$f,
            headerSize: headerSize$f,
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
    const fromBytes$f = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$4) {
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
    const toBytes$f = (parameters) => {
        const { sequenceNumber, seconds } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$4, false);
        buffer.setUint8(sequenceNumber);
        buffer.setInt32(seconds);
        return toBytes$p(id$f, buffer.data);
    };

    var setTime2000$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$f,
        fromBytes: fromBytes$f,
        headerSize: headerSize$f,
        id: id$f,
        name: name$f,
        toBytes: toBytes$f
    });

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        correctTime2000: correctTime2000$1,
        getArchiveDaysMc: getArchiveDaysMc$1,
        getArchiveEvents: getArchiveEvents$1,
        getArchiveHoursMc: getArchiveHoursMc$1,
        getCurrent: getCurrent,
        getCurrentMc: getCurrentMc,
        getLmicInfo: getLmicInfo$1,
        getStatus: getStatus,
        getTime2000: getTime2000,
        setTime2000: setTime2000$1
    });

    const id$e = 0x0c;
    const name$e = 'correctTime2000';
    const headerSize$e = 2;
    const COMMAND_BODY_SIZE$3 = 1;
    const examples$e = {
        'time correction failure': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            parameters: { status: 0 },
            bytes: [
                0x0c, 0x01,
                0x00
            ]
        },
        'time correction success': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            parameters: { status: 1 },
            bytes: [
                0x0c, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$e = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$3) {
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
    const toBytes$e = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$3, false);
        buffer.setUint8(status);
        return toBytes$p(id$e, buffer.data);
    };

    var correctTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$e,
        fromBytes: fromBytes$e,
        headerSize: headerSize$e,
        id: id$e,
        name: name$e,
        toBytes: toBytes$e
    });

    const id$d = 0x18;
    const name$d = 'currentMc';
    const headerSize$d = 2;
    const COMMAND_BODY_MAX_SIZE$8 = 37;
    const examples$d = {
        '4 first channels': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
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
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
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
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
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
    const fromBytes$d = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$8) {
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
    const toBytes$d = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$8);
        const { channelList } = parameters;
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$p(id$d, buffer.getBytesToOffset());
    };

    var currentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$d,
        fromBytes: fromBytes$d,
        headerSize: headerSize$d,
        id: id$d,
        name: name$d,
        toBytes: toBytes$d
    });

    const id$c = 0x16;
    const name$c = 'dayMc';
    const headerSize$c = 2;
    const COMMAND_BODY_MAX_SIZE$7 = 32;
    const examples$c = {
        '4 channels at 2023.12.23 00:00:00 GMT': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
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
    const fromBytes$c = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$7) {
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
    const toBytes$c = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
        const { channelList, startTime2000 } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        channelList.forEach(({ value }) => {
            buffer.setExtendedValue(value);
        });
        return toBytes$p(id$c, buffer.getBytesToOffset());
    };

    var dayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$c,
        fromBytes: fromBytes$c,
        headerSize: headerSize$c,
        id: id$c,
        name: name$c,
        toBytes: toBytes$c
    });

    const id$b = 0x0b1f;
    const name$b = 'exAbsDayMc';
    const headerSize$b = 3;
    const COMMAND_BODY_MAX_SIZE$6 = 89;
    const examples$b = {
        'absolute day value for 2023.03.10 00:00:00 GMT': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
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
    const fromBytes$b = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$6) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannelsWithAbsoluteValues();
        return { startTime2000: getTime2000FromDate(date), channelList };
    };
    const toBytes$b = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
        const { startTime2000, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannelsWithAbsoluteValues(channelList);
        return toBytes$p(id$b, buffer.getBytesToOffset());
    };

    var exAbsDayMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$b,
        fromBytes: fromBytes$b,
        headerSize: headerSize$b,
        id: id$b,
        name: name$b,
        toBytes: toBytes$b
    });

    const id$a = 0x0a1f;
    const name$a = 'exAbsHourMc';
    const headerSize$a = 3;
    const COMMAND_BODY_MAX_SIZE$5 = 168;
    const examples$a = {
        '1 channel at 2023.03.10 12:00:00 GMT': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
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
    const fromBytes$a = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$5) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const { hour, hours } = buffer.getHours();
        const channelList = buffer.getChannelsAbsoluteValuesWithHourDiff(hours);
        date.setUTCHours(hour);
        return { startTime2000: getTime2000FromDate(date), hours, channelList };
    };
    const toBytes$a = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$5);
        const { startTime2000, hours, channelList } = parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();
        buffer.setDate(startTime2000);
        buffer.setHours(hour, hours);
        buffer.setChannelsAbsoluteValuesWithHourDiff(channelList);
        return toBytes$p(id$a, buffer.getBytesToOffset());
    };

    var exAbsHourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$a,
        fromBytes: fromBytes$a,
        headerSize: headerSize$a,
        id: id$a,
        name: name$a,
        toBytes: toBytes$a
    });

    const id$9 = 0x1b;
    const name$9 = 'getArchiveDaysMc';
    const headerSize$9 = 2;
    const COMMAND_BODY_MAX_SIZE$4 = 5104;
    const examples$9 = {
        'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
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
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
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
    const fromBytes$9 = (data) => {
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
    const toBytes$9 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
        const { startTime2000, days, channelList } = parameters;
        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);
        channelList.forEach(({ dayList }) => {
            dayList.forEach(value => {
                buffer.setExtendedValue(value);
            });
        });
        return toBytes$p(id$9, buffer.getBytesToOffset());
    };

    var getArchiveDaysMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$9,
        fromBytes: fromBytes$9,
        headerSize: headerSize$9,
        id: id$9,
        name: name$9,
        toBytes: toBytes$9
    });

    const id$8 = 0x0b;
    const name$8 = 'getArchiveEvents';
    const headerSize$8 = 2;
    const COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    const examples$8 = {
        '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
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
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
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
    const fromBytes$8 = (data) => {
        const buffer = new CommandBinaryBuffer(data, false);
        const eventList = [];
        while (buffer.bytesLeft > 0) {
            eventList.push(getEvent(buffer));
        }
        return { eventList };
    };
    function toBytes$8(parameters) {
        const { eventList } = parameters;
        const buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE, false);
        eventList.forEach(event => setEvent(buffer, event));
        return toBytes$p(id$8, buffer.data);
    }

    var getArchiveEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$8,
        fromBytes: fromBytes$8,
        headerSize: headerSize$8,
        id: id$8,
        name: name$8,
        toBytes: toBytes$8
    });

    const id$7 = 0x1a;
    const name$7 = 'getArchiveHoursMc';
    const headerSize$7 = 2;
    const COMMAND_BODY_MAX_SIZE$3 = 164;
    const examples$7 = {
        '4 channels at 2023.12.23 12:00:00 GMT': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
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
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
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
    const fromBytes$7 = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$3) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$7 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
        const { hours, startTime2000, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);
        return toBytes$p(id$7, buffer.getBytesToOffset());
    };

    var getArchiveHoursMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$7,
        fromBytes: fromBytes$7,
        headerSize: headerSize$7,
        id: id$7,
        name: name$7,
        toBytes: toBytes$7
    });

    const id$6 = 0x021f;
    const name$6 = 'getLmicInfo';
    const headerSize$6 = 3;
    const COMMAND_BODY_SIZE$2 = 2;
    const lmicCapabilitiesBitMask = {
        isMulticastSupported: 1 << 0,
        isFragmentedDataSupported: 1 << 1
    };
    const examples$6 = {
        'version: 5, support only multicast': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
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
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
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
    const fromBytes$6 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$2) {
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
    const toBytes$6 = (parameters) => {
        const { capabilities, version } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$2);
        buffer.setUint8(fromObject(lmicCapabilitiesBitMask, capabilities));
        buffer.setUint8(version);
        return toBytes$p(id$6, buffer.data);
    };

    var getLmicInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$6,
        fromBytes: fromBytes$6,
        headerSize: headerSize$6,
        id: id$6,
        name: name$6,
        toBytes: toBytes$6
    });

    const id$5 = 0x17;
    const name$5 = 'hourMc';
    const headerSize$5 = 2;
    const COMMAND_BODY_MAX_SIZE$2 = 164;
    const examples$5 = {
        '4 first channels at 2023.12.23 12:00:00 GMT': {
            id: id$5,
            name: name$5,
            headerSize: headerSize$5,
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
    const fromBytes$5 = (data) => {
        if (data.length > COMMAND_BODY_MAX_SIZE$2) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        const buffer = new CommandBinaryBuffer(data);
        return buffer.getChannelsValuesWithHourDiff();
    };
    const toBytes$5 = (parameters) => {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
        const { startTime2000, hours, channelList } = parameters;
        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);
        return toBytes$p(id$5, buffer.getBytesToOffset());
    };

    var hourMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$5,
        fromBytes: fromBytes$5,
        headerSize: headerSize$5,
        id: id$5,
        name: name$5,
        toBytes: toBytes$5
    });

    const id$4 = 0x60;
    const name$4 = 'lastEvent';
    const headerSize$4 = 1;
    const examples$4 = {
        'status for GASI3': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
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
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
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
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
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
    const fromBytes$4 = (data, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(data);
        const sequenceNumber = buffer.getUint8();
        const status = buffer.getEventStatus(config.hardwareType);
        return { sequenceNumber, status };
    };
    const toBytes$4 = (parameters, config) => {
        if (!config.hardwareType) {
            throw new Error('hardwareType in config is mandatory');
        }
        const buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
        const { sequenceNumber, status } = parameters;
        buffer.setUint8(sequenceNumber);
        buffer.setEventStatus(config.hardwareType, status);
        return toBytes$p(id$4, buffer.data);
    };

    var lastEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$4,
        fromBytes: fromBytes$4,
        headerSize: headerSize$4,
        id: id$4,
        name: name$4,
        toBytes: toBytes$4
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

    const id$3 = 0x15;
    const name$3 = 'newEvent';
    const headerSize$3 = 2;
    const COMMAND_BODY_MAX_SIZE$1 = 14;
    const MTX_ADDRESS_SIZE = 8;
    const examples$3 = {
        'event for MAGNET_ON': {
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
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
    const fromBytes$3 = (data) => {
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
                throw new Error(`Event ${id$3} is not supported`);
        }
        return { id: eventId, sequenceNumber, data: eventData };
    };
    const toBytes$3 = (parameters) => {
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
                throw new Error(`Event ${id$3} is not supported`);
        }
        return toBytes$p(id$3, buffer.getBytesToOffset());
    };

    var newEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$3,
        fromBytes: fromBytes$3,
        headerSize: headerSize$3,
        id: id$3,
        name: name$3,
        toBytes: toBytes$3
    });

    const id$2 = 0x02;
    const name$2 = 'setTime2000';
    const headerSize$2 = 2;
    const COMMAND_BODY_SIZE$1 = 1;
    const examples$2 = {
        success: {
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            parameters: { status: 1 },
            bytes: [
                0x02, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$2 = (data) => {
        if (data.length !== COMMAND_BODY_SIZE$1) {
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
    const toBytes$2 = (parameters) => {
        const { status } = parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE$1, false);
        buffer.setUint8(status);
        return toBytes$p(id$2, buffer.data);
    };

    var setTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$2,
        fromBytes: fromBytes$2,
        headerSize: headerSize$2,
        id: id$2,
        name: name$2,
        toBytes: toBytes$2
    });

    var roundNumber = (value, decimalPlaces = 4) => {
        const places = Math.pow(10, decimalPlaces);
        return Math.round((value * places) * (1 + Number.EPSILON)) / places;
    };

    const id$1 = 0x14;
    const name$1 = 'status';
    const headerSize$1 = 2;
    const COMMAND_BODY_MAX_SIZE = 20;
    const UNKNOWN_BATTERY_RESISTANCE = 65535;
    const UNKNOWN_BATTERY_CAPACITY = 255;
    const examples$1 = {
        'status for GASI3': {
            id: id$1,
            name: name$1,
            headerSize: headerSize$1,
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
            id: id$1,
            name: name$1,
            headerSize: headerSize$1,
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
    const fromBytes$1 = (bytes) => {
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
                throw new Error(`${id$1}: hardware type ${hardware.type} is not supported`);
        }
        return { software, hardware, data };
    };
    const toBytes$1 = (parameters) => {
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
                throw new Error(`${id$1}: hardware type ${hardware.type} is not supported`);
        }
        return toBytes$p(id$1, buffer.getBytesToOffset());
    };

    var status = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$1,
        fromBytes: fromBytes$1,
        headerSize: headerSize$1,
        id: id$1,
        name: name$1,
        toBytes: toBytes$1
    });

    const id = 0x09;
    const name = 'time2000';
    const headerSize = 2;
    const COMMAND_BODY_SIZE = 5;
    const examples = {
        'time is 2023.04.03 14:01:17 GMT': {
            id,
            name,
            headerSize,
            parameters: { sequenceNumber: 77, time2000: 733845677 },
            bytes: [
                0x09, 0x05,
                0x4d, 0x2b, 0xbd, 0x98, 0xad
            ]
        }
    };
    const fromBytes = (data) => {
        if (data.length !== COMMAND_BODY_SIZE) {
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
    function toBytes(parameters) {
        const { sequenceNumber, time2000 } = parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        buffer.setUint8(sequenceNumber);
        buffer.setTime(time2000);
        return toBytes$p(id, buffer.data);
    }

    var time2000 = /*#__PURE__*/Object.freeze({
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
        currentMc: currentMc,
        dayMc: dayMc,
        exAbsDayMc: exAbsDayMc,
        exAbsHourMc: exAbsHourMc,
        getArchiveDaysMc: getArchiveDaysMc,
        getArchiveEvents: getArchiveEvents,
        getArchiveHoursMc: getArchiveHoursMc,
        getLmicInfo: getLmicInfo,
        hourMc: hourMc,
        lastEvent: lastEvent,
        newEvent: newEvent,
        setTime2000: setTime2000,
        status: status,
        time2000: time2000
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
