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

    const DEVICE_TYPE_INVALID_CHAR = 'x';
    const nibbles1 = ['.', '1', '3', 'R', 'M'];
    const nibbles2 = ['.', 'A', 'G', 'R', 'T', 'D'];
    const nibbles3 = ['.', '0', '1', '2', '3', '4', '5'];
    const nibbles4 = ['.', 'A', 'B', 'C', 'D', 'E', 'F'];
    const nibbles5 = ['.', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'K', 'G'];
    const nibbles6 = ['.', '1', '2', '3', '4'];
    const nibbles7 = ['.', 'L', 'M', 'Z', 'K'];
    const nibbles8 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const nibbles9 = ['.', 'D', 'B', 'C', 'E', 'P', 'R', 'O', 'L', 'F', 'S', 'M', 'Y', 'G', 'N', 'U'];
    const nibbles10 = ['.', '0', '1', '2', '3', '4', '5', '6', 'P', 'R', 'L', 'E', 'G', '-', '/'];
    const nibbles11 = ['.', 'H', 'A', 'T', '0', '0', '0', '0', '0', '1', '2', '3', '4', '0', '0', '0'];
    const nibbles12 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', 'I', 'X', 'G', 'W', 'M', '-'];
    const splitByte = (byte) => [
        byte >> 4,
        byte & 0x0F
    ];
    const splitToNibbles = (data) => {
        const result = new Array(data.length * 2).fill(0);
        data.forEach((byte, index) => {
            const [high, low] = splitByte(byte);
            result[index * 2] = high;
            result[index * 2 + 1] = low;
        });
        return result;
    };
    const joinNibbles = (nibbles) => {
        const hex = [];
        nibbles.forEach(nibble => hex.push(nibble.toString(16)));
        if (nibbles.length & 1) {
            hex.push('0');
        }
        return getBytesFromHex(hex.join(''));
    };
    const fromBytesMtx = (nibbles) => {
        if (nibbles.length !== 14 && nibbles.length !== 16) {
            throw new Error('Device type bytes wrong size');
        }
        const type = ['MTX '];
        type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles2[nibbles[1]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles3[nibbles[2]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles3[nibbles[3]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push('.');
        type.push(nibbles4[nibbles[4]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles5[nibbles[5]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push('.');
        type.push(nibbles6[nibbles[6]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles7[nibbles[7]] ?? DEVICE_TYPE_INVALID_CHAR);
        const revision = nibbles[8];
        type.push(nibbles8[nibbles[9]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push('-');
        let deviceProtocolIndex;
        if (nibbles.length < 14 || (nibbles[12] === 0 && nibbles[13] === 0)) {
            type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
            deviceProtocolIndex = 11;
        }
        else if (nibbles[13] === 0) {
            type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
            type.push(nibbles9[nibbles[11]] ?? DEVICE_TYPE_INVALID_CHAR);
            deviceProtocolIndex = 12;
        }
        else {
            type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
            type.push(nibbles9[nibbles[11]] ?? DEVICE_TYPE_INVALID_CHAR);
            type.push(nibbles9[nibbles[12]] ?? DEVICE_TYPE_INVALID_CHAR);
            deviceProtocolIndex = 13;
        }
        const deviceProtocolNibble = nibbles[deviceProtocolIndex];
        if (deviceProtocolNibble && deviceProtocolNibble !== 0) {
            type.push(nibbles11[deviceProtocolNibble] ?? DEVICE_TYPE_INVALID_CHAR);
        }
        return {
            type: type.join(''),
            revision,
            meterType: 0
        };
    };
    const toBytesMtx = (type, prefix, revision) => {
        const nibbles = [];
        if (type.length < 11) {
            throw new Error('Wrong format');
        }
        nibbles.push(nibbles1.indexOf(type[0]));
        nibbles.push(nibbles2.indexOf(type[1]));
        nibbles.push(nibbles3.indexOf(type[2]));
        nibbles.push(nibbles3.indexOf(type[3]));
        if (type[4] !== '.') {
            throw new Error('Wrong format');
        }
        nibbles.push(nibbles4.indexOf(type[5]));
        nibbles.push(nibbles5.indexOf(type[6]));
        if (type[7] !== '.') {
            throw new Error('Wrong format');
        }
        nibbles.push(nibbles6.indexOf(type[8]));
        nibbles.push(nibbles7.indexOf(type[9]));
        nibbles.push(revision ?? 0);
        nibbles.push(nibbles8.indexOf(type[10]));
        if (type[11] !== '-') {
            throw new Error('Wrong format');
        }
        const deviceProtocolIndex = type.length > 13 ? type.length - 1 : type.length;
        for (let index = 12; index < deviceProtocolIndex; index++) {
            nibbles.push(nibbles9.indexOf(type[index]));
        }
        if (deviceProtocolIndex < type.length) {
            nibbles.push(nibbles11.indexOf(type[deviceProtocolIndex]));
        }
        const bytes = joinNibbles(nibbles);
        const result = new Array(9).fill(0);
        result[0] = 0;
        for (let index = 0; index < bytes.length; index++) {
            result[index + (bytes.length < 8 ? 1 : 0)] = bytes[index];
        }
        return result;
    };
    const fromBytesMtx2 = (nibbles) => {
        if (nibbles.length < 14) {
            throw new Error('The buffer is too small');
        }
        const type = ['MTX '];
        const separator = nibbles[1] === 5 ? '-' : ' ';
        type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles2[nibbles[1]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(separator);
        for (let index = 2; index < nibbles.length; index++) {
            if (nibbles[index] !== 0) {
                type.push(nibbles10[nibbles[index]] ?? DEVICE_TYPE_INVALID_CHAR);
            }
        }
        return {
            type: type.join(''),
            meterType: 0
        };
    };
    const toBytesMtx2 = (type) => {
        if (type.length < 3) {
            throw new Error('Wrong format');
        }
        const nibbles = [];
        nibbles.push(nibbles1.indexOf(type[0]));
        nibbles.push(nibbles2.indexOf(type[1]));
        for (let index = 3; index < type.length; index++) {
            nibbles.push(nibbles10.indexOf(type[index]));
        }
        const bytes = joinNibbles(nibbles);
        if (bytes.length === 8) {
            return bytes;
        }
        if (bytes.length > 8) {
            throw new Error('Wrong format');
        }
        const result = new Array(8).fill(0);
        for (let index = 0; index < bytes.length; index++) {
            result[index] = bytes[index];
        }
        return result;
    };
    const fromBytesM = (nibbles) => {
        if (nibbles.length < 14) {
            throw new Error('The buffer is too small');
        }
        const type = [];
        type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);
        for (let index = 1; index < nibbles.length; index++) {
            if (nibbles[index] !== 0) {
                type.push(nibbles12[nibbles[index]] ?? DEVICE_TYPE_INVALID_CHAR);
            }
        }
        return {
            type: type.join(''),
            meterType: 0
        };
    };
    const toBytesM = (type) => {
        if (type.length < 1) {
            throw new Error('Wrong format');
        }
        const nibbles = [];
        nibbles.push(nibbles1.indexOf(type[0]));
        for (let index = 1; index < type.length; index++) {
            nibbles.push(nibbles12.indexOf(type[index]));
        }
        const bytes = joinNibbles(nibbles);
        const result = new Array(8).fill(0);
        for (let index = 0; index < bytes.length && index < 8; index++) {
            result[index] = bytes[index];
        }
        return result;
    };
    const fromBytes$2f = (bytes) => {
        if (bytes.length !== 9) {
            throw new Error('The buffer is too small');
        }
        let result;
        const reserve = [0x00, 0x05, 0x06, 0x07, 0x09, 0x7f, 0xef];
        const position = reserve.indexOf(bytes[0]) !== -1 ? 2 : 0;
        const nibbles = splitToNibbles(bytes.slice(0, 8));
        const deviceTypeNibble = nibbles[position];
        const deviceType = nibbles1[deviceTypeNibble];
        if (deviceType === '1' || deviceType === '3') {
            result = fromBytesMtx(nibbles.slice(position));
        }
        else {
            result = deviceType === 'M'
                ? fromBytesM(nibbles)
                : fromBytesMtx2(nibbles);
        }
        result.meterType = bytes[8];
        return result;
    };
    const toBytes$2g = ({ type, revision, meterType }, prefix) => {
        if (!type.startsWith('MTX ')) {
            throw new Error('Wrong format');
        }
        let result;
        const content = type.substring(4);
        const deviceTypeSymbol = type[4];
        if (deviceTypeSymbol === '1' || deviceTypeSymbol === '3') {
            result = toBytesMtx(content, prefix, revision);
        }
        else {
            result = deviceTypeSymbol === 'M'
                ? toBytesM(content)
                : toBytesMtx2(content);
        }
        result[8] = meterType;
        return result;
    };

    var getHexFromBytes = (bytes, options = {}) => {
        const { separator, prefix } = Object.assign({}, hexFormatOptions, options);
        return bytes
            .map((byte) => `${prefix}${byte.toString(16).padStart(2, '0')}`)
            .join(separator);
    };

    const DATA_REQUEST = 0x50;
    const DATA_RESPONSE = 0x51;
    const IDENT_REQUEST = 0x52;
    const IDENT_RESPONSE = 0x53;
    const L2_SET_ADDRESS_REQUEST = 0x54;
    const L2_SET_ADDRESS_RESPONSE = 0x55;
    const L2_CHECK_ADDRESS_REQUEST = 0x56;
    const L2_CHECK_ADDRESS_RESPONSE = 0x57;
    const L2_RM_ADDRESS_REQUEST = 0x58;
    const L2_RM_ADDRESS_RESPONSE = 0x59;
    const FRAGMENT_REQUEST = 0x5A;
    const FRAGMENT_RESPONSE = 0x5B;
    const INVALID = 0xFF;

    var frameTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        DATA_REQUEST: DATA_REQUEST,
        DATA_RESPONSE: DATA_RESPONSE,
        FRAGMENT_REQUEST: FRAGMENT_REQUEST,
        FRAGMENT_RESPONSE: FRAGMENT_RESPONSE,
        IDENT_REQUEST: IDENT_REQUEST,
        IDENT_RESPONSE: IDENT_RESPONSE,
        INVALID: INVALID,
        L2_CHECK_ADDRESS_REQUEST: L2_CHECK_ADDRESS_REQUEST,
        L2_CHECK_ADDRESS_RESPONSE: L2_CHECK_ADDRESS_RESPONSE,
        L2_RM_ADDRESS_REQUEST: L2_RM_ADDRESS_REQUEST,
        L2_RM_ADDRESS_RESPONSE: L2_RM_ADDRESS_RESPONSE,
        L2_SET_ADDRESS_REQUEST: L2_SET_ADDRESS_REQUEST,
        L2_SET_ADDRESS_RESPONSE: L2_SET_ADDRESS_RESPONSE
    });

    var invertObject = (source) => {
        const target = {};
        for (const property in source) {
            const value = source[property];
            target[value] = property;
        }
        return target;
    };

    var frameNames = invertObject(frameTypes);

    const ENERGY_REG_FAULT = 0x01;
    const VENDOR_PAR_FAULT = 0x02;
    const OP_PAR_FAULT = 0x03;
    const ACCESS_CLOSED = 0x10;
    const ERR_ACCESS$1 = 0x11;
    const CASE_OPEN$2 = 0x12;
    const CASE_CLOSE$1 = 0x13;
    const MAGNETIC_ON$2 = 0x14;
    const MAGNETIC_OFF$1 = 0x15;
    const CHANGE_ACCESS_KEY0$1 = 0x20;
    const CHANGE_ACCESS_KEY1$1 = 0x21;
    const CHANGE_ACCESS_KEY2$1 = 0x22;
    const CHANGE_ACCESS_KEY3$1 = 0x23;
    const CHANGE_PAR_LOCAL = 0x24;
    const CHANGE_PAR_REMOTE = 0x25;
    const CMD_CHANGE_TIME$1 = 0x26;
    const CMD_RELAY_ON$1 = 0x27;
    const CMD_RELAY_OFF$1 = 0x28;
    const CHANGE_COR_TIME$1 = 0x29;
    const ENERGY_REG_OVERFLOW = 0x31;
    const CHANGE_TARIFF_TBL = 0x32;
    const SET_TARIFF_TBL = 0x33;
    const SUMMER_TIME$1 = 0x34;
    const WINTER_TIME$1 = 0x35;
    const RELAY_ON$1 = 0x36;
    const RELAY_OFF$1 = 0x37;
    const RESTART$2 = 0x38;
    const WD_RESTART$1 = 0x39;
    const V_MAX_OK = 0x40;
    const V_MAX_OVER = 0x41;
    const V_MIN_OK = 0x42;
    const V_MIN_OVER = 0x43;
    const T_MAX_OK$1 = 0x44;
    const T_MAX_OVER$1 = 0x45;
    const T_MIN_OK$1 = 0x46;
    const T_MIN_OVER = 0x47;
    const F_MAX_OK$1 = 0x48;
    const F_MAX_OVER$1 = 0x49;
    const F_MIN_OK$1 = 0x4A;
    const F_MIN_OVER = 0x4B;
    const I_MAX_OK = 0x4C;
    const I_MAX_OVER = 0x4D;
    const P_MAX_OK = 0x4E;
    const P_MAX_OVER = 0x4F;
    const POWERSALDO_OK = 0x50;
    const POWERSALDO_OVER = 0x51;
    const BAT_OK = 0x52;
    const BAT_FAULT = 0x53;
    const CAL_OK = 0x54;
    const CAL_FAULT = 0x55;
    const CLOCK_OK$1 = 0x56;
    const CLOCK_FAULT$1 = 0x57;
    const POWER_A_OFF$1 = 0x58;
    const POWER_A_ON$1 = 0x59;
    const CMD_RELAY_2_ON$1 = 0x60;
    const CMD_RELAY_2_OFF$1 = 0x61;
    const CROSSZERO_ENT0 = 0x62;
    const CROSSZERO_ENT1 = 0x63;
    const CROSSZERO_ENT2 = 0x64;
    const CROSSZERO_ENT3 = 0x65;
    const CALFLAG_SET = 0x66;
    const CALFLAG_RESET = 0x67;
    const BAD_TEST_EEPROM$1 = 0x68;
    const BAD_TEST_FRAM$1 = 0x69;
    const SET_NEW_SALDO$1 = 0x70;
    const SALDO_PARAM_BAD$1 = 0x71;
    const ACCPARAM_BAD = 0x72;
    const ACCPARAM_EXT_BAD = 0x73;
    const CALC_PERIOD_BAD = 0x74;
    const BLOCK_TARIFF_BAD$1 = 0x75;
    const CALIBR_PARAM_BAD = 0x76;
    const WINTER_SUMMER_BAD$1 = 0x77;
    const SALDO_EN_BAD = 0x78;
    const TIME_CORRECT$2 = 0x79;
    const CASE_TERMINAL_OPEN$1 = 0x7A;
    const CASE_TERMINAL_CLOSE = 0x7B;
    const CASE_MODULE_OPEN$2 = 0x7C;
    const CASE_MODULE_CLOSE$1 = 0x7D;
    const RELAY_HARD_BAD_OFF$1 = 0x90;
    const RELAY_HARD_ON$1 = 0x91;
    const RELAY_HARD_BAD_ON$1 = 0x93;
    const RELAY_HARD_OFF$1 = 0x94;
    const SET_SALDO_PARAM$1 = 0x9C;
    const POWER_OVER_RELAY_OFF$1 = 0x9D;
    const CROSSZERO_EXP_ENT0 = 0x9E;
    const CROSSZERO_EXP_ENT1 = 0x9F;
    const CROSSZERO_EXP_ENT2 = 0xA0;
    const CROSSZERO_EXP_ENT3 = 0xA1;
    const TIME_CORRECT_NEW = 0xA2;
    const EM_MAGNETIC_ON$1 = 0xB0;
    const EM_MAGNETIC_OFF$1 = 0xB1;
    const CURRENT_UNEQUIL_FAULT = 0xB2;
    const CURRENT_UNEQUIL_OK = 0xB3;
    const BIPOLAR_POWER_FAULT = 0xB4;
    const BIPOLAR_POWER_OK = 0xB5;
    const RESET_EM_FLAG$1 = 0xB6;
    const RESET_MAGN_FLAG = 0xB7;
    const NVRAM_FAULT = 0xD0;
    const SET_DEMAND_EN_1MIN = 0xE0;
    const SET_DEMAND_EN_3MIN = 0xE1;
    const SET_DEMAND_EN_5MIN = 0xE2;
    const SET_DEMAND_EN_10MIN = 0xE3;
    const SET_DEMAND_EN_15MIN = 0xE4;
    const SET_DEMAND_EN_30MIN = 0xE5;
    const SET_DEMAND_EN_60MIN = 0xE6;

    var events$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_CLOSED: ACCESS_CLOSED,
        ACCPARAM_BAD: ACCPARAM_BAD,
        ACCPARAM_EXT_BAD: ACCPARAM_EXT_BAD,
        BAD_TEST_EEPROM: BAD_TEST_EEPROM$1,
        BAD_TEST_FRAM: BAD_TEST_FRAM$1,
        BAT_FAULT: BAT_FAULT,
        BAT_OK: BAT_OK,
        BIPOLAR_POWER_FAULT: BIPOLAR_POWER_FAULT,
        BIPOLAR_POWER_OK: BIPOLAR_POWER_OK,
        BLOCK_TARIFF_BAD: BLOCK_TARIFF_BAD$1,
        CALC_PERIOD_BAD: CALC_PERIOD_BAD,
        CALFLAG_RESET: CALFLAG_RESET,
        CALFLAG_SET: CALFLAG_SET,
        CALIBR_PARAM_BAD: CALIBR_PARAM_BAD,
        CAL_FAULT: CAL_FAULT,
        CAL_OK: CAL_OK,
        CASE_CLOSE: CASE_CLOSE$1,
        CASE_MODULE_CLOSE: CASE_MODULE_CLOSE$1,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN$2,
        CASE_OPEN: CASE_OPEN$2,
        CASE_TERMINAL_CLOSE: CASE_TERMINAL_CLOSE,
        CASE_TERMINAL_OPEN: CASE_TERMINAL_OPEN$1,
        CHANGE_ACCESS_KEY0: CHANGE_ACCESS_KEY0$1,
        CHANGE_ACCESS_KEY1: CHANGE_ACCESS_KEY1$1,
        CHANGE_ACCESS_KEY2: CHANGE_ACCESS_KEY2$1,
        CHANGE_ACCESS_KEY3: CHANGE_ACCESS_KEY3$1,
        CHANGE_COR_TIME: CHANGE_COR_TIME$1,
        CHANGE_PAR_LOCAL: CHANGE_PAR_LOCAL,
        CHANGE_PAR_REMOTE: CHANGE_PAR_REMOTE,
        CHANGE_TARIFF_TBL: CHANGE_TARIFF_TBL,
        CLOCK_FAULT: CLOCK_FAULT$1,
        CLOCK_OK: CLOCK_OK$1,
        CMD_CHANGE_TIME: CMD_CHANGE_TIME$1,
        CMD_RELAY_2_OFF: CMD_RELAY_2_OFF$1,
        CMD_RELAY_2_ON: CMD_RELAY_2_ON$1,
        CMD_RELAY_OFF: CMD_RELAY_OFF$1,
        CMD_RELAY_ON: CMD_RELAY_ON$1,
        CROSSZERO_ENT0: CROSSZERO_ENT0,
        CROSSZERO_ENT1: CROSSZERO_ENT1,
        CROSSZERO_ENT2: CROSSZERO_ENT2,
        CROSSZERO_ENT3: CROSSZERO_ENT3,
        CROSSZERO_EXP_ENT0: CROSSZERO_EXP_ENT0,
        CROSSZERO_EXP_ENT1: CROSSZERO_EXP_ENT1,
        CROSSZERO_EXP_ENT2: CROSSZERO_EXP_ENT2,
        CROSSZERO_EXP_ENT3: CROSSZERO_EXP_ENT3,
        CURRENT_UNEQUIL_FAULT: CURRENT_UNEQUIL_FAULT,
        CURRENT_UNEQUIL_OK: CURRENT_UNEQUIL_OK,
        EM_MAGNETIC_OFF: EM_MAGNETIC_OFF$1,
        EM_MAGNETIC_ON: EM_MAGNETIC_ON$1,
        ENERGY_REG_FAULT: ENERGY_REG_FAULT,
        ENERGY_REG_OVERFLOW: ENERGY_REG_OVERFLOW,
        ERR_ACCESS: ERR_ACCESS$1,
        F_MAX_OK: F_MAX_OK$1,
        F_MAX_OVER: F_MAX_OVER$1,
        F_MIN_OK: F_MIN_OK$1,
        F_MIN_OVER: F_MIN_OVER,
        I_MAX_OK: I_MAX_OK,
        I_MAX_OVER: I_MAX_OVER,
        MAGNETIC_OFF: MAGNETIC_OFF$1,
        MAGNETIC_ON: MAGNETIC_ON$2,
        NVRAM_FAULT: NVRAM_FAULT,
        OP_PAR_FAULT: OP_PAR_FAULT,
        POWERSALDO_OK: POWERSALDO_OK,
        POWERSALDO_OVER: POWERSALDO_OVER,
        POWER_A_OFF: POWER_A_OFF$1,
        POWER_A_ON: POWER_A_ON$1,
        POWER_OVER_RELAY_OFF: POWER_OVER_RELAY_OFF$1,
        P_MAX_OK: P_MAX_OK,
        P_MAX_OVER: P_MAX_OVER,
        RELAY_HARD_BAD_OFF: RELAY_HARD_BAD_OFF$1,
        RELAY_HARD_BAD_ON: RELAY_HARD_BAD_ON$1,
        RELAY_HARD_OFF: RELAY_HARD_OFF$1,
        RELAY_HARD_ON: RELAY_HARD_ON$1,
        RELAY_OFF: RELAY_OFF$1,
        RELAY_ON: RELAY_ON$1,
        RESET_EM_FLAG: RESET_EM_FLAG$1,
        RESET_MAGN_FLAG: RESET_MAGN_FLAG,
        RESTART: RESTART$2,
        SALDO_EN_BAD: SALDO_EN_BAD,
        SALDO_PARAM_BAD: SALDO_PARAM_BAD$1,
        SET_DEMAND_EN_10MIN: SET_DEMAND_EN_10MIN,
        SET_DEMAND_EN_15MIN: SET_DEMAND_EN_15MIN,
        SET_DEMAND_EN_1MIN: SET_DEMAND_EN_1MIN,
        SET_DEMAND_EN_30MIN: SET_DEMAND_EN_30MIN,
        SET_DEMAND_EN_3MIN: SET_DEMAND_EN_3MIN,
        SET_DEMAND_EN_5MIN: SET_DEMAND_EN_5MIN,
        SET_DEMAND_EN_60MIN: SET_DEMAND_EN_60MIN,
        SET_NEW_SALDO: SET_NEW_SALDO$1,
        SET_SALDO_PARAM: SET_SALDO_PARAM$1,
        SET_TARIFF_TBL: SET_TARIFF_TBL,
        SUMMER_TIME: SUMMER_TIME$1,
        TIME_CORRECT: TIME_CORRECT$2,
        TIME_CORRECT_NEW: TIME_CORRECT_NEW,
        T_MAX_OK: T_MAX_OK$1,
        T_MAX_OVER: T_MAX_OVER$1,
        T_MIN_OK: T_MIN_OK$1,
        T_MIN_OVER: T_MIN_OVER,
        VENDOR_PAR_FAULT: VENDOR_PAR_FAULT,
        V_MAX_OK: V_MAX_OK,
        V_MAX_OVER: V_MAX_OVER,
        V_MIN_OK: V_MIN_OK,
        V_MIN_OVER: V_MIN_OVER,
        WD_RESTART: WD_RESTART$1,
        WINTER_SUMMER_BAD: WINTER_SUMMER_BAD$1,
        WINTER_TIME: WINTER_TIME$1
    });

    var eventNames$1 = invertObject(events$1);

    const defaultFrameHeader = {
        type: DATA_REQUEST,
        destination: 0xffff,
        source: 0xfffe
    };
    const TARIFF_PLAN_SIZE = 11;
    const SEASON_PROFILE_DAYS_NUMBER = 7;
    const SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;
    const TARIFF_NUMBER$1 = 4;
    const ENERGY_SIZE = 4;
    const DATE_SIZE$1 = 3;
    const MIN_HALF_HOUR_PERIODS = 48;
    const MAX_HALF_HOUR_PERIODS = 50;
    const MIN_HALF_HOUR_COMMAND_SIZE = 3 + (MIN_HALF_HOUR_PERIODS * 2);
    const MAX_HALF_HOUR_COMMAND_SIZE = 4 + (MAX_HALF_HOUR_PERIODS * 2);
    const baseDisplaySetMask = {
        SET_ALL_SEGMENT_DISPLAY: 0x0001,
        SOFTWARE_VERSION: 0x0002,
        TOTAL_ACTIVE_ENERGY: 0x0004,
        ACTIVE_ENERGY_T1: 0x0008,
        ACTIVE_ENERGY_T2: 0x0010,
        ACTIVE_ENERGY_T3: 0x0020,
        ACTIVE_ENERGY_T4: 0x0040,
        ACTIVE_POWER_PER_PHASE: 0x0080,
        ACTIVE_POWER_IN_NEUTRAL: 0x0100,
        CURRENT_IN_PHASE: 0x0200,
        CURRENT_IN_NEUTRAL: 0x0400,
        VOLTAGE: 0x0800,
        HOUR_MINUTE_SECOND: 0x1000,
        DATE_MONTH_YEAR: 0x2000,
        TOTAL_EXPORTED_ACTIVE_ENERGY: 0x4000,
        EXPORTED_ACTIVE_ENERGY_T1: 0x8000,
        EXPORTED_ACTIVE_ENERGY_T2: 0x00010000,
        EXPORTED_ACTIVE_ENERGY_T3: 0x00020000,
        EXPORTED_ACTIVE_ENERGY_T4: 0x00040000,
        POWER_COEFFICIENT_PHASE_A: 0x00080000,
        POWER_COEFFICIENT_PHASE_B: 0x00100000,
        BATTERY_VOLTAGE: 0x00200000,
        POWER_THRESHOLD_T1: 0x00400000,
        POWER_THRESHOLD_T2: 0x00800000,
        POWER_THRESHOLD_T3: 0x01000000,
        POWER_THRESHOLD_T4: 0x02000000,
        CURRENT_BALANCE: 0x20000000
    };
    const displaySetMask = {
        ...baseDisplaySetMask,
        AUTO_SCREEN_SCROLLING: 0x80000000
    };
    const displaySetExtMask = {
        ...baseDisplaySetMask,
        MAGNET_INDUCTION: 0x08000000,
        OPTOPORT_SPEED: 0x40000000,
        SORT_DISPLAY_SCREENS: 0x80000000
    };
    const relaySet1Mask = {
        RELAY_ON_Y: 0x01,
        RELAY_ON_CENTER: 0x02,
        RELAY_ON_PB: 0x04,
        RELAY_ON_TARIFF_0: 0x08,
        RELAY_ON_TARIFF_1: 0x10,
        RELAY_ON_TARIFF_2: 0x20,
        RELAY_ON_TARIFF_3: 0x40,
        RELAY_ON_V_GOOD: 0x80
    };
    const relaySet2Mask = {
        RELAY_OFF_Y: 0x01,
        RELAY_OFF_CENTER: 0x02,
        RELAY_OFF_TARIFF_0: 0x04,
        RELAY_OFF_TARIFF_1: 0x08,
        RELAY_OFF_TARIFF_2: 0x10,
        RELAY_OFF_TARIFF_3: 0x20,
        RELAY_OFF_I_LIMIT: 0x40,
        RELAY_OFF_V_BAD: 0x80
    };
    const relaySet3Mask = {
        RELAY_OFF_LIM_TARIFF_0: 0x02,
        RELAY_OFF_LIM_TARIFF_1: 0x04,
        RELAY_OFF_LIM_TARIFF_2: 0x08,
        RELAY_OFF_LIM_TARIFF_3: 0x10,
        RELAY_OFF_PF_MIN: 0x20
    };
    const relaySet4Mask = {
        RELAY_ON_TIMEOUT: 0x01,
        RELAY_ON_SALDO: 0x02,
        RELAY_OFF_SALDO: 0x04,
        RELAY_OFF_SALDO_SOFT: 0x08,
        RELAY_OFF_MAGNET: 0x10,
        RELAY_ON_MAGNET_TIMEOUT: 0x20,
        RELAY_ON_MAGNET_AUTO: 0x40
    };
    const relaySet5Mask = {
        RELAY_OFF_UNEQUAL_CURRENT: 0x01,
        RELAY_ON_UNEQUAL_CURRENT: 0x02,
        RELAY_OFF_BIPOLAR_POWER: 0x04,
        RELAY_ON_BIPOLAR_POWER: 0x08
    };
    const define1Mask$1 = {
        BLOCK_KEY_OPTOPORT: 0x02,
        MAGNET_SCREEN_CONST: 0x20
    };
    const eventStatusMask = {
        CASE_OPEN: 2 ** 0,
        MAGNETIC_ON: 2 ** 1,
        PARAMETERS_UPDATE_REMOTE: 2 ** 2,
        PARAMETERS_UPDATE_LOCAL: 2 ** 3,
        RESTART: 2 ** 4,
        ERROR_ACCESS: 2 ** 5,
        TIME_SET: 2 ** 6,
        TIME_CORRECT: 2 ** 7,
        DEVICE_FAILURE: 2 ** 8,
        CASE_TERMINAL_OPEN: 2 ** 9,
        CASE_MODULE_OPEN: 2 ** 10,
        TARIFF_TABLE_SET: 2 ** 11,
        TARIFF_TABLE_GET: 2 ** 12,
        PROTECTION_RESET_EM: 2 ** 13,
        PROTECTION_RESET_MAGNETIC: 2 ** 14
    };
    const extendedCurrentValues2RelayStatusMask = {
        RELAY_STATE: 2 ** 0,
        RELAY_UBAD: 2 ** 1,
        RELAY_UNEQ_CURRENT: 2 ** 4,
        RELAY_OFF_CENTER: 2 ** 5,
        RELAY_IMAX: 2 ** 6,
        RELAY_PMAX: 2 ** 7
    };
    const extendedCurrentValues2RelayStatus2Mask = {
        RELAY_COSFI: 2 ** 0,
        RELAY_SALDO_OFF_FLAG: 2 ** 1,
        RELAY_UNEQUIL_CURRENT_OFF: 2 ** 2,
        RELAY_BIPOLAR_POWER_OFF: 2 ** 3,
        RELAY_SALDO_OFF_ON_MAX_POWER: 2 ** 4,
        RELAY_HARD_ST1: 2 ** 5
    };
    const extendedCurrentValues2Status1Mask = {
        MAXVA: 2 ** 0,
        MINVA: 2 ** 1,
        MAXT: 2 ** 2,
        MINT: 2 ** 3,
        MAXF: 2 ** 4,
        MINF: 2 ** 5,
        MAXIA: 2 ** 6,
        MAXP: 2 ** 7
    };
    const extendedCurrentValues2Status2Mask = {
        MAX_POWER_SALDO: 2 ** 0,
        BATTERY_VBAT_BAD: 2 ** 1,
        CLOCK_UNSET: 2 ** 3,
        MIN_COS_FI: 2 ** 5
    };
    const extendedCurrentValues2Status3Mask = {
        UNEQUIL_CURRENT: 2 ** 0,
        BIPOLAR_POWER: 2 ** 1,
        POWER_A_NEGATIVE: 2 ** 6,
        POWER_B_NEGATIVE: 2 ** 7
    };
    const operatorParametersExtended3RelaySetMask = {
        RELAY_OFF_LIMIT_P_MINUS_T1: 0x04,
        RELAY_OFF_LIMIT_P_MINUS_T2: 0x08,
        RELAY_OFF_LIMIT_P_MINUS_T3: 0x10,
        RELAY_OFF_LIMIT_P_MINUS_T4: 0x20
    };
    function getPackedEnergies$1(buffer, energyType, tariffMapByte) {
        const byte = tariffMapByte >> TARIFF_NUMBER$1;
        const energies = new Array(TARIFF_NUMBER$1).fill(0);
        energies.forEach((energy, index) => {
            const isTariffExists = !!extractBits(byte, 1, index + 1);
            if (isTariffExists) {
                energies[index] = buffer.getUint32();
            }
            else {
                energies[index] = null;
            }
        });
        return energies;
    }
    function setPackedEnergyType(buffer, energyType, energies) {
        const indexShift = 1 + TARIFF_NUMBER$1;
        let tariffsByte = energyType;
        energies.forEach((energy, index) => {
            tariffsByte = fillBits(tariffsByte, 1, index + indexShift, Number(!!energy));
        });
        buffer.setUint8(tariffsByte);
    }
    function getEnergyPeriod(period) {
        if (period === 0xffff) {
            return {
                tariff: undefined,
                energy: undefined
            };
        }
        return {
            tariff: ((period >> 14) & 0x03),
            energy: (period & 0x3fff)
        };
    }
    function setEnergyPeriod(buffer, { tariff, energy }) {
        if (tariff !== undefined && energy !== undefined) {
            buffer.setUint16((tariff << 14) | (energy & 0x3fff));
        }
        else {
            buffer.setUint16(0xffff);
        }
    }
    function CommandBinaryBuffer$2(dataOrLength, isLittleEndian = false) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer$2.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer$2.prototype.constructor = CommandBinaryBuffer$2;
    CommandBinaryBuffer$2.getDayProfileFromByte = (value) => ({
        tariff: extractBits(value, 2, 1),
        isFirstHalfHour: !extractBits(value, 1, 3),
        hour: extractBits(value, 5, 4)
    });
    CommandBinaryBuffer$2.getByteFromDayProfile = (dayProfile) => {
        let value = 0;
        value = fillBits(value, 2, 1, dayProfile.tariff);
        value = fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
        value = fillBits(value, 5, 4, dayProfile.hour);
        return value;
    };
    CommandBinaryBuffer$2.getDefaultSeasonProfile = () => ({
        month: 1,
        date: 1,
        dayIndexes: [0, 0, 0, 0, 0, 0, 0]
    });
    CommandBinaryBuffer$2.getDefaultOperatorParameters = () => ({
        vpThreshold: 265000,
        vThreshold: 156000,
        ipThreshold: 120000,
        pmaxThreshold0: 31800,
        pmaxThreshold1: 31800,
        pmaxThreshold2: 31800,
        pmaxThreshold3: 31800,
        speedOptoPort: 0,
        tint: 30,
        calcPeriodDate: 1,
        timeoutDisplay: 127,
        timeoutScreen: 7,
        displaySet: toObject(displaySetMask, 0x80003184),
        relaySet4: toObject(relaySet4Mask, 0),
        relaySet3: toObject(relaySet3Mask, 0),
        relaySet2: toObject(relaySet2Mask, 3),
        relaySet1: toObject(relaySet1Mask, 3),
        displayType: 0,
        ten: 0,
        timeoutRefresh: 240,
        deltaCorMin: 15,
        timeoutMagnetOff: 5,
        timeoutMagnetOn: 5,
        define1: toObject(define1Mask$1, 0),
        timeoutRelayOn: 1,
        timeoutRelayKey: 0,
        timeoutRelayAuto: 5,
        timeoutBadVAVB: 5,
        freqMax: 55,
        freqMin: 45,
        phMin: 0,
        year: 0,
        month: 0,
        date: 0,
        energyDecimalPoint: 2,
        typeMeter: 0,
        timeoutIMax: 5,
        timeoutPMax: 5,
        timeoutCos: 5,
        pMaxDef: 1,
        displaySetExt: toObject(displaySetExtMask, 0x8383fff),
        timeoutUneqCurrent: 5,
        timeoutBipolarPower: 5,
        relaySet5: toObject(relaySet5Mask, 0),
        timeCorrectPeriod: 24,
        timeCorrectPassHalfhour: false
    });
    CommandBinaryBuffer$2.prototype.getFrameHeader = function () {
        const type = this.getUint8();
        const typeName = frameNames[type];
        const destination = this.getUint16();
        const source = this.getUint16();
        return {
            type,
            typeName,
            destination,
            source
        };
    };
    CommandBinaryBuffer$2.prototype.setFrameHeader = function ({ type = defaultFrameHeader.type, destination = defaultFrameHeader.destination, source = defaultFrameHeader.source }) {
        this.setUint8(type);
        this.setUint16(destination);
        this.setUint16(source);
    };
    CommandBinaryBuffer$2.prototype.getDeviceId = function () {
        const manufacturer = getHexFromBytes(this.getBytes(3), { separator: '' });
        const type = this.getUint8();
        const year = this.getUint8();
        const serial = getHexFromBytes(this.getBytes(3), { separator: '' });
        return { manufacturer, type, year, serial };
    };
    CommandBinaryBuffer$2.prototype.setDeviceId = function ({ manufacturer, type, year, serial }) {
        this.setBytes(getBytesFromHex(manufacturer));
        this.setUint8(type);
        this.setUint8(year);
        this.setBytes(getBytesFromHex(serial));
    };
    CommandBinaryBuffer$2.prototype.getDateTime = function () {
        return {
            isSummerTime: !!this.getUint8(),
            seconds: this.getUint8(),
            minutes: this.getUint8(),
            hours: this.getUint8(),
            day: this.getUint8(),
            date: this.getUint8(),
            month: this.getUint8(),
            year: this.getUint8()
        };
    };
    CommandBinaryBuffer$2.prototype.setDateTime = function (dateTime) {
        this.setUint8(dateTime.isSummerTime ? 1 : 0);
        this.setUint8(dateTime.seconds);
        this.setUint8(dateTime.minutes);
        this.setUint8(dateTime.hours);
        this.setUint8(dateTime.day || 0);
        this.setUint8(dateTime.date);
        this.setUint8(dateTime.month);
        this.setUint8(dateTime.year);
    };
    CommandBinaryBuffer$2.prototype.getTariffPlan = function () {
        return {
            id: this.getUint32(),
            tariffSet: this.getUint8(),
            activateYear: this.getUint8(),
            activateMonth: this.getUint8(),
            activateDay: this.getUint8(),
            specialProfilesArraySize: this.getUint8(),
            seasonProfilesArraySize: this.getUint8(),
            dayProfilesArraySize: this.getUint8()
        };
    };
    CommandBinaryBuffer$2.prototype.setTariffPlan = function (tariffPlan) {
        this.setUint32(tariffPlan.id);
        this.setUint8(tariffPlan.tariffSet);
        this.setUint8(tariffPlan.activateYear);
        this.setUint8(tariffPlan.activateMonth);
        this.setUint8(tariffPlan.activateDay);
        this.setUint8(tariffPlan.specialProfilesArraySize);
        this.setUint8(tariffPlan.seasonProfilesArraySize);
        this.setUint8(tariffPlan.dayProfilesArraySize);
    };
    CommandBinaryBuffer$2.prototype.getTimeCorrectionParameters = function () {
        return {
            monthTransitionSummer: this.getUint8(),
            dateTransitionSummer: this.getUint8(),
            hoursTransitionSummer: this.getUint8(),
            hoursCorrectSummer: this.getUint8(),
            monthTransitionWinter: this.getUint8(),
            dateTransitionWinter: this.getUint8(),
            hoursTransitionWinter: this.getUint8(),
            hoursCorrectWinter: this.getUint8(),
            isCorrectionNeeded: this.getUint8() === 1
        };
    };
    CommandBinaryBuffer$2.prototype.setTimeCorrectionParameters = function (parameters) {
        this.setUint8(parameters.monthTransitionSummer);
        this.setUint8(parameters.dateTransitionSummer);
        this.setUint8(parameters.hoursTransitionSummer);
        this.setUint8(parameters.hoursCorrectSummer);
        this.setUint8(parameters.monthTransitionWinter);
        this.setUint8(parameters.dateTransitionWinter);
        this.setUint8(parameters.hoursTransitionWinter);
        this.setUint8(parameters.hoursCorrectWinter);
        this.setUint8(+parameters.isCorrectionNeeded);
    };
    CommandBinaryBuffer$2.prototype.getDayProfile = function () {
        return CommandBinaryBuffer$2.getDayProfileFromByte(this.getUint8());
    };
    CommandBinaryBuffer$2.prototype.setDayProfile = function (dayProfile) {
        this.setUint8(CommandBinaryBuffer$2.getByteFromDayProfile(dayProfile));
    };
    CommandBinaryBuffer$2.prototype.getSeasonProfile = function () {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(() => this.getUint8())
        };
    };
    CommandBinaryBuffer$2.prototype.setSeasonProfile = function (seasonProfile) {
        this.setUint8(seasonProfile.month);
        this.setUint8(seasonProfile.date);
        seasonProfile.dayIndexes.forEach(value => this.setUint8(value));
    };
    CommandBinaryBuffer$2.prototype.getSpecialDay = function () {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndex: this.getUint8(),
            isPeriodic: this.getUint8() === 0
        };
    };
    CommandBinaryBuffer$2.prototype.setSpecialDay = function (specialDay) {
        this.setUint8(specialDay.month);
        this.setUint8(specialDay.date);
        this.setUint8(specialDay.dayIndex);
        this.setUint8(+!specialDay.isPeriodic);
    };
    CommandBinaryBuffer$2.prototype.getDeviceType = function () {
        return fromBytes$2f(this.getBytes(9));
    };
    CommandBinaryBuffer$2.prototype.setDeviceType = function (deviceType) {
        this.setBytes(toBytes$2g(deviceType));
    };
    CommandBinaryBuffer$2.prototype.getOperatorParameters = function () {
        const operatorParameters = {
            vpThreshold: this.getUint32(),
            vThreshold: this.getUint32(),
            ipThreshold: this.getUint32(),
            pmaxThreshold0: this.getUint32(),
            pmaxThreshold1: this.getUint32(),
            pmaxThreshold2: this.getUint32(),
            pmaxThreshold3: this.getUint32(),
            speedOptoPort: this.getUint8(),
            tint: this.getUint8(),
            calcPeriodDate: this.getUint8(),
            timeoutDisplay: this.getUint8(),
            timeoutScreen: this.getUint8(),
            displaySet: toObject(displaySetMask, this.getUint32()),
            relaySet4: toObject(relaySet4Mask, this.getUint8()),
            relaySet3: toObject(relaySet3Mask, this.getUint8()),
            relaySet2: toObject(relaySet2Mask, this.getUint8()),
            relaySet1: toObject(relaySet1Mask, this.getUint8()),
            displayType: this.getUint8(),
            ten: this.getUint8(),
            timeoutRefresh: this.getUint16(),
            deltaCorMin: this.getUint8(),
            timeoutMagnetOff: this.getUint8(),
            timeoutMagnetOn: this.getUint8(),
            define1: toObject(define1Mask$1, this.getUint8()),
            timeoutRelayOn: this.getUint8(),
            timeoutRelayKey: this.getUint8(),
            timeoutRelayAuto: this.getUint8(),
            timeoutBadVAVB: this.getUint8(),
            freqMax: this.getUint8(),
            freqMin: this.getUint8(),
            phMin: this.getUint16(),
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8(),
            energyDecimalPoint: this.getUint8(),
            typeMeter: this.getUint8(),
            timeoutIMax: this.getUint8(),
            timeoutPMax: this.getUint8(),
            timeoutCos: this.getUint8(),
            pMaxDef: this.getUint8(),
            displaySetExt: toObject(displaySetExtMask, this.getUint32()),
            timeoutUneqCurrent: this.getUint8(),
            timeoutBipolarPower: this.getUint8(),
            relaySet5: toObject(relaySet5Mask, this.getUint8()),
            timeCorrectPeriod: 0,
            timeCorrectPassHalfhour: false
        };
        const timeCorrectPeriod = this.getUint8();
        operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
        operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);
        return operatorParameters;
    };
    CommandBinaryBuffer$2.prototype.setOperatorParameters = function (operatorParameters) {
        const timeCorrectPeriod = operatorParameters.timeCorrectPeriod
            | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);
        this.setUint32(operatorParameters.vpThreshold);
        this.setUint32(operatorParameters.vThreshold);
        this.setUint32(operatorParameters.ipThreshold);
        this.setUint32(operatorParameters.pmaxThreshold0);
        this.setUint32(operatorParameters.pmaxThreshold1);
        this.setUint32(operatorParameters.pmaxThreshold2);
        this.setUint32(operatorParameters.pmaxThreshold3);
        this.setUint8(operatorParameters.speedOptoPort);
        this.setUint8(operatorParameters.tint);
        this.setUint8(operatorParameters.calcPeriodDate);
        this.setUint8(operatorParameters.timeoutDisplay);
        this.setUint8(operatorParameters.timeoutScreen);
        this.setUint32(fromObject(displaySetMask, operatorParameters.displaySet));
        this.setUint8(fromObject(relaySet4Mask, operatorParameters.relaySet4));
        this.setUint8(fromObject(relaySet3Mask, operatorParameters.relaySet3));
        this.setUint8(fromObject(relaySet2Mask, operatorParameters.relaySet2));
        this.setUint8(fromObject(relaySet1Mask, operatorParameters.relaySet1));
        this.setUint8(operatorParameters.displayType);
        this.setUint8(operatorParameters.ten);
        this.setUint16(operatorParameters.timeoutRefresh);
        this.setUint8(operatorParameters.deltaCorMin);
        this.setUint8(operatorParameters.timeoutMagnetOff);
        this.setUint8(operatorParameters.timeoutMagnetOn);
        this.setUint8(fromObject(define1Mask$1, operatorParameters.define1));
        this.setUint8(operatorParameters.timeoutRelayOn);
        this.setUint8(operatorParameters.timeoutRelayKey);
        this.setUint8(operatorParameters.timeoutRelayAuto);
        this.setUint8(operatorParameters.timeoutBadVAVB);
        this.setUint8(operatorParameters.freqMax);
        this.setUint8(operatorParameters.freqMin);
        this.setUint16(operatorParameters.phMin);
        this.setUint8(operatorParameters.year);
        this.setUint8(operatorParameters.month);
        this.setUint8(operatorParameters.date);
        this.setUint8(operatorParameters.energyDecimalPoint);
        this.setUint8(operatorParameters.typeMeter);
        this.setUint8(operatorParameters.timeoutIMax);
        this.setUint8(operatorParameters.timeoutPMax);
        this.setUint8(operatorParameters.timeoutCos);
        this.setUint8(operatorParameters.pMaxDef);
        this.setUint32(fromObject(displaySetExtMask, operatorParameters.displaySetExt));
        this.setUint8(operatorParameters.timeoutUneqCurrent);
        this.setUint8(operatorParameters.timeoutBipolarPower);
        this.setUint8(fromObject(relaySet5Mask, operatorParameters.relaySet5));
        this.setUint8(timeCorrectPeriod);
    };
    CommandBinaryBuffer$2.prototype.getPackedEnergyWithType = function () {
        const byte = this.getUint8();
        const energyType = extractBits(byte, TARIFF_NUMBER$1, 1);
        const energies = getPackedEnergies$1(this, energyType, byte);
        return {
            energyType,
            energies
        };
    };
    CommandBinaryBuffer$2.prototype.setPackedEnergyWithType = function ({ energyType, energies }) {
        if (energyType) {
            setPackedEnergyType(this, energyType, energies);
        }
        energies.forEach(energy => {
            if (energy !== null) {
                this.setUint32(energy);
            }
        });
    };
    CommandBinaryBuffer$2.prototype.getEnergies = function () {
        return new Array(TARIFF_NUMBER$1).fill(0).map(() => this.getInt32());
    };
    CommandBinaryBuffer$2.prototype.setEnergies = function (energies) {
        energies.forEach(value => this.setUint32(value));
    };
    CommandBinaryBuffer$2.prototype.getDate = function () {
        return {
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8()
        };
    };
    CommandBinaryBuffer$2.prototype.setDate = function (date) {
        this.setUint8(date.year);
        this.setUint8(date.month);
        this.setUint8(date.date);
    };
    CommandBinaryBuffer$2.prototype.getSaldoParameters = function () {
        return {
            coefficients: new Array(4).fill(0).map(() => this.getUint32()),
            decimalPointTariff: this.getUint8(),
            indicationThreshold: this.getInt32(),
            relayThreshold: this.getInt32(),
            mode: this.getUint8(),
            saldoOffTimeBegin: this.getUint8(),
            saldoOffTimeEnd: this.getUint8(),
            decimalPointIndication: this.getUint8(),
            powerThreshold: this.getUint32(),
            creditThreshold: this.getInt32()
        };
    };
    CommandBinaryBuffer$2.prototype.setSaldoParameters = function (saldoParameters) {
        saldoParameters.coefficients.forEach(value => this.setUint32(value));
        this.setUint8(saldoParameters.decimalPointTariff);
        this.setInt32(saldoParameters.indicationThreshold);
        this.setInt32(saldoParameters.relayThreshold);
        this.setUint8(saldoParameters.mode);
        this.setUint8(saldoParameters.saldoOffTimeBegin);
        this.setUint8(saldoParameters.saldoOffTimeEnd);
        this.setUint8(saldoParameters.decimalPointIndication);
        this.setUint32(saldoParameters.powerThreshold);
        this.setInt32(saldoParameters.creditThreshold);
    };
    CommandBinaryBuffer$2.prototype.getEnergyPeriods = function (periodsNumber) {
        const periods = new Array(periodsNumber).fill(0).map(() => this.getUint16());
        return periods.map(period => getEnergyPeriod(period));
    };
    CommandBinaryBuffer$2.prototype.setEnergyPeriods = function (periods) {
        periods.forEach(period => setEnergyPeriod(this, period));
    };
    CommandBinaryBuffer$2.prototype.getEventStatus = function () {
        const eventStatus = this.getUint16();
        return toObject(eventStatusMask, eventStatus);
    };
    CommandBinaryBuffer$2.prototype.setEventStatus = function (parameters) {
        this.setUint16(fromObject(eventStatusMask, parameters));
    };
    CommandBinaryBuffer$2.prototype.getExtendedCurrentValues2 = function () {
        const uBattery = this.getUint16();
        const relayStatus = toObject(extendedCurrentValues2RelayStatusMask, this.getUint8());
        const relayStatus2 = toObject(extendedCurrentValues2RelayStatus2Mask, this.getUint8());
        const status1 = toObject(extendedCurrentValues2Status1Mask, this.getUint8());
        const status2 = toObject(extendedCurrentValues2Status2Mask, this.getUint8());
        const status3 = toObject(extendedCurrentValues2Status3Mask, this.getUint8());
        return {
            uBattery,
            relayStatus,
            relayStatus2,
            status1,
            status2,
            status3
        };
    };
    CommandBinaryBuffer$2.prototype.setExtendedCurrentValues2 = function (parameters) {
        const { uBattery, relayStatus, relayStatus2, status1, status2, status3 } = parameters;
        this.setUint16(uBattery);
        this.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, relayStatus));
        this.setUint8(fromObject(extendedCurrentValues2RelayStatus2Mask, relayStatus2));
        this.setUint8(fromObject(extendedCurrentValues2Status1Mask, status1));
        this.setUint8(fromObject(extendedCurrentValues2Status2Mask, status2));
        this.setUint8(fromObject(extendedCurrentValues2Status3Mask, status3));
    };
    CommandBinaryBuffer$2.prototype.getEvent = function () {
        const data = {
            hours: this.getUint8(),
            minutes: this.getUint8(),
            seconds: this.getUint8(),
            event: this.getUint8()
        };
        const { event } = data;
        const { bytesLeft } = this;
        data.eventName = eventNames$1[event];
        switch (event) {
            case POWER_OVER_RELAY_OFF$1:
                if (bytesLeft < 4) {
                    return data;
                }
                data.power = [this.getUint8(), this.getUint8(), this.getUint8(), this.getUint8()];
                break;
            case CMD_CHANGE_TIME$1:
            case TIME_CORRECT$2:
                if (bytesLeft < 8) {
                    return data;
                }
                data.newDate = this.getDateTime();
                break;
        }
        return data;
    };
    CommandBinaryBuffer$2.prototype.setEvent = function (event) {
        this.setUint8(event.hours);
        this.setUint8(event.minutes);
        this.setUint8(event.seconds);
        this.setUint8(event.event);
        switch (event.event) {
            case POWER_OVER_RELAY_OFF$1:
                for (const item of event.power) {
                    this.setUint8(item);
                }
                break;
            case CMD_CHANGE_TIME$1:
            case TIME_CORRECT$2:
                this.setDateTime(event.newDate);
                break;
        }
    };
    CommandBinaryBuffer$2.prototype.getDemand = function () {
        const date0 = this.getUint8();
        const date1 = this.getUint8();
        return {
            date: {
                year: date0 >> 1,
                month: ((date0 << 3) & 0x0f) | (date1 >> 5),
                date: date1 & 0x1f
            },
            energyType: this.getUint8(),
            firstIndex: this.getUint16(),
            count: this.getUint8(),
            period: this.getUint8()
        };
    };
    CommandBinaryBuffer$2.prototype.setDemand = function (parameters) {
        const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
        const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);
        this.setUint8(date0);
        this.setUint8(date1);
        this.setUint8(parameters.energyType);
        this.setUint16(parameters.firstIndex);
        this.setUint8(parameters.count);
        this.setUint8(parameters.period);
    };
    CommandBinaryBuffer$2.prototype.getDayMaxDemandResponse = function () {
        const date = this.getDate();
        const power = new Array(TARIFF_NUMBER$1).fill(0).map(() => ({
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        }));
        return { date, power };
    };
    CommandBinaryBuffer$2.prototype.setDayMaxDemandResponse = function (parameters) {
        this.setDate(parameters.date);
        parameters.power.forEach(value => {
            this.setUint8(value.hours);
            this.setUint8(value.minutes);
            this.setUint32(value.power);
        });
    };
    CommandBinaryBuffer$2.prototype.getOperatorParametersExtended3 = function () {
        return {
            pmaxMinusThreshold0: this.getUint32(),
            pmaxMinusThreshold1: this.getUint32(),
            pmaxMinusThreshold2: this.getUint32(),
            pmaxMinusThreshold3: this.getUint32(),
            relaySet: toObject(operatorParametersExtended3RelaySetMask, this.getUint8())
        };
    };
    CommandBinaryBuffer$2.prototype.setOperatorParametersExtended3 = function (parameters) {
        const { pmaxMinusThreshold0, pmaxMinusThreshold1, pmaxMinusThreshold2, pmaxMinusThreshold3, relaySet } = parameters;
        this.setUint32(pmaxMinusThreshold0);
        this.setUint32(pmaxMinusThreshold1);
        this.setUint32(pmaxMinusThreshold2);
        this.setUint32(pmaxMinusThreshold3);
        this.setUint8(fromObject(operatorParametersExtended3RelaySetMask, relaySet));
    };
    CommandBinaryBuffer$2.prototype.getMonthMaxPowerByTariffs = function () {
        return new Array(TARIFF_NUMBER$1).fill(0).map(() => ({
            date: this.getUint8(),
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        }));
    };
    CommandBinaryBuffer$2.prototype.setMonthMaxPowerByTariffs = function (tariffs) {
        tariffs.forEach(tariff => {
            this.setUint8(tariff.date);
            this.setUint8(tariff.hours);
            this.setUint8(tariff.minutes);
            this.setUint32(tariff.power);
        });
    };

    const HEX = 1;

    const defaultFormatOptions = {
        bytesConversionFormat: HEX,
        bytesConversionFormatOptions: {}
    };

    const defaultDlmsJsonOptions = {
        ...defaultFormatOptions,
        dlms: false
    };
    const toBytes$2f = (commandId, commandBytes = []) => [commandId, commandBytes.length, ...commandBytes];

    const UNENCRYPTED = 0x00;
    const READ_WRITE = 0x02;
    const READ_ONLY = 0x03;

    const getEventStatus$3 = 0x01;
    const getEnergyDayPrevious$3 = 0x03;
    const getDeviceType$3 = 0x04;
    const getDeviceId$3 = 0x05;
    const getDateTime$3 = 0x07;
    const setDateTime$3 = 0x08;
    const setAccessKey$3 = 0x09;
    const getCurrentValues$3 = 0x0d;
    const getEnergy$3 = 0x0f;
    const setDayProfile$3 = 0x10;
    const setSeasonProfile$3 = 0x11;
    const setSpecialDay$3 = 0x12;
    const activateRatePlan$3 = 0x13;
    const prepareRatePlan$3 = 0x14;
    const getHalfHourDemand$3 = 0x15;
    const getDayDemand$3 = 0x16;
    const getMonthDemand$3 = 0x17;
    const turnRelayOn$3 = 0x18;
    const turnRelayOff$3 = 0x19;
    const setCorrectTime$3 = 0x1c;
    const getOperatorParameters$3 = 0x1e;
    const setOperatorParameters$3 = 0x1f;
    const getVersion$3 = 0x28;
    const getSaldo$3 = 0x29;
    const setSaldo$3 = 0x2a;
    const getRatePlanInfo$3 = 0x2c;
    const getExtendedCurrentValues2 = 0x2d;
    const getSaldoParameters$3 = 0x2e;
    const setSaldoParameters$3 = 0x2f;
    const getDayMaxDemand$3 = 0x31;
    const getMonthMaxDemand$3 = 0x32;
    const getEvents$3 = 0x33;
    const getEventsCounters$3 = 0x34;
    const resetPowerMaxDay$3 = 0x35;
    const resetPowerMaxMonth$3 = 0x36;
    const getCurrentStatusMeter$3 = 0x39;
    const getExtendedCurrentValues$3 = 0x3a;
    const getDayProfile$3 = 0x3b;
    const getSeasonProfile$3 = 0x3c;
    const getSpecialDay$3 = 0x3d;
    const getCorrectTime$3 = 0x3e;
    const getCriticalEvent$3 = 0x41;
    const runTariffPlan$3 = 0x46;
    const getDayMaxDemandPrevious = 0x4a;
    const getHalfHourDemandPrevious = 0x4b;
    const getDayDemandExport$3 = 0x4f;
    const getEnergyExportDayPrevious$3 = 0x50;
    const getMonthDemandExport$3 = 0x52;
    const getHalfHourDemandExport$3 = 0x53;
    const getDayMaxDemandExport$3 = 0x58;
    const getMonthMaxDemandExport$3 = 0x59;
    const getEnergyExport$3 = 0x5b;
    const setCorrectDateTime$3 = 0x5c;
    const setDisplayParam$3 = 0x5d;
    const getDisplayParam$3 = 0x5e;
    const setSpecialOperation$3 = 0x64;
    const getMagneticFieldThreshold$3 = 0x6d;
    const getHalfhoursEnergies$3 = 0x6f;
    const getBuildVersion$3 = 0x70;
    const getOperatorParametersExtended3$3 = 0x71;
    const setOperatorParametersExtended3$3 = 0x72;
    const getDemand$3 = 0x76;
    const getMeterInfo$3 = 0x7a;

    var downlinkIds$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$3,
        getBuildVersion: getBuildVersion$3,
        getCorrectTime: getCorrectTime$3,
        getCriticalEvent: getCriticalEvent$3,
        getCurrentStatusMeter: getCurrentStatusMeter$3,
        getCurrentValues: getCurrentValues$3,
        getDateTime: getDateTime$3,
        getDayDemand: getDayDemand$3,
        getDayDemandExport: getDayDemandExport$3,
        getDayMaxDemand: getDayMaxDemand$3,
        getDayMaxDemandExport: getDayMaxDemandExport$3,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious,
        getDayProfile: getDayProfile$3,
        getDemand: getDemand$3,
        getDeviceId: getDeviceId$3,
        getDeviceType: getDeviceType$3,
        getDisplayParam: getDisplayParam$3,
        getEnergy: getEnergy$3,
        getEnergyDayPrevious: getEnergyDayPrevious$3,
        getEnergyExport: getEnergyExport$3,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$3,
        getEventStatus: getEventStatus$3,
        getEvents: getEvents$3,
        getEventsCounters: getEventsCounters$3,
        getExtendedCurrentValues: getExtendedCurrentValues$3,
        getExtendedCurrentValues2: getExtendedCurrentValues2,
        getHalfHourDemand: getHalfHourDemand$3,
        getHalfHourDemandExport: getHalfHourDemandExport$3,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious,
        getHalfhoursEnergies: getHalfhoursEnergies$3,
        getMagneticFieldThreshold: getMagneticFieldThreshold$3,
        getMeterInfo: getMeterInfo$3,
        getMonthDemand: getMonthDemand$3,
        getMonthDemandExport: getMonthDemandExport$3,
        getMonthMaxDemand: getMonthMaxDemand$3,
        getMonthMaxDemandExport: getMonthMaxDemandExport$3,
        getOperatorParameters: getOperatorParameters$3,
        getOperatorParametersExtended3: getOperatorParametersExtended3$3,
        getRatePlanInfo: getRatePlanInfo$3,
        getSaldo: getSaldo$3,
        getSaldoParameters: getSaldoParameters$3,
        getSeasonProfile: getSeasonProfile$3,
        getSpecialDay: getSpecialDay$3,
        getVersion: getVersion$3,
        prepareRatePlan: prepareRatePlan$3,
        resetPowerMaxDay: resetPowerMaxDay$3,
        resetPowerMaxMonth: resetPowerMaxMonth$3,
        runTariffPlan: runTariffPlan$3,
        setAccessKey: setAccessKey$3,
        setCorrectDateTime: setCorrectDateTime$3,
        setCorrectTime: setCorrectTime$3,
        setDateTime: setDateTime$3,
        setDayProfile: setDayProfile$3,
        setDisplayParam: setDisplayParam$3,
        setOperatorParameters: setOperatorParameters$3,
        setOperatorParametersExtended3: setOperatorParametersExtended3$3,
        setSaldo: setSaldo$3,
        setSaldoParameters: setSaldoParameters$3,
        setSeasonProfile: setSeasonProfile$3,
        setSpecialDay: setSpecialDay$3,
        setSpecialOperation: setSpecialOperation$3,
        turnRelayOff: turnRelayOff$3,
        turnRelayOn: turnRelayOn$3
    });

    var commandNames$3 = invertObject(downlinkIds$1);

    const id$2e = activateRatePlan$3;
    const name$2e = commandNames$3[activateRatePlan$3];
    const headerSize$2e = 2;
    const maxSize$2e = 1 + TARIFF_PLAN_SIZE;
    const accessLevel$2e = READ_WRITE;
    const isLoraOnly$2e = false;
    const examples$2e = {
        'set rate plan request': {
            id: id$2e,
            name: name$2e,
            headerSize: headerSize$2e,
            maxSize: maxSize$2e,
            accessLevel: accessLevel$2e,
            parameters: {
                tariffTable: 0,
                tariffPlan: {
                    id: 1,
                    tariffSet: 2,
                    activateYear: 3,
                    activateMonth: 4,
                    activateDay: 5,
                    specialProfilesArraySize: 6,
                    seasonProfilesArraySize: 7,
                    dayProfilesArraySize: 8
                }
            },
            bytes: [
                0x13, 0x0c,
                0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08
            ]
        }
    };
    const fromBytes$2e = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            tariffTable: buffer.getUint8(),
            tariffPlan: buffer.getTariffPlan()
        };
    };
    const toBytes$2e = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$2e);
        buffer.setUint8(parameters.tariffTable);
        buffer.setTariffPlan(parameters.tariffPlan);
        return toBytes$2f(id$2e, buffer.data);
    };

    var activateRatePlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2e,
        examples: examples$2e,
        fromBytes: fromBytes$2e,
        headerSize: headerSize$2e,
        id: id$2e,
        isLoraOnly: isLoraOnly$2e,
        maxSize: maxSize$2e,
        name: name$2e,
        toBytes: toBytes$2e
    });

    const id$2d = getBuildVersion$3;
    const name$2d = commandNames$3[getBuildVersion$3];
    const headerSize$2d = 2;
    const accessLevel$2d = READ_ONLY;
    const maxSize$2d = 0;
    const isLoraOnly$2d = false;
    const examples$2d = {
        'simple request': {
            id: id$2d,
            name: name$2d,
            headerSize: headerSize$2d,
            maxSize: maxSize$2d,
            accessLevel: accessLevel$2d,
            parameters: {},
            bytes: [
                0x70, 0x00
            ]
        }
    };
    const fromBytes$2d = (bytes) => {
        if (bytes.length !== maxSize$2d) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$2d = () => toBytes$2f(id$2d);

    var getBuildVersion$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2d,
        examples: examples$2d,
        fromBytes: fromBytes$2d,
        headerSize: headerSize$2d,
        id: id$2d,
        isLoraOnly: isLoraOnly$2d,
        maxSize: maxSize$2d,
        name: name$2d,
        toBytes: toBytes$2d
    });

    const id$2c = getCorrectTime$3;
    const name$2c = commandNames$3[getCorrectTime$3];
    const headerSize$2c = 2;
    const maxSize$2c = 0;
    const accessLevel$2c = READ_ONLY;
    const isLoraOnly$2c = false;
    const examples$2c = {
        'simple request': {
            id: id$2c,
            name: name$2c,
            headerSize: headerSize$2c,
            maxSize: maxSize$2c,
            accessLevel: accessLevel$2c,
            parameters: {},
            bytes: [
                0x3e, 0x00
            ]
        }
    };
    const fromBytes$2c = (bytes) => {
        if (bytes.length !== maxSize$2c) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$2c = () => toBytes$2f(id$2c);

    var getCorrectTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2c,
        examples: examples$2c,
        fromBytes: fromBytes$2c,
        headerSize: headerSize$2c,
        id: id$2c,
        isLoraOnly: isLoraOnly$2c,
        maxSize: maxSize$2c,
        name: name$2c,
        toBytes: toBytes$2c
    });

    const id$2b = getCurrentStatusMeter$3;
    const name$2b = commandNames$3[getCurrentStatusMeter$3];
    const headerSize$2b = 2;
    const accessLevel$2b = READ_ONLY;
    const maxSize$2b = 0;
    const isLoraOnly$2b = false;
    const examples$2b = {
        'simple request': {
            id: id$2b,
            name: name$2b,
            headerSize: headerSize$2b,
            maxSize: maxSize$2b,
            accessLevel: accessLevel$2b,
            parameters: {},
            bytes: [
                0x39, 0x00
            ]
        }
    };
    const fromBytes$2b = (bytes) => {
        if (bytes.length !== maxSize$2b) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$2b = () => toBytes$2f(id$2b);

    var getCurrentStatusMeter$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2b,
        examples: examples$2b,
        fromBytes: fromBytes$2b,
        headerSize: headerSize$2b,
        id: id$2b,
        isLoraOnly: isLoraOnly$2b,
        maxSize: maxSize$2b,
        name: name$2b,
        toBytes: toBytes$2b
    });

    const id$2a = getCurrentValues$3;
    const name$2a = commandNames$3[getCurrentValues$3];
    const headerSize$2a = 2;
    const maxSize$2a = 0;
    const accessLevel$2a = READ_ONLY;
    const isLoraOnly$2a = false;
    const examples$2a = {
        'simple request': {
            id: id$2a,
            name: name$2a,
            headerSize: headerSize$2a,
            maxSize: maxSize$2a,
            accessLevel: accessLevel$2a,
            parameters: {},
            bytes: [
                0x0d, 0x00
            ]
        }
    };
    const fromBytes$2a = (bytes) => {
        if (bytes.length !== maxSize$2a) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$2a = () => toBytes$2f(id$2a);

    var getCurrentValues$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2a,
        examples: examples$2a,
        fromBytes: fromBytes$2a,
        headerSize: headerSize$2a,
        id: id$2a,
        isLoraOnly: isLoraOnly$2a,
        maxSize: maxSize$2a,
        name: name$2a,
        toBytes: toBytes$2a
    });

    const id$29 = getDateTime$3;
    const name$29 = commandNames$3[getDateTime$3];
    const headerSize$29 = 2;
    const maxSize$29 = 0;
    const accessLevel$29 = READ_ONLY;
    const isLoraOnly$29 = false;
    const examples$29 = {
        'simple request': {
            id: id$29,
            name: name$29,
            headerSize: headerSize$29,
            maxSize: maxSize$29,
            accessLevel: accessLevel$29,
            parameters: {},
            bytes: [
                0x07, 0x00
            ]
        }
    };
    const fromBytes$29 = (bytes) => {
        if (bytes.length !== maxSize$29) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$29 = () => toBytes$2f(id$29);

    var getDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$29,
        examples: examples$29,
        fromBytes: fromBytes$29,
        headerSize: headerSize$29,
        id: id$29,
        isLoraOnly: isLoraOnly$29,
        maxSize: maxSize$29,
        name: name$29,
        toBytes: toBytes$29
    });

    const id$28 = getDayMaxDemand$3;
    const name$28 = commandNames$3[getDayMaxDemand$3];
    const headerSize$28 = 2;
    const maxSize$28 = 3;
    const accessLevel$28 = READ_ONLY;
    const isLoraOnly$28 = false;
    const examples$28 = {
        'request for 2024.03.22': {
            id: id$28,
            name: name$28,
            headerSize: headerSize$28,
            maxSize: maxSize$28,
            accessLevel: accessLevel$28,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x31, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$28 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$28 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$28);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$28, buffer.data);
    };

    var getDayMaxDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$28,
        examples: examples$28,
        fromBytes: fromBytes$28,
        headerSize: headerSize$28,
        id: id$28,
        isLoraOnly: isLoraOnly$28,
        maxSize: maxSize$28,
        name: name$28,
        toBytes: toBytes$28
    });

    const id$27 = getDayMaxDemandExport$3;
    const name$27 = commandNames$3[getDayMaxDemandExport$3];
    const headerSize$27 = 2;
    const maxSize$27 = 3;
    const accessLevel$27 = READ_ONLY;
    const isLoraOnly$27 = false;
    const examples$27 = {
        'request for 2024.03.22': {
            id: id$27,
            name: name$27,
            headerSize: headerSize$27,
            maxSize: maxSize$27,
            accessLevel: accessLevel$27,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x58, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$27 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$27 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$27);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$27, buffer.data);
    };

    var getDayMaxDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$27,
        examples: examples$27,
        fromBytes: fromBytes$27,
        headerSize: headerSize$27,
        id: id$27,
        isLoraOnly: isLoraOnly$27,
        maxSize: maxSize$27,
        name: name$27,
        toBytes: toBytes$27
    });

    const id$26 = getDayProfile$3;
    const name$26 = commandNames$3[getDayProfile$3];
    const headerSize$26 = 2;
    const maxSize$26 = 3;
    const accessLevel$26 = READ_ONLY;
    const isLoraOnly$26 = false;
    const examples$26 = {
        'request for active tariff table A+': {
            id: id$26,
            name: name$26,
            maxSize: maxSize$26,
            headerSize: headerSize$26,
            accessLevel: accessLevel$26,
            parameters: {
                tariffTable: 0,
                index: 3,
                isActive: true
            },
            bytes: [
                0x3b, 0x03,
                0x00, 0x03, 0x00
            ]
        }
    };
    const fromBytes$26 = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$26 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$26);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$2f(id$26, buffer.data);
    };

    var getDayProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$26,
        examples: examples$26,
        fromBytes: fromBytes$26,
        headerSize: headerSize$26,
        id: id$26,
        isLoraOnly: isLoraOnly$26,
        maxSize: maxSize$26,
        name: name$26,
        toBytes: toBytes$26
    });

    const id$25 = getDeviceId$3;
    const name$25 = commandNames$3[getDeviceId$3];
    const headerSize$25 = 2;
    const accessLevel$25 = READ_ONLY;
    const maxSize$25 = 0;
    const isLoraOnly$25 = false;
    const examples$25 = {
        'simple request': {
            id: id$25,
            name: name$25,
            headerSize: headerSize$25,
            accessLevel: accessLevel$25,
            maxSize: maxSize$25,
            parameters: {},
            bytes: [
                0x05, 0x00
            ]
        }
    };
    const fromBytes$25 = (bytes) => {
        if (bytes.length !== maxSize$25) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$25 = () => toBytes$2f(id$25);

    var getDeviceId$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$25,
        examples: examples$25,
        fromBytes: fromBytes$25,
        headerSize: headerSize$25,
        id: id$25,
        isLoraOnly: isLoraOnly$25,
        maxSize: maxSize$25,
        name: name$25,
        toBytes: toBytes$25
    });

    const id$24 = getDeviceType$3;
    const name$24 = commandNames$3[getDeviceType$3];
    const headerSize$24 = 2;
    const accessLevel$24 = READ_ONLY;
    const maxSize$24 = 0;
    const isLoraOnly$24 = false;
    const examples$24 = {
        'simple request': {
            id: id$24,
            name: name$24,
            headerSize: headerSize$24,
            maxSize: maxSize$24,
            accessLevel: accessLevel$24,
            parameters: {},
            bytes: [
                0x04, 0x00
            ]
        }
    };
    const fromBytes$24 = (data) => {
        if (data.length !== maxSize$24) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$24 = () => toBytes$2f(id$24);

    var getDeviceType$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$24,
        examples: examples$24,
        fromBytes: fromBytes$24,
        headerSize: headerSize$24,
        id: id$24,
        isLoraOnly: isLoraOnly$24,
        maxSize: maxSize$24,
        name: name$24,
        toBytes: toBytes$24
    });

    const id$23 = getEvents$3;
    const name$23 = commandNames$3[getEvents$3];
    const headerSize$23 = 2;
    const accessLevel$23 = READ_ONLY;
    const maxSize$23 = 4;
    const isLoraOnly$23 = false;
    const examples$23 = {
        'simple request': {
            id: id$23,
            name: name$23,
            headerSize: headerSize$23,
            accessLevel: accessLevel$23,
            maxSize: maxSize$23,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 12
                },
                offset: 23
            },
            bytes: [
                0x33, 0x04,
                0x18, 0x02, 0x0c, 0x17
            ]
        }
    };
    const fromBytes$23 = (bytes) => {
        if (bytes.length !== maxSize$23) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        const date = buffer.getDate();
        const offset = buffer.getUint8();
        return { date, offset };
    };
    const toBytes$23 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$23);
        buffer.setDate(parameters.date);
        buffer.setUint8(parameters.offset);
        return toBytes$2f(id$23, buffer.data);
    };

    var getEvents$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$23,
        examples: examples$23,
        fromBytes: fromBytes$23,
        headerSize: headerSize$23,
        id: id$23,
        isLoraOnly: isLoraOnly$23,
        maxSize: maxSize$23,
        name: name$23,
        toBytes: toBytes$23
    });

    const id$22 = getEventsCounters$3;
    const name$22 = commandNames$3[getEventsCounters$3];
    const headerSize$22 = 2;
    const accessLevel$22 = READ_ONLY;
    const maxSize$22 = 0;
    const isLoraOnly$22 = false;
    const examples$22 = {
        'simple request': {
            id: id$22,
            name: name$22,
            headerSize: headerSize$22,
            accessLevel: accessLevel$22,
            maxSize: maxSize$22,
            parameters: {},
            bytes: [
                0x34, 0x00
            ]
        }
    };
    const fromBytes$22 = (bytes) => {
        if (bytes.length !== maxSize$22) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$22 = () => toBytes$2f(id$22);

    var getEventsCounters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$22,
        examples: examples$22,
        fromBytes: fromBytes$22,
        headerSize: headerSize$22,
        id: id$22,
        isLoraOnly: isLoraOnly$22,
        maxSize: maxSize$22,
        name: name$22,
        toBytes: toBytes$22
    });

    const id$21 = getEventStatus$3;
    const name$21 = commandNames$3[getEventStatus$3];
    const headerSize$21 = 2;
    const accessLevel$21 = READ_ONLY;
    const maxSize$21 = 0;
    const isLoraOnly$21 = false;
    const examples$21 = {
        'simple request': {
            id: id$21,
            name: name$21,
            headerSize: headerSize$21,
            accessLevel: accessLevel$21,
            maxSize: maxSize$21,
            parameters: {},
            bytes: [
                0x01, 0x00
            ]
        }
    };
    const fromBytes$21 = (bytes) => {
        if (bytes.length !== maxSize$21) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$21 = () => toBytes$2f(id$21);

    var getEventStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$21,
        examples: examples$21,
        fromBytes: fromBytes$21,
        headerSize: headerSize$21,
        id: id$21,
        isLoraOnly: isLoraOnly$21,
        maxSize: maxSize$21,
        name: name$21,
        toBytes: toBytes$21
    });

    const id$20 = getExtendedCurrentValues$3;
    const name$20 = commandNames$3[getExtendedCurrentValues$3];
    const headerSize$20 = 2;
    const maxSize$20 = 0;
    const accessLevel$20 = READ_ONLY;
    const isLoraOnly$20 = false;
    const examples$20 = {
        'simple request': {
            id: id$20,
            name: name$20,
            headerSize: headerSize$20,
            maxSize: maxSize$20,
            accessLevel: accessLevel$20,
            parameters: {},
            bytes: [
                0x3a, 0x00
            ]
        }
    };
    const fromBytes$20 = (bytes) => {
        if (bytes.length !== maxSize$20) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$20 = () => toBytes$2f(id$20);

    var getExtendedCurrentValues$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$20,
        examples: examples$20,
        fromBytes: fromBytes$20,
        headerSize: headerSize$20,
        id: id$20,
        isLoraOnly: isLoraOnly$20,
        maxSize: maxSize$20,
        name: name$20,
        toBytes: toBytes$20
    });

    const id$1$ = getHalfHourDemand$3;
    const name$1$ = commandNames$3[getHalfHourDemand$3];
    const headerSize$1$ = 2;
    const maxSize$1$ = 3;
    const accessLevel$1$ = READ_ONLY;
    const isLoraOnly$1$ = false;
    const examples$1$ = {
        'request archive values for 2024.03.22': {
            id: id$1$,
            name: name$1$,
            headerSize: headerSize$1$,
            maxSize: maxSize$1$,
            accessLevel: accessLevel$1$,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x15, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1$ = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1$ = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1$);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1$, buffer.data);
    };

    var getHalfHourDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1$,
        examples: examples$1$,
        fromBytes: fromBytes$1$,
        headerSize: headerSize$1$,
        id: id$1$,
        isLoraOnly: isLoraOnly$1$,
        maxSize: maxSize$1$,
        name: name$1$,
        toBytes: toBytes$1$
    });

    const id$1_ = getHalfHourDemandExport$3;
    const name$1_ = commandNames$3[getHalfHourDemandExport$3];
    const headerSize$1_ = 2;
    const maxSize$1_ = 3;
    const accessLevel$1_ = READ_ONLY;
    const isLoraOnly$1_ = false;
    const examples$1_ = {
        'request archive values for 2024.03.22': {
            id: id$1_,
            name: name$1_,
            headerSize: headerSize$1_,
            maxSize: maxSize$1_,
            accessLevel: accessLevel$1_,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x53, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1_ = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1_ = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1_);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1_, buffer.data);
    };

    var getHalfHourDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1_,
        examples: examples$1_,
        fromBytes: fromBytes$1_,
        headerSize: headerSize$1_,
        id: id$1_,
        isLoraOnly: isLoraOnly$1_,
        maxSize: maxSize$1_,
        name: name$1_,
        toBytes: toBytes$1_
    });

    const TARIFF_NUMBER = 4;
    const UNDEFINED_ENERGY_VALUE = 0xffffffff;
    const energiesMask = {
        'A+': 0x01,
        'A+R+': 0x02,
        'A+R-': 0x04,
        'A-': 0x08,
        'A-R+': 0x10,
        'A-R-': 0x20
    };
    const getEnergiesFlags = (energies) => {
        const booleanObject = {};
        Object.keys(energies).forEach(name => {
            booleanObject[name] = !!energies[name];
        });
        return fromObject(energiesMask, booleanObject);
    };
    const getAPlusTariffBit = (tariff) => (tariff < TARIFF_NUMBER ? (1 << tariff) : 0);
    const getAMinusTariffBit = (tariff) => (tariff < TARIFF_NUMBER ? ((1 << tariff) << 4) : 0);
    const getTariffEnergiesFlag = (tariff, energies) => {
        let flag = 0;
        if (tariff < TARIFF_NUMBER) {
            if (energies['A+'] || energies['A+R+'] || energies['A+R-']) {
                flag |= getAPlusTariffBit(tariff);
            }
            if (energies['A-'] || energies['A-R+'] || energies['A-R-']) {
                flag |= getAMinusTariffBit(tariff);
            }
        }
        return flag;
    };
    function CommandBinaryBuffer$1(dataOrLength, isLittleEndian = false) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer$1.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer$1.prototype.constructor = CommandBinaryBuffer$1;
    CommandBinaryBuffer$1.prototype.getDate = function () {
        const date0 = this.getUint8();
        const date1 = this.getUint8();
        return {
            year: date0 >> 1,
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        };
    };
    CommandBinaryBuffer$1.prototype.setDate = function ({ year, month, date }) {
        const date0 = (year << 1) | ((month >> 3) & 0x01);
        const date1 = ((month << 5) & 0xe0) | (date & 0x1f);
        this.setUint8(date0);
        this.setUint8(date1);
    };
    CommandBinaryBuffer$1.prototype.getEnergiesFlags = function () {
        const byte = this.getUint8();
        return toObject(energiesMask, byte);
    };
    CommandBinaryBuffer$1.prototype.setEnergiesFlags = function (energies) {
        this.setUint8(getEnergiesFlags(energies));
    };
    CommandBinaryBuffer$1.prototype.getHalfhoursEnergy = function (halfhoursNumber) {
        const halfhours = [];
        for (let index = 0; index < halfhoursNumber; index++) {
            const value = this.getUint16();
            halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
        }
        return halfhours;
    };
    CommandBinaryBuffer$1.prototype.setHalfhoursEnergy = function (halfhours) {
        if (halfhours) {
            for (let index = 0; index < halfhours.length; index++) {
                const value = halfhours[index];
                this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
            }
        }
    };
    CommandBinaryBuffer$1.prototype.getHalfhoursEnergies = function (energiesFlags, halfhoursNumber) {
        const energies = {};
        if (energiesFlags['A+']) {
            energies['A+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        if (energiesFlags['A+R+']) {
            energies['A+R+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        if (energiesFlags['A+R-']) {
            energies['A+R-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        if (energiesFlags['A-']) {
            energies['A-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        if (energiesFlags['A-R+']) {
            energies['A-R+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        if (energiesFlags['A-R-']) {
            energies['A-R-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }
        return energies;
    };
    CommandBinaryBuffer$1.prototype.setHalfhoursEnergies = function (energies) {
        this.setHalfhoursEnergy(energies['A+']);
        this.setHalfhoursEnergy(energies['A+R+']);
        this.setHalfhoursEnergy(energies['A+R-']);
        this.setHalfhoursEnergy(energies['A-']);
        this.setHalfhoursEnergy(energies['A-R+']);
        this.setHalfhoursEnergy(energies['A-R-']);
    };
    CommandBinaryBuffer$1.prototype.getAPlusTariffEnergies = function (energyFlags) {
        const energies = {};
        if (energyFlags & energiesMask['A+']) {
            energies['A+'] = this.getUint32();
        }
        if (energyFlags & energiesMask['A+R+']) {
            energies['A+R+'] = this.getUint32();
        }
        if (energyFlags & energiesMask['A+R-']) {
            energies['A+R-'] = this.getUint32();
        }
        return energies;
    };
    CommandBinaryBuffer$1.prototype.setAPlusTariffEnergies = function (energies) {
        if (energies) {
            if (energies['A+']) {
                this.setUint32(energies['A+']);
            }
            if (energies['A+R+']) {
                this.setUint32(energies['A+R+']);
            }
            if (energies['A+R-']) {
                this.setUint32(energies['A+R-']);
            }
        }
    };
    CommandBinaryBuffer$1.prototype.getAMinusTariffEnergies = function (energyFlags) {
        const energies = {};
        if (energyFlags & energiesMask['A-']) {
            energies['A-'] = this.getUint32();
        }
        if (energyFlags & energiesMask['A-R+']) {
            energies['A-R+'] = this.getUint32();
        }
        if (energyFlags & energiesMask['A-R-']) {
            energies['A-R-'] = this.getUint32();
        }
        return energies;
    };
    CommandBinaryBuffer$1.prototype.setAMinusTariffEnergies = function (energies) {
        if (energies) {
            if (energies['A-']) {
                this.setUint32(energies['A-']);
            }
            if (energies['A-R+']) {
                this.setUint32(energies['A-R+']);
            }
            if (energies['A-R-']) {
                this.setUint32(energies['A-R-']);
            }
        }
    };
    CommandBinaryBuffer$1.prototype.getTariffsEnergies = function () {
        const energyFlags = this.getUint8();
        const tariffFlags = this.getUint8();
        const tariffs = new Array(TARIFF_NUMBER).fill(null);
        for (let index = 0; index < TARIFF_NUMBER; index++) {
            if (tariffFlags & getAPlusTariffBit(index)) {
                tariffs[index] = this.getAPlusTariffEnergies(energyFlags);
            }
        }
        for (let index = 0; index < TARIFF_NUMBER; index++) {
            if (tariffFlags & getAMinusTariffBit(index)) {
                tariffs[index] = { ...tariffs[index], ...this.getAMinusTariffEnergies(energyFlags) };
            }
        }
        return tariffs;
    };
    CommandBinaryBuffer$1.prototype.setTariffsEnergies = function (tariffs) {
        let energiesFlags = 0;
        let tariffsFlags = 0;
        tariffs.forEach((tariff, index) => {
            if (tariff) {
                energiesFlags |= getEnergiesFlags(tariff);
                tariffsFlags |= getTariffEnergiesFlag(index, tariff);
            }
        });
        this.setUint8(energiesFlags);
        this.setUint8(tariffsFlags);
        tariffs.forEach(tariff => this.setAPlusTariffEnergies(tariff));
        tariffs.forEach(tariff => this.setAMinusTariffEnergies(tariff));
    };
    CommandBinaryBuffer$1.prototype.getPowerMax = function () {
        return {
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        };
    };
    CommandBinaryBuffer$1.prototype.setPowerMax = function (value) {
        if (value) {
            const { hours, minutes, power } = value;
            this.setUint8(hours);
            this.setUint8(minutes);
            this.setUint32(power);
        }
    };
    CommandBinaryBuffer$1.prototype.getAPlusTariffPowerMax = function (energyFlags) {
        const energies = {};
        if (energyFlags & energiesMask['A+']) {
            energies['A+'] = this.getPowerMax();
        }
        if (energyFlags & energiesMask['A+R+']) {
            energies['A+R+'] = this.getPowerMax();
        }
        if (energyFlags & energiesMask['A+R-']) {
            energies['A+R-'] = this.getPowerMax();
        }
        return energies;
    };
    CommandBinaryBuffer$1.prototype.setAPlusTariffPowerMax = function (energies) {
        if (energies) {
            this.setPowerMax(energies['A+']);
            this.setPowerMax(energies['A+R+']);
            this.setPowerMax(energies['A+R+']);
        }
    };
    CommandBinaryBuffer$1.prototype.getAMinusTariffPowerMax = function (energyFlags) {
        const energies = {};
        if (energyFlags & energiesMask['A-']) {
            energies['A-'] = this.getPowerMax();
        }
        if (energyFlags & energiesMask['A-R+']) {
            energies['A-R+'] = this.getPowerMax();
        }
        if (energyFlags & energiesMask['A-R-']) {
            energies['A-R-'] = this.getPowerMax();
        }
        return energies;
    };
    CommandBinaryBuffer$1.prototype.setAMinusTariffPowerMax = function (energies) {
        if (energies) {
            this.setPowerMax(energies['A-']);
            this.setPowerMax(energies['A-R+']);
            this.setPowerMax(energies['A-R-']);
        }
    };
    CommandBinaryBuffer$1.prototype.getTariffsPowerMax = function () {
        const energyFlags = this.getUint8();
        const tariffFlags = this.getUint8();
        const tariffs = new Array(TARIFF_NUMBER).fill(null);
        for (let index = 0; index < TARIFF_NUMBER; index++) {
            if (tariffFlags & getAPlusTariffBit(index)) {
                tariffs[index] = this.getAPlusTariffPowerMax(energyFlags);
            }
        }
        for (let index = 0; index < TARIFF_NUMBER; index++) {
            if (tariffFlags & getAMinusTariffBit(index)) {
                tariffs[index] = { ...tariffs[index], ...this.getAMinusTariffPowerMax(energyFlags) };
            }
        }
        return tariffs;
    };
    CommandBinaryBuffer$1.prototype.setTariffsPowerMax = function (tariffs) {
        let energiesFlags = 0;
        let tariffsFlags = 0;
        tariffs.forEach((tariff, index) => {
            if (tariff) {
                energiesFlags |= getEnergiesFlags(tariff);
                tariffsFlags |= getTariffEnergiesFlag(index, tariff);
            }
        });
        this.setUint8(energiesFlags);
        this.setUint8(tariffsFlags);
        tariffs.forEach(tariff => this.setAPlusTariffPowerMax(tariff));
        tariffs.forEach(tariff => this.setAMinusTariffPowerMax(tariff));
    };

    const id$1Z = getHalfhoursEnergies$3;
    const name$1Z = commandNames$3[getHalfhoursEnergies$3];
    const headerSize$1Z = 2;
    const maxSize$1Z = 5;
    const accessLevel$1Z = UNENCRYPTED;
    const isLoraOnly$1Z = true;
    const examples$1Z = {
        'request for halfhours energies': {
            id: id$1Z,
            name: name$1Z,
            headerSize: headerSize$1Z,
            maxSize: maxSize$1Z,
            parameters: {
                date: {
                    year: 21,
                    month: 2,
                    date: 3
                },
                energies: {
                    'A+': true,
                    'A+R+': true,
                    'A+R-': false,
                    'A-': false,
                    'A-R+': false,
                    'A-R-': false
                },
                firstHalfhour: 5,
                halfhoursNumber: 3
            },
            bytes: [
                0x6f, 0x05,
                0x2a, 0x43, 0x03, 0x05, 0x03
            ]
        }
    };
    const fromBytes$1Z = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            date: buffer.getDate(),
            energies: buffer.getEnergiesFlags(),
            firstHalfhour: buffer.getUint8(),
            halfhoursNumber: buffer.getUint8()
        };
    };
    const toBytes$1Z = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1Z);
        buffer.setDate(parameters.date);
        buffer.setEnergiesFlags(parameters.energies);
        buffer.setUint8(parameters.firstHalfhour);
        buffer.setUint8(parameters.halfhoursNumber);
        return toBytes$2f(id$1Z, buffer.data);
    };

    var getHalfhoursEnergies$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Z,
        examples: examples$1Z,
        fromBytes: fromBytes$1Z,
        headerSize: headerSize$1Z,
        id: id$1Z,
        isLoraOnly: isLoraOnly$1Z,
        maxSize: maxSize$1Z,
        name: name$1Z,
        toBytes: toBytes$1Z
    });

    const id$1Y = getMagneticFieldThreshold$3;
    const name$1Y = commandNames$3[getMagneticFieldThreshold$3];
    const headerSize$1Y = 2;
    const maxSize$1Y = 0;
    const accessLevel$1Y = READ_ONLY;
    const isLoraOnly$1Y = false;
    const examples$1Y = {
        'simple request': {
            id: id$1Y,
            name: name$1Y,
            headerSize: headerSize$1Y,
            maxSize: maxSize$1Y,
            accessLevel: accessLevel$1Y,
            parameters: {},
            bytes: [
                0x6d, 0x00
            ]
        }
    };
    const fromBytes$1Y = (bytes) => {
        if (bytes.length !== maxSize$1Y) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1Y = () => toBytes$2f(id$1Y);

    var getMagneticFieldThreshold$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Y,
        examples: examples$1Y,
        fromBytes: fromBytes$1Y,
        headerSize: headerSize$1Y,
        id: id$1Y,
        isLoraOnly: isLoraOnly$1Y,
        maxSize: maxSize$1Y,
        name: name$1Y,
        toBytes: toBytes$1Y
    });

    const id$1X = getMeterInfo$3;
    const name$1X = commandNames$3[getMeterInfo$3];
    const headerSize$1X = 2;
    const maxSize$1X = 0;
    const accessLevel$1X = READ_ONLY;
    const isLoraOnly$1X = false;
    const examples$1X = {
        'simple request': {
            id: id$1X,
            name: name$1X,
            headerSize: headerSize$1X,
            maxSize: maxSize$1X,
            accessLevel: accessLevel$1X,
            parameters: {},
            bytes: [
                0x7a, 0x00
            ]
        }
    };
    const fromBytes$1X = (bytes) => {
        if (bytes.length !== maxSize$1X) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1X = () => toBytes$2f(id$1X);

    var getMeterInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1X,
        examples: examples$1X,
        fromBytes: fromBytes$1X,
        headerSize: headerSize$1X,
        id: id$1X,
        isLoraOnly: isLoraOnly$1X,
        maxSize: maxSize$1X,
        name: name$1X,
        toBytes: toBytes$1X
    });

    const id$1W = getMonthDemand$3;
    const name$1W = commandNames$3[getMonthDemand$3];
    const headerSize$1W = 2;
    const maxSize$1W = 2;
    const accessLevel$1W = READ_ONLY;
    const isLoraOnly$1W = false;
    const examples$1W = {
        'request energy for 2024.03': {
            id: id$1W,
            name: name$1W,
            headerSize: headerSize$1W,
            maxSize: maxSize$1W,
            accessLevel: accessLevel$1W,
            parameters: {
                year: 24,
                month: 3
            },
            bytes: [
                0x17, 0x02,
                0x18, 0x03
            ]
        }
    };
    const fromBytes$1W = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8()
        };
    };
    const toBytes$1W = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1W);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        return toBytes$2f(id$1W, buffer.data);
    };

    var getMonthDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1W,
        examples: examples$1W,
        fromBytes: fromBytes$1W,
        headerSize: headerSize$1W,
        id: id$1W,
        isLoraOnly: isLoraOnly$1W,
        maxSize: maxSize$1W,
        name: name$1W,
        toBytes: toBytes$1W
    });

    const id$1V = getMonthDemandExport$3;
    const name$1V = commandNames$3[getMonthDemandExport$3];
    const headerSize$1V = 2;
    const maxSize$1V = 2;
    const accessLevel$1V = READ_ONLY;
    const isLoraOnly$1V = false;
    const examples$1V = {
        'request energy for 2024.03': {
            id: id$1V,
            name: name$1V,
            headerSize: headerSize$1V,
            maxSize: maxSize$1V,
            accessLevel: accessLevel$1V,
            parameters: {
                year: 24,
                month: 3
            },
            bytes: [
                0x52, 0x02,
                0x18, 0x03
            ]
        }
    };
    const fromBytes$1V = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8()
        };
    };
    const toBytes$1V = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1V);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        return toBytes$2f(id$1V, buffer.data);
    };

    var getMonthDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1V,
        examples: examples$1V,
        fromBytes: fromBytes$1V,
        headerSize: headerSize$1V,
        id: id$1V,
        isLoraOnly: isLoraOnly$1V,
        maxSize: maxSize$1V,
        name: name$1V,
        toBytes: toBytes$1V
    });

    const id$1U = getMonthMaxDemand$3;
    const name$1U = commandNames$3[getMonthMaxDemand$3];
    const headerSize$1U = 2;
    const maxSize$1U = 2;
    const accessLevel$1U = READ_ONLY;
    const isLoraOnly$1U = false;
    const examples$1U = {
        'request max power for 2024.03': {
            id: id$1U,
            name: name$1U,
            headerSize: headerSize$1U,
            maxSize: maxSize$1U,
            accessLevel: accessLevel$1U,
            parameters: {
                year: 24,
                month: 3
            },
            bytes: [
                0x32, 0x02,
                0x18, 0x03
            ]
        }
    };
    const fromBytes$1U = (bytes) => {
        const [year, month] = bytes;
        return { year, month };
    };
    const toBytes$1U = ({ year, month }) => (toBytes$2f(id$1U, [year, month]));

    var getMonthMaxDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1U,
        examples: examples$1U,
        fromBytes: fromBytes$1U,
        headerSize: headerSize$1U,
        id: id$1U,
        isLoraOnly: isLoraOnly$1U,
        maxSize: maxSize$1U,
        name: name$1U,
        toBytes: toBytes$1U
    });

    const id$1T = getMonthMaxDemandExport$3;
    const name$1T = commandNames$3[getMonthMaxDemandExport$3];
    const headerSize$1T = 2;
    const maxSize$1T = 2;
    const accessLevel$1T = READ_ONLY;
    const isLoraOnly$1T = false;
    const examples$1T = {
        'request max power for 2024.03': {
            id: id$1T,
            name: name$1T,
            headerSize: headerSize$1T,
            maxSize: maxSize$1T,
            accessLevel: accessLevel$1T,
            parameters: {
                year: 24,
                month: 3
            },
            bytes: [
                0x59, 0x02,
                0x18, 0x03
            ]
        }
    };
    const fromBytes$1T = (bytes) => {
        const [year, month] = bytes;
        return { year, month };
    };
    const toBytes$1T = ({ year, month }) => (toBytes$2f(id$1T, [year, month]));

    var getMonthMaxDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1T,
        examples: examples$1T,
        fromBytes: fromBytes$1T,
        headerSize: headerSize$1T,
        id: id$1T,
        isLoraOnly: isLoraOnly$1T,
        maxSize: maxSize$1T,
        name: name$1T,
        toBytes: toBytes$1T
    });

    const id$1S = getOperatorParameters$3;
    const name$1S = commandNames$3[getOperatorParameters$3];
    const headerSize$1S = 2;
    const maxSize$1S = 0;
    const accessLevel$1S = READ_ONLY;
    const isLoraOnly$1S = false;
    const examples$1S = {
        'simple request': {
            id: id$1S,
            name: name$1S,
            headerSize: headerSize$1S,
            maxSize: maxSize$1S,
            accessLevel: accessLevel$1S,
            parameters: {},
            bytes: [
                0x1e, 0x00
            ]
        }
    };
    const fromBytes$1S = (bytes) => {
        if (bytes.length !== maxSize$1S) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1S = () => toBytes$2f(id$1S);

    var getOperatorParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1S,
        examples: examples$1S,
        fromBytes: fromBytes$1S,
        headerSize: headerSize$1S,
        id: id$1S,
        isLoraOnly: isLoraOnly$1S,
        maxSize: maxSize$1S,
        name: name$1S,
        toBytes: toBytes$1S
    });

    const id$1R = getOperatorParametersExtended3$3;
    const name$1R = commandNames$3[getOperatorParametersExtended3$3];
    const headerSize$1R = 2;
    const maxSize$1R = 0;
    const accessLevel$1R = READ_ONLY;
    const isLoraOnly$1R = false;
    const examples$1R = {
        'simple request': {
            id: id$1R,
            name: name$1R,
            headerSize: headerSize$1R,
            maxSize: maxSize$1R,
            accessLevel: accessLevel$1R,
            parameters: {},
            bytes: [
                0x71, 0x00
            ]
        }
    };
    const fromBytes$1R = (bytes) => {
        if (bytes.length !== maxSize$1R) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1R = () => toBytes$2f(id$1R);

    var getOperatorParametersExtended3$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1R,
        examples: examples$1R,
        fromBytes: fromBytes$1R,
        headerSize: headerSize$1R,
        id: id$1R,
        isLoraOnly: isLoraOnly$1R,
        maxSize: maxSize$1R,
        name: name$1R,
        toBytes: toBytes$1R
    });

    const id$1Q = getRatePlanInfo$3;
    const name$1Q = commandNames$3[getRatePlanInfo$3];
    const headerSize$1Q = 2;
    const maxSize$1Q = 1;
    const accessLevel$1Q = READ_ONLY;
    const isLoraOnly$1Q = false;
    const examples$1Q = {
        'request for table A-': {
            id: id$1Q,
            name: name$1Q,
            headerSize: headerSize$1Q,
            maxSize: maxSize$1Q,
            accessLevel: accessLevel$1Q,
            parameters: {
                tariffTable: 1
            },
            bytes: [
                0x2c, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1Q = (bytes) => ({ tariffTable: bytes[0] });
    const toBytes$1Q = (parameters) => (toBytes$2f(id$1Q, [parameters.tariffTable]));

    var getRatePlanInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Q,
        examples: examples$1Q,
        fromBytes: fromBytes$1Q,
        headerSize: headerSize$1Q,
        id: id$1Q,
        isLoraOnly: isLoraOnly$1Q,
        maxSize: maxSize$1Q,
        name: name$1Q,
        toBytes: toBytes$1Q
    });

    const id$1P = getSaldo$3;
    const name$1P = commandNames$3[getSaldo$3];
    const headerSize$1P = 2;
    const maxSize$1P = 0;
    const accessLevel$1P = READ_ONLY;
    const isLoraOnly$1P = false;
    const examples$1P = {
        'simple request': {
            id: id$1P,
            name: name$1P,
            headerSize: headerSize$1P,
            maxSize: maxSize$1P,
            accessLevel: accessLevel$1P,
            parameters: {},
            bytes: [
                0x29, 0x00
            ]
        }
    };
    const fromBytes$1P = (bytes) => {
        if (bytes.length !== maxSize$1P) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1P = () => toBytes$2f(id$1P);

    var getSaldo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1P,
        examples: examples$1P,
        fromBytes: fromBytes$1P,
        headerSize: headerSize$1P,
        id: id$1P,
        isLoraOnly: isLoraOnly$1P,
        maxSize: maxSize$1P,
        name: name$1P,
        toBytes: toBytes$1P
    });

    const id$1O = getSaldoParameters$3;
    const name$1O = commandNames$3[getSaldoParameters$3];
    const headerSize$1O = 2;
    const maxSize$1O = 0;
    const accessLevel$1O = READ_ONLY;
    const isLoraOnly$1O = false;
    const examples$1O = {
        'simple request': {
            id: id$1O,
            name: name$1O,
            headerSize: headerSize$1O,
            maxSize: maxSize$1O,
            accessLevel: accessLevel$1O,
            parameters: {},
            bytes: [0x2e, 0x00]
        }
    };
    const fromBytes$1O = (bytes) => {
        if (bytes.length !== maxSize$1O) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1O = () => toBytes$2f(id$1O);

    var getSaldoParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1O,
        examples: examples$1O,
        fromBytes: fromBytes$1O,
        headerSize: headerSize$1O,
        id: id$1O,
        isLoraOnly: isLoraOnly$1O,
        maxSize: maxSize$1O,
        name: name$1O,
        toBytes: toBytes$1O
    });

    const id$1N = getSeasonProfile$3;
    const name$1N = commandNames$3[getSeasonProfile$3];
    const headerSize$1N = 2;
    const maxSize$1N = 3;
    const accessLevel$1N = READ_ONLY;
    const isLoraOnly$1N = false;
    const examples$1N = {
        'request for passive tariff table A+': {
            id: id$1N,
            name: name$1N,
            headerSize: headerSize$1N,
            maxSize: maxSize$1N,
            accessLevel: accessLevel$1N,
            parameters: {
                tariffTable: 0,
                index: 5,
                isActive: false
            },
            bytes: [
                0x3c, 0x03,
                0x00, 0x05, 0x01
            ]
        }
    };
    const fromBytes$1N = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$1N = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1N);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$2f(id$1N, buffer.data);
    };

    var getSeasonProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1N,
        examples: examples$1N,
        fromBytes: fromBytes$1N,
        headerSize: headerSize$1N,
        id: id$1N,
        isLoraOnly: isLoraOnly$1N,
        maxSize: maxSize$1N,
        name: name$1N,
        toBytes: toBytes$1N
    });

    const id$1M = getSpecialDay$3;
    const name$1M = commandNames$3[getSpecialDay$3];
    const headerSize$1M = 2;
    const maxSize$1M = 3;
    const accessLevel$1M = READ_ONLY;
    const isLoraOnly$1M = false;
    const examples$1M = {
        'request for passive tariff table A+': {
            id: id$1M,
            name: name$1M,
            headerSize: headerSize$1M,
            maxSize: maxSize$1M,
            accessLevel: accessLevel$1M,
            parameters: {
                tariffTable: 0,
                index: 5,
                isActive: false
            },
            bytes: [
                0x3d, 0x03,
                0x00, 0x05, 0x01
            ]
        }
    };
    const fromBytes$1M = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$1M = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1M);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$2f(id$1M, buffer.data);
    };

    var getSpecialDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1M,
        examples: examples$1M,
        fromBytes: fromBytes$1M,
        headerSize: headerSize$1M,
        id: id$1M,
        isLoraOnly: isLoraOnly$1M,
        maxSize: maxSize$1M,
        name: name$1M,
        toBytes: toBytes$1M
    });

    const id$1L = getVersion$3;
    const name$1L = commandNames$3[getVersion$3];
    const headerSize$1L = 2;
    const maxSize$1L = 0;
    const accessLevel$1L = READ_ONLY;
    const isLoraOnly$1L = false;
    const examples$1L = {
        'simple request': {
            id: id$1L,
            name: name$1L,
            headerSize: headerSize$1L,
            maxSize: maxSize$1L,
            accessLevel: accessLevel$1L,
            parameters: {},
            bytes: [
                0x28, 0x00
            ]
        }
    };
    const fromBytes$1L = (bytes) => {
        if (bytes.length !== maxSize$1L) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1L = () => toBytes$2f(id$1L);

    var getVersion$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1L,
        examples: examples$1L,
        fromBytes: fromBytes$1L,
        headerSize: headerSize$1L,
        id: id$1L,
        isLoraOnly: isLoraOnly$1L,
        maxSize: maxSize$1L,
        name: name$1L,
        toBytes: toBytes$1L
    });

    const id$1K = prepareRatePlan$3;
    const name$1K = commandNames$3[prepareRatePlan$3];
    const headerSize$1K = 2;
    const maxSize$1K = 5;
    const accessLevel$1K = READ_WRITE;
    const isLoraOnly$1K = false;
    const examples$1K = {
        'prepare rate plan request': {
            id: id$1K,
            name: name$1K,
            headerSize: headerSize$1K,
            maxSize: maxSize$1K,
            accessLevel: accessLevel$1K,
            parameters: {
                tariffTable: 0,
                id: 987654321
            },
            bytes: [
                0x14, 0x05,
                0x00, 0x3a, 0xde, 0x68, 0xb1
            ]
        }
    };
    const fromBytes$1K = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            tariffTable: buffer.getUint8(),
            id: buffer.getUint32()
        };
    };
    const toBytes$1K = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1K);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint32(parameters.id);
        return toBytes$2f(id$1K, buffer.data);
    };

    var prepareRatePlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1K,
        examples: examples$1K,
        fromBytes: fromBytes$1K,
        headerSize: headerSize$1K,
        id: id$1K,
        isLoraOnly: isLoraOnly$1K,
        maxSize: maxSize$1K,
        name: name$1K,
        toBytes: toBytes$1K
    });

    const id$1J = resetPowerMaxDay$3;
    const name$1J = commandNames$3[resetPowerMaxDay$3];
    const headerSize$1J = 2;
    const maxSize$1J = 0;
    const accessLevel$1J = READ_WRITE;
    const isLoraOnly$1J = false;
    const examples$1J = {
        'simple request': {
            id: id$1J,
            name: name$1J,
            headerSize: headerSize$1J,
            maxSize: maxSize$1J,
            accessLevel: accessLevel$1J,
            parameters: {},
            bytes: [
                0x35, 0x00
            ]
        }
    };
    const fromBytes$1J = (bytes) => {
        if (bytes.length !== maxSize$1J) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1J = () => toBytes$2f(id$1J);

    var resetPowerMaxDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1J,
        examples: examples$1J,
        fromBytes: fromBytes$1J,
        headerSize: headerSize$1J,
        id: id$1J,
        isLoraOnly: isLoraOnly$1J,
        maxSize: maxSize$1J,
        name: name$1J,
        toBytes: toBytes$1J
    });

    const id$1I = resetPowerMaxMonth$3;
    const name$1I = commandNames$3[resetPowerMaxMonth$3];
    const headerSize$1I = 2;
    const maxSize$1I = 0;
    const accessLevel$1I = READ_WRITE;
    const isLoraOnly$1I = false;
    const examples$1I = {
        'simple request': {
            id: id$1I,
            name: name$1I,
            headerSize: headerSize$1I,
            maxSize: maxSize$1I,
            accessLevel: accessLevel$1I,
            parameters: {},
            bytes: [
                0x36, 0x00
            ]
        }
    };
    const fromBytes$1I = (bytes) => {
        if (bytes.length !== maxSize$1I) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1I = () => toBytes$2f(id$1I);

    var resetPowerMaxMonth$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1I,
        examples: examples$1I,
        fromBytes: fromBytes$1I,
        headerSize: headerSize$1I,
        id: id$1I,
        isLoraOnly: isLoraOnly$1I,
        maxSize: maxSize$1I,
        name: name$1I,
        toBytes: toBytes$1I
    });

    const id$1H = runTariffPlan$3;
    const name$1H = commandNames$3[runTariffPlan$3];
    const headerSize$1H = 2;
    const maxSize$1H = 1;
    const accessLevel$1H = READ_WRITE;
    const isLoraOnly$1H = false;
    const examples$1H = {
        'simple request': {
            id: id$1H,
            name: name$1H,
            headerSize: headerSize$1H,
            maxSize: maxSize$1H,
            accessLevel: accessLevel$1H,
            parameters: { tariffTable: 5 },
            bytes: [
                0x46, 0x01,
                0x05
            ]
        }
    };
    const fromBytes$1H = (bytes) => ({ tariffTable: bytes[0] });
    const toBytes$1H = (parameters) => (toBytes$2f(id$1H, [parameters.tariffTable]));

    var runTariffPlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1H,
        examples: examples$1H,
        fromBytes: fromBytes$1H,
        headerSize: headerSize$1H,
        id: id$1H,
        isLoraOnly: isLoraOnly$1H,
        maxSize: maxSize$1H,
        name: name$1H,
        toBytes: toBytes$1H
    });

    const KEY_SIZE = 16;
    const id$1G = setAccessKey$3;
    const name$1G = commandNames$3[setAccessKey$3];
    const headerSize$1G = 2;
    const maxSize$1G = 1 + KEY_SIZE;
    const accessLevel$1G = READ_WRITE;
    const isLoraOnly$1G = false;
    const examples$1G = {
        'set key for READ_ONLY access level': {
            id: id$1G,
            name: name$1G,
            headerSize: headerSize$1G,
            maxSize: maxSize$1G,
            accessLevel: accessLevel$1G,
            parameters: {
                accessLevel: READ_ONLY,
                key: [
                    0, 1, 2, 3, 4, 5, 6, 7,
                    7, 6, 5, 4, 3, 2, 1, 0
                ]
            },
            bytes: [
                0x09, 0x11,
                0x03, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00
            ]
        }
    };
    const fromBytes$1G = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            accessLevel: buffer.getUint8(),
            key: buffer.getBytes(KEY_SIZE)
        };
    };
    const toBytes$1G = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1G);
        buffer.setUint8(parameters.accessLevel);
        buffer.setBytes(parameters.key);
        return toBytes$2f(id$1G, buffer.data);
    };

    var setAccessKey$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1G,
        examples: examples$1G,
        fromBytes: fromBytes$1G,
        headerSize: headerSize$1G,
        id: id$1G,
        isLoraOnly: isLoraOnly$1G,
        maxSize: maxSize$1G,
        name: name$1G,
        toBytes: toBytes$1G
    });

    const id$1F = setCorrectDateTime$3;
    const name$1F = commandNames$3[setCorrectDateTime$3];
    const headerSize$1F = 2;
    const maxSize$1F = 2;
    const accessLevel$1F = READ_ONLY;
    const isLoraOnly$1F = false;
    const examples$1F = {
        'shift device time 5 seconds forward': {
            id: id$1F,
            name: name$1F,
            headerSize: headerSize$1F,
            maxSize: maxSize$1F,
            accessLevel: accessLevel$1F,
            parameters: { seconds: 5 },
            bytes: [
                0x5c, 0x02,
                0x00, 0x05
            ]
        },
        'shift device time 5 seconds backward': {
            id: id$1F,
            name: name$1F,
            headerSize: headerSize$1F,
            maxSize: maxSize$1F,
            parameters: { seconds: -5 },
            bytes: [
                0x5c, 0x02,
                0xff, 0xfb
            ]
        }
    };
    const fromBytes$1F = (bytes) => {
        if (bytes.length !== maxSize$1F) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        return { seconds: buffer.getInt16() };
    };
    const toBytes$1F = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1F);
        buffer.setInt16(parameters.seconds);
        return toBytes$2f(id$1F, buffer.data);
    };

    var setCorrectDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1F,
        examples: examples$1F,
        fromBytes: fromBytes$1F,
        headerSize: headerSize$1F,
        id: id$1F,
        isLoraOnly: isLoraOnly$1F,
        maxSize: maxSize$1F,
        name: name$1F,
        toBytes: toBytes$1F
    });

    const id$1E = setCorrectTime$3;
    const name$1E = commandNames$3[setCorrectTime$3];
    const headerSize$1E = 2;
    const maxSize$1E = 9;
    const accessLevel$1E = READ_WRITE;
    const isLoraOnly$1E = false;
    const examples$1E = {
        'default parameters': {
            id: id$1E,
            name: name$1E,
            headerSize: headerSize$1E,
            maxSize: maxSize$1E,
            accessLevel: accessLevel$1E,
            parameters: {
                monthTransitionSummer: 3,
                dateTransitionSummer: 0,
                hoursTransitionSummer: 3,
                hoursCorrectSummer: 1,
                monthTransitionWinter: 10,
                dateTransitionWinter: 0,
                hoursTransitionWinter: 4,
                hoursCorrectWinter: 1,
                isCorrectionNeeded: true
            },
            bytes: [
                0x1c, 0x09,
                0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01
            ]
        }
    };
    const fromBytes$1E = (bytes) => {
        if (bytes.length !== maxSize$1E) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getTimeCorrectionParameters();
    };
    const toBytes$1E = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1E);
        buffer.setTimeCorrectionParameters(parameters);
        return toBytes$2f(id$1E, buffer.data);
    };

    var setCorrectTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1E,
        examples: examples$1E,
        fromBytes: fromBytes$1E,
        headerSize: headerSize$1E,
        id: id$1E,
        isLoraOnly: isLoraOnly$1E,
        maxSize: maxSize$1E,
        name: name$1E,
        toBytes: toBytes$1E
    });

    const id$1D = setDateTime$3;
    const name$1D = commandNames$3[setDateTime$3];
    const headerSize$1D = 2;
    const maxSize$1D = 8;
    const accessLevel$1D = READ_ONLY;
    const isLoraOnly$1D = false;
    const examples$1D = {
        'time: 2024.02.19 18:31:55': {
            id: id$1D,
            name: name$1D,
            headerSize: headerSize$1D,
            maxSize: maxSize$1D,
            accessLevel: accessLevel$1D,
            parameters: {
                isSummerTime: false,
                seconds: 55,
                minutes: 31,
                hours: 18,
                day: 2,
                date: 19,
                month: 2,
                year: 24
            },
            bytes: [
                0x08, 0x08,
                0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18
            ]
        }
    };
    const fromBytes$1D = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getDateTime();
    };
    const toBytes$1D = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1D);
        buffer.setDateTime(parameters);
        return toBytes$2f(id$1D, buffer.data);
    };

    var setDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1D,
        examples: examples$1D,
        fromBytes: fromBytes$1D,
        headerSize: headerSize$1D,
        id: id$1D,
        isLoraOnly: isLoraOnly$1D,
        maxSize: maxSize$1D,
        name: name$1D,
        toBytes: toBytes$1D
    });

    const MAX_PERIODS_NUMBER$1 = 8;
    const PERIODS_FINAL_BYTE$1 = 0xff;
    const id$1C = setDayProfile$3;
    const name$1C = commandNames$3[setDayProfile$3];
    const headerSize$1C = 2;
    const maxSize$1C = 2 + MAX_PERIODS_NUMBER$1;
    const accessLevel$1C = READ_WRITE;
    const isLoraOnly$1C = false;
    const examples$1C = {
        'set day profile with 1 period': {
            id: id$1C,
            name: name$1C,
            headerSize: headerSize$1C,
            maxSize: maxSize$1C,
            accessLevel: accessLevel$1C,
            parameters: {
                tariffTable: 0,
                index: 3,
                periods: [
                    { tariff: 0, isFirstHalfHour: true, hour: 2 }
                ]
            },
            bytes: [
                0x10, 0x04,
                0x00, 0x03, 0x10, 0xff
            ]
        },
        'set day profile with 4 periods': {
            id: id$1C,
            name: name$1C,
            headerSize: headerSize$1C,
            maxSize: maxSize$1C,
            accessLevel: accessLevel$1C,
            parameters: {
                tariffTable: 0,
                index: 5,
                periods: [
                    { tariff: 0, isFirstHalfHour: true, hour: 2 },
                    { tariff: 1, isFirstHalfHour: false, hour: 3 },
                    { tariff: 2, isFirstHalfHour: true, hour: 4 },
                    { tariff: 3, isFirstHalfHour: false, hour: 5 }
                ]
            },
            bytes: [
                0x10, 0x07,
                0x00, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff
            ]
        },
        'set day profile with max periods': {
            id: id$1C,
            name: name$1C,
            headerSize: headerSize$1C,
            maxSize: maxSize$1C,
            accessLevel: accessLevel$1C,
            parameters: {
                tariffTable: 0,
                index: 3,
                periods: [
                    { tariff: 0, isFirstHalfHour: true, hour: 2 },
                    { tariff: 1, isFirstHalfHour: false, hour: 3 },
                    { tariff: 2, isFirstHalfHour: true, hour: 4 },
                    { tariff: 3, isFirstHalfHour: false, hour: 5 },
                    { tariff: 0, isFirstHalfHour: true, hour: 6 },
                    { tariff: 1, isFirstHalfHour: false, hour: 7 },
                    { tariff: 2, isFirstHalfHour: false, hour: 8 },
                    { tariff: 3, isFirstHalfHour: true, hour: 9 }
                ]
            },
            bytes: [
                0x10, 0x0a,
                0x00, 0x03, 0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b
            ]
        }
    };
    const fromBytes$1C = (bytes) => {
        const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE$1);
        const cleanBytes = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
        const buffer = new CommandBinaryBuffer$2(cleanBytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            periods: [...cleanBytes.slice(buffer.offset)].map(CommandBinaryBuffer$2.getDayProfileFromByte)
        };
    };
    const toBytes$1C = (parameters) => {
        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER$1;
        const size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
        const buffer = new CommandBinaryBuffer$2(size);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        parameters.periods.forEach(period => {
            buffer.setDayProfile(period);
        });
        if (hasPeriodsFinalByte) {
            buffer.setUint8(PERIODS_FINAL_BYTE$1);
        }
        return toBytes$2f(id$1C, buffer.data);
    };

    var setDayProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1C,
        examples: examples$1C,
        fromBytes: fromBytes$1C,
        headerSize: headerSize$1C,
        id: id$1C,
        isLoraOnly: isLoraOnly$1C,
        maxSize: maxSize$1C,
        name: name$1C,
        toBytes: toBytes$1C
    });

    const id$1B = setOperatorParametersExtended3$3;
    const name$1B = commandNames$3[setOperatorParametersExtended3$3];
    const headerSize$1B = 2;
    const maxSize$1B = 17;
    const accessLevel$1B = READ_WRITE;
    const isLoraOnly$1B = false;
    const examples$1B = {
        'simple request': {
            id: id$1B,
            name: name$1B,
            headerSize: headerSize$1B,
            maxSize: maxSize$1B,
            accessLevel: accessLevel$1B,
            parameters: {
                pmaxMinusThreshold0: 100,
                pmaxMinusThreshold1: 200,
                pmaxMinusThreshold2: 300,
                pmaxMinusThreshold3: 400,
                relaySet: {
                    RELAY_OFF_LIMIT_P_MINUS_T1: true,
                    RELAY_OFF_LIMIT_P_MINUS_T2: false,
                    RELAY_OFF_LIMIT_P_MINUS_T3: true,
                    RELAY_OFF_LIMIT_P_MINUS_T4: false
                }
            },
            bytes: [
                0x72, 0x11,
                0x00, 0x00, 0x00, 0x64,
                0x00, 0x00, 0x00, 0xc8,
                0x00, 0x00, 0x01, 0x2c,
                0x00, 0x00, 0x01, 0x90,
                0x14
            ]
        }
    };
    const fromBytes$1B = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getOperatorParametersExtended3();
    };
    const toBytes$1B = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1B);
        buffer.setOperatorParametersExtended3(parameters);
        return toBytes$2f(id$1B, buffer.data);
    };

    var setOperatorParametersExtended3$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1B,
        examples: examples$1B,
        fromBytes: fromBytes$1B,
        headerSize: headerSize$1B,
        id: id$1B,
        isLoraOnly: isLoraOnly$1B,
        maxSize: maxSize$1B,
        name: name$1B,
        toBytes: toBytes$1B
    });

    const id$1A = setSaldo$3;
    const name$1A = commandNames$3[setSaldo$3];
    const headerSize$1A = 2;
    const maxSize$1A = 12;
    const accessLevel$1A = READ_WRITE;
    const isLoraOnly$1A = false;
    const examples$1A = {
        'test request': {
            id: id$1A,
            name: name$1A,
            headerSize: headerSize$1A,
            maxSize: maxSize$1A,
            accessLevel: accessLevel$1A,
            parameters: {
                date: {
                    month: 9,
                    date: 23,
                    hours: 6,
                    minutes: 35
                },
                saldoNew: 2,
                saldoOld: 5
            },
            bytes: [
                0x2a, 0x0c,
                0x09, 0x17, 0x06, 0x23, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x05
            ]
        }
    };
    const fromBytes$1A = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            date: {
                month: buffer.getUint8(),
                date: buffer.getUint8(),
                hours: buffer.getUint8(),
                minutes: buffer.getUint8()
            },
            saldoNew: buffer.getInt32(),
            saldoOld: buffer.getInt32()
        };
    };
    const toBytes$1A = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1A);
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);
        buffer.setInt32(parameters.saldoNew);
        buffer.setInt32(parameters.saldoOld);
        return toBytes$2f(id$1A, buffer.data);
    };

    var setSaldo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1A,
        examples: examples$1A,
        fromBytes: fromBytes$1A,
        headerSize: headerSize$1A,
        id: id$1A,
        isLoraOnly: isLoraOnly$1A,
        maxSize: maxSize$1A,
        name: name$1A,
        toBytes: toBytes$1A
    });

    const id$1z = setSaldoParameters$3;
    const name$1z = commandNames$3[setSaldoParameters$3];
    const headerSize$1z = 2;
    const maxSize$1z = 37;
    const accessLevel$1z = READ_WRITE;
    const isLoraOnly$1z = false;
    const examples$1z = {
        'test parameters': {
            id: id$1z,
            name: name$1z,
            headerSize: headerSize$1z,
            maxSize: maxSize$1z,
            accessLevel: accessLevel$1z,
            parameters: {
                coefficients: [2, 3, 4, 5],
                decimalPointTariff: 6,
                indicationThreshold: 7,
                relayThreshold: 8,
                mode: 9,
                saldoOffTimeBegin: 10,
                saldoOffTimeEnd: 11,
                decimalPointIndication: 12,
                powerThreshold: 13,
                creditThreshold: 14
            },
            bytes: [
                0x2f, 0x25,
                0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04,
                0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00,
                0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00,
                0x0e
            ]
        }
    };
    const fromBytes$1z = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getSaldoParameters();
    };
    const toBytes$1z = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1z);
        buffer.setSaldoParameters(parameters);
        return toBytes$2f(id$1z, buffer.data);
    };

    var setSaldoParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1z,
        examples: examples$1z,
        fromBytes: fromBytes$1z,
        headerSize: headerSize$1z,
        id: id$1z,
        isLoraOnly: isLoraOnly$1z,
        maxSize: maxSize$1z,
        name: name$1z,
        toBytes: toBytes$1z
    });

    const id$1y = setSeasonProfile$3;
    const name$1y = commandNames$3[setSeasonProfile$3];
    const headerSize$1y = 2;
    const maxSize$1y = SEASON_PROFILE_SIZE;
    const accessLevel$1y = READ_WRITE;
    const isLoraOnly$1y = false;
    const examples$1y = {
        'set default season profile': {
            id: id$1y,
            name: name$1y,
            headerSize: headerSize$1y,
            maxSize: maxSize$1y,
            accessLevel: accessLevel$1y,
            parameters: {
                tariffTable: 1,
                index: 8,
                month: 1,
                date: 1,
                dayIndexes: [0, 0, 0, 0, 0, 0, 0]
            },
            bytes: [
                0x11, 0x0b,
                0x01, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ]
        },
        'set some season profile': {
            id: id$1y,
            name: name$1y,
            headerSize: headerSize$1y,
            maxSize: maxSize$1y,
            accessLevel: accessLevel$1y,
            parameters: {
                tariffTable: 0,
                index: 2,
                month: 5,
                date: 9,
                dayIndexes: [0, 1, 2, 3, 4, 5, 6]
            },
            bytes: [
                0x11, 0x0b,
                0x00, 0x02, 0x05, 0x09, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06
            ]
        }
    };
    const fromBytes$1y = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSeasonProfile()
        };
    };
    const toBytes$1y = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1y);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setSeasonProfile(parameters);
        return toBytes$2f(id$1y, buffer.data);
    };

    var setSeasonProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1y,
        examples: examples$1y,
        fromBytes: fromBytes$1y,
        headerSize: headerSize$1y,
        id: id$1y,
        isLoraOnly: isLoraOnly$1y,
        maxSize: maxSize$1y,
        name: name$1y,
        toBytes: toBytes$1y
    });

    const id$1x = setSpecialDay$3;
    const name$1x = commandNames$3[setSpecialDay$3];
    const headerSize$1x = 2;
    const maxSize$1x = 6;
    const accessLevel$1x = READ_WRITE;
    const isLoraOnly$1x = false;
    const examples$1x = {
        'set special day': {
            id: id$1x,
            name: name$1x,
            headerSize: headerSize$1x,
            maxSize: maxSize$1x,
            accessLevel: accessLevel$1x,
            parameters: {
                tariffTable: 1,
                index: 5,
                month: 1,
                date: 9,
                dayIndex: 3,
                isPeriodic: true
            },
            bytes: [
                0x12, 0x06,
                0x01, 0x05, 0x01, 0x09, 0x03, 0x00
            ]
        }
    };
    const fromBytes$1x = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSpecialDay()
        };
    };
    const toBytes$1x = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1x);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setSpecialDay(parameters);
        return toBytes$2f(id$1x, buffer.data);
    };

    var setSpecialDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1x,
        examples: examples$1x,
        fromBytes: fromBytes$1x,
        headerSize: headerSize$1x,
        id: id$1x,
        isLoraOnly: isLoraOnly$1x,
        maxSize: maxSize$1x,
        name: name$1x,
        toBytes: toBytes$1x
    });

    const RESET_INFLUENCE_SCREENS = 0x55;

    const id$1w = setSpecialOperation$3;
    const name$1w = commandNames$3[setSpecialOperation$3];
    const headerSize$1w = 2;
    const maxSize$1w = 2;
    const accessLevel$1w = READ_WRITE;
    const isLoraOnly$1w = false;
    const examples$1w = {
        'read screens info': {
            id: id$1w,
            name: name$1w,
            headerSize: headerSize$1w,
            maxSize: maxSize$1w,
            accessLevel: accessLevel$1w,
            parameters: {
                type: RESET_INFLUENCE_SCREENS,
                readScreensInfo: true,
                resetElectroMagneticIndication: false,
                resetMagneticIndication: false
            },
            bytes: [
                0x64, 0x02,
                0x55, 0x80
            ]
        },
        'reset both screens': {
            id: id$1w,
            name: name$1w,
            headerSize: headerSize$1w,
            maxSize: maxSize$1w,
            accessLevel: accessLevel$1w,
            parameters: {
                type: RESET_INFLUENCE_SCREENS,
                readScreensInfo: false,
                resetElectroMagneticIndication: true,
                resetMagneticIndication: true
            },
            bytes: [
                0x64, 0x02,
                0x55, 0x03
            ]
        },
        'reset magnetic screen': {
            id: id$1w,
            name: name$1w,
            headerSize: headerSize$1w,
            maxSize: maxSize$1w,
            accessLevel: accessLevel$1w,
            parameters: {
                type: RESET_INFLUENCE_SCREENS,
                readScreensInfo: false,
                resetElectroMagneticIndication: false,
                resetMagneticIndication: true
            },
            bytes: [
                0x64, 0x02,
                0x55, 0x02
            ]
        }
    };
    const fromBytes$1w = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        const type = buffer.getUint8();
        const flags = buffer.getUint8();
        const readScreensInfo = !!(flags & 0x80);
        const resetElectroMagneticIndication = !!(flags & 1);
        const resetMagneticIndication = !!(flags & 2);
        return {
            type,
            readScreensInfo,
            resetElectroMagneticIndication,
            resetMagneticIndication
        };
    };
    const toBytes$1w = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$1w);
        let flags = 0;
        if (parameters.readScreensInfo) {
            flags |= 0x80;
        }
        if (parameters.resetElectroMagneticIndication) {
            flags |= 1;
        }
        if (parameters.resetMagneticIndication) {
            flags |= 2;
        }
        buffer.setUint8(parameters.type);
        buffer.setUint8(flags);
        return toBytes$2f(id$1w, buffer.data);
    };

    var setSpecialOperation$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1w,
        examples: examples$1w,
        fromBytes: fromBytes$1w,
        headerSize: headerSize$1w,
        id: id$1w,
        isLoraOnly: isLoraOnly$1w,
        maxSize: maxSize$1w,
        name: name$1w,
        toBytes: toBytes$1w
    });

    const id$1v = turnRelayOff$3;
    const name$1v = commandNames$3[turnRelayOff$3];
    const headerSize$1v = 2;
    const maxSize$1v = 0;
    const accessLevel$1v = READ_WRITE;
    const isLoraOnly$1v = false;
    const examples$1v = {
        'simple request': {
            id: id$1v,
            name: name$1v,
            headerSize: headerSize$1v,
            maxSize: maxSize$1v,
            accessLevel: accessLevel$1v,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$1v = (bytes) => {
        if (bytes.length !== maxSize$1v) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1v = () => toBytes$2f(id$1v);

    var turnRelayOff$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1v,
        examples: examples$1v,
        fromBytes: fromBytes$1v,
        headerSize: headerSize$1v,
        id: id$1v,
        isLoraOnly: isLoraOnly$1v,
        maxSize: maxSize$1v,
        name: name$1v,
        toBytes: toBytes$1v
    });

    const id$1u = turnRelayOn$3;
    const name$1u = commandNames$3[turnRelayOn$3];
    const headerSize$1u = 2;
    const maxSize$1u = 0;
    const accessLevel$1u = READ_WRITE;
    const isLoraOnly$1u = false;
    const examples$1u = {
        'simple request': {
            id: id$1u,
            name: name$1u,
            headerSize: headerSize$1u,
            maxSize: maxSize$1u,
            accessLevel: accessLevel$1u,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$1u = (bytes) => {
        if (bytes.length !== maxSize$1u) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1u = () => toBytes$2f(id$1u);

    var turnRelayOn$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1u,
        examples: examples$1u,
        fromBytes: fromBytes$1u,
        headerSize: headerSize$1u,
        id: id$1u,
        isLoraOnly: isLoraOnly$1u,
        maxSize: maxSize$1u,
        name: name$1u,
        toBytes: toBytes$1u
    });

    const CASE_OPEN$1 = 0;
    const MAGNETIC_ON$1 = 1;
    const PARAMETERS_UPDATE_REMOTE = 2;
    const PARAMETERS_UPDATE_LOCAL = 3;
    const RESTART$1 = 4;
    const ERROR_ACCESS = 5;
    const TIME_SET = 6;
    const TIME_CORRECT$1 = 7;
    const DEVICE_FAILURE = 8;
    const CASE_TERMINAL_OPEN = 9;
    const CASE_MODULE_OPEN$1 = 10;
    const TARIFF_TABLE_SET = 11;
    const TARIFF_TABLE_GET = 12;
    const PROTECTION_RESET_EM = 13;
    const PROTECTION_RESET_MAGNETIC = 14;

    var criticalEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN$1,
        CASE_OPEN: CASE_OPEN$1,
        CASE_TERMINAL_OPEN: CASE_TERMINAL_OPEN,
        DEVICE_FAILURE: DEVICE_FAILURE,
        ERROR_ACCESS: ERROR_ACCESS,
        MAGNETIC_ON: MAGNETIC_ON$1,
        PARAMETERS_UPDATE_LOCAL: PARAMETERS_UPDATE_LOCAL,
        PARAMETERS_UPDATE_REMOTE: PARAMETERS_UPDATE_REMOTE,
        PROTECTION_RESET_EM: PROTECTION_RESET_EM,
        PROTECTION_RESET_MAGNETIC: PROTECTION_RESET_MAGNETIC,
        RESTART: RESTART$1,
        TARIFF_TABLE_GET: TARIFF_TABLE_GET,
        TARIFF_TABLE_SET: TARIFF_TABLE_SET,
        TIME_CORRECT: TIME_CORRECT$1,
        TIME_SET: TIME_SET
    });

    invertObject(criticalEvents);

    const OK = 0;
    const UNKNOWN_COMMAND = 0x80;
    const NOT_ALIGNED_DATA = 0x81;
    const DECRYPTION_FAILURE = 0x82;
    const UNKNOWN_PROTOCOL = 0x83;
    const BAD_MESSAGE = 0x84;
    const BAD_DATA_LENGTH = 0x85;
    const BAD_ARRAY_INDEX = 0x86;
    const NOT_PREPARED_RATE_PLAN = 0x87;
    const BAD_RATE_PLAN_ID = 0x88;
    const BAD_RATE_PLAN_SIZE = 0x89;
    const BAD_RESPONSE_LENGTH = 0x90;
    const NO_DATA_FOR_DATE = 0x91;
    const CALIBRATION_DISABLED = 0x92;
    const ACCESS_DENIED = 0x93;
    const BAD_SALDO_WRITE = 0x95;
    const BLOCKED_METER = 0x97;
    const UNENCRYPTED_COMMAND_DISABLED = 0x98;
    const TIME_CORRECTION_FAILURE = 0x99;
    const INVALID_CORRECTION_INTERVAL = 0x9a;
    const TIME_CORRECTION_OUT_HALF_HOUR_DISABLED = 0x9b;
    const BAD_BLOCK_NUMBER = 0x9c;
    const OUT_OFF_RANGE = 0x9f;
    const SET_METER_TYPE_FAILURE = 0xa0;
    const INTERNAL = 0xf0;

    var resultCodes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_DENIED: ACCESS_DENIED,
        BAD_ARRAY_INDEX: BAD_ARRAY_INDEX,
        BAD_BLOCK_NUMBER: BAD_BLOCK_NUMBER,
        BAD_DATA_LENGTH: BAD_DATA_LENGTH,
        BAD_MESSAGE: BAD_MESSAGE,
        BAD_RATE_PLAN_ID: BAD_RATE_PLAN_ID,
        BAD_RATE_PLAN_SIZE: BAD_RATE_PLAN_SIZE,
        BAD_RESPONSE_LENGTH: BAD_RESPONSE_LENGTH,
        BAD_SALDO_WRITE: BAD_SALDO_WRITE,
        BLOCKED_METER: BLOCKED_METER,
        CALIBRATION_DISABLED: CALIBRATION_DISABLED,
        DECRYPTION_FAILURE: DECRYPTION_FAILURE,
        INTERNAL: INTERNAL,
        INVALID_CORRECTION_INTERVAL: INVALID_CORRECTION_INTERVAL,
        NOT_ALIGNED_DATA: NOT_ALIGNED_DATA,
        NOT_PREPARED_RATE_PLAN: NOT_PREPARED_RATE_PLAN,
        NO_DATA_FOR_DATE: NO_DATA_FOR_DATE,
        OK: OK,
        OUT_OFF_RANGE: OUT_OFF_RANGE,
        SET_METER_TYPE_FAILURE: SET_METER_TYPE_FAILURE,
        TIME_CORRECTION_FAILURE: TIME_CORRECTION_FAILURE,
        TIME_CORRECTION_OUT_HALF_HOUR_DISABLED: TIME_CORRECTION_OUT_HALF_HOUR_DISABLED,
        UNENCRYPTED_COMMAND_DISABLED: UNENCRYPTED_COMMAND_DISABLED,
        UNKNOWN_COMMAND: UNKNOWN_COMMAND,
        UNKNOWN_PROTOCOL: UNKNOWN_PROTOCOL
    });

    var resultNames = invertObject(resultCodes);

    const SET_ALL_SEGMENT_DISPLAY$1 = 1;
    const SOFTWARE_VERSION$1 = 2;
    const TOTAL_ACTIVE_ENERGY$1 = 3;
    const ACTIVE_ENERGY_T1$1 = 4;
    const ACTIVE_ENERGY_T2$1 = 5;
    const ACTIVE_ENERGY_T3$1 = 6;
    const ACTIVE_ENERGY_T4$1 = 7;
    const ACTIVE_POWER_PER_PHASE = 8;
    const ACTIVE_POWER_IN_NEUTRAL = 9;
    const CURRENT_IN_PHASE = 10;
    const CURRENT_IN_NEUTRAL$1 = 11;
    const VOLTAGE = 12;
    const HOUR_MINUTE_SECOND$1 = 13;
    const DATE_MONTH_YEAR$1 = 14;
    const TOTAL_EXPORTED_ACTIVE_ENERGY$1 = 15;
    const EXPORTED_ACTIVE_ENERGY_T1$1 = 16;
    const EXPORTED_ACTIVE_ENERGY_T2$1 = 17;
    const EXPORTED_ACTIVE_ENERGY_T3$1 = 18;
    const EXPORTED_ACTIVE_ENERGY_T4$1 = 19;
    const POWER_COEFFICIENT_PHASE_A$1 = 20;
    const POWER_COEFFICIENT_PHASE_B$1 = 21;
    const BATTERY_VOLTAGE$1 = 22;
    const POWER_THRESHOLD_T1$1 = 23;
    const POWER_THRESHOLD_T2$1 = 24;
    const POWER_THRESHOLD_T3$1 = 25;
    const POWER_THRESHOLD_T4$1 = 26;
    const MAGNET_INDUCTION$1 = 28;
    const CURRENT_BALANCE$1 = 30;
    const OPTOPORT_SPEED$1 = 31;

    var screenIds$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIVE_ENERGY_T1: ACTIVE_ENERGY_T1$1,
        ACTIVE_ENERGY_T2: ACTIVE_ENERGY_T2$1,
        ACTIVE_ENERGY_T3: ACTIVE_ENERGY_T3$1,
        ACTIVE_ENERGY_T4: ACTIVE_ENERGY_T4$1,
        ACTIVE_POWER_IN_NEUTRAL: ACTIVE_POWER_IN_NEUTRAL,
        ACTIVE_POWER_PER_PHASE: ACTIVE_POWER_PER_PHASE,
        BATTERY_VOLTAGE: BATTERY_VOLTAGE$1,
        CURRENT_BALANCE: CURRENT_BALANCE$1,
        CURRENT_IN_NEUTRAL: CURRENT_IN_NEUTRAL$1,
        CURRENT_IN_PHASE: CURRENT_IN_PHASE,
        DATE_MONTH_YEAR: DATE_MONTH_YEAR$1,
        EXPORTED_ACTIVE_ENERGY_T1: EXPORTED_ACTIVE_ENERGY_T1$1,
        EXPORTED_ACTIVE_ENERGY_T2: EXPORTED_ACTIVE_ENERGY_T2$1,
        EXPORTED_ACTIVE_ENERGY_T3: EXPORTED_ACTIVE_ENERGY_T3$1,
        EXPORTED_ACTIVE_ENERGY_T4: EXPORTED_ACTIVE_ENERGY_T4$1,
        HOUR_MINUTE_SECOND: HOUR_MINUTE_SECOND$1,
        MAGNET_INDUCTION: MAGNET_INDUCTION$1,
        OPTOPORT_SPEED: OPTOPORT_SPEED$1,
        POWER_COEFFICIENT_PHASE_A: POWER_COEFFICIENT_PHASE_A$1,
        POWER_COEFFICIENT_PHASE_B: POWER_COEFFICIENT_PHASE_B$1,
        POWER_THRESHOLD_T1: POWER_THRESHOLD_T1$1,
        POWER_THRESHOLD_T2: POWER_THRESHOLD_T2$1,
        POWER_THRESHOLD_T3: POWER_THRESHOLD_T3$1,
        POWER_THRESHOLD_T4: POWER_THRESHOLD_T4$1,
        SET_ALL_SEGMENT_DISPLAY: SET_ALL_SEGMENT_DISPLAY$1,
        SOFTWARE_VERSION: SOFTWARE_VERSION$1,
        TOTAL_ACTIVE_ENERGY: TOTAL_ACTIVE_ENERGY$1,
        TOTAL_EXPORTED_ACTIVE_ENERGY: TOTAL_EXPORTED_ACTIVE_ENERGY$1,
        VOLTAGE: VOLTAGE
    });

    invertObject(screenIds$1);

    const getDayEnergies = 0x78;
    const getDayMaxPower = 0x79;
    const errorResponse$2 = 0xfe;

    var uplinkIds$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$3,
        errorResponse: errorResponse$2,
        getBuildVersion: getBuildVersion$3,
        getCorrectTime: getCorrectTime$3,
        getCriticalEvent: getCriticalEvent$3,
        getCurrentStatusMeter: getCurrentStatusMeter$3,
        getCurrentValues: getCurrentValues$3,
        getDateTime: getDateTime$3,
        getDayDemand: getDayDemand$3,
        getDayDemandExport: getDayDemandExport$3,
        getDayEnergies: getDayEnergies,
        getDayMaxDemand: getDayMaxDemand$3,
        getDayMaxDemandExport: getDayMaxDemandExport$3,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious,
        getDayMaxPower: getDayMaxPower,
        getDayProfile: getDayProfile$3,
        getDemand: getDemand$3,
        getDeviceId: getDeviceId$3,
        getDeviceType: getDeviceType$3,
        getDisplayParam: getDisplayParam$3,
        getEnergy: getEnergy$3,
        getEnergyDayPrevious: getEnergyDayPrevious$3,
        getEnergyExport: getEnergyExport$3,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$3,
        getEventStatus: getEventStatus$3,
        getEvents: getEvents$3,
        getEventsCounters: getEventsCounters$3,
        getExtendedCurrentValues: getExtendedCurrentValues$3,
        getExtendedCurrentValues2: getExtendedCurrentValues2,
        getHalfHourDemand: getHalfHourDemand$3,
        getHalfHourDemandExport: getHalfHourDemandExport$3,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious,
        getHalfhoursEnergies: getHalfhoursEnergies$3,
        getMagneticFieldThreshold: getMagneticFieldThreshold$3,
        getMeterInfo: getMeterInfo$3,
        getMonthDemand: getMonthDemand$3,
        getMonthDemandExport: getMonthDemandExport$3,
        getMonthMaxDemand: getMonthMaxDemand$3,
        getMonthMaxDemandExport: getMonthMaxDemandExport$3,
        getOperatorParameters: getOperatorParameters$3,
        getOperatorParametersExtended3: getOperatorParametersExtended3$3,
        getRatePlanInfo: getRatePlanInfo$3,
        getSaldo: getSaldo$3,
        getSaldoParameters: getSaldoParameters$3,
        getSeasonProfile: getSeasonProfile$3,
        getSpecialDay: getSpecialDay$3,
        getVersion: getVersion$3,
        prepareRatePlan: prepareRatePlan$3,
        resetPowerMaxDay: resetPowerMaxDay$3,
        resetPowerMaxMonth: resetPowerMaxMonth$3,
        runTariffPlan: runTariffPlan$3,
        setAccessKey: setAccessKey$3,
        setCorrectDateTime: setCorrectDateTime$3,
        setCorrectTime: setCorrectTime$3,
        setDateTime: setDateTime$3,
        setDayProfile: setDayProfile$3,
        setDisplayParam: setDisplayParam$3,
        setOperatorParameters: setOperatorParameters$3,
        setOperatorParametersExtended3: setOperatorParametersExtended3$3,
        setSaldo: setSaldo$3,
        setSaldoParameters: setSaldoParameters$3,
        setSeasonProfile: setSeasonProfile$3,
        setSpecialDay: setSpecialDay$3,
        setSpecialOperation: setSpecialOperation$3,
        turnRelayOff: turnRelayOff$3,
        turnRelayOn: turnRelayOn$3
    });

    var commandNames$2 = invertObject(uplinkIds$1);

    const A = 0b00000000;
    const G_FULL = 0b00010001;

    const getEventStatus$1 = 0x01;
    const getEnergyDayPrevious$2 = 0x03;
    const getDeviceType$1 = 0x04;
    const getDeviceId$1 = 0x05;
    const getDateTime$1 = 0x07;
    const setDateTime$1 = 0x08;
    const setAccessKey$1 = 0x09;
    const getCurrentValues$1 = 0x0d;
    const getEnergy$2 = 0x0f;
    const setDayProfile$1 = 0x10;
    const setSeasonProfile$1 = 0x11;
    const setSpecialDay$1 = 0x12;
    const activateRatePlan$1 = 0x13;
    const prepareRatePlan$1 = 0x14;
    const getHalfHourDemand$1 = 0x15;
    const getDayDemand$2 = 0x16;
    const getMonthDemand$1 = 0x17;
    const turnRelayOn$1 = 0x18;
    const turnRelayOff$1 = 0x19;
    const setCorrectTime$1 = 0x1c;
    const getOperatorParameters$1 = 0x1e;
    const setOperatorParameters$2 = 0x1f;
    const getVersion$1 = 0x28;
    const getSaldo$1 = 0x29;
    const setSaldo$1 = 0x2a;
    const getRatePlanInfo$1 = 0x2c;
    const getSaldoParameters$1 = 0x2e;
    const setSaldoParameters$1 = 0x2f;
    const getDayMaxDemand$1 = 0x31;
    const getMonthMaxDemand$1 = 0x32;
    const getEvents$1 = 0x33;
    const getEventsCounters$1 = 0x34;
    const resetPowerMaxDay$1 = 0x35;
    const resetPowerMaxMonth$1 = 0x36;
    const getCurrentStatusMeter$1 = 0x39;
    const getExtendedCurrentValues$1 = 0x3a;
    const getDayProfile$1 = 0x3b;
    const getSeasonProfile$1 = 0x3c;
    const getSpecialDay$1 = 0x3d;
    const getCorrectTime$1 = 0x3e;
    const getOperatorParametersExtended$2 = 0x3f;
    const setOperatorParametersExtended$2 = 0x40;
    const setOperatorParametersExtended2$2 = 0x45;
    const runTariffPlan$1 = 0x46;
    const getOperatorParametersExtended2$2 = 0x47;
    const getHalfHourDemandVari$2 = 0x48;
    const getHalfHourDemandVare$2 = 0x49;
    const getEnergyExport$2 = 0x4e;
    const getDayDemandExport$2 = 0x4f;
    const getEnergyExportDayPrevious$2 = 0x50;
    const getMonthDemandExport$1 = 0x52;
    const getHalfHourDemandExport$1 = 0x53;
    const getHalfHourDemandVariExport$2 = 0x54;
    const getHalfHourDemandVareExport$2 = 0x55;
    const getCriticalEvent$2 = 0x56;
    const getDayMaxDemandExport$1 = 0x58;
    const getMonthMaxDemandExport$1 = 0x59;
    const getHalfHourDemandChannel$2 = 0x5a;
    const setCorrectDateTime$1 = 0x5c;
    const setDisplayParam$2 = 0x5d;
    const getDisplayParam$2 = 0x5e;
    const setSpecialOperation$1 = 0x64;
    const getMagneticFieldThreshold$1 = 0x6d;
    const getHalfhoursEnergies$1 = 0x6f;
    const getBuildVersion$1 = 0x70;
    const getOperatorParametersExtended3$1 = 0x71;
    const setOperatorParametersExtended3$1 = 0x72;
    const setOperatorParametersExtended4$2 = 0x75;
    const getDemand$2 = 0x76;
    const getMeterInfo$1 = 0x7a;

    var downlinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$1,
        getBuildVersion: getBuildVersion$1,
        getCorrectTime: getCorrectTime$1,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$1,
        getCurrentValues: getCurrentValues$1,
        getDateTime: getDateTime$1,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayMaxDemand: getDayMaxDemand$1,
        getDayMaxDemandExport: getDayMaxDemandExport$1,
        getDayProfile: getDayProfile$1,
        getDemand: getDemand$2,
        getDeviceId: getDeviceId$1,
        getDeviceType: getDeviceType$1,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$1,
        getEvents: getEvents$1,
        getEventsCounters: getEventsCounters$1,
        getExtendedCurrentValues: getExtendedCurrentValues$1,
        getHalfHourDemand: getHalfHourDemand$1,
        getHalfHourDemandChannel: getHalfHourDemandChannel$2,
        getHalfHourDemandExport: getHalfHourDemandExport$1,
        getHalfHourDemandVare: getHalfHourDemandVare$2,
        getHalfHourDemandVareExport: getHalfHourDemandVareExport$2,
        getHalfHourDemandVari: getHalfHourDemandVari$2,
        getHalfHourDemandVariExport: getHalfHourDemandVariExport$2,
        getHalfhoursEnergies: getHalfhoursEnergies$1,
        getMagneticFieldThreshold: getMagneticFieldThreshold$1,
        getMeterInfo: getMeterInfo$1,
        getMonthDemand: getMonthDemand$1,
        getMonthDemandExport: getMonthDemandExport$1,
        getMonthMaxDemand: getMonthMaxDemand$1,
        getMonthMaxDemandExport: getMonthMaxDemandExport$1,
        getOperatorParameters: getOperatorParameters$1,
        getOperatorParametersExtended: getOperatorParametersExtended$2,
        getOperatorParametersExtended2: getOperatorParametersExtended2$2,
        getOperatorParametersExtended3: getOperatorParametersExtended3$1,
        getRatePlanInfo: getRatePlanInfo$1,
        getSaldo: getSaldo$1,
        getSaldoParameters: getSaldoParameters$1,
        getSeasonProfile: getSeasonProfile$1,
        getSpecialDay: getSpecialDay$1,
        getVersion: getVersion$1,
        prepareRatePlan: prepareRatePlan$1,
        resetPowerMaxDay: resetPowerMaxDay$1,
        resetPowerMaxMonth: resetPowerMaxMonth$1,
        runTariffPlan: runTariffPlan$1,
        setAccessKey: setAccessKey$1,
        setCorrectDateTime: setCorrectDateTime$1,
        setCorrectTime: setCorrectTime$1,
        setDateTime: setDateTime$1,
        setDayProfile: setDayProfile$1,
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$2,
        setOperatorParametersExtended: setOperatorParametersExtended$2,
        setOperatorParametersExtended2: setOperatorParametersExtended2$2,
        setOperatorParametersExtended3: setOperatorParametersExtended3$1,
        setOperatorParametersExtended4: setOperatorParametersExtended4$2,
        setSaldo: setSaldo$1,
        setSaldoParameters: setSaldoParameters$1,
        setSeasonProfile: setSeasonProfile$1,
        setSpecialDay: setSpecialDay$1,
        setSpecialOperation: setSpecialOperation$1,
        turnRelayOff: turnRelayOff$1,
        turnRelayOn: turnRelayOn$1
    });

    var commandNames$1 = invertObject(downlinkIds);

    const ENERGY_T0_FAULT = 0x01;
    const ENERGY_T1_FAULT = 0x02;
    const ENERGY_T2_FAULT = 0x03;
    const ENERGY_T3_FAULT = 0x04;
    const ACCESS_LOCKED = 0x11;
    const ACCESS_UNLOCKED = 0x12;
    const ERR_ACCESS = 0x13;
    const CASE_OPEN = 0x14;
    const CASE_CLOSE = 0x15;
    const MAGNETIC_ON = 0x16;
    const MAGNETIC_OFF = 0x17;
    const CHANGE_ACCESS_KEY0 = 0x20;
    const CHANGE_ACCESS_KEY1 = 0x21;
    const CHANGE_ACCESS_KEY2 = 0x22;
    const CHANGE_ACCESS_KEY3 = 0x23;
    const CHANGE_PARAMETERS_LOCAL = 0x24;
    const CHANGE_PARAMETERS_REMOTE = 0x25;
    const CMD_CHANGE_TIME = 0x26;
    const CMD_RELAY_ON = 0x27;
    const CMD_RELAY_OFF = 0x28;
    const ENERGY_REGISTER_OVERFLOW = 0x31;
    const CHANGE_TARIFF_TABLE = 0x32;
    const SET_TARIFF_TABLE = 0x33;
    const SUMMER_TIME = 0x34;
    const WINTER_TIME = 0x35;
    const RELAY_ON = 0x36;
    const RELAY_OFF = 0x37;
    const RESTART = 0x38;
    const WD_RESTART = 0x39;
    const VA_MAX_OK = 0x40;
    const VA_MAX_OVER = 0x41;
    const VA_MIN_OK = 0x42;
    const VA_MIN_UNDER = 0x43;
    const VB_MAX_OK = 0x44;
    const VB_MAX_OVER = 0x45;
    const VB_MIN_OK = 0x46;
    const VB_MIN_UNDER = 0x47;
    const VC_MAX_OK = 0x48;
    const VC_MAX_OVER = 0x49;
    const VC_MIN_OK = 0x4A;
    const VC_MIN_UNDER = 0x4B;
    const F_MAX_OK = 0x4C;
    const F_MAX_OVER = 0x4D;
    const F_MIN_OK = 0x4E;
    const F_MIN_UNDER = 0x4F;
    const T_MAX_OK = 0x50;
    const T_MAX_OVER = 0x51;
    const T_MIN_OK = 0x52;
    const T_MIN_UNDER = 0x53;
    const IA_MAX_OK = 0x54;
    const IA_MAX_OVER = 0x55;
    const IB_MAX_OK = 0x56;
    const IB_MAX_OVER = 0x57;
    const IC_MAX_OK = 0x58;
    const IC_MAX_OVER = 0x59;
    const PA_MAX_OK = 0x5A;
    const PA_MAX_OVER = 0x5B;
    const PV_MAX_OK = 0x5C;
    const PV_MAX_OVER = 0x5D;
    const IDIFF_OK = 0x5E;
    const IDIFF_OVER = 0x5F;
    const CLOCK_OK = 0x60;
    const CLOCK_FAULT = 0x61;
    const POWER_C_ON = 0x62;
    const POWER_C_OFF = 0x63;
    const POWER_B_ON = 0x64;
    const POWER_B_OFF = 0x65;
    const POWER_A_ON = 0x66;
    const POWER_A_OFF = 0x67;
    const BATTERY_OK = 0x68;
    const BATTERY_FAULT = 0x69;
    const CALIBRATION_OK = 0x6A;
    const CALIBRATION_FAULT = 0x6B;
    const V_PARAMETERS_OK = 0x6C;
    const V_PARAMETERS_FAULT = 0x6D;
    const O_PARAMETERS_OK = 0x6E;
    const O_PARAMETERS_FAULT = 0x6F;
    const CHANGE_COR_TIME = 0x70;
    const CMD_RELAY_2_ON = 0x71;
    const CMD_RELAY_2_OFF = 0x72;
    const CROSS_ZERO_ENT0 = 0x73;
    const CROSS_ZERO_ENT1 = 0x74;
    const CROSS_ZERO_ENT2 = 0x75;
    const CROSS_ZERO_ENT3 = 0x76;
    const CROSS_ZERO_VARI0 = 0x77;
    const CROSS_ZERO_VARI1 = 0x78;
    const CROSS_ZERO_VARI2 = 0x79;
    const CROSS_ZERO_VARI3 = 0x7A;
    const CROSS_ZERO_VARE0 = 0x7B;
    const CROSS_ZERO_VARE1 = 0x7C;
    const CROSS_ZERO_VARE2 = 0x7D;
    const CROSS_ZERO_VARE3 = 0x7E;
    const CALIBRATION_FLAG_SET = 0x7F;
    const CALIBRATION_FLAG_RESET = 0x80;
    const BAD_TEST_EEPROM = 0x81;
    const BAD_TEST_FRAM = 0x82;
    const SET_NEW_SALDO = 0x83;
    const SALDO_PARAM_BAD = 0x84;
    const ACCUMULATION_PARAM_BAD = 0x85;
    const ACCUMULATION_PARAM_EXT_BAD = 0x86;
    const CALCULATION_PERIOD_BAD = 0x87;
    const BLOCK_TARIFF_BAD = 0x88;
    const CALIBRATION_PARAM_BAD = 0x89;
    const WINTER_SUMMER_BAD = 0x8A;
    const OP_PARAM_BAD = 0x8B;
    const OP_PARAM_EXT_BAD = 0x8C;
    const SALDO_ENERGY_BAD = 0x8D;
    const TIME_CORRECT = 0x8E;
    const COEFFICIENT_TRANSFORMATION_CHANGE = 0x8F;
    const RELAY_HARD_BAD_OFF = 0x90;
    const RELAY_HARD_ON = 0x91;
    const RELAY_HARD_BAD_ON = 0x93;
    const RELAY_HARD_OFF = 0x94;
    const METER_TROUBLE = 0x95;
    const CASE_KLEMA_OPEN = 0x96;
    const CASE_KLEMA_CLOSE = 0x97;
    const CHANGE_TARIFF_TABLE_2 = 0x98;
    const CHANGE_TARIFF_TABLE_3 = 0x99;
    const CASE_MODULE_OPEN = 0x9A;
    const CASE_MODULE_CLOSE = 0x9B;
    const SET_SALDO_PARAM = 0x9C;
    const POWER_OVER_RELAY_OFF = 0x9D;
    const CHANGE_PARAM_CHANNEL1 = 0x9E;
    const CHANGE_PARAM_CHANNEL2 = 0x9F;
    const CHANGE_PARAM_CHANNEL3 = 0xA0;
    const CHANGE_PARAM_CHANNEL4 = 0xA1;
    const CHANGE_PARAM_CHANNEL5 = 0xA2;
    const CHANGE_PARAM_CHANNEL6 = 0xA3;
    const CROSS_ZERO_EXPORT_ENT0 = 0xA4;
    const CROSS_ZERO_EXPORT_ENT1 = 0xA5;
    const CROSS_ZERO_EXPORT_ENT2 = 0xA6;
    const CROSS_ZERO_EXPORT_ENT3 = 0xA7;
    const CROSS_ZERO_EXPORT_VARI0 = 0xA8;
    const CROSS_ZERO_EXPORT_VARI1 = 0xA9;
    const CROSS_ZERO_EXPORT_VARI2 = 0xAA;
    const CROSS_ZERO_EXPORT_VARI3 = 0xAB;
    const CROSS_ZERO_EXPORT_VARE0 = 0xAC;
    const CROSS_ZERO_EXPORT_VARE1 = 0xAD;
    const CROSS_ZERO_EXPORT_VARE2 = 0xAE;
    const CROSS_ZERO_EXPORT_VARE3 = 0xAF;
    const EM_MAGNETIC_ON = 0xB0;
    const EM_MAGNETIC_OFF = 0xB1;
    const RESET_EM_FLAG = 0xB2;
    const RESET_MAGNETIC_FLAG = 0xB3;
    const SET_DEMAND_EN_1_MIN = 0xE0;
    const SET_DEMAND_EN_3_MIN = 0xE1;
    const SET_DEMAND_EN_5_MIN = 0xE2;
    const SET_DEMAND_EN_10_MIN = 0xE3;
    const SET_DEMAND_EN_15_MIN = 0xE4;
    const SET_DEMAND_EN_30_MIN = 0xE5;
    const SET_DEMAND_EN_60_MIN = 0xE6;
    const P_MAX_A_MINUS_OK = 0xE7;
    const P_MAX_A_MINUS_OVER = 0xE8;

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_LOCKED: ACCESS_LOCKED,
        ACCESS_UNLOCKED: ACCESS_UNLOCKED,
        ACCUMULATION_PARAM_BAD: ACCUMULATION_PARAM_BAD,
        ACCUMULATION_PARAM_EXT_BAD: ACCUMULATION_PARAM_EXT_BAD,
        BAD_TEST_EEPROM: BAD_TEST_EEPROM,
        BAD_TEST_FRAM: BAD_TEST_FRAM,
        BATTERY_FAULT: BATTERY_FAULT,
        BATTERY_OK: BATTERY_OK,
        BLOCK_TARIFF_BAD: BLOCK_TARIFF_BAD,
        CALCULATION_PERIOD_BAD: CALCULATION_PERIOD_BAD,
        CALIBRATION_FAULT: CALIBRATION_FAULT,
        CALIBRATION_FLAG_RESET: CALIBRATION_FLAG_RESET,
        CALIBRATION_FLAG_SET: CALIBRATION_FLAG_SET,
        CALIBRATION_OK: CALIBRATION_OK,
        CALIBRATION_PARAM_BAD: CALIBRATION_PARAM_BAD,
        CASE_CLOSE: CASE_CLOSE,
        CASE_KLEMA_CLOSE: CASE_KLEMA_CLOSE,
        CASE_KLEMA_OPEN: CASE_KLEMA_OPEN,
        CASE_MODULE_CLOSE: CASE_MODULE_CLOSE,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN,
        CASE_OPEN: CASE_OPEN,
        CHANGE_ACCESS_KEY0: CHANGE_ACCESS_KEY0,
        CHANGE_ACCESS_KEY1: CHANGE_ACCESS_KEY1,
        CHANGE_ACCESS_KEY2: CHANGE_ACCESS_KEY2,
        CHANGE_ACCESS_KEY3: CHANGE_ACCESS_KEY3,
        CHANGE_COR_TIME: CHANGE_COR_TIME,
        CHANGE_PARAMETERS_LOCAL: CHANGE_PARAMETERS_LOCAL,
        CHANGE_PARAMETERS_REMOTE: CHANGE_PARAMETERS_REMOTE,
        CHANGE_PARAM_CHANNEL1: CHANGE_PARAM_CHANNEL1,
        CHANGE_PARAM_CHANNEL2: CHANGE_PARAM_CHANNEL2,
        CHANGE_PARAM_CHANNEL3: CHANGE_PARAM_CHANNEL3,
        CHANGE_PARAM_CHANNEL4: CHANGE_PARAM_CHANNEL4,
        CHANGE_PARAM_CHANNEL5: CHANGE_PARAM_CHANNEL5,
        CHANGE_PARAM_CHANNEL6: CHANGE_PARAM_CHANNEL6,
        CHANGE_TARIFF_TABLE: CHANGE_TARIFF_TABLE,
        CHANGE_TARIFF_TABLE_2: CHANGE_TARIFF_TABLE_2,
        CHANGE_TARIFF_TABLE_3: CHANGE_TARIFF_TABLE_3,
        CLOCK_FAULT: CLOCK_FAULT,
        CLOCK_OK: CLOCK_OK,
        CMD_CHANGE_TIME: CMD_CHANGE_TIME,
        CMD_RELAY_2_OFF: CMD_RELAY_2_OFF,
        CMD_RELAY_2_ON: CMD_RELAY_2_ON,
        CMD_RELAY_OFF: CMD_RELAY_OFF,
        CMD_RELAY_ON: CMD_RELAY_ON,
        COEFFICIENT_TRANSFORMATION_CHANGE: COEFFICIENT_TRANSFORMATION_CHANGE,
        CROSS_ZERO_ENT0: CROSS_ZERO_ENT0,
        CROSS_ZERO_ENT1: CROSS_ZERO_ENT1,
        CROSS_ZERO_ENT2: CROSS_ZERO_ENT2,
        CROSS_ZERO_ENT3: CROSS_ZERO_ENT3,
        CROSS_ZERO_EXPORT_ENT0: CROSS_ZERO_EXPORT_ENT0,
        CROSS_ZERO_EXPORT_ENT1: CROSS_ZERO_EXPORT_ENT1,
        CROSS_ZERO_EXPORT_ENT2: CROSS_ZERO_EXPORT_ENT2,
        CROSS_ZERO_EXPORT_ENT3: CROSS_ZERO_EXPORT_ENT3,
        CROSS_ZERO_EXPORT_VARE0: CROSS_ZERO_EXPORT_VARE0,
        CROSS_ZERO_EXPORT_VARE1: CROSS_ZERO_EXPORT_VARE1,
        CROSS_ZERO_EXPORT_VARE2: CROSS_ZERO_EXPORT_VARE2,
        CROSS_ZERO_EXPORT_VARE3: CROSS_ZERO_EXPORT_VARE3,
        CROSS_ZERO_EXPORT_VARI0: CROSS_ZERO_EXPORT_VARI0,
        CROSS_ZERO_EXPORT_VARI1: CROSS_ZERO_EXPORT_VARI1,
        CROSS_ZERO_EXPORT_VARI2: CROSS_ZERO_EXPORT_VARI2,
        CROSS_ZERO_EXPORT_VARI3: CROSS_ZERO_EXPORT_VARI3,
        CROSS_ZERO_VARE0: CROSS_ZERO_VARE0,
        CROSS_ZERO_VARE1: CROSS_ZERO_VARE1,
        CROSS_ZERO_VARE2: CROSS_ZERO_VARE2,
        CROSS_ZERO_VARE3: CROSS_ZERO_VARE3,
        CROSS_ZERO_VARI0: CROSS_ZERO_VARI0,
        CROSS_ZERO_VARI1: CROSS_ZERO_VARI1,
        CROSS_ZERO_VARI2: CROSS_ZERO_VARI2,
        CROSS_ZERO_VARI3: CROSS_ZERO_VARI3,
        EM_MAGNETIC_OFF: EM_MAGNETIC_OFF,
        EM_MAGNETIC_ON: EM_MAGNETIC_ON,
        ENERGY_REGISTER_OVERFLOW: ENERGY_REGISTER_OVERFLOW,
        ENERGY_T0_FAULT: ENERGY_T0_FAULT,
        ENERGY_T1_FAULT: ENERGY_T1_FAULT,
        ENERGY_T2_FAULT: ENERGY_T2_FAULT,
        ENERGY_T3_FAULT: ENERGY_T3_FAULT,
        ERR_ACCESS: ERR_ACCESS,
        F_MAX_OK: F_MAX_OK,
        F_MAX_OVER: F_MAX_OVER,
        F_MIN_OK: F_MIN_OK,
        F_MIN_UNDER: F_MIN_UNDER,
        IA_MAX_OK: IA_MAX_OK,
        IA_MAX_OVER: IA_MAX_OVER,
        IB_MAX_OK: IB_MAX_OK,
        IB_MAX_OVER: IB_MAX_OVER,
        IC_MAX_OK: IC_MAX_OK,
        IC_MAX_OVER: IC_MAX_OVER,
        IDIFF_OK: IDIFF_OK,
        IDIFF_OVER: IDIFF_OVER,
        MAGNETIC_OFF: MAGNETIC_OFF,
        MAGNETIC_ON: MAGNETIC_ON,
        METER_TROUBLE: METER_TROUBLE,
        OP_PARAM_BAD: OP_PARAM_BAD,
        OP_PARAM_EXT_BAD: OP_PARAM_EXT_BAD,
        O_PARAMETERS_FAULT: O_PARAMETERS_FAULT,
        O_PARAMETERS_OK: O_PARAMETERS_OK,
        PA_MAX_OK: PA_MAX_OK,
        PA_MAX_OVER: PA_MAX_OVER,
        POWER_A_OFF: POWER_A_OFF,
        POWER_A_ON: POWER_A_ON,
        POWER_B_OFF: POWER_B_OFF,
        POWER_B_ON: POWER_B_ON,
        POWER_C_OFF: POWER_C_OFF,
        POWER_C_ON: POWER_C_ON,
        POWER_OVER_RELAY_OFF: POWER_OVER_RELAY_OFF,
        PV_MAX_OK: PV_MAX_OK,
        PV_MAX_OVER: PV_MAX_OVER,
        P_MAX_A_MINUS_OK: P_MAX_A_MINUS_OK,
        P_MAX_A_MINUS_OVER: P_MAX_A_MINUS_OVER,
        RELAY_HARD_BAD_OFF: RELAY_HARD_BAD_OFF,
        RELAY_HARD_BAD_ON: RELAY_HARD_BAD_ON,
        RELAY_HARD_OFF: RELAY_HARD_OFF,
        RELAY_HARD_ON: RELAY_HARD_ON,
        RELAY_OFF: RELAY_OFF,
        RELAY_ON: RELAY_ON,
        RESET_EM_FLAG: RESET_EM_FLAG,
        RESET_MAGNETIC_FLAG: RESET_MAGNETIC_FLAG,
        RESTART: RESTART,
        SALDO_ENERGY_BAD: SALDO_ENERGY_BAD,
        SALDO_PARAM_BAD: SALDO_PARAM_BAD,
        SET_DEMAND_EN_10_MIN: SET_DEMAND_EN_10_MIN,
        SET_DEMAND_EN_15_MIN: SET_DEMAND_EN_15_MIN,
        SET_DEMAND_EN_1_MIN: SET_DEMAND_EN_1_MIN,
        SET_DEMAND_EN_30_MIN: SET_DEMAND_EN_30_MIN,
        SET_DEMAND_EN_3_MIN: SET_DEMAND_EN_3_MIN,
        SET_DEMAND_EN_5_MIN: SET_DEMAND_EN_5_MIN,
        SET_DEMAND_EN_60_MIN: SET_DEMAND_EN_60_MIN,
        SET_NEW_SALDO: SET_NEW_SALDO,
        SET_SALDO_PARAM: SET_SALDO_PARAM,
        SET_TARIFF_TABLE: SET_TARIFF_TABLE,
        SUMMER_TIME: SUMMER_TIME,
        TIME_CORRECT: TIME_CORRECT,
        T_MAX_OK: T_MAX_OK,
        T_MAX_OVER: T_MAX_OVER,
        T_MIN_OK: T_MIN_OK,
        T_MIN_UNDER: T_MIN_UNDER,
        VA_MAX_OK: VA_MAX_OK,
        VA_MAX_OVER: VA_MAX_OVER,
        VA_MIN_OK: VA_MIN_OK,
        VA_MIN_UNDER: VA_MIN_UNDER,
        VB_MAX_OK: VB_MAX_OK,
        VB_MAX_OVER: VB_MAX_OVER,
        VB_MIN_OK: VB_MIN_OK,
        VB_MIN_UNDER: VB_MIN_UNDER,
        VC_MAX_OK: VC_MAX_OK,
        VC_MAX_OVER: VC_MAX_OVER,
        VC_MIN_OK: VC_MIN_OK,
        VC_MIN_UNDER: VC_MIN_UNDER,
        V_PARAMETERS_FAULT: V_PARAMETERS_FAULT,
        V_PARAMETERS_OK: V_PARAMETERS_OK,
        WD_RESTART: WD_RESTART,
        WINTER_SUMMER_BAD: WINTER_SUMMER_BAD,
        WINTER_TIME: WINTER_TIME
    });

    var eventNames = invertObject(events);

    const SET_ALL_SEGMENT_DISPLAY = 1;
    const SOFTWARE_VERSION = 2;
    const TOTAL_ACTIVE_ENERGY = 3;
    const ACTIVE_ENERGY_T1 = 4;
    const ACTIVE_ENERGY_T2 = 5;
    const ACTIVE_ENERGY_T3 = 6;
    const ACTIVE_ENERGY_T4 = 7;
    const TOTAL_REACTIVE_ENERGY = 8;
    const REACTIVE_ENERGY_T1 = 9;
    const REACTIVE_ENERGY_T2 = 10;
    const REACTIVE_ENERGY_T3 = 11;
    const REACTIVE_ENERGY_T4 = 12;
    const TOTAL_NEGATIVE_REACTIVE_ENERGY = 13;
    const NEGATIVE_REACTIVE_ENERGY_T1 = 14;
    const NEGATIVE_REACTIVE_ENERGY_T2 = 15;
    const NEGATIVE_REACTIVE_ENERGY_T3 = 16;
    const NEGATIVE_REACTIVE_ENERGY_T4 = 17;
    const TOTAL_EXPORTED_ACTIVE_ENERGY = 18;
    const EXPORTED_ACTIVE_ENERGY_T1 = 19;
    const EXPORTED_ACTIVE_ENERGY_T2 = 20;
    const EXPORTED_ACTIVE_ENERGY_T3 = 21;
    const EXPORTED_ACTIVE_ENERGY_T4 = 22;
    const TOTAL_EXPORTED_REACTIVE_ENERGY = 23;
    const EXPORTED_REACTIVE_ENERGY_T1 = 24;
    const EXPORTED_REACTIVE_ENERGY_T2 = 25;
    const EXPORTED_REACTIVE_ENERGY_T3 = 26;
    const EXPORTED_REACTIVE_ENERGY_T4 = 27;
    const TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY = 28;
    const EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1 = 29;
    const EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2 = 30;
    const EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3 = 31;
    const EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4 = 32;
    const CURRENT_IN_PHASE_A = 33;
    const CURRENT_IN_PHASE_B = 34;
    const CURRENT_IN_PHASE_C = 35;
    const CURRENT_IN_NEUTRAL = 36;
    const VOLTAGE_IN_PHASE_A = 37;
    const VOLTAGE_IN_PHASE_B = 38;
    const VOLTAGE_IN_PHASE_C = 39;
    const BATTERY_VOLTAGE = 40;
    const FREQUENCY = 41;
    const ACTIVE_POWER_SUM = 42;
    const ACTIVE_POWER_PHASE_A = 43;
    const ACTIVE_POWER_PHASE_B = 44;
    const ACTIVE_POWER_PHASE_C = 45;
    const REACTIVE_POWER_QPLUS_SUM = 46;
    const REACTIVE_POWER_QPLUS_PHASE_A = 47;
    const REACTIVE_POWER_QPLUS_PHASE_B = 48;
    const REACTIVE_POWER_QPLUS_PHASE_C = 49;
    const REACTIVE_POWER_QMINUS_SUM = 50;
    const REACTIVE_POWER_QMINUS_PHASE_A = 51;
    const REACTIVE_POWER_QMINUS_PHASE_B = 52;
    const REACTIVE_POWER_QMINUS_PHASE_C = 53;
    const POWER_COEFFICIENT_SUM = 54;
    const POWER_COEFFICIENT_PHASE_A = 55;
    const POWER_COEFFICIENT_PHASE_B = 56;
    const POWER_COEFFICIENT_PHASE_C = 57;
    const APPARENT_POWER_QPLUS_SUM = 58;
    const APPARENT_POWER_QPLUS_PHASE_A = 59;
    const APPARENT_POWER_QPLUS_PHASE_B = 60;
    const APPARENT_POWER_QPLUS_PHASE_C = 61;
    const APPARENT_POWER_QMINUS_SUM = 62;
    const APPARENT_POWER_QMINUS_PHASE_A = 63;
    const APPARENT_POWER_QMINUS_PHASE_B = 64;
    const APPARENT_POWER_QMINUS_PHASE_C = 65;
    const MAX_ACTIVE_POWER_DAY_T1 = 66;
    const MAX_ACTIVE_POWER_DAY_T2 = 67;
    const MAX_ACTIVE_POWER_DAY_T3 = 68;
    const MAX_ACTIVE_POWER_DAY_T4 = 69;
    const MAX_ACTIVE_POWER_MONTH_T1 = 70;
    const MAX_ACTIVE_POWER_MONTH_T2 = 71;
    const MAX_ACTIVE_POWER_MONTH_T3 = 72;
    const MAX_ACTIVE_POWER_MONTH_T4 = 73;
    const MAX_REACTIVE_POWER_DAY_T1 = 74;
    const MAX_REACTIVE_POWER_DAY_T2 = 75;
    const MAX_REACTIVE_POWER_DAY_T3 = 76;
    const MAX_REACTIVE_POWER_DAY_T4 = 77;
    const MAX_REACTIVE_POWER_MONTH_T1 = 78;
    const MAX_REACTIVE_POWER_MONTH_T2 = 79;
    const MAX_REACTIVE_POWER_MONTH_T3 = 80;
    const MAX_REACTIVE_POWER_MONTH_T4 = 81;
    const MAX_NEGATIVE_REACTIVE_POWER_DAY_T1 = 82;
    const MAX_NEGATIVE_REACTIVE_POWER_DAY_T2 = 83;
    const MAX_NEGATIVE_REACTIVE_POWER_DAY_T3 = 84;
    const MAX_NEGATIVE_REACTIVE_POWER_DAY_T4 = 85;
    const MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1 = 86;
    const MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2 = 87;
    const MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3 = 88;
    const MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4 = 89;
    const MAX_EXPORTED_ACTIVE_POWER_DAY_T1 = 90;
    const MAX_EXPORTED_ACTIVE_POWER_DAY_T2 = 91;
    const MAX_EXPORTED_ACTIVE_POWER_DAY_T3 = 92;
    const MAX_EXPORTED_ACTIVE_POWER_DAY_T4 = 93;
    const MAX_EXPORTED_ACTIVE_POWER_MONTH_T1 = 94;
    const MAX_EXPORTED_ACTIVE_POWER_MONTH_T2 = 95;
    const MAX_EXPORTED_ACTIVE_POWER_MONTH_T3 = 96;
    const MAX_EXPORTED_ACTIVE_POWER_MONTH_T4 = 97;
    const MAX_EXPORTED_REACTIVE_POWER_DAY_T1 = 98;
    const MAX_EXPORTED_REACTIVE_POWER_DAY_T2 = 99;
    const MAX_EXPORTED_REACTIVE_POWER_DAY_T3 = 100;
    const MAX_EXPORTED_REACTIVE_POWER_DAY_T4 = 101;
    const MAX_EXPORTED_REACTIVE_POWER_MONTH_T1 = 102;
    const MAX_EXPORTED_REACTIVE_POWER_MONTH_T2 = 103;
    const MAX_EXPORTED_REACTIVE_POWER_MONTH_T3 = 104;
    const MAX_EXPORTED_REACTIVE_POWER_MONTH_T4 = 105;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1 = 106;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2 = 107;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3 = 108;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4 = 109;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1 = 110;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2 = 111;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3 = 112;
    const MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4 = 113;
    const HOUR_MINUTE_SECOND = 114;
    const DATE_MONTH_YEAR = 115;
    const CURRENT_TRANSFORMATION_RATIO = 116;
    const VOLTAGE_TRANSFORMATION_RATIO = 117;
    const CURRENT_BALANCE = 118;
    const POWER_THRESHOLD_T1 = 119;
    const POWER_THRESHOLD_T2 = 120;
    const POWER_THRESHOLD_T3 = 121;
    const POWER_THRESHOLD_T4 = 122;
    const OPTOPORT_SPEED = 123;
    const MAGNET_INDUCTION = 124;

    var screenIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIVE_ENERGY_T1: ACTIVE_ENERGY_T1,
        ACTIVE_ENERGY_T2: ACTIVE_ENERGY_T2,
        ACTIVE_ENERGY_T3: ACTIVE_ENERGY_T3,
        ACTIVE_ENERGY_T4: ACTIVE_ENERGY_T4,
        ACTIVE_POWER_PHASE_A: ACTIVE_POWER_PHASE_A,
        ACTIVE_POWER_PHASE_B: ACTIVE_POWER_PHASE_B,
        ACTIVE_POWER_PHASE_C: ACTIVE_POWER_PHASE_C,
        ACTIVE_POWER_SUM: ACTIVE_POWER_SUM,
        APPARENT_POWER_QMINUS_PHASE_A: APPARENT_POWER_QMINUS_PHASE_A,
        APPARENT_POWER_QMINUS_PHASE_B: APPARENT_POWER_QMINUS_PHASE_B,
        APPARENT_POWER_QMINUS_PHASE_C: APPARENT_POWER_QMINUS_PHASE_C,
        APPARENT_POWER_QMINUS_SUM: APPARENT_POWER_QMINUS_SUM,
        APPARENT_POWER_QPLUS_PHASE_A: APPARENT_POWER_QPLUS_PHASE_A,
        APPARENT_POWER_QPLUS_PHASE_B: APPARENT_POWER_QPLUS_PHASE_B,
        APPARENT_POWER_QPLUS_PHASE_C: APPARENT_POWER_QPLUS_PHASE_C,
        APPARENT_POWER_QPLUS_SUM: APPARENT_POWER_QPLUS_SUM,
        BATTERY_VOLTAGE: BATTERY_VOLTAGE,
        CURRENT_BALANCE: CURRENT_BALANCE,
        CURRENT_IN_NEUTRAL: CURRENT_IN_NEUTRAL,
        CURRENT_IN_PHASE_A: CURRENT_IN_PHASE_A,
        CURRENT_IN_PHASE_B: CURRENT_IN_PHASE_B,
        CURRENT_IN_PHASE_C: CURRENT_IN_PHASE_C,
        CURRENT_TRANSFORMATION_RATIO: CURRENT_TRANSFORMATION_RATIO,
        DATE_MONTH_YEAR: DATE_MONTH_YEAR,
        EXPORTED_ACTIVE_ENERGY_T1: EXPORTED_ACTIVE_ENERGY_T1,
        EXPORTED_ACTIVE_ENERGY_T2: EXPORTED_ACTIVE_ENERGY_T2,
        EXPORTED_ACTIVE_ENERGY_T3: EXPORTED_ACTIVE_ENERGY_T3,
        EXPORTED_ACTIVE_ENERGY_T4: EXPORTED_ACTIVE_ENERGY_T4,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4,
        EXPORTED_REACTIVE_ENERGY_T1: EXPORTED_REACTIVE_ENERGY_T1,
        EXPORTED_REACTIVE_ENERGY_T2: EXPORTED_REACTIVE_ENERGY_T2,
        EXPORTED_REACTIVE_ENERGY_T3: EXPORTED_REACTIVE_ENERGY_T3,
        EXPORTED_REACTIVE_ENERGY_T4: EXPORTED_REACTIVE_ENERGY_T4,
        FREQUENCY: FREQUENCY,
        HOUR_MINUTE_SECOND: HOUR_MINUTE_SECOND,
        MAGNET_INDUCTION: MAGNET_INDUCTION,
        MAX_ACTIVE_POWER_DAY_T1: MAX_ACTIVE_POWER_DAY_T1,
        MAX_ACTIVE_POWER_DAY_T2: MAX_ACTIVE_POWER_DAY_T2,
        MAX_ACTIVE_POWER_DAY_T3: MAX_ACTIVE_POWER_DAY_T3,
        MAX_ACTIVE_POWER_DAY_T4: MAX_ACTIVE_POWER_DAY_T4,
        MAX_ACTIVE_POWER_MONTH_T1: MAX_ACTIVE_POWER_MONTH_T1,
        MAX_ACTIVE_POWER_MONTH_T2: MAX_ACTIVE_POWER_MONTH_T2,
        MAX_ACTIVE_POWER_MONTH_T3: MAX_ACTIVE_POWER_MONTH_T3,
        MAX_ACTIVE_POWER_MONTH_T4: MAX_ACTIVE_POWER_MONTH_T4,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T1: MAX_EXPORTED_ACTIVE_POWER_DAY_T1,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T2: MAX_EXPORTED_ACTIVE_POWER_DAY_T2,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T3: MAX_EXPORTED_ACTIVE_POWER_DAY_T3,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T4: MAX_EXPORTED_ACTIVE_POWER_DAY_T4,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: MAX_EXPORTED_ACTIVE_POWER_MONTH_T1,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: MAX_EXPORTED_ACTIVE_POWER_MONTH_T2,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: MAX_EXPORTED_ACTIVE_POWER_MONTH_T3,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: MAX_EXPORTED_ACTIVE_POWER_MONTH_T4,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T1: MAX_EXPORTED_REACTIVE_POWER_DAY_T1,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T2: MAX_EXPORTED_REACTIVE_POWER_DAY_T2,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T3: MAX_EXPORTED_REACTIVE_POWER_DAY_T3,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T4: MAX_EXPORTED_REACTIVE_POWER_DAY_T4,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: MAX_EXPORTED_REACTIVE_POWER_MONTH_T1,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: MAX_EXPORTED_REACTIVE_POWER_MONTH_T2,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: MAX_EXPORTED_REACTIVE_POWER_MONTH_T3,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: MAX_EXPORTED_REACTIVE_POWER_MONTH_T4,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: MAX_NEGATIVE_REACTIVE_POWER_DAY_T1,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: MAX_NEGATIVE_REACTIVE_POWER_DAY_T2,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: MAX_NEGATIVE_REACTIVE_POWER_DAY_T3,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: MAX_NEGATIVE_REACTIVE_POWER_DAY_T4,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4,
        MAX_REACTIVE_POWER_DAY_T1: MAX_REACTIVE_POWER_DAY_T1,
        MAX_REACTIVE_POWER_DAY_T2: MAX_REACTIVE_POWER_DAY_T2,
        MAX_REACTIVE_POWER_DAY_T3: MAX_REACTIVE_POWER_DAY_T3,
        MAX_REACTIVE_POWER_DAY_T4: MAX_REACTIVE_POWER_DAY_T4,
        MAX_REACTIVE_POWER_MONTH_T1: MAX_REACTIVE_POWER_MONTH_T1,
        MAX_REACTIVE_POWER_MONTH_T2: MAX_REACTIVE_POWER_MONTH_T2,
        MAX_REACTIVE_POWER_MONTH_T3: MAX_REACTIVE_POWER_MONTH_T3,
        MAX_REACTIVE_POWER_MONTH_T4: MAX_REACTIVE_POWER_MONTH_T4,
        NEGATIVE_REACTIVE_ENERGY_T1: NEGATIVE_REACTIVE_ENERGY_T1,
        NEGATIVE_REACTIVE_ENERGY_T2: NEGATIVE_REACTIVE_ENERGY_T2,
        NEGATIVE_REACTIVE_ENERGY_T3: NEGATIVE_REACTIVE_ENERGY_T3,
        NEGATIVE_REACTIVE_ENERGY_T4: NEGATIVE_REACTIVE_ENERGY_T4,
        OPTOPORT_SPEED: OPTOPORT_SPEED,
        POWER_COEFFICIENT_PHASE_A: POWER_COEFFICIENT_PHASE_A,
        POWER_COEFFICIENT_PHASE_B: POWER_COEFFICIENT_PHASE_B,
        POWER_COEFFICIENT_PHASE_C: POWER_COEFFICIENT_PHASE_C,
        POWER_COEFFICIENT_SUM: POWER_COEFFICIENT_SUM,
        POWER_THRESHOLD_T1: POWER_THRESHOLD_T1,
        POWER_THRESHOLD_T2: POWER_THRESHOLD_T2,
        POWER_THRESHOLD_T3: POWER_THRESHOLD_T3,
        POWER_THRESHOLD_T4: POWER_THRESHOLD_T4,
        REACTIVE_ENERGY_T1: REACTIVE_ENERGY_T1,
        REACTIVE_ENERGY_T2: REACTIVE_ENERGY_T2,
        REACTIVE_ENERGY_T3: REACTIVE_ENERGY_T3,
        REACTIVE_ENERGY_T4: REACTIVE_ENERGY_T4,
        REACTIVE_POWER_QMINUS_PHASE_A: REACTIVE_POWER_QMINUS_PHASE_A,
        REACTIVE_POWER_QMINUS_PHASE_B: REACTIVE_POWER_QMINUS_PHASE_B,
        REACTIVE_POWER_QMINUS_PHASE_C: REACTIVE_POWER_QMINUS_PHASE_C,
        REACTIVE_POWER_QMINUS_SUM: REACTIVE_POWER_QMINUS_SUM,
        REACTIVE_POWER_QPLUS_PHASE_A: REACTIVE_POWER_QPLUS_PHASE_A,
        REACTIVE_POWER_QPLUS_PHASE_B: REACTIVE_POWER_QPLUS_PHASE_B,
        REACTIVE_POWER_QPLUS_PHASE_C: REACTIVE_POWER_QPLUS_PHASE_C,
        REACTIVE_POWER_QPLUS_SUM: REACTIVE_POWER_QPLUS_SUM,
        SET_ALL_SEGMENT_DISPLAY: SET_ALL_SEGMENT_DISPLAY,
        SOFTWARE_VERSION: SOFTWARE_VERSION,
        TOTAL_ACTIVE_ENERGY: TOTAL_ACTIVE_ENERGY,
        TOTAL_EXPORTED_ACTIVE_ENERGY: TOTAL_EXPORTED_ACTIVE_ENERGY,
        TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY,
        TOTAL_EXPORTED_REACTIVE_ENERGY: TOTAL_EXPORTED_REACTIVE_ENERGY,
        TOTAL_NEGATIVE_REACTIVE_ENERGY: TOTAL_NEGATIVE_REACTIVE_ENERGY,
        TOTAL_REACTIVE_ENERGY: TOTAL_REACTIVE_ENERGY,
        VOLTAGE_IN_PHASE_A: VOLTAGE_IN_PHASE_A,
        VOLTAGE_IN_PHASE_B: VOLTAGE_IN_PHASE_B,
        VOLTAGE_IN_PHASE_C: VOLTAGE_IN_PHASE_C,
        VOLTAGE_TRANSFORMATION_RATIO: VOLTAGE_TRANSFORMATION_RATIO
    });

    invertObject(screenIds);

    const errorResponse$1 = 0xfe;

    var uplinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$1,
        errorResponse: errorResponse$1,
        getBuildVersion: getBuildVersion$1,
        getCorrectTime: getCorrectTime$1,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$1,
        getCurrentValues: getCurrentValues$1,
        getDateTime: getDateTime$1,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayMaxDemand: getDayMaxDemand$1,
        getDayMaxDemandExport: getDayMaxDemandExport$1,
        getDayProfile: getDayProfile$1,
        getDemand: getDemand$2,
        getDeviceId: getDeviceId$1,
        getDeviceType: getDeviceType$1,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$1,
        getEvents: getEvents$1,
        getEventsCounters: getEventsCounters$1,
        getExtendedCurrentValues: getExtendedCurrentValues$1,
        getHalfHourDemand: getHalfHourDemand$1,
        getHalfHourDemandChannel: getHalfHourDemandChannel$2,
        getHalfHourDemandExport: getHalfHourDemandExport$1,
        getHalfHourDemandVare: getHalfHourDemandVare$2,
        getHalfHourDemandVareExport: getHalfHourDemandVareExport$2,
        getHalfHourDemandVari: getHalfHourDemandVari$2,
        getHalfHourDemandVariExport: getHalfHourDemandVariExport$2,
        getHalfhoursEnergies: getHalfhoursEnergies$1,
        getMagneticFieldThreshold: getMagneticFieldThreshold$1,
        getMeterInfo: getMeterInfo$1,
        getMonthDemand: getMonthDemand$1,
        getMonthDemandExport: getMonthDemandExport$1,
        getMonthMaxDemand: getMonthMaxDemand$1,
        getMonthMaxDemandExport: getMonthMaxDemandExport$1,
        getOperatorParameters: getOperatorParameters$1,
        getOperatorParametersExtended: getOperatorParametersExtended$2,
        getOperatorParametersExtended2: getOperatorParametersExtended2$2,
        getOperatorParametersExtended3: getOperatorParametersExtended3$1,
        getRatePlanInfo: getRatePlanInfo$1,
        getSaldo: getSaldo$1,
        getSaldoParameters: getSaldoParameters$1,
        getSeasonProfile: getSeasonProfile$1,
        getSpecialDay: getSpecialDay$1,
        getVersion: getVersion$1,
        prepareRatePlan: prepareRatePlan$1,
        resetPowerMaxDay: resetPowerMaxDay$1,
        resetPowerMaxMonth: resetPowerMaxMonth$1,
        runTariffPlan: runTariffPlan$1,
        setAccessKey: setAccessKey$1,
        setCorrectDateTime: setCorrectDateTime$1,
        setCorrectTime: setCorrectTime$1,
        setDateTime: setDateTime$1,
        setDayProfile: setDayProfile$1,
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$2,
        setOperatorParametersExtended: setOperatorParametersExtended$2,
        setOperatorParametersExtended2: setOperatorParametersExtended2$2,
        setOperatorParametersExtended3: setOperatorParametersExtended3$1,
        setOperatorParametersExtended4: setOperatorParametersExtended4$2,
        setSaldo: setSaldo$1,
        setSaldoParameters: setSaldoParameters$1,
        setSeasonProfile: setSeasonProfile$1,
        setSpecialDay: setSpecialDay$1,
        setSpecialOperation: setSpecialOperation$1,
        turnRelayOff: turnRelayOff$1,
        turnRelayOn: turnRelayOn$1
    });

    var commandNames = invertObject(uplinkIds);

    const RATE_2400 = 2400;
    const RATE_9600 = 9600;
    const valueToRate = {
        plc: {
            0: RATE_9600,
            2: RATE_2400,
            4: RATE_9600
        },
        optoport: {
            0: RATE_2400,
            2: RATE_2400,
            4: RATE_9600
        }
    };
    const rateToValue = {
        plc: invertObject(valueToRate.plc),
        optoport: invertObject(valueToRate.optoport)
    };

    const A_PLUS_R_PLUS_R_MINUS = 1;
    const A_MINUS_R_PLUS_R_MINUS = 2;

    const id$1t = getCriticalEvent$2;
    const name$1t = commandNames$1[getCriticalEvent$2];
    const headerSize$1t = 2;
    const accessLevel$1t = READ_ONLY;
    const maxSize$1t = 2;
    const isLoraOnly$1t = false;
    const examples$1t = {
        'simple request': {
            id: id$1t,
            name: name$1t,
            headerSize: headerSize$1t,
            accessLevel: accessLevel$1t,
            maxSize: maxSize$1t,
            parameters: {
                event: 1,
                index: 22
            },
            bytes: [
                0x56, 0x02,
                0x01, 0x16
            ]
        }
    };
    const fromBytes$1t = (bytes) => {
        if (bytes.length !== maxSize$1t) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const [event, index] = bytes;
        return { event, index };
    };
    const toBytes$1t = (parameters) => (toBytes$2f(id$1t, [parameters.event, parameters.index]));

    var getCriticalEvent$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1t,
        examples: examples$1t,
        fromBytes: fromBytes$1t,
        headerSize: headerSize$1t,
        id: id$1t,
        isLoraOnly: isLoraOnly$1t,
        maxSize: maxSize$1t,
        name: name$1t,
        toBytes: toBytes$1t
    });

    const OPERATOR_PARAMETERS_SIZE = 95;
    const OPERATOR_PARAMETERS_EXTENDED_SIZE = 9;
    const OPERATOR_PARAMETERS_EXTENDED2_SIZE = 28;
    const OPERATOR_PARAMETERS_EXTENDED4_SIZE = 28;
    const PACKED_ENERGY_TYPE_SIZE = 1;
    const ENERGY_TYPE_BITS = 4;
    const displaySet1Mask = {
        SET_ALL_SEGMENT_DISPLAY: 1 << 0,
        SOFTWARE_VERSION: 1 << 1,
        TOTAL_ACTIVE_ENERGY: 1 << 2,
        ACTIVE_ENERGY_T1: 1 << 3,
        ACTIVE_ENERGY_T2: 1 << 4,
        ACTIVE_ENERGY_T3: 1 << 5,
        ACTIVE_ENERGY_T4: 1 << 6,
        TOTAL_REACTIVE_ENERGY: 1 << 7,
        REACTIVE_ENERGY_T1: 1 << 8,
        REACTIVE_ENERGY_T2: 1 << 9,
        REACTIVE_ENERGY_T3: 1 << 10,
        REACTIVE_ENERGY_T4: 1 << 11,
        TOTAL_NEGATIVE_REACTIVE_ENERGY: 1 << 12,
        NEGATIVE_REACTIVE_ENERGY_T1: 1 << 13,
        NEGATIVE_REACTIVE_ENERGY_T2: 1 << 14,
        NEGATIVE_REACTIVE_ENERGY_T3: 1 << 15,
        NEGATIVE_REACTIVE_ENERGY_T4: 1 << 16,
        TOTAL_EXPORTED_ACTIVE_ENERGY: 1 << 17,
        EXPORTED_ACTIVE_ENERGY_T1: 1 << 18,
        EXPORTED_ACTIVE_ENERGY_T2: 1 << 19,
        EXPORTED_ACTIVE_ENERGY_T3: 1 << 20,
        EXPORTED_ACTIVE_ENERGY_T4: 1 << 21,
        TOTAL_EXPORTED_REACTIVE_ENERGY: 1 << 22,
        EXPORTED_REACTIVE_ENERGY_T1: 1 << 23,
        EXPORTED_REACTIVE_ENERGY_T2: 1 << 24,
        EXPORTED_REACTIVE_ENERGY_T3: 1 << 25,
        EXPORTED_REACTIVE_ENERGY_T4: 1 << 26,
        TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: 1 << 27,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: 1 << 28,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: 1 << 29,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: 1 << 30,
        EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: 1 << 31
    };
    const displaySet2Mask = {
        CURRENT_IN_PHASE_A: 1 << 0,
        CURRENT_IN_PHASE_B: 1 << 1,
        CURRENT_IN_PHASE_C: 1 << 2,
        CURRENT_IN_NEUTRAL: 1 << 3,
        VOLTAGE_IN_PHASE_A: 1 << 4,
        VOLTAGE_IN_PHASE_B: 1 << 5,
        VOLTAGE_IN_PHASE_C: 1 << 6,
        BATTERY_VOLTAGE: 1 << 7,
        FREQUENCY: 1 << 8,
        ACTIVE_POWER_SUM: 1 << 9,
        ACTIVE_POWER_PHASE_A: 1 << 10,
        ACTIVE_POWER_PHASE_B: 1 << 11,
        ACTIVE_POWER_PHASE_C: 1 << 12,
        REACTIVE_POWER_QPLUS_SUM: 1 << 13,
        REACTIVE_POWER_QPLUS_PHASE_A: 1 << 14,
        REACTIVE_POWER_QPLUS_PHASE_B: 1 << 15,
        REACTIVE_POWER_QPLUS_PHASE_C: 1 << 16,
        REACTIVE_POWER_QMINUS_SUM: 1 << 17,
        REACTIVE_POWER_QMINUS_PHASE_A: 1 << 18,
        REACTIVE_POWER_QMINUS_PHASE_B: 1 << 19,
        REACTIVE_POWER_QMINUS_PHASE_C: 1 << 20,
        POWER_COEFFICIENT_SUM: 1 << 21,
        POWER_COEFFICIENT_PHASE_A: 1 << 22,
        POWER_COEFFICIENT_PHASE_B: 1 << 23,
        POWER_COEFFICIENT_PHASE_C: 1 << 24,
        APPARENT_POWER_QPLUS_SUM: 1 << 25,
        APPARENT_POWER_QPLUS_PHASE_A: 1 << 26,
        APPARENT_POWER_QPLUS_PHASE_B: 1 << 27,
        APPARENT_POWER_QPLUS_PHASE_C: 1 << 28,
        APPARENT_POWER_QMINUS_SUM: 1 << 29,
        APPARENT_POWER_QMINUS_PHASE_A: 1 << 30,
        APPARENT_POWER_QMINUS_PHASE_B: 1 << 31
    };
    const displaySet3Mask = {
        APPARENT_POWER_QMINUS_PHASE_C: 1 << 0,
        MAX_ACTIVE_POWER_DAY_T1: 1 << 1,
        MAX_ACTIVE_POWER_DAY_T2: 1 << 2,
        MAX_ACTIVE_POWER_DAY_T3: 1 << 3,
        MAX_ACTIVE_POWER_DAY_T4: 1 << 4,
        MAX_ACTIVE_POWER_MONTH_T1: 1 << 5,
        MAX_ACTIVE_POWER_MONTH_T2: 1 << 6,
        MAX_ACTIVE_POWER_MONTH_T3: 1 << 7,
        MAX_ACTIVE_POWER_MONTH_T4: 1 << 8,
        MAX_REACTIVE_POWER_DAY_T1: 1 << 9,
        MAX_REACTIVE_POWER_DAY_T2: 1 << 10,
        MAX_REACTIVE_POWER_DAY_T3: 1 << 11,
        MAX_REACTIVE_POWER_DAY_T4: 1 << 12,
        MAX_REACTIVE_POWER_MONTH_T1: 1 << 13,
        MAX_REACTIVE_POWER_MONTH_T2: 1 << 14,
        MAX_REACTIVE_POWER_MONTH_T3: 1 << 15,
        MAX_REACTIVE_POWER_MONTH_T4: 1 << 16,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: 1 << 17,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: 1 << 18,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: 1 << 19,
        MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: 1 << 20,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: 1 << 21,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: 1 << 22,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: 1 << 23,
        MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: 1 << 24,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T1: 1 << 25,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T2: 1 << 26,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T3: 1 << 27,
        MAX_EXPORTED_ACTIVE_POWER_DAY_T4: 1 << 28,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: 1 << 29,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: 1 << 30,
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: 1 << 31
    };
    const displaySet4Mask = {
        MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: 1 << 0,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T1: 1 << 1,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T2: 1 << 2,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T3: 1 << 3,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T4: 1 << 4,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: 1 << 5,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: 1 << 6,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: 1 << 7,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: 1 << 8,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: 1 << 9,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: 1 << 10,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: 1 << 11,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: 1 << 12,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: 1 << 13,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: 1 << 14,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: 1 << 15,
        MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: 1 << 16,
        HOUR_MINUTE_SECOND: 1 << 17,
        DATE_MONTH_YEAR: 1 << 18,
        CURRENT_TRANSFORMATION_RATIO: 1 << 19,
        VOLTAGE_TRANSFORMATION_RATIO: 1 << 20,
        CURRENT_BALANCE: 1 << 21,
        POWER_THRESHOLD_T1: 1 << 22,
        POWER_THRESHOLD_T2: 1 << 23,
        POWER_THRESHOLD_T3: 1 << 24,
        POWER_THRESHOLD_T4: 1 << 25,
        OPTOPORT_SPEED: 1 << 26,
        MAGNET_INDUCTION: 1 << 27,
        SORT_DISPLAY_SCREENS: 1 << 29,
        TURN_OFF_DISPLAY: 1 << 30,
        AUTO_SCREEN_SCROLLING: 1 << 31
    };
    const displaySet5Mask = {
        EVENT: 1 << 0,
        PROFILE_P01: 1 << 1,
        PROFILE_P02: 1 << 2,
        PROFILE_P03: 1 << 3,
        PROFILE_P04: 1 << 4,
        PROFILE_P05: 1 << 5,
        PROFILE_P06: 1 << 6
    };
    const relaySetMask = {
        RELAY_ON_Y: 1 << 0,
        RELAY_ON_CENTER: 1 << 1,
        RELAY_ON_PB: 1 << 2,
        RELAY_ON_TARIFF_0: 1 << 3,
        RELAY_ON_TARIFF_1: 1 << 4,
        RELAY_ON_TARIFF_2: 1 << 5,
        RELAY_ON_TARIFF_3: 1 << 6,
        RELAY_ON_V_GOOD: 1 << 7,
        RELAY_OFF_Y: 1 << 8,
        RELAY_OFF_CENTER: 1 << 9,
        RELAY_OFF_TARIFF_0: 1 << 10,
        RELAY_OFF_TARIFF_1: 1 << 11,
        RELAY_OFF_TARIFF_2: 1 << 12,
        RELAY_OFF_TARIFF_3: 1 << 13,
        RELAY_OFF_I_LIMIT: 1 << 14,
        RELAY_OFF_V_BAD: 1 << 15,
        RELAY_OFF_DIFF_BAD: 1 << 16,
        RELAY_OFF_LIM_TARIFF_0: 1 << 17,
        RELAY_OFF_LIM_TARIFF_1: 1 << 18,
        RELAY_OFF_LIM_TARIFF_2: 1 << 19,
        RELAY_OFF_LIM_TARIFF_3: 1 << 20,
        RELAY_OFF_LIM_VAR_TARIFF_0: 1 << 21,
        RELAY_OFF_LIM_VAR_TARIFF_1: 1 << 22,
        RELAY_OFF_LIM_VAR_TARIFF_2: 1 << 23,
        RELAY_OFF_LIM_VAR_TARIFF_3: 1 << 24,
        RELAY_ON_PF_MIN: 1 << 25,
        RELAY_OFF_PF_MIN: 1 << 26,
        RELAY_ON_TIMEOUT: 1 << 27,
        RELAY_ON_SALDO: 1 << 28,
        RELAY_OFF_SALDO: 1 << 29,
        RELAY_OFF_SALDO_SOFT: 1 << 30
    };
    const typeMeterMask = {
        TRANSFORMATION_RATIO: 1 << 0,
        METER_TYPE_R: 1 << 4,
        ACCUMULATE_BY_R_PLUS_MINUS: 1 << 7
    };
    const define1Mask = {
        RESET_DAY_MAX_POWER_KEY: 1 << 0,
        RESET_MONTH_MAX_POWER_KEY: 1 << 1,
        BLOCK_KEY_OPTOPORT: 1 << 2,
        MAGNET_SCREEN_CONST: 1 << 5,
        ALLOW_BROWNOUT_INDICATION: 1 << 7
    };
    const displaySet24Mask = {
        OPTOPORT_SPEED: 1 << 26
    };
    const relaySetExtMask = {
        RELAY_OFF_MAGNET: 1 << 0,
        RELAY_ON_MAGNET_TIMEOUT: 1 << 1,
        RELAY_ON_MAGNET_AUTO: 1 << 2
    };
    const getSpeedOptoPort = (value) => ({
        plc: valueToRate.plc[extractBits(value, 4, 1)],
        optoport: valueToRate.optoport[extractBits(value, 4, 5)]
    });
    const setSpeedOptoPort = (speedOptoPort) => {
        let result = 0;
        result = fillBits(result, 4, 1, Number(rateToValue.plc[speedOptoPort.plc]));
        result = fillBits(result, 4, 5, Number(rateToValue.optoport[speedOptoPort.optoport]));
        return result;
    };
    function getPackedEnergies(buffer, energyType, tariffMapByte) {
        const byte = tariffMapByte >> ENERGY_TYPE_BITS;
        const wh = [];
        const vari = [];
        const vare = [];
        for (let index = 0; index < TARIFF_NUMBER$1; index++) {
            const isTariffExists = !!extractBits(byte, 1, index + 1);
            if (isTariffExists) {
                wh.push(buffer.getInt32());
                vari.push(buffer.getInt32());
                vare.push(buffer.getInt32());
            }
            else {
                wh.push(null);
                vari.push(null);
                vare.push(null);
            }
        }
        return { wh, vari, vare };
    }
    function getPackedEnergyType(energyType, energies) {
        const { wh, vari, vare } = energies;
        const indexShift = 1 + ENERGY_TYPE_BITS;
        let tariffsByte = energyType;
        for (let index = 0; index < TARIFF_NUMBER$1; index++) {
            tariffsByte = fillBits(tariffsByte, 1, index + indexShift, Number(!!wh[index] && !!vari[index] && !!vare[index]));
        }
        return tariffsByte;
    }
    function CommandBinaryBuffer(dataOrLength, isLittleEndian = false) {
        CommandBinaryBuffer$2.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(CommandBinaryBuffer$2.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.getDefaultOperatorParameters = () => ({
        vpThreshold: 265000,
        vThreshold: 156000,
        ipThreshold: 120000,
        pmaxThreshold0: 31800,
        pmaxThreshold1: 31800,
        pmaxThreshold2: 31800,
        pmaxThreshold3: 31800,
        rmaxThreshold0: 31800,
        rmaxThreshold1: 31800,
        rmaxThreshold2: 31800,
        rmaxThreshold3: 31800,
        tint: 30,
        calcPeriodDate: 1,
        timeoutDisplay: 127,
        timeoutScreen: 7,
        displaySet1: toObject(displaySet1Mask, 4229),
        displaySet2: toObject(displaySet2Mask, 139776),
        displaySet3: toObject(displaySet3Mask, 0),
        relaySet: toObject(relaySetMask, 771),
        speedOptoPort: getSpeedOptoPort(64),
        ten: 30,
        tu: 30,
        timeIntervalPowerOff: 3,
        reserved: 0,
        timeoutBadVAVB: 5,
        freqMax: 55,
        freqMin: 45,
        year: 0,
        month: 0,
        date: 0,
        energyDecimalPoint: 2,
        voltageTransformationRatioNumerator: 1,
        voltageTransformationRatioDenominator: 1,
        currentTransformationRatioNumerator: 1,
        currentTransformationRatioDenominator: 1,
        typeMeter: toObject(typeMeterMask, 0),
        phMin: 0,
        timeoutIMax: 5,
        timeoutPMax: 5,
        timeoutCos: 5,
        pMaxDef: 1,
        displaySet4: toObject(displaySet4Mask, 2147876864)
    });
    CommandBinaryBuffer.prototype.getOperatorParameters = function () {
        return {
            vpThreshold: this.getUint32(),
            vThreshold: this.getUint32(),
            ipThreshold: this.getUint32(),
            pmaxThreshold0: this.getUint32(),
            pmaxThreshold1: this.getUint32(),
            pmaxThreshold2: this.getUint32(),
            pmaxThreshold3: this.getUint32(),
            rmaxThreshold0: this.getUint32(),
            rmaxThreshold1: this.getUint32(),
            rmaxThreshold2: this.getUint32(),
            rmaxThreshold3: this.getUint32(),
            tint: this.getUint8(),
            calcPeriodDate: this.getUint8(),
            timeoutDisplay: this.getUint8(),
            timeoutScreen: this.getUint8(),
            displaySet1: toObject(displaySet1Mask, this.getUint32()),
            displaySet2: toObject(displaySet2Mask, this.getUint32()),
            displaySet3: toObject(displaySet3Mask, this.getUint32()),
            relaySet: toObject(relaySetMask, this.getUint32()),
            speedOptoPort: getSpeedOptoPort(this.getUint8()),
            ten: this.getUint8(),
            tu: this.getUint8(),
            timeIntervalPowerOff: this.getUint8(),
            reserved: this.getUint8(),
            timeoutBadVAVB: this.getUint8(),
            freqMax: this.getUint8(),
            freqMin: this.getUint8(),
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8(),
            energyDecimalPoint: this.getUint8(),
            voltageTransformationRatioNumerator: this.getUint16(),
            voltageTransformationRatioDenominator: this.getUint16(),
            currentTransformationRatioNumerator: this.getUint16(),
            currentTransformationRatioDenominator: this.getUint16(),
            typeMeter: toObject(typeMeterMask, this.getUint8()),
            phMin: this.getUint16(),
            timeoutIMax: this.getUint8(),
            timeoutPMax: this.getUint8(),
            timeoutCos: this.getUint8(),
            pMaxDef: this.getUint8(),
            displaySet4: toObject(displaySet4Mask, this.getUint32())
        };
    };
    CommandBinaryBuffer.prototype.setOperatorParameters = function (operatorParameters) {
        this.setUint32(operatorParameters.vpThreshold);
        this.setUint32(operatorParameters.vThreshold);
        this.setUint32(operatorParameters.ipThreshold);
        this.setUint32(operatorParameters.pmaxThreshold0);
        this.setUint32(operatorParameters.pmaxThreshold1);
        this.setUint32(operatorParameters.pmaxThreshold2);
        this.setUint32(operatorParameters.pmaxThreshold3);
        this.setUint32(operatorParameters.rmaxThreshold0);
        this.setUint32(operatorParameters.rmaxThreshold1);
        this.setUint32(operatorParameters.rmaxThreshold2);
        this.setUint32(operatorParameters.rmaxThreshold3);
        this.setUint8(operatorParameters.tint);
        this.setUint8(operatorParameters.calcPeriodDate);
        this.setUint8(operatorParameters.timeoutDisplay);
        this.setUint8(operatorParameters.timeoutScreen);
        this.setUint32(fromObject(displaySet1Mask, operatorParameters.displaySet1));
        this.setUint32(fromObject(displaySet2Mask, operatorParameters.displaySet2));
        this.setUint32(fromObject(displaySet3Mask, operatorParameters.displaySet3));
        this.setUint32(fromObject(relaySetMask, operatorParameters.relaySet));
        this.setUint8(setSpeedOptoPort(operatorParameters.speedOptoPort));
        this.setUint8(operatorParameters.ten);
        this.setUint8(operatorParameters.tu);
        this.setUint8(operatorParameters.timeIntervalPowerOff);
        this.setUint8(operatorParameters.reserved);
        this.setUint8(operatorParameters.timeoutBadVAVB);
        this.setUint8(operatorParameters.freqMax);
        this.setUint8(operatorParameters.freqMin);
        this.setUint8(operatorParameters.year);
        this.setUint8(operatorParameters.month);
        this.setUint8(operatorParameters.date);
        this.setUint8(operatorParameters.energyDecimalPoint);
        this.setUint16(operatorParameters.voltageTransformationRatioNumerator);
        this.setUint16(operatorParameters.voltageTransformationRatioDenominator);
        this.setUint16(operatorParameters.currentTransformationRatioNumerator);
        this.setUint16(operatorParameters.currentTransformationRatioDenominator);
        this.setUint8(fromObject(typeMeterMask, operatorParameters.typeMeter));
        this.setUint16(operatorParameters.phMin);
        this.setUint8(operatorParameters.timeoutIMax);
        this.setUint8(operatorParameters.timeoutPMax);
        this.setUint8(operatorParameters.timeoutCos);
        this.setUint8(operatorParameters.pMaxDef);
        this.setUint32(fromObject(displaySet4Mask, operatorParameters.displaySet4));
    };
    CommandBinaryBuffer.prototype.getOperatorParametersExtended = function () {
        return {
            timeoutRelayOn: this.getUint8(),
            define1: toObject(define1Mask, this.getUint8()),
            timeoutRelayKey: this.getUint8(),
            timeoutRelayAuto: this.getUint8()
        };
    };
    CommandBinaryBuffer.prototype.setOperatorParametersExtended = function (operatorParametersExtended) {
        this.setUint8(operatorParametersExtended.timeoutRelayOn);
        this.setUint8(fromObject(define1Mask, operatorParametersExtended.define1));
        this.setUint8(operatorParametersExtended.timeoutRelayKey);
        this.setUint8(operatorParametersExtended.timeoutRelayAuto);
        this.setUint32(0);
        this.setUint8(0);
    };
    CommandBinaryBuffer.prototype.getEnergies = function () {
        const wh = [];
        const vari = [];
        const vare = [];
        for (let index = 0; index < TARIFF_NUMBER$1; index++) {
            wh.push(this.getInt32());
            vari.push(this.getInt32());
            vare.push(this.getInt32());
        }
        return { wh, vari, vare };
    };
    CommandBinaryBuffer.prototype.setEnergies = function (parameters) {
        for (let index = 0; index < TARIFF_NUMBER$1; index++) {
            this.setInt32(parameters.wh[index]);
            this.setInt32(parameters.vari[index]);
            this.setInt32(parameters.vare[index]);
        }
    };
    CommandBinaryBuffer.prototype.getPackedEnergyWithType = function () {
        const byte = this.getUint8();
        const energyType = extractBits(byte, ENERGY_TYPE_BITS, 1);
        const energies = getPackedEnergies(this, energyType, byte);
        return {
            energyType,
            energies
        };
    };
    CommandBinaryBuffer.prototype.setPackedEnergyWithType = function ({ energyType, energies }) {
        if (energyType) {
            const energyTypeByte = getPackedEnergyType(energyType, energies);
            const tariffsByte = energyTypeByte >> ENERGY_TYPE_BITS;
            this.setUint8(energyTypeByte);
            for (let index = 0; index < TARIFF_NUMBER$1; index++) {
                const isTariffExists = !!extractBits(tariffsByte, 1, index + 1);
                if (isTariffExists) {
                    this.setInt32(energies.wh[index]);
                    this.setInt32(energies.vari[index]);
                    this.setInt32(energies.vare[index]);
                }
            }
            return;
        }
        for (let index = 0; index < TARIFF_NUMBER$1; index++) {
            this.setInt32(energies.wh[index]);
            this.setInt32(energies.vari[index]);
            this.setInt32(energies.vare[index]);
        }
    };
    CommandBinaryBuffer.prototype.getEnergyPeriods = function (energiesNumber) {
        return new Array(energiesNumber).fill(0).map(() => {
            const energy = this.getUint16();
            return energy === 0xffff ? undefined : energy;
        });
    };
    CommandBinaryBuffer.prototype.setEnergyPeriods = function (energies) {
        energies.forEach(energy => this.setUint16(energy === undefined ? 0xffff : energy));
    };
    CommandBinaryBuffer.prototype.getMaxDemand = function () {
        return {
            hourPmax: this.getUint8(),
            minPmax: this.getUint8(),
            pmax: this.getInt32(),
            hourVariMax: this.getUint8(),
            minVariMax: this.getUint8(),
            variMax: this.getInt32(),
            hourVareMax: this.getUint8(),
            minVareMax: this.getUint8(),
            vareMax: this.getInt32()
        };
    };
    CommandBinaryBuffer.prototype.setMaxDemand = function (maxDemand) {
        this.setUint8(maxDemand.hourPmax);
        this.setUint8(maxDemand.minPmax);
        this.setInt32(maxDemand.pmax);
        this.setUint8(maxDemand.hourVariMax);
        this.setUint8(maxDemand.minVariMax);
        this.setInt32(maxDemand.variMax);
        this.setUint8(maxDemand.hourVareMax);
        this.setUint8(maxDemand.minVareMax);
        this.setInt32(maxDemand.vareMax);
    };
    CommandBinaryBuffer.prototype.getDayMaxDemandResponse = function () {
        const date = this.getDate();
        const maxDemands = new Array(TARIFF_NUMBER$1).fill(0).map(() => this.getMaxDemand());
        return { date, maxDemands };
    };
    CommandBinaryBuffer.prototype.setDayMaxDemandResponse = function (parameters) {
        this.setDate(parameters.date);
        parameters.maxDemands.forEach(value => this.setMaxDemand(value));
    };
    CommandBinaryBuffer.prototype.getMonthMaxDemandResponse = function () {
        const date = {
            year: this.getUint8(),
            month: this.getUint8()
        };
        const maxDemands = new Array(TARIFF_NUMBER$1).fill(0).map(() => this.getMaxDemand());
        return { date, maxDemands };
    };
    CommandBinaryBuffer.prototype.setMonthMaxDemandResponse = function (parameters) {
        this.setUint8(parameters.date.year);
        this.setUint8(parameters.date.month);
        parameters.maxDemands.forEach(value => this.setMaxDemand(value));
    };
    CommandBinaryBuffer.prototype.getEvent = function () {
        const data = {
            hours: this.getUint8(),
            minutes: this.getUint8(),
            seconds: this.getUint8(),
            event: this.getUint8()
        };
        const { event } = data;
        const { bytesLeft } = this;
        data.eventName = eventNames[event];
        switch (event) {
            case POWER_OVER_RELAY_OFF:
                if (bytesLeft < 4) {
                    return data;
                }
                data.power = [this.getUint8(), this.getUint8(), this.getUint8(), this.getUint8()];
                break;
            case CMD_CHANGE_TIME:
            case TIME_CORRECT:
                if (bytesLeft < 8) {
                    return data;
                }
                data.newDate = this.getDateTime();
                break;
        }
        return data;
    };
    CommandBinaryBuffer.prototype.setEvent = function (event) {
        this.setUint8(event.hours);
        this.setUint8(event.minutes);
        this.setUint8(event.seconds);
        this.setUint8(event.event);
        switch (event.event) {
            case POWER_OVER_RELAY_OFF:
                for (const item of event.power) {
                    this.setUint8(item);
                }
                break;
            case CMD_CHANGE_TIME:
            case TIME_CORRECT:
                this.setDateTime(event.newDate);
                break;
        }
    };
    CommandBinaryBuffer.prototype.getDemand = function () {
        const date0 = this.getUint8();
        const date1 = this.getUint8();
        return {
            date: {
                year: date0 >> 1,
                month: ((date0 << 3) & 0x0f) | (date1 >> 5),
                date: date1 & 0x1f
            },
            demandParam: this.getUint8(),
            firstIndex: this.getUint16(),
            count: this.getUint8(),
            period: this.getUint8()
        };
    };
    CommandBinaryBuffer.prototype.setDemand = function (parameters) {
        const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
        const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);
        this.setUint8(date0);
        this.setUint8(date1);
        this.setUint8(parameters.demandParam);
        this.setUint16(parameters.firstIndex);
        this.setUint8(parameters.count);
        this.setUint8(parameters.period);
    };
    CommandBinaryBuffer.prototype.getOperatorParametersExtended2 = function () {
        return {
            deltaCorMin: this.getUint8(),
            timeoutMagnetOff: this.getUint8(),
            relaySetExt: toObject(relaySetExtMask, this.getUint8()),
            timeoutMagnetOn: this.getUint8(),
            phaseDefault: this.getUint8(),
            displaySet21: this.getUint32(),
            displaySet22: this.getUint32(),
            displaySet23: this.getUint32(),
            displaySet24: toObject(displaySet24Mask, this.getUint32()),
            channel1: this.getUint8(),
            channel2: this.getUint8(),
            channel3: this.getUint8(),
            channel4: this.getUint8(),
            channel5: this.getUint8(),
            channel6: this.getUint8(),
            timeCorrectPeriod: this.getUint8()
        };
    };
    CommandBinaryBuffer.prototype.setOperatorParametersExtended2 = function (operatorParametersExtended2) {
        this.setUint8(operatorParametersExtended2.deltaCorMin);
        this.setUint8(operatorParametersExtended2.timeoutMagnetOff);
        this.setUint8(fromObject(relaySetExtMask, operatorParametersExtended2.relaySetExt));
        this.setUint8(operatorParametersExtended2.timeoutMagnetOn);
        this.setUint8(operatorParametersExtended2.phaseDefault);
        this.setUint32(operatorParametersExtended2.displaySet21);
        this.setUint32(operatorParametersExtended2.displaySet22);
        this.setUint32(operatorParametersExtended2.displaySet23);
        this.setUint32(fromObject(displaySet24Mask, operatorParametersExtended2.displaySet24));
        this.setUint8(operatorParametersExtended2.channel1);
        this.setUint8(operatorParametersExtended2.channel2);
        this.setUint8(operatorParametersExtended2.channel3);
        this.setUint8(operatorParametersExtended2.channel4);
        this.setUint8(operatorParametersExtended2.channel5);
        this.setUint8(operatorParametersExtended2.channel6);
        this.setUint8(operatorParametersExtended2.timeCorrectPeriod);
    };
    CommandBinaryBuffer.prototype.getOperatorParametersExtended4 = function () {
        return {
            displaySet5: toObject(displaySet5Mask, this.getUint32()),
            displaySet25: toObject(displaySet5Mask, this.getUint32()),
            displaySet31: toObject(displaySet1Mask, this.getUint32()),
            displaySet32: toObject(displaySet1Mask, this.getUint32()),
            displaySet33: toObject(displaySet1Mask, this.getUint32()),
            displaySet34: toObject(displaySet1Mask, this.getUint32()),
            displaySet35: toObject(displaySet5Mask, this.getUint32())
        };
    };
    CommandBinaryBuffer.prototype.setOperatorParametersExtended4 = function (operatorParametersExtended) {
        this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet5));
        this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet25));
        this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended.displaySet31));
        this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended.displaySet32));
        this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended.displaySet33));
        this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended.displaySet34));
        this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet35));
    };
    const getPackedEnergiesWithDateSize = (parameters) => {
        const { wh, vari, vare } = parameters.energies;
        if (parameters?.energyType) {
            const energiesNumber = [...wh, ...vari, ...vare].filter(energy => energy !== null).length;
            return DATE_SIZE$1 + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        return DATE_SIZE$1 + ENERGY_SIZE * TARIFF_NUMBER$1;
    };

    const MIN_COMMAND_SIZE$2 = 3;
    const MAX_COMMAND_SIZE$4 = 4;
    const id$1s = getDayDemand$2;
    const name$1s = commandNames$1[getDayDemand$2];
    const headerSize$1s = 2;
    const maxSize$1s = MAX_COMMAND_SIZE$4;
    const accessLevel$1s = READ_ONLY;
    const isLoraOnly$1s = false;
    const examples$1s = {
        'request day values for 2024.03.22 00:00:00 GMT': {
            id: id$1s,
            name: name$1s,
            headerSize: headerSize$1s,
            maxSize: maxSize$1s,
            accessLevel: accessLevel$1s,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x16, 0x03,
                0x18, 0x03, 0x16
            ]
        },
        'request day values with energy type for 2024.03.22 00:00:00 GMT': {
            id: id$1s,
            name: name$1s,
            headerSize: headerSize$1s,
            maxSize: maxSize$1s,
            accessLevel: accessLevel$1s,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: A_PLUS_R_PLUS_R_MINUS
            },
            bytes: [
                0x16, 0x04,
                0x18, 0x03, 0x16, 0x01
            ]
        }
    };
    const fromBytes$1s = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        if (bytes.length === MAX_COMMAND_SIZE$4) {
            return {
                date: buffer.getDate(),
                energyType: buffer.getUint8()
            };
        }
        return { date: buffer.getDate() };
    };
    const toBytes$1s = (parameters) => {
        const buffer = new CommandBinaryBuffer(parameters?.energyType ? MAX_COMMAND_SIZE$4 : MIN_COMMAND_SIZE$2);
        buffer.setDate(parameters?.date);
        if (parameters?.energyType) {
            buffer.setUint8(parameters.energyType);
        }
        return toBytes$2f(id$1s, buffer.data);
    };

    var getDayDemand$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1s,
        examples: examples$1s,
        fromBytes: fromBytes$1s,
        headerSize: headerSize$1s,
        id: id$1s,
        isLoraOnly: isLoraOnly$1s,
        maxSize: maxSize$1s,
        name: name$1s,
        toBytes: toBytes$1s
    });

    const id$1r = getDayDemandExport$2;
    const name$1r = commandNames$1[getDayDemandExport$2];
    const headerSize$1r = 2;
    const maxSize$1r = 3;
    const accessLevel$1r = READ_ONLY;
    const isLoraOnly$1r = false;
    const examples$1r = {
        'request day values for 2024.03.22 00:00:00 GMT': {
            id: id$1r,
            name: name$1r,
            headerSize: headerSize$1r,
            maxSize: maxSize$1r,
            accessLevel: accessLevel$1r,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x4f, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1r = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1r = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1r);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1r, buffer.data);
    };

    var getDayDemandExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1r,
        examples: examples$1r,
        fromBytes: fromBytes$1r,
        headerSize: headerSize$1r,
        id: id$1r,
        isLoraOnly: isLoraOnly$1r,
        maxSize: maxSize$1r,
        name: name$1r,
        toBytes: toBytes$1r
    });

    const id$1q = getDemand$2;
    const name$1q = commandNames$1[getDemand$2];
    const headerSize$1q = 2;
    const maxSize$1q = 7;
    const accessLevel$1q = READ_ONLY;
    const isLoraOnly$1q = false;
    const examples$1q = {
        'request for A+': {
            id: id$1q,
            name: name$1q,
            headerSize: headerSize$1q,
            maxSize: maxSize$1q,
            parameters: {
                date: {
                    year: 21,
                    month: 6,
                    date: 18
                },
                demandParam: 0x81,
                firstIndex: 0,
                count: 2,
                period: 30
            },
            bytes: [
                0x76, 0x07,
                0x2a, 0xd2,
                0x81,
                0x00, 0x00,
                0x02,
                0x1e
            ]
        }
    };
    const fromBytes$1q = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getDemand();
    };
    const toBytes$1q = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1q);
        buffer.setDemand(parameters);
        return toBytes$2f(id$1q, buffer.data);
    };

    var getDemand$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1q,
        examples: examples$1q,
        fromBytes: fromBytes$1q,
        headerSize: headerSize$1q,
        id: id$1q,
        isLoraOnly: isLoraOnly$1q,
        maxSize: maxSize$1q,
        name: name$1q,
        toBytes: toBytes$1q
    });

    const id$1p = getDisplayParam$2;
    const name$1p = commandNames$1[getDisplayParam$2];
    const headerSize$1p = 2;
    const maxSize$1p = 1;
    const accessLevel$1p = READ_ONLY;
    const isLoraOnly$1p = false;
    const examples$1p = {
        'get additional display parameters': {
            id: id$1p,
            name: name$1p,
            headerSize: headerSize$1p,
            maxSize: maxSize$1p,
            accessLevel: accessLevel$1p,
            parameters: {
                displayMode: 1
            },
            bytes: [
                0x5e, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1p = ([displayMode]) => ({ displayMode });
    const toBytes$1p = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1p);
        buffer.setUint8(parameters.displayMode);
        return toBytes$2f(id$1p, buffer.data);
    };

    var getDisplayParam$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1p,
        examples: examples$1p,
        fromBytes: fromBytes$1p,
        headerSize: headerSize$1p,
        id: id$1p,
        isLoraOnly: isLoraOnly$1p,
        maxSize: maxSize$1p,
        name: name$1p,
        toBytes: toBytes$1p
    });

    const id$1o = getEnergy$2;
    const name$1o = commandNames$1[getEnergy$2];
    const headerSize$1o = 2;
    const maxSize$1o = 0;
    const accessLevel$1o = READ_ONLY;
    const isLoraOnly$1o = false;
    const examples$1o = {
        'simple request': {
            id: id$1o,
            name: name$1o,
            headerSize: headerSize$1o,
            maxSize: maxSize$1o,
            accessLevel: accessLevel$1o,
            parameters: {},
            bytes: [
                0x0f, 0x00
            ]
        }
    };
    const fromBytes$1o = (bytes) => {
        if (bytes.length !== maxSize$1o) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1o = () => toBytes$2f(id$1o);

    var getEnergy$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1o,
        examples: examples$1o,
        fromBytes: fromBytes$1o,
        headerSize: headerSize$1o,
        id: id$1o,
        isLoraOnly: isLoraOnly$1o,
        maxSize: maxSize$1o,
        name: name$1o,
        toBytes: toBytes$1o
    });

    const MIN_COMMAND_SIZE$1 = 0;
    const MAX_COMMAND_SIZE$3 = 1;
    const id$1n = getEnergyDayPrevious$2;
    const name$1n = commandNames$1[getEnergyDayPrevious$2];
    const headerSize$1n = 2;
    const maxSize$1n = MAX_COMMAND_SIZE$3;
    const accessLevel$1n = READ_ONLY;
    const isLoraOnly$1n = false;
    const examples$1n = {
        'simple request': {
            id: id$1n,
            name: name$1n,
            headerSize: headerSize$1n,
            maxSize: maxSize$1n,
            accessLevel: accessLevel$1n,
            parameters: {},
            bytes: [
                0x03, 0x00
            ]
        },
        'request A-R+R- energy': {
            id: id$1n,
            name: name$1n,
            headerSize: headerSize$1n,
            maxSize: maxSize$1n,
            accessLevel: accessLevel$1n,
            parameters: {
                energyType: A_MINUS_R_PLUS_R_MINUS
            },
            bytes: [
                0x03, 0x01,
                0x02
            ]
        }
    };
    const fromBytes$1n = (bytes) => {
        const { length } = bytes;
        if (length !== MAX_COMMAND_SIZE$3 && length !== MIN_COMMAND_SIZE$1) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        if (length === MAX_COMMAND_SIZE$3) {
            return { energyType: bytes[0] };
        }
        return {};
    };
    const toBytes$1n = (parameters) => {
        if (parameters.energyType) {
            return toBytes$2f(id$1n, [parameters.energyType]);
        }
        return toBytes$2f(id$1n);
    };

    var getEnergyDayPrevious$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1n,
        examples: examples$1n,
        fromBytes: fromBytes$1n,
        headerSize: headerSize$1n,
        id: id$1n,
        isLoraOnly: isLoraOnly$1n,
        maxSize: maxSize$1n,
        name: name$1n,
        toBytes: toBytes$1n
    });

    const id$1m = getEnergyExport$2;
    const name$1m = commandNames$1[getEnergyExport$2];
    const headerSize$1m = 2;
    const maxSize$1m = 0;
    const accessLevel$1m = READ_ONLY;
    const isLoraOnly$1m = false;
    const examples$1m = {
        'simple request': {
            id: id$1m,
            name: name$1m,
            headerSize: headerSize$1m,
            maxSize: maxSize$1m,
            accessLevel: accessLevel$1m,
            parameters: {},
            bytes: [
                0x4e, 0x00
            ]
        }
    };
    const fromBytes$1m = (bytes) => {
        if (bytes.length !== maxSize$1m) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1m = () => toBytes$2f(id$1m);

    var getEnergyExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1m,
        examples: examples$1m,
        fromBytes: fromBytes$1m,
        headerSize: headerSize$1m,
        id: id$1m,
        isLoraOnly: isLoraOnly$1m,
        maxSize: maxSize$1m,
        name: name$1m,
        toBytes: toBytes$1m
    });

    const id$1l = getEnergyExportDayPrevious$2;
    const name$1l = commandNames$1[getEnergyExportDayPrevious$2];
    const headerSize$1l = 2;
    const maxSize$1l = 0;
    const accessLevel$1l = READ_ONLY;
    const isLoraOnly$1l = false;
    const examples$1l = {
        'simple request': {
            id: id$1l,
            name: name$1l,
            headerSize: headerSize$1l,
            maxSize: maxSize$1l,
            accessLevel: accessLevel$1l,
            parameters: {},
            bytes: [
                0x50, 0x00
            ]
        }
    };
    const fromBytes$1l = (bytes) => {
        if (bytes.length !== maxSize$1l) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1l = () => toBytes$2f(id$1l);

    var getEnergyExportDayPrevious$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1l,
        examples: examples$1l,
        fromBytes: fromBytes$1l,
        headerSize: headerSize$1l,
        id: id$1l,
        isLoraOnly: isLoraOnly$1l,
        maxSize: maxSize$1l,
        name: name$1l,
        toBytes: toBytes$1l
    });

    const id$1k = getHalfHourDemandChannel$2;
    const name$1k = commandNames$1[getHalfHourDemandChannel$2];
    const headerSize$1k = 2;
    const maxSize$1k = 5;
    const accessLevel$1k = READ_ONLY;
    const isLoraOnly$1k = false;
    const examples$1k = {
        'request A-R- energy for phase A on 2024.03.22': {
            id: id$1k,
            name: name$1k,
            headerSize: headerSize$1k,
            maxSize: maxSize$1k,
            accessLevel: accessLevel$1k,
            parameters: {
                channel: 1,
                channelParameter: 16,
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x5a, 0x05,
                0x01,
                0x10,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1k = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            channel: buffer.getUint8(),
            channelParameter: buffer.getUint8(),
            date: buffer.getDate()
        };
    };
    const toBytes$1k = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1k);
        buffer.setUint8(parameters.channel);
        buffer.setUint8(parameters.channelParameter);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1k, buffer.data);
    };

    var getHalfHourDemandChannel$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1k,
        examples: examples$1k,
        fromBytes: fromBytes$1k,
        headerSize: headerSize$1k,
        id: id$1k,
        isLoraOnly: isLoraOnly$1k,
        maxSize: maxSize$1k,
        name: name$1k,
        toBytes: toBytes$1k
    });

    const id$1j = getHalfHourDemandVare$2;
    const name$1j = commandNames$1[getHalfHourDemandVare$2];
    const headerSize$1j = 2;
    const maxSize$1j = 3;
    const accessLevel$1j = READ_ONLY;
    const isLoraOnly$1j = false;
    const examples$1j = {
        'request archive values for 2024.03.22': {
            id: id$1j,
            name: name$1j,
            headerSize: headerSize$1j,
            maxSize: maxSize$1j,
            accessLevel: accessLevel$1j,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x49, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1j = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1j = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1j);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1j, buffer.data);
    };

    var getHalfHourDemandVare$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1j,
        examples: examples$1j,
        fromBytes: fromBytes$1j,
        headerSize: headerSize$1j,
        id: id$1j,
        isLoraOnly: isLoraOnly$1j,
        maxSize: maxSize$1j,
        name: name$1j,
        toBytes: toBytes$1j
    });

    const id$1i = getHalfHourDemandVareExport$2;
    const name$1i = commandNames$1[getHalfHourDemandVareExport$2];
    const headerSize$1i = 2;
    const maxSize$1i = 3;
    const accessLevel$1i = READ_ONLY;
    const isLoraOnly$1i = false;
    const examples$1i = {
        'request archive values for 2024.03.22': {
            id: id$1i,
            name: name$1i,
            headerSize: headerSize$1i,
            maxSize: maxSize$1i,
            accessLevel: accessLevel$1i,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x55, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1i = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1i = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1i);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1i, buffer.data);
    };

    var getHalfHourDemandVareExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1i,
        examples: examples$1i,
        fromBytes: fromBytes$1i,
        headerSize: headerSize$1i,
        id: id$1i,
        isLoraOnly: isLoraOnly$1i,
        maxSize: maxSize$1i,
        name: name$1i,
        toBytes: toBytes$1i
    });

    const id$1h = getHalfHourDemandVari$2;
    const name$1h = commandNames$1[getHalfHourDemandVari$2];
    const headerSize$1h = 2;
    const maxSize$1h = 3;
    const accessLevel$1h = READ_ONLY;
    const isLoraOnly$1h = false;
    const examples$1h = {
        'request archive values for 2024.03.22': {
            id: id$1h,
            name: name$1h,
            headerSize: headerSize$1h,
            maxSize: maxSize$1h,
            accessLevel: accessLevel$1h,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x48, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1h = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1h = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1h);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1h, buffer.data);
    };

    var getHalfHourDemandVari$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1h,
        examples: examples$1h,
        fromBytes: fromBytes$1h,
        headerSize: headerSize$1h,
        id: id$1h,
        isLoraOnly: isLoraOnly$1h,
        maxSize: maxSize$1h,
        name: name$1h,
        toBytes: toBytes$1h
    });

    const id$1g = getHalfHourDemandVariExport$2;
    const name$1g = commandNames$1[getHalfHourDemandVariExport$2];
    const headerSize$1g = 2;
    const maxSize$1g = 3;
    const accessLevel$1g = READ_ONLY;
    const isLoraOnly$1g = false;
    const examples$1g = {
        'request archive values for 2024.03.22': {
            id: id$1g,
            name: name$1g,
            headerSize: headerSize$1g,
            maxSize: maxSize$1g,
            accessLevel: accessLevel$1g,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                }
            },
            bytes: [
                0x54, 0x03,
                0x18, 0x03, 0x16
            ]
        }
    };
    const fromBytes$1g = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1g = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1g);
        buffer.setDate(parameters.date);
        return toBytes$2f(id$1g, buffer.data);
    };

    var getHalfHourDemandVariExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1g,
        examples: examples$1g,
        fromBytes: fromBytes$1g,
        headerSize: headerSize$1g,
        id: id$1g,
        isLoraOnly: isLoraOnly$1g,
        maxSize: maxSize$1g,
        name: name$1g,
        toBytes: toBytes$1g
    });

    const id$1f = getOperatorParametersExtended$2;
    const name$1f = commandNames$1[getOperatorParametersExtended$2];
    const headerSize$1f = 2;
    const maxSize$1f = 0;
    const accessLevel$1f = READ_ONLY;
    const isLoraOnly$1f = false;
    const examples$1f = {
        'simple request': {
            id: id$1f,
            name: name$1f,
            headerSize: headerSize$1f,
            maxSize: maxSize$1f,
            accessLevel: accessLevel$1f,
            parameters: {},
            bytes: [
                0x3f, 0x00
            ]
        }
    };
    const fromBytes$1f = (bytes) => {
        if (bytes.length !== maxSize$1f) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1f = () => toBytes$2f(id$1f);

    var getOperatorParametersExtended$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1f,
        examples: examples$1f,
        fromBytes: fromBytes$1f,
        headerSize: headerSize$1f,
        id: id$1f,
        isLoraOnly: isLoraOnly$1f,
        maxSize: maxSize$1f,
        name: name$1f,
        toBytes: toBytes$1f
    });

    const id$1e = getOperatorParametersExtended2$2;
    const name$1e = commandNames$1[getOperatorParametersExtended2$2];
    const headerSize$1e = 2;
    const maxSize$1e = 0;
    const accessLevel$1e = READ_ONLY;
    const isLoraOnly$1e = false;
    const examples$1e = {
        'simple request': {
            id: id$1e,
            name: name$1e,
            headerSize: headerSize$1e,
            maxSize: maxSize$1e,
            accessLevel: accessLevel$1e,
            parameters: {},
            bytes: [
                0x47, 0x00
            ]
        }
    };
    const fromBytes$1e = (bytes) => {
        if (bytes.length !== maxSize$1e) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1e = () => toBytes$2f(id$1e);

    var getOperatorParametersExtended2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1e,
        examples: examples$1e,
        fromBytes: fromBytes$1e,
        headerSize: headerSize$1e,
        id: id$1e,
        isLoraOnly: isLoraOnly$1e,
        maxSize: maxSize$1e,
        name: name$1e,
        toBytes: toBytes$1e
    });

    const id$1d = setDisplayParam$2;
    const name$1d = commandNames$1[setDisplayParam$2];
    const headerSize$1d = 2;
    const maxSize$1d = 65;
    const accessLevel$1d = READ_WRITE;
    const isLoraOnly$1d = false;
    const examples$1d = {
        'set params with order': {
            id: id$1d,
            name: name$1d,
            headerSize: headerSize$1d,
            maxSize: maxSize$1d,
            accessLevel: accessLevel$1d,
            parameters: {
                displayMode: 0,
                order: [4, 5, 6, 7]
            },
            bytes: [
                0x5d, 0x05,
                0x00,
                0x04, 0x05, 0x06, 0x07
            ]
        },
        'set params without order': {
            id: id$1d,
            name: name$1d,
            headerSize: headerSize$1d,
            maxSize: maxSize$1d,
            accessLevel: accessLevel$1d,
            parameters: {
                displayMode: 1,
                order: []
            },
            bytes: [
                0x5d, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1d = (bytes) => {
        if (bytes.length < 1 || bytes.length > maxSize$1d) {
            throw new Error('Invalid SetDisplayParam data size.');
        }
        const [displayMode, ...order] = bytes;
        return { displayMode, order };
    };
    const toBytes$1d = (parameters) => (toBytes$2f(id$1d, [
        parameters.displayMode,
        ...parameters.order
    ]));

    var setDisplayParam$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1d,
        examples: examples$1d,
        fromBytes: fromBytes$1d,
        headerSize: headerSize$1d,
        id: id$1d,
        isLoraOnly: isLoraOnly$1d,
        maxSize: maxSize$1d,
        name: name$1d,
        toBytes: toBytes$1d
    });

    const id$1c = setOperatorParameters$2;
    const name$1c = commandNames$1[setOperatorParameters$2];
    const headerSize$1c = 2;
    const maxSize$1c = OPERATOR_PARAMETERS_SIZE;
    const accessLevel$1c = READ_WRITE;
    const isLoraOnly$1c = false;
    const examples$1c = {
        'set default operator parameters request': {
            id: id$1c,
            name: name$1c,
            headerSize: headerSize$1c,
            maxSize: maxSize$1c,
            accessLevel: accessLevel$1c,
            parameters: {
                vpThreshold: 265000,
                vThreshold: 156000,
                ipThreshold: 120000,
                pmaxThreshold0: 31800,
                pmaxThreshold1: 31800,
                pmaxThreshold2: 31800,
                pmaxThreshold3: 31800,
                rmaxThreshold0: 31800,
                rmaxThreshold1: 31800,
                rmaxThreshold2: 31800,
                rmaxThreshold3: 31800,
                tint: 30,
                calcPeriodDate: 1,
                timeoutDisplay: 127,
                timeoutScreen: 7,
                displaySet1: {
                    SET_ALL_SEGMENT_DISPLAY: true,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: true,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: false,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: false,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: true,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: false,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet2: {
                    CURRENT_IN_PHASE_A: false,
                    CURRENT_IN_PHASE_B: false,
                    CURRENT_IN_PHASE_C: false,
                    CURRENT_IN_NEUTRAL: false,
                    VOLTAGE_IN_PHASE_A: false,
                    VOLTAGE_IN_PHASE_B: false,
                    VOLTAGE_IN_PHASE_C: false,
                    BATTERY_VOLTAGE: false,
                    FREQUENCY: false,
                    ACTIVE_POWER_SUM: true,
                    ACTIVE_POWER_PHASE_A: false,
                    ACTIVE_POWER_PHASE_B: false,
                    ACTIVE_POWER_PHASE_C: false,
                    REACTIVE_POWER_QPLUS_SUM: true,
                    REACTIVE_POWER_QPLUS_PHASE_A: false,
                    REACTIVE_POWER_QPLUS_PHASE_B: false,
                    REACTIVE_POWER_QPLUS_PHASE_C: false,
                    REACTIVE_POWER_QMINUS_SUM: true,
                    REACTIVE_POWER_QMINUS_PHASE_A: false,
                    REACTIVE_POWER_QMINUS_PHASE_B: false,
                    REACTIVE_POWER_QMINUS_PHASE_C: false,
                    POWER_COEFFICIENT_SUM: false,
                    POWER_COEFFICIENT_PHASE_A: false,
                    POWER_COEFFICIENT_PHASE_B: false,
                    POWER_COEFFICIENT_PHASE_C: false,
                    APPARENT_POWER_QPLUS_SUM: false,
                    APPARENT_POWER_QPLUS_PHASE_A: false,
                    APPARENT_POWER_QPLUS_PHASE_B: false,
                    APPARENT_POWER_QPLUS_PHASE_C: false,
                    APPARENT_POWER_QMINUS_SUM: false,
                    APPARENT_POWER_QMINUS_PHASE_A: false,
                    APPARENT_POWER_QMINUS_PHASE_B: false
                },
                displaySet3: {
                    APPARENT_POWER_QMINUS_PHASE_C: false,
                    MAX_ACTIVE_POWER_DAY_T1: false,
                    MAX_ACTIVE_POWER_DAY_T2: false,
                    MAX_ACTIVE_POWER_DAY_T3: false,
                    MAX_ACTIVE_POWER_DAY_T4: false,
                    MAX_ACTIVE_POWER_MONTH_T1: false,
                    MAX_ACTIVE_POWER_MONTH_T2: false,
                    MAX_ACTIVE_POWER_MONTH_T3: false,
                    MAX_ACTIVE_POWER_MONTH_T4: false,
                    MAX_REACTIVE_POWER_DAY_T1: false,
                    MAX_REACTIVE_POWER_DAY_T2: false,
                    MAX_REACTIVE_POWER_DAY_T3: false,
                    MAX_REACTIVE_POWER_DAY_T4: false,
                    MAX_REACTIVE_POWER_MONTH_T1: false,
                    MAX_REACTIVE_POWER_MONTH_T2: false,
                    MAX_REACTIVE_POWER_MONTH_T3: false,
                    MAX_REACTIVE_POWER_MONTH_T4: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T1: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T2: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T3: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T4: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: false
                },
                relaySet: {
                    RELAY_ON_Y: true,
                    RELAY_ON_CENTER: true,
                    RELAY_ON_PB: false,
                    RELAY_ON_TARIFF_0: false,
                    RELAY_ON_TARIFF_1: false,
                    RELAY_ON_TARIFF_2: false,
                    RELAY_ON_TARIFF_3: false,
                    RELAY_ON_V_GOOD: false,
                    RELAY_OFF_Y: true,
                    RELAY_OFF_CENTER: true,
                    RELAY_OFF_TARIFF_0: false,
                    RELAY_OFF_TARIFF_1: false,
                    RELAY_OFF_TARIFF_2: false,
                    RELAY_OFF_TARIFF_3: false,
                    RELAY_OFF_I_LIMIT: false,
                    RELAY_OFF_V_BAD: false,
                    RELAY_OFF_DIFF_BAD: false,
                    RELAY_OFF_LIM_TARIFF_0: false,
                    RELAY_OFF_LIM_TARIFF_1: false,
                    RELAY_OFF_LIM_TARIFF_2: false,
                    RELAY_OFF_LIM_TARIFF_3: false,
                    RELAY_OFF_LIM_VAR_TARIFF_0: false,
                    RELAY_OFF_LIM_VAR_TARIFF_1: false,
                    RELAY_OFF_LIM_VAR_TARIFF_2: false,
                    RELAY_OFF_LIM_VAR_TARIFF_3: false,
                    RELAY_ON_PF_MIN: false,
                    RELAY_OFF_PF_MIN: false,
                    RELAY_ON_TIMEOUT: false,
                    RELAY_ON_SALDO: false,
                    RELAY_OFF_SALDO: false,
                    RELAY_OFF_SALDO_SOFT: false
                },
                speedOptoPort: { plc: 9600, optoport: 9600 },
                ten: 30,
                tu: 30,
                timeIntervalPowerOff: 3,
                reserved: 0,
                timeoutBadVAVB: 5,
                freqMax: 55,
                freqMin: 45,
                year: 0,
                month: 0,
                date: 0,
                energyDecimalPoint: 2,
                voltageTransformationRatioNumerator: 1,
                voltageTransformationRatioDenominator: 1,
                currentTransformationRatioNumerator: 1,
                currentTransformationRatioDenominator: 1,
                typeMeter: {
                    TRANSFORMATION_RATIO: false,
                    METER_TYPE_R: false,
                    ACCUMULATE_BY_R_PLUS_MINUS: false
                },
                phMin: 0,
                timeoutIMax: 5,
                timeoutPMax: 5,
                timeoutCos: 5,
                pMaxDef: 1,
                displaySet4: {
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    CURRENT_TRANSFORMATION_RATIO: false,
                    VOLTAGE_TRANSFORMATION_RATIO: false,
                    CURRENT_BALANCE: false,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    OPTOPORT_SPEED: false,
                    MAGNET_INDUCTION: false,
                    SORT_DISPLAY_SCREENS: false,
                    TURN_OFF_DISPLAY: false,
                    AUTO_SCREEN_SCROLLING: true
                }
            },
            bytes: [
                0x1f, 0x5f,
                0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x1e, 0x01, 0x7f, 0x07,
                0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03,
                0x44, 0x1e, 0x1e, 0x03, 0x00, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x01,
                0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x05, 0x05, 0x01, 0x80, 0x06, 0x00, 0x00
            ]
        }
    };
    const fromBytes$1c = (bytes) => {
        if (bytes.length !== maxSize$1c) {
            throw new Error('Invalid SetOpParams data size.');
        }
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParameters();
    };
    const toBytes$1c = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1c);
        buffer.setOperatorParameters(parameters);
        return toBytes$2f(id$1c, buffer.data);
    };

    var setOperatorParameters$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1c,
        examples: examples$1c,
        fromBytes: fromBytes$1c,
        headerSize: headerSize$1c,
        id: id$1c,
        isLoraOnly: isLoraOnly$1c,
        maxSize: maxSize$1c,
        name: name$1c,
        toBytes: toBytes$1c
    });

    const id$1b = setOperatorParametersExtended$2;
    const name$1b = commandNames$1[setOperatorParametersExtended$2];
    const headerSize$1b = 2;
    const maxSize$1b = OPERATOR_PARAMETERS_EXTENDED_SIZE;
    const accessLevel$1b = READ_WRITE;
    const isLoraOnly$1b = false;
    const examples$1b = {
        'simple request': {
            id: id$1b,
            name: name$1b,
            headerSize: headerSize$1b,
            maxSize: maxSize$1b,
            accessLevel: accessLevel$1b,
            parameters: {
                timeoutRelayOn: 1,
                define1: {
                    RESET_DAY_MAX_POWER_KEY: false,
                    RESET_MONTH_MAX_POWER_KEY: false,
                    BLOCK_KEY_OPTOPORT: false,
                    MAGNET_SCREEN_CONST: false,
                    ALLOW_BROWNOUT_INDICATION: false
                },
                timeoutRelayKey: 0,
                timeoutRelayAuto: 5
            },
            bytes: [
                0x40, 0x09,
                0x01,
                0x00,
                0x00,
                0x05,
                0x00, 0x00, 0x00, 0x00,
                0x00
            ]
        }
    };
    const fromBytes$1b = (bytes) => {
        if (bytes.length !== maxSize$1b) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParametersExtended();
    };
    const toBytes$1b = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1b);
        buffer.setOperatorParametersExtended(parameters);
        return toBytes$2f(id$1b, buffer.data);
    };

    var setOperatorParametersExtended$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1b,
        examples: examples$1b,
        fromBytes: fromBytes$1b,
        headerSize: headerSize$1b,
        id: id$1b,
        isLoraOnly: isLoraOnly$1b,
        maxSize: maxSize$1b,
        name: name$1b,
        toBytes: toBytes$1b
    });

    const id$1a = setOperatorParametersExtended2$2;
    const name$1a = commandNames$1[setOperatorParametersExtended2$2];
    const headerSize$1a = 2;
    const maxSize$1a = OPERATOR_PARAMETERS_EXTENDED2_SIZE;
    const accessLevel$1a = READ_WRITE;
    const isLoraOnly$1a = false;
    const examples$1a = {
        'simple request': {
            id: id$1a,
            name: name$1a,
            headerSize: headerSize$1a,
            maxSize: maxSize$1a,
            accessLevel: accessLevel$1a,
            parameters: {
                deltaCorMin: 15,
                timeoutMagnetOff: 5,
                relaySetExt: {
                    RELAY_OFF_MAGNET: true,
                    RELAY_ON_MAGNET_TIMEOUT: false,
                    RELAY_ON_MAGNET_AUTO: true
                },
                timeoutMagnetOn: 5,
                phaseDefault: 1,
                displaySet21: 0,
                displaySet22: 0,
                displaySet23: 0,
                displaySet24: {
                    OPTOPORT_SPEED: true
                },
                channel1: 1,
                channel2: 2,
                channel3: 3,
                channel4: 4,
                channel5: 5,
                channel6: 6,
                timeCorrectPeriod: 24
            },
            bytes: [
                0x45, 0x1c,
                0x0f,
                0x05,
                0x05,
                0x05,
                0x01,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x04, 0x00, 0x00, 0x00,
                0x01,
                0x02,
                0x03,
                0x04,
                0x05,
                0x06,
                0x18
            ]
        }
    };
    const fromBytes$1a = (bytes) => {
        if (bytes.length !== maxSize$1a) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParametersExtended2();
    };
    const toBytes$1a = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1a);
        buffer.setOperatorParametersExtended2(parameters);
        return toBytes$2f(id$1a, buffer.data);
    };

    var setOperatorParametersExtended2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1a,
        examples: examples$1a,
        fromBytes: fromBytes$1a,
        headerSize: headerSize$1a,
        id: id$1a,
        isLoraOnly: isLoraOnly$1a,
        maxSize: maxSize$1a,
        name: name$1a,
        toBytes: toBytes$1a
    });

    const id$19 = setOperatorParametersExtended4$2;
    const name$19 = commandNames$1[setOperatorParametersExtended4$2];
    const headerSize$19 = 2;
    const maxSize$19 = OPERATOR_PARAMETERS_EXTENDED4_SIZE;
    const accessLevel$19 = READ_WRITE;
    const isLoraOnly$19 = false;
    const examples$19 = {
        'simple request': {
            id: id$19,
            name: name$19,
            headerSize: headerSize$19,
            maxSize: maxSize$19,
            accessLevel: accessLevel$19,
            parameters: {
                displaySet5: {
                    EVENT: true,
                    PROFILE_P01: true,
                    PROFILE_P02: false,
                    PROFILE_P03: true,
                    PROFILE_P04: true,
                    PROFILE_P05: false,
                    PROFILE_P06: true
                },
                displaySet25: {
                    EVENT: true,
                    PROFILE_P01: false,
                    PROFILE_P02: true,
                    PROFILE_P03: false,
                    PROFILE_P04: true,
                    PROFILE_P05: false,
                    PROFILE_P06: true
                },
                displaySet31: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: false,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: true,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: false,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: true,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: false,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: true,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: false,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet32: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: true,
                    TOTAL_ACTIVE_ENERGY: false,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: true,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: false,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: false,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: true,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: true,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet33: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: false,
                    ACTIVE_ENERGY_T1: true,
                    ACTIVE_ENERGY_T2: true,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: false,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: false,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: false,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: true,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: false,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: true,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: true,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet34: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: false,
                    ACTIVE_ENERGY_T1: true,
                    ACTIVE_ENERGY_T2: true,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: false,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: false,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: false,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: true,
                    EXPORTED_ACTIVE_ENERGY_T3: true,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: false,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet35: {
                    EVENT: false,
                    PROFILE_P01: false,
                    PROFILE_P02: true,
                    PROFILE_P03: true,
                    PROFILE_P04: true,
                    PROFILE_P05: false,
                    PROFILE_P06: false
                }
            },
            bytes: [
                0x75, 0x1c,
                0x00, 0x00, 0x00, 0x5b,
                0x00, 0x00, 0x00, 0x55,
                0x40, 0x04, 0x02, 0x20,
                0x01, 0x00, 0x08, 0x22,
                0x0c, 0x00, 0x10, 0x18,
                0x40, 0x18, 0x00, 0x18,
                0x00, 0x00, 0x00, 0x1c
            ]
        }
    };
    const fromBytes$19 = (bytes) => {
        if (bytes.length !== maxSize$19) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParametersExtended4();
    };
    const toBytes$19 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$19);
        buffer.setOperatorParametersExtended4(parameters);
        return toBytes$2f(id$19, buffer.data);
    };

    var setOperatorParametersExtended4$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$19,
        examples: examples$19,
        fromBytes: fromBytes$19,
        headerSize: headerSize$19,
        id: id$19,
        isLoraOnly: isLoraOnly$19,
        maxSize: maxSize$19,
        name: name$19,
        toBytes: toBytes$19
    });

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$2,
        getBuildVersion: getBuildVersion$2,
        getCorrectTime: getCorrectTime$2,
        getCriticalEvent: getCriticalEvent$1,
        getCurrentStatusMeter: getCurrentStatusMeter$2,
        getCurrentValues: getCurrentValues$2,
        getDateTime: getDateTime$2,
        getDayDemand: getDayDemand$1,
        getDayDemandExport: getDayDemandExport$1,
        getDayMaxDemand: getDayMaxDemand$2,
        getDayMaxDemandExport: getDayMaxDemandExport$2,
        getDayProfile: getDayProfile$2,
        getDemand: getDemand$1,
        getDeviceId: getDeviceId$2,
        getDeviceType: getDeviceType$2,
        getDisplayParam: getDisplayParam$1,
        getEnergy: getEnergy$1,
        getEnergyDayPrevious: getEnergyDayPrevious$1,
        getEnergyExport: getEnergyExport$1,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$1,
        getEventStatus: getEventStatus$2,
        getEvents: getEvents$2,
        getEventsCounters: getEventsCounters$2,
        getExtendedCurrentValues: getExtendedCurrentValues$2,
        getHalfHourDemand: getHalfHourDemand$2,
        getHalfHourDemandChannel: getHalfHourDemandChannel$1,
        getHalfHourDemandExport: getHalfHourDemandExport$2,
        getHalfHourDemandVare: getHalfHourDemandVare$1,
        getHalfHourDemandVareExport: getHalfHourDemandVareExport$1,
        getHalfHourDemandVari: getHalfHourDemandVari$1,
        getHalfHourDemandVariExport: getHalfHourDemandVariExport$1,
        getHalfhoursEnergies: getHalfhoursEnergies$2,
        getMagneticFieldThreshold: getMagneticFieldThreshold$2,
        getMeterInfo: getMeterInfo$2,
        getMonthDemand: getMonthDemand$2,
        getMonthDemandExport: getMonthDemandExport$2,
        getMonthMaxDemand: getMonthMaxDemand$2,
        getMonthMaxDemandExport: getMonthMaxDemandExport$2,
        getOperatorParameters: getOperatorParameters$2,
        getOperatorParametersExtended: getOperatorParametersExtended$1,
        getOperatorParametersExtended2: getOperatorParametersExtended2$1,
        getOperatorParametersExtended3: getOperatorParametersExtended3$2,
        getRatePlanInfo: getRatePlanInfo$2,
        getSaldo: getSaldo$2,
        getSaldoParameters: getSaldoParameters$2,
        getSeasonProfile: getSeasonProfile$2,
        getSpecialDay: getSpecialDay$2,
        getVersion: getVersion$2,
        prepareRatePlan: prepareRatePlan$2,
        resetPowerMaxDay: resetPowerMaxDay$2,
        resetPowerMaxMonth: resetPowerMaxMonth$2,
        runTariffPlan: runTariffPlan$2,
        setAccessKey: setAccessKey$2,
        setCorrectDateTime: setCorrectDateTime$2,
        setCorrectTime: setCorrectTime$2,
        setDateTime: setDateTime$2,
        setDayProfile: setDayProfile$2,
        setDisplayParam: setDisplayParam$1,
        setOperatorParameters: setOperatorParameters$1,
        setOperatorParametersExtended: setOperatorParametersExtended$1,
        setOperatorParametersExtended2: setOperatorParametersExtended2$1,
        setOperatorParametersExtended3: setOperatorParametersExtended3$2,
        setOperatorParametersExtended4: setOperatorParametersExtended4$1,
        setSaldo: setSaldo$2,
        setSaldoParameters: setSaldoParameters$2,
        setSeasonProfile: setSeasonProfile$2,
        setSpecialDay: setSpecialDay$2,
        setSpecialOperation: setSpecialOperation$2,
        turnRelayOff: turnRelayOff$2,
        turnRelayOn: turnRelayOn$2
    });

    const id$18 = activateRatePlan$3;
    const name$18 = commandNames$2[activateRatePlan$3];
    const headerSize$18 = 2;
    const maxSize$18 = 0;
    const accessLevel$18 = READ_WRITE;
    const isLoraOnly$18 = false;
    const examples$18 = {
        'simple response': {
            id: id$18,
            name: name$18,
            headerSize: headerSize$18,
            maxSize: maxSize$18,
            accessLevel: accessLevel$18,
            parameters: {},
            bytes: [
                0x13, 0x00
            ]
        }
    };
    const fromBytes$18 = (bytes) => {
        if (bytes.length !== maxSize$18) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$18 = () => toBytes$2f(id$18);

    var activateRatePlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$18,
        examples: examples$18,
        fromBytes: fromBytes$18,
        headerSize: headerSize$18,
        id: id$18,
        isLoraOnly: isLoraOnly$18,
        maxSize: maxSize$18,
        name: name$18,
        toBytes: toBytes$18
    });

    const id$17 = getBuildVersion$3;
    const name$17 = commandNames$2[getBuildVersion$3];
    const headerSize$17 = 2;
    const maxSize$17 = 6;
    const accessLevel$17 = READ_ONLY;
    const isLoraOnly$17 = false;
    const examples$17 = {
        '2021.09.16/0.0.9': {
            id: id$17,
            name: name$17,
            headerSize: headerSize$17,
            maxSize: maxSize$17,
            accessLevel: accessLevel$17,
            parameters: {
                date: {
                    date: 16,
                    month: 9,
                    year: 21
                },
                version: '0.0.9'
            },
            bytes: [
                0x70, 0x06,
                0x10, 0x09, 0x15, 0x00, 0x00, 0x09
            ]
        }
    };
    const fromBytes$17 = (bytes) => {
        if (bytes.length !== maxSize$17) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const [date, month, year, n3, n2, n1] = bytes;
        return {
            date: {
                date,
                month,
                year
            },
            version: `${n3}.${n2}.${n1}`
        };
    };
    const toBytes$17 = (parameters) => {
        const { date, version } = parameters;
        const versionParts = version.split('.').map(part => parseInt(part, 10));
        return toBytes$2f(id$17, [date.date, date.month, date.year, ...versionParts]);
    };

    var getBuildVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$17,
        examples: examples$17,
        fromBytes: fromBytes$17,
        headerSize: headerSize$17,
        id: id$17,
        isLoraOnly: isLoraOnly$17,
        maxSize: maxSize$17,
        name: name$17,
        toBytes: toBytes$17
    });

    const id$16 = getCorrectTime$3;
    const name$16 = commandNames$2[getCorrectTime$3];
    const headerSize$16 = 2;
    const accessLevel$16 = READ_ONLY;
    const maxSize$16 = 9;
    const isLoraOnly$16 = false;
    const examples$16 = {
        'default parameters': {
            id: id$16,
            name: name$16,
            headerSize: headerSize$16,
            maxSize: maxSize$16,
            accessLevel: accessLevel$16,
            parameters: {
                monthTransitionSummer: 3,
                dateTransitionSummer: 0,
                hoursTransitionSummer: 3,
                hoursCorrectSummer: 1,
                monthTransitionWinter: 10,
                dateTransitionWinter: 0,
                hoursTransitionWinter: 4,
                hoursCorrectWinter: 1,
                isCorrectionNeeded: true
            },
            bytes: [
                0x3e, 0x09,
                0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01
            ]
        }
    };
    const fromBytes$16 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getTimeCorrectionParameters();
    };
    const toBytes$16 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$16);
        buffer.setTimeCorrectionParameters(parameters);
        return toBytes$2f(id$16, buffer.data);
    };

    var getCorrectTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$16,
        examples: examples$16,
        fromBytes: fromBytes$16,
        headerSize: headerSize$16,
        id: id$16,
        isLoraOnly: isLoraOnly$16,
        maxSize: maxSize$16,
        name: name$16,
        toBytes: toBytes$16
    });

    const id$15 = getDateTime$3;
    const name$15 = commandNames$2[getDateTime$3];
    const headerSize$15 = 2;
    const maxSize$15 = 8;
    const accessLevel$15 = READ_ONLY;
    const isLoraOnly$15 = false;
    const examples$15 = {
        'time: 2024.02.19 18:31:55': {
            id: id$15,
            name: name$15,
            headerSize: headerSize$15,
            maxSize: maxSize$15,
            accessLevel: accessLevel$15,
            parameters: {
                isSummerTime: false,
                seconds: 55,
                minutes: 31,
                hours: 18,
                day: 2,
                date: 19,
                month: 2,
                year: 24
            },
            bytes: [
                0x07, 0x08,
                0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18
            ]
        }
    };
    const fromBytes$15 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getDateTime();
    };
    const toBytes$15 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$15);
        buffer.setDateTime(parameters);
        return toBytes$2f(id$15, buffer.data);
    };

    var getDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$15,
        examples: examples$15,
        fromBytes: fromBytes$15,
        headerSize: headerSize$15,
        id: id$15,
        isLoraOnly: isLoraOnly$15,
        maxSize: maxSize$15,
        name: name$15,
        toBytes: toBytes$15
    });

    const MAX_PERIODS_NUMBER = 8;
    const PERIODS_FINAL_BYTE = 0xff;
    const id$14 = getDayProfile$3;
    const name$14 = commandNames$2[getDayProfile$3];
    const headerSize$14 = 2;
    const maxSize$14 = MAX_PERIODS_NUMBER;
    const accessLevel$14 = READ_ONLY;
    const isLoraOnly$14 = false;
    const examples$14 = {
        'full periods response': {
            id: id$14,
            name: name$14,
            headerSize: headerSize$14,
            maxSize: maxSize$14,
            accessLevel: accessLevel$14,
            parameters: {
                periods: [
                    { tariff: 0, isFirstHalfHour: true, hour: 2 },
                    { tariff: 1, isFirstHalfHour: false, hour: 3 },
                    { tariff: 2, isFirstHalfHour: true, hour: 4 },
                    { tariff: 3, isFirstHalfHour: false, hour: 5 },
                    { tariff: 0, isFirstHalfHour: true, hour: 6 },
                    { tariff: 1, isFirstHalfHour: false, hour: 7 },
                    { tariff: 2, isFirstHalfHour: false, hour: 8 },
                    { tariff: 3, isFirstHalfHour: true, hour: 9 }
                ]
            },
            bytes: [
                0x3b, 0x08,
                0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b
            ]
        },
        'response with 4 periods': {
            id: id$14,
            name: name$14,
            headerSize: headerSize$14,
            maxSize: maxSize$14,
            accessLevel: accessLevel$14,
            parameters: {
                periods: [
                    { tariff: 0, isFirstHalfHour: true, hour: 2 },
                    { tariff: 1, isFirstHalfHour: false, hour: 3 },
                    { tariff: 2, isFirstHalfHour: true, hour: 4 },
                    { tariff: 3, isFirstHalfHour: false, hour: 5 }
                ]
            },
            bytes: [
                0x3b, 0x05,
                0x10, 0x1d, 0x22, 0x2f, 0xff
            ]
        }
    };
    const fromBytes$14 = (bytes) => {
        const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
        const cleanData = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
        return {
            periods: [...cleanData].map(CommandBinaryBuffer$2.getDayProfileFromByte)
        };
    };
    const toBytes$14 = (parameters) => {
        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
        const size = parameters.periods.length + +hasPeriodsFinalByte;
        const buffer = new CommandBinaryBuffer$2(size);
        parameters.periods.forEach(period => {
            buffer.setDayProfile(period);
        });
        if (hasPeriodsFinalByte) {
            buffer.setUint8(PERIODS_FINAL_BYTE);
        }
        return toBytes$2f(id$14, buffer.data);
    };

    var getDayProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$14,
        examples: examples$14,
        fromBytes: fromBytes$14,
        headerSize: headerSize$14,
        id: id$14,
        isLoraOnly: isLoraOnly$14,
        maxSize: maxSize$14,
        name: name$14,
        toBytes: toBytes$14
    });

    const id$13 = getDeviceId$3;
    const name$13 = commandNames$2[getDeviceId$3];
    const headerSize$13 = 2;
    const accessLevel$13 = READ_ONLY;
    const maxSize$13 = 8;
    const isLoraOnly$13 = false;
    const examples$13 = {
        'simple response': {
            id: id$13,
            name: name$13,
            headerSize: headerSize$13,
            accessLevel: accessLevel$13,
            maxSize: maxSize$13,
            parameters: {
                manufacturer: '001a79',
                type: 23,
                year: 20,
                serial: '1b1d6a'
            },
            bytes: [
                0x05, 0x08,
                0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a
            ]
        }
    };
    const fromBytes$13 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getDeviceId();
    };
    const toBytes$13 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$13);
        buffer.setDeviceId(parameters);
        return toBytes$2f(id$13, buffer.data);
    };

    var getDeviceId = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$13,
        examples: examples$13,
        fromBytes: fromBytes$13,
        headerSize: headerSize$13,
        id: id$13,
        isLoraOnly: isLoraOnly$13,
        maxSize: maxSize$13,
        name: name$13,
        toBytes: toBytes$13
    });

    const id$12 = getDeviceType$3;
    const name$12 = commandNames$2[getDeviceType$3];
    const headerSize$12 = 2;
    const accessLevel$12 = READ_ONLY;
    const maxSize$12 = 9;
    const isLoraOnly$12 = false;
    const examples$12 = {
        'type 1': {
            id: id$12,
            name: name$12,
            headerSize: headerSize$12,
            maxSize: maxSize$12,
            accessLevel: accessLevel$12,
            parameters: {
                type: 'MTX 1A10.DG.2L5-LD4',
                revision: 0x0b,
                meterType: A
            },
            bytes: [
                0x04, 0x09,
                0x00, 0x11, 0x21, 0x49, 0x21, 0xB6, 0x81, 0xC0, 0x00
            ]
        },
        'type 2': {
            id: id$12,
            name: name$12,
            headerSize: headerSize$12,
            maxSize: maxSize$12,
            accessLevel: accessLevel$12,
            parameters: {
                type: 'MTX 1G05.DH.2L2-DOB4',
                revision: 0x0b,
                meterType: G_FULL
            },
            bytes: [
                0x04, 0x09,
                0x00, 0x12, 0x16, 0x47, 0x21, 0xb3, 0x17, 0x2c, 0x11
            ]
        }
    };
    const fromBytes$12 = (data) => {
        const buffer = new CommandBinaryBuffer$2(data);
        return buffer.getDeviceType();
    };
    const toBytes$12 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$12);
        buffer.setDeviceType(parameters);
        return toBytes$2f(id$12, buffer.data);
    };

    var getDeviceType = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$12,
        examples: examples$12,
        fromBytes: fromBytes$12,
        headerSize: headerSize$12,
        id: id$12,
        isLoraOnly: isLoraOnly$12,
        maxSize: maxSize$12,
        name: name$12,
        toBytes: toBytes$12
    });

    const COMMAND_BODY_SIZE = 14;
    const OLD_COMMAND_BODY_SIZE = 20;
    const id$11 = getEventsCounters$3;
    const name$11 = commandNames$2[getEventsCounters$3];
    const headerSize$11 = 2;
    const accessLevel$11 = READ_ONLY;
    const maxSize$11 = OLD_COMMAND_BODY_SIZE;
    const isLoraOnly$11 = false;
    const examples$11 = {
        'simple response': {
            id: id$11,
            name: name$11,
            headerSize: headerSize$11,
            accessLevel: accessLevel$11,
            maxSize: maxSize$11,
            parameters: {
                accessClosed: 22,
                accessError: 34,
                localParametersChange: 342,
                remoteParametersChange: 77,
                powerOff: 66,
                restart: 72,
                setClock: 298
            },
            bytes: [
                0x34, 0x0e,
                0x00, 0x48, 0x00, 0x42, 0x01, 0x56, 0x00, 0x4d, 0x00, 0x22, 0x00, 0x16, 0x01, 0x2a
            ]
        }
    };
    const fromBytes$11 = (bytes) => {
        if ((bytes.length !== COMMAND_BODY_SIZE && bytes.length !== OLD_COMMAND_BODY_SIZE)) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        const restart = buffer.getUint16();
        const powerOff = buffer.getUint16();
        const localParametersChange = buffer.getUint16();
        const remoteParametersChange = buffer.getUint16();
        const accessError = buffer.getUint16();
        const accessClosed = buffer.getUint16();
        const setClock = buffer.getUint16();
        return {
            accessClosed, accessError, localParametersChange, remoteParametersChange, powerOff, restart, setClock
        };
    };
    const toBytes$11 = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(COMMAND_BODY_SIZE);
        buffer.setUint16(parameters.restart);
        buffer.setUint16(parameters.powerOff);
        buffer.setUint16(parameters.localParametersChange);
        buffer.setUint16(parameters.remoteParametersChange);
        buffer.setUint16(parameters.accessError);
        buffer.setUint16(parameters.accessClosed);
        buffer.setUint16(parameters.setClock);
        return toBytes$2f(id$11, buffer.data);
    };

    var getEventsCounters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$11,
        examples: examples$11,
        fromBytes: fromBytes$11,
        headerSize: headerSize$11,
        id: id$11,
        isLoraOnly: isLoraOnly$11,
        maxSize: maxSize$11,
        name: name$11,
        toBytes: toBytes$11
    });

    const id$10 = getEventStatus$3;
    const name$10 = commandNames$2[getEventStatus$3];
    const headerSize$10 = 2;
    const accessLevel$10 = READ_ONLY;
    const maxSize$10 = 2;
    const isLoraOnly$10 = false;
    const examples$10 = {
        'simple response': {
            id: id$10,
            name: name$10,
            headerSize: headerSize$10,
            accessLevel: accessLevel$10,
            maxSize: maxSize$10,
            parameters: {
                CASE_OPEN: true,
                MAGNETIC_ON: false,
                PARAMETERS_UPDATE_REMOTE: true,
                PARAMETERS_UPDATE_LOCAL: false,
                RESTART: false,
                ERROR_ACCESS: false,
                TIME_SET: false,
                TIME_CORRECT: true,
                DEVICE_FAILURE: false,
                CASE_TERMINAL_OPEN: false,
                CASE_MODULE_OPEN: false,
                TARIFF_TABLE_SET: false,
                TARIFF_TABLE_GET: true,
                PROTECTION_RESET_EM: false,
                PROTECTION_RESET_MAGNETIC: false
            },
            bytes: [
                0x01, 0x02,
                0x85, 0x10
            ]
        }
    };
    const fromBytes$10 = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes, true);
        return buffer.getEventStatus();
    };
    const toBytes$10 = (eventStatus) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$10, true);
        buffer.setEventStatus(eventStatus);
        return toBytes$2f(id$10, buffer.data);
    };

    var getEventStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$10,
        examples: examples$10,
        fromBytes: fromBytes$10,
        headerSize: headerSize$10,
        id: id$10,
        isLoraOnly: isLoraOnly$10,
        maxSize: maxSize$10,
        name: name$10,
        toBytes: toBytes$10
    });

    const DATE_SIZE = 2;
    const ENERGY_FLAGS_SIZE = 1;
    const START_HALFHOUR_SIZE = 1;
    const HALFHOURS_NUMBER_SIZE = 1;
    const MAX_HALFHOURS_ENERGY_SIZE = 247;
    const energiesToObis = {
        'A+': '1.5.x',
        'A+R+': '3.5.x',
        'A+R-': '4.5.x',
        'A-': '2.5.x',
        'A-R+': '6.5.x',
        'A-R-': '7.5.x'
    };
    const convertEnergyToObis = (energy, tariff = 0) => {
        const obis = energiesToObis[energy];
        return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    const convertHalfhoursEnergiesToDlms = (energies) => {
        const dlms = {};
        Object.keys(energies).forEach(energy => {
            const values = energies[energy];
            for (let tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
                const value = values[tariff];
                if (value || value === 0) {
                    dlms[convertEnergyToObis(energy, tariff + 1)] = value;
                }
            }
        });
        return dlms;
    };
    const id$$ = getHalfhoursEnergies$3;
    const name$$ = commandNames$2[getHalfhoursEnergies$3];
    const headerSize$$ = 2;
    const maxSize$$ = DATE_SIZE + ENERGY_FLAGS_SIZE + START_HALFHOUR_SIZE + HALFHOURS_NUMBER_SIZE + MAX_HALFHOURS_ENERGY_SIZE;
    const accessLevel$$ = UNENCRYPTED;
    const isLoraOnly$$ = true;
    const examples$$ = {
        'get halfhours energies': {
            id: id$$,
            headerSize: headerSize$$,
            name: name$$,
            maxSize: maxSize$$,
            parameters: {
                date: {
                    year: 21,
                    month: 2,
                    date: 3
                },
                firstHalfhour: 1,
                halfhoursNumber: 2,
                energies: {
                    'A+': [0x1000, 0x2000],
                    'A-R+': [0x3000, 0x4000]
                }
            },
            bytes: [
                0x6f, 0x0d,
                0x2a, 0x43, 0x11, 0x01, 0x02, 0x10, 0x00, 0x20, 0x00, 0x30, 0x00, 0x40, 0x00
            ]
        }
    };
    const fromBytes$$ = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        const date = buffer.getDate();
        const energiesFlags = buffer.getEnergiesFlags();
        const firstHalfhour = buffer.getUint8();
        const halfhoursNumber = buffer.getUint8();
        return {
            date,
            firstHalfhour,
            halfhoursNumber,
            energies: buffer.getHalfhoursEnergies(energiesFlags, halfhoursNumber)
        };
    };
    const toBytes$$ = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$$);
        const { date, firstHalfhour, halfhoursNumber, energies } = parameters;
        buffer.setDate(date);
        buffer.setEnergiesFlags(energies);
        buffer.setUint8(firstHalfhour);
        buffer.setUint8(halfhoursNumber);
        buffer.setHalfhoursEnergies(energies);
        return toBytes$2f(id$$, buffer.getBytesToOffset());
    };
    const toJson$a = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { date, firstHalfhour, halfhoursNumber, energies } = parameters;
        const result = dlms
            ? {
                date,
                firstHalfhour,
                halfhoursNumber,
                ...convertHalfhoursEnergiesToDlms(energies)
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getHalfhoursEnergies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$$,
        examples: examples$$,
        fromBytes: fromBytes$$,
        headerSize: headerSize$$,
        id: id$$,
        isLoraOnly: isLoraOnly$$,
        maxSize: maxSize$$,
        name: name$$,
        toBytes: toBytes$$,
        toJson: toJson$a
    });

    const id$_ = getMagneticFieldThreshold$3;
    const name$_ = commandNames$2[getMagneticFieldThreshold$3];
    const headerSize$_ = 2;
    const maxSize$_ = 10;
    const accessLevel$_ = READ_ONLY;
    const isLoraOnly$_ = false;
    const examples$_ = {
        'simple response': {
            id: id$_,
            name: name$_,
            headerSize: headerSize$_,
            maxSize: maxSize$_,
            accessLevel: accessLevel$_,
            parameters: {
                induction: 10,
                threshold: 5,
                inductionCoefficient: 1.23,
                reserved: 0xffffffff
            },
            bytes: [
                0x6d, 0x0a,
                0x00, 0x0a, 0x00, 0x05, 0x00, 0x7b, 0xff, 0xff, 0xff, 0xff
            ]
        }
    };
    const fromBytes$_ = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            induction: buffer.getUint16(),
            threshold: buffer.getUint16(),
            inductionCoefficient: buffer.getUint16() / 100,
            reserved: buffer.getUint32()
        };
    };
    const toBytes$_ = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$_);
        buffer.setUint16(parameters.induction);
        buffer.setUint16(parameters.threshold);
        buffer.setUint16(parameters.inductionCoefficient * 100);
        buffer.setUint32(parameters.reserved);
        return toBytes$2f(id$_, buffer.data);
    };

    var getMagneticFieldThreshold = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$_,
        examples: examples$_,
        fromBytes: fromBytes$_,
        headerSize: headerSize$_,
        id: id$_,
        isLoraOnly: isLoraOnly$_,
        maxSize: maxSize$_,
        name: name$_,
        toBytes: toBytes$_
    });

    const id$Z = getMeterInfo$3;
    const name$Z = commandNames$2[getMeterInfo$3];
    const headerSize$Z = 2;
    const maxSize$Z = 1;
    const accessLevel$Z = READ_ONLY;
    const isLoraOnly$Z = false;
    const examples$Z = {
        'simple response': {
            id: id$Z,
            name: name$Z,
            headerSize: headerSize$Z,
            maxSize: maxSize$Z,
            accessLevel: accessLevel$Z,
            parameters: { ten: 0 },
            bytes: [
                0x7a, 0x01,
                0x00
            ]
        }
    };
    const fromBytes$Z = ([ten]) => ({ ten });
    const toBytes$Z = ({ ten }) => toBytes$2f(id$Z, [ten]);

    var getMeterInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Z,
        examples: examples$Z,
        fromBytes: fromBytes$Z,
        headerSize: headerSize$Z,
        id: id$Z,
        isLoraOnly: isLoraOnly$Z,
        maxSize: maxSize$Z,
        name: name$Z,
        toBytes: toBytes$Z
    });

    const id$Y = getOperatorParametersExtended3$3;
    const name$Y = commandNames$2[getOperatorParametersExtended3$3];
    const headerSize$Y = 2;
    const maxSize$Y = 17;
    const accessLevel$Y = READ_ONLY;
    const isLoraOnly$Y = false;
    const examples$Y = {
        'simple response': {
            id: id$Y,
            name: name$Y,
            headerSize: headerSize$Y,
            maxSize: maxSize$Y,
            accessLevel: accessLevel$Y,
            parameters: {
                pmaxMinusThreshold0: 100,
                pmaxMinusThreshold1: 200,
                pmaxMinusThreshold2: 300,
                pmaxMinusThreshold3: 400,
                relaySet: {
                    RELAY_OFF_LIMIT_P_MINUS_T1: true,
                    RELAY_OFF_LIMIT_P_MINUS_T2: false,
                    RELAY_OFF_LIMIT_P_MINUS_T3: true,
                    RELAY_OFF_LIMIT_P_MINUS_T4: false
                }
            },
            bytes: [
                0x71, 0x11,
                0x00, 0x00, 0x00, 0x64,
                0x00, 0x00, 0x00, 0xc8,
                0x00, 0x00, 0x01, 0x2c,
                0x00, 0x00, 0x01, 0x90,
                0x14
            ]
        }
    };
    const fromBytes$Y = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getOperatorParametersExtended3();
    };
    const toBytes$Y = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$Y);
        buffer.setOperatorParametersExtended3(parameters);
        return toBytes$2f(id$Y, buffer.data);
    };

    var getOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Y,
        examples: examples$Y,
        fromBytes: fromBytes$Y,
        headerSize: headerSize$Y,
        id: id$Y,
        isLoraOnly: isLoraOnly$Y,
        maxSize: maxSize$Y,
        name: name$Y,
        toBytes: toBytes$Y
    });

    const id$X = getRatePlanInfo$3;
    const name$X = commandNames$2[getRatePlanInfo$3];
    const headerSize$X = 2;
    const maxSize$X = 1 + TARIFF_PLAN_SIZE * 2;
    const accessLevel$X = READ_ONLY;
    const isLoraOnly$X = false;
    const examples$X = {
        'rate plan info response for A- table': {
            id: id$X,
            name: name$X,
            headerSize: headerSize$X,
            maxSize: maxSize$X,
            accessLevel: accessLevel$X,
            parameters: {
                tariffTable: 1,
                activePlan: {
                    id: 1,
                    tariffSet: 2,
                    activateYear: 3,
                    activateMonth: 4,
                    activateDay: 5,
                    specialProfilesArraySize: 6,
                    seasonProfilesArraySize: 7,
                    dayProfilesArraySize: 8
                },
                passivePlan: {
                    id: 10,
                    tariffSet: 20,
                    activateYear: 30,
                    activateMonth: 40,
                    activateDay: 50,
                    specialProfilesArraySize: 60,
                    seasonProfilesArraySize: 70,
                    dayProfilesArraySize: 80
                }
            },
            bytes: [
                0x2c, 0x17,
                0x01, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x00, 0x00, 0x00,
                0x0a, 0x14, 0x1e, 0x28, 0x32, 0x3c, 0x46, 0x50
            ]
        }
    };
    const fromBytes$X = (bytes) => {
        if (bytes.length !== maxSize$X) {
            throw new Error('Invalid getRatePlanInfo data size.');
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            tariffTable: buffer.getUint8(),
            activePlan: buffer.getTariffPlan(),
            passivePlan: buffer.getTariffPlan()
        };
    };
    const toBytes$X = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$X);
        buffer.setUint8(parameters.tariffTable);
        buffer.setTariffPlan(parameters.activePlan);
        buffer.setTariffPlan(parameters.passivePlan);
        return toBytes$2f(id$X, buffer.data);
    };

    var getRatePlanInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$X,
        examples: examples$X,
        fromBytes: fromBytes$X,
        headerSize: headerSize$X,
        id: id$X,
        isLoraOnly: isLoraOnly$X,
        maxSize: maxSize$X,
        name: name$X,
        toBytes: toBytes$X
    });

    const id$W = getSaldo$3;
    const name$W = commandNames$2[getSaldo$3];
    const headerSize$W = 2;
    const maxSize$W = 29;
    const accessLevel$W = READ_ONLY;
    const isLoraOnly$W = false;
    const examples$W = {
        'test response': {
            id: id$W,
            name: name$W,
            headerSize: headerSize$W,
            maxSize: maxSize$W,
            accessLevel: accessLevel$W,
            parameters: {
                currentSaldo: 1,
                count: 0,
                energy: [2, 3, 4, 5],
                beginSaldoOfPeriod: 7,
                date: {
                    month: 9,
                    date: 23,
                    hours: 6,
                    minutes: 35
                }
            },
            bytes: [
                0x29, 0x1d,
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
                0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x09, 0x17, 0x06, 0x23
            ]
        }
    };
    const fromBytes$W = (bytes) => {
        if (bytes.length !== maxSize$W) {
            throw new Error('Invalid getSaldo data size.');
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        return {
            currentSaldo: buffer.getInt32(),
            count: buffer.getUint8(),
            energy: new Array(4).fill(0).map(() => buffer.getInt32()),
            beginSaldoOfPeriod: buffer.getInt32(),
            date: {
                month: buffer.getUint8(),
                date: buffer.getUint8(),
                hours: buffer.getUint8(),
                minutes: buffer.getUint8()
            }
        };
    };
    const toBytes$W = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$W);
        buffer.setInt32(parameters.currentSaldo);
        buffer.setUint8(parameters.count);
        parameters.energy.forEach(value => buffer.setInt32(value));
        buffer.setInt32(parameters.beginSaldoOfPeriod);
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);
        return toBytes$2f(id$W, buffer.data);
    };

    var getSaldo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$W,
        examples: examples$W,
        fromBytes: fromBytes$W,
        headerSize: headerSize$W,
        id: id$W,
        isLoraOnly: isLoraOnly$W,
        maxSize: maxSize$W,
        name: name$W,
        toBytes: toBytes$W
    });

    const id$V = getSaldoParameters$3;
    const name$V = commandNames$2[getSaldoParameters$3];
    const headerSize$V = 2;
    const maxSize$V = 37;
    const accessLevel$V = READ_ONLY;
    const isLoraOnly$V = false;
    const examples$V = {
        'default response': {
            id: id$V,
            name: name$V,
            headerSize: headerSize$V,
            maxSize: maxSize$V,
            accessLevel: accessLevel$V,
            parameters: {
                coefficients: [0, 0, 0, 0],
                decimalPointTariff: 0,
                indicationThreshold: 0,
                relayThreshold: 0,
                mode: 0,
                saldoOffTimeBegin: 0,
                saldoOffTimeEnd: 0,
                decimalPointIndication: 0,
                powerThreshold: 0,
                creditThreshold: 0
            },
            bytes: [
                0x2e, 0x25,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ]
        },
        'test response': {
            id: id$V,
            name: name$V,
            headerSize: headerSize$V,
            maxSize: maxSize$V,
            accessLevel: accessLevel$V,
            parameters: {
                coefficients: [2, 3, 4, 5],
                decimalPointTariff: 6,
                indicationThreshold: 7,
                relayThreshold: 8,
                mode: 9,
                saldoOffTimeBegin: 10,
                saldoOffTimeEnd: 11,
                decimalPointIndication: 12,
                powerThreshold: 13,
                creditThreshold: 14
            },
            bytes: [
                0x2e, 0x25,
                0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05,
                0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00,
                0x0d, 0x00, 0x00, 0x00, 0x0e
            ]
        }
    };
    const fromBytes$V = (bytes) => {
        if (bytes.length !== maxSize$V) {
            throw new Error('Invalid getSaldoParameters data size.');
        }
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getSaldoParameters();
    };
    const toBytes$V = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$V);
        buffer.setSaldoParameters(parameters);
        return toBytes$2f(id$V, buffer.data);
    };

    var getSaldoParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$V,
        examples: examples$V,
        fromBytes: fromBytes$V,
        headerSize: headerSize$V,
        id: id$V,
        isLoraOnly: isLoraOnly$V,
        maxSize: maxSize$V,
        name: name$V,
        toBytes: toBytes$V
    });

    const id$U = getSeasonProfile$3;
    const name$U = commandNames$2[getSeasonProfile$3];
    const headerSize$U = 2;
    const maxSize$U = 9;
    const accessLevel$U = READ_ONLY;
    const isLoraOnly$U = false;
    const examples$U = {
        'simple response': {
            id: id$U,
            name: name$U,
            headerSize: headerSize$U,
            maxSize: maxSize$U,
            accessLevel: accessLevel$U,
            parameters: {
                month: 1,
                date: 2,
                dayIndexes: [0, 1, 0, 1, 0, 1, 0]
            },
            bytes: [
                0x3c, 0x09,
                0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00
            ]
        }
    };
    const fromBytes$U = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getSeasonProfile();
    };
    const toBytes$U = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$U);
        buffer.setSeasonProfile(parameters);
        return toBytes$2f(id$U, buffer.data);
    };

    var getSeasonProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$U,
        examples: examples$U,
        fromBytes: fromBytes$U,
        headerSize: headerSize$U,
        id: id$U,
        isLoraOnly: isLoraOnly$U,
        maxSize: maxSize$U,
        name: name$U,
        toBytes: toBytes$U
    });

    const id$T = getSpecialDay$3;
    const name$T = commandNames$2[getSpecialDay$3];
    const headerSize$T = 2;
    const maxSize$T = 4;
    const accessLevel$T = READ_ONLY;
    const isLoraOnly$T = false;
    const examples$T = {
        'special day response': {
            id: id$T,
            name: name$T,
            headerSize: headerSize$T,
            maxSize: maxSize$T,
            accessLevel: accessLevel$T,
            parameters: {
                month: 1,
                date: 9,
                dayIndex: 3,
                isPeriodic: true
            },
            bytes: [
                0x3d, 0x04,
                0x01, 0x09, 0x03, 0x00
            ]
        }
    };
    const fromBytes$T = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        return buffer.getSpecialDay();
    };
    const toBytes$T = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$T);
        buffer.setSpecialDay(parameters);
        return toBytes$2f(id$T, buffer.data);
    };

    var getSpecialDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$T,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$T,
        id: id$T,
        isLoraOnly: isLoraOnly$T,
        maxSize: maxSize$T,
        name: name$T,
        toBytes: toBytes$T
    });

    const id$S = getVersion$3;
    const name$S = commandNames$2[getVersion$3];
    const headerSize$S = 2;
    const maxSize$S = 10;
    const accessLevel$S = READ_ONLY;
    const isLoraOnly$S = false;
    const examples$S = {
        'simple response': {
            id: id$S,
            name: name$S,
            headerSize: headerSize$S,
            maxSize: maxSize$S,
            accessLevel: accessLevel$S,
            parameters: {
                version: '104.25.003'
            },
            bytes: [
                0x28, 0x0a,
                0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33
            ]
        }
    };
    const fromBytes$S = (bytes) => ({ version: String.fromCharCode.apply(null, [...bytes]) });
    const toBytes$S = (parameters) => {
        const version = parameters.version.split('').map(char => char.charCodeAt(0));
        return toBytes$2f(id$S, version);
    };

    var getVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$S,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        isLoraOnly: isLoraOnly$S,
        maxSize: maxSize$S,
        name: name$S,
        toBytes: toBytes$S
    });

    const id$R = prepareRatePlan$3;
    const name$R = commandNames$2[prepareRatePlan$3];
    const headerSize$R = 2;
    const maxSize$R = 0;
    const accessLevel$R = READ_WRITE;
    const isLoraOnly$R = false;
    const examples$R = {
        'simple response': {
            id: id$R,
            name: name$R,
            headerSize: headerSize$R,
            maxSize: maxSize$R,
            accessLevel: accessLevel$R,
            parameters: {},
            bytes: [
                0x14, 0x00
            ]
        }
    };
    const fromBytes$R = (bytes) => {
        if (bytes.length !== maxSize$R) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$R = () => toBytes$2f(id$R);

    var prepareRatePlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$R,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$R,
        id: id$R,
        isLoraOnly: isLoraOnly$R,
        maxSize: maxSize$R,
        name: name$R,
        toBytes: toBytes$R
    });

    const id$Q = resetPowerMaxDay$3;
    const name$Q = commandNames$2[resetPowerMaxDay$3];
    const headerSize$Q = 2;
    const maxSize$Q = 0;
    const accessLevel$Q = READ_WRITE;
    const isLoraOnly$Q = false;
    const examples$Q = {
        'simple response': {
            id: id$Q,
            name: name$Q,
            headerSize: headerSize$Q,
            maxSize: maxSize$Q,
            accessLevel: accessLevel$Q,
            parameters: {},
            bytes: [
                0x35, 0x00
            ]
        }
    };
    const fromBytes$Q = (bytes) => {
        if (bytes.length !== maxSize$Q) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$Q = () => toBytes$2f(id$Q);

    var resetPowerMaxDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Q,
        examples: examples$Q,
        fromBytes: fromBytes$Q,
        headerSize: headerSize$Q,
        id: id$Q,
        isLoraOnly: isLoraOnly$Q,
        maxSize: maxSize$Q,
        name: name$Q,
        toBytes: toBytes$Q
    });

    const id$P = resetPowerMaxMonth$3;
    const name$P = commandNames$2[resetPowerMaxMonth$3];
    const headerSize$P = 2;
    const maxSize$P = 0;
    const accessLevel$P = READ_WRITE;
    const isLoraOnly$P = false;
    const examples$P = {
        'simple response': {
            id: id$P,
            name: name$P,
            headerSize: headerSize$P,
            maxSize: maxSize$P,
            accessLevel: accessLevel$P,
            parameters: {},
            bytes: [
                0x36, 0x00
            ]
        }
    };
    const fromBytes$P = (bytes) => {
        if (bytes.length !== maxSize$P) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$P = () => toBytes$2f(id$P);

    var resetPowerMaxMonth = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$P,
        examples: examples$P,
        fromBytes: fromBytes$P,
        headerSize: headerSize$P,
        id: id$P,
        isLoraOnly: isLoraOnly$P,
        maxSize: maxSize$P,
        name: name$P,
        toBytes: toBytes$P
    });

    const id$O = runTariffPlan$3;
    const name$O = commandNames$2[runTariffPlan$3];
    const headerSize$O = 2;
    const maxSize$O = 0;
    const accessLevel$O = READ_WRITE;
    const isLoraOnly$O = false;
    const examples$O = {
        'simple response': {
            id: id$O,
            name: name$O,
            headerSize: headerSize$O,
            maxSize: maxSize$O,
            accessLevel: accessLevel$O,
            parameters: {},
            bytes: [
                0x46, 0x00
            ]
        }
    };
    const fromBytes$O = (bytes) => {
        if (bytes.length !== maxSize$O) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$O = () => toBytes$2f(id$O);

    var runTariffPlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$O,
        examples: examples$O,
        fromBytes: fromBytes$O,
        headerSize: headerSize$O,
        id: id$O,
        isLoraOnly: isLoraOnly$O,
        maxSize: maxSize$O,
        name: name$O,
        toBytes: toBytes$O
    });

    const id$N = setAccessKey$3;
    const name$N = commandNames$2[setAccessKey$3];
    const headerSize$N = 2;
    const maxSize$N = 0;
    const accessLevel$N = READ_WRITE;
    const isLoraOnly$N = false;
    const examples$N = {
        'simple response': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            accessLevel: accessLevel$N,
            parameters: {},
            bytes: [
                0x09, 0x00
            ]
        }
    };
    const fromBytes$N = (bytes) => {
        if (bytes.length !== maxSize$N) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$N = () => toBytes$2f(id$N);

    var setAccessKey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$N,
        examples: examples$N,
        fromBytes: fromBytes$N,
        headerSize: headerSize$N,
        id: id$N,
        isLoraOnly: isLoraOnly$N,
        maxSize: maxSize$N,
        name: name$N,
        toBytes: toBytes$N
    });

    const id$M = setCorrectDateTime$3;
    const name$M = commandNames$2[setCorrectDateTime$3];
    const headerSize$M = 2;
    const maxSize$M = 0;
    const accessLevel$M = READ_ONLY;
    const isLoraOnly$M = false;
    const examples$M = {
        'simple response': {
            id: id$M,
            name: name$M,
            headerSize: headerSize$M,
            maxSize: maxSize$M,
            accessLevel: accessLevel$M,
            parameters: {},
            bytes: [
                0x5c, 0x00
            ]
        }
    };
    const fromBytes$M = (bytes) => {
        if (bytes.length !== maxSize$M) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$M = () => toBytes$2f(id$M);

    var setCorrectDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$M,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$M,
        id: id$M,
        isLoraOnly: isLoraOnly$M,
        maxSize: maxSize$M,
        name: name$M,
        toBytes: toBytes$M
    });

    const id$L = setCorrectTime$3;
    const name$L = commandNames$2[setCorrectTime$3];
    const headerSize$L = 2;
    const maxSize$L = 0;
    const accessLevel$L = READ_WRITE;
    const isLoraOnly$L = false;
    const examples$L = {
        'simple response': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            maxSize: maxSize$L,
            accessLevel: accessLevel$L,
            parameters: {},
            bytes: [
                0x1c, 0x00
            ]
        }
    };
    const fromBytes$L = (bytes) => {
        if (bytes.length !== maxSize$L) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$L = () => toBytes$2f(id$L);

    var setCorrectTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$L,
        examples: examples$L,
        fromBytes: fromBytes$L,
        headerSize: headerSize$L,
        id: id$L,
        isLoraOnly: isLoraOnly$L,
        maxSize: maxSize$L,
        name: name$L,
        toBytes: toBytes$L
    });

    const id$K = setDateTime$3;
    const name$K = commandNames$2[setDateTime$3];
    const headerSize$K = 2;
    const maxSize$K = 0;
    const accessLevel$K = READ_ONLY;
    const isLoraOnly$K = false;
    const examples$K = {
        'simple response': {
            id: id$K,
            name: name$K,
            headerSize: headerSize$K,
            maxSize: maxSize$K,
            accessLevel: accessLevel$K,
            parameters: {},
            bytes: [
                0x08, 0x00
            ]
        }
    };
    const fromBytes$K = (bytes) => {
        if (bytes.length !== maxSize$K) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$K = () => toBytes$2f(id$K);

    var setDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$K,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        isLoraOnly: isLoraOnly$K,
        maxSize: maxSize$K,
        name: name$K,
        toBytes: toBytes$K
    });

    const id$J = setDayProfile$3;
    const name$J = commandNames$2[setDayProfile$3];
    const headerSize$J = 2;
    const maxSize$J = 0;
    const accessLevel$J = READ_WRITE;
    const isLoraOnly$J = false;
    const examples$J = {
        'simple response': {
            id: id$J,
            name: name$J,
            headerSize: headerSize$J,
            maxSize: maxSize$J,
            accessLevel: accessLevel$J,
            parameters: {},
            bytes: [
                0x10, 0x00
            ]
        }
    };
    const fromBytes$J = (bytes) => {
        if (bytes.length !== maxSize$J) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$J = () => toBytes$2f(id$J);

    var setDayProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$J,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$J,
        id: id$J,
        isLoraOnly: isLoraOnly$J,
        maxSize: maxSize$J,
        name: name$J,
        toBytes: toBytes$J
    });

    const id$I = setDisplayParam$3;
    const name$I = commandNames$2[setDisplayParam$3];
    const headerSize$I = 2;
    const maxSize$I = 0;
    const accessLevel$I = READ_WRITE;
    const isLoraOnly$I = false;
    const examples$I = {
        'simple response': {
            id: id$I,
            name: name$I,
            headerSize: headerSize$I,
            maxSize: maxSize$I,
            accessLevel: accessLevel$I,
            parameters: {},
            bytes: [
                0x5d, 0x00
            ]
        }
    };
    const fromBytes$I = (bytes) => {
        if (bytes.length !== maxSize$I) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$I = () => toBytes$2f(id$I);

    var setDisplayParam = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$I,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$I,
        id: id$I,
        isLoraOnly: isLoraOnly$I,
        maxSize: maxSize$I,
        name: name$I,
        toBytes: toBytes$I
    });

    const id$H = setOperatorParameters$3;
    const name$H = commandNames$2[setOperatorParameters$3];
    const headerSize$H = 2;
    const maxSize$H = 0;
    const accessLevel$H = READ_WRITE;
    const isLoraOnly$H = false;
    const examples$H = {
        'simple response': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            maxSize: maxSize$H,
            accessLevel: accessLevel$H,
            parameters: {},
            bytes: [
                0x1f, 0x00
            ]
        }
    };
    const fromBytes$H = (bytes) => {
        if (bytes.length !== maxSize$H) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$H = () => toBytes$2f(id$H);

    var setOperatorParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$H,
        examples: examples$H,
        fromBytes: fromBytes$H,
        headerSize: headerSize$H,
        id: id$H,
        isLoraOnly: isLoraOnly$H,
        maxSize: maxSize$H,
        name: name$H,
        toBytes: toBytes$H
    });

    const id$G = setOperatorParametersExtended3$3;
    const name$G = commandNames$2[setOperatorParametersExtended3$3];
    const headerSize$G = 2;
    const maxSize$G = 0;
    const accessLevel$G = READ_WRITE;
    const isLoraOnly$G = false;
    const examples$G = {
        'simple response': {
            id: id$G,
            name: name$G,
            headerSize: headerSize$G,
            maxSize: maxSize$G,
            accessLevel: accessLevel$G,
            parameters: {},
            bytes: [
                0x72, 0x00
            ]
        }
    };
    const fromBytes$G = (bytes) => {
        if (bytes.length !== maxSize$G) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$G = () => toBytes$2f(id$G);

    var setOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$G,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$G,
        id: id$G,
        isLoraOnly: isLoraOnly$G,
        maxSize: maxSize$G,
        name: name$G,
        toBytes: toBytes$G
    });

    const id$F = setSaldo$3;
    const name$F = commandNames$2[setSaldo$3];
    const headerSize$F = 2;
    const maxSize$F = 0;
    const accessLevel$F = READ_WRITE;
    const isLoraOnly$F = false;
    const examples$F = {
        'simple response': {
            id: id$F,
            name: name$F,
            headerSize: headerSize$F,
            maxSize: maxSize$F,
            accessLevel: accessLevel$F,
            parameters: {},
            bytes: [
                0x2a, 0x00
            ]
        }
    };
    const fromBytes$F = (bytes) => {
        if (bytes.length !== maxSize$F) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$F = () => toBytes$2f(id$F);

    var setSaldo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$F,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$F,
        id: id$F,
        isLoraOnly: isLoraOnly$F,
        maxSize: maxSize$F,
        name: name$F,
        toBytes: toBytes$F
    });

    const id$E = setSaldoParameters$3;
    const name$E = commandNames$2[setSaldoParameters$3];
    const headerSize$E = 2;
    const maxSize$E = 0;
    const accessLevel$E = READ_WRITE;
    const isLoraOnly$E = false;
    const examples$E = {
        'simple response': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            maxSize: maxSize$E,
            accessLevel: accessLevel$E,
            parameters: {},
            bytes: [
                0x2f, 0x00
            ]
        }
    };
    const fromBytes$E = (bytes) => {
        if (bytes.length !== maxSize$E) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$E = () => toBytes$2f(id$E);

    var setSaldoParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$E,
        examples: examples$E,
        fromBytes: fromBytes$E,
        headerSize: headerSize$E,
        id: id$E,
        isLoraOnly: isLoraOnly$E,
        maxSize: maxSize$E,
        name: name$E,
        toBytes: toBytes$E
    });

    const id$D = setSeasonProfile$3;
    const name$D = commandNames$2[setSeasonProfile$3];
    const headerSize$D = 2;
    const maxSize$D = 0;
    const accessLevel$D = READ_WRITE;
    const isLoraOnly$D = false;
    const examples$D = {
        'simple response': {
            id: id$D,
            name: name$D,
            headerSize: headerSize$D,
            maxSize: maxSize$D,
            accessLevel: accessLevel$D,
            parameters: {},
            bytes: [
                0x11, 0x00
            ]
        }
    };
    const fromBytes$D = (bytes) => {
        if (bytes.length !== maxSize$D) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$D = () => toBytes$2f(id$D);

    var setSeasonProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$D,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$D,
        id: id$D,
        isLoraOnly: isLoraOnly$D,
        maxSize: maxSize$D,
        name: name$D,
        toBytes: toBytes$D
    });

    const id$C = setSpecialDay$3;
    const name$C = commandNames$2[setSpecialDay$3];
    const headerSize$C = 2;
    const maxSize$C = 0;
    const accessLevel$C = READ_WRITE;
    const isLoraOnly$C = false;
    const examples$C = {
        'simple response': {
            id: id$C,
            name: name$C,
            headerSize: headerSize$C,
            maxSize: maxSize$C,
            accessLevel: accessLevel$C,
            parameters: {},
            bytes: [
                0x12, 0x00
            ]
        }
    };
    const fromBytes$C = (bytes) => {
        if (bytes.length !== maxSize$C) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$C = () => toBytes$2f(id$C);

    var setSpecialDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$C,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        isLoraOnly: isLoraOnly$C,
        maxSize: maxSize$C,
        name: name$C,
        toBytes: toBytes$C
    });

    const id$B = setSpecialOperation$3;
    const name$B = commandNames$2[setSpecialOperation$3];
    const headerSize$B = 2;
    const maxSize$B = 1;
    const accessLevel$B = READ_WRITE;
    const isLoraOnly$B = false;
    const examples$B = {
        'electro-magnetic screen is present': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            maxSize: maxSize$B,
            accessLevel: accessLevel$B,
            parameters: {
                electroMagneticIndication: true,
                magneticIndication: false
            },
            bytes: [
                0x64, 0x01,
                0x01
            ]
        },
        'magnetic screen is present': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            maxSize: maxSize$B,
            accessLevel: accessLevel$B,
            parameters: {
                electroMagneticIndication: false,
                magneticIndication: true
            },
            bytes: [
                0x64, 0x01,
                0x02
            ]
        },
        'both screens are present': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            maxSize: maxSize$B,
            accessLevel: accessLevel$B,
            parameters: {
                electroMagneticIndication: true,
                magneticIndication: true
            },
            bytes: [
                0x64, 0x01,
                0x03
            ]
        }
    };
    const fromBytes$B = (bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        const flags = buffer.getUint8();
        const electroMagneticIndication = !!(flags & 1);
        const magneticIndication = !!(flags & 2);
        return {
            electroMagneticIndication,
            magneticIndication
        };
    };
    const toBytes$B = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$B);
        let flags = 0;
        if (parameters.electroMagneticIndication) {
            flags |= 1;
        }
        if (parameters.magneticIndication) {
            flags |= 2;
        }
        buffer.setUint8(flags);
        return toBytes$2f(id$B, buffer.data);
    };

    var setSpecialOperation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$B,
        examples: examples$B,
        fromBytes: fromBytes$B,
        headerSize: headerSize$B,
        id: id$B,
        isLoraOnly: isLoraOnly$B,
        maxSize: maxSize$B,
        name: name$B,
        toBytes: toBytes$B
    });

    const id$A = turnRelayOff$3;
    const name$A = commandNames$2[turnRelayOff$3];
    const headerSize$A = 2;
    const maxSize$A = 0;
    const accessLevel$A = READ_WRITE;
    const isLoraOnly$A = false;
    const examples$A = {
        'simple response': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            maxSize: maxSize$A,
            accessLevel: accessLevel$A,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$A = (bytes) => {
        if (bytes.length !== maxSize$A) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$A = () => toBytes$2f(id$A);

    var turnRelayOff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$A,
        examples: examples$A,
        fromBytes: fromBytes$A,
        headerSize: headerSize$A,
        id: id$A,
        isLoraOnly: isLoraOnly$A,
        maxSize: maxSize$A,
        name: name$A,
        toBytes: toBytes$A
    });

    const id$z = turnRelayOn$3;
    const name$z = commandNames$2[turnRelayOn$3];
    const headerSize$z = 2;
    const maxSize$z = 0;
    const accessLevel$z = READ_WRITE;
    const isLoraOnly$z = false;
    const examples$z = {
        'simple response': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            maxSize: maxSize$z,
            accessLevel: accessLevel$z,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$z = (bytes) => {
        if (bytes.length !== maxSize$z) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$z = () => toBytes$2f(id$z);

    var turnRelayOn = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$z,
        examples: examples$z,
        fromBytes: fromBytes$z,
        headerSize: headerSize$z,
        id: id$z,
        isLoraOnly: isLoraOnly$z,
        maxSize: maxSize$z,
        name: name$z,
        toBytes: toBytes$z
    });

    const id$y = errorResponse$2;
    const name$y = commandNames$2[errorResponse$2];
    const headerSize$y = 2;
    const accessLevel$y = READ_ONLY;
    const maxSize$y = 2;
    const isLoraOnly$y = false;
    const examples$y = {
        'ACCESS_DENIED on TurnRelayOn command': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            maxSize: maxSize$y,
            accessLevel: accessLevel$y,
            parameters: {
                commandId: 0x18,
                commandName: 'turnRelayOn',
                errorCode: ACCESS_DENIED,
                errorName: 'ACCESS_DENIED'
            },
            bytes: [
                0xfe, 0x02,
                0x18, 0x93
            ]
        }
    };
    const getFromBytes$1 = (commandNamesParameter) => ((bytes) => {
        const buffer = new CommandBinaryBuffer$2(bytes);
        const errorCommandId = buffer.getUint8();
        const errorCode = buffer.getUint8();
        return {
            commandId: errorCommandId,
            commandName: commandNamesParameter[errorCommandId],
            errorCode,
            errorName: resultNames[errorCode]
        };
    });
    const fromBytes$y = getFromBytes$1(commandNames$2);
    const toBytes$y = (parameters) => {
        const buffer = new CommandBinaryBuffer$2(maxSize$y);
        buffer.setUint8(parameters.commandId);
        buffer.setUint8(parameters.errorCode);
        return toBytes$2f(id$y, buffer.data);
    };

    var mtx1$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$y,
        examples: examples$y,
        fromBytes: fromBytes$y,
        getFromBytes: getFromBytes$1,
        headerSize: headerSize$y,
        id: id$y,
        isLoraOnly: isLoraOnly$y,
        maxSize: maxSize$y,
        name: name$y,
        toBytes: toBytes$y
    });

    const { id: id$x, name: name$x, headerSize: headerSize$x, accessLevel: accessLevel$x, maxSize: maxSize$x, isLoraOnly: isLoraOnly$x, toBytes: toBytes$x } = mtx1$1;
    const examples$x = {
        'NO_DATA_FOR_DATE on getHalfHourDemandVariExport command': {
            id: id$x,
            name: name$x,
            headerSize: headerSize$x,
            maxSize: maxSize$x,
            accessLevel: accessLevel$x,
            parameters: {
                commandId: 0x54,
                commandName: 'getHalfHourDemandVariExport',
                errorCode: NO_DATA_FOR_DATE,
                errorName: 'NO_DATA_FOR_DATE'
            },
            bytes: [
                0xfe, 0x02,
                0x54, 0x91
            ]
        }
    };
    const fromBytes$x = getFromBytes$1(commandNames);

    var errorResponse = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$x,
        examples: examples$x,
        fromBytes: fromBytes$x,
        headerSize: headerSize$x,
        id: id$x,
        isLoraOnly: isLoraOnly$x,
        maxSize: maxSize$x,
        name: name$x,
        toBytes: toBytes$x
    });

    const id$w = getCriticalEvent$2;
    const name$w = commandNames[getCriticalEvent$2];
    const headerSize$w = 2;
    const accessLevel$w = READ_ONLY;
    const maxSize$w = 9;
    const isLoraOnly$w = false;
    const examples$w = {
        'simple response': {
            id: id$w,
            name: name$w,
            headerSize: headerSize$w,
            accessLevel: accessLevel$w,
            maxSize: maxSize$w,
            parameters: {
                event: 1,
                index: 1,
                date: {
                    year: 23,
                    month: 3,
                    date: 12,
                    hours: 10,
                    minutes: 22,
                    seconds: 33
                },
                count: 7
            },
            bytes: [
                0x56, 0x09,
                0x01, 0x01, 0x17, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07
            ]
        }
    };
    const fromBytes$w = (bytes) => {
        if (bytes.length !== maxSize$w) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const [event, index, year, month, date, hours, minutes, seconds, count] = bytes;
        return {
            event,
            index,
            date: {
                year,
                month,
                date,
                hours,
                minutes,
                seconds
            },
            count
        };
    };
    const toBytes$w = (parameters) => {
        const { event, index, date, count } = parameters;
        return toBytes$2f(id$w, [
            event,
            index,
            date.year,
            date.month,
            date.date,
            date.hours,
            date.minutes,
            date.seconds,
            count
        ]);
    };

    var getCriticalEvent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$w,
        examples: examples$w,
        fromBytes: fromBytes$w,
        headerSize: headerSize$w,
        id: id$w,
        isLoraOnly: isLoraOnly$w,
        maxSize: maxSize$w,
        name: name$w,
        toBytes: toBytes$w
    });

    const id$v = getCurrentStatusMeter$1;
    const name$v = commandNames[getCurrentStatusMeter$1];
    const headerSize$v = 2;
    const maxSize$v = 41;
    const accessLevel$v = READ_ONLY;
    const isLoraOnly$v = false;
    const examples$v = {
        'simple response': {
            id: id$v,
            name: name$v,
            headerSize: headerSize$v,
            maxSize: maxSize$v,
            accessLevel: accessLevel$v,
            parameters: {
                operatingSeconds: 74320,
                tbadVAAll: 34567,
                tbadVBAll: 12345,
                tbadVCAll: 67890,
                tbadIMAXAll: 956726,
                tbadPMAXAll: 340,
                tbadFREQ: 436,
                relayStatus: true,
                statusEvent: {
                    CASE_OPEN: true,
                    MAGNETIC_ON: false,
                    PARAMETERS_UPDATE_REMOTE: true,
                    PARAMETERS_UPDATE_LOCAL: false,
                    RESTART: false,
                    ERROR_ACCESS: false,
                    TIME_SET: false,
                    TIME_CORRECT: true,
                    DEVICE_FAILURE: false,
                    CASE_TERMINAL_OPEN: false,
                    CASE_MODULE_OPEN: false,
                    TARIFF_TABLE_SET: false,
                    TARIFF_TABLE_GET: true,
                    PROTECTION_RESET_EM: false,
                    PROTECTION_RESET_MAGNETIC: false
                },
                centerAlert: true,
                calEnableFlag: true,
                currentTariffs: {
                    'A+': 1,
                    maximumPowers: 2,
                    'A-': 3
                },
                isSummerTime: true
            },
            bytes: [
                0x39, 0x29,
                0x00, 0x01, 0x22, 0x50,
                0x00, 0x00, 0x87, 0x07,
                0x00, 0x00, 0x30, 0x39,
                0x00, 0x01, 0x09, 0x32,
                0x00, 0x0e, 0x99, 0x36,
                0x00, 0x00, 0x01, 0x54,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x01, 0xb4,
                0x01,
                0x85,
                0x01,
                0x01,
                0x01,
                0x02,
                0x03,
                0x10,
                0x01
            ]
        }
    };
    const fromBytes$v = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        const operatingSeconds = buffer.getUint32();
        const tbadVAAll = buffer.getUint32();
        const tbadVBAll = buffer.getUint32();
        const tbadVCAll = buffer.getUint32();
        const tbadIMAXAll = buffer.getUint32();
        const tbadPMAXAll = buffer.getUint32();
        buffer.getUint32();
        const tbadFREQ = buffer.getUint32();
        const relayStatus = !!(buffer.getUint8() & 1);
        const statusEvent1 = buffer.getUint8();
        const centerAlert = !!(buffer.getUint8() & 1);
        const calEnableFlag = !!(buffer.getUint8() & 1);
        const currentTariffs = {
            'A+': buffer.getUint8(),
            maximumPowers: buffer.getUint8(),
            'A-': buffer.getUint8()
        };
        const statusEvent2 = buffer.getUint8();
        const isSummerTime = !!(buffer.getUint8() & 1);
        const statusEventValue = statusEvent1 | (statusEvent2 << 8);
        return {
            operatingSeconds,
            tbadVAAll,
            tbadVBAll,
            tbadVCAll,
            tbadIMAXAll,
            tbadPMAXAll,
            tbadFREQ,
            relayStatus,
            statusEvent: toObject(eventStatusMask, statusEventValue),
            centerAlert,
            calEnableFlag,
            currentTariffs,
            isSummerTime
        };
    };
    const toBytes$v = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$v);
        const statusEventValue = fromObject(eventStatusMask, parameters.statusEvent);
        buffer.setUint32(parameters.operatingSeconds);
        buffer.setUint32(parameters.tbadVAAll);
        buffer.setUint32(parameters.tbadVBAll);
        buffer.setUint32(parameters.tbadVCAll);
        buffer.setUint32(parameters.tbadIMAXAll);
        buffer.setUint32(parameters.tbadPMAXAll);
        buffer.setUint32(0);
        buffer.setUint32(parameters.tbadFREQ);
        buffer.setUint8(parameters.relayStatus ? 1 : 0);
        buffer.setUint8(statusEventValue & 0xff);
        buffer.setUint8(parameters.centerAlert ? 1 : 0);
        buffer.setUint8(parameters.calEnableFlag ? 1 : 0);
        buffer.setUint8(parameters.currentTariffs['A+']);
        buffer.setUint8(parameters.currentTariffs.maximumPowers);
        buffer.setUint8(parameters.currentTariffs['A-']);
        buffer.setUint8((statusEventValue >> 8) & 0xff);
        buffer.setUint8(parameters.isSummerTime ? 1 : 0);
        return toBytes$2f(id$v, buffer.data);
    };

    var getCurrentStatusMeter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$v,
        examples: examples$v,
        fromBytes: fromBytes$v,
        headerSize: headerSize$v,
        id: id$v,
        isLoraOnly: isLoraOnly$v,
        maxSize: maxSize$v,
        name: name$v,
        toBytes: toBytes$v
    });

    const defaultJsonOptions = {
        ...defaultDlmsJsonOptions,
        isGreen: false
    };

    const id$u = getCurrentValues$1;
    const name$u = commandNames[getCurrentValues$1];
    const headerSize$u = 2;
    const accessLevel$u = READ_ONLY;
    const maxSize$u = 52;
    const isLoraOnly$u = false;
    const examples$u = {
        'simple response': {
            id: id$u,
            name: name$u,
            maxSize: maxSize$u,
            headerSize: headerSize$u,
            accessLevel: accessLevel$u,
            parameters: {
                vaRms: 230000,
                vbRms: 231000,
                vcRms: 229000,
                iaRms: 5000,
                ibRms: 4900,
                icRms: 5050,
                powerA: 1150000,
                powerB: 1120000,
                powerC: 1160000,
                varA: 200000,
                varB: 195000,
                varC: 205000,
                iNeutral: 1500
            },
            bytes: [
                0x0d, 0x34,
                0x00, 0x03, 0x82, 0x70,
                0x00, 0x03, 0x86, 0x58,
                0x00, 0x03, 0x7e, 0x88,
                0x00, 0x00, 0x13, 0x88,
                0x00, 0x00, 0x13, 0x24,
                0x00, 0x00, 0x13, 0xba,
                0x00, 0x11, 0x8c, 0x30,
                0x00, 0x11, 0x17, 0x00,
                0x00, 0x11, 0xb3, 0x40,
                0x00, 0x03, 0x0d, 0x40,
                0x00, 0x02, 0xf9, 0xb8,
                0x00, 0x03, 0x20, 0xc8,
                0x00, 0x00, 0x05, 0xdc
            ]
        }
    };
    const fromBytes$u = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            vaRms: buffer.getInt32(),
            vbRms: buffer.getInt32(),
            vcRms: buffer.getInt32(),
            iaRms: buffer.getInt32(),
            ibRms: buffer.getInt32(),
            icRms: buffer.getInt32(),
            powerA: buffer.getInt32(),
            powerB: buffer.getInt32(),
            powerC: buffer.getInt32(),
            varA: buffer.getInt32(),
            varB: buffer.getInt32(),
            varC: buffer.getInt32(),
            iNeutral: buffer.getInt32()
        };
    };
    const toBytes$u = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$u);
        buffer.setInt32(parameters.vaRms);
        buffer.setInt32(parameters.vbRms);
        buffer.setInt32(parameters.vcRms);
        buffer.setInt32(parameters.iaRms);
        buffer.setInt32(parameters.ibRms);
        buffer.setInt32(parameters.icRms);
        buffer.setInt32(parameters.powerA);
        buffer.setInt32(parameters.powerB);
        buffer.setInt32(parameters.powerC);
        buffer.setInt32(parameters.varA);
        buffer.setInt32(parameters.varB);
        buffer.setInt32(parameters.varC);
        buffer.setInt32(parameters.iNeutral);
        return toBytes$2f(id$u, buffer.data);
    };
    const toJson$9 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const result = {
            '32.7.0': parameters.vaRms,
            '52.7.0': parameters.vbRms,
            '72.7.0': parameters.vcRms,
            '31.7.0': parameters.iaRms,
            '51.7.0': parameters.ibRms,
            '71.7.0': parameters.icRms,
            '1.21.7.0': parameters.powerA,
            '1.41.7.0': parameters.powerB,
            '1.61.7.0': parameters.powerC,
            '91.7.0': parameters.iNeutral
        };
        const varAKey = parameters.varA >= 0 ? '1.23.7.0' : '1.24.7.0';
        const varBKey = parameters.varB >= 0 ? '1.43.7.0' : '1.44.7.0';
        const varCKey = parameters.varC >= 0 ? '1.63.7.0' : '1.64.7.0';
        result[varAKey] = parameters.varA;
        result[varBKey] = parameters.varB;
        result[varCKey] = parameters.varC;
        return JSON.stringify(result);
    };

    var getCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$u,
        examples: examples$u,
        fromBytes: fromBytes$u,
        headerSize: headerSize$u,
        id: id$u,
        isLoraOnly: isLoraOnly$u,
        maxSize: maxSize$u,
        name: name$u,
        toBytes: toBytes$u,
        toJson: toJson$9
    });

    const OBIS_BASES = {
        wh: {
            [A_PLUS_R_PLUS_R_MINUS]: { gType: '1.8', rType: '1.8' },
            [A_MINUS_R_PLUS_R_MINUS]: { gType: '2.8' }
        },
        vari: {
            [A_PLUS_R_PLUS_R_MINUS]: { gType: '5.8', rType: '3.8' },
            [A_MINUS_R_PLUS_R_MINUS]: { gType: '6.8' }
        },
        vare: {
            [A_PLUS_R_PLUS_R_MINUS]: { gType: '8.8', rType: '4.8' },
            [A_MINUS_R_PLUS_R_MINUS]: { gType: '7.8' }
        }
    };
    var mapEnergiesToObisCodes = (energies, isGreen, energyType) => {
        const result = {};
        Object.keys(energies).forEach(energyCategory => {
            const obisBase = isGreen ? OBIS_BASES[energyCategory][energyType].gType : OBIS_BASES[energyCategory][energyType].rType;
            energies[energyCategory].forEach((energy, index) => {
                if (energy !== null && energy !== undefined) {
                    result[`${obisBase}.${index + 1}`] = energy;
                }
            });
        });
        return result;
    };

    const COMMAND_SIZE$1 = 51;
    const MAX_COMMAND_SIZE$2 = COMMAND_SIZE$1 + PACKED_ENERGY_TYPE_SIZE;
    const id$t = getDayDemand$2;
    const name$t = commandNames[getDayDemand$2];
    const headerSize$t = 2;
    const maxSize$t = MAX_COMMAND_SIZE$2;
    const accessLevel$t = READ_ONLY;
    const isLoraOnly$t = false;
    const examples$t = {
        'default A+, R+, R- energies': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
            maxSize: maxSize$t,
            accessLevel: accessLevel$t,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: {
                    wh: [40301230, 3334244, 15000, 2145623],
                    vari: [25000, 1234567, 789456, 9876543],
                    vare: [987654, 654321, 123456, 789012]
                }
            },
            bytes: [
                0x16, 0x33,
                0x18, 0x03, 0x16,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        },
        'received A-, R+, R- energies by T1, T4 only': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
            maxSize: maxSize$t,
            accessLevel: accessLevel$t,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 2,
                energies: {
                    wh: [40301230, null, null, 2145623],
                    vari: [25000, null, null, 9876543],
                    vare: [987654, null, null, 789012]
                }
            },
            bytes: [
                0x16, 0x1c,
                0x18, 0x03, 0x16,
                0x92,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$t = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$1) {
            parameters = {
                date: buffer.getDate(),
                energies: buffer.getEnergies()
            };
        }
        else {
            parameters = {
                date: buffer.getDate(),
                ...buffer.getPackedEnergyWithType()
            };
        }
        return parameters;
    };
    const toBytes$t = (parameters) => {
        const buffer = new CommandBinaryBuffer(getPackedEnergiesWithDateSize(parameters));
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$2f(id$t, buffer.data);
    };
    const toJson$8 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const { date, energyType, energies } = parameters;
        return JSON.stringify({
            date,
            ...mapEnergiesToObisCodes(energies, options.isGreen, energyType ?? A_PLUS_R_PLUS_R_MINUS)
        });
    };

    var getDayDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$t,
        examples: examples$t,
        fromBytes: fromBytes$t,
        headerSize: headerSize$t,
        id: id$t,
        isLoraOnly: isLoraOnly$t,
        maxSize: maxSize$t,
        name: name$t,
        toBytes: toBytes$t,
        toJson: toJson$8
    });

    const isGreen$3 = true;
    const id$s = getDayDemandExport$2;
    const name$s = commandNames[getDayDemandExport$2];
    const headerSize$s = 2;
    const maxSize$s = 51;
    const accessLevel$s = READ_ONLY;
    const isLoraOnly$s = false;
    const examples$s = {
        'simple response': {
            id: id$s,
            name: name$s,
            headerSize: headerSize$s,
            maxSize: maxSize$s,
            accessLevel: accessLevel$s,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: {
                    wh: [40301230, 3334244, 15000, 2145623],
                    vari: [25000, 1234567, 789456, 9876543],
                    vare: [987654, 654321, 123456, 789012]
                }
            },
            bytes: [
                0x4f, 0x33,
                0x18, 0x03, 0x16,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$s = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            date: buffer.getDate(),
            energies: buffer.getEnergies()
        };
    };
    const toBytes$s = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$s);
        buffer.setDate(parameters.date);
        buffer.setEnergies(parameters.energies);
        return toBytes$2f(id$s, buffer.data);
    };
    const toJson$7 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const { date, energies } = parameters;
        return JSON.stringify({
            date,
            ...mapEnergiesToObisCodes(energies, isGreen$3, A_MINUS_R_PLUS_R_MINUS)
        });
    };

    var getDayDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$s,
        examples: examples$s,
        fromBytes: fromBytes$s,
        headerSize: headerSize$s,
        id: id$s,
        isLoraOnly: isLoraOnly$s,
        maxSize: maxSize$s,
        name: name$s,
        toBytes: toBytes$s,
        toJson: toJson$7
    });

    const id$r = getDayMaxDemand$1;
    const name$r = commandNames[getDayMaxDemand$1];
    const headerSize$r = 2;
    const accessLevel$r = READ_ONLY;
    const maxSize$r = 75;
    const isLoraOnly$r = false;
    const examples$r = {
        'response for 2023.03.12': {
            id: id$r,
            name: name$r,
            headerSize: headerSize$r,
            accessLevel: accessLevel$r,
            maxSize: maxSize$r,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                maxDemands: [
                    {
                        hourPmax: 0,
                        minPmax: 10,
                        pmax: 100,
                        hourVariMax: 1,
                        minVariMax: 23,
                        variMax: 2000,
                        hourVareMax: 8,
                        minVareMax: 15,
                        vareMax: 5555
                    },
                    {
                        hourPmax: 2,
                        minPmax: 20,
                        pmax: 1000,
                        hourVariMax: 3,
                        minVariMax: 24,
                        variMax: 20000,
                        hourVareMax: 9,
                        minVareMax: 16,
                        vareMax: 55555
                    },
                    {
                        hourPmax: 4,
                        minPmax: 30,
                        pmax: 10000,
                        hourVariMax: 5,
                        minVariMax: 25,
                        variMax: 200000,
                        hourVareMax: 10,
                        minVareMax: 17,
                        vareMax: 555555
                    },
                    {
                        hourPmax: 6,
                        minPmax: 40,
                        pmax: 100000,
                        hourVariMax: 7,
                        minVariMax: 26,
                        variMax: 2000000,
                        hourVareMax: 11,
                        minVareMax: 18,
                        vareMax: 5555555
                    }
                ]
            },
            bytes: [
                0x31, 0x4b,
                0x17, 0x03, 0x0c,
                0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
                0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
                0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
                0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
            ]
        }
    };
    const fromBytes$r = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getDayMaxDemandResponse();
    };
    const toBytes$r = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$r);
        buffer.setDayMaxDemandResponse(parameters);
        return toBytes$2f(id$r, buffer.getBytesToOffset());
    };

    var getDayMaxDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$r,
        examples: examples$r,
        fromBytes: fromBytes$r,
        headerSize: headerSize$r,
        id: id$r,
        isLoraOnly: isLoraOnly$r,
        maxSize: maxSize$r,
        name: name$r,
        toBytes: toBytes$r
    });

    const id$q = getDayMaxDemandExport$1;
    const name$q = commandNames[getDayMaxDemandExport$1];
    const headerSize$q = 2;
    const accessLevel$q = READ_ONLY;
    const maxSize$q = 75;
    const isLoraOnly$q = false;
    const examples$q = {
        'response for 2023.03.12': {
            id: id$q,
            name: name$q,
            headerSize: headerSize$q,
            accessLevel: accessLevel$q,
            maxSize: maxSize$q,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                maxDemands: [
                    {
                        hourPmax: 0,
                        minPmax: 10,
                        pmax: 100,
                        hourVariMax: 1,
                        minVariMax: 23,
                        variMax: 2000,
                        hourVareMax: 8,
                        minVareMax: 15,
                        vareMax: 5555
                    },
                    {
                        hourPmax: 2,
                        minPmax: 20,
                        pmax: 1000,
                        hourVariMax: 3,
                        minVariMax: 24,
                        variMax: 20000,
                        hourVareMax: 9,
                        minVareMax: 16,
                        vareMax: 55555
                    },
                    {
                        hourPmax: 4,
                        minPmax: 30,
                        pmax: 10000,
                        hourVariMax: 5,
                        minVariMax: 25,
                        variMax: 200000,
                        hourVareMax: 10,
                        minVareMax: 17,
                        vareMax: 555555
                    },
                    {
                        hourPmax: 6,
                        minPmax: 40,
                        pmax: 100000,
                        hourVariMax: 7,
                        minVariMax: 26,
                        variMax: 2000000,
                        hourVareMax: 11,
                        minVareMax: 18,
                        vareMax: 5555555
                    }
                ]
            },
            bytes: [
                0x58, 0x4b,
                0x17, 0x03, 0x0c,
                0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
                0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
                0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
                0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
            ]
        }
    };
    const fromBytes$q = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getDayMaxDemandResponse();
    };
    const toBytes$q = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$q);
        buffer.setDayMaxDemandResponse(parameters);
        return toBytes$2f(id$q, buffer.getBytesToOffset());
    };

    var getDayMaxDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$q,
        examples: examples$q,
        fromBytes: fromBytes$q,
        headerSize: headerSize$q,
        id: id$q,
        isLoraOnly: isLoraOnly$q,
        maxSize: maxSize$q,
        name: name$q,
        toBytes: toBytes$q
    });

    const id$p = getDemand$2;
    const name$p = commandNames[getDemand$2];
    const headerSize$p = 2;
    const maxSize$p = maxSize$1q + 48 * 2;
    const accessLevel$p = READ_ONLY;
    const isLoraOnly$p = false;
    const examples$p = {
        'response for A+': {
            id: id$p,
            name: name$p,
            headerSize: headerSize$p,
            maxSize: maxSize$p,
            parameters: {
                date: {
                    year: 21,
                    month: 6,
                    date: 18
                },
                demandParam: 0x81,
                firstIndex: 0,
                count: 2,
                period: 30,
                demands: [2000, 43981]
            },
            bytes: [
                0x76, 0x0b,
                0x2a, 0xd2,
                0x81,
                0x00, 0x00,
                0x02,
                0x1e,
                0x07, 0xd0,
                0xab, 0xcd
            ]
        }
    };
    const fromBytes$p = (bytes) => {
        if (!bytes || bytes.length < maxSize$1q) {
            throw new Error('Invalid uplink GetDemand byte length.');
        }
        const buffer = new CommandBinaryBuffer(bytes);
        const parameters = buffer.getDemand();
        if (bytes.length !== maxSize$1q + (2 * parameters.count)) {
            throw new Error('Invalid uplink GetDemand demands byte length.');
        }
        const demands = new Array(parameters.count).fill(0).map(() => buffer.getUint16());
        return {
            ...parameters,
            demands
        };
    };
    const toBytes$p = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1q + parameters.count * 2);
        buffer.setDemand(parameters);
        parameters.demands.forEach(value => buffer.setUint16(value));
        return toBytes$2f(id$p, buffer.data);
    };

    var getDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$p,
        examples: examples$p,
        fromBytes: fromBytes$p,
        headerSize: headerSize$p,
        id: id$p,
        isLoraOnly: isLoraOnly$p,
        maxSize: maxSize$p,
        name: name$p,
        toBytes: toBytes$p
    });

    const id$o = getDisplayParam$2;
    const name$o = commandNames[getDisplayParam$2];
    const headerSize$o = 2;
    const maxSize$o = 65;
    const accessLevel$o = READ_ONLY;
    const isLoraOnly$o = false;
    const examples$o = {
        'mode with order': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            maxSize: maxSize$o,
            accessLevel: accessLevel$o,
            parameters: {
                displayMode: 0,
                order: [4, 5, 6, 7]
            },
            bytes: [
                0x5e, 0x05,
                0x00, 0x04, 0x05, 0x06, 0x07
            ]
        },
        'mode without order': {
            id: id$o,
            name: name$o,
            maxSize: maxSize$o,
            accessLevel: accessLevel$o,
            parameters: {
                displayMode: 1,
                order: []
            },
            bytes: [
                0x5e, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$o = (bytes) => {
        const [displayMode, ...order] = bytes;
        return { displayMode, order };
    };
    const toBytes$o = (parameters) => (toBytes$2f(id$o, [parameters.displayMode, ...parameters.order]));

    var getDisplayParam = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$o,
        examples: examples$o,
        fromBytes: fromBytes$o,
        headerSize: headerSize$o,
        id: id$o,
        isLoraOnly: isLoraOnly$o,
        maxSize: maxSize$o,
        name: name$o,
        toBytes: toBytes$o
    });

    const id$n = getEnergy$2;
    const name$n = commandNames[getEnergy$2];
    const headerSize$n = 2;
    const accessLevel$n = READ_ONLY;
    const maxSize$n = 48;
    const isLoraOnly$n = false;
    const examples$n = {
        'simple response': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
            maxSize: maxSize$n,
            accessLevel: accessLevel$n,
            parameters: {
                wh: [40301230, 3334244, 15000, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            },
            bytes: [
                0x0f, 0x30,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$n = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getEnergies();
    };
    const toBytes$n = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$n);
        buffer.setEnergies(parameters);
        return toBytes$2f(id$n, buffer.data);
    };
    const toJson$6 = (parameters, options = defaultJsonOptions) => (options.dlms
        ? JSON.stringify(mapEnergiesToObisCodes(parameters, options.isGreen, A_PLUS_R_PLUS_R_MINUS))
        : JSON.stringify(parameters));

    var getEnergy = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$n,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        isLoraOnly: isLoraOnly$n,
        maxSize: maxSize$n,
        name: name$n,
        toBytes: toBytes$n,
        toJson: toJson$6
    });

    const COMMAND_SIZE = 51;
    const MAX_COMMAND_SIZE$1 = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;
    const id$m = getEnergyDayPrevious$2;
    const name$m = commandNames[getEnergyDayPrevious$2];
    const headerSize$m = 2;
    const maxSize$m = MAX_COMMAND_SIZE$1;
    const accessLevel$m = READ_ONLY;
    const isLoraOnly$m = false;
    const examples$m = {
        'simple response': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            maxSize: maxSize$m,
            accessLevel: accessLevel$m,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: {
                    wh: [40301230, 3334244, 15000, 2145623],
                    vari: [25000, 1234567, 789456, 9876543],
                    vare: [987654, 654321, 123456, 789012]
                }
            },
            bytes: [
                0x03, 0x33,
                0x18, 0x03, 0x16,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        },
        'response with A-R+R- energy by T1, T4 only': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            maxSize: maxSize$m,
            accessLevel: accessLevel$m,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 2,
                energies: {
                    wh: [40301230, null, null, 2145623],
                    vari: [25000, null, null, 9876543],
                    vare: [987654, null, null, 789012]
                }
            },
            bytes: [
                0x03, 0x1c,
                0x18, 0x03, 0x16,
                0x92,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$m = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE) {
            parameters = {
                date: buffer.getDate(),
                energies: buffer.getEnergies()
            };
        }
        else {
            parameters = {
                date: buffer.getDate(),
                ...buffer.getPackedEnergyWithType()
            };
        }
        return parameters;
    };
    const toBytes$m = (parameters) => {
        const buffer = new CommandBinaryBuffer(getPackedEnergiesWithDateSize(parameters));
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$2f(id$m, buffer.data);
    };
    const toJson$5 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const { date, energyType, energies } = parameters;
        return JSON.stringify({
            date,
            ...mapEnergiesToObisCodes(energies, options.isGreen, energyType ?? A_PLUS_R_PLUS_R_MINUS)
        });
    };

    var getEnergyDayPrevious = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$m,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        isLoraOnly: isLoraOnly$m,
        maxSize: maxSize$m,
        name: name$m,
        toBytes: toBytes$m,
        toJson: toJson$5
    });

    const isGreen$2 = true;
    const id$l = getEnergyExport$2;
    const name$l = commandNames[getEnergyExport$2];
    const headerSize$l = 2;
    const accessLevel$l = READ_ONLY;
    const maxSize$l = 48;
    const isLoraOnly$l = false;
    const examples$l = {
        'simple response': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            maxSize: maxSize$l,
            accessLevel: accessLevel$l,
            parameters: {
                wh: [40301230, 3334244, 15000, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            },
            bytes: [
                0x4e, 0x30,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$l = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getEnergies();
    };
    const toBytes$l = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$l);
        buffer.setEnergies(parameters);
        return toBytes$2f(id$l, buffer.data);
    };
    const toJson$4 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        return JSON.stringify(mapEnergiesToObisCodes(parameters, isGreen$2, A_MINUS_R_PLUS_R_MINUS));
    };

    var getEnergyExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$l,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        isLoraOnly: isLoraOnly$l,
        maxSize: maxSize$l,
        name: name$l,
        toBytes: toBytes$l,
        toJson: toJson$4
    });

    const isGreen$1 = true;
    const id$k = getEnergyExportDayPrevious$2;
    const name$k = commandNames[getEnergyExportDayPrevious$2];
    const headerSize$k = 2;
    const maxSize$k = 48;
    const accessLevel$k = READ_ONLY;
    const isLoraOnly$k = false;
    const examples$k = {
        'simple response': {
            id: id$k,
            name: name$k,
            headerSize: headerSize$k,
            maxSize: maxSize$k,
            accessLevel: accessLevel$k,
            parameters: {
                wh: [40301230, 3334244, 15000, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            },
            bytes: [
                0x50, 0x30,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$k = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getEnergies();
    };
    const toBytes$k = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$k);
        buffer.setEnergies(parameters);
        return toBytes$2f(id$k, buffer.data);
    };
    const toJson$3 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        return JSON.stringify(mapEnergiesToObisCodes(parameters, isGreen$1, A_MINUS_R_PLUS_R_MINUS));
    };

    var getEnergyExportDayPrevious = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$k,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        isLoraOnly: isLoraOnly$k,
        maxSize: maxSize$k,
        name: name$k,
        toBytes: toBytes$k,
        toJson: toJson$3
    });

    const BODY_WITHOUT_EVENTS_SIZE = 3 + 1;
    const EVENT_SIZE = 4;
    const id$j = getEvents$3;
    const name$j = commandNames$2[getEvents$3];
    const headerSize$j = 2;
    const accessLevel$j = READ_ONLY;
    const maxSize$j = BODY_WITHOUT_EVENTS_SIZE + 255 * EVENT_SIZE;
    const isLoraOnly$j = false;
    const examples$j = {
        'simple response': {
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
            accessLevel: accessLevel$j,
            maxSize: maxSize$j,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                eventsNumber: 2,
                events: [
                    {
                        hours: 1,
                        minutes: 12,
                        seconds: 33,
                        event: 157,
                        eventName: 'POWER_OVER_RELAY_OFF',
                        power: [22, 25, 12, 143]
                    },
                    {
                        hours: 1,
                        minutes: 12,
                        seconds: 33,
                        event: 121,
                        eventName: 'TIME_CORRECT',
                        newDate: {
                            isSummerTime: false,
                            seconds: 10,
                            minutes: 22,
                            hours: 3,
                            day: 4,
                            date: 12,
                            month: 7,
                            year: 24
                        }
                    }
                ]
            },
            bytes: [
                0x33, 0x18,
                0x17, 0x03, 0x0c, 0x02, 0x01, 0x0c, 0x21, 0x9d, 0x16, 0x19, 0x0c, 0x8f,
                0x01, 0x0c, 0x21, 0x79, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18
            ]
        }
    };
    const getFromBytes = BinaryBufferConstructor => ((bytes) => {
        if (bytes.length > maxSize$j) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new BinaryBufferConstructor(bytes);
        const date = buffer.getDate();
        const eventsNumber = buffer.getUint8();
        const events = [];
        while (!buffer.isEmpty) {
            events.push(buffer.getEvent());
        }
        return { date, eventsNumber, events };
    });
    const getToBytes = BinaryBufferConstructor => ((parameters) => {
        const buffer = new BinaryBufferConstructor(maxSize$j);
        buffer.setDate(parameters.date);
        buffer.setUint8(parameters.eventsNumber);
        for (const event of parameters.events) {
            buffer.setEvent(event);
        }
        return toBytes$2f(id$j, buffer.getBytesToOffset());
    });
    const fromBytes$j = getFromBytes(CommandBinaryBuffer$2);
    const toBytes$j = getToBytes(CommandBinaryBuffer$2);

    var mtx1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$j,
        examples: examples$j,
        fromBytes: fromBytes$j,
        getFromBytes: getFromBytes,
        getToBytes: getToBytes,
        headerSize: headerSize$j,
        id: id$j,
        isLoraOnly: isLoraOnly$j,
        maxSize: maxSize$j,
        name: name$j,
        toBytes: toBytes$j
    });

    const { id: id$i, name: name$i, headerSize: headerSize$i, accessLevel: accessLevel$i, maxSize: maxSize$i, isLoraOnly: isLoraOnly$i } = mtx1;
    const examples$i = {
        'simple response': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
            accessLevel: accessLevel$i,
            maxSize: maxSize$i,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                eventsNumber: 2,
                events: [
                    {
                        hours: 1,
                        minutes: 12,
                        seconds: 33,
                        event: 157,
                        eventName: 'POWER_OVER_RELAY_OFF',
                        power: [22, 25, 12, 143]
                    },
                    {
                        hours: 1,
                        minutes: 12,
                        seconds: 33,
                        event: 142,
                        eventName: 'TIME_CORRECT',
                        newDate: {
                            isSummerTime: false,
                            seconds: 10,
                            minutes: 22,
                            hours: 3,
                            day: 4,
                            date: 12,
                            month: 7,
                            year: 24
                        }
                    }
                ]
            },
            bytes: [
                0x33, 0x18,
                0x17, 0x03, 0x0c, 0x02, 0x01, 0x0c, 0x21, 0x9d, 0x16, 0x19, 0x0c, 0x8f,
                0x01, 0x0c, 0x21, 0x8e, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18
            ]
        }
    };
    const fromBytes$i = getFromBytes(CommandBinaryBuffer);
    const toBytes$i = getToBytes(CommandBinaryBuffer);

    var getEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$i,
        examples: examples$i,
        fromBytes: fromBytes$i,
        headerSize: headerSize$i,
        id: id$i,
        isLoraOnly: isLoraOnly$i,
        maxSize: maxSize$i,
        name: name$i,
        toBytes: toBytes$i
    });

    const id$h = getExtendedCurrentValues$1;
    const name$h = commandNames[getExtendedCurrentValues$1];
    const headerSize$h = 2;
    const maxSize$h = 38;
    const accessLevel$h = READ_ONLY;
    const isLoraOnly$h = false;
    const examples$h = {
        'simple response': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
            maxSize: maxSize$h,
            accessLevel: accessLevel$h,
            parameters: {
                temperature: 67,
                frequency: 60,
                vPhaseAB: 30,
                vPhaseAC: 45,
                pfA: 0.5,
                pfB: -0.5,
                pfC: 1,
                pf: 0.95,
                vaA: 5000,
                vaB: 4500,
                vaC: 4800,
                vaSum: 14300,
                uBatteryRtc: 338
            },
            bytes: [
                0x3a, 0x26,
                0x00, 0x43,
                0x00, 0x3c,
                0x00, 0x00, 0x00, 0x1e,
                0x00, 0x00, 0x00, 0x2d,
                0x01, 0xf4,
                0xfe, 0x0c,
                0x03, 0xe8,
                0x03, 0xb6,
                0x00, 0x00, 0x13, 0x88,
                0x00, 0x00, 0x11, 0x94,
                0x00, 0x00, 0x12, 0xc0,
                0x00, 0x00, 0x37, 0xdc,
                0x01, 0x52
            ]
        }
    };
    const fromBytes$h = (data) => {
        const buffer = new CommandBinaryBuffer(data);
        return {
            temperature: buffer.getInt16(),
            frequency: buffer.getUint16(),
            vPhaseAB: buffer.getInt32(),
            vPhaseAC: buffer.getInt32(),
            pfA: buffer.getInt16() / 1000,
            pfB: buffer.getInt16() / 1000,
            pfC: buffer.getInt16() / 1000,
            pf: buffer.getInt16() / 1000,
            vaA: buffer.getInt32(),
            vaB: buffer.getInt32(),
            vaC: buffer.getInt32(),
            vaSum: buffer.getInt32(),
            uBatteryRtc: buffer.getInt16()
        };
    };
    const toBytes$h = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$h);
        buffer.setInt16(parameters.temperature);
        buffer.setUint16(parameters.frequency);
        buffer.setInt32(parameters.vPhaseAB);
        buffer.setInt32(parameters.vPhaseAC);
        buffer.setInt16(parameters.pfA * 1000);
        buffer.setInt16(parameters.pfB * 1000);
        buffer.setInt16(parameters.pfC * 1000);
        buffer.setInt16(parameters.pf * 1000);
        buffer.setInt32(parameters.vaA);
        buffer.setInt32(parameters.vaB);
        buffer.setInt32(parameters.vaC);
        buffer.setInt32(parameters.vaSum);
        buffer.setInt16(parameters.uBatteryRtc);
        return toBytes$2f(id$h, buffer.data);
    };
    const toJson$2 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const result = {
            '0.11.0': parameters.temperature,
            '14.7.0': parameters.frequency,
            '33.7.0': parameters.pfA,
            '53.7.0': parameters.pfB,
            '73.7.0': parameters.pfC,
            '13.7.0': parameters.pf,
            '29.7.0': parameters.vaA,
            '49.7.0': parameters.vaB,
            '69.7.0': parameters.vaC,
            '9.7.0': parameters.vaSum,
            '96.6.3': parameters.uBatteryRtc,
            vPhaseAB: parameters.vPhaseAB,
            vPhaseAC: parameters.vPhaseAC
        };
        return JSON.stringify(result);
    };

    var getExtendedCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$h,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        isLoraOnly: isLoraOnly$h,
        maxSize: maxSize$h,
        name: name$h,
        toBytes: toBytes$h,
        toJson: toJson$2
    });

    const id$g = getHalfHourDemand$1;
    const name$g = commandNames[getHalfHourDemand$1];
    const headerSize$g = 2;
    const maxSize$g = MIN_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$g = READ_ONLY;
    const isLoraOnly$g = false;
    const examples$g = {
        'simple response': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            maxSize: maxSize$g,
            accessLevel: accessLevel$g,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x15, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            maxSize: maxSize$g,
            accessLevel: accessLevel$g,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x15, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$g = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$g = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$g, buffer.data);
    };

    var getHalfHourDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$g,
        examples: examples$g,
        fromBytes: fromBytes$g,
        headerSize: headerSize$g,
        id: id$g,
        isLoraOnly: isLoraOnly$g,
        maxSize: maxSize$g,
        name: name$g,
        toBytes: toBytes$g
    });

    const MIN_COMMAND_SIZE = MIN_HALF_HOUR_COMMAND_SIZE + 2;
    const MAX_COMMAND_SIZE = MAX_HALF_HOUR_COMMAND_SIZE + 2;
    const id$f = getHalfHourDemandChannel$2;
    const name$f = commandNames[getHalfHourDemandChannel$2];
    const headerSize$f = 2;
    const maxSize$f = MIN_COMMAND_SIZE;
    const accessLevel$f = READ_ONLY;
    const isLoraOnly$f = false;
    const examples$f = {
        'simple response': {
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
            maxSize: maxSize$f,
            accessLevel: accessLevel$f,
            parameters: {
                channel: 1,
                channelParameter: 16,
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x5a, 0x65,
                0x01,
                0x10,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
            maxSize: maxSize$f,
            accessLevel: accessLevel$f,
            parameters: {
                channel: 1,
                channelParameter: 16,
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x5a, 0x6a,
                0x01,
                0x10,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$f = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_COMMAND_SIZE;
        const channel = buffer.getUint8();
        const channelParameter = buffer.getUint8();
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                channel,
                channelParameter,
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return {
            channel,
            channelParameter,
            date,
            energies
        };
    };
    const toBytes$f = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setUint8(parameters.channel);
        buffer.setUint8(parameters.channelParameter);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$f, buffer.data);
    };

    var getHalfHourDemandChannel = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$f,
        examples: examples$f,
        fromBytes: fromBytes$f,
        headerSize: headerSize$f,
        id: id$f,
        isLoraOnly: isLoraOnly$f,
        maxSize: maxSize$f,
        name: name$f,
        toBytes: toBytes$f
    });

    const id$e = getHalfHourDemandExport$1;
    const name$e = commandNames[getHalfHourDemandExport$1];
    const headerSize$e = 2;
    const maxSize$e = MAX_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$e = READ_ONLY;
    const isLoraOnly$e = false;
    const examples$e = {
        'simple response': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            maxSize: maxSize$e,
            accessLevel: accessLevel$e,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x53, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            maxSize: maxSize$e,
            accessLevel: accessLevel$e,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x53, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$e = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$e = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$e, buffer.data);
    };

    var getHalfHourDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$e,
        examples: examples$e,
        fromBytes: fromBytes$e,
        headerSize: headerSize$e,
        id: id$e,
        isLoraOnly: isLoraOnly$e,
        maxSize: maxSize$e,
        name: name$e,
        toBytes: toBytes$e
    });

    const id$d = getHalfHourDemandVare$2;
    const name$d = commandNames[getHalfHourDemandVare$2];
    const headerSize$d = 2;
    const maxSize$d = MIN_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$d = READ_ONLY;
    const isLoraOnly$d = false;
    const examples$d = {
        'simple response': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            maxSize: maxSize$d,
            accessLevel: accessLevel$d,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x49, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            maxSize: maxSize$d,
            accessLevel: accessLevel$d,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x49, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$d = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$d = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$d, buffer.data);
    };

    var getHalfHourDemandVare = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$d,
        examples: examples$d,
        fromBytes: fromBytes$d,
        headerSize: headerSize$d,
        id: id$d,
        isLoraOnly: isLoraOnly$d,
        maxSize: maxSize$d,
        name: name$d,
        toBytes: toBytes$d
    });

    const id$c = getHalfHourDemandVareExport$2;
    const name$c = commandNames[getHalfHourDemandVareExport$2];
    const headerSize$c = 2;
    const maxSize$c = MIN_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$c = READ_ONLY;
    const isLoraOnly$c = false;
    const examples$c = {
        'simple response': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
            maxSize: maxSize$c,
            accessLevel: accessLevel$c,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x55, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
            maxSize: maxSize$c,
            accessLevel: accessLevel$c,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x55, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$c = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$c = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$c, buffer.data);
    };

    var getHalfHourDemandVareExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$c,
        examples: examples$c,
        fromBytes: fromBytes$c,
        headerSize: headerSize$c,
        id: id$c,
        isLoraOnly: isLoraOnly$c,
        maxSize: maxSize$c,
        name: name$c,
        toBytes: toBytes$c
    });

    const id$b = getHalfHourDemandVari$2;
    const name$b = commandNames[getHalfHourDemandVari$2];
    const headerSize$b = 2;
    const maxSize$b = MIN_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$b = READ_ONLY;
    const isLoraOnly$b = false;
    const examples$b = {
        'simple response': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            maxSize: maxSize$b,
            accessLevel: accessLevel$b,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x48, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            maxSize: maxSize$b,
            accessLevel: accessLevel$b,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x48, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$b = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$b = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$b, buffer.data);
    };

    var getHalfHourDemandVari = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$b,
        examples: examples$b,
        fromBytes: fromBytes$b,
        headerSize: headerSize$b,
        id: id$b,
        isLoraOnly: isLoraOnly$b,
        maxSize: maxSize$b,
        name: name$b,
        toBytes: toBytes$b
    });

    const id$a = getHalfHourDemandVariExport$2;
    const name$a = commandNames[getHalfHourDemandVariExport$2];
    const headerSize$a = 2;
    const maxSize$a = MIN_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$a = READ_ONLY;
    const isLoraOnly$a = false;
    const examples$a = {
        'simple response': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            maxSize: maxSize$a,
            accessLevel: accessLevel$a,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
                ]
            },
            bytes: [
                0x54, 0x63,
                0x18, 0x03, 0x16,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
            ]
        },
        'response for day when DST start/end': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            maxSize: maxSize$a,
            accessLevel: accessLevel$a,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                energies: [
                    1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                    2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                    3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                    4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                    5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
                ],
                dstHour: 3
            },
            bytes: [
                0x54, 0x68,
                0x18, 0x02, 0x1f,
                0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
                0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
                0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
                0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
                0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
                0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
                0x17, 0x70, 0x17, 0xdf,
                0x03
            ]
        }
    };
    const fromBytes$a = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                energies,
                dstHour: buffer.getUint8()
            };
        }
        return { date, energies };
    };
    const toBytes$a = (parameters) => {
        const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
        const buffer = new CommandBinaryBuffer(size);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.energies);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$2f(id$a, buffer.data);
    };

    var getHalfHourDemandVariExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$a,
        examples: examples$a,
        fromBytes: fromBytes$a,
        headerSize: headerSize$a,
        id: id$a,
        isLoraOnly: isLoraOnly$a,
        maxSize: maxSize$a,
        name: name$a,
        toBytes: toBytes$a
    });

    const id$9 = getMonthDemand$1;
    const name$9 = commandNames[getMonthDemand$1];
    const headerSize$9 = 2;
    const accessLevel$9 = READ_ONLY;
    const maxSize$9 = 50;
    const isLoraOnly$9 = false;
    const examples$9 = {
        'response energy for 2024.03': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
            maxSize: maxSize$9,
            accessLevel: accessLevel$9,
            parameters: {
                year: 24,
                month: 3,
                energies: {
                    wh: [40301230, 3334244, 15000, 2145623],
                    vari: [25000, 1234567, 789456, 9876543],
                    vare: [987654, 654321, 123456, 789012]
                }
            },
            bytes: [
                0x17, 0x32,
                0x18, 0x03,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$9 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            energies: buffer.getEnergies()
        };
    };
    const toBytes$9 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$9);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setEnergies(parameters.energies);
        return toBytes$2f(id$9, buffer.data);
    };
    const toJson$1 = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const { year, month, energies } = parameters;
        return JSON.stringify({
            year,
            month,
            ...mapEnergiesToObisCodes(energies, options.isGreen, A_PLUS_R_PLUS_R_MINUS)
        });
    };

    var getMonthDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$9,
        examples: examples$9,
        fromBytes: fromBytes$9,
        headerSize: headerSize$9,
        id: id$9,
        isLoraOnly: isLoraOnly$9,
        maxSize: maxSize$9,
        name: name$9,
        toBytes: toBytes$9,
        toJson: toJson$1
    });

    const isGreen = true;
    const id$8 = getMonthDemandExport$1;
    const name$8 = commandNames[getMonthDemandExport$1];
    const headerSize$8 = 2;
    const maxSize$8 = 50;
    const accessLevel$8 = READ_ONLY;
    const isLoraOnly$8 = false;
    const examples$8 = {
        'simple response': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            maxSize: maxSize$8,
            accessLevel: accessLevel$8,
            parameters: {
                year: 24,
                month: 3,
                energies: {
                    wh: [40301230, 3334244, 15000, 2145623],
                    vari: [25000, 1234567, 789456, 9876543],
                    vare: [987654, 654321, 123456, 789012]
                }
            },
            bytes: [
                0x52, 0x32,
                0x18, 0x03,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
                0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
                0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
                0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
            ]
        }
    };
    const fromBytes$8 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            energies: buffer.getEnergies()
        };
    };
    const toBytes$8 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$8);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setEnergies(parameters.energies);
        return toBytes$2f(id$8, buffer.data);
    };
    const toJson = (parameters, options = defaultJsonOptions) => {
        if (!options.dlms) {
            return JSON.stringify(parameters);
        }
        const { year, month, energies } = parameters;
        return JSON.stringify({
            year,
            month,
            ...mapEnergiesToObisCodes(energies, isGreen, A_MINUS_R_PLUS_R_MINUS)
        });
    };

    var getMonthDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$8,
        examples: examples$8,
        fromBytes: fromBytes$8,
        headerSize: headerSize$8,
        id: id$8,
        isLoraOnly: isLoraOnly$8,
        maxSize: maxSize$8,
        name: name$8,
        toBytes: toBytes$8,
        toJson: toJson
    });

    const id$7 = getMonthMaxDemand$1;
    const name$7 = commandNames[getMonthMaxDemand$1];
    const headerSize$7 = 2;
    const accessLevel$7 = READ_ONLY;
    const maxSize$7 = 74;
    const isLoraOnly$7 = false;
    const examples$7 = {
        'response for 2023.03': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
            accessLevel: accessLevel$7,
            maxSize: maxSize$7,
            parameters: {
                date: {
                    year: 23,
                    month: 3
                },
                maxDemands: [
                    {
                        hourPmax: 0,
                        minPmax: 10,
                        pmax: 100,
                        hourVariMax: 1,
                        minVariMax: 23,
                        variMax: 2000,
                        hourVareMax: 8,
                        minVareMax: 15,
                        vareMax: 5555
                    },
                    {
                        hourPmax: 2,
                        minPmax: 20,
                        pmax: 1000,
                        hourVariMax: 3,
                        minVariMax: 24,
                        variMax: 20000,
                        hourVareMax: 9,
                        minVareMax: 16,
                        vareMax: 55555
                    },
                    {
                        hourPmax: 4,
                        minPmax: 30,
                        pmax: 10000,
                        hourVariMax: 5,
                        minVariMax: 25,
                        variMax: 200000,
                        hourVareMax: 10,
                        minVareMax: 17,
                        vareMax: 555555
                    },
                    {
                        hourPmax: 6,
                        minPmax: 40,
                        pmax: 100000,
                        hourVariMax: 7,
                        minVariMax: 26,
                        variMax: 2000000,
                        hourVareMax: 11,
                        minVareMax: 18,
                        vareMax: 5555555
                    }
                ]
            },
            bytes: [
                0x32, 0x4a,
                0x17, 0x03,
                0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
                0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
                0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
                0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
            ]
        }
    };
    const fromBytes$7 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getMonthMaxDemandResponse();
    };
    const toBytes$7 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$7);
        buffer.setMonthMaxDemandResponse(parameters);
        return toBytes$2f(id$7, buffer.getBytesToOffset());
    };

    var getMonthMaxDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$7,
        examples: examples$7,
        fromBytes: fromBytes$7,
        headerSize: headerSize$7,
        id: id$7,
        isLoraOnly: isLoraOnly$7,
        maxSize: maxSize$7,
        name: name$7,
        toBytes: toBytes$7
    });

    const id$6 = getMonthMaxDemandExport$1;
    const name$6 = commandNames[getMonthMaxDemandExport$1];
    const headerSize$6 = 2;
    const accessLevel$6 = READ_ONLY;
    const maxSize$6 = 74;
    const isLoraOnly$6 = false;
    const examples$6 = {
        'response for 2023.03': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            accessLevel: accessLevel$6,
            maxSize: maxSize$6,
            parameters: {
                date: {
                    year: 23,
                    month: 3
                },
                maxDemands: [
                    {
                        hourPmax: 0,
                        minPmax: 10,
                        pmax: 100,
                        hourVariMax: 1,
                        minVariMax: 23,
                        variMax: 2000,
                        hourVareMax: 8,
                        minVareMax: 15,
                        vareMax: 5555
                    },
                    {
                        hourPmax: 2,
                        minPmax: 20,
                        pmax: 1000,
                        hourVariMax: 3,
                        minVariMax: 24,
                        variMax: 20000,
                        hourVareMax: 9,
                        minVareMax: 16,
                        vareMax: 55555
                    },
                    {
                        hourPmax: 4,
                        minPmax: 30,
                        pmax: 10000,
                        hourVariMax: 5,
                        minVariMax: 25,
                        variMax: 200000,
                        hourVareMax: 10,
                        minVareMax: 17,
                        vareMax: 555555
                    },
                    {
                        hourPmax: 6,
                        minPmax: 40,
                        pmax: 100000,
                        hourVariMax: 7,
                        minVariMax: 26,
                        variMax: 2000000,
                        hourVareMax: 11,
                        minVareMax: 18,
                        vareMax: 5555555
                    }
                ]
            },
            bytes: [
                0x59, 0x4a,
                0x17, 0x03,
                0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3,
                0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03,
                0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23,
                0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63
            ]
        }
    };
    const fromBytes$6 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getMonthMaxDemandResponse();
    };
    const toBytes$6 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$6);
        buffer.setMonthMaxDemandResponse(parameters);
        return toBytes$2f(id$6, buffer.getBytesToOffset());
    };

    var getMonthMaxDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$6,
        examples: examples$6,
        fromBytes: fromBytes$6,
        headerSize: headerSize$6,
        id: id$6,
        isLoraOnly: isLoraOnly$6,
        maxSize: maxSize$6,
        name: name$6,
        toBytes: toBytes$6
    });

    const id$5 = getOperatorParameters$1;
    const name$5 = commandNames[getOperatorParameters$1];
    const headerSize$5 = 2;
    const maxSize$5 = OPERATOR_PARAMETERS_SIZE;
    const accessLevel$5 = READ_ONLY;
    const isLoraOnly$5 = false;
    const examples$5 = {
        'get default operator parameters response': {
            id: id$5,
            name: name$5,
            headerSize: headerSize$5,
            maxSize: maxSize$5,
            accessLevel: accessLevel$5,
            parameters: {
                vpThreshold: 265000,
                vThreshold: 156000,
                ipThreshold: 120000,
                pmaxThreshold0: 31800,
                pmaxThreshold1: 31800,
                pmaxThreshold2: 31800,
                pmaxThreshold3: 31800,
                rmaxThreshold0: 31800,
                rmaxThreshold1: 31800,
                rmaxThreshold2: 31800,
                rmaxThreshold3: 31800,
                tint: 30,
                calcPeriodDate: 1,
                timeoutDisplay: 127,
                timeoutScreen: 7,
                displaySet1: {
                    SET_ALL_SEGMENT_DISPLAY: true,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    TOTAL_REACTIVE_ENERGY: true,
                    REACTIVE_ENERGY_T1: false,
                    REACTIVE_ENERGY_T2: false,
                    REACTIVE_ENERGY_T3: false,
                    REACTIVE_ENERGY_T4: false,
                    TOTAL_NEGATIVE_REACTIVE_ENERGY: true,
                    NEGATIVE_REACTIVE_ENERGY_T1: false,
                    NEGATIVE_REACTIVE_ENERGY_T2: false,
                    NEGATIVE_REACTIVE_ENERGY_T3: false,
                    NEGATIVE_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                    EXPORTED_REACTIVE_ENERGY_T1: false,
                    EXPORTED_REACTIVE_ENERGY_T2: false,
                    EXPORTED_REACTIVE_ENERGY_T3: false,
                    EXPORTED_REACTIVE_ENERGY_T4: false,
                    TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                    EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
                },
                displaySet2: {
                    CURRENT_IN_PHASE_A: false,
                    CURRENT_IN_PHASE_B: false,
                    CURRENT_IN_PHASE_C: false,
                    CURRENT_IN_NEUTRAL: false,
                    VOLTAGE_IN_PHASE_A: false,
                    VOLTAGE_IN_PHASE_B: false,
                    VOLTAGE_IN_PHASE_C: false,
                    BATTERY_VOLTAGE: false,
                    FREQUENCY: false,
                    ACTIVE_POWER_SUM: true,
                    ACTIVE_POWER_PHASE_A: false,
                    ACTIVE_POWER_PHASE_B: false,
                    ACTIVE_POWER_PHASE_C: false,
                    REACTIVE_POWER_QPLUS_SUM: true,
                    REACTIVE_POWER_QPLUS_PHASE_A: false,
                    REACTIVE_POWER_QPLUS_PHASE_B: false,
                    REACTIVE_POWER_QPLUS_PHASE_C: false,
                    REACTIVE_POWER_QMINUS_SUM: true,
                    REACTIVE_POWER_QMINUS_PHASE_A: false,
                    REACTIVE_POWER_QMINUS_PHASE_B: false,
                    REACTIVE_POWER_QMINUS_PHASE_C: false,
                    POWER_COEFFICIENT_SUM: false,
                    POWER_COEFFICIENT_PHASE_A: false,
                    POWER_COEFFICIENT_PHASE_B: false,
                    POWER_COEFFICIENT_PHASE_C: false,
                    APPARENT_POWER_QPLUS_SUM: false,
                    APPARENT_POWER_QPLUS_PHASE_A: false,
                    APPARENT_POWER_QPLUS_PHASE_B: false,
                    APPARENT_POWER_QPLUS_PHASE_C: false,
                    APPARENT_POWER_QMINUS_SUM: false,
                    APPARENT_POWER_QMINUS_PHASE_A: false,
                    APPARENT_POWER_QMINUS_PHASE_B: false
                },
                displaySet3: {
                    APPARENT_POWER_QMINUS_PHASE_C: false,
                    MAX_ACTIVE_POWER_DAY_T1: false,
                    MAX_ACTIVE_POWER_DAY_T2: false,
                    MAX_ACTIVE_POWER_DAY_T3: false,
                    MAX_ACTIVE_POWER_DAY_T4: false,
                    MAX_ACTIVE_POWER_MONTH_T1: false,
                    MAX_ACTIVE_POWER_MONTH_T2: false,
                    MAX_ACTIVE_POWER_MONTH_T3: false,
                    MAX_ACTIVE_POWER_MONTH_T4: false,
                    MAX_REACTIVE_POWER_DAY_T1: false,
                    MAX_REACTIVE_POWER_DAY_T2: false,
                    MAX_REACTIVE_POWER_DAY_T3: false,
                    MAX_REACTIVE_POWER_DAY_T4: false,
                    MAX_REACTIVE_POWER_MONTH_T1: false,
                    MAX_REACTIVE_POWER_MONTH_T2: false,
                    MAX_REACTIVE_POWER_MONTH_T3: false,
                    MAX_REACTIVE_POWER_MONTH_T4: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
                    MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
                    MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T1: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T2: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T3: false,
                    MAX_EXPORTED_ACTIVE_POWER_DAY_T4: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: false,
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: false
                },
                relaySet: {
                    RELAY_ON_Y: true,
                    RELAY_ON_CENTER: true,
                    RELAY_ON_PB: false,
                    RELAY_ON_TARIFF_0: false,
                    RELAY_ON_TARIFF_1: false,
                    RELAY_ON_TARIFF_2: false,
                    RELAY_ON_TARIFF_3: false,
                    RELAY_ON_V_GOOD: false,
                    RELAY_OFF_Y: true,
                    RELAY_OFF_CENTER: true,
                    RELAY_OFF_TARIFF_0: false,
                    RELAY_OFF_TARIFF_1: false,
                    RELAY_OFF_TARIFF_2: false,
                    RELAY_OFF_TARIFF_3: false,
                    RELAY_OFF_I_LIMIT: false,
                    RELAY_OFF_V_BAD: false,
                    RELAY_OFF_DIFF_BAD: false,
                    RELAY_OFF_LIM_TARIFF_0: false,
                    RELAY_OFF_LIM_TARIFF_1: false,
                    RELAY_OFF_LIM_TARIFF_2: false,
                    RELAY_OFF_LIM_TARIFF_3: false,
                    RELAY_OFF_LIM_VAR_TARIFF_0: false,
                    RELAY_OFF_LIM_VAR_TARIFF_1: false,
                    RELAY_OFF_LIM_VAR_TARIFF_2: false,
                    RELAY_OFF_LIM_VAR_TARIFF_3: false,
                    RELAY_ON_PF_MIN: false,
                    RELAY_OFF_PF_MIN: false,
                    RELAY_ON_TIMEOUT: false,
                    RELAY_ON_SALDO: false,
                    RELAY_OFF_SALDO: false,
                    RELAY_OFF_SALDO_SOFT: false
                },
                speedOptoPort: { plc: 9600, optoport: 9600 },
                ten: 30,
                tu: 30,
                timeIntervalPowerOff: 3,
                reserved: 0,
                timeoutBadVAVB: 5,
                freqMax: 55,
                freqMin: 45,
                year: 0,
                month: 0,
                date: 0,
                energyDecimalPoint: 2,
                voltageTransformationRatioNumerator: 1,
                voltageTransformationRatioDenominator: 1,
                currentTransformationRatioNumerator: 1,
                currentTransformationRatioDenominator: 1,
                typeMeter: {
                    TRANSFORMATION_RATIO: false,
                    METER_TYPE_R: false,
                    ACCUMULATE_BY_R_PLUS_MINUS: false
                },
                phMin: 0,
                timeoutIMax: 5,
                timeoutPMax: 5,
                timeoutCos: 5,
                pMaxDef: 1,
                displaySet4: {
                    MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                    MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                    MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                    MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    CURRENT_TRANSFORMATION_RATIO: false,
                    VOLTAGE_TRANSFORMATION_RATIO: false,
                    CURRENT_BALANCE: false,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    OPTOPORT_SPEED: false,
                    MAGNET_INDUCTION: false,
                    SORT_DISPLAY_SCREENS: false,
                    TURN_OFF_DISPLAY: false,
                    AUTO_SCREEN_SCROLLING: true
                }
            },
            bytes: [
                0x1e, 0x5f,
                0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x1e, 0x01, 0x7f, 0x07,
                0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03,
                0x44, 0x1e, 0x1e, 0x03, 0x00, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x01,
                0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x05, 0x05, 0x01, 0x80, 0x06, 0x00, 0x00
            ]
        }
    };
    const fromBytes$5 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParameters();
    };
    const toBytes$5 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$5);
        buffer.setOperatorParameters(parameters);
        return toBytes$2f(id$5, buffer.data);
    };

    var getOperatorParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$5,
        examples: examples$5,
        fromBytes: fromBytes$5,
        headerSize: headerSize$5,
        id: id$5,
        isLoraOnly: isLoraOnly$5,
        maxSize: maxSize$5,
        name: name$5,
        toBytes: toBytes$5
    });

    const id$4 = getOperatorParametersExtended$2;
    const name$4 = commandNames[getOperatorParametersExtended$2];
    const headerSize$4 = 2;
    const maxSize$4 = OPERATOR_PARAMETERS_EXTENDED_SIZE;
    const accessLevel$4 = READ_ONLY;
    const isLoraOnly$4 = false;
    const examples$4 = {
        'simple response': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
            maxSize: maxSize$4,
            accessLevel: accessLevel$4,
            parameters: {
                timeoutRelayOn: 1,
                define1: {
                    RESET_DAY_MAX_POWER_KEY: false,
                    RESET_MONTH_MAX_POWER_KEY: false,
                    BLOCK_KEY_OPTOPORT: false,
                    MAGNET_SCREEN_CONST: false,
                    ALLOW_BROWNOUT_INDICATION: false
                },
                timeoutRelayKey: 0,
                timeoutRelayAuto: 5
            },
            bytes: [
                0x3f, 0x09,
                0x01,
                0x00,
                0x00,
                0x05,
                0x00, 0x00, 0x00, 0x00,
                0x00
            ]
        }
    };
    const fromBytes$4 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParametersExtended();
    };
    const toBytes$4 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$4);
        buffer.setOperatorParametersExtended(parameters);
        return toBytes$2f(id$4, buffer.data);
    };

    var getOperatorParametersExtended = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$4,
        examples: examples$4,
        fromBytes: fromBytes$4,
        headerSize: headerSize$4,
        id: id$4,
        isLoraOnly: isLoraOnly$4,
        maxSize: maxSize$4,
        name: name$4,
        toBytes: toBytes$4
    });

    const id$3 = getOperatorParametersExtended2$2;
    const name$3 = commandNames[getOperatorParametersExtended2$2];
    const headerSize$3 = 2;
    const maxSize$3 = OPERATOR_PARAMETERS_EXTENDED2_SIZE;
    const accessLevel$3 = READ_ONLY;
    const isLoraOnly$3 = false;
    const examples$3 = {
        'simple response': {
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
            maxSize: maxSize$3,
            accessLevel: accessLevel$3,
            parameters: {
                deltaCorMin: 15,
                timeoutMagnetOff: 5,
                relaySetExt: {
                    RELAY_OFF_MAGNET: true,
                    RELAY_ON_MAGNET_TIMEOUT: false,
                    RELAY_ON_MAGNET_AUTO: true
                },
                timeoutMagnetOn: 5,
                phaseDefault: 1,
                displaySet21: 0,
                displaySet22: 0,
                displaySet23: 0,
                displaySet24: {
                    OPTOPORT_SPEED: true
                },
                channel1: 1,
                channel2: 2,
                channel3: 3,
                channel4: 4,
                channel5: 5,
                channel6: 6,
                timeCorrectPeriod: 24
            },
            bytes: [
                0x47, 0x1c,
                0x0f,
                0x05,
                0x05,
                0x05,
                0x01,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x04, 0x00, 0x00, 0x00,
                0x01,
                0x02,
                0x03,
                0x04,
                0x05,
                0x06,
                0x18
            ]
        }
    };
    const fromBytes$3 = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return buffer.getOperatorParametersExtended2();
    };
    const toBytes$3 = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$3);
        buffer.setOperatorParametersExtended2(parameters);
        return toBytes$2f(id$3, buffer.data);
    };

    var getOperatorParametersExtended2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$3,
        examples: examples$3,
        fromBytes: fromBytes$3,
        headerSize: headerSize$3,
        id: id$3,
        isLoraOnly: isLoraOnly$3,
        maxSize: maxSize$3,
        name: name$3,
        toBytes: toBytes$3
    });

    const id$2 = setOperatorParametersExtended$2;
    const name$2 = commandNames[setOperatorParametersExtended$2];
    const headerSize$2 = 2;
    const maxSize$2 = 0;
    const accessLevel$2 = READ_WRITE;
    const isLoraOnly$2 = false;
    const examples$2 = {
        'simple response': {
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            maxSize: maxSize$2,
            accessLevel: accessLevel$2,
            parameters: {},
            bytes: [
                0x40, 0x00
            ]
        }
    };
    const fromBytes$2 = (bytes) => {
        if (bytes.length !== maxSize$2) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$2 = () => toBytes$2f(id$2);

    var setOperatorParametersExtended = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2,
        examples: examples$2,
        fromBytes: fromBytes$2,
        headerSize: headerSize$2,
        id: id$2,
        isLoraOnly: isLoraOnly$2,
        maxSize: maxSize$2,
        name: name$2,
        toBytes: toBytes$2
    });

    const id$1 = setOperatorParametersExtended2$2;
    const name$1 = commandNames[setOperatorParametersExtended2$2];
    const headerSize$1 = 2;
    const maxSize$1 = 0;
    const accessLevel$1 = READ_WRITE;
    const isLoraOnly$1 = false;
    const examples$1 = {
        'simple response': {
            id: id$1,
            name: name$1,
            headerSize: headerSize$1,
            maxSize: maxSize$1,
            accessLevel: accessLevel$1,
            parameters: {},
            bytes: [
                0x45, 0x00
            ]
        }
    };
    const fromBytes$1 = (bytes) => {
        if (bytes.length !== maxSize$1) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1 = () => toBytes$2f(id$1);

    var setOperatorParametersExtended2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1,
        examples: examples$1,
        fromBytes: fromBytes$1,
        headerSize: headerSize$1,
        id: id$1,
        isLoraOnly: isLoraOnly$1,
        maxSize: maxSize$1,
        name: name$1,
        toBytes: toBytes$1
    });

    const id = setOperatorParametersExtended4$2;
    const name = commandNames[setOperatorParametersExtended4$2];
    const headerSize = 2;
    const maxSize = 0;
    const accessLevel = READ_WRITE;
    const isLoraOnly = false;
    const examples = {
        'simple response': {
            id,
            name,
            headerSize,
            maxSize,
            accessLevel,
            parameters: {},
            bytes: [
                0x75, 0x00
            ]
        }
    };
    const fromBytes = (bytes) => {
        if (bytes.length !== maxSize) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes = () => toBytes$2f(id);

    var setOperatorParametersExtended4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel,
        examples: examples,
        fromBytes: fromBytes,
        headerSize: headerSize,
        id: id,
        isLoraOnly: isLoraOnly,
        maxSize: maxSize,
        name: name,
        toBytes: toBytes
    });

    var uplink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan,
        errorResponse: errorResponse,
        getBuildVersion: getBuildVersion,
        getCorrectTime: getCorrectTime,
        getCriticalEvent: getCriticalEvent,
        getCurrentStatusMeter: getCurrentStatusMeter,
        getCurrentValues: getCurrentValues,
        getDateTime: getDateTime,
        getDayDemand: getDayDemand,
        getDayDemandExport: getDayDemandExport,
        getDayMaxDemand: getDayMaxDemand,
        getDayMaxDemandExport: getDayMaxDemandExport,
        getDayProfile: getDayProfile,
        getDemand: getDemand,
        getDeviceId: getDeviceId,
        getDeviceType: getDeviceType,
        getDisplayParam: getDisplayParam,
        getEnergy: getEnergy,
        getEnergyDayPrevious: getEnergyDayPrevious,
        getEnergyExport: getEnergyExport,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious,
        getEventStatus: getEventStatus,
        getEvents: getEvents,
        getEventsCounters: getEventsCounters,
        getExtendedCurrentValues: getExtendedCurrentValues,
        getHalfHourDemand: getHalfHourDemand,
        getHalfHourDemandChannel: getHalfHourDemandChannel,
        getHalfHourDemandExport: getHalfHourDemandExport,
        getHalfHourDemandVare: getHalfHourDemandVare,
        getHalfHourDemandVareExport: getHalfHourDemandVareExport,
        getHalfHourDemandVari: getHalfHourDemandVari,
        getHalfHourDemandVariExport: getHalfHourDemandVariExport,
        getHalfhoursEnergies: getHalfhoursEnergies,
        getMagneticFieldThreshold: getMagneticFieldThreshold,
        getMeterInfo: getMeterInfo,
        getMonthDemand: getMonthDemand,
        getMonthDemandExport: getMonthDemandExport,
        getMonthMaxDemand: getMonthMaxDemand,
        getMonthMaxDemandExport: getMonthMaxDemandExport,
        getOperatorParameters: getOperatorParameters,
        getOperatorParametersExtended: getOperatorParametersExtended,
        getOperatorParametersExtended2: getOperatorParametersExtended2,
        getOperatorParametersExtended3: getOperatorParametersExtended3,
        getRatePlanInfo: getRatePlanInfo,
        getSaldo: getSaldo,
        getSaldoParameters: getSaldoParameters,
        getSeasonProfile: getSeasonProfile,
        getSpecialDay: getSpecialDay,
        getVersion: getVersion,
        prepareRatePlan: prepareRatePlan,
        resetPowerMaxDay: resetPowerMaxDay,
        resetPowerMaxMonth: resetPowerMaxMonth,
        runTariffPlan: runTariffPlan,
        setAccessKey: setAccessKey,
        setCorrectDateTime: setCorrectDateTime,
        setCorrectTime: setCorrectTime,
        setDateTime: setDateTime,
        setDayProfile: setDayProfile,
        setDisplayParam: setDisplayParam,
        setOperatorParameters: setOperatorParameters,
        setOperatorParametersExtended: setOperatorParametersExtended,
        setOperatorParametersExtended2: setOperatorParametersExtended2,
        setOperatorParametersExtended3: setOperatorParametersExtended3,
        setOperatorParametersExtended4: setOperatorParametersExtended4,
        setSaldo: setSaldo,
        setSaldoParameters: setSaldoParameters,
        setSeasonProfile: setSeasonProfile,
        setSpecialDay: setSpecialDay,
        setSpecialOperation: setSpecialOperation,
        turnRelayOff: turnRelayOff,
        turnRelayOn: turnRelayOn
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
