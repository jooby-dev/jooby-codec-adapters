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
    const fromBytes$21 = (bytes) => {
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
    const toBytes$22 = ({ type, revision, meterType }, prefix) => {
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
    const ERR_ACCESS = 0x11;
    const CASE_OPEN$1 = 0x12;
    const CASE_CLOSE = 0x13;
    const MAGNETIC_ON$1 = 0x14;
    const MAGNETIC_OFF = 0x15;
    const CHANGE_ACCESS_KEY0 = 0x20;
    const CHANGE_ACCESS_KEY1 = 0x21;
    const CHANGE_ACCESS_KEY2 = 0x22;
    const CHANGE_ACCESS_KEY3 = 0x23;
    const CHANGE_PAR_LOCAL = 0x24;
    const CHANGE_PAR_REMOTE = 0x25;
    const CMD_CHANGE_TIME = 0x26;
    const CMD_RELAY_ON = 0x27;
    const CMD_RELAY_OFF = 0x28;
    const CHANGE_COR_TIME = 0x29;
    const ENERGY_REG_OVERFLOW = 0x31;
    const CHANGE_TARIFF_TBL = 0x32;
    const SET_TARIFF_TBL = 0x33;
    const SUMMER_TIME = 0x34;
    const WINTER_TIME = 0x35;
    const RELAY_ON = 0x36;
    const RELAY_OFF = 0x37;
    const RESTART$1 = 0x38;
    const WD_RESTART = 0x39;
    const V_MAX_OK = 0x40;
    const V_MAX_OVER = 0x41;
    const V_MIN_OK = 0x42;
    const V_MIN_OVER = 0x43;
    const T_MAX_OK = 0x44;
    const T_MAX_OVER = 0x45;
    const T_MIN_OK = 0x46;
    const T_MIN_OVER = 0x47;
    const F_MAX_OK = 0x48;
    const F_MAX_OVER = 0x49;
    const F_MIN_OK = 0x4A;
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
    const CLOCK_OK = 0x56;
    const CLOCK_FAULT = 0x57;
    const POWER_A_OFF = 0x58;
    const POWER_A_ON = 0x59;
    const CMD_RELAY_2_ON = 0x60;
    const CMD_RELAY_2_OFF = 0x61;
    const CROSSZERO_ENT0 = 0x62;
    const CROSSZERO_ENT1 = 0x63;
    const CROSSZERO_ENT2 = 0x64;
    const CROSSZERO_ENT3 = 0x65;
    const CALFLAG_SET = 0x66;
    const CALFLAG_RESET = 0x67;
    const BAD_TEST_EEPROM = 0x68;
    const BAD_TEST_FRAM = 0x69;
    const SET_NEW_SALDO = 0x70;
    const SALDO_PARAM_BAD = 0x71;
    const ACCPARAM_BAD = 0x72;
    const ACCPARAM_EXT_BAD = 0x73;
    const CALC_PERIOD_BAD = 0x74;
    const BLOCK_TARIFF_BAD = 0x75;
    const CALIBR_PARAM_BAD = 0x76;
    const WINTER_SUMMER_BAD = 0x77;
    const SALDO_EN_BAD = 0x78;
    const TIME_CORRECT$1 = 0x79;
    const CASE_TERMINAL_OPEN$1 = 0x7A;
    const CASE_TERMINAL_CLOSE = 0x7B;
    const CASE_MODULE_OPEN$1 = 0x7C;
    const CASE_MODULE_CLOSE = 0x7D;
    const RELAY_HARD_BAD_OFF = 0x90;
    const RELAY_HARD_ON = 0x91;
    const RELAY_HARD_BAD_ON = 0x93;
    const RELAY_HARD_OFF = 0x94;
    const SET_SALDO_PARAM = 0x9C;
    const POWER_OVER_RELAY_OFF = 0x9D;
    const CROSSZERO_EXP_ENT0 = 0x9E;
    const CROSSZERO_EXP_ENT1 = 0x9F;
    const CROSSZERO_EXP_ENT2 = 0xA0;
    const CROSSZERO_EXP_ENT3 = 0xA1;
    const TIME_CORRECT_NEW = 0xA2;
    const EM_MAGNETIC_ON = 0xB0;
    const EM_MAGNETIC_OFF = 0xB1;
    const CURRENT_UNEQUIL_FAULT = 0xB2;
    const CURRENT_UNEQUIL_OK = 0xB3;
    const BIPOLAR_POWER_FAULT = 0xB4;
    const BIPOLAR_POWER_OK = 0xB5;
    const RESET_EM_FLAG = 0xB6;
    const RESET_MAGN_FLAG = 0xB7;
    const NVRAM_FAULT = 0xD0;
    const SET_DEMAND_EN_1MIN = 0xE0;
    const SET_DEMAND_EN_3MIN = 0xE1;
    const SET_DEMAND_EN_5MIN = 0xE2;
    const SET_DEMAND_EN_10MIN = 0xE3;
    const SET_DEMAND_EN_15MIN = 0xE4;
    const SET_DEMAND_EN_30MIN = 0xE5;
    const SET_DEMAND_EN_60MIN = 0xE6;

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_CLOSED: ACCESS_CLOSED,
        ACCPARAM_BAD: ACCPARAM_BAD,
        ACCPARAM_EXT_BAD: ACCPARAM_EXT_BAD,
        BAD_TEST_EEPROM: BAD_TEST_EEPROM,
        BAD_TEST_FRAM: BAD_TEST_FRAM,
        BAT_FAULT: BAT_FAULT,
        BAT_OK: BAT_OK,
        BIPOLAR_POWER_FAULT: BIPOLAR_POWER_FAULT,
        BIPOLAR_POWER_OK: BIPOLAR_POWER_OK,
        BLOCK_TARIFF_BAD: BLOCK_TARIFF_BAD,
        CALC_PERIOD_BAD: CALC_PERIOD_BAD,
        CALFLAG_RESET: CALFLAG_RESET,
        CALFLAG_SET: CALFLAG_SET,
        CALIBR_PARAM_BAD: CALIBR_PARAM_BAD,
        CAL_FAULT: CAL_FAULT,
        CAL_OK: CAL_OK,
        CASE_CLOSE: CASE_CLOSE,
        CASE_MODULE_CLOSE: CASE_MODULE_CLOSE,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN$1,
        CASE_OPEN: CASE_OPEN$1,
        CASE_TERMINAL_CLOSE: CASE_TERMINAL_CLOSE,
        CASE_TERMINAL_OPEN: CASE_TERMINAL_OPEN$1,
        CHANGE_ACCESS_KEY0: CHANGE_ACCESS_KEY0,
        CHANGE_ACCESS_KEY1: CHANGE_ACCESS_KEY1,
        CHANGE_ACCESS_KEY2: CHANGE_ACCESS_KEY2,
        CHANGE_ACCESS_KEY3: CHANGE_ACCESS_KEY3,
        CHANGE_COR_TIME: CHANGE_COR_TIME,
        CHANGE_PAR_LOCAL: CHANGE_PAR_LOCAL,
        CHANGE_PAR_REMOTE: CHANGE_PAR_REMOTE,
        CHANGE_TARIFF_TBL: CHANGE_TARIFF_TBL,
        CLOCK_FAULT: CLOCK_FAULT,
        CLOCK_OK: CLOCK_OK,
        CMD_CHANGE_TIME: CMD_CHANGE_TIME,
        CMD_RELAY_2_OFF: CMD_RELAY_2_OFF,
        CMD_RELAY_2_ON: CMD_RELAY_2_ON,
        CMD_RELAY_OFF: CMD_RELAY_OFF,
        CMD_RELAY_ON: CMD_RELAY_ON,
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
        EM_MAGNETIC_OFF: EM_MAGNETIC_OFF,
        EM_MAGNETIC_ON: EM_MAGNETIC_ON,
        ENERGY_REG_FAULT: ENERGY_REG_FAULT,
        ENERGY_REG_OVERFLOW: ENERGY_REG_OVERFLOW,
        ERR_ACCESS: ERR_ACCESS,
        F_MAX_OK: F_MAX_OK,
        F_MAX_OVER: F_MAX_OVER,
        F_MIN_OK: F_MIN_OK,
        F_MIN_OVER: F_MIN_OVER,
        I_MAX_OK: I_MAX_OK,
        I_MAX_OVER: I_MAX_OVER,
        MAGNETIC_OFF: MAGNETIC_OFF,
        MAGNETIC_ON: MAGNETIC_ON$1,
        NVRAM_FAULT: NVRAM_FAULT,
        OP_PAR_FAULT: OP_PAR_FAULT,
        POWERSALDO_OK: POWERSALDO_OK,
        POWERSALDO_OVER: POWERSALDO_OVER,
        POWER_A_OFF: POWER_A_OFF,
        POWER_A_ON: POWER_A_ON,
        POWER_OVER_RELAY_OFF: POWER_OVER_RELAY_OFF,
        P_MAX_OK: P_MAX_OK,
        P_MAX_OVER: P_MAX_OVER,
        RELAY_HARD_BAD_OFF: RELAY_HARD_BAD_OFF,
        RELAY_HARD_BAD_ON: RELAY_HARD_BAD_ON,
        RELAY_HARD_OFF: RELAY_HARD_OFF,
        RELAY_HARD_ON: RELAY_HARD_ON,
        RELAY_OFF: RELAY_OFF,
        RELAY_ON: RELAY_ON,
        RESET_EM_FLAG: RESET_EM_FLAG,
        RESET_MAGN_FLAG: RESET_MAGN_FLAG,
        RESTART: RESTART$1,
        SALDO_EN_BAD: SALDO_EN_BAD,
        SALDO_PARAM_BAD: SALDO_PARAM_BAD,
        SET_DEMAND_EN_10MIN: SET_DEMAND_EN_10MIN,
        SET_DEMAND_EN_15MIN: SET_DEMAND_EN_15MIN,
        SET_DEMAND_EN_1MIN: SET_DEMAND_EN_1MIN,
        SET_DEMAND_EN_30MIN: SET_DEMAND_EN_30MIN,
        SET_DEMAND_EN_3MIN: SET_DEMAND_EN_3MIN,
        SET_DEMAND_EN_5MIN: SET_DEMAND_EN_5MIN,
        SET_DEMAND_EN_60MIN: SET_DEMAND_EN_60MIN,
        SET_NEW_SALDO: SET_NEW_SALDO,
        SET_SALDO_PARAM: SET_SALDO_PARAM,
        SET_TARIFF_TBL: SET_TARIFF_TBL,
        SUMMER_TIME: SUMMER_TIME,
        TIME_CORRECT: TIME_CORRECT$1,
        TIME_CORRECT_NEW: TIME_CORRECT_NEW,
        T_MAX_OK: T_MAX_OK,
        T_MAX_OVER: T_MAX_OVER,
        T_MIN_OK: T_MIN_OK,
        T_MIN_OVER: T_MIN_OVER,
        VENDOR_PAR_FAULT: VENDOR_PAR_FAULT,
        V_MAX_OK: V_MAX_OK,
        V_MAX_OVER: V_MAX_OVER,
        V_MIN_OK: V_MIN_OK,
        V_MIN_OVER: V_MIN_OVER,
        WD_RESTART: WD_RESTART,
        WINTER_SUMMER_BAD: WINTER_SUMMER_BAD,
        WINTER_TIME: WINTER_TIME
    });

    var eventNames = invertObject(events);

    const defaultFrameHeader = {
        type: DATA_REQUEST,
        destination: 0xffff,
        source: 0xfffe
    };
    const TARIFF_PLAN_SIZE = 11;
    const OPERATOR_PARAMETERS_SIZE = 74;
    const SEASON_PROFILE_DAYS_NUMBER = 7;
    const SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;
    const TARIFF_NUMBER$1 = 4;
    const PACKED_ENERGY_TYPE_SIZE = 1;
    const ENERGY_SIZE = 4;
    const DATE_SIZE$3 = 3;
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
    const define1Mask = {
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
    function getPackedEnergies(buffer, energyType, tariffMapByte) {
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
    function CommandBinaryBuffer$1(dataOrLength, isLittleEndian = false) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer$1.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer$1.prototype.constructor = CommandBinaryBuffer$1;
    CommandBinaryBuffer$1.getDayProfileFromByte = (value) => ({
        tariff: extractBits(value, 2, 1),
        isFirstHalfHour: !extractBits(value, 1, 3),
        hour: extractBits(value, 5, 4)
    });
    CommandBinaryBuffer$1.getByteFromDayProfile = (dayProfile) => {
        let value = 0;
        value = fillBits(value, 2, 1, dayProfile.tariff);
        value = fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
        value = fillBits(value, 5, 4, dayProfile.hour);
        return value;
    };
    CommandBinaryBuffer$1.getDefaultSeasonProfile = () => ({
        month: 1,
        date: 1,
        dayIndexes: [0, 0, 0, 0, 0, 0, 0]
    });
    CommandBinaryBuffer$1.getDefaultOperatorParameters = () => ({
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
        define1: toObject(define1Mask, 0),
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
    CommandBinaryBuffer$1.prototype.getFrameHeader = function () {
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
    CommandBinaryBuffer$1.prototype.setFrameHeader = function ({ type = defaultFrameHeader.type, destination = defaultFrameHeader.destination, source = defaultFrameHeader.source }) {
        this.setUint8(type);
        this.setUint16(destination);
        this.setUint16(source);
    };
    CommandBinaryBuffer$1.prototype.getDeviceId = function () {
        const manufacturer = getHexFromBytes(this.getBytes(3), { separator: '' });
        const type = this.getUint8();
        const year = this.getUint8();
        const serial = getHexFromBytes(this.getBytes(3), { separator: '' });
        return { manufacturer, type, year, serial };
    };
    CommandBinaryBuffer$1.prototype.setDeviceId = function ({ manufacturer, type, year, serial }) {
        this.setBytes(getBytesFromHex(manufacturer));
        this.setUint8(type);
        this.setUint8(year);
        this.setBytes(getBytesFromHex(serial));
    };
    CommandBinaryBuffer$1.prototype.getDateTime = function () {
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
    CommandBinaryBuffer$1.prototype.setDateTime = function (dateTime) {
        this.setUint8(dateTime.isSummerTime ? 1 : 0);
        this.setUint8(dateTime.seconds);
        this.setUint8(dateTime.minutes);
        this.setUint8(dateTime.hours);
        this.setUint8(dateTime.day || 0);
        this.setUint8(dateTime.date);
        this.setUint8(dateTime.month);
        this.setUint8(dateTime.year);
    };
    CommandBinaryBuffer$1.prototype.getTariffPlan = function () {
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
    CommandBinaryBuffer$1.prototype.setTariffPlan = function (tariffPlan) {
        this.setUint32(tariffPlan.id);
        this.setUint8(tariffPlan.tariffSet);
        this.setUint8(tariffPlan.activateYear);
        this.setUint8(tariffPlan.activateMonth);
        this.setUint8(tariffPlan.activateDay);
        this.setUint8(tariffPlan.specialProfilesArraySize);
        this.setUint8(tariffPlan.seasonProfilesArraySize);
        this.setUint8(tariffPlan.dayProfilesArraySize);
    };
    CommandBinaryBuffer$1.prototype.getTimeCorrectionParameters = function () {
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
    CommandBinaryBuffer$1.prototype.setTimeCorrectionParameters = function (parameters) {
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
    CommandBinaryBuffer$1.prototype.getDayProfile = function () {
        return CommandBinaryBuffer$1.getDayProfileFromByte(this.getUint8());
    };
    CommandBinaryBuffer$1.prototype.setDayProfile = function (dayProfile) {
        this.setUint8(CommandBinaryBuffer$1.getByteFromDayProfile(dayProfile));
    };
    CommandBinaryBuffer$1.prototype.getSeasonProfile = function () {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(() => this.getUint8())
        };
    };
    CommandBinaryBuffer$1.prototype.setSeasonProfile = function (seasonProfile) {
        this.setUint8(seasonProfile.month);
        this.setUint8(seasonProfile.date);
        seasonProfile.dayIndexes.forEach(value => this.setUint8(value));
    };
    CommandBinaryBuffer$1.prototype.getSpecialDay = function () {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndex: this.getUint8(),
            isPeriodic: this.getUint8() === 0
        };
    };
    CommandBinaryBuffer$1.prototype.setSpecialDay = function (specialDay) {
        this.setUint8(specialDay.month);
        this.setUint8(specialDay.date);
        this.setUint8(specialDay.dayIndex);
        this.setUint8(+!specialDay.isPeriodic);
    };
    CommandBinaryBuffer$1.prototype.getDeviceType = function () {
        return fromBytes$21(this.getBytes(9));
    };
    CommandBinaryBuffer$1.prototype.setDeviceType = function (deviceType) {
        this.setBytes(toBytes$22(deviceType));
    };
    CommandBinaryBuffer$1.prototype.getOperatorParameters = function () {
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
            define1: toObject(define1Mask, this.getUint8()),
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
    CommandBinaryBuffer$1.prototype.setOperatorParameters = function (operatorParameters) {
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
        this.setUint8(fromObject(define1Mask, operatorParameters.define1));
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
    CommandBinaryBuffer$1.prototype.getPackedEnergyWithType = function () {
        const byte = this.getUint8();
        const energyType = extractBits(byte, TARIFF_NUMBER$1, 1);
        const energies = getPackedEnergies(this, energyType, byte);
        return {
            energyType,
            energies
        };
    };
    CommandBinaryBuffer$1.prototype.setPackedEnergyWithType = function ({ energyType, energies }) {
        if (energyType) {
            setPackedEnergyType(this, energyType, energies);
        }
        energies.forEach(energy => {
            if (energy !== null) {
                this.setUint32(energy);
            }
        });
    };
    CommandBinaryBuffer$1.prototype.getEnergies = function () {
        return new Array(TARIFF_NUMBER$1).fill(0).map(() => this.getInt32());
    };
    CommandBinaryBuffer$1.prototype.setEnergies = function (energies) {
        energies.forEach(value => this.setUint32(value));
    };
    CommandBinaryBuffer$1.prototype.getDate = function () {
        return {
            year: this.getUint8(),
            month: this.getUint8(),
            date: this.getUint8()
        };
    };
    CommandBinaryBuffer$1.prototype.setDate = function (date) {
        this.setUint8(date.year);
        this.setUint8(date.month);
        this.setUint8(date.date);
    };
    CommandBinaryBuffer$1.prototype.getSaldoParameters = function () {
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
    CommandBinaryBuffer$1.prototype.setSaldoParameters = function (saldoParameters) {
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
    CommandBinaryBuffer$1.prototype.getEnergyPeriods = function (periodsNumber) {
        const periods = new Array(periodsNumber).fill(0).map(() => this.getUint16());
        return periods.map(period => getEnergyPeriod(period));
    };
    CommandBinaryBuffer$1.prototype.setEnergyPeriods = function (periods) {
        periods.forEach(period => setEnergyPeriod(this, period));
    };
    CommandBinaryBuffer$1.prototype.getEventStatus = function () {
        const eventStatus = this.getUint16();
        return toObject(eventStatusMask, eventStatus);
    };
    CommandBinaryBuffer$1.prototype.setEventStatus = function (parameters) {
        this.setUint16(fromObject(eventStatusMask, parameters));
    };
    CommandBinaryBuffer$1.prototype.getExtendedCurrentValues2 = function () {
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
    CommandBinaryBuffer$1.prototype.setExtendedCurrentValues2 = function (parameters) {
        const { uBattery, relayStatus, relayStatus2, status1, status2, status3 } = parameters;
        this.setUint16(uBattery);
        this.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, relayStatus));
        this.setUint8(fromObject(extendedCurrentValues2RelayStatus2Mask, relayStatus2));
        this.setUint8(fromObject(extendedCurrentValues2Status1Mask, status1));
        this.setUint8(fromObject(extendedCurrentValues2Status2Mask, status2));
        this.setUint8(fromObject(extendedCurrentValues2Status3Mask, status3));
    };
    CommandBinaryBuffer$1.prototype.getEvent = function () {
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
            case TIME_CORRECT$1:
                if (bytesLeft < 8) {
                    return data;
                }
                data.newDate = this.getDateTime();
                break;
        }
        return data;
    };
    CommandBinaryBuffer$1.prototype.setEvent = function (event) {
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
            case TIME_CORRECT$1:
                this.setDateTime(event.newDate);
                break;
        }
    };
    CommandBinaryBuffer$1.prototype.getDemand = function () {
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
    CommandBinaryBuffer$1.prototype.setDemand = function (parameters) {
        const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
        const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);
        this.setUint8(date0);
        this.setUint8(date1);
        this.setUint8(parameters.energyType);
        this.setUint16(parameters.firstIndex);
        this.setUint8(parameters.count);
        this.setUint8(parameters.period);
    };
    CommandBinaryBuffer$1.prototype.getDayMaxDemandResponse = function () {
        const date = this.getDate();
        const power = new Array(TARIFF_NUMBER$1).fill(0).map(() => ({
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        }));
        return { date, power };
    };
    CommandBinaryBuffer$1.prototype.setDayMaxDemandResponse = function (parameters) {
        this.setDate(parameters.date);
        parameters.power.forEach(value => {
            this.setUint8(value.hours);
            this.setUint8(value.minutes);
            this.setUint32(value.power);
        });
    };
    CommandBinaryBuffer$1.prototype.getOperatorParametersExtended3 = function () {
        return {
            pmaxMinusThreshold0: this.getUint32(),
            pmaxMinusThreshold1: this.getUint32(),
            pmaxMinusThreshold2: this.getUint32(),
            pmaxMinusThreshold3: this.getUint32(),
            relaySet: toObject(operatorParametersExtended3RelaySetMask, this.getUint8())
        };
    };
    CommandBinaryBuffer$1.prototype.setOperatorParametersExtended3 = function (parameters) {
        const { pmaxMinusThreshold0, pmaxMinusThreshold1, pmaxMinusThreshold2, pmaxMinusThreshold3, relaySet } = parameters;
        this.setUint32(pmaxMinusThreshold0);
        this.setUint32(pmaxMinusThreshold1);
        this.setUint32(pmaxMinusThreshold2);
        this.setUint32(pmaxMinusThreshold3);
        this.setUint8(fromObject(operatorParametersExtended3RelaySetMask, relaySet));
    };
    CommandBinaryBuffer$1.prototype.getMonthMaxPowerByTariffs = function () {
        return new Array(TARIFF_NUMBER$1).fill(0).map(() => ({
            date: this.getUint8(),
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        }));
    };
    CommandBinaryBuffer$1.prototype.setMonthMaxPowerByTariffs = function (tariffs) {
        tariffs.forEach(tariff => {
            this.setUint8(tariff.date);
            this.setUint8(tariff.hours);
            this.setUint8(tariff.minutes);
            this.setUint32(tariff.power);
        });
    };
    const getPackedEnergiesWithDateSize = (parameters) => {
        if (parameters?.energyType) {
            const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
            return DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        return DATE_SIZE$3 + ENERGY_SIZE * TARIFF_NUMBER$1;
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
    const toBytes$21 = (commandId, commandBytes = []) => [commandId, commandBytes.length, ...commandBytes];

    const UNENCRYPTED = 0x00;
    const READ_WRITE = 0x02;
    const READ_ONLY = 0x03;

    const getEventStatus$2 = 0x01;
    const getEnergyDayPrevious$2 = 0x03;
    const getDeviceType$2 = 0x04;
    const getDeviceId$2 = 0x05;
    const getDateTime$2 = 0x07;
    const setDateTime$2 = 0x08;
    const setAccessKey$2 = 0x09;
    const getCurrentValues$2 = 0x0d;
    const getEnergy$2 = 0x0f;
    const setDayProfile$2 = 0x10;
    const setSeasonProfile$2 = 0x11;
    const setSpecialDay$2 = 0x12;
    const activateRatePlan$2 = 0x13;
    const prepareRatePlan$2 = 0x14;
    const getHalfHourDemand$2 = 0x15;
    const getDayDemand$2 = 0x16;
    const getMonthDemand$2 = 0x17;
    const turnRelayOn$2 = 0x18;
    const turnRelayOff$2 = 0x19;
    const setCorrectTime$2 = 0x1c;
    const getOperatorParameters$2 = 0x1e;
    const setOperatorParameters$2 = 0x1f;
    const getVersion$2 = 0x28;
    const getSaldo$2 = 0x29;
    const setSaldo$2 = 0x2a;
    const getRatePlanInfo$2 = 0x2c;
    const getExtendedCurrentValues2$2 = 0x2d;
    const getSaldoParameters$2 = 0x2e;
    const setSaldoParameters$2 = 0x2f;
    const getDayMaxDemand$2 = 0x31;
    const getMonthMaxDemand$2 = 0x32;
    const getEvents$2 = 0x33;
    const getEventsCounters$2 = 0x34;
    const resetPowerMaxDay$2 = 0x35;
    const resetPowerMaxMonth$2 = 0x36;
    const getCurrentStatusMeter$2 = 0x39;
    const getExtendedCurrentValues$2 = 0x3a;
    const getDayProfile$2 = 0x3b;
    const getSeasonProfile$2 = 0x3c;
    const getSpecialDay$2 = 0x3d;
    const getCorrectTime$2 = 0x3e;
    const getCriticalEvent$2 = 0x41;
    const runTariffPlan$2 = 0x46;
    const getDayMaxDemandPrevious$2 = 0x4a;
    const getHalfHourDemandPrevious$2 = 0x4b;
    const getDayDemandExport$2 = 0x4f;
    const getEnergyExportDayPrevious$2 = 0x50;
    const getMonthDemandExport$2 = 0x52;
    const getHalfHourDemandExport$2 = 0x53;
    const getDayMaxDemandExport$2 = 0x58;
    const getMonthMaxDemandExport$2 = 0x59;
    const getEnergyExport$2 = 0x5b;
    const setCorrectDateTime$2 = 0x5c;
    const setDisplayParam$2 = 0x5d;
    const getDisplayParam$2 = 0x5e;
    const setSpecialOperation$2 = 0x64;
    const getMagneticFieldThreshold$2 = 0x6d;
    const getHalfhoursEnergies$2 = 0x6f;
    const getBuildVersion$2 = 0x70;
    const getOperatorParametersExtended3$2 = 0x71;
    const setOperatorParametersExtended3$2 = 0x72;
    const getDemand$2 = 0x76;
    const getMeterInfo$2 = 0x7a;

    var downlinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$2,
        getBuildVersion: getBuildVersion$2,
        getCorrectTime: getCorrectTime$2,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$2,
        getCurrentValues: getCurrentValues$2,
        getDateTime: getDateTime$2,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayMaxDemand: getDayMaxDemand$2,
        getDayMaxDemandExport: getDayMaxDemandExport$2,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious$2,
        getDayProfile: getDayProfile$2,
        getDemand: getDemand$2,
        getDeviceId: getDeviceId$2,
        getDeviceType: getDeviceType$2,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$2,
        getEvents: getEvents$2,
        getEventsCounters: getEventsCounters$2,
        getExtendedCurrentValues: getExtendedCurrentValues$2,
        getExtendedCurrentValues2: getExtendedCurrentValues2$2,
        getHalfHourDemand: getHalfHourDemand$2,
        getHalfHourDemandExport: getHalfHourDemandExport$2,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious$2,
        getHalfhoursEnergies: getHalfhoursEnergies$2,
        getMagneticFieldThreshold: getMagneticFieldThreshold$2,
        getMeterInfo: getMeterInfo$2,
        getMonthDemand: getMonthDemand$2,
        getMonthDemandExport: getMonthDemandExport$2,
        getMonthMaxDemand: getMonthMaxDemand$2,
        getMonthMaxDemandExport: getMonthMaxDemandExport$2,
        getOperatorParameters: getOperatorParameters$2,
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
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$2,
        setOperatorParametersExtended3: setOperatorParametersExtended3$2,
        setSaldo: setSaldo$2,
        setSaldoParameters: setSaldoParameters$2,
        setSeasonProfile: setSeasonProfile$2,
        setSpecialDay: setSpecialDay$2,
        setSpecialOperation: setSpecialOperation$2,
        turnRelayOff: turnRelayOff$2,
        turnRelayOn: turnRelayOn$2
    });

    var commandNames$1 = invertObject(downlinkIds);

    const id$20 = activateRatePlan$2;
    const name$20 = commandNames$1[activateRatePlan$2];
    const headerSize$20 = 2;
    const maxSize$20 = 1 + TARIFF_PLAN_SIZE;
    const accessLevel$20 = READ_WRITE;
    const isLoraOnly$20 = false;
    const examples$20 = {
        'set rate plan request': {
            id: id$20,
            name: name$20,
            headerSize: headerSize$20,
            maxSize: maxSize$20,
            accessLevel: accessLevel$20,
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
    const fromBytes$20 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            tariffTable: buffer.getUint8(),
            tariffPlan: buffer.getTariffPlan()
        };
    };
    const toBytes$20 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$20);
        buffer.setUint8(parameters.tariffTable);
        buffer.setTariffPlan(parameters.tariffPlan);
        return toBytes$21(id$20, buffer.data);
    };

    var activateRatePlan$1 = /*#__PURE__*/Object.freeze({
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

    const id$1$ = getBuildVersion$2;
    const name$1$ = commandNames$1[getBuildVersion$2];
    const headerSize$1$ = 2;
    const accessLevel$1$ = READ_ONLY;
    const maxSize$1$ = 0;
    const isLoraOnly$1$ = false;
    const examples$1$ = {
        'simple request': {
            id: id$1$,
            name: name$1$,
            headerSize: headerSize$1$,
            maxSize: maxSize$1$,
            accessLevel: accessLevel$1$,
            parameters: {},
            bytes: [
                0x70, 0x00
            ]
        }
    };
    const fromBytes$1$ = (bytes) => {
        if (bytes.length !== maxSize$1$) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1$ = () => toBytes$21(id$1$);

    var getBuildVersion$1 = /*#__PURE__*/Object.freeze({
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

    const id$1_ = getCorrectTime$2;
    const name$1_ = commandNames$1[getCorrectTime$2];
    const headerSize$1_ = 2;
    const maxSize$1_ = 0;
    const accessLevel$1_ = READ_ONLY;
    const isLoraOnly$1_ = false;
    const examples$1_ = {
        'simple request': {
            id: id$1_,
            name: name$1_,
            headerSize: headerSize$1_,
            maxSize: maxSize$1_,
            accessLevel: accessLevel$1_,
            parameters: {},
            bytes: [
                0x3e, 0x00
            ]
        }
    };
    const fromBytes$1_ = (bytes) => {
        if (bytes.length !== maxSize$1_) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1_ = () => toBytes$21(id$1_);

    var getCorrectTime$1 = /*#__PURE__*/Object.freeze({
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

    const CASE_OPEN = 0;
    const MAGNETIC_ON = 1;
    const PARAMETERS_UPDATE_REMOTE = 2;
    const PARAMETERS_UPDATE_LOCAL = 3;
    const RESTART = 4;
    const ERROR_ACCESS = 5;
    const TIME_SET = 6;
    const TIME_CORRECT = 7;
    const DEVICE_FAILURE = 8;
    const CASE_TERMINAL_OPEN = 9;
    const CASE_MODULE_OPEN = 10;
    const TARIFF_TABLE_SET = 11;
    const TARIFF_TABLE_GET = 12;
    const PROTECTION_RESET_EM = 13;
    const PROTECTION_RESET_MAGNETIC = 14;

    var criticalEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN,
        CASE_OPEN: CASE_OPEN,
        CASE_TERMINAL_OPEN: CASE_TERMINAL_OPEN,
        DEVICE_FAILURE: DEVICE_FAILURE,
        ERROR_ACCESS: ERROR_ACCESS,
        MAGNETIC_ON: MAGNETIC_ON,
        PARAMETERS_UPDATE_LOCAL: PARAMETERS_UPDATE_LOCAL,
        PARAMETERS_UPDATE_REMOTE: PARAMETERS_UPDATE_REMOTE,
        PROTECTION_RESET_EM: PROTECTION_RESET_EM,
        PROTECTION_RESET_MAGNETIC: PROTECTION_RESET_MAGNETIC,
        RESTART: RESTART,
        TARIFF_TABLE_GET: TARIFF_TABLE_GET,
        TARIFF_TABLE_SET: TARIFF_TABLE_SET,
        TIME_CORRECT: TIME_CORRECT,
        TIME_SET: TIME_SET
    });

    var criticalEventNames = invertObject(criticalEvents);

    const id$1Z = getCriticalEvent$2;
    const name$1Z = commandNames$1[getCriticalEvent$2];
    const headerSize$1Z = 2;
    const accessLevel$1Z = READ_ONLY;
    const maxSize$1Z = 2;
    const isLoraOnly$1Z = false;
    const examples$1Z = {
        'simple request': {
            id: id$1Z,
            name: name$1Z,
            headerSize: headerSize$1Z,
            accessLevel: accessLevel$1Z,
            maxSize: maxSize$1Z,
            parameters: {
                event: 1,
                name: 'MAGNETIC_ON',
                index: 22
            },
            bytes: [
                0x41, 0x02,
                0x01, 0x16
            ]
        }
    };
    const fromBytes$1Z = (bytes) => {
        if (bytes.length !== maxSize$1Z) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const [event, index] = bytes;
        return {
            event,
            name: criticalEventNames[event],
            index
        };
    };
    const toBytes$1Z = (parameters) => (toBytes$21(id$1Z, [parameters.event, parameters.index]));

    var getCriticalEvent$1 = /*#__PURE__*/Object.freeze({
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

    const id$1Y = getCurrentStatusMeter$2;
    const name$1Y = commandNames$1[getCurrentStatusMeter$2];
    const headerSize$1Y = 2;
    const accessLevel$1Y = READ_ONLY;
    const maxSize$1Y = 0;
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
                0x39, 0x00
            ]
        }
    };
    const fromBytes$1Y = (bytes) => {
        if (bytes.length !== maxSize$1Y) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1Y = () => toBytes$21(id$1Y);

    var getCurrentStatusMeter$1 = /*#__PURE__*/Object.freeze({
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

    const id$1X = getCurrentValues$2;
    const name$1X = commandNames$1[getCurrentValues$2];
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
                0x0d, 0x00
            ]
        }
    };
    const fromBytes$1X = (bytes) => {
        if (bytes.length !== maxSize$1X) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1X = () => toBytes$21(id$1X);

    var getCurrentValues$1 = /*#__PURE__*/Object.freeze({
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

    const id$1W = getDateTime$2;
    const name$1W = commandNames$1[getDateTime$2];
    const headerSize$1W = 2;
    const maxSize$1W = 0;
    const accessLevel$1W = READ_ONLY;
    const isLoraOnly$1W = false;
    const examples$1W = {
        'simple request': {
            id: id$1W,
            name: name$1W,
            headerSize: headerSize$1W,
            maxSize: maxSize$1W,
            accessLevel: accessLevel$1W,
            parameters: {},
            bytes: [
                0x07, 0x00
            ]
        }
    };
    const fromBytes$1W = (bytes) => {
        if (bytes.length !== maxSize$1W) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1W = () => toBytes$21(id$1W);

    var getDateTime$1 = /*#__PURE__*/Object.freeze({
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

    const A_PLUS$1 = 1;
    const A_MINUS$1 = 2;

    const MIN_COMMAND_SIZE$5 = 3;
    const MAX_COMMAND_SIZE$b = 4;
    const id$1V = getDayDemand$2;
    const name$1V = commandNames$1[getDayDemand$2];
    const headerSize$1V = 2;
    const maxSize$1V = MAX_COMMAND_SIZE$b;
    const accessLevel$1V = READ_ONLY;
    const isLoraOnly$1V = false;
    const examples$1V = {
        'request day values for 2024.03.22 00:00:00 GMT': {
            id: id$1V,
            name: name$1V,
            headerSize: headerSize$1V,
            maxSize: maxSize$1V,
            accessLevel: accessLevel$1V,
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
            id: id$1V,
            name: name$1V,
            headerSize: headerSize$1V,
            maxSize: maxSize$1V,
            accessLevel: accessLevel$1V,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: A_PLUS$1
            },
            bytes: [
                0x16, 0x04,
                0x18, 0x03, 0x16, 0x01
            ]
        }
    };
    const fromBytes$1V = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        if (bytes.length === MAX_COMMAND_SIZE$b) {
            return {
                date: buffer.getDate(),
                energyType: buffer.getUint8()
            };
        }
        return { date: buffer.getDate() };
    };
    const toBytes$1V = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(parameters?.energyType ? MAX_COMMAND_SIZE$b : MIN_COMMAND_SIZE$5);
        buffer.setDate(parameters?.date);
        if (parameters?.energyType) {
            buffer.setUint8(parameters.energyType);
        }
        return toBytes$21(id$1V, buffer.data);
    };

    var getDayDemand$1 = /*#__PURE__*/Object.freeze({
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

    const MIN_COMMAND_SIZE$4 = 3;
    const MAX_COMMAND_SIZE$a = 4;
    const id$1U = getDayDemandExport$2;
    const name$1U = commandNames$1[getDayDemandExport$2];
    const headerSize$1U = 2;
    const maxSize$1U = MAX_COMMAND_SIZE$a;
    const accessLevel$1U = READ_ONLY;
    const isLoraOnly$1U = false;
    const examples$1U = {
        'request day values for 2024.03.22 00:00:00 GMT': {
            id: id$1U,
            name: name$1U,
            headerSize: headerSize$1U,
            maxSize: maxSize$1U,
            accessLevel: accessLevel$1U,
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
        },
        'request day values with energy type for 2024.03.22 00:00:00 GMT': {
            id: id$1U,
            name: name$1U,
            headerSize: headerSize$1U,
            maxSize: maxSize$1U,
            accessLevel: accessLevel$1U,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: A_PLUS$1
            },
            bytes: [
                0x4f, 0x04,
                0x18, 0x03, 0x16, 0x01
            ]
        }
    };
    const fromBytes$1U = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        if (bytes.length === MAX_COMMAND_SIZE$a) {
            return {
                date: buffer.getDate(),
                energyType: buffer.getUint8()
            };
        }
        return { date: buffer.getDate() };
    };
    const toBytes$1U = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(parameters?.energyType ? MAX_COMMAND_SIZE$a : MIN_COMMAND_SIZE$4);
        buffer.setDate(parameters?.date);
        if (parameters?.energyType) {
            buffer.setUint8(parameters.energyType);
        }
        return toBytes$21(id$1U, buffer.data);
    };

    var getDayDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    const id$1T = getDayMaxDemand$2;
    const name$1T = commandNames$1[getDayMaxDemand$2];
    const headerSize$1T = 2;
    const maxSize$1T = 3;
    const accessLevel$1T = READ_ONLY;
    const isLoraOnly$1T = false;
    const examples$1T = {
        'request for 2024.03.22': {
            id: id$1T,
            name: name$1T,
            headerSize: headerSize$1T,
            maxSize: maxSize$1T,
            accessLevel: accessLevel$1T,
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
    const fromBytes$1T = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1T = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1T);
        buffer.setDate(parameters.date);
        return toBytes$21(id$1T, buffer.data);
    };

    var getDayMaxDemand$1 = /*#__PURE__*/Object.freeze({
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

    const id$1S = getDayMaxDemandExport$2;
    const name$1S = commandNames$1[getDayMaxDemandExport$2];
    const headerSize$1S = 2;
    const maxSize$1S = 3;
    const accessLevel$1S = READ_ONLY;
    const isLoraOnly$1S = false;
    const examples$1S = {
        'request for 2024.03.22': {
            id: id$1S,
            name: name$1S,
            headerSize: headerSize$1S,
            maxSize: maxSize$1S,
            accessLevel: accessLevel$1S,
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
    const fromBytes$1S = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1S = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1S);
        buffer.setDate(parameters.date);
        return toBytes$21(id$1S, buffer.data);
    };

    var getDayMaxDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    const id$1R = getDayMaxDemandPrevious$2;
    const name$1R = commandNames$1[getDayMaxDemandPrevious$2];
    const headerSize$1R = 2;
    const accessLevel$1R = READ_ONLY;
    const maxSize$1R = 0;
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
                0x4a, 0x00
            ]
        }
    };
    const fromBytes$1R = (bytes) => {
        if (bytes.length !== maxSize$1R) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1R = () => toBytes$21(id$1R);

    var getDayMaxDemandPrevious$1 = /*#__PURE__*/Object.freeze({
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

    const id$1Q = getDayProfile$2;
    const name$1Q = commandNames$1[getDayProfile$2];
    const headerSize$1Q = 2;
    const maxSize$1Q = 3;
    const accessLevel$1Q = READ_ONLY;
    const isLoraOnly$1Q = false;
    const examples$1Q = {
        'request for active tariff table A+': {
            id: id$1Q,
            name: name$1Q,
            maxSize: maxSize$1Q,
            headerSize: headerSize$1Q,
            accessLevel: accessLevel$1Q,
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
    const fromBytes$1Q = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$1Q = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1Q);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$21(id$1Q, buffer.data);
    };

    var getDayProfile$1 = /*#__PURE__*/Object.freeze({
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

    const A_PLUS = 0x01;
    const A_MINUS = 0x02;
    const VOLTAGE_10 = 0x40;
    const VOLTAGE = 0xa0;

    const id$1P = getDemand$2;
    const name$1P = commandNames$1[getDemand$2];
    const headerSize$1P = 2;
    const maxSize$1P = 7;
    const accessLevel$1P = READ_ONLY;
    const isLoraOnly$1P = false;
    const examples$1P = {
        'request for A+': {
            id: id$1P,
            name: name$1P,
            headerSize: headerSize$1P,
            maxSize: maxSize$1P,
            parameters: {
                date: {
                    year: 21,
                    month: 6,
                    date: 18
                },
                energyType: A_PLUS,
                firstIndex: 0,
                count: 2,
                period: 30
            },
            bytes: [
                0x76, 0x07,
                0x2a, 0xd2, 0x01, 0x00, 0x00, 0x02, 0x1e
            ]
        }
    };
    const fromBytes$1P = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDemand();
    };
    const toBytes$1P = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1P);
        buffer.setDemand(parameters);
        return toBytes$21(id$1P, buffer.data);
    };

    var getDemand$1 = /*#__PURE__*/Object.freeze({
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

    const id$1O = getDeviceId$2;
    const name$1O = commandNames$1[getDeviceId$2];
    const headerSize$1O = 2;
    const accessLevel$1O = READ_ONLY;
    const maxSize$1O = 0;
    const isLoraOnly$1O = false;
    const examples$1O = {
        'simple request': {
            id: id$1O,
            name: name$1O,
            headerSize: headerSize$1O,
            accessLevel: accessLevel$1O,
            maxSize: maxSize$1O,
            parameters: {},
            bytes: [
                0x05, 0x00
            ]
        }
    };
    const fromBytes$1O = (bytes) => {
        if (bytes.length !== maxSize$1O) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1O = () => toBytes$21(id$1O);

    var getDeviceId$1 = /*#__PURE__*/Object.freeze({
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

    const id$1N = getDeviceType$2;
    const name$1N = commandNames$1[getDeviceType$2];
    const headerSize$1N = 2;
    const accessLevel$1N = READ_ONLY;
    const maxSize$1N = 0;
    const isLoraOnly$1N = false;
    const examples$1N = {
        'simple request': {
            id: id$1N,
            name: name$1N,
            headerSize: headerSize$1N,
            maxSize: maxSize$1N,
            accessLevel: accessLevel$1N,
            parameters: {},
            bytes: [
                0x04, 0x00
            ]
        }
    };
    const fromBytes$1N = (data) => {
        if (data.length !== maxSize$1N) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$1N = () => toBytes$21(id$1N);

    var getDeviceType$1 = /*#__PURE__*/Object.freeze({
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

    const id$1M = getDisplayParam$2;
    const name$1M = commandNames$1[getDisplayParam$2];
    const headerSize$1M = 2;
    const maxSize$1M = 1;
    const accessLevel$1M = READ_ONLY;
    const isLoraOnly$1M = false;
    const examples$1M = {
        'get additional display parameters': {
            id: id$1M,
            name: name$1M,
            headerSize: headerSize$1M,
            maxSize: maxSize$1M,
            accessLevel: accessLevel$1M,
            parameters: {
                displayMode: 1
            },
            bytes: [
                0x5e, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1M = ([displayMode]) => ({ displayMode });
    const toBytes$1M = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1M);
        buffer.setUint8(parameters.displayMode);
        return toBytes$21(id$1M, buffer.data);
    };

    var getDisplayParam$1 = /*#__PURE__*/Object.freeze({
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

    const MIN_COMMAND_SIZE$3 = 0;
    const MAX_COMMAND_SIZE$9 = 1;
    const id$1L = getEnergy$2;
    const name$1L = commandNames$1[getEnergy$2];
    const headerSize$1L = 2;
    const maxSize$1L = MAX_COMMAND_SIZE$9;
    const accessLevel$1L = READ_ONLY;
    const isLoraOnly$1L = false;
    const examples$1L = {
        'get default A+ energy': {
            id: id$1L,
            name: name$1L,
            headerSize: headerSize$1L,
            maxSize: maxSize$1L,
            accessLevel: accessLevel$1L,
            parameters: {},
            bytes: [
                0x0f, 0x00
            ]
        },
        'get A- energy': {
            id: id$1L,
            name: name$1L,
            headerSize: headerSize$1L,
            maxSize: maxSize$1L,
            accessLevel: accessLevel$1L,
            parameters: {
                energyType: A_MINUS$1
            },
            bytes: [
                0x0f, 0x01,
                0x02
            ]
        }
    };
    const fromBytes$1L = (bytes) => {
        if (bytes.length === MAX_COMMAND_SIZE$9) {
            return { energyType: bytes[0] };
        }
        return {};
    };
    const toBytes$1L = (parameters = {}) => {
        const buffer = new CommandBinaryBuffer$1(parameters?.energyType ? MAX_COMMAND_SIZE$9 : MIN_COMMAND_SIZE$3);
        if (parameters?.energyType) {
            buffer.setUint8(parameters.energyType);
        }
        return toBytes$21(id$1L, buffer.data);
    };

    var getEnergy$1 = /*#__PURE__*/Object.freeze({
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

    const MIN_COMMAND_SIZE$2 = 0;
    const MAX_COMMAND_SIZE$8 = 1;
    const id$1K = getEnergyDayPrevious$2;
    const name$1K = commandNames$1[getEnergyDayPrevious$2];
    const headerSize$1K = 2;
    const maxSize$1K = MAX_COMMAND_SIZE$8;
    const accessLevel$1K = READ_ONLY;
    const isLoraOnly$1K = false;
    const examples$1K = {
        'simple request': {
            id: id$1K,
            name: name$1K,
            headerSize: headerSize$1K,
            maxSize: maxSize$1K,
            accessLevel: accessLevel$1K,
            parameters: {},
            bytes: [
                0x03, 0x00
            ]
        },
        'request A- energy': {
            id: id$1K,
            name: name$1K,
            headerSize: headerSize$1K,
            maxSize: maxSize$1K,
            accessLevel: accessLevel$1K,
            parameters: {
                energyType: A_MINUS$1
            },
            bytes: [
                0x03, 0x01,
                0x02
            ]
        }
    };
    const fromBytes$1K = (bytes) => {
        const { length } = bytes;
        if (length !== MAX_COMMAND_SIZE$8 && length !== MIN_COMMAND_SIZE$2) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        if (length === MAX_COMMAND_SIZE$8) {
            return { energyType: bytes[0] };
        }
        return {};
    };
    const toBytes$1K = (parameters) => {
        if (parameters.energyType) {
            return toBytes$21(id$1K, [parameters.energyType]);
        }
        return toBytes$21(id$1K);
    };

    var getEnergyDayPrevious$1 = /*#__PURE__*/Object.freeze({
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

    const MIN_COMMAND_SIZE$1 = 0;
    const MAX_COMMAND_SIZE$7 = 1;
    const id$1J = getEnergyExport$2;
    const name$1J = commandNames$1[getEnergyExport$2];
    const headerSize$1J = 2;
    const maxSize$1J = MAX_COMMAND_SIZE$7;
    const accessLevel$1J = READ_ONLY;
    const isLoraOnly$1J = false;
    const examples$1J = {
        'get default A+ energy': {
            id: id$1J,
            name: name$1J,
            headerSize: headerSize$1J,
            maxSize: maxSize$1J,
            accessLevel: accessLevel$1J,
            parameters: {},
            bytes: [
                0x5b, 0x00
            ]
        },
        'get A- energy': {
            id: id$1J,
            name: name$1J,
            headerSize: headerSize$1J,
            maxSize: maxSize$1J,
            accessLevel: accessLevel$1J,
            parameters: {
                energyType: A_MINUS$1
            },
            bytes: [
                0x5b, 0x01,
                0x02
            ]
        }
    };
    const fromBytes$1J = (bytes) => {
        if (bytes.length === MAX_COMMAND_SIZE$7) {
            return { energyType: bytes[0] };
        }
        return {};
    };
    const toBytes$1J = (parameters = {}) => {
        const buffer = new CommandBinaryBuffer$1(parameters?.energyType ? MAX_COMMAND_SIZE$7 : MIN_COMMAND_SIZE$1);
        if (parameters?.energyType) {
            buffer.setUint8(parameters.energyType);
        }
        return toBytes$21(id$1J, buffer.data);
    };

    var getEnergyExport$1 = /*#__PURE__*/Object.freeze({
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

    const MIN_COMMAND_SIZE = 0;
    const MAX_COMMAND_SIZE$6 = 1;
    const id$1I = getEnergyExportDayPrevious$2;
    const name$1I = commandNames$1[getEnergyExportDayPrevious$2];
    const headerSize$1I = 2;
    const maxSize$1I = MAX_COMMAND_SIZE$6;
    const accessLevel$1I = READ_ONLY;
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
                0x50, 0x00
            ]
        },
        'request A- energy': {
            id: id$1I,
            name: name$1I,
            headerSize: headerSize$1I,
            maxSize: maxSize$1I,
            accessLevel: accessLevel$1I,
            parameters: {
                energyType: A_MINUS$1
            },
            bytes: [
                0x50, 0x01,
                0x02
            ]
        }
    };
    const fromBytes$1I = (bytes) => {
        const { length } = bytes;
        if (length !== MAX_COMMAND_SIZE$6 && length !== MIN_COMMAND_SIZE) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        if (length === MAX_COMMAND_SIZE$6) {
            return { energyType: bytes[0] };
        }
        return {};
    };
    const toBytes$1I = (parameters) => {
        if (parameters.energyType) {
            return toBytes$21(id$1I, [parameters.energyType]);
        }
        return toBytes$21(id$1I);
    };

    var getEnergyExportDayPrevious$1 = /*#__PURE__*/Object.freeze({
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

    const id$1H = getEvents$2;
    const name$1H = commandNames$1[getEvents$2];
    const headerSize$1H = 2;
    const accessLevel$1H = READ_ONLY;
    const maxSize$1H = 4;
    const isLoraOnly$1H = false;
    const examples$1H = {
        'simple request': {
            id: id$1H,
            name: name$1H,
            headerSize: headerSize$1H,
            accessLevel: accessLevel$1H,
            maxSize: maxSize$1H,
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
    const fromBytes$1H = (bytes) => {
        if (bytes.length !== maxSize$1H) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        const date = buffer.getDate();
        const offset = buffer.getUint8();
        return { date, offset };
    };
    const toBytes$1H = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1H);
        buffer.setDate(parameters.date);
        buffer.setUint8(parameters.offset);
        return toBytes$21(id$1H, buffer.data);
    };

    var getEvents$1 = /*#__PURE__*/Object.freeze({
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

    const id$1G = getEventsCounters$2;
    const name$1G = commandNames$1[getEventsCounters$2];
    const headerSize$1G = 2;
    const accessLevel$1G = READ_ONLY;
    const maxSize$1G = 0;
    const isLoraOnly$1G = false;
    const examples$1G = {
        'simple request': {
            id: id$1G,
            name: name$1G,
            headerSize: headerSize$1G,
            accessLevel: accessLevel$1G,
            maxSize: maxSize$1G,
            parameters: {},
            bytes: [
                0x34, 0x00
            ]
        }
    };
    const fromBytes$1G = (bytes) => {
        if (bytes.length !== maxSize$1G) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1G = () => toBytes$21(id$1G);

    var getEventsCounters$1 = /*#__PURE__*/Object.freeze({
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

    const id$1F = getEventStatus$2;
    const name$1F = commandNames$1[getEventStatus$2];
    const headerSize$1F = 2;
    const accessLevel$1F = READ_ONLY;
    const maxSize$1F = 0;
    const isLoraOnly$1F = false;
    const examples$1F = {
        'simple request': {
            id: id$1F,
            name: name$1F,
            headerSize: headerSize$1F,
            accessLevel: accessLevel$1F,
            maxSize: maxSize$1F,
            parameters: {},
            bytes: [
                0x01, 0x00
            ]
        }
    };
    const fromBytes$1F = (bytes) => {
        if (bytes.length !== maxSize$1F) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1F = () => toBytes$21(id$1F);

    var getEventStatus$1 = /*#__PURE__*/Object.freeze({
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

    const id$1E = getExtendedCurrentValues$2;
    const name$1E = commandNames$1[getExtendedCurrentValues$2];
    const headerSize$1E = 2;
    const maxSize$1E = 0;
    const accessLevel$1E = READ_ONLY;
    const isLoraOnly$1E = false;
    const examples$1E = {
        'simple request': {
            id: id$1E,
            name: name$1E,
            headerSize: headerSize$1E,
            maxSize: maxSize$1E,
            accessLevel: accessLevel$1E,
            parameters: {},
            bytes: [
                0x3a, 0x00
            ]
        }
    };
    const fromBytes$1E = (bytes) => {
        if (bytes.length !== maxSize$1E) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1E = () => toBytes$21(id$1E);

    var getExtendedCurrentValues$1 = /*#__PURE__*/Object.freeze({
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

    const id$1D = getExtendedCurrentValues2$2;
    const name$1D = commandNames$1[getExtendedCurrentValues2$2];
    const headerSize$1D = 2;
    const accessLevel$1D = READ_ONLY;
    const maxSize$1D = 0;
    const isLoraOnly$1D = false;
    const examples$1D = {
        'simple request': {
            id: id$1D,
            name: name$1D,
            headerSize: headerSize$1D,
            maxSize: maxSize$1D,
            accessLevel: accessLevel$1D,
            parameters: {},
            bytes: [
                0x2d, 0x00
            ]
        }
    };
    const fromBytes$1D = (bytes) => {
        if (bytes.length !== maxSize$1D) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1D = () => toBytes$21(id$1D);

    var getExtendedCurrentValues2$1 = /*#__PURE__*/Object.freeze({
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

    const id$1C = getHalfHourDemand$2;
    const name$1C = commandNames$1[getHalfHourDemand$2];
    const headerSize$1C = 2;
    const maxSize$1C = 3;
    const accessLevel$1C = READ_ONLY;
    const isLoraOnly$1C = false;
    const examples$1C = {
        'request archive values for 2024.03.22': {
            id: id$1C,
            name: name$1C,
            headerSize: headerSize$1C,
            maxSize: maxSize$1C,
            accessLevel: accessLevel$1C,
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
    const fromBytes$1C = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1C = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1C);
        buffer.setDate(parameters.date);
        return toBytes$21(id$1C, buffer.data);
    };

    var getHalfHourDemand$1 = /*#__PURE__*/Object.freeze({
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

    const id$1B = getHalfHourDemandExport$2;
    const name$1B = commandNames$1[getHalfHourDemandExport$2];
    const headerSize$1B = 2;
    const maxSize$1B = 3;
    const accessLevel$1B = READ_ONLY;
    const isLoraOnly$1B = false;
    const examples$1B = {
        'request archive values for 2024.03.22': {
            id: id$1B,
            name: name$1B,
            headerSize: headerSize$1B,
            maxSize: maxSize$1B,
            accessLevel: accessLevel$1B,
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
    const fromBytes$1B = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return { date: buffer.getDate() };
    };
    const toBytes$1B = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1B);
        buffer.setDate(parameters.date);
        return toBytes$21(id$1B, buffer.data);
    };

    var getHalfHourDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    const id$1A = getHalfHourDemandPrevious$2;
    const name$1A = commandNames$1[getHalfHourDemandPrevious$2];
    const headerSize$1A = 2;
    const accessLevel$1A = READ_ONLY;
    const maxSize$1A = 0;
    const isLoraOnly$1A = false;
    const examples$1A = {
        'simple request': {
            id: id$1A,
            name: name$1A,
            headerSize: headerSize$1A,
            maxSize: maxSize$1A,
            accessLevel: accessLevel$1A,
            parameters: {},
            bytes: [
                0x4b, 0x00
            ]
        }
    };
    const fromBytes$1A = (data) => {
        if (data.length !== maxSize$1A) {
            throw new Error(`Wrong buffer size: ${data.length}.`);
        }
        return {};
    };
    const toBytes$1A = () => toBytes$21(id$1A);

    var getHalfHourDemandPrevious$1 = /*#__PURE__*/Object.freeze({
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
    function CommandBinaryBuffer(dataOrLength, isLittleEndian = false) {
        BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.prototype.getDate = function () {
        const date0 = this.getUint8();
        const date1 = this.getUint8();
        return {
            year: date0 >> 1,
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        };
    };
    CommandBinaryBuffer.prototype.setDate = function ({ year, month, date }) {
        const date0 = (year << 1) | ((month >> 3) & 0x01);
        const date1 = ((month << 5) & 0xe0) | (date & 0x1f);
        this.setUint8(date0);
        this.setUint8(date1);
    };
    CommandBinaryBuffer.prototype.getEnergiesFlags = function () {
        const byte = this.getUint8();
        return toObject(energiesMask, byte);
    };
    CommandBinaryBuffer.prototype.setEnergiesFlags = function (energies) {
        this.setUint8(getEnergiesFlags(energies));
    };
    CommandBinaryBuffer.prototype.getHalfhoursEnergy = function (halfhoursNumber) {
        const halfhours = [];
        for (let index = 0; index < halfhoursNumber; index++) {
            const value = this.getUint16();
            halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
        }
        return halfhours;
    };
    CommandBinaryBuffer.prototype.setHalfhoursEnergy = function (halfhours) {
        if (halfhours) {
            for (let index = 0; index < halfhours.length; index++) {
                const value = halfhours[index];
                this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
            }
        }
    };
    CommandBinaryBuffer.prototype.getHalfhoursEnergies = function (energiesFlags, halfhoursNumber) {
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
    CommandBinaryBuffer.prototype.setHalfhoursEnergies = function (energies) {
        this.setHalfhoursEnergy(energies['A+']);
        this.setHalfhoursEnergy(energies['A+R+']);
        this.setHalfhoursEnergy(energies['A+R-']);
        this.setHalfhoursEnergy(energies['A-']);
        this.setHalfhoursEnergy(energies['A-R+']);
        this.setHalfhoursEnergy(energies['A-R-']);
    };
    CommandBinaryBuffer.prototype.getAPlusTariffEnergies = function (energyFlags) {
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
    CommandBinaryBuffer.prototype.setAPlusTariffEnergies = function (energies) {
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
    CommandBinaryBuffer.prototype.getAMinusTariffEnergies = function (energyFlags) {
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
    CommandBinaryBuffer.prototype.setAMinusTariffEnergies = function (energies) {
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
    CommandBinaryBuffer.prototype.getTariffsEnergies = function () {
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
    CommandBinaryBuffer.prototype.setTariffsEnergies = function (tariffs) {
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
    CommandBinaryBuffer.prototype.getPowerMax = function () {
        return {
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        };
    };
    CommandBinaryBuffer.prototype.setPowerMax = function (value) {
        if (value) {
            const { hours, minutes, power } = value;
            this.setUint8(hours);
            this.setUint8(minutes);
            this.setUint32(power);
        }
    };
    CommandBinaryBuffer.prototype.getAPlusTariffPowerMax = function (energyFlags) {
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
    CommandBinaryBuffer.prototype.setAPlusTariffPowerMax = function (energies) {
        if (energies) {
            this.setPowerMax(energies['A+']);
            this.setPowerMax(energies['A+R+']);
            this.setPowerMax(energies['A+R+']);
        }
    };
    CommandBinaryBuffer.prototype.getAMinusTariffPowerMax = function (energyFlags) {
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
    CommandBinaryBuffer.prototype.setAMinusTariffPowerMax = function (energies) {
        if (energies) {
            this.setPowerMax(energies['A-']);
            this.setPowerMax(energies['A-R+']);
            this.setPowerMax(energies['A-R-']);
        }
    };
    CommandBinaryBuffer.prototype.getTariffsPowerMax = function () {
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
    CommandBinaryBuffer.prototype.setTariffsPowerMax = function (tariffs) {
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

    const id$1z = getHalfhoursEnergies$2;
    const name$1z = commandNames$1[getHalfhoursEnergies$2];
    const headerSize$1z = 2;
    const maxSize$1z = 5;
    const accessLevel$1z = UNENCRYPTED;
    const isLoraOnly$1z = true;
    const examples$1z = {
        'request for halfhours energies': {
            id: id$1z,
            name: name$1z,
            headerSize: headerSize$1z,
            maxSize: maxSize$1z,
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
    const fromBytes$1z = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            date: buffer.getDate(),
            energies: buffer.getEnergiesFlags(),
            firstHalfhour: buffer.getUint8(),
            halfhoursNumber: buffer.getUint8()
        };
    };
    const toBytes$1z = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$1z);
        buffer.setDate(parameters.date);
        buffer.setEnergiesFlags(parameters.energies);
        buffer.setUint8(parameters.firstHalfhour);
        buffer.setUint8(parameters.halfhoursNumber);
        return toBytes$21(id$1z, buffer.data);
    };

    var getHalfhoursEnergies$1 = /*#__PURE__*/Object.freeze({
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

    const id$1y = getMagneticFieldThreshold$2;
    const name$1y = commandNames$1[getMagneticFieldThreshold$2];
    const headerSize$1y = 2;
    const maxSize$1y = 0;
    const accessLevel$1y = READ_ONLY;
    const isLoraOnly$1y = false;
    const examples$1y = {
        'simple request': {
            id: id$1y,
            name: name$1y,
            headerSize: headerSize$1y,
            maxSize: maxSize$1y,
            accessLevel: accessLevel$1y,
            parameters: {},
            bytes: [
                0x6d, 0x00
            ]
        }
    };
    const fromBytes$1y = (bytes) => {
        if (bytes.length !== maxSize$1y) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1y = () => toBytes$21(id$1y);

    var getMagneticFieldThreshold$1 = /*#__PURE__*/Object.freeze({
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

    const id$1x = getMeterInfo$2;
    const name$1x = commandNames$1[getMeterInfo$2];
    const headerSize$1x = 2;
    const maxSize$1x = 0;
    const accessLevel$1x = READ_ONLY;
    const isLoraOnly$1x = false;
    const examples$1x = {
        'simple request': {
            id: id$1x,
            name: name$1x,
            headerSize: headerSize$1x,
            maxSize: maxSize$1x,
            accessLevel: accessLevel$1x,
            parameters: {},
            bytes: [
                0x7a, 0x00
            ]
        }
    };
    const fromBytes$1x = (bytes) => {
        if (bytes.length !== maxSize$1x) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1x = () => toBytes$21(id$1x);

    var getMeterInfo$1 = /*#__PURE__*/Object.freeze({
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

    const id$1w = getMonthDemand$2;
    const name$1w = commandNames$1[getMonthDemand$2];
    const headerSize$1w = 2;
    const maxSize$1w = 2;
    const accessLevel$1w = READ_ONLY;
    const isLoraOnly$1w = false;
    const examples$1w = {
        'request energy for 2024.03': {
            id: id$1w,
            name: name$1w,
            headerSize: headerSize$1w,
            maxSize: maxSize$1w,
            accessLevel: accessLevel$1w,
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
    const fromBytes$1w = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8()
        };
    };
    const toBytes$1w = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1w);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        return toBytes$21(id$1w, buffer.data);
    };

    var getMonthDemand$1 = /*#__PURE__*/Object.freeze({
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

    const id$1v = getMonthDemandExport$2;
    const name$1v = commandNames$1[getMonthDemandExport$2];
    const headerSize$1v = 2;
    const maxSize$1v = 2;
    const accessLevel$1v = READ_ONLY;
    const isLoraOnly$1v = false;
    const examples$1v = {
        'request energy for 2024.03': {
            id: id$1v,
            name: name$1v,
            headerSize: headerSize$1v,
            maxSize: maxSize$1v,
            accessLevel: accessLevel$1v,
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
    const fromBytes$1v = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8()
        };
    };
    const toBytes$1v = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1v);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        return toBytes$21(id$1v, buffer.data);
    };

    var getMonthDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    const id$1u = getMonthMaxDemand$2;
    const name$1u = commandNames$1[getMonthMaxDemand$2];
    const headerSize$1u = 2;
    const maxSize$1u = 2;
    const accessLevel$1u = READ_ONLY;
    const isLoraOnly$1u = false;
    const examples$1u = {
        'request max power for 2024.03': {
            id: id$1u,
            name: name$1u,
            headerSize: headerSize$1u,
            maxSize: maxSize$1u,
            accessLevel: accessLevel$1u,
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
    const fromBytes$1u = (bytes) => {
        const [year, month] = bytes;
        return { year, month };
    };
    const toBytes$1u = ({ year, month }) => (toBytes$21(id$1u, [year, month]));

    var getMonthMaxDemand$1 = /*#__PURE__*/Object.freeze({
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

    const id$1t = getMonthMaxDemandExport$2;
    const name$1t = commandNames$1[getMonthMaxDemandExport$2];
    const headerSize$1t = 2;
    const maxSize$1t = 2;
    const accessLevel$1t = READ_ONLY;
    const isLoraOnly$1t = false;
    const examples$1t = {
        'request max power for 2024.03': {
            id: id$1t,
            name: name$1t,
            headerSize: headerSize$1t,
            maxSize: maxSize$1t,
            accessLevel: accessLevel$1t,
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
    const fromBytes$1t = (bytes) => {
        const [year, month] = bytes;
        return { year, month };
    };
    const toBytes$1t = ({ year, month }) => (toBytes$21(id$1t, [year, month]));

    var getMonthMaxDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    const id$1s = getOperatorParametersExtended3$2;
    const name$1s = commandNames$1[getOperatorParametersExtended3$2];
    const headerSize$1s = 2;
    const maxSize$1s = 0;
    const accessLevel$1s = READ_ONLY;
    const isLoraOnly$1s = false;
    const examples$1s = {
        'simple request': {
            id: id$1s,
            name: name$1s,
            headerSize: headerSize$1s,
            maxSize: maxSize$1s,
            accessLevel: accessLevel$1s,
            parameters: {},
            bytes: [
                0x71, 0x00
            ]
        }
    };
    const fromBytes$1s = (bytes) => {
        if (bytes.length !== maxSize$1s) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1s = () => toBytes$21(id$1s);

    var getOperatorParametersExtended3$1 = /*#__PURE__*/Object.freeze({
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

    const id$1r = getOperatorParameters$2;
    const name$1r = commandNames$1[getOperatorParameters$2];
    const headerSize$1r = 2;
    const maxSize$1r = 0;
    const accessLevel$1r = READ_ONLY;
    const isLoraOnly$1r = false;
    const examples$1r = {
        'simple request': {
            id: id$1r,
            name: name$1r,
            headerSize: headerSize$1r,
            maxSize: maxSize$1r,
            accessLevel: accessLevel$1r,
            parameters: {},
            bytes: [
                0x1e, 0x00
            ]
        }
    };
    const fromBytes$1r = (bytes) => {
        if (bytes.length !== maxSize$1r) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1r = () => toBytes$21(id$1r);

    var getOperatorParameters$1 = /*#__PURE__*/Object.freeze({
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

    const id$1q = getRatePlanInfo$2;
    const name$1q = commandNames$1[getRatePlanInfo$2];
    const headerSize$1q = 2;
    const maxSize$1q = 1;
    const accessLevel$1q = READ_ONLY;
    const isLoraOnly$1q = false;
    const examples$1q = {
        'request for table A-': {
            id: id$1q,
            name: name$1q,
            headerSize: headerSize$1q,
            maxSize: maxSize$1q,
            accessLevel: accessLevel$1q,
            parameters: {
                tariffTable: 1
            },
            bytes: [
                0x2c, 0x01,
                0x01
            ]
        }
    };
    const fromBytes$1q = (bytes) => ({ tariffTable: bytes[0] });
    const toBytes$1q = (parameters) => (toBytes$21(id$1q, [parameters.tariffTable]));

    var getRatePlanInfo$1 = /*#__PURE__*/Object.freeze({
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

    const id$1p = getSaldo$2;
    const name$1p = commandNames$1[getSaldo$2];
    const headerSize$1p = 2;
    const maxSize$1p = 0;
    const accessLevel$1p = READ_ONLY;
    const isLoraOnly$1p = false;
    const examples$1p = {
        'simple request': {
            id: id$1p,
            name: name$1p,
            headerSize: headerSize$1p,
            maxSize: maxSize$1p,
            accessLevel: accessLevel$1p,
            parameters: {},
            bytes: [
                0x29, 0x00
            ]
        }
    };
    const fromBytes$1p = (bytes) => {
        if (bytes.length !== maxSize$1p) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1p = () => toBytes$21(id$1p);

    var getSaldo$1 = /*#__PURE__*/Object.freeze({
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

    const id$1o = getSaldoParameters$2;
    const name$1o = commandNames$1[getSaldoParameters$2];
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
            bytes: [0x2e, 0x00]
        }
    };
    const fromBytes$1o = (bytes) => {
        if (bytes.length !== maxSize$1o) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1o = () => toBytes$21(id$1o);

    var getSaldoParameters$1 = /*#__PURE__*/Object.freeze({
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

    const id$1n = getSeasonProfile$2;
    const name$1n = commandNames$1[getSeasonProfile$2];
    const headerSize$1n = 2;
    const maxSize$1n = 3;
    const accessLevel$1n = READ_ONLY;
    const isLoraOnly$1n = false;
    const examples$1n = {
        'request for passive tariff table A+': {
            id: id$1n,
            name: name$1n,
            headerSize: headerSize$1n,
            maxSize: maxSize$1n,
            accessLevel: accessLevel$1n,
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
    const fromBytes$1n = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$1n = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1n);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$21(id$1n, buffer.data);
    };

    var getSeasonProfile$1 = /*#__PURE__*/Object.freeze({
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

    const id$1m = getSpecialDay$2;
    const name$1m = commandNames$1[getSpecialDay$2];
    const headerSize$1m = 2;
    const maxSize$1m = 3;
    const accessLevel$1m = READ_ONLY;
    const isLoraOnly$1m = false;
    const examples$1m = {
        'request for passive tariff table A+': {
            id: id$1m,
            name: name$1m,
            headerSize: headerSize$1m,
            maxSize: maxSize$1m,
            accessLevel: accessLevel$1m,
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
    const fromBytes$1m = ([tariffTable, index, isActive]) => ({ tariffTable, index, isActive: isActive === 0 });
    const toBytes$1m = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1m);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setUint8(parameters.isActive ? 0 : 1);
        return toBytes$21(id$1m, buffer.data);
    };

    var getSpecialDay$1 = /*#__PURE__*/Object.freeze({
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

    const id$1l = getVersion$2;
    const name$1l = commandNames$1[getVersion$2];
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
                0x28, 0x00
            ]
        }
    };
    const fromBytes$1l = (bytes) => {
        if (bytes.length !== maxSize$1l) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1l = () => toBytes$21(id$1l);

    var getVersion$1 = /*#__PURE__*/Object.freeze({
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

    const id$1k = prepareRatePlan$2;
    const name$1k = commandNames$1[prepareRatePlan$2];
    const headerSize$1k = 2;
    const maxSize$1k = 5;
    const accessLevel$1k = READ_WRITE;
    const isLoraOnly$1k = false;
    const examples$1k = {
        'prepare rate plan request': {
            id: id$1k,
            name: name$1k,
            headerSize: headerSize$1k,
            maxSize: maxSize$1k,
            accessLevel: accessLevel$1k,
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
    const fromBytes$1k = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            tariffTable: buffer.getUint8(),
            id: buffer.getUint32()
        };
    };
    const toBytes$1k = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1k);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint32(parameters.id);
        return toBytes$21(id$1k, buffer.data);
    };

    var prepareRatePlan$1 = /*#__PURE__*/Object.freeze({
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

    const id$1j = resetPowerMaxDay$2;
    const name$1j = commandNames$1[resetPowerMaxDay$2];
    const headerSize$1j = 2;
    const maxSize$1j = 0;
    const accessLevel$1j = READ_WRITE;
    const isLoraOnly$1j = false;
    const examples$1j = {
        'simple request': {
            id: id$1j,
            name: name$1j,
            headerSize: headerSize$1j,
            maxSize: maxSize$1j,
            accessLevel: accessLevel$1j,
            parameters: {},
            bytes: [
                0x35, 0x00
            ]
        }
    };
    const fromBytes$1j = (bytes) => {
        if (bytes.length !== maxSize$1j) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1j = () => toBytes$21(id$1j);

    var resetPowerMaxDay$1 = /*#__PURE__*/Object.freeze({
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

    const id$1i = resetPowerMaxMonth$2;
    const name$1i = commandNames$1[resetPowerMaxMonth$2];
    const headerSize$1i = 2;
    const maxSize$1i = 0;
    const accessLevel$1i = READ_WRITE;
    const isLoraOnly$1i = false;
    const examples$1i = {
        'simple request': {
            id: id$1i,
            name: name$1i,
            headerSize: headerSize$1i,
            maxSize: maxSize$1i,
            accessLevel: accessLevel$1i,
            parameters: {},
            bytes: [
                0x36, 0x00
            ]
        }
    };
    const fromBytes$1i = (bytes) => {
        if (bytes.length !== maxSize$1i) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1i = () => toBytes$21(id$1i);

    var resetPowerMaxMonth$1 = /*#__PURE__*/Object.freeze({
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

    const id$1h = runTariffPlan$2;
    const name$1h = commandNames$1[runTariffPlan$2];
    const headerSize$1h = 2;
    const maxSize$1h = 1;
    const accessLevel$1h = READ_WRITE;
    const isLoraOnly$1h = false;
    const examples$1h = {
        'simple request': {
            id: id$1h,
            name: name$1h,
            headerSize: headerSize$1h,
            maxSize: maxSize$1h,
            accessLevel: accessLevel$1h,
            parameters: { tariffTable: 5 },
            bytes: [
                0x46, 0x01,
                0x05
            ]
        }
    };
    const fromBytes$1h = (bytes) => ({ tariffTable: bytes[0] });
    const toBytes$1h = (parameters) => (toBytes$21(id$1h, [parameters.tariffTable]));

    var runTariffPlan$1 = /*#__PURE__*/Object.freeze({
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

    const KEY_SIZE = 16;
    const id$1g = setAccessKey$2;
    const name$1g = commandNames$1[setAccessKey$2];
    const headerSize$1g = 2;
    const maxSize$1g = 1 + KEY_SIZE;
    const accessLevel$1g = READ_WRITE;
    const isLoraOnly$1g = false;
    const examples$1g = {
        'set key for READ_ONLY access level': {
            id: id$1g,
            name: name$1g,
            headerSize: headerSize$1g,
            maxSize: maxSize$1g,
            accessLevel: accessLevel$1g,
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
    const fromBytes$1g = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            accessLevel: buffer.getUint8(),
            key: buffer.getBytes(KEY_SIZE)
        };
    };
    const toBytes$1g = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1g);
        buffer.setUint8(parameters.accessLevel);
        buffer.setBytes(parameters.key);
        return toBytes$21(id$1g, buffer.data);
    };

    var setAccessKey$1 = /*#__PURE__*/Object.freeze({
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

    const id$1f = setCorrectDateTime$2;
    const name$1f = commandNames$1[setCorrectDateTime$2];
    const headerSize$1f = 2;
    const maxSize$1f = 2;
    const accessLevel$1f = READ_ONLY;
    const isLoraOnly$1f = false;
    const examples$1f = {
        'shift device time 5 seconds forward': {
            id: id$1f,
            name: name$1f,
            headerSize: headerSize$1f,
            maxSize: maxSize$1f,
            accessLevel: accessLevel$1f,
            parameters: { seconds: 5 },
            bytes: [
                0x5c, 0x02,
                0x00, 0x05
            ]
        },
        'shift device time 5 seconds backward': {
            id: id$1f,
            name: name$1f,
            headerSize: headerSize$1f,
            maxSize: maxSize$1f,
            parameters: { seconds: -5 },
            bytes: [
                0x5c, 0x02,
                0xff, 0xfb
            ]
        }
    };
    const fromBytes$1f = (bytes) => {
        if (bytes.length !== maxSize$1f) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        return { seconds: buffer.getInt16() };
    };
    const toBytes$1f = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1f);
        buffer.setInt16(parameters.seconds);
        return toBytes$21(id$1f, buffer.data);
    };

    var setCorrectDateTime$1 = /*#__PURE__*/Object.freeze({
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

    const id$1e = setCorrectTime$2;
    const name$1e = commandNames$1[setCorrectTime$2];
    const headerSize$1e = 2;
    const maxSize$1e = 9;
    const accessLevel$1e = READ_WRITE;
    const isLoraOnly$1e = false;
    const examples$1e = {
        'default parameters': {
            id: id$1e,
            name: name$1e,
            headerSize: headerSize$1e,
            maxSize: maxSize$1e,
            accessLevel: accessLevel$1e,
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
    const fromBytes$1e = (bytes) => {
        if (bytes.length !== maxSize$1e) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getTimeCorrectionParameters();
    };
    const toBytes$1e = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1e);
        buffer.setTimeCorrectionParameters(parameters);
        return toBytes$21(id$1e, buffer.data);
    };

    var setCorrectTime$1 = /*#__PURE__*/Object.freeze({
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

    const id$1d = setDateTime$2;
    const name$1d = commandNames$1[setDateTime$2];
    const headerSize$1d = 2;
    const maxSize$1d = 8;
    const accessLevel$1d = READ_ONLY;
    const isLoraOnly$1d = false;
    const examples$1d = {
        'time: 2024.02.19 18:31:55': {
            id: id$1d,
            name: name$1d,
            headerSize: headerSize$1d,
            maxSize: maxSize$1d,
            accessLevel: accessLevel$1d,
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
    const fromBytes$1d = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDateTime();
    };
    const toBytes$1d = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1d);
        buffer.setDateTime(parameters);
        return toBytes$21(id$1d, buffer.data);
    };

    var setDateTime$1 = /*#__PURE__*/Object.freeze({
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

    const MAX_PERIODS_NUMBER$1 = 8;
    const PERIODS_FINAL_BYTE$1 = 0xff;
    const id$1c = setDayProfile$2;
    const name$1c = commandNames$1[setDayProfile$2];
    const headerSize$1c = 2;
    const maxSize$1c = 2 + MAX_PERIODS_NUMBER$1;
    const accessLevel$1c = READ_WRITE;
    const isLoraOnly$1c = false;
    const examples$1c = {
        'set day profile with 1 period': {
            id: id$1c,
            name: name$1c,
            headerSize: headerSize$1c,
            maxSize: maxSize$1c,
            accessLevel: accessLevel$1c,
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
            id: id$1c,
            name: name$1c,
            headerSize: headerSize$1c,
            maxSize: maxSize$1c,
            accessLevel: accessLevel$1c,
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
            id: id$1c,
            name: name$1c,
            headerSize: headerSize$1c,
            maxSize: maxSize$1c,
            accessLevel: accessLevel$1c,
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
    const fromBytes$1c = (bytes) => {
        const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE$1);
        const cleanBytes = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
        const buffer = new CommandBinaryBuffer$1(cleanBytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            periods: [...cleanBytes.slice(buffer.offset)].map(CommandBinaryBuffer$1.getDayProfileFromByte)
        };
    };
    const toBytes$1c = (parameters) => {
        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER$1;
        const size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
        const buffer = new CommandBinaryBuffer$1(size);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        parameters.periods.forEach(period => {
            buffer.setDayProfile(period);
        });
        if (hasPeriodsFinalByte) {
            buffer.setUint8(PERIODS_FINAL_BYTE$1);
        }
        return toBytes$21(id$1c, buffer.data);
    };

    var setDayProfile$1 = /*#__PURE__*/Object.freeze({
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

    const id$1b = setDisplayParam$2;
    const name$1b = commandNames$1[setDisplayParam$2];
    const headerSize$1b = 2;
    const maxSize$1b = 33;
    const accessLevel$1b = READ_WRITE;
    const isLoraOnly$1b = false;
    const examples$1b = {
        'set params with order': {
            id: id$1b,
            name: name$1b,
            headerSize: headerSize$1b,
            maxSize: maxSize$1b,
            accessLevel: accessLevel$1b,
            parameters: {
                displayMode: 0,
                order: [4, 5, 6, 7]
            },
            bytes: [
                0x5d, 0x05,
                0x00, 0x04, 0x05, 0x06, 0x07
            ]
        },
        'set params without order': {
            id: id$1b,
            name: name$1b,
            headerSize: headerSize$1b,
            maxSize: maxSize$1b,
            accessLevel: accessLevel$1b,
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
    const fromBytes$1b = (bytes) => {
        if (bytes.length < 1 || bytes.length > maxSize$1b) {
            throw new Error('Invalid SetDisplayParam data size.');
        }
        const [displayMode, ...order] = bytes;
        return { displayMode, order };
    };
    const toBytes$1b = (parameters) => (toBytes$21(id$1b, [
        parameters.displayMode,
        ...parameters.order
    ]));

    var setDisplayParam$1 = /*#__PURE__*/Object.freeze({
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

    const id$1a = setOperatorParametersExtended3$2;
    const name$1a = commandNames$1[setOperatorParametersExtended3$2];
    const headerSize$1a = 2;
    const maxSize$1a = 17;
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
    const fromBytes$1a = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getOperatorParametersExtended3();
    };
    const toBytes$1a = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1a);
        buffer.setOperatorParametersExtended3(parameters);
        return toBytes$21(id$1a, buffer.data);
    };

    var setOperatorParametersExtended3$1 = /*#__PURE__*/Object.freeze({
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

    const id$19 = setOperatorParameters$2;
    const name$19 = commandNames$1[setOperatorParameters$2];
    const headerSize$19 = 2;
    const maxSize$19 = OPERATOR_PARAMETERS_SIZE;
    const accessLevel$19 = READ_WRITE;
    const isLoraOnly$19 = false;
    const examples$19 = {
        'set default operator parameters request': {
            id: id$19,
            name: name$19,
            headerSize: headerSize$19,
            maxSize: maxSize$19,
            accessLevel: accessLevel$19,
            parameters: {
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
                displaySet: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    ACTIVE_POWER_PER_PHASE: true,
                    ACTIVE_POWER_IN_NEUTRAL: true,
                    CURRENT_IN_PHASE: false,
                    CURRENT_IN_NEUTRAL: false,
                    VOLTAGE: false,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    POWER_COEFFICIENT_PHASE_A: false,
                    POWER_COEFFICIENT_PHASE_B: false,
                    BATTERY_VOLTAGE: false,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    CURRENT_BALANCE: false,
                    AUTO_SCREEN_SCROLLING: true
                },
                relaySet4: {
                    RELAY_ON_TIMEOUT: false,
                    RELAY_ON_SALDO: false,
                    RELAY_OFF_SALDO: false,
                    RELAY_OFF_SALDO_SOFT: false,
                    RELAY_OFF_MAGNET: false,
                    RELAY_ON_MAGNET_TIMEOUT: false,
                    RELAY_ON_MAGNET_AUTO: false
                },
                relaySet3: {
                    RELAY_OFF_LIM_TARIFF_0: false,
                    RELAY_OFF_LIM_TARIFF_1: false,
                    RELAY_OFF_LIM_TARIFF_2: false,
                    RELAY_OFF_LIM_TARIFF_3: false,
                    RELAY_OFF_PF_MIN: false
                },
                relaySet2: {
                    RELAY_OFF_Y: true,
                    RELAY_OFF_CENTER: true,
                    RELAY_OFF_TARIFF_0: false,
                    RELAY_OFF_TARIFF_1: false,
                    RELAY_OFF_TARIFF_2: false,
                    RELAY_OFF_TARIFF_3: false,
                    RELAY_OFF_I_LIMIT: false,
                    RELAY_OFF_V_BAD: false
                },
                relaySet1: {
                    RELAY_ON_Y: true,
                    RELAY_ON_CENTER: true,
                    RELAY_ON_PB: false,
                    RELAY_ON_TARIFF_0: false,
                    RELAY_ON_TARIFF_1: false,
                    RELAY_ON_TARIFF_2: false,
                    RELAY_ON_TARIFF_3: false,
                    RELAY_ON_V_GOOD: false
                },
                displayType: 0,
                ten: 0,
                timeoutRefresh: 240,
                deltaCorMin: 15,
                timeoutMagnetOff: 5,
                timeoutMagnetOn: 5,
                define1: { BLOCK_KEY_OPTOPORT: false, MAGNET_SCREEN_CONST: false },
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
                displaySetExt: {
                    SET_ALL_SEGMENT_DISPLAY: true,
                    SOFTWARE_VERSION: true,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: true,
                    ACTIVE_ENERGY_T2: true,
                    ACTIVE_ENERGY_T3: true,
                    ACTIVE_ENERGY_T4: true,
                    ACTIVE_POWER_PER_PHASE: true,
                    ACTIVE_POWER_IN_NEUTRAL: true,
                    CURRENT_IN_PHASE: true,
                    CURRENT_IN_NEUTRAL: true,
                    VOLTAGE: true,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    POWER_COEFFICIENT_PHASE_A: true,
                    POWER_COEFFICIENT_PHASE_B: true,
                    BATTERY_VOLTAGE: true,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    CURRENT_BALANCE: false,
                    MAGNET_INDUCTION: true,
                    OPTOPORT_SPEED: false,
                    SORT_DISPLAY_SCREENS: false
                },
                timeoutUneqCurrent: 5,
                timeoutBipolarPower: 5,
                relaySet5: {
                    RELAY_OFF_UNEQUAL_CURRENT: false,
                    RELAY_ON_UNEQUAL_CURRENT: false,
                    RELAY_OFF_BIPOLAR_POWER: false,
                    RELAY_ON_BIPOLAR_POWER: false
                },
                timeCorrectPeriod: 24,
                timeCorrectPassHalfhour: false
            },
            bytes: [
                0x1f, 0x4a,
                0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x1e, 0x01, 0x7f,
                0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05,
                0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x05, 0x05,
                0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18
            ]
        }
    };
    const fromBytes$19 = (bytes) => {
        if (bytes.length !== maxSize$19) {
            throw new Error('Invalid SetOpParams data size.');
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getOperatorParameters();
    };
    const toBytes$19 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$19);
        buffer.setOperatorParameters(parameters);
        return toBytes$21(id$19, buffer.data);
    };

    var setOperatorParameters$1 = /*#__PURE__*/Object.freeze({
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

    const id$18 = setSaldo$2;
    const name$18 = commandNames$1[setSaldo$2];
    const headerSize$18 = 2;
    const maxSize$18 = 12;
    const accessLevel$18 = READ_WRITE;
    const isLoraOnly$18 = false;
    const examples$18 = {
        'test request': {
            id: id$18,
            name: name$18,
            headerSize: headerSize$18,
            maxSize: maxSize$18,
            accessLevel: accessLevel$18,
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
    const fromBytes$18 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
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
    const toBytes$18 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$18);
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);
        buffer.setInt32(parameters.saldoNew);
        buffer.setInt32(parameters.saldoOld);
        return toBytes$21(id$18, buffer.data);
    };

    var setSaldo$1 = /*#__PURE__*/Object.freeze({
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

    const id$17 = setSaldoParameters$2;
    const name$17 = commandNames$1[setSaldoParameters$2];
    const headerSize$17 = 2;
    const maxSize$17 = 37;
    const accessLevel$17 = READ_WRITE;
    const isLoraOnly$17 = false;
    const examples$17 = {
        'test parameters': {
            id: id$17,
            name: name$17,
            headerSize: headerSize$17,
            maxSize: maxSize$17,
            accessLevel: accessLevel$17,
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
    const fromBytes$17 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getSaldoParameters();
    };
    const toBytes$17 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$17);
        buffer.setSaldoParameters(parameters);
        return toBytes$21(id$17, buffer.data);
    };

    var setSaldoParameters$1 = /*#__PURE__*/Object.freeze({
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

    const id$16 = setSeasonProfile$2;
    const name$16 = commandNames$1[setSeasonProfile$2];
    const headerSize$16 = 2;
    const maxSize$16 = SEASON_PROFILE_SIZE;
    const accessLevel$16 = READ_WRITE;
    const isLoraOnly$16 = false;
    const examples$16 = {
        'set default season profile': {
            id: id$16,
            name: name$16,
            headerSize: headerSize$16,
            maxSize: maxSize$16,
            accessLevel: accessLevel$16,
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
            id: id$16,
            name: name$16,
            headerSize: headerSize$16,
            maxSize: maxSize$16,
            accessLevel: accessLevel$16,
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
    const fromBytes$16 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSeasonProfile()
        };
    };
    const toBytes$16 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$16);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setSeasonProfile(parameters);
        return toBytes$21(id$16, buffer.data);
    };

    var setSeasonProfile$1 = /*#__PURE__*/Object.freeze({
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

    const id$15 = setSpecialDay$2;
    const name$15 = commandNames$1[setSpecialDay$2];
    const headerSize$15 = 2;
    const maxSize$15 = 6;
    const accessLevel$15 = READ_WRITE;
    const isLoraOnly$15 = false;
    const examples$15 = {
        'set special day': {
            id: id$15,
            name: name$15,
            headerSize: headerSize$15,
            maxSize: maxSize$15,
            accessLevel: accessLevel$15,
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
    const fromBytes$15 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            tariffTable: buffer.getUint8(),
            index: buffer.getUint8(),
            ...buffer.getSpecialDay()
        };
    };
    const toBytes$15 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$15);
        buffer.setUint8(parameters.tariffTable);
        buffer.setUint8(parameters.index);
        buffer.setSpecialDay(parameters);
        return toBytes$21(id$15, buffer.data);
    };

    var setSpecialDay$1 = /*#__PURE__*/Object.freeze({
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

    const RESET_INFLUENCE_SCREENS = 0x55;

    const id$14 = setSpecialOperation$2;
    const name$14 = commandNames$1[setSpecialOperation$2];
    const headerSize$14 = 2;
    const maxSize$14 = 2;
    const accessLevel$14 = READ_WRITE;
    const isLoraOnly$14 = false;
    const examples$14 = {
        'read screens info': {
            id: id$14,
            name: name$14,
            headerSize: headerSize$14,
            maxSize: maxSize$14,
            accessLevel: accessLevel$14,
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
            id: id$14,
            name: name$14,
            headerSize: headerSize$14,
            maxSize: maxSize$14,
            accessLevel: accessLevel$14,
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
            id: id$14,
            name: name$14,
            headerSize: headerSize$14,
            maxSize: maxSize$14,
            accessLevel: accessLevel$14,
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
    const fromBytes$14 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
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
    const toBytes$14 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$14);
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
        return toBytes$21(id$14, buffer.data);
    };

    var setSpecialOperation$1 = /*#__PURE__*/Object.freeze({
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

    const id$13 = turnRelayOff$2;
    const name$13 = commandNames$1[turnRelayOff$2];
    const headerSize$13 = 2;
    const maxSize$13 = 0;
    const accessLevel$13 = READ_WRITE;
    const isLoraOnly$13 = false;
    const examples$13 = {
        'simple request': {
            id: id$13,
            name: name$13,
            headerSize: headerSize$13,
            maxSize: maxSize$13,
            accessLevel: accessLevel$13,
            parameters: {},
            bytes: [
                0x19, 0x00
            ]
        }
    };
    const fromBytes$13 = (bytes) => {
        if (bytes.length !== maxSize$13) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$13 = () => toBytes$21(id$13);

    var turnRelayOff$1 = /*#__PURE__*/Object.freeze({
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

    const id$12 = turnRelayOn$2;
    const name$12 = commandNames$1[turnRelayOn$2];
    const headerSize$12 = 2;
    const maxSize$12 = 0;
    const accessLevel$12 = READ_WRITE;
    const isLoraOnly$12 = false;
    const examples$12 = {
        'simple request': {
            id: id$12,
            name: name$12,
            headerSize: headerSize$12,
            maxSize: maxSize$12,
            accessLevel: accessLevel$12,
            parameters: {},
            bytes: [
                0x18, 0x00
            ]
        }
    };
    const fromBytes$12 = (bytes) => {
        if (bytes.length !== maxSize$12) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$12 = () => toBytes$21(id$12);

    var turnRelayOn$1 = /*#__PURE__*/Object.freeze({
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

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$1,
        getBuildVersion: getBuildVersion$1,
        getCorrectTime: getCorrectTime$1,
        getCriticalEvent: getCriticalEvent$1,
        getCurrentStatusMeter: getCurrentStatusMeter$1,
        getCurrentValues: getCurrentValues$1,
        getDateTime: getDateTime$1,
        getDayDemand: getDayDemand$1,
        getDayDemandExport: getDayDemandExport$1,
        getDayMaxDemand: getDayMaxDemand$1,
        getDayMaxDemandExport: getDayMaxDemandExport$1,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious$1,
        getDayProfile: getDayProfile$1,
        getDemand: getDemand$1,
        getDeviceId: getDeviceId$1,
        getDeviceType: getDeviceType$1,
        getDisplayParam: getDisplayParam$1,
        getEnergy: getEnergy$1,
        getEnergyDayPrevious: getEnergyDayPrevious$1,
        getEnergyExport: getEnergyExport$1,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$1,
        getEventStatus: getEventStatus$1,
        getEvents: getEvents$1,
        getEventsCounters: getEventsCounters$1,
        getExtendedCurrentValues: getExtendedCurrentValues$1,
        getExtendedCurrentValues2: getExtendedCurrentValues2$1,
        getHalfHourDemand: getHalfHourDemand$1,
        getHalfHourDemandExport: getHalfHourDemandExport$1,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious$1,
        getHalfhoursEnergies: getHalfhoursEnergies$1,
        getMagneticFieldThreshold: getMagneticFieldThreshold$1,
        getMeterInfo: getMeterInfo$1,
        getMonthDemand: getMonthDemand$1,
        getMonthDemandExport: getMonthDemandExport$1,
        getMonthMaxDemand: getMonthMaxDemand$1,
        getMonthMaxDemandExport: getMonthMaxDemandExport$1,
        getOperatorParameters: getOperatorParameters$1,
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
        setDisplayParam: setDisplayParam$1,
        setOperatorParameters: setOperatorParameters$1,
        setOperatorParametersExtended3: setOperatorParametersExtended3$1,
        setSaldo: setSaldo$1,
        setSaldoParameters: setSaldoParameters$1,
        setSeasonProfile: setSeasonProfile$1,
        setSpecialDay: setSpecialDay$1,
        setSpecialOperation: setSpecialOperation$1,
        turnRelayOff: turnRelayOff$1,
        turnRelayOn: turnRelayOn$1
    });

    const getDayEnergies$1 = 0x78;
    const getDayMaxPower$1 = 0x79;
    const errorResponse$1 = 0xfe;

    var uplinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$2,
        errorResponse: errorResponse$1,
        getBuildVersion: getBuildVersion$2,
        getCorrectTime: getCorrectTime$2,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$2,
        getCurrentValues: getCurrentValues$2,
        getDateTime: getDateTime$2,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayEnergies: getDayEnergies$1,
        getDayMaxDemand: getDayMaxDemand$2,
        getDayMaxDemandExport: getDayMaxDemandExport$2,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious$2,
        getDayMaxPower: getDayMaxPower$1,
        getDayProfile: getDayProfile$2,
        getDemand: getDemand$2,
        getDeviceId: getDeviceId$2,
        getDeviceType: getDeviceType$2,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$2,
        getEvents: getEvents$2,
        getEventsCounters: getEventsCounters$2,
        getExtendedCurrentValues: getExtendedCurrentValues$2,
        getExtendedCurrentValues2: getExtendedCurrentValues2$2,
        getHalfHourDemand: getHalfHourDemand$2,
        getHalfHourDemandExport: getHalfHourDemandExport$2,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious$2,
        getHalfhoursEnergies: getHalfhoursEnergies$2,
        getMagneticFieldThreshold: getMagneticFieldThreshold$2,
        getMeterInfo: getMeterInfo$2,
        getMonthDemand: getMonthDemand$2,
        getMonthDemandExport: getMonthDemandExport$2,
        getMonthMaxDemand: getMonthMaxDemand$2,
        getMonthMaxDemandExport: getMonthMaxDemandExport$2,
        getOperatorParameters: getOperatorParameters$2,
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
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$2,
        setOperatorParametersExtended3: setOperatorParametersExtended3$2,
        setSaldo: setSaldo$2,
        setSaldoParameters: setSaldoParameters$2,
        setSeasonProfile: setSeasonProfile$2,
        setSpecialDay: setSpecialDay$2,
        setSpecialOperation: setSpecialOperation$2,
        turnRelayOff: turnRelayOff$2,
        turnRelayOn: turnRelayOn$2
    });

    var commandNames = invertObject(uplinkIds);

    const id$11 = activateRatePlan$2;
    const name$11 = commandNames[activateRatePlan$2];
    const headerSize$11 = 2;
    const maxSize$11 = 0;
    const accessLevel$11 = READ_WRITE;
    const isLoraOnly$11 = false;
    const examples$11 = {
        'simple response': {
            id: id$11,
            name: name$11,
            headerSize: headerSize$11,
            maxSize: maxSize$11,
            accessLevel: accessLevel$11,
            parameters: {},
            bytes: [
                0x13, 0x00
            ]
        }
    };
    const fromBytes$11 = (bytes) => {
        if (bytes.length !== maxSize$11) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$11 = () => toBytes$21(id$11);

    var activateRatePlan = /*#__PURE__*/Object.freeze({
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

    const id$10 = errorResponse$1;
    const name$10 = commandNames[errorResponse$1];
    const headerSize$10 = 2;
    const accessLevel$10 = READ_ONLY;
    const maxSize$10 = 2;
    const isLoraOnly$10 = false;
    const examples$10 = {
        'ACCESS_DENIED on TurnRelayOn command': {
            id: id$10,
            name: name$10,
            headerSize: headerSize$10,
            maxSize: maxSize$10,
            accessLevel: accessLevel$10,
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
        const buffer = new CommandBinaryBuffer$1(bytes);
        const errorCommandId = buffer.getUint8();
        const errorCode = buffer.getUint8();
        return {
            commandId: errorCommandId,
            commandName: commandNamesParameter[errorCommandId],
            errorCode,
            errorName: resultNames[errorCode]
        };
    });
    const fromBytes$10 = getFromBytes$1(commandNames);
    const toBytes$10 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$10);
        buffer.setUint8(parameters.commandId);
        buffer.setUint8(parameters.errorCode);
        return toBytes$21(id$10, buffer.data);
    };

    var errorResponse = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$10,
        examples: examples$10,
        fromBytes: fromBytes$10,
        getFromBytes: getFromBytes$1,
        headerSize: headerSize$10,
        id: id$10,
        isLoraOnly: isLoraOnly$10,
        maxSize: maxSize$10,
        name: name$10,
        toBytes: toBytes$10
    });

    const id$$ = getBuildVersion$2;
    const name$$ = commandNames[getBuildVersion$2];
    const headerSize$$ = 2;
    const maxSize$$ = 6;
    const accessLevel$$ = READ_ONLY;
    const isLoraOnly$$ = false;
    const examples$$ = {
        '2021.09.16/0.0.9': {
            id: id$$,
            name: name$$,
            headerSize: headerSize$$,
            maxSize: maxSize$$,
            accessLevel: accessLevel$$,
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
    const fromBytes$$ = (bytes) => {
        if (bytes.length !== maxSize$$) {
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
    const toBytes$$ = (parameters) => {
        const { date, version } = parameters;
        const versionParts = version.split('.').map(part => parseInt(part, 10));
        return toBytes$21(id$$, [date.date, date.month, date.year, ...versionParts]);
    };

    var getBuildVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$$,
        examples: examples$$,
        fromBytes: fromBytes$$,
        headerSize: headerSize$$,
        id: id$$,
        isLoraOnly: isLoraOnly$$,
        maxSize: maxSize$$,
        name: name$$,
        toBytes: toBytes$$
    });

    const id$_ = getCorrectTime$2;
    const name$_ = commandNames[getCorrectTime$2];
    const headerSize$_ = 2;
    const accessLevel$_ = READ_ONLY;
    const maxSize$_ = 9;
    const isLoraOnly$_ = false;
    const examples$_ = {
        'default parameters': {
            id: id$_,
            name: name$_,
            headerSize: headerSize$_,
            maxSize: maxSize$_,
            accessLevel: accessLevel$_,
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
    const fromBytes$_ = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getTimeCorrectionParameters();
    };
    const toBytes$_ = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$_);
        buffer.setTimeCorrectionParameters(parameters);
        return toBytes$21(id$_, buffer.data);
    };

    var getCorrectTime = /*#__PURE__*/Object.freeze({
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

    const id$Z = getCriticalEvent$2;
    const name$Z = commandNames[getCriticalEvent$2];
    const headerSize$Z = 2;
    const accessLevel$Z = READ_ONLY;
    const maxSize$Z = 9;
    const isLoraOnly$Z = false;
    const examples$Z = {
        'simple response': {
            id: id$Z,
            name: name$Z,
            headerSize: headerSize$Z,
            accessLevel: accessLevel$Z,
            maxSize: maxSize$Z,
            parameters: {
                event: 1,
                name: 'MAGNETIC_ON',
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
                0x41, 0x09,
                0x01, 0x01, 0x17, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07
            ]
        }
    };
    const fromBytes$Z = (bytes) => {
        if (bytes.length !== maxSize$Z) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const [event, index, year, month, date, hours, minutes, seconds, count] = bytes;
        return {
            event,
            name: criticalEventNames[event],
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
    const toBytes$Z = (parameters) => {
        const { event, index, date, count } = parameters;
        return toBytes$21(id$Z, [
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

    const id$Y = getCurrentStatusMeter$2;
    const name$Y = commandNames[getCurrentStatusMeter$2];
    const headerSize$Y = 2;
    const maxSize$Y = 31;
    const accessLevel$Y = READ_ONLY;
    const isLoraOnly$Y = false;
    const calibrationFlagsMask = {
        calibrationEnable: 0x01,
        hardkey: 0x02,
        keyPressTest: 0x04,
        keyOpenkeyTest: 0x08,
        keyGerkonTest: 0x10,
        keyOpenKlemaTest: 0x20,
        keyOpenModuleTest: 0x40,
        keyPress2Test: 0x80
    };
    const examples$Y = {
        'simple response': {
            id: id$Y,
            name: name$Y,
            headerSize: headerSize$Y,
            maxSize: maxSize$Y,
            accessLevel: accessLevel$Y,
            parameters: {
                operatingSeconds: 74320,
                tbadVAVB: 34567,
                tbadImaxAll: 956726,
                tbadPmaxAll: 340,
                tbadFREQ: 436,
                relayStatus: {
                    RELAY_STATE: true,
                    RELAY_UBAD: false,
                    RELAY_UNEQ_CURRENT: false,
                    RELAY_OFF_CENTER: true,
                    RELAY_IMAX: true,
                    RELAY_PMAX: false
                },
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
                calibrationFlags: {
                    calibrationEnable: true,
                    hardkey: false,
                    keyPressTest: false,
                    keyOpenkeyTest: false,
                    keyGerkonTest: false,
                    keyOpenKlemaTest: false,
                    keyOpenModuleTest: false,
                    keyPress2Test: false
                },
                currentTariffs: {
                    'A+': 1,
                    'A-': 3
                },
                isSummerTime: true
            },
            bytes: [
                0x39, 0x1f,
                0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x85, 0x10, 0x01, 0x01, 0x03, 0x01
            ]
        }
    };
    const fromBytes$Y = (data) => {
        const buffer = new CommandBinaryBuffer$1(data);
        const operatingSeconds = buffer.getUint32();
        const tbadVAVB = buffer.getUint32();
        const tbadImaxAll = buffer.getUint32();
        const tbadPmaxAll = buffer.getUint32();
        buffer.getUint32();
        const tbadFREQ = buffer.getUint32();
        const relayStatus = toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8());
        const statusEvent1 = buffer.getUint8();
        const statusEvent2 = buffer.getUint8();
        const calibrationFlags = toObject(calibrationFlagsMask, buffer.getUint8());
        const currentTariffs = {
            'A+': buffer.getUint8(),
            'A-': buffer.getUint8()
        };
        const isSummerTime = !!(buffer.getUint8() & 1);
        const statusEventValue = statusEvent1 | (statusEvent2 << 8);
        return {
            operatingSeconds,
            tbadVAVB,
            tbadImaxAll,
            tbadPmaxAll,
            tbadFREQ,
            relayStatus,
            statusEvent: toObject(eventStatusMask, statusEventValue),
            calibrationFlags,
            currentTariffs,
            isSummerTime
        };
    };
    const toBytes$Y = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$Y);
        const statusEventValue = fromObject(eventStatusMask, parameters.statusEvent);
        buffer.setUint32(parameters.operatingSeconds);
        buffer.setUint32(parameters.tbadVAVB);
        buffer.setUint32(parameters.tbadImaxAll);
        buffer.setUint32(parameters.tbadPmaxAll);
        buffer.setUint32(0);
        buffer.setUint32(parameters.tbadFREQ);
        buffer.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, parameters.relayStatus));
        buffer.setUint8(statusEventValue & 0xff);
        buffer.setUint8((statusEventValue >> 8) & 0xff);
        buffer.setUint8(fromObject(calibrationFlagsMask, parameters.calibrationFlags));
        buffer.setUint8(parameters.currentTariffs['A+']);
        buffer.setUint8(parameters.currentTariffs['A-']);
        buffer.setUint8(parameters.isSummerTime ? 1 : 0);
        return toBytes$21(id$Y, buffer.data);
    };

    var getCurrentStatusMeter = /*#__PURE__*/Object.freeze({
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

    const id$X = getCurrentValues$2;
    const name$X = commandNames[getCurrentValues$2];
    const headerSize$X = 2;
    const accessLevel$X = READ_ONLY;
    const maxSize$X = 32;
    const isLoraOnly$X = false;
    const examples$X = {
        'simple response': {
            id: id$X,
            name: name$X,
            maxSize: maxSize$X,
            headerSize: headerSize$X,
            accessLevel: accessLevel$X,
            parameters: {
                powerA: 2349234,
                iaRms: 4061779,
                vavbRms: 302729,
                varA: 106789,
                pfA: 0.5,
                ibRms: 304779,
                powerB: 106280,
                varB: 107292,
                pfB: -0.5
            },
            bytes: [
                0x0d, 0x20,
                0x00, 0x23, 0xd8, 0xb2, 0x00, 0x3d, 0xfa, 0x53, 0x00, 0x04, 0x9e, 0x89, 0x00, 0x01, 0xa1, 0x25,
                0x01, 0xf4, 0x00, 0x04, 0xa6, 0x8b, 0x00, 0x01, 0x9f, 0x28, 0x00, 0x01, 0xa3, 0x1c, 0xfe, 0x0c
            ]
        }
    };
    const fromBytes$X = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            powerA: buffer.getInt32(),
            iaRms: buffer.getInt32(),
            vavbRms: buffer.getInt32(),
            varA: buffer.getInt32(),
            pfA: buffer.getInt16() / 1000,
            ibRms: buffer.getInt32(),
            powerB: buffer.getInt32(),
            varB: buffer.getInt32(),
            pfB: buffer.getInt16() / 1000
        };
    };
    const toBytes$X = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$X);
        buffer.setInt32(parameters.powerA);
        buffer.setInt32(parameters.iaRms);
        buffer.setInt32(parameters.vavbRms);
        buffer.setInt32(parameters.varA);
        buffer.setInt16(parameters.pfA * 1000);
        buffer.setInt32(parameters.ibRms);
        buffer.setInt32(parameters.powerB);
        buffer.setInt32(parameters.varB);
        buffer.setInt16(parameters.pfB * 1000);
        return toBytes$21(id$X, buffer.data);
    };
    const toJson$a = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        if (!dlms) {
            return JSON.stringify(parameters);
        }
        const result = {
            '21.7.0': parameters.powerA,
            '31.7.0': parameters.iaRms,
            '32.7.0': parameters.vavbRms,
            '33.7.0': parameters.pfA,
            '51.7.0': parameters.ibRms,
            '41.7.0': parameters.powerB,
            '53.7.0': parameters.pfB
        };
        const varAKey = parameters.varA >= 0 ? '23.7.0' : '24.7.0';
        const varBKey = parameters.varB >= 0 ? '43.7.0' : '44.7.0';
        result[varAKey] = parameters.varA;
        result[varBKey] = parameters.varB;
        return JSON.stringify(result);
    };

    var getCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$X,
        examples: examples$X,
        fromBytes: fromBytes$X,
        headerSize: headerSize$X,
        id: id$X,
        isLoraOnly: isLoraOnly$X,
        maxSize: maxSize$X,
        name: name$X,
        toBytes: toBytes$X,
        toJson: toJson$a
    });

    const id$W = getDateTime$2;
    const name$W = commandNames[getDateTime$2];
    const headerSize$W = 2;
    const maxSize$W = 8;
    const accessLevel$W = READ_ONLY;
    const isLoraOnly$W = false;
    const examples$W = {
        'time: 2024.02.19 18:31:55': {
            id: id$W,
            name: name$W,
            headerSize: headerSize$W,
            maxSize: maxSize$W,
            accessLevel: accessLevel$W,
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
    const fromBytes$W = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDateTime();
    };
    const toBytes$W = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$W);
        buffer.setDateTime(parameters);
        return toBytes$21(id$W, buffer.data);
    };

    var getDateTime = /*#__PURE__*/Object.freeze({
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

    var getObisByEnergy = (energy, tariff = 0) => {
        const obis = energy === A_MINUS$1 ? '2.8.x' : '1.8.x';
        return obis.replace('x', tariff.toString(10));
    };

    const COMMAND_SIZE$5 = 19;
    const MAX_COMMAND_SIZE$5 = COMMAND_SIZE$5 + PACKED_ENERGY_TYPE_SIZE;
    const id$V = getDayDemand$2;
    const name$V = commandNames[getDayDemand$2];
    const headerSize$V = 2;
    const maxSize$V = MAX_COMMAND_SIZE$5;
    const accessLevel$V = READ_ONLY;
    const isLoraOnly$V = false;
    const examples$V = {
        'default A+ energy': {
            id: id$V,
            name: name$V,
            headerSize: headerSize$V,
            maxSize: maxSize$V,
            accessLevel: accessLevel$V,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x16, 0x13,
                0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'received A- energies': {
            id: id$V,
            name: name$V,
            headerSize: headerSize$V,
            maxSize: maxSize$V,
            accessLevel: accessLevel$V,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 2,
                energies: [40301230, null, 2333, 2145623]
            },
            bytes: [
                0x16, 0x10,
                0x18, 0x03, 0x16, 0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$V = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$5) {
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
    const toBytes$V = (parameters) => {
        let size = COMMAND_SIZE$5;
        if (parameters?.energyType) {
            const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
            size = DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        const buffer = new CommandBinaryBuffer$1(size);
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$V, buffer.data);
    };
    const toJson$9 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        if (!dlms) {
            return JSON.stringify(parameters);
        }
        const { date, energyType, energies } = parameters;
        const result = {};
        for (let i = 0; i < TARIFF_NUMBER$1; i += 1) {
            if (energies[i] || energies[i] === 0) {
                result[getObisByEnergy(energyType, i + 1)] = energies[i];
            }
        }
        return JSON.stringify({
            date,
            ...result
        });
    };

    var getDayDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$V,
        examples: examples$V,
        fromBytes: fromBytes$V,
        headerSize: headerSize$V,
        id: id$V,
        isLoraOnly: isLoraOnly$V,
        maxSize: maxSize$V,
        name: name$V,
        toBytes: toBytes$V,
        toJson: toJson$9
    });

    const COMMAND_SIZE$4 = 19;
    const MAX_COMMAND_SIZE$4 = COMMAND_SIZE$4 + PACKED_ENERGY_TYPE_SIZE;
    const id$U = getDayDemandExport$2;
    const name$U = commandNames[getDayDemandExport$2];
    const headerSize$U = 2;
    const maxSize$U = MAX_COMMAND_SIZE$4;
    const accessLevel$U = READ_ONLY;
    const isLoraOnly$U = false;
    const examples$U = {
        'default A- energy': {
            id: id$U,
            name: name$U,
            headerSize: headerSize$U,
            maxSize: maxSize$U,
            accessLevel: accessLevel$U,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x4f, 0x13,
                0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'received A+ energies': {
            id: id$U,
            name: name$U,
            headerSize: headerSize$U,
            maxSize: maxSize$U,
            accessLevel: accessLevel$U,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 1,
                energies: [40301230, null, 2333, 2145623]
            },
            bytes: [
                0x4f, 0x10,
                0x18, 0x03, 0x16, 0xd1, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$U = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$4) {
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
    const toBytes$U = (parameters) => {
        let size = COMMAND_SIZE$4;
        if (parameters?.energyType) {
            const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
            size = DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        const buffer = new CommandBinaryBuffer$1(size);
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$U, buffer.data);
    };
    const toJson$8 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        if (!dlms) {
            return JSON.stringify(parameters);
        }
        const { date, energyType, energies } = parameters;
        const result = {};
        for (let i = 0; i < TARIFF_NUMBER$1; i += 1) {
            if (energies[i] || energies[i] === 0) {
                result[getObisByEnergy(energyType, i + 1)] = energies[i];
            }
        }
        return JSON.stringify({
            date,
            ...result
        });
    };

    var getDayDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$U,
        examples: examples$U,
        fromBytes: fromBytes$U,
        headerSize: headerSize$U,
        id: id$U,
        isLoraOnly: isLoraOnly$U,
        maxSize: maxSize$U,
        name: name$U,
        toBytes: toBytes$U,
        toJson: toJson$8
    });

    const DATE_SIZE$2 = 2;
    const ENERGY_FLAGS_SIZE$2 = 1;
    const TARIFF_FLAGS_SIZE$1 = 1;
    const MAX_TARIFFS_ENERGIES_SIZE$1 = 6 * 4 * 4;
    const energiesToObis$2 = {
        'A+': '1.8.x',
        'A+R+': '3.8.x',
        'A+R-': '4.8.x',
        'A-': '2.8.x',
        'A-R+': '7.8.x',
        'A-R-': '8.8.x'
    };
    const convertEnergyToObis$2 = (energy, tariff = 0) => {
        const obis = energiesToObis$2[energy];
        return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    const convertTariffsEnergiesToDlms = (energies) => {
        const dlms = {};
        for (let tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
            const tariffEnergies = energies[tariff];
            if (tariffEnergies) {
                Object.keys(tariffEnergies).forEach(energy => {
                    const value = tariffEnergies[energy];
                    if (value || value === 0) {
                        dlms[convertEnergyToObis$2(energy, tariff + 1)] = value;
                    }
                });
            }
        }
        return dlms;
    };
    const id$T = getDayEnergies$1;
    const name$T = commandNames[getDayEnergies$1];
    const headerSize$T = 2;
    const maxSize$T = DATE_SIZE$2 + ENERGY_FLAGS_SIZE$2 + TARIFF_FLAGS_SIZE$1 + MAX_TARIFFS_ENERGIES_SIZE$1;
    const accessLevel$T = UNENCRYPTED;
    const isLoraOnly$T = true;
    const examples$T = {
        'get day energies': {
            id: id$T,
            headerSize: headerSize$T,
            name: name$T,
            maxSize: maxSize$T,
            parameters: {
                date: {
                    year: 21,
                    month: 2,
                    date: 3
                },
                energies: [
                    null,
                    {
                        'A+': 0x1000,
                        'A-R+': 0x2000
                    },
                    null,
                    null
                ]
            },
            bytes: [
                0x78, 0x0c,
                0x2a, 0x43, 0x11, 0x22, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00
            ]
        }
    };
    const fromBytes$T = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            date: buffer.getDate(),
            energies: buffer.getTariffsEnergies()
        };
    };
    const toBytes$T = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$T);
        buffer.setDate(parameters.date);
        buffer.setTariffsEnergies(parameters.energies);
        return toBytes$21(id$T, buffer.getBytesToOffset());
    };
    const toJson$7 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { date, energies } = parameters;
        const result = dlms
            ? {
                date,
                ...convertTariffsEnergiesToDlms(energies)
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getDayEnergies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$T,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$T,
        id: id$T,
        isLoraOnly: isLoraOnly$T,
        maxSize: maxSize$T,
        name: name$T,
        toBytes: toBytes$T,
        toJson: toJson$7
    });

    const id$S = getDayMaxDemand$2;
    const name$S = commandNames[getDayMaxDemand$2];
    const headerSize$S = 2;
    const accessLevel$S = READ_ONLY;
    const maxSize$S = 27;
    const isLoraOnly$S = false;
    const examples$S = {
        'response for 2023.03.12': {
            id: id$S,
            name: name$S,
            headerSize: headerSize$S,
            accessLevel: accessLevel$S,
            maxSize: maxSize$S,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                power: [
                    {
                        hours: 1,
                        minutes: 0,
                        power: 456
                    },
                    {
                        hours: 3,
                        minutes: 12,
                        power: 9474
                    },
                    {
                        hours: 7,
                        minutes: 30,
                        power: 78573
                    },
                    {
                        hours: 12,
                        minutes: 59,
                        power: 395639
                    }
                ]
            },
            bytes: [
                0x31, 0x1b,
                0x17, 0x03, 0x0c,
                0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
                0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
                0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
                0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
            ]
        }
    };
    const fromBytes$S = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDayMaxDemandResponse();
    };
    const toBytes$S = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$S);
        buffer.setDayMaxDemandResponse(parameters);
        return toBytes$21(id$S, buffer.getBytesToOffset());
    };

    var getDayMaxDemand = /*#__PURE__*/Object.freeze({
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

    const id$R = getDayMaxDemandExport$2;
    const name$R = commandNames[getDayMaxDemandExport$2];
    const headerSize$R = 2;
    const accessLevel$R = READ_ONLY;
    const maxSize$R = 27;
    const isLoraOnly$R = false;
    const examples$R = {
        'response for 2023.03.12': {
            id: id$R,
            name: name$R,
            headerSize: headerSize$R,
            accessLevel: accessLevel$R,
            maxSize: maxSize$R,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                power: [
                    {
                        hours: 1,
                        minutes: 0,
                        power: 456
                    },
                    {
                        hours: 3,
                        minutes: 12,
                        power: 9474
                    },
                    {
                        hours: 7,
                        minutes: 30,
                        power: 78573
                    },
                    {
                        hours: 12,
                        minutes: 59,
                        power: 395639
                    }
                ]
            },
            bytes: [
                0x58, 0x1b,
                0x17, 0x03, 0x0c,
                0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
                0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
                0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
                0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
            ]
        }
    };
    const fromBytes$R = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDayMaxDemandResponse();
    };
    const toBytes$R = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$R);
        buffer.setDayMaxDemandResponse(parameters);
        return toBytes$21(id$R, buffer.getBytesToOffset());
    };

    var getDayMaxDemandExport = /*#__PURE__*/Object.freeze({
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

    const id$Q = getDayMaxDemandPrevious$2;
    const name$Q = commandNames[getDayMaxDemandPrevious$2];
    const headerSize$Q = 2;
    const accessLevel$Q = READ_ONLY;
    const maxSize$Q = 27;
    const isLoraOnly$Q = false;
    const examples$Q = {
        'response for 2023.03.12': {
            id: id$Q,
            name: name$Q,
            headerSize: headerSize$Q,
            accessLevel: accessLevel$Q,
            maxSize: maxSize$Q,
            parameters: {
                date: {
                    year: 23,
                    month: 3,
                    date: 12
                },
                power: [
                    {
                        hours: 1,
                        minutes: 0,
                        power: 456
                    },
                    {
                        hours: 3,
                        minutes: 12,
                        power: 9474
                    },
                    {
                        hours: 7,
                        minutes: 30,
                        power: 78573
                    },
                    {
                        hours: 12,
                        minutes: 59,
                        power: 395639
                    }
                ]
            },
            bytes: [
                0x4a, 0x1b,
                0x17, 0x03, 0x0c,
                0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
                0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
                0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
                0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
            ]
        }
    };
    const fromBytes$Q = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDayMaxDemandResponse();
    };
    const toBytes$Q = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$Q);
        buffer.setDayMaxDemandResponse(parameters);
        return toBytes$21(id$Q, buffer.getBytesToOffset());
    };

    var getDayMaxDemandPrevious = /*#__PURE__*/Object.freeze({
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

    const DATE_SIZE$1 = 2;
    const ENERGY_FLAGS_SIZE$1 = 1;
    const TARIFF_FLAGS_SIZE = 1;
    const MAX_TARIFFS_ENERGIES_SIZE = 6 * 4 * (1 + 1 + 4);
    const energiesToObis$1 = {
        'A+': '1.6.x',
        'A+R+': '3.6.x',
        'A+R-': '4.6.x',
        'A-': '2.6.x',
        'A-R+': '7.6.x',
        'A-R-': '8.6.x'
    };
    const convertEnergyToObis$1 = (energy, tariff = 0) => {
        const obis = energiesToObis$1[energy];
        return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    const convertTariffsPowerMaxToDlms = (energies) => {
        const dlms = {};
        for (let tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
            const tariffEnergies = energies[tariff];
            if (tariffEnergies) {
                Object.keys(tariffEnergies).forEach(energy => {
                    const value = tariffEnergies[energy];
                    if (value || value === 0) {
                        dlms[convertEnergyToObis$1(energy, tariff + 1)] = value;
                    }
                });
            }
        }
        return dlms;
    };
    const id$P = getDayMaxPower$1;
    const name$P = commandNames[getDayMaxPower$1];
    const headerSize$P = 2;
    const maxSize$P = DATE_SIZE$1 + ENERGY_FLAGS_SIZE$1 + TARIFF_FLAGS_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
    const accessLevel$P = UNENCRYPTED;
    const isLoraOnly$P = true;
    const examples$P = {
        'get day max power': {
            id: id$P,
            headerSize: headerSize$P,
            name: name$P,
            maxSize: maxSize$P,
            parameters: {
                date: {
                    year: 21,
                    month: 2,
                    date: 3
                },
                tariffs: [
                    null,
                    null,
                    {
                        'A+': {
                            hours: 2,
                            minutes: 3,
                            power: 0x1000
                        },
                        'A-R+': {
                            hours: 4,
                            minutes: 5,
                            power: 0x2000
                        }
                    },
                    null
                ]
            },
            bytes: [
                0x79, 0x10,
                0x2a, 0x43, 0x11, 0x44, 0x02, 0x03, 0x00, 0x00, 0x10, 0x00, 0x04, 0x05, 0x00, 0x00, 0x20, 0x00
            ]
        }
    };
    const fromBytes$P = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
        return {
            date: buffer.getDate(),
            tariffs: buffer.getTariffsPowerMax()
        };
    };
    const toBytes$P = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$P);
        buffer.setDate(parameters.date);
        buffer.setTariffsPowerMax(parameters.tariffs);
        return toBytes$21(id$P, buffer.getBytesToOffset());
    };
    const toJson$6 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { date, tariffs } = parameters;
        const result = dlms
            ? {
                date,
                ...convertTariffsPowerMaxToDlms(tariffs)
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getDayMaxPower = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$P,
        examples: examples$P,
        fromBytes: fromBytes$P,
        headerSize: headerSize$P,
        id: id$P,
        isLoraOnly: isLoraOnly$P,
        maxSize: maxSize$P,
        name: name$P,
        toBytes: toBytes$P,
        toJson: toJson$6
    });

    const MAX_PERIODS_NUMBER = 8;
    const PERIODS_FINAL_BYTE = 0xff;
    const id$O = getDayProfile$2;
    const name$O = commandNames[getDayProfile$2];
    const headerSize$O = 2;
    const maxSize$O = MAX_PERIODS_NUMBER;
    const accessLevel$O = READ_ONLY;
    const isLoraOnly$O = false;
    const examples$O = {
        'full periods response': {
            id: id$O,
            name: name$O,
            headerSize: headerSize$O,
            maxSize: maxSize$O,
            accessLevel: accessLevel$O,
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
            id: id$O,
            name: name$O,
            headerSize: headerSize$O,
            maxSize: maxSize$O,
            accessLevel: accessLevel$O,
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
    const fromBytes$O = (bytes) => {
        const finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
        const cleanData = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
        return {
            periods: [...cleanData].map(CommandBinaryBuffer$1.getDayProfileFromByte)
        };
    };
    const toBytes$O = (parameters) => {
        const hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
        const size = parameters.periods.length + +hasPeriodsFinalByte;
        const buffer = new CommandBinaryBuffer$1(size);
        parameters.periods.forEach(period => {
            buffer.setDayProfile(period);
        });
        if (hasPeriodsFinalByte) {
            buffer.setUint8(PERIODS_FINAL_BYTE);
        }
        return toBytes$21(id$O, buffer.data);
    };

    var getDayProfile = /*#__PURE__*/Object.freeze({
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

    const ADDITIONAL_HOUR = 25;
    const getRecordIndex = (hours, minutes, periodMin) => Math.trunc(((hours * 60) + minutes) / periodMin);
    const getLastSummerHourIndex = periodMin => getRecordIndex(ADDITIONAL_HOUR, 0, periodMin);
    const energyFromWord = (word, index, periodMin) => {
        if (word === 0xffff) {
            return null;
        }
        const indexLastSummerRecord = getLastSummerHourIndex(periodMin);
        if (index === indexLastSummerRecord) {
            return {
                lastSummerHour: ((word >> 8) & 0xff)
            };
        }
        return periodMin === 60
            ? { energy: word }
            : { tariff: ((word >> 14) & 0x03), energy: (word & 0x3fff) };
    };
    const energyToWord = data => {
        if (data === null) {
            return 0xffff;
        }
        const { energy, tariff, lastSummerHour } = data;
        if (lastSummerHour) {
            return (lastSummerHour << 8) | 0xff;
        }
        return tariff
            ? (tariff << 14) | (energy & 0x3fff)
            : energy;
    };
    const energyFromBinary = (bytes, offset, periodMin = 30) => bytes.reduce((collector, value, index) => {
        collector.push(energyFromWord(value, (offset ?? 0) + index, periodMin));
        return collector;
    }, []);
    const energyToBinary = energies => energies.reduce((collector, value) => {
        collector.push(energyToWord(value));
        return collector;
    }, []);
    const voltageFromWord = (word, index, periodMin) => {
        if (word === 0xffff) {
            return 0xffff;
        }
        const indexLastSummerRecord = getLastSummerHourIndex(periodMin);
        return (index === indexLastSummerRecord)
            ? { lastSummerHour: ((word >> 8) & 0xff) }
            : { voltage: word };
    };
    const voltageToWord = ({ voltage, lastSummerHour }) => {
        if (lastSummerHour) {
            return (lastSummerHour << 8) | 0xff;
        }
        return voltage;
    };
    const voltageFromBinary = (bytes, offset, periodMin = 30) => bytes.reduce((collector, value, index) => {
        collector.push(voltageFromWord(value, (offset ?? 0) + index, periodMin));
        return collector;
    }, []);
    const voltageToBinary = energies => energies.reduce((collector, value) => {
        collector.push(voltageToWord(value));
        return collector;
    }, []);

    const id$N = getDemand$2;
    const name$N = commandNames[getDemand$2];
    const headerSize$N = 2;
    const maxSize$N = maxSize$1P + 48;
    const accessLevel$N = READ_ONLY;
    const isLoraOnly$N = false;
    const examples$N = {
        'response for A+': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 2
                },
                energyType: A_PLUS,
                firstIndex: 0,
                count: 48,
                period: 5,
                demands: [
                    { tariff: 0, energy: 177 },
                    { tariff: 0, energy: 177 },
                    { tariff: 0, energy: 176 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    { tariff: 0, energy: 178 },
                    { tariff: 0, energy: 175 },
                    { tariff: 0, energy: 177 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    { tariff: 0, energy: 178 },
                    { tariff: 0, energy: 178 },
                    { tariff: 0, energy: 178 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    { tariff: 0, energy: 177 },
                    null,
                    { tariff: 0, energy: 99 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ]
            },
            bytes: [
                0x76, 0x67,
                0x31, 0x42, 0x01, 0x00, 0x00, 0x30, 0x05,
                0x00, 0xb1,
                0x00, 0xb1,
                0x00, 0xb0,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0x00, 0xb2,
                0x00, 0xaf,
                0x00, 0xb1,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0x00, 0xb2,
                0x00, 0xb2,
                0x00, 0xb2,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0x00, 0xb1,
                0xff, 0xff,
                0x00, 0x63,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff
            ]
        },
        'response for A+ (period: 60, no tariff)': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 2
                },
                energyType: A_PLUS,
                firstIndex: 0,
                count: 24,
                period: 60,
                demands: [
                    { energy: 177 },
                    { energy: 177 },
                    { energy: 176 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    { energy: 178 },
                    { energy: 175 },
                    { energy: 177 },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ]
            },
            bytes: [
                0x76, 0x37,
                0x31, 0x42, 0x01, 0x00, 0x00, 0x18, 0x3c,
                0x00, 0xb1,
                0x00, 0xb1,
                0x00, 0xb0,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0x00, 0xb2,
                0x00, 0xaf,
                0x00, 0xb1,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff,
                0xff, 0xff
            ]
        },
        'response for A+ (lastSummerHour)': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 2
                },
                energyType: A_PLUS,
                firstIndex: 25,
                count: 1,
                period: 60,
                demands: [
                    { lastSummerHour: 4 }
                ]
            },
            bytes: [
                0x76, 0x09,
                0x31, 0x42, 0x01, 0x00, 0x19, 0x01, 0x3c,
                0x04, 0xff
            ]
        },
        'response for voltage (period: 60, no tariff)': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 2
                },
                energyType: VOLTAGE,
                firstIndex: 0,
                count: 1,
                period: 60,
                demands: [
                    { voltage: 1026 }
                ]
            },
            bytes: [
                0x76, 0x09,
                0x31, 0x42, 0xa0, 0x00, 0x00, 0x01, 0x3c,
                0x04, 0x02
            ]
        },
        'response for voltage (lastSummerHour)': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 2
                },
                energyType: VOLTAGE,
                firstIndex: 25,
                count: 1,
                period: 60,
                demands: [
                    { lastSummerHour: 4 }
                ]
            },
            bytes: [
                0x76, 0x09,
                0x31, 0x42, 0xa0, 0x00, 0x19, 0x01, 0x3c,
                0x04, 0xff
            ]
        },
        'response for voltage 10 min (lastSummerHour)': {
            id: id$N,
            name: name$N,
            headerSize: headerSize$N,
            maxSize: maxSize$N,
            parameters: {
                date: {
                    year: 24,
                    month: 10,
                    date: 27
                },
                energyType: VOLTAGE_10,
                firstIndex: 144,
                count: 7,
                period: 10,
                demands: [
                    { voltage: 2375 },
                    { voltage: 2381 },
                    { voltage: 2372 },
                    { voltage: 2373 },
                    { voltage: 2374 },
                    { voltage: 2365 },
                    { lastSummerHour: 3 }
                ]
            },
            bytes: [
                0x76, 0x15,
                0x31, 0x5b, 0x40, 0x00, 0x90, 0x07, 0x0a,
                0x09, 0x47,
                0x09, 0x4d,
                0x09, 0x44,
                0x09, 0x45,
                0x09, 0x46,
                0x09, 0x3d,
                0x03, 0xff
            ]
        }
    };
    const fromBytes$N = (bytes) => {
        if (!bytes || bytes.length < maxSize$1P) {
            throw new Error('Invalid uplink GetDemand byte length.');
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        const parameters = buffer.getDemand();
        if (bytes.length !== maxSize$1P + (2 * parameters.count)) {
            throw new Error('Invalid uplink GetDemand demands byte length.');
        }
        const demandsBytes = new Array(parameters.count).fill(0).map(() => buffer.getUint16());
        const isEnergiesDemand = parameters.energyType === A_PLUS || parameters.energyType === A_MINUS;
        parameters.demands = isEnergiesDemand
            ? energyFromBinary(demandsBytes, parameters.firstIndex, parameters.period)
            : voltageFromBinary(demandsBytes, parameters.firstIndex, parameters.period);
        return parameters;
    };
    const toBytes$N = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$1P + parameters.count * 2);
        buffer.setDemand(parameters);
        if (parameters.energyType === A_PLUS || parameters.energyType === A_MINUS) {
            energyToBinary(parameters.demands).forEach((value) => buffer.setUint16(value));
        }
        else {
            voltageToBinary(parameters.demands).forEach((value) => buffer.setUint16(value));
        }
        return toBytes$21(id$N, buffer.data);
    };

    var getDemand = /*#__PURE__*/Object.freeze({
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

    const id$M = getDeviceId$2;
    const name$M = commandNames[getDeviceId$2];
    const headerSize$M = 2;
    const accessLevel$M = READ_ONLY;
    const maxSize$M = 8;
    const isLoraOnly$M = false;
    const examples$M = {
        'simple response': {
            id: id$M,
            name: name$M,
            headerSize: headerSize$M,
            accessLevel: accessLevel$M,
            maxSize: maxSize$M,
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
    const fromBytes$M = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getDeviceId();
    };
    const toBytes$M = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$M);
        buffer.setDeviceId(parameters);
        return toBytes$21(id$M, buffer.data);
    };

    var getDeviceId = /*#__PURE__*/Object.freeze({
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

    const A = 0b00000000;
    const G_FULL = 0b00010001;

    const id$L = getDeviceType$2;
    const name$L = commandNames[getDeviceType$2];
    const headerSize$L = 2;
    const accessLevel$L = READ_ONLY;
    const maxSize$L = 9;
    const isLoraOnly$L = false;
    const examples$L = {
        'type 1': {
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            maxSize: maxSize$L,
            accessLevel: accessLevel$L,
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
            id: id$L,
            name: name$L,
            headerSize: headerSize$L,
            maxSize: maxSize$L,
            accessLevel: accessLevel$L,
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
    const fromBytes$L = (data) => {
        const buffer = new CommandBinaryBuffer$1(data);
        return buffer.getDeviceType();
    };
    const toBytes$L = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$L);
        buffer.setDeviceType(parameters);
        return toBytes$21(id$L, buffer.data);
    };

    var getDeviceType = /*#__PURE__*/Object.freeze({
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

    const id$K = getDisplayParam$2;
    const name$K = commandNames[getDisplayParam$2];
    const headerSize$K = 2;
    const maxSize$K = 33;
    const accessLevel$K = READ_ONLY;
    const isLoraOnly$K = false;
    const examples$K = {
        'mode with order': {
            id: id$K,
            name: name$K,
            headerSize: headerSize$K,
            maxSize: maxSize$K,
            accessLevel: accessLevel$K,
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
            id: id$K,
            name: name$K,
            maxSize: maxSize$K,
            accessLevel: accessLevel$K,
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
    const fromBytes$K = (bytes) => {
        const [displayMode, ...order] = bytes;
        return { displayMode, order };
    };
    const toBytes$K = (parameters) => (toBytes$21(id$K, [parameters.displayMode, ...parameters.order]));

    var getDisplayParam = /*#__PURE__*/Object.freeze({
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

    const COMMAND_SIZE$3 = 16;
    const MAX_COMMAND_SIZE$3 = COMMAND_SIZE$3 + PACKED_ENERGY_TYPE_SIZE;
    const id$J = getEnergy$2;
    const name$J = commandNames[getEnergy$2];
    const headerSize$J = 2;
    const accessLevel$J = READ_ONLY;
    const maxSize$J = MAX_COMMAND_SIZE$3;
    const isLoraOnly$J = false;
    const examples$J = {
        'default A+ energy': {
            id: id$J,
            name: name$J,
            headerSize: headerSize$J,
            maxSize: maxSize$J,
            accessLevel: accessLevel$J,
            parameters: {
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x0f, 0x10,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'received A- energies': {
            id: id$J,
            name: name$J,
            headerSize: headerSize$J,
            maxSize: maxSize$J,
            accessLevel: accessLevel$J,
            parameters: {
                energyType: 2,
                energies: [40301230, null, 2333, 2145623]
            },
            bytes: [
                0x0f, 0x0d,
                0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$J = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$3) {
            parameters = {
                energies: buffer.getEnergies()
            };
        }
        else {
            parameters = buffer.getPackedEnergyWithType();
        }
        return parameters;
    };
    const toBytes$J = (parameters) => {
        let size = COMMAND_SIZE$3;
        if (parameters?.energyType) {
            const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
            size = PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        const buffer = new CommandBinaryBuffer$1(size);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$J, buffer.data);
    };
    const toJson$5 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        if (!dlms) {
            return JSON.stringify(parameters);
        }
        const { energyType, energies } = parameters;
        const result = {};
        for (let i = 0; i < TARIFF_NUMBER$1; i += 1) {
            if (energies[i] || energies[i] === 0) {
                result[getObisByEnergy(energyType, i + 1)] = energies[i];
            }
        }
        return JSON.stringify(result);
    };

    var getEnergy = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$J,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$J,
        id: id$J,
        isLoraOnly: isLoraOnly$J,
        maxSize: maxSize$J,
        name: name$J,
        toBytes: toBytes$J,
        toJson: toJson$5
    });

    const convertAPlusEnergyToObis$1 = (tariff = 0) => '1.8.x'.replace('x', tariff.toString(10));
    const convertEnergiesToDlms$1 = (energy) => {
        const dlms = {};
        for (let tariff = 0; tariff < TARIFF_NUMBER$1; tariff++) {
            const value = energy[tariff];
            if (value || value === 0) {
                dlms[convertAPlusEnergyToObis$1(tariff + 1)] = value;
            }
        }
        return dlms;
    };
    const COMMAND_SIZE$2 = 19;
    const MAX_COMMAND_SIZE$2 = COMMAND_SIZE$2 + PACKED_ENERGY_TYPE_SIZE;
    const id$I = getEnergyDayPrevious$2;
    const name$I = commandNames[getEnergyDayPrevious$2];
    const headerSize$I = 2;
    const maxSize$I = MAX_COMMAND_SIZE$2;
    const accessLevel$I = READ_ONLY;
    const isLoraOnly$I = false;
    const examples$I = {
        'simple response': {
            id: id$I,
            name: name$I,
            headerSize: headerSize$I,
            maxSize: maxSize$I,
            accessLevel: accessLevel$I,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x03, 0x13,
                0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'response with A- energy by T1, T4 only': {
            id: id$I,
            name: name$I,
            headerSize: headerSize$I,
            maxSize: maxSize$I,
            accessLevel: accessLevel$I,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 2,
                energies: [40301230, null, null, 2145623]
            },
            bytes: [
                0x03, 0x0c,
                0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$I = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$2) {
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
    const toBytes$I = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(getPackedEnergiesWithDateSize(parameters));
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$I, buffer.data);
    };
    const toJson$4 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { date, energies } = parameters;
        const result = dlms
            ? {
                date,
                ...convertEnergiesToDlms$1(energies)
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getEnergyDayPrevious = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$I,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$I,
        id: id$I,
        isLoraOnly: isLoraOnly$I,
        maxSize: maxSize$I,
        name: name$I,
        toBytes: toBytes$I,
        toJson: toJson$4
    });

    const COMMAND_SIZE$1 = 16;
    const MAX_COMMAND_SIZE$1 = COMMAND_SIZE$1 + PACKED_ENERGY_TYPE_SIZE;
    const id$H = getEnergyExport$2;
    const name$H = commandNames[getEnergyExport$2];
    const headerSize$H = 2;
    const accessLevel$H = READ_ONLY;
    const maxSize$H = MAX_COMMAND_SIZE$1;
    const isLoraOnly$H = false;
    const examples$H = {
        'default response': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            maxSize: maxSize$H,
            accessLevel: accessLevel$H,
            parameters: {
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x5b, 0x10,
                0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'received A- energies by tariffs': {
            id: id$H,
            name: name$H,
            headerSize: headerSize$H,
            maxSize: maxSize$H,
            accessLevel: accessLevel$H,
            parameters: {
                energyType: 2,
                energies: [40301230, null, 2333, 2145623]
            },
            bytes: [
                0x5b, 0x0d,
                0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$H = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        let parameters;
        if (bytes.length === COMMAND_SIZE$1) {
            parameters = {
                energies: buffer.getEnergies()
            };
        }
        else {
            parameters = buffer.getPackedEnergyWithType();
        }
        return parameters;
    };
    const toBytes$H = (parameters) => {
        let size = COMMAND_SIZE$1;
        if (parameters?.energyType) {
            const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
            size = PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
        }
        const buffer = new CommandBinaryBuffer$1(size);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$H, buffer.data);
    };
    const toJson$3 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        if (!dlms) {
            return JSON.stringify(parameters);
        }
        const { energyType, energies } = parameters;
        const result = {};
        for (let i = 0; i < TARIFF_NUMBER$1; i += 1) {
            if (energies[i] || energies[i] === 0) {
                result[getObisByEnergy(energyType, i + 1)] = energies[i];
            }
        }
        return JSON.stringify(result);
    };

    var getEnergyExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$H,
        examples: examples$H,
        fromBytes: fromBytes$H,
        headerSize: headerSize$H,
        id: id$H,
        isLoraOnly: isLoraOnly$H,
        maxSize: maxSize$H,
        name: name$H,
        toBytes: toBytes$H,
        toJson: toJson$3
    });

    const convertAPlusEnergyToObis = (tariff = 0) => '1.8.x'.replace('x', tariff.toString(10));
    const convertEnergiesToDlms = (energy) => {
        const dlms = {};
        for (let tariff = 0; tariff < TARIFF_NUMBER$1; tariff++) {
            const value = energy[tariff];
            if (value || value === 0) {
                dlms[convertAPlusEnergyToObis(tariff + 1)] = value;
            }
        }
        return dlms;
    };
    const COMMAND_SIZE = 19;
    const MAX_COMMAND_SIZE = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;
    const id$G = getEnergyExportDayPrevious$2;
    const name$G = commandNames[getEnergyExportDayPrevious$2];
    const headerSize$G = 2;
    const maxSize$G = MAX_COMMAND_SIZE;
    const accessLevel$G = READ_ONLY;
    const isLoraOnly$G = false;
    const examples$G = {
        'simple response': {
            id: id$G,
            name: name$G,
            headerSize: headerSize$G,
            maxSize: maxSize$G,
            accessLevel: accessLevel$G,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x50, 0x13,
                0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        },
        'response with A- energy by T1, T4': {
            id: id$G,
            name: name$G,
            headerSize: headerSize$G,
            maxSize: maxSize$G,
            accessLevel: accessLevel$G,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                energyType: 2,
                energies: [40301230, null, null, 2145623]
            },
            bytes: [
                0x50, 0x0c,
                0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$G = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
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
    const toBytes$G = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(getPackedEnergiesWithDateSize(parameters));
        buffer.setDate(parameters.date);
        buffer.setPackedEnergyWithType(parameters);
        return toBytes$21(id$G, buffer.data);
    };
    const toJson$2 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { date, energies } = parameters;
        const result = dlms
            ? {
                date,
                ...convertEnergiesToDlms(energies)
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getEnergyExportDayPrevious = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$G,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$G,
        id: id$G,
        isLoraOnly: isLoraOnly$G,
        maxSize: maxSize$G,
        name: name$G,
        toBytes: toBytes$G,
        toJson: toJson$2
    });

    const BODY_WITHOUT_EVENTS_SIZE = 3 + 1;
    const EVENT_SIZE = 4;
    const id$F = getEvents$2;
    const name$F = commandNames[getEvents$2];
    const headerSize$F = 2;
    const accessLevel$F = READ_ONLY;
    const maxSize$F = BODY_WITHOUT_EVENTS_SIZE + 255 * EVENT_SIZE;
    const isLoraOnly$F = false;
    const examples$F = {
        'simple response': {
            id: id$F,
            name: name$F,
            headerSize: headerSize$F,
            accessLevel: accessLevel$F,
            maxSize: maxSize$F,
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
        if (bytes.length > maxSize$F) {
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
        const buffer = new BinaryBufferConstructor(maxSize$F);
        buffer.setDate(parameters.date);
        buffer.setUint8(parameters.eventsNumber);
        for (const event of parameters.events) {
            buffer.setEvent(event);
        }
        return toBytes$21(id$F, buffer.getBytesToOffset());
    });
    const fromBytes$F = getFromBytes(CommandBinaryBuffer$1);
    const toBytes$F = getToBytes(CommandBinaryBuffer$1);

    var getEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$F,
        examples: examples$F,
        fromBytes: fromBytes$F,
        getFromBytes: getFromBytes,
        getToBytes: getToBytes,
        headerSize: headerSize$F,
        id: id$F,
        isLoraOnly: isLoraOnly$F,
        maxSize: maxSize$F,
        name: name$F,
        toBytes: toBytes$F
    });

    const COMMAND_BODY_SIZE = 14;
    const OLD_COMMAND_BODY_SIZE = 20;
    const id$E = getEventsCounters$2;
    const name$E = commandNames[getEventsCounters$2];
    const headerSize$E = 2;
    const accessLevel$E = READ_ONLY;
    const maxSize$E = OLD_COMMAND_BODY_SIZE;
    const isLoraOnly$E = false;
    const examples$E = {
        'simple response': {
            id: id$E,
            name: name$E,
            headerSize: headerSize$E,
            accessLevel: accessLevel$E,
            maxSize: maxSize$E,
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
    const fromBytes$E = (bytes) => {
        if ((bytes.length !== COMMAND_BODY_SIZE && bytes.length !== OLD_COMMAND_BODY_SIZE)) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
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
    const toBytes$E = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(COMMAND_BODY_SIZE);
        buffer.setUint16(parameters.restart);
        buffer.setUint16(parameters.powerOff);
        buffer.setUint16(parameters.localParametersChange);
        buffer.setUint16(parameters.remoteParametersChange);
        buffer.setUint16(parameters.accessError);
        buffer.setUint16(parameters.accessClosed);
        buffer.setUint16(parameters.setClock);
        return toBytes$21(id$E, buffer.data);
    };

    var getEventsCounters = /*#__PURE__*/Object.freeze({
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

    const id$D = getEventStatus$2;
    const name$D = commandNames[getEventStatus$2];
    const headerSize$D = 2;
    const accessLevel$D = READ_ONLY;
    const maxSize$D = 2;
    const isLoraOnly$D = false;
    const examples$D = {
        'simple response': {
            id: id$D,
            name: name$D,
            headerSize: headerSize$D,
            accessLevel: accessLevel$D,
            maxSize: maxSize$D,
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
    const fromBytes$D = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes, true);
        return buffer.getEventStatus();
    };
    const toBytes$D = (eventStatus) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$D, true);
        buffer.setEventStatus(eventStatus);
        return toBytes$21(id$D, buffer.data);
    };

    var getEventStatus = /*#__PURE__*/Object.freeze({
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

    const id$C = getExtendedCurrentValues$2;
    const name$C = commandNames[getExtendedCurrentValues$2];
    const headerSize$C = 2;
    const maxSize$C = 4;
    const accessLevel$C = READ_ONLY;
    const isLoraOnly$C = false;
    const examples$C = {
        'simple response': {
            id: id$C,
            name: name$C,
            headerSize: headerSize$C,
            maxSize: maxSize$C,
            accessLevel: accessLevel$C,
            parameters: {
                temperature: 67,
                frequency: 60
            },
            bytes: [
                0x3a, 0x04,
                0x00, 0x43, 0x00, 0x3c
            ]
        }
    };
    const fromBytes$C = (data) => {
        const buffer = new CommandBinaryBuffer$1(data);
        return {
            temperature: buffer.getInt16(),
            frequency: buffer.getInt16()
        };
    };
    const toBytes$C = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$C);
        buffer.setInt16(parameters.temperature);
        buffer.setInt16(parameters.frequency);
        return toBytes$21(id$C, buffer.data);
    };
    const toJson$1 = (parameters, { dlms } = defaultDlmsJsonOptions) => {
        const { temperature, frequency } = parameters;
        const result = dlms
            ? {
                '0.11.0': temperature,
                '14.7.0': frequency
            }
            : parameters;
        return JSON.stringify(result);
    };

    var getExtendedCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$C,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        isLoraOnly: isLoraOnly$C,
        maxSize: maxSize$C,
        name: name$C,
        toBytes: toBytes$C,
        toJson: toJson$1
    });

    const id$B = getExtendedCurrentValues2$2;
    const name$B = commandNames[getExtendedCurrentValues2$2];
    const headerSize$B = 2;
    const maxSize$B = 7;
    const accessLevel$B = READ_ONLY;
    const isLoraOnly$B = false;
    const examples$B = {
        'simple response': {
            id: id$B,
            name: name$B,
            headerSize: headerSize$B,
            maxSize: maxSize$B,
            accessLevel: accessLevel$B,
            parameters: {
                uBattery: 358,
                relayStatus: {
                    RELAY_STATE: true,
                    RELAY_UBAD: false,
                    RELAY_UNEQ_CURRENT: false,
                    RELAY_OFF_CENTER: true,
                    RELAY_IMAX: true,
                    RELAY_PMAX: false
                },
                relayStatus2: {
                    RELAY_COSFI: true,
                    RELAY_SALDO_OFF_FLAG: false,
                    RELAY_UNEQUIL_CURRENT_OFF: false,
                    RELAY_BIPOLAR_POWER_OFF: false,
                    RELAY_SALDO_OFF_ON_MAX_POWER: false,
                    RELAY_HARD_ST1: true
                },
                status1: {
                    MAXVA: true,
                    MINVA: false,
                    MAXT: false,
                    MINT: true,
                    MAXF: true,
                    MINF: false,
                    MAXIA: true,
                    MAXP: false
                },
                status2: {
                    MAX_POWER_SALDO: false,
                    BATTERY_VBAT_BAD: true,
                    CLOCK_UNSET: true,
                    MIN_COS_FI: false
                },
                status3: {
                    UNEQUIL_CURRENT: true,
                    BIPOLAR_POWER: false,
                    POWER_A_NEGATIVE: false,
                    POWER_B_NEGATIVE: true
                }
            },
            bytes: [
                0x2d, 0x07,
                0x01, 0x66, 0x61, 0x21, 0x59, 0x0a, 0x81
            ]
        }
    };
    const fromBytes$B = (data) => {
        const buffer = new CommandBinaryBuffer$1(data);
        return buffer.getExtendedCurrentValues2();
    };
    const toBytes$B = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$B);
        buffer.setExtendedCurrentValues2(parameters);
        return toBytes$21(id$B, buffer.data);
    };

    var getExtendedCurrentValues2 = /*#__PURE__*/Object.freeze({
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

    const id$A = getHalfHourDemand$2;
    const name$A = commandNames[getHalfHourDemand$2];
    const headerSize$A = 2;
    const maxSize$A = MAX_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$A = READ_ONLY;
    const isLoraOnly$A = false;
    const examples$A = {
        'simple response': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            maxSize: maxSize$A,
            accessLevel: accessLevel$A,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 }
                ]
            },
            bytes: [
                0x15, 0x63,
                0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f
            ]
        },
        'response with no periods': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            maxSize: maxSize$A,
            accessLevel: accessLevel$A,
            parameters: {
                date: {
                    year: 22,
                    month: 6,
                    date: 18
                },
                periods: [
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined }
                ]
            },
            bytes: [
                0x15, 0x63,
                0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff
            ]
        },
        'response for day when DST start/end': {
            id: id$A,
            name: name$A,
            headerSize: headerSize$A,
            maxSize: maxSize$A,
            accessLevel: accessLevel$A,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 },
                    { tariff: 1, energy: 6000 },
                    { tariff: 1, energy: 6111 }
                ],
                dstHour: 3
            },
            bytes: [
                0x15, 0x68,
                0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03
            ]
        }
    };
    const fromBytes$A = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const periods = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                periods,
                dstHour: buffer.getUint8()
            };
        }
        return { date, periods };
    };
    const toBytes$A = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.periods);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$21(id$A, buffer.data);
    };

    var getHalfHourDemand = /*#__PURE__*/Object.freeze({
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

    const id$z = getHalfHourDemandExport$2;
    const name$z = commandNames[getHalfHourDemandExport$2];
    const headerSize$z = 2;
    const maxSize$z = MAX_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$z = READ_ONLY;
    const isLoraOnly$z = false;
    const examples$z = {
        'simple response': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            maxSize: maxSize$z,
            accessLevel: accessLevel$z,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 }
                ]
            },
            bytes: [
                0x53, 0x63,
                0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f
            ]
        },
        'response with no periods': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            maxSize: maxSize$z,
            accessLevel: accessLevel$z,
            parameters: {
                date: {
                    year: 22,
                    month: 6,
                    date: 18
                },
                periods: [
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined }
                ]
            },
            bytes: [
                0x53, 0x63,
                0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff
            ]
        },
        'response for day when DST start/end': {
            id: id$z,
            name: name$z,
            headerSize: headerSize$z,
            maxSize: maxSize$z,
            accessLevel: accessLevel$z,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 },
                    { tariff: 1, energy: 6000 },
                    { tariff: 1, energy: 6111 }
                ],
                dstHour: 3
            },
            bytes: [
                0x53, 0x68,
                0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03
            ]
        }
    };
    const fromBytes$z = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const periods = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                periods,
                dstHour: buffer.getUint8()
            };
        }
        return { date, periods };
    };
    const toBytes$z = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.periods);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$21(id$z, buffer.data);
    };

    var getHalfHourDemandExport = /*#__PURE__*/Object.freeze({
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

    const id$y = getHalfHourDemandPrevious$2;
    const name$y = commandNames[getHalfHourDemandPrevious$2];
    const headerSize$y = 2;
    const maxSize$y = MAX_HALF_HOUR_COMMAND_SIZE;
    const accessLevel$y = READ_ONLY;
    const isLoraOnly$y = false;
    const examples$y = {
        'simple response': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            maxSize: maxSize$y,
            accessLevel: accessLevel$y,
            parameters: {
                date: {
                    year: 24,
                    month: 3,
                    date: 22
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 }
                ]
            },
            bytes: [
                0x4b, 0x63,
                0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f
            ]
        },
        'response with no periods': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            maxSize: maxSize$y,
            accessLevel: accessLevel$y,
            parameters: {
                date: {
                    year: 22,
                    month: 6,
                    date: 18
                },
                periods: [
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined },
                    { tariff: undefined, energy: undefined }
                ]
            },
            bytes: [
                0x4b, 0x63,
                0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0xff, 0xff, 0xff
            ]
        },
        'response for day when DST start/end': {
            id: id$y,
            name: name$y,
            headerSize: headerSize$y,
            maxSize: maxSize$y,
            accessLevel: accessLevel$y,
            parameters: {
                date: {
                    year: 24,
                    month: 2,
                    date: 31
                },
                periods: [
                    { tariff: 1, energy: 1111 },
                    { tariff: 1, energy: 1222 },
                    { tariff: 1, energy: 1333 },
                    { tariff: 1, energy: 1444 },
                    { tariff: 1, energy: 1555 },
                    { tariff: 1, energy: 1666 },
                    { tariff: 1, energy: 1777 },
                    { tariff: 1, energy: 1888 },
                    { tariff: 1, energy: 1999 },
                    { tariff: 1, energy: 2000 },
                    { tariff: 1, energy: 2111 },
                    { tariff: 1, energy: 2222 },
                    { tariff: 1, energy: 2333 },
                    { tariff: 1, energy: 2444 },
                    { tariff: 1, energy: 2555 },
                    { tariff: 1, energy: 2666 },
                    { tariff: 1, energy: 2777 },
                    { tariff: 1, energy: 2888 },
                    { tariff: 1, energy: 2999 },
                    { tariff: 1, energy: 3000 },
                    { tariff: 1, energy: 3111 },
                    { tariff: 1, energy: 3222 },
                    { tariff: 1, energy: 3333 },
                    { tariff: 1, energy: 3444 },
                    { tariff: 1, energy: 3555 },
                    { tariff: 1, energy: 3666 },
                    { tariff: 1, energy: 3777 },
                    { tariff: 1, energy: 3888 },
                    { tariff: 1, energy: 3999 },
                    { tariff: 1, energy: 4000 },
                    { tariff: 1, energy: 4111 },
                    { tariff: 1, energy: 4222 },
                    { tariff: 1, energy: 4333 },
                    { tariff: 1, energy: 4444 },
                    { tariff: 1, energy: 4555 },
                    { tariff: 1, energy: 4666 },
                    { tariff: 1, energy: 4777 },
                    { tariff: 1, energy: 4888 },
                    { tariff: 1, energy: 4999 },
                    { tariff: 1, energy: 5000 },
                    { tariff: 1, energy: 5222 },
                    { tariff: 1, energy: 5333 },
                    { tariff: 1, energy: 5444 },
                    { tariff: 1, energy: 5555 },
                    { tariff: 1, energy: 5666 },
                    { tariff: 1, energy: 5777 },
                    { tariff: 1, energy: 5888 },
                    { tariff: 1, energy: 5999 },
                    { tariff: 1, energy: 6000 },
                    { tariff: 1, energy: 6111 }
                ],
                dstHour: 3
            },
            bytes: [
                0x4b, 0x68,
                0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
                0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
                0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
                0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
                0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
                0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
                0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03
            ]
        }
    };
    const fromBytes$y = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
        const date = buffer.getDate();
        const periods = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
        if (hasDst) {
            return {
                date,
                periods,
                dstHour: buffer.getUint8()
            };
        }
        return { date, periods };
    };
    const toBytes$y = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE);
        buffer.setDate(parameters.date);
        buffer.setEnergyPeriods(parameters.periods);
        if (parameters.dstHour) {
            buffer.setUint8(parameters.dstHour);
        }
        return toBytes$21(id$y, buffer.data);
    };

    var getHalfHourDemandPrevious = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$y,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$y,
        id: id$y,
        isLoraOnly: isLoraOnly$y,
        maxSize: maxSize$y,
        name: name$y,
        toBytes: toBytes$y
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
    const id$x = getHalfhoursEnergies$2;
    const name$x = commandNames[getHalfhoursEnergies$2];
    const headerSize$x = 2;
    const maxSize$x = DATE_SIZE + ENERGY_FLAGS_SIZE + START_HALFHOUR_SIZE + HALFHOURS_NUMBER_SIZE + MAX_HALFHOURS_ENERGY_SIZE;
    const accessLevel$x = UNENCRYPTED;
    const isLoraOnly$x = true;
    const examples$x = {
        'get halfhours energies': {
            id: id$x,
            headerSize: headerSize$x,
            name: name$x,
            maxSize: maxSize$x,
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
    const fromBytes$x = (bytes) => {
        const buffer = new CommandBinaryBuffer(bytes);
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
    const toBytes$x = (parameters) => {
        const buffer = new CommandBinaryBuffer(maxSize$x);
        const { date, firstHalfhour, halfhoursNumber, energies } = parameters;
        buffer.setDate(date);
        buffer.setEnergiesFlags(energies);
        buffer.setUint8(firstHalfhour);
        buffer.setUint8(halfhoursNumber);
        buffer.setHalfhoursEnergies(energies);
        return toBytes$21(id$x, buffer.getBytesToOffset());
    };
    const toJson = (parameters, { dlms } = defaultDlmsJsonOptions) => {
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
        accessLevel: accessLevel$x,
        examples: examples$x,
        fromBytes: fromBytes$x,
        headerSize: headerSize$x,
        id: id$x,
        isLoraOnly: isLoraOnly$x,
        maxSize: maxSize$x,
        name: name$x,
        toBytes: toBytes$x,
        toJson: toJson
    });

    const id$w = getMagneticFieldThreshold$2;
    const name$w = commandNames[getMagneticFieldThreshold$2];
    const headerSize$w = 2;
    const maxSize$w = 10;
    const accessLevel$w = READ_ONLY;
    const isLoraOnly$w = false;
    const examples$w = {
        'simple response': {
            id: id$w,
            name: name$w,
            headerSize: headerSize$w,
            maxSize: maxSize$w,
            accessLevel: accessLevel$w,
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
    const fromBytes$w = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            induction: buffer.getUint16(),
            threshold: buffer.getUint16(),
            inductionCoefficient: buffer.getUint16() / 100,
            reserved: buffer.getUint32()
        };
    };
    const toBytes$w = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$w);
        buffer.setUint16(parameters.induction);
        buffer.setUint16(parameters.threshold);
        buffer.setUint16(parameters.inductionCoefficient * 100);
        buffer.setUint32(parameters.reserved);
        return toBytes$21(id$w, buffer.data);
    };

    var getMagneticFieldThreshold = /*#__PURE__*/Object.freeze({
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

    const id$v = getMeterInfo$2;
    const name$v = commandNames[getMeterInfo$2];
    const headerSize$v = 2;
    const maxSize$v = 1;
    const accessLevel$v = READ_ONLY;
    const isLoraOnly$v = false;
    const examples$v = {
        'simple response': {
            id: id$v,
            name: name$v,
            headerSize: headerSize$v,
            maxSize: maxSize$v,
            accessLevel: accessLevel$v,
            parameters: { ten: 0 },
            bytes: [
                0x7a, 0x01,
                0x00
            ]
        }
    };
    const fromBytes$v = ([ten]) => ({ ten });
    const toBytes$v = ({ ten }) => toBytes$21(id$v, [ten]);

    var getMeterInfo = /*#__PURE__*/Object.freeze({
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

    const id$u = getMonthDemand$2;
    const name$u = commandNames[getMonthDemand$2];
    const headerSize$u = 2;
    const accessLevel$u = READ_ONLY;
    const maxSize$u = 18;
    const isLoraOnly$u = false;
    const examples$u = {
        'response energy for 2024.03': {
            id: id$u,
            name: name$u,
            headerSize: headerSize$u,
            maxSize: maxSize$u,
            accessLevel: accessLevel$u,
            parameters: {
                year: 24,
                month: 3,
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x17, 0x12,
                0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$u = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            energies: buffer.getEnergies()
        };
    };
    const toBytes$u = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$u);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setEnergies(parameters.energies);
        return toBytes$21(id$u, buffer.data);
    };

    var getMonthDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$u,
        examples: examples$u,
        fromBytes: fromBytes$u,
        headerSize: headerSize$u,
        id: id$u,
        isLoraOnly: isLoraOnly$u,
        maxSize: maxSize$u,
        name: name$u,
        toBytes: toBytes$u
    });

    const id$t = getMonthDemandExport$2;
    const name$t = commandNames[getMonthDemandExport$2];
    const headerSize$t = 2;
    const accessLevel$t = READ_ONLY;
    const maxSize$t = 18;
    const isLoraOnly$t = false;
    const examples$t = {
        'response energy for 2024.03': {
            id: id$t,
            name: name$t,
            headerSize: headerSize$t,
            maxSize: maxSize$t,
            accessLevel: accessLevel$t,
            parameters: {
                year: 24,
                month: 3,
                energies: [40301230, 3334244, 2333, 2145623]
            },
            bytes: [
                0x52, 0x12,
                0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
            ]
        }
    };
    const fromBytes$t = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            energies: buffer.getEnergies()
        };
    };
    const toBytes$t = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$t);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setEnergies(parameters.energies);
        return toBytes$21(id$t, buffer.data);
    };

    var getMonthDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$t,
        examples: examples$t,
        fromBytes: fromBytes$t,
        headerSize: headerSize$t,
        id: id$t,
        isLoraOnly: isLoraOnly$t,
        maxSize: maxSize$t,
        name: name$t,
        toBytes: toBytes$t
    });

    const id$s = getMonthMaxDemand$2;
    const name$s = commandNames[getMonthMaxDemand$2];
    const headerSize$s = 2;
    const accessLevel$s = READ_ONLY;
    const maxSize$s = 2 + TARIFF_NUMBER$1 * 7;
    const isLoraOnly$s = false;
    const examples$s = {
        'response max power for 2024.03': {
            id: id$s,
            name: name$s,
            headerSize: headerSize$s,
            maxSize: maxSize$s,
            accessLevel: accessLevel$s,
            parameters: {
                year: 24,
                month: 3,
                tariffs: [
                    {
                        date: 22,
                        hours: 12,
                        minutes: 48,
                        power: 2424
                    },
                    {
                        date: 12,
                        hours: 12,
                        minutes: 33,
                        power: 3644
                    },
                    {
                        date: 25,
                        hours: 15,
                        minutes: 4,
                        power: 1244
                    },
                    {
                        date: 8,
                        hours: 17,
                        minutes: 32,
                        power: 5244
                    }
                ]
            },
            bytes: [
                0x32, 0x1e,
                0x18, 0x03,
                0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78,
                0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c,
                0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc,
                0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c
            ]
        }
    };
    const fromBytes$s = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            tariffs: buffer.getMonthMaxPowerByTariffs()
        };
    };
    const toBytes$s = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$s);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setMonthMaxPowerByTariffs(parameters.tariffs);
        return toBytes$21(id$s, buffer.data);
    };

    var getMonthMaxDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$s,
        examples: examples$s,
        fromBytes: fromBytes$s,
        headerSize: headerSize$s,
        id: id$s,
        isLoraOnly: isLoraOnly$s,
        maxSize: maxSize$s,
        name: name$s,
        toBytes: toBytes$s
    });

    const id$r = getMonthMaxDemandExport$2;
    const name$r = commandNames[getMonthMaxDemandExport$2];
    const headerSize$r = 2;
    const accessLevel$r = READ_ONLY;
    const maxSize$r = 2 + TARIFF_NUMBER$1 * 7;
    const isLoraOnly$r = false;
    const examples$r = {
        'response max power for 2024.03': {
            id: id$r,
            name: name$r,
            headerSize: headerSize$r,
            maxSize: maxSize$r,
            accessLevel: accessLevel$r,
            parameters: {
                year: 24,
                month: 3,
                tariffs: [
                    {
                        date: 22,
                        hours: 12,
                        minutes: 48,
                        power: 2424
                    },
                    {
                        date: 12,
                        hours: 12,
                        minutes: 33,
                        power: 3644
                    },
                    {
                        date: 25,
                        hours: 15,
                        minutes: 4,
                        power: 1244
                    },
                    {
                        date: 8,
                        hours: 17,
                        minutes: 32,
                        power: 5244
                    }
                ]
            },
            bytes: [
                0x59, 0x1e,
                0x18, 0x03,
                0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78,
                0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c,
                0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc,
                0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c
            ]
        }
    };
    const fromBytes$r = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            year: buffer.getUint8(),
            month: buffer.getUint8(),
            tariffs: buffer.getMonthMaxPowerByTariffs()
        };
    };
    const toBytes$r = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$r);
        buffer.setUint8(parameters.year);
        buffer.setUint8(parameters.month);
        buffer.setMonthMaxPowerByTariffs(parameters.tariffs);
        return toBytes$21(id$r, buffer.data);
    };

    var getMonthMaxDemandExport = /*#__PURE__*/Object.freeze({
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

    const id$q = getOperatorParametersExtended3$2;
    const name$q = commandNames[getOperatorParametersExtended3$2];
    const headerSize$q = 2;
    const maxSize$q = 17;
    const accessLevel$q = READ_ONLY;
    const isLoraOnly$q = false;
    const examples$q = {
        'simple response': {
            id: id$q,
            name: name$q,
            headerSize: headerSize$q,
            maxSize: maxSize$q,
            accessLevel: accessLevel$q,
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
    const fromBytes$q = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getOperatorParametersExtended3();
    };
    const toBytes$q = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$q);
        buffer.setOperatorParametersExtended3(parameters);
        return toBytes$21(id$q, buffer.data);
    };

    var getOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
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

    const id$p = getOperatorParameters$2;
    const name$p = commandNames[getOperatorParameters$2];
    const headerSize$p = 2;
    const maxSize$p = OPERATOR_PARAMETERS_SIZE;
    const accessLevel$p = READ_ONLY;
    const isLoraOnly$p = false;
    const examples$p = {
        'get default operator parameters response': {
            id: id$p,
            name: name$p,
            headerSize: headerSize$p,
            maxSize: maxSize$p,
            accessLevel: accessLevel$p,
            parameters: {
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
                displaySet: {
                    SET_ALL_SEGMENT_DISPLAY: false,
                    SOFTWARE_VERSION: false,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: false,
                    ACTIVE_ENERGY_T2: false,
                    ACTIVE_ENERGY_T3: false,
                    ACTIVE_ENERGY_T4: false,
                    ACTIVE_POWER_PER_PHASE: true,
                    ACTIVE_POWER_IN_NEUTRAL: true,
                    CURRENT_IN_PHASE: false,
                    CURRENT_IN_NEUTRAL: false,
                    VOLTAGE: false,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    POWER_COEFFICIENT_PHASE_A: false,
                    POWER_COEFFICIENT_PHASE_B: false,
                    BATTERY_VOLTAGE: false,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    CURRENT_BALANCE: false,
                    AUTO_SCREEN_SCROLLING: true
                },
                relaySet4: {
                    RELAY_ON_TIMEOUT: false,
                    RELAY_ON_SALDO: false,
                    RELAY_OFF_SALDO: false,
                    RELAY_OFF_SALDO_SOFT: false,
                    RELAY_OFF_MAGNET: false,
                    RELAY_ON_MAGNET_TIMEOUT: false,
                    RELAY_ON_MAGNET_AUTO: false
                },
                relaySet3: {
                    RELAY_OFF_LIM_TARIFF_0: false,
                    RELAY_OFF_LIM_TARIFF_1: false,
                    RELAY_OFF_LIM_TARIFF_2: false,
                    RELAY_OFF_LIM_TARIFF_3: false,
                    RELAY_OFF_PF_MIN: false
                },
                relaySet2: {
                    RELAY_OFF_Y: true,
                    RELAY_OFF_CENTER: true,
                    RELAY_OFF_TARIFF_0: false,
                    RELAY_OFF_TARIFF_1: false,
                    RELAY_OFF_TARIFF_2: false,
                    RELAY_OFF_TARIFF_3: false,
                    RELAY_OFF_I_LIMIT: false,
                    RELAY_OFF_V_BAD: false
                },
                relaySet1: {
                    RELAY_ON_Y: true,
                    RELAY_ON_CENTER: true,
                    RELAY_ON_PB: false,
                    RELAY_ON_TARIFF_0: false,
                    RELAY_ON_TARIFF_1: false,
                    RELAY_ON_TARIFF_2: false,
                    RELAY_ON_TARIFF_3: false,
                    RELAY_ON_V_GOOD: false
                },
                displayType: 0,
                ten: 0,
                timeoutRefresh: 240,
                deltaCorMin: 15,
                timeoutMagnetOff: 5,
                timeoutMagnetOn: 5,
                define1: { BLOCK_KEY_OPTOPORT: false, MAGNET_SCREEN_CONST: false },
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
                displaySetExt: {
                    SET_ALL_SEGMENT_DISPLAY: true,
                    SOFTWARE_VERSION: true,
                    TOTAL_ACTIVE_ENERGY: true,
                    ACTIVE_ENERGY_T1: true,
                    ACTIVE_ENERGY_T2: true,
                    ACTIVE_ENERGY_T3: true,
                    ACTIVE_ENERGY_T4: true,
                    ACTIVE_POWER_PER_PHASE: true,
                    ACTIVE_POWER_IN_NEUTRAL: true,
                    CURRENT_IN_PHASE: true,
                    CURRENT_IN_NEUTRAL: true,
                    VOLTAGE: true,
                    HOUR_MINUTE_SECOND: true,
                    DATE_MONTH_YEAR: true,
                    TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                    EXPORTED_ACTIVE_ENERGY_T1: false,
                    EXPORTED_ACTIVE_ENERGY_T2: false,
                    EXPORTED_ACTIVE_ENERGY_T3: false,
                    EXPORTED_ACTIVE_ENERGY_T4: false,
                    POWER_COEFFICIENT_PHASE_A: true,
                    POWER_COEFFICIENT_PHASE_B: true,
                    BATTERY_VOLTAGE: true,
                    POWER_THRESHOLD_T1: false,
                    POWER_THRESHOLD_T2: false,
                    POWER_THRESHOLD_T3: false,
                    POWER_THRESHOLD_T4: false,
                    CURRENT_BALANCE: false,
                    MAGNET_INDUCTION: true,
                    OPTOPORT_SPEED: false,
                    SORT_DISPLAY_SCREENS: false
                },
                timeoutUneqCurrent: 5,
                timeoutBipolarPower: 5,
                relaySet5: {
                    RELAY_OFF_UNEQUAL_CURRENT: false,
                    RELAY_ON_UNEQUAL_CURRENT: false,
                    RELAY_OFF_BIPOLAR_POWER: false,
                    RELAY_ON_BIPOLAR_POWER: false
                },
                timeCorrectPeriod: 24,
                timeCorrectPassHalfhour: false
            },
            bytes: [
                0x1e, 0x4a,
                0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
                0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03,
                0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18
            ]
        }
    };
    const fromBytes$p = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getOperatorParameters();
    };
    const toBytes$p = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$p);
        buffer.setOperatorParameters(parameters);
        return toBytes$21(id$p, buffer.data);
    };

    var getOperatorParameters = /*#__PURE__*/Object.freeze({
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

    const id$o = getRatePlanInfo$2;
    const name$o = commandNames[getRatePlanInfo$2];
    const headerSize$o = 2;
    const maxSize$o = 1 + TARIFF_PLAN_SIZE * 2;
    const accessLevel$o = READ_ONLY;
    const isLoraOnly$o = false;
    const examples$o = {
        'rate plan info response for A- table': {
            id: id$o,
            name: name$o,
            headerSize: headerSize$o,
            maxSize: maxSize$o,
            accessLevel: accessLevel$o,
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
    const fromBytes$o = (bytes) => {
        if (bytes.length !== maxSize$o) {
            throw new Error('Invalid getRatePlanInfo data size.');
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        return {
            tariffTable: buffer.getUint8(),
            activePlan: buffer.getTariffPlan(),
            passivePlan: buffer.getTariffPlan()
        };
    };
    const toBytes$o = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$o);
        buffer.setUint8(parameters.tariffTable);
        buffer.setTariffPlan(parameters.activePlan);
        buffer.setTariffPlan(parameters.passivePlan);
        return toBytes$21(id$o, buffer.data);
    };

    var getRatePlanInfo = /*#__PURE__*/Object.freeze({
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

    const id$n = getSaldo$2;
    const name$n = commandNames[getSaldo$2];
    const headerSize$n = 2;
    const maxSize$n = 29;
    const accessLevel$n = READ_ONLY;
    const isLoraOnly$n = false;
    const examples$n = {
        'test response': {
            id: id$n,
            name: name$n,
            headerSize: headerSize$n,
            maxSize: maxSize$n,
            accessLevel: accessLevel$n,
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
    const fromBytes$n = (bytes) => {
        if (bytes.length !== maxSize$n) {
            throw new Error('Invalid getSaldo data size.');
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
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
    const toBytes$n = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$n);
        buffer.setInt32(parameters.currentSaldo);
        buffer.setUint8(parameters.count);
        parameters.energy.forEach(value => buffer.setInt32(value));
        buffer.setInt32(parameters.beginSaldoOfPeriod);
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);
        return toBytes$21(id$n, buffer.data);
    };

    var getSaldo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$n,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        isLoraOnly: isLoraOnly$n,
        maxSize: maxSize$n,
        name: name$n,
        toBytes: toBytes$n
    });

    const id$m = getSaldoParameters$2;
    const name$m = commandNames[getSaldoParameters$2];
    const headerSize$m = 2;
    const maxSize$m = 37;
    const accessLevel$m = READ_ONLY;
    const isLoraOnly$m = false;
    const examples$m = {
        'default response': {
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            maxSize: maxSize$m,
            accessLevel: accessLevel$m,
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
            id: id$m,
            name: name$m,
            headerSize: headerSize$m,
            maxSize: maxSize$m,
            accessLevel: accessLevel$m,
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
    const fromBytes$m = (bytes) => {
        if (bytes.length !== maxSize$m) {
            throw new Error('Invalid getSaldoParameters data size.');
        }
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getSaldoParameters();
    };
    const toBytes$m = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$m);
        buffer.setSaldoParameters(parameters);
        return toBytes$21(id$m, buffer.data);
    };

    var getSaldoParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$m,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        isLoraOnly: isLoraOnly$m,
        maxSize: maxSize$m,
        name: name$m,
        toBytes: toBytes$m
    });

    const id$l = getSeasonProfile$2;
    const name$l = commandNames[getSeasonProfile$2];
    const headerSize$l = 2;
    const maxSize$l = 9;
    const accessLevel$l = READ_ONLY;
    const isLoraOnly$l = false;
    const examples$l = {
        'simple response': {
            id: id$l,
            name: name$l,
            headerSize: headerSize$l,
            maxSize: maxSize$l,
            accessLevel: accessLevel$l,
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
    const fromBytes$l = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getSeasonProfile();
    };
    const toBytes$l = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$l);
        buffer.setSeasonProfile(parameters);
        return toBytes$21(id$l, buffer.data);
    };

    var getSeasonProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$l,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        isLoraOnly: isLoraOnly$l,
        maxSize: maxSize$l,
        name: name$l,
        toBytes: toBytes$l
    });

    const id$k = getSpecialDay$2;
    const name$k = commandNames[getSpecialDay$2];
    const headerSize$k = 2;
    const maxSize$k = 4;
    const accessLevel$k = READ_ONLY;
    const isLoraOnly$k = false;
    const examples$k = {
        'special day response': {
            id: id$k,
            name: name$k,
            headerSize: headerSize$k,
            maxSize: maxSize$k,
            accessLevel: accessLevel$k,
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
    const fromBytes$k = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        return buffer.getSpecialDay();
    };
    const toBytes$k = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$k);
        buffer.setSpecialDay(parameters);
        return toBytes$21(id$k, buffer.data);
    };

    var getSpecialDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$k,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        isLoraOnly: isLoraOnly$k,
        maxSize: maxSize$k,
        name: name$k,
        toBytes: toBytes$k
    });

    const id$j = getVersion$2;
    const name$j = commandNames[getVersion$2];
    const headerSize$j = 2;
    const maxSize$j = 10;
    const accessLevel$j = READ_ONLY;
    const isLoraOnly$j = false;
    const examples$j = {
        'simple response': {
            id: id$j,
            name: name$j,
            headerSize: headerSize$j,
            maxSize: maxSize$j,
            accessLevel: accessLevel$j,
            parameters: {
                version: '104.25.003'
            },
            bytes: [
                0x28, 0x0a,
                0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33
            ]
        }
    };
    const fromBytes$j = (bytes) => ({ version: String.fromCharCode.apply(null, [...bytes]) });
    const toBytes$j = (parameters) => {
        const version = parameters.version.split('').map(char => char.charCodeAt(0));
        return toBytes$21(id$j, version);
    };

    var getVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$j,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        isLoraOnly: isLoraOnly$j,
        maxSize: maxSize$j,
        name: name$j,
        toBytes: toBytes$j
    });

    const id$i = prepareRatePlan$2;
    const name$i = commandNames[prepareRatePlan$2];
    const headerSize$i = 2;
    const maxSize$i = 0;
    const accessLevel$i = READ_WRITE;
    const isLoraOnly$i = false;
    const examples$i = {
        'simple response': {
            id: id$i,
            name: name$i,
            headerSize: headerSize$i,
            maxSize: maxSize$i,
            accessLevel: accessLevel$i,
            parameters: {},
            bytes: [
                0x14, 0x00
            ]
        }
    };
    const fromBytes$i = (bytes) => {
        if (bytes.length !== maxSize$i) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$i = () => toBytes$21(id$i);

    var prepareRatePlan = /*#__PURE__*/Object.freeze({
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

    const id$h = resetPowerMaxDay$2;
    const name$h = commandNames[resetPowerMaxDay$2];
    const headerSize$h = 2;
    const maxSize$h = 0;
    const accessLevel$h = READ_WRITE;
    const isLoraOnly$h = false;
    const examples$h = {
        'simple response': {
            id: id$h,
            name: name$h,
            headerSize: headerSize$h,
            maxSize: maxSize$h,
            accessLevel: accessLevel$h,
            parameters: {},
            bytes: [
                0x35, 0x00
            ]
        }
    };
    const fromBytes$h = (bytes) => {
        if (bytes.length !== maxSize$h) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$h = () => toBytes$21(id$h);

    var resetPowerMaxDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$h,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        isLoraOnly: isLoraOnly$h,
        maxSize: maxSize$h,
        name: name$h,
        toBytes: toBytes$h
    });

    const id$g = resetPowerMaxMonth$2;
    const name$g = commandNames[resetPowerMaxMonth$2];
    const headerSize$g = 2;
    const maxSize$g = 0;
    const accessLevel$g = READ_WRITE;
    const isLoraOnly$g = false;
    const examples$g = {
        'simple response': {
            id: id$g,
            name: name$g,
            headerSize: headerSize$g,
            maxSize: maxSize$g,
            accessLevel: accessLevel$g,
            parameters: {},
            bytes: [
                0x36, 0x00
            ]
        }
    };
    const fromBytes$g = (bytes) => {
        if (bytes.length !== maxSize$g) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$g = () => toBytes$21(id$g);

    var resetPowerMaxMonth = /*#__PURE__*/Object.freeze({
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

    const id$f = runTariffPlan$2;
    const name$f = commandNames[runTariffPlan$2];
    const headerSize$f = 2;
    const maxSize$f = 0;
    const accessLevel$f = READ_WRITE;
    const isLoraOnly$f = false;
    const examples$f = {
        'simple response': {
            id: id$f,
            name: name$f,
            headerSize: headerSize$f,
            maxSize: maxSize$f,
            accessLevel: accessLevel$f,
            parameters: {},
            bytes: [
                0x46, 0x00
            ]
        }
    };
    const fromBytes$f = (bytes) => {
        if (bytes.length !== maxSize$f) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$f = () => toBytes$21(id$f);

    var runTariffPlan = /*#__PURE__*/Object.freeze({
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

    const id$e = setAccessKey$2;
    const name$e = commandNames[setAccessKey$2];
    const headerSize$e = 2;
    const maxSize$e = 0;
    const accessLevel$e = READ_WRITE;
    const isLoraOnly$e = false;
    const examples$e = {
        'simple response': {
            id: id$e,
            name: name$e,
            headerSize: headerSize$e,
            maxSize: maxSize$e,
            accessLevel: accessLevel$e,
            parameters: {},
            bytes: [
                0x09, 0x00
            ]
        }
    };
    const fromBytes$e = (bytes) => {
        if (bytes.length !== maxSize$e) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$e = () => toBytes$21(id$e);

    var setAccessKey = /*#__PURE__*/Object.freeze({
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

    const id$d = setCorrectDateTime$2;
    const name$d = commandNames[setCorrectDateTime$2];
    const headerSize$d = 2;
    const maxSize$d = 0;
    const accessLevel$d = READ_ONLY;
    const isLoraOnly$d = false;
    const examples$d = {
        'simple response': {
            id: id$d,
            name: name$d,
            headerSize: headerSize$d,
            maxSize: maxSize$d,
            accessLevel: accessLevel$d,
            parameters: {},
            bytes: [
                0x5c, 0x00
            ]
        }
    };
    const fromBytes$d = (bytes) => {
        if (bytes.length !== maxSize$d) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$d = () => toBytes$21(id$d);

    var setCorrectDateTime = /*#__PURE__*/Object.freeze({
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

    const id$c = setCorrectTime$2;
    const name$c = commandNames[setCorrectTime$2];
    const headerSize$c = 2;
    const maxSize$c = 0;
    const accessLevel$c = READ_WRITE;
    const isLoraOnly$c = false;
    const examples$c = {
        'simple response': {
            id: id$c,
            name: name$c,
            headerSize: headerSize$c,
            maxSize: maxSize$c,
            accessLevel: accessLevel$c,
            parameters: {},
            bytes: [
                0x1c, 0x00
            ]
        }
    };
    const fromBytes$c = (bytes) => {
        if (bytes.length !== maxSize$c) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$c = () => toBytes$21(id$c);

    var setCorrectTime = /*#__PURE__*/Object.freeze({
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

    const id$b = setDateTime$2;
    const name$b = commandNames[setDateTime$2];
    const headerSize$b = 2;
    const maxSize$b = 0;
    const accessLevel$b = READ_ONLY;
    const isLoraOnly$b = false;
    const examples$b = {
        'simple response': {
            id: id$b,
            name: name$b,
            headerSize: headerSize$b,
            maxSize: maxSize$b,
            accessLevel: accessLevel$b,
            parameters: {},
            bytes: [
                0x08, 0x00
            ]
        }
    };
    const fromBytes$b = (bytes) => {
        if (bytes.length !== maxSize$b) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$b = () => toBytes$21(id$b);

    var setDateTime = /*#__PURE__*/Object.freeze({
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

    const id$a = setDayProfile$2;
    const name$a = commandNames[setDayProfile$2];
    const headerSize$a = 2;
    const maxSize$a = 0;
    const accessLevel$a = READ_WRITE;
    const isLoraOnly$a = false;
    const examples$a = {
        'simple response': {
            id: id$a,
            name: name$a,
            headerSize: headerSize$a,
            maxSize: maxSize$a,
            accessLevel: accessLevel$a,
            parameters: {},
            bytes: [
                0x10, 0x00
            ]
        }
    };
    const fromBytes$a = (bytes) => {
        if (bytes.length !== maxSize$a) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$a = () => toBytes$21(id$a);

    var setDayProfile = /*#__PURE__*/Object.freeze({
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

    const id$9 = setDisplayParam$2;
    const name$9 = commandNames[setDisplayParam$2];
    const headerSize$9 = 2;
    const maxSize$9 = 0;
    const accessLevel$9 = READ_WRITE;
    const isLoraOnly$9 = false;
    const examples$9 = {
        'simple response': {
            id: id$9,
            name: name$9,
            headerSize: headerSize$9,
            maxSize: maxSize$9,
            accessLevel: accessLevel$9,
            parameters: {},
            bytes: [
                0x5d, 0x00
            ]
        }
    };
    const fromBytes$9 = (bytes) => {
        if (bytes.length !== maxSize$9) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$9 = () => toBytes$21(id$9);

    var setDisplayParam = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$9,
        examples: examples$9,
        fromBytes: fromBytes$9,
        headerSize: headerSize$9,
        id: id$9,
        isLoraOnly: isLoraOnly$9,
        maxSize: maxSize$9,
        name: name$9,
        toBytes: toBytes$9
    });

    const id$8 = setOperatorParametersExtended3$2;
    const name$8 = commandNames[setOperatorParametersExtended3$2];
    const headerSize$8 = 2;
    const maxSize$8 = 0;
    const accessLevel$8 = READ_WRITE;
    const isLoraOnly$8 = false;
    const examples$8 = {
        'simple response': {
            id: id$8,
            name: name$8,
            headerSize: headerSize$8,
            maxSize: maxSize$8,
            accessLevel: accessLevel$8,
            parameters: {},
            bytes: [
                0x72, 0x00
            ]
        }
    };
    const fromBytes$8 = (bytes) => {
        if (bytes.length !== maxSize$8) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$8 = () => toBytes$21(id$8);

    var setOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$8,
        examples: examples$8,
        fromBytes: fromBytes$8,
        headerSize: headerSize$8,
        id: id$8,
        isLoraOnly: isLoraOnly$8,
        maxSize: maxSize$8,
        name: name$8,
        toBytes: toBytes$8
    });

    const id$7 = setOperatorParameters$2;
    const name$7 = commandNames[setOperatorParameters$2];
    const headerSize$7 = 2;
    const maxSize$7 = 0;
    const accessLevel$7 = READ_WRITE;
    const isLoraOnly$7 = false;
    const examples$7 = {
        'simple response': {
            id: id$7,
            name: name$7,
            headerSize: headerSize$7,
            maxSize: maxSize$7,
            accessLevel: accessLevel$7,
            parameters: {},
            bytes: [
                0x1f, 0x00
            ]
        }
    };
    const fromBytes$7 = (bytes) => {
        if (bytes.length !== maxSize$7) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$7 = () => toBytes$21(id$7);

    var setOperatorParameters = /*#__PURE__*/Object.freeze({
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

    const id$6 = setSaldo$2;
    const name$6 = commandNames[setSaldo$2];
    const headerSize$6 = 2;
    const maxSize$6 = 0;
    const accessLevel$6 = READ_WRITE;
    const isLoraOnly$6 = false;
    const examples$6 = {
        'simple response': {
            id: id$6,
            name: name$6,
            headerSize: headerSize$6,
            maxSize: maxSize$6,
            accessLevel: accessLevel$6,
            parameters: {},
            bytes: [
                0x2a, 0x00
            ]
        }
    };
    const fromBytes$6 = (bytes) => {
        if (bytes.length !== maxSize$6) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$6 = () => toBytes$21(id$6);

    var setSaldo = /*#__PURE__*/Object.freeze({
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

    const id$5 = setSaldoParameters$2;
    const name$5 = commandNames[setSaldoParameters$2];
    const headerSize$5 = 2;
    const maxSize$5 = 0;
    const accessLevel$5 = READ_WRITE;
    const isLoraOnly$5 = false;
    const examples$5 = {
        'simple response': {
            id: id$5,
            name: name$5,
            headerSize: headerSize$5,
            maxSize: maxSize$5,
            accessLevel: accessLevel$5,
            parameters: {},
            bytes: [
                0x2f, 0x00
            ]
        }
    };
    const fromBytes$5 = (bytes) => {
        if (bytes.length !== maxSize$5) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$5 = () => toBytes$21(id$5);

    var setSaldoParameters = /*#__PURE__*/Object.freeze({
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

    const id$4 = setSeasonProfile$2;
    const name$4 = commandNames[setSeasonProfile$2];
    const headerSize$4 = 2;
    const maxSize$4 = 0;
    const accessLevel$4 = READ_WRITE;
    const isLoraOnly$4 = false;
    const examples$4 = {
        'simple response': {
            id: id$4,
            name: name$4,
            headerSize: headerSize$4,
            maxSize: maxSize$4,
            accessLevel: accessLevel$4,
            parameters: {},
            bytes: [
                0x11, 0x00
            ]
        }
    };
    const fromBytes$4 = (bytes) => {
        if (bytes.length !== maxSize$4) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$4 = () => toBytes$21(id$4);

    var setSeasonProfile = /*#__PURE__*/Object.freeze({
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

    const id$3 = setSpecialDay$2;
    const name$3 = commandNames[setSpecialDay$2];
    const headerSize$3 = 2;
    const maxSize$3 = 0;
    const accessLevel$3 = READ_WRITE;
    const isLoraOnly$3 = false;
    const examples$3 = {
        'simple response': {
            id: id$3,
            name: name$3,
            headerSize: headerSize$3,
            maxSize: maxSize$3,
            accessLevel: accessLevel$3,
            parameters: {},
            bytes: [
                0x12, 0x00
            ]
        }
    };
    const fromBytes$3 = (bytes) => {
        if (bytes.length !== maxSize$3) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$3 = () => toBytes$21(id$3);

    var setSpecialDay = /*#__PURE__*/Object.freeze({
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

    const id$2 = setSpecialOperation$2;
    const name$2 = commandNames[setSpecialOperation$2];
    const headerSize$2 = 2;
    const maxSize$2 = 1;
    const accessLevel$2 = READ_WRITE;
    const isLoraOnly$2 = false;
    const examples$2 = {
        'electro-magnetic screen is present': {
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            maxSize: maxSize$2,
            accessLevel: accessLevel$2,
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
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            maxSize: maxSize$2,
            accessLevel: accessLevel$2,
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
            id: id$2,
            name: name$2,
            headerSize: headerSize$2,
            maxSize: maxSize$2,
            accessLevel: accessLevel$2,
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
    const fromBytes$2 = (bytes) => {
        const buffer = new CommandBinaryBuffer$1(bytes);
        const flags = buffer.getUint8();
        const electroMagneticIndication = !!(flags & 1);
        const magneticIndication = !!(flags & 2);
        return {
            electroMagneticIndication,
            magneticIndication
        };
    };
    const toBytes$2 = (parameters) => {
        const buffer = new CommandBinaryBuffer$1(maxSize$2);
        let flags = 0;
        if (parameters.electroMagneticIndication) {
            flags |= 1;
        }
        if (parameters.magneticIndication) {
            flags |= 2;
        }
        buffer.setUint8(flags);
        return toBytes$21(id$2, buffer.data);
    };

    var setSpecialOperation = /*#__PURE__*/Object.freeze({
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

    const id$1 = turnRelayOff$2;
    const name$1 = commandNames[turnRelayOff$2];
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
                0x19, 0x00
            ]
        }
    };
    const fromBytes$1 = (bytes) => {
        if (bytes.length !== maxSize$1) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes$1 = () => toBytes$21(id$1);

    var turnRelayOff = /*#__PURE__*/Object.freeze({
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

    const id = turnRelayOn$2;
    const name = commandNames[turnRelayOn$2];
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
                0x18, 0x00
            ]
        }
    };
    const fromBytes = (bytes) => {
        if (bytes.length !== maxSize) {
            throw new Error(`Wrong buffer size: ${bytes.length}.`);
        }
        return {};
    };
    const toBytes = () => toBytes$21(id);

    var turnRelayOn = /*#__PURE__*/Object.freeze({
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
        getDayEnergies: getDayEnergies,
        getDayMaxDemand: getDayMaxDemand,
        getDayMaxDemandExport: getDayMaxDemandExport,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious,
        getDayMaxPower: getDayMaxPower,
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
        getExtendedCurrentValues2: getExtendedCurrentValues2,
        getHalfHourDemand: getHalfHourDemand,
        getHalfHourDemandExport: getHalfHourDemandExport,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious,
        getHalfhoursEnergies: getHalfhoursEnergies,
        getMagneticFieldThreshold: getMagneticFieldThreshold,
        getMeterInfo: getMeterInfo,
        getMonthDemand: getMonthDemand,
        getMonthDemandExport: getMonthDemandExport,
        getMonthMaxDemand: getMonthMaxDemand,
        getMonthMaxDemandExport: getMonthMaxDemandExport,
        getOperatorParameters: getOperatorParameters,
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
        setOperatorParametersExtended3: setOperatorParametersExtended3,
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
