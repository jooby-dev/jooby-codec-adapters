(function () {
    'use strict';

    // https://gist.github.com/addyosmani/d5648c89420eb333904c
    Array.prototype.fill = Array.prototype.fill || function (value) {
      var obj = Object(this);
      var len = parseInt(obj.length, 10);
      var start = arguments[1];
      var relativeStart = parseInt(start, 10) || 0;
      var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
      var end = arguments[2];
      var relativeEnd = end === undefined ? len : parseInt(end) || 0;
      var _final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
      for (; k < _final; k++) {
        obj[k] = value;
      }
      return obj;
    };

    // https://github.com/jsPolyfill/Array.prototype.find
    Array.prototype.find = Array.prototype.find || function (callback) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      } else if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }
      var list = Object(this);

      // always has an positive integer as length
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      for (var i = 0; i < length; i++) {
        var element = list[i];
        if (callback.call(thisArg, element, i, list)) {
          return element;
        }
      }
    };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
    Number.EPSILON = Number.EPSILON || 2.220446049250313e-16;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    if (typeof Object.assign !== 'function') {
      Object.assign = function (target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output;
      };
    }

    // https://github.com/KhaledElAnsari/String.prototype.padStart
    String.prototype.padStart = String.prototype.padStart || function (targetLength, padString) {
      targetLength = Math.floor(targetLength) || 0;
      if (targetLength < this.length) {
        return String(this);
      }
      padString = padString ? String(padString) : ' ';
      var pad = '';
      var len = targetLength - this.length;
      var i = 0;
      while (pad.length < len) {
        if (!padString[i]) {
          i = 0;
        }
        pad += padString[i];
        i++;
      }
      return pad + String(this).slice(0);
    };

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var hexFormatOptions = {
      separator: ' ',
      prefix: ''
    };

    var INT8_SIZE = 1;
    var INT16_SIZE = 2;
    var INT32_SIZE = 4;
    var log = Math.log,
      pow = Math.pow,
      LN2 = Math.LN2;
    var readFloat = function readFloat(buffer, offset, isLittleEndian, mLen, bytes) {
      var e,
        m,
        eLen = bytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        nBits = -7,
        i = isLittleEndian ? bytes - 1 : 0,
        d = isLittleEndian ? -1 : 1,
        s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8);
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8);
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
      } else {
        m = m + pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * pow(2, e - mLen);
    };
    var writeFloat = function writeFloat(buffer, offset, value, isLittleEndian, mLen, bytes) {
      var e,
        m,
        c,
        eLen = bytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0,
        i = isLittleEndian ? 0 : bytes - 1,
        d = isLittleEndian ? 1 : -1,
        s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value < 0 && (value = -value);
      if (value !== value || value === Infinity) {
        m = value !== value ? 1 : 0;
        e = eMax;
      } else {
        e = log(value) / LN2 | 0;
        if (value * (c = pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * pow(2, eBias - 1) * pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 0x100, mLen -= 8);
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 0x100, eLen -= 8);
      buffer[offset + i - d] |= s * 0x80;
    };
    var be2 = [1, 0];
    var be4 = [3, 2, 1, 0];
    var le2 = [0, 1];
    var le4 = [0, 1, 2, 3];
    var readUint8 = function readUint8(buffer, offset) {
      return buffer[offset];
    };
    var readUint16 = function readUint16(buffer, offset, isLittleEndian) {
      var order = isLittleEndian ? le2 : be2;
      var b0 = buffer[offset + order[0]];
      var b1 = buffer[offset + order[1]] << 8;
      return b0 | b1;
    };
    var readUint32 = function readUint32(buffer, offset, isLittleEndian) {
      var order = isLittleEndian ? le4 : be4;
      var b0 = buffer[offset + order[3]] * 0x1000000;
      var b1 = buffer[offset + order[2]] * 0x10000;
      var b2 = buffer[offset + order[1]] * 0x100;
      var b3 = buffer[offset + order[0]];
      return b0 + b1 + b2 + b3;
    };
    var writeUint8 = function writeUint8(buffer, offset, value) {
      buffer[offset] = value & 0xff;
    };
    var writeUint16 = function writeUint16(buffer, offset, value, isLittleEndian) {
      var order = isLittleEndian ? le2 : be2;
      buffer[offset + order[0]] = value & 0xff;
      buffer[offset + order[1]] = value >>> 8 & 0xff;
    };
    var writeUint32 = function writeUint32(buffer, offset, value, isLittleEndian) {
      var order = isLittleEndian ? le4 : be4;
      buffer[offset + order[0]] = value & 0xff;
      buffer[offset + order[1]] = value >>> 8 & 0xff;
      buffer[offset + order[2]] = value >>> 16 & 0xff;
      buffer[offset + order[3]] = value >>> 24 & 0xff;
    };
    function BinaryBuffer(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (typeof dataOrLength === 'number') {
        var bytes = new Array(dataOrLength).fill(0);
        this.data = bytes;
      } else {
        this.data = dataOrLength;
      }
      this.offset = 0;
      this.isLittleEndian = isLittleEndian;
    }
    BinaryBuffer.prototype = {
      toUint8Array: function toUint8Array() {
        return this.data;
      },
      seek: function seek(position) {
        if (position < 0 || position >= this.data.length) {
          throw new Error('Invalid position.');
        }
        this.offset = position;
      },
      setInt8: function setInt8(value) {
        writeUint8(this.data, this.offset, value < 0 ? value | 0x100 : value);
        this.offset += INT8_SIZE;
      },
      getInt8: function getInt8() {
        var result = readUint8(this.data, this.offset);
        this.offset += INT8_SIZE;
        return result & 0x80 ? result ^ -0x100 : result;
      },
      setUint8: function setUint8(value) {
        writeUint8(this.data, this.offset, value);
        this.offset += INT8_SIZE;
      },
      getUint8: function getUint8() {
        var result = readUint8(this.data, this.offset);
        this.offset += INT8_SIZE;
        return result;
      },
      setInt16: function setInt16(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint16(this.data, this.offset, value < 0 ? value | 0x10000 : value, isLittleEndian);
        this.offset += INT16_SIZE;
      },
      getInt16: function getInt16() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint16(this.data, this.offset, isLittleEndian);
        this.offset += INT16_SIZE;
        return result & 0x8000 ? result ^ -0x10000 : result;
      },
      setUint16: function setUint16(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint16(this.data, this.offset, value, isLittleEndian);
        this.offset += INT16_SIZE;
      },
      getUint16: function getUint16() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint16(this.data, this.offset, isLittleEndian);
        this.offset += INT16_SIZE;
        return result;
      },
      setInt32: function setInt32(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint32(this.data, this.offset, value < 0 ? value | 0x100000000 : value, isLittleEndian);
        this.offset += INT32_SIZE;
      },
      getInt32: function getInt32() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint32(this.data, this.offset, isLittleEndian);
        this.offset += INT32_SIZE;
        return result & 0x80000000 ? result ^ -0x100000000 : result;
      },
      setUint32: function setUint32(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint32(this.data, this.offset, value, isLittleEndian);
        this.offset += INT32_SIZE;
      },
      getUint32: function getUint32() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint32(this.data, this.offset, isLittleEndian);
        this.offset += INT32_SIZE;
        return result;
      },
      setFloat32: function setFloat32(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeFloat(this.data, this.offset, value, isLittleEndian, 23, 4);
        this.offset += INT32_SIZE;
      },
      getFloat32: function getFloat32() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readFloat(this.data, this.offset, isLittleEndian, 23, 4);
        this.offset += INT32_SIZE;
        return result;
      },
      setString: function setString(value) {
        this.setUint8(value.length);
        for (var index = 0; index < value.length; ++index) {
          this.setUint8(value.charCodeAt(index));
        }
      },
      getString: function getString() {
        var size = this.getUint8();
        var endIndex = this.offset + size;
        var chars = [];
        while (this.offset < endIndex) {
          chars.push(String.fromCharCode(this.getUint8()));
        }
        return chars.join('');
      },
      getBytesToOffset: function getBytesToOffset() {
        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.offset;
        return this.data.slice(0, offset);
      },
      getBytesLeft: function getBytesLeft() {
        return this.getBytes(this.bytesLeft);
      },
      getBytes: function getBytes(length) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.offset;
        this.offset = offset + length;
        return this.data.slice(offset, this.offset);
      },
      setBytes: function setBytes(data) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.offset;
        var bytes = this.data;
        bytes.splice.apply(bytes, [offset, data.length].concat(_toConsumableArray(data)));
        this.data = bytes;
        this.offset = offset + data.length;
      }
    };
    Object.defineProperties(BinaryBuffer.prototype, {
      size: {
        get: function get() {
          return this.data.length;
        }
      },
      isEmpty: {
        get: function get() {
          return this.data.length - this.offset === 0;
        }
      },
      bytesLeft: {
        get: function get() {
          return this.data.length - this.offset;
        }
      },
      position: {
        get: function get() {
          return this.offset;
        }
      }
    });

    var extraCommandMask = 0x1f;
    var toBytes$q = function toBytes(commandId, commandSize) {
      if ((commandId & extraCommandMask) === 0) {
        if (commandSize > extraCommandMask) {
          throw new Error("Wrong command id/size. Id: ".concat(commandId, ", size: ").concat(commandSize, "."));
        }
        return [commandId | commandSize];
      }
      if (commandId > extraCommandMask) {
        return [extraCommandMask, commandId >> 8, commandSize];
      }
      return [commandId, commandSize];
    };

    var toBytes$p = function toBytes(commandId) {
      var commandData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var headerData = toBytes$q(commandId, commandData.length);
      return [].concat(_toConsumableArray(headerData), _toConsumableArray(commandData));
    };

    var id$o = 0x0c;
    var name$o = 'correctTime2000';
    var headerSize$o = 2;
    var COMMAND_BODY_SIZE$d = 2;
    var examples$o = {
      'correct time 120 seconds to the past': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
        parameters: {
          sequenceNumber: 45,
          seconds: -120
        },
        bytes: [0x0c, 0x02, 0x2d, 0x88]
      },
      'correct time 95 seconds to the future': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
        parameters: {
          sequenceNumber: 46,
          seconds: 95
        },
        bytes: [0x0c, 0x02, 0x2e, 0x5f]
      }
    };
    var fromBytes$o = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$d) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data, false);
      var parameters = {
        sequenceNumber: buffer.getUint8(),
        seconds: buffer.getInt8()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    var toBytes$o = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$d, false);
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

    var id$n = 0x07;
    var name$n = 'getCurrent';
    var headerSize$n = 2;
    var COMMAND_BODY_SIZE$c = 0;
    var examples$n = {
      'simple request': {
        id: id$n,
        headerSize: headerSize$n,
        name: name$n,
        parameters: {},
        bytes: [0x07, 0x00]
      }
    };
    var fromBytes$n = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$c) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$n = function toBytes() {
      return toBytes$p(id$n);
    };

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$n,
        fromBytes: fromBytes$n,
        headerSize: headerSize$n,
        id: id$n,
        name: name$n,
        toBytes: toBytes$n
    });

    var INITIAL_YEAR_TIMESTAMP = 946684800000;
    var MILLISECONDS_IN_SECONDS = 1000;
    var getDateFromTime2000 = function getDateFromTime2000(time2000) {
      return new Date(INITIAL_YEAR_TIMESTAMP + time2000 * MILLISECONDS_IN_SECONDS);
    };
    var getTime2000FromDate = function getTime2000FromDate(date) {
      return (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
    };

    var fromObject = function fromObject() {
      var bitMask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var booleanObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var result = 0;
      for (var name in booleanObject) {
        if (name in bitMask && booleanObject[name]) {
          result |= bitMask[name];
        }
      }
      return result;
    };
    var toObject = function toObject() {
      var bitMask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var result = {};
      for (var name in bitMask) {
        result[name] = (value & bitMask[name]) !== 0;
      }
      return result;
    };

    var GASI1 = 1;
    var GASI2 = 2;
    var GASI3 = 3;
    var NOVATOR = 4;
    var IMP2EU = 5;
    var IMP4EU = 6;
    var MTXLORA = 7;
    var IMP2AS = 8;
    var IMP2IN = 9;
    var IMP4IN = 10;
    var ELIMP = 11;
    var GASIC = 12;

    var invertObject = (function (source) {
      var target = {};
      for (var property in source) {
        var value = source[property];
        target[value] = property;
      }
      return target;
    });

    var INITIAL_YEAR = 2000;
    var MONTH_BIT_SIZE = 4;
    var DATE_BIT_SIZE = 5;
    var YEAR_START_INDEX = 1;
    var UNKNOWN_BATTERY_VOLTAGE = 4095;
    var EXTEND_BIT_MASK = 0x80;
    var LAST_BIT_INDEX = 7;
    var GAS_HARDWARE_TYPES = [GASI2, GASI3, GASI1, GASIC];
    var TWO_CHANNELS_HARDWARE_TYPES = [IMP2AS, IMP2EU, IMP2IN, NOVATOR];
    var ELIMP_HARDWARE_TYPES = [ELIMP];
    var FOUR_CHANNELS_HARDWARE_TYPES = [IMP4EU, IMP4IN];
    var MTX_HARDWARE_TYPES = [MTXLORA];
    var TWO_BYTES_HARDWARE_TYPES = [].concat(FOUR_CHANNELS_HARDWARE_TYPES, MTX_HARDWARE_TYPES);
    var gasBitMask = {
      isBatteryLow: Math.pow(2, 0),
      isMagneticInfluence: Math.pow(2, 1),
      isButtonReleased: Math.pow(2, 2),
      isConnectionLost: Math.pow(2, 3)
    };
    var twoChannelBitMask = {
      isBatteryLow: Math.pow(2, 0),
      isConnectionLost: Math.pow(2, 3),
      isFirstChannelInactive: Math.pow(2, 4),
      isSecondChannelInactive: Math.pow(2, 5)
    };
    var elimpBitMask = {
      isConnectionLost: Math.pow(2, 3)
    };
    var fourChannelBitMask = {
      isBatteryLow: Math.pow(2, 0),
      isConnectionLost: Math.pow(2, 3),
      isFirstChannelInactive: Math.pow(2, 4),
      isSecondChannelInactive: Math.pow(2, 5),
      isThirdChannelInactive: Math.pow(2, 6),
      isForthChannelInactive: Math.pow(2, 7)
    };
    var mtxBitMask = {
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
    var byteToPulseCoefficientMap = {
      128: 1,
      129: 5,
      130: 10,
      131: 100,
      132: 1000,
      133: 10000,
      134: 100000
    };
    var pulseCoefficientToByteMap = invertObject(byteToPulseCoefficientMap);
    var isMSBSet = function isMSBSet(value) {
      return !!(value & 0x80);
    };
    var getEventStatusSize = function getEventStatusSize(hardwareType) {
      return TWO_BYTES_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ? 2 : 1;
    };
    function CommandBinaryBuffer(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.prototype.getExtendedValue = function () {
      var value = 0;
      var isByteExtended = true;
      var position = 0;
      while (isByteExtended && this.offset <= this.data.length) {
        var _byte3 = this.getUint8();
        isByteExtended = !!(_byte3 & EXTEND_BIT_MASK);
        value += (_byte3 & 0x7f) << 7 * position;
        ++position;
      }
      if (value < 0) {
        value = 0;
      }
      return value;
    };
    CommandBinaryBuffer.prototype.setExtendedValue = function (value) {
      var _this = this;
      if (value === 0) {
        this.setUint8(0);
        return;
      }
      var data = [];
      var encodedValue = value;
      while (encodedValue) {
        data.push(EXTEND_BIT_MASK | encodedValue & 0x7f);
        encodedValue >>= 7;
      }
      var lastByte = data.pop();
      if (lastByte) {
        data.push(lastByte & 0x7f);
      }
      data.forEach(function (extendedValue) {
        return _this.setUint8(extendedValue);
      });
    };
    CommandBinaryBuffer.prototype.getExtendedValueSize = function (bits) {
      var extBits = Math.ceil(bits / 7);
      var totalBits = bits + extBits;
      var extBytes = Math.ceil(totalBits / 8);
      return extBytes;
    };
    CommandBinaryBuffer.prototype.getTime = function () {
      return this.getUint32(false);
    };
    CommandBinaryBuffer.prototype.setTime = function (value) {
      this.setUint32(value, false);
    };
    CommandBinaryBuffer.prototype.getBatteryVoltage = function () {
      var lowVoltageByte = this.getUint8();
      var lowAndHightVoltageByte = this.getUint8();
      var highVoltageByte = this.getUint8();
      var underLowLoad = lowVoltageByte << 4;
      underLowLoad |= (lowAndHightVoltageByte & 0xf0) >> 4;
      var underHighLoad = (lowAndHightVoltageByte & 0x0f) << 8 | highVoltageByte;
      if (underHighLoad === UNKNOWN_BATTERY_VOLTAGE) {
        underHighLoad = undefined;
      }
      if (underLowLoad === UNKNOWN_BATTERY_VOLTAGE) {
        underLowLoad = undefined;
      }
      return {
        underLowLoad: underLowLoad,
        underHighLoad: underHighLoad
      };
    };
    CommandBinaryBuffer.prototype.setBatteryVoltage = function (batteryVoltage) {
      var _this2 = this;
      var underLowLoad = batteryVoltage.underLowLoad,
        underHighLoad = batteryVoltage.underHighLoad;
      if (underLowLoad === undefined) {
        underLowLoad = UNKNOWN_BATTERY_VOLTAGE;
      }
      if (underHighLoad === undefined) {
        underHighLoad = UNKNOWN_BATTERY_VOLTAGE;
      }
      var lowVoltageByte = underLowLoad >> 4 & 0xff;
      var lowAndHighVoltageByte = (underLowLoad & 0x0f) << 4 | underHighLoad >> 8 & 0x0f;
      var highVoltageByte = underHighLoad & 0xff;
      [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(function (_byte4) {
        return _this2.setUint8(_byte4);
      });
    };
    CommandBinaryBuffer.prototype.getChannels = function () {
      var channelList = [];
      var extended = true;
      var channelIndex = 1;
      while (extended) {
        var _byte5 = this.getUint8();
        var bits = _byte5.toString(2).padStart(LAST_BIT_INDEX + 1, '0').split('').reverse();
        bits.forEach(function (bit, index) {
          var value = Number(bit);
          if (index === LAST_BIT_INDEX) {
            extended = !!value;
          } else {
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
      var _this3 = this;
      if (channelList.length === 0) {
        this.setUint8(0);
        return;
      }
      channelList.sort(function (a, b) {
        return a.index - b.index;
      });
      var maxChannel = Math.max.apply(Math, _toConsumableArray(channelList.map(function (_ref) {
        var index = _ref.index;
        return index;
      })));
      var size = (maxChannel - maxChannel % 8) / 8;
      var data = new Array(size + 1).fill(0);
      var _byte6 = 0;
      data.forEach(function (_, byteIndex) {
        var channelIndex = byteIndex * LAST_BIT_INDEX + 1;
        var maxChannelIndex = channelIndex + LAST_BIT_INDEX;
        while (channelIndex < maxChannelIndex) {
          var channel = channelList.find(function (item) {
            return item.index === channelIndex;
          });
          if (channel !== undefined) {
            _byte6 |= 1 << (channel.index - 1) % LAST_BIT_INDEX;
          }
          ++channelIndex;
        }
        if (data[byteIndex + 1] !== undefined) {
          _byte6 |= 1 << LAST_BIT_INDEX;
        }
        data[byteIndex] = _byte6;
        _byte6 = 0;
      });
      data.forEach(function (value) {
        return _this3.setUint8(value);
      });
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiff = function () {
      var _this4 = this;
      var date = this.getDate();
      var _this$getHours = this.getHours(),
        hour = _this$getHours.hour,
        hours = _this$getHours.hours;
      var channels = this.getChannels();
      var channelList = [];
      date.setUTCHours(hour);
      channels.forEach(function (channelIndex) {
        var diff = [];
        var value = _this4.getExtendedValue();
        for (var diffHour = 1; diffHour < hours; ++diffHour) {
          diff.push(_this4.getExtendedValue());
        }
        channelList.push({
          value: value,
          diff: diff,
          index: channelIndex
        });
      });
      return {
        startTime2000: getTime2000FromDate(date),
        hours: hours,
        channelList: channelList
      };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiff = function (hours, startTime2000, channelList) {
      var _this5 = this;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
      this.setDate(date);
      this.setHours(hour, hours);
      this.setChannels(channelList);
      channelList.forEach(function (_ref2) {
        var value = _ref2.value,
          diff = _ref2.diff;
        _this5.setExtendedValue(value);
        diff.forEach(function (diffValue) {
          return _this5.setExtendedValue(diffValue);
        });
      });
    };
    CommandBinaryBuffer.prototype.getHours = function () {
      var _byte7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getUint8();
      if (_byte7 === 0) {
        return {
          hours: 0,
          hour: 0
        };
      }
      var hours = ((_byte7 & 0xe0) >> 5) + 1;
      var hour = _byte7 & 0x1f;
      return {
        hours: hours,
        hour: hour
      };
    };
    CommandBinaryBuffer.prototype.setHours = function (hour, hours) {
      if (hour === 0 && hours === 0) {
        this.setUint8(0);
        return;
      }
      this.setUint8((hours - 1 & 0x07) << 5 | hour & 0x1f);
    };
    CommandBinaryBuffer.prototype.getDate = function () {
      var yearMonthByte = this.getUint8();
      var monthDateByte = this.getUint8();
      var year = yearMonthByte >> YEAR_START_INDEX;
      var month = (yearMonthByte & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX | monthDateByte >> DATE_BIT_SIZE;
      var monthDay = monthDateByte & 0x1f;
      return new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0));
    };
    CommandBinaryBuffer.prototype.setDate = function (dateOrTime) {
      var _this6 = this;
      var date;
      if (dateOrTime instanceof Date) {
        date = dateOrTime;
      } else {
        date = getDateFromTime2000(dateOrTime);
      }
      var year = date.getUTCFullYear() - INITIAL_YEAR;
      var month = date.getUTCMonth() + 1;
      var day = date.getUTCDate();
      var yearMonthByte = year << YEAR_START_INDEX | month >> MONTH_BIT_SIZE - YEAR_START_INDEX;
      var monthDateByte = (month & 0x07) << DATE_BIT_SIZE | day;
      [yearMonthByte, monthDateByte].forEach(function (_byte8) {
        return _this6.setUint8(_byte8);
      });
    };
    CommandBinaryBuffer.prototype.getPulseCoefficient = function () {
      var pulseCoefficient = this.getUint8();
      if (isMSBSet(pulseCoefficient)) {
        var value = byteToPulseCoefficientMap[pulseCoefficient];
        if (value) {
          return value;
        }
        throw new Error('pulseCoefficient MSB is set, but value unknown');
      }
      return pulseCoefficient;
    };
    CommandBinaryBuffer.prototype.setPulseCoefficient = function (value) {
      if (value in pulseCoefficientToByteMap) {
        var _byte9 = pulseCoefficientToByteMap[value];
        if (_byte9) {
          this.setUint8(_byte9);
        } else {
          throw new Error('pulseCoefficient MSB is set, but value unknown');
        }
      } else {
        this.setUint8(value);
      }
    };
    CommandBinaryBuffer.prototype.getChannelsWithAbsoluteValues = function () {
      var _this7 = this;
      var channels = this.getChannels();
      var channelList = [];
      channels.forEach(function (channelIndex) {
        channelList.push({
          pulseCoefficient: _this7.getPulseCoefficient(),
          value: _this7.getExtendedValue(),
          index: channelIndex
        });
      });
      return channelList;
    };
    CommandBinaryBuffer.prototype.setChannelsWithAbsoluteValues = function (channelList) {
      var _this8 = this;
      this.setChannels(channelList);
      channelList.forEach(function (_ref3) {
        var value = _ref3.value,
          pulseCoefficient = _ref3.pulseCoefficient;
        _this8.setPulseCoefficient(pulseCoefficient);
        _this8.setExtendedValue(value);
      });
    };
    CommandBinaryBuffer.prototype.getChannelsAbsoluteValuesWithHourDiff = function (hours) {
      var _this9 = this;
      var channels = this.getChannels();
      var channelList = [];
      channels.forEach(function (channelIndex) {
        var pulseCoefficient = _this9.getPulseCoefficient();
        var value = _this9.getExtendedValue();
        var diff = [];
        for (var hourIndex = 1; hourIndex < hours; ++hourIndex) {
          diff.push(_this9.getExtendedValue());
        }
        channelList.push({
          diff: diff,
          value: value,
          pulseCoefficient: pulseCoefficient,
          index: channelIndex
        });
      });
      return channelList;
    };
    CommandBinaryBuffer.prototype.setChannelsAbsoluteValuesWithHourDiff = function (channelList) {
      var _this10 = this;
      this.setChannels(channelList);
      channelList.forEach(function (_ref4) {
        var value = _ref4.value,
          diff = _ref4.diff,
          pulseCoefficient = _ref4.pulseCoefficient;
        _this10.setPulseCoefficient(pulseCoefficient);
        _this10.setExtendedValue(value);
        diff.forEach(function (diffValue) {
          return _this10.setExtendedValue(diffValue);
        });
      });
    };
    CommandBinaryBuffer.prototype.getEventStatus = function (hardwareType) {
      var status;
      if (GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(gasBitMask, this.getUint8());
      } else if (TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(twoChannelBitMask, this.getUint8());
      } else if (ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(elimpBitMask, this.getUint8());
      } else if (FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(fourChannelBitMask, this.getExtendedValue());
      } else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(mtxBitMask, this.getUint16());
      } else {
        throw new Error('wrong hardwareType');
      }
      return status;
    };
    CommandBinaryBuffer.prototype.setEventStatus = function (hardwareType, status) {
      if (GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint8(fromObject(gasBitMask, status));
      } else if (TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint8(fromObject(twoChannelBitMask, status));
      } else if (ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint8(fromObject(elimpBitMask, status));
      } else if (FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setExtendedValue(fromObject(fourChannelBitMask, status));
      } else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint16(fromObject(mtxBitMask, status));
      } else {
        throw new Error('wrong hardwareType');
      }
    };

    var id$m = 0x1b;
    var name$m = 'getArchiveDaysMC';
    var headerSize$m = 2;
    var COMMAND_BODY_SIZE$b = 4;
    var examples$m = {
      '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
        id: id$m,
        name: name$m,
        headerSize: headerSize$m,
        parameters: {
          startTime2000: 731721600,
          days: 1,
          channelList: [1]
        },
        bytes: [0x1b, 0x04, 0x2e, 0x6a, 0x01, 0x01]
      }
    };
    var fromBytes$m = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$b) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var channelList = buffer.getChannels();
      var days = buffer.getUint8();
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: getTime2000FromDate(date),
        days: days,
        channelList: channelList
      };
    };
    var toBytes$m = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$b);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days,
        channelList = parameters.channelList;
      var date = getDateFromTime2000(startTime2000);
      buffer.setDate(date);
      buffer.setChannels(channelList.map(function (index) {
        return {
          index: index
        };
      }));
      buffer.setUint8(days);
      return toBytes$p(id$m, buffer.data);
    };

    var getArchiveDaysMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$m,
        fromBytes: fromBytes$m,
        headerSize: headerSize$m,
        id: id$m,
        name: name$m,
        toBytes: toBytes$m
    });

    var id$l = 0x0b;
    var name$l = 'getArchiveEvents';
    var headerSize$l = 2;
    var COMMAND_BODY_SIZE$a = 5;
    var examples$l = {
      'request 4 events from 2023.04.03 14:01:17 GMT': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
        parameters: {
          startTime2000: 733845677,
          events: 4
        },
        bytes: [0x0b, 0x05, 0x2b, 0xbd, 0x98, 0xad, 0x04]
      }
    };
    var fromBytes$l = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$a) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var startTime2000 = buffer.getTime();
      var events = buffer.getUint8();
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: startTime2000,
        events: events
      };
    };
    var toBytes$l = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        events = parameters.events;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$a);
      buffer.setTime(startTime2000);
      buffer.setUint8(events);
      return toBytes$p(id$l, buffer.data);
    };

    var getArchiveEvents$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$l,
        fromBytes: fromBytes$l,
        headerSize: headerSize$l,
        id: id$l,
        name: name$l,
        toBytes: toBytes$l
    });

    var id$k = 0x1a;
    var name$k = 'getArchiveHoursMC';
    var headerSize$k = 2;
    var COMMAND_BODY_SIZE$9 = 4;
    var examples$k = {
      'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$k,
        name: name$k,
        headerSize: headerSize$k,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [1]
        },
        bytes: [0x1a, 0x04, 0x2f, 0x97, 0x2c, 0x01]
      }
    };
    var fromBytes$k = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$9) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var _buffer$getHours = buffer.getHours(),
        hour = _buffer$getHours.hour,
        hours = _buffer$getHours.hours;
      var channelList = buffer.getChannels();
      date.setUTCHours(hour);
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: getTime2000FromDate(date),
        hours: hours,
        channelList: channelList
      };
    };
    var toBytes$k = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$9);
      var hours = parameters.hours,
        startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
      buffer.setDate(date);
      buffer.setHours(hour, hours);
      buffer.setChannels(channelList.map(function (index) {
        return {
          index: index
        };
      }));
      return toBytes$p(id$k, buffer.data);
    };

    var getArchiveHoursMc$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        name: name$k,
        toBytes: toBytes$k
    });

    var id$j = 0x18;
    var name$j = 'getCurrentMc';
    var headerSize$j = 2;
    var COMMAND_BODY_SIZE$8 = 0;
    var examples$j = {
      'simple request': {
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$j = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$8) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$j = function toBytes() {
      return toBytes$p(id$j);
    };

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        name: name$j,
        toBytes: toBytes$j
    });

    var id$i = 0x021f;
    var name$i = 'getLmicInfo';
    var headerSize$i = 3;
    var COMMAND_BODY_SIZE$7 = 0;
    var examples$i = {
      'simple request': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        parameters: {},
        bytes: [0x1f, 0x02, 0x00]
      }
    };
    var fromBytes$i = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$7) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$i = function toBytes() {
      return toBytes$p(id$i);
    };

    var getLmicInfo$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$i,
        fromBytes: fromBytes$i,
        headerSize: headerSize$i,
        id: id$i,
        name: name$i,
        toBytes: toBytes$i
    });

    var id$h = 0x14;
    var name$h = 'getStatus';
    var headerSize$h = 2;
    var COMMAND_BODY_SIZE$6 = 0;
    var examples$h = {
      'simple request': {
        id: id$h,
        name: name$h,
        headerSize: headerSize$h,
        parameters: {},
        bytes: [0x14, 0x00]
      }
    };
    var fromBytes$h = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$6) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$h = function toBytes() {
      return toBytes$p(id$h);
    };

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$h,
        fromBytes: fromBytes$h,
        headerSize: headerSize$h,
        id: id$h,
        name: name$h,
        toBytes: toBytes$h
    });

    var id$g = 0x09;
    var name$g = 'getTime2000';
    var headerSize$g = 2;
    var COMMAND_BODY_SIZE$5 = 0;
    var examples$g = {
      'simple request': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        parameters: {},
        bytes: [0x09, 0x00]
      }
    };
    var fromBytes$g = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$5) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$g = function toBytes() {
      return toBytes$p(id$g, []);
    };

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$g,
        fromBytes: fromBytes$g,
        headerSize: headerSize$g,
        id: id$g,
        name: name$g,
        toBytes: toBytes$g
    });

    var id$f = 0x02;
    var name$f = 'setTime2000';
    var headerSize$f = 2;
    var COMMAND_BODY_SIZE$4 = 5;
    var examples$f = {
      'set time to 2023.04.03 14:01:17 GMT': {
        id: id$f,
        headerSize: headerSize$f,
        parameters: {
          sequenceNumber: 78,
          seconds: 733845677
        },
        bytes: [0x02, 0x05, 0x4e, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes$f = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$4) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data, false);
      var parameters = {
        sequenceNumber: buffer.getUint8(),
        seconds: buffer.getInt32()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    var toBytes$f = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$4, false);
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

    var id$e = 0x0c;
    var name$e = 'correctTime2000';
    var headerSize$e = 2;
    var COMMAND_BODY_SIZE$3 = 1;
    var examples$e = {
      'time correction failure': {
        id: id$e,
        name: name$e,
        headerSize: headerSize$e,
        parameters: {
          status: 0
        },
        bytes: [0x0c, 0x01, 0x00]
      },
      'time correction success': {
        id: id$e,
        name: name$e,
        headerSize: headerSize$e,
        parameters: {
          status: 1
        },
        bytes: [0x0c, 0x01, 0x01]
      }
    };
    var fromBytes$e = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$3) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data, false);
      var parameters = {
        status: buffer.getUint8()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    var toBytes$e = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$3, false);
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

    var id$d = 0x18;
    var name$d = 'currentMC';
    var headerSize$d = 2;
    var COMMAND_BODY_MAX_SIZE$8 = 37;
    var examples$d = {
      '4 first channels': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          channelList: [{
            index: 1,
            value: 131
          }, {
            index: 2,
            value: 8
          }, {
            index: 3,
            value: 10
          }, {
            index: 4,
            value: 12
          }]
        },
        bytes: [0x18, 0x06, 0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c]
      },
      'single channel 2': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          channelList: [{
            index: 2,
            value: 50
          }]
        },
        bytes: [0x18, 0x02, 0x02, 0x32]
      },
      'channels 5, 6, 12': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          channelList: [{
            index: 5,
            value: 8146
          }, {
            index: 6,
            value: 164
          }, {
            index: 12,
            value: 75
          }]
        },
        bytes: [0x18, 0x07, 0xb0, 0x10, 0xd2, 0x3f, 0xa4, 0x01, 0x4b]
      }
    };
    var fromBytes$d = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$8) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var parameters = {
        channelList: []
      };
      var buffer = new CommandBinaryBuffer(data);
      var channelList = buffer.getChannels();
      parameters.channelList = channelList.map(function (channelIndex) {
        return {
          value: buffer.getExtendedValue(),
          index: channelIndex
        };
      });
      return parameters;
    };
    var toBytes$d = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$8);
      var channelList = parameters.channelList;
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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

    var id$c = 0x16;
    var name$c = 'dayMC';
    var headerSize$c = 2;
    var COMMAND_BODY_MAX_SIZE$7 = 32;
    var examples$c = {
      '4 channels at 2023.12.23 00:00:00 GMT': {
        id: id$c,
        name: name$c,
        headerSize: headerSize$c,
        parameters: {
          startTime2000: 756604800,
          channelList: [{
            index: 3,
            value: 131
          }, {
            index: 5,
            value: 8
          }, {
            index: 7,
            value: 10
          }, {
            index: 1,
            value: 12
          }]
        },
        bytes: [0x16, 0x08, 0x2f, 0x97, 0x55, 0x0c, 0x83, 0x01, 0x08, 0x0a]
      }
    };
    var fromBytes$c = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$7) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var channels = buffer.getChannels();
      var channelList = channels.map(function (channelIndex) {
        return {
          value: buffer.getExtendedValue(),
          index: channelIndex
        };
      });
      return {
        startTime2000: getTime2000FromDate(date),
        channelList: channelList
      };
    };
    var toBytes$c = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
      var channelList = parameters.channelList,
        startTime2000 = parameters.startTime2000;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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

    var id$b = 0x0b1f;
    var name$b = 'exAbsDayMC';
    var headerSize$b = 3;
    var COMMAND_BODY_MAX_SIZE$6 = 89;
    var examples$b = {
      'absolute day value for 2023.03.10 00:00:00 GMT': {
        id: id$b,
        name: name$b,
        headerSize: headerSize$b,
        parameters: {
          startTime2000: 731721600,
          channelList: [{
            pulseCoefficient: 100,
            index: 1,
            value: 342
          }]
        },
        bytes: [0x1f, 0x0b, 0x06, 0x2e, 0x6a, 0x01, 0x83, 0xd6, 0x02]
      }
    };
    var fromBytes$b = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$6) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var channelList = buffer.getChannelsWithAbsoluteValues();
      return {
        startTime2000: getTime2000FromDate(date),
        channelList: channelList
      };
    };
    var toBytes$b = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
      var startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$a = 0x0a1f;
    var name$a = 'exAbsHourMC';
    var headerSize$a = 3;
    var COMMAND_BODY_MAX_SIZE$5 = 168;
    var examples$a = {
      '1 channel at 2023.03.10 12:00:00 GMT': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          startTime2000: 731764800,
          hours: 2,
          channelList: [{
            pulseCoefficient: 100,
            index: 1,
            value: 342457,
            diff: [128]
          }]
        },
        bytes: [0x1f, 0x0a, 0x0a, 0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01]
      }
    };
    var fromBytes$a = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$5) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var _buffer$getHours = buffer.getHours(),
        hour = _buffer$getHours.hour,
        hours = _buffer$getHours.hours;
      var channelList = buffer.getChannelsAbsoluteValuesWithHourDiff(hours);
      date.setUTCHours(hour);
      return {
        startTime2000: getTime2000FromDate(date),
        hours: hours,
        channelList: channelList
      };
    };
    var toBytes$a = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$5);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
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

    var id$9 = 0x1b;
    var name$9 = 'getArchiveDaysMCResponse';
    var headerSize$9 = 2;
    var COMMAND_BODY_MAX_SIZE$4 = 5104;
    var examples$9 = {
      'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
        parameters: {
          startTime2000: 2678227200,
          days: 2,
          channelList: [{
            index: 1,
            dayList: [234, 332]
          }]
        },
        bytes: [0x1b, 0x08, 0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02]
      },
      'empty result from 2010.10.09 00:00:00 GMT for channel 1': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
        parameters: {
          startTime2000: 339897600,
          days: 1,
          channelList: [{
            index: 1,
            dayList: [0]
          }]
        },
        bytes: [0x1b, 0x05, 0x15, 0x49, 0x01, 0x01, 0x00]
      }
    };
    var fromBytes$9 = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var channels = buffer.getChannels();
      var days = buffer.getUint8();
      var channelList = [];
      channels.forEach(function (channelIndex) {
        var dayList = [];
        channelList.push({
          dayList: dayList,
          index: channelIndex
        });
        for (var day = 0; day < days; ++day) {
          dayList.push(buffer.getExtendedValue());
        }
      });
      return {
        startTime2000: getTime2000FromDate(date),
        days: days,
        channelList: channelList
      };
    };
    var toBytes$9 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days,
        channelList = parameters.channelList;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      buffer.setUint8(days);
      channelList.forEach(function (_ref) {
        var dayList = _ref.dayList;
        dayList.forEach(function (value) {
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

    var id$8 = 0x0b;
    var name$8 = 'getArchiveEvents';
    var headerSize$8 = 2;
    var COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    var examples$8 = {
      '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
        parameters: {
          eventList: [{
            time2000: 734015840,
            id: 1,
            sequenceNumber: 1
          }]
        },
        bytes: [0x0b, 0x06, 0x2b, 0xc0, 0x31, 0x60, 0x01, 0x01]
      },
      '4 events': {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
        parameters: {
          eventList: [{
            time2000: 734015840,
            id: 2,
            sequenceNumber: 1
          }, {
            time2000: 734025840,
            id: 1,
            sequenceNumber: 2
          }, {
            time2000: 734035840,
            id: 3,
            sequenceNumber: 3
          }, {
            time2000: 734045840,
            id: 4,
            sequenceNumber: 4
          }]
        },
        bytes: [0x0b, 0x18, 0x2b, 0xc0, 0x31, 0x60, 0x02, 0x01, 0x2b, 0xc0, 0x58, 0x70, 0x01, 0x02, 0x2b, 0xc0, 0x7f, 0x80, 0x03, 0x03, 0x2b, 0xc0, 0xa6, 0x90, 0x04, 0x04]
      }
    };
    var getEvent = function getEvent(buffer) {
      return {
        time2000: buffer.getTime(),
        id: buffer.getUint8(),
        sequenceNumber: buffer.getUint8()
      };
    };
    var setEvent = function setEvent(buffer, event) {
      buffer.setTime(event.time2000);
      buffer.setUint8(event.id);
      buffer.setUint8(event.sequenceNumber);
    };
    var fromBytes$8 = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data, false);
      var eventList = [];
      while (buffer.bytesLeft > 0) {
        eventList.push(getEvent(buffer));
      }
      return {
        eventList: eventList
      };
    };
    function toBytes$8(parameters) {
      var eventList = parameters.eventList;
      var buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE, false);
      eventList.forEach(function (event) {
        return setEvent(buffer, event);
      });
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

    var id$7 = 0x1a;
    var name$7 = 'getArchiveHoursMCResponse';
    var headerSize$7 = 2;
    var COMMAND_BODY_MAX_SIZE$3 = 164;
    var examples$7 = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$7,
        name: name$7,
        headerSize: headerSize$7,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [{
            index: 1,
            value: 131,
            diff: [10]
          }, {
            index: 2,
            value: 8,
            diff: [10]
          }, {
            index: 3,
            value: 8,
            diff: [10]
          }, {
            index: 4,
            value: 12,
            diff: [10]
          }]
        },
        bytes: [0x1a, 0x0d, 0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a]
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
        bytes: [0x1a, 0x04, 0x2f, 0x6a, 0x00, 0x00]
      }
    };
    var fromBytes$7 = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$3) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$7 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
      var hours = parameters.hours,
        startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$6 = 0x021f;
    var name$6 = 'getLmicInfo';
    var headerSize$6 = 3;
    var COMMAND_BODY_SIZE$2 = 2;
    var lmicCapabilitiesBitMask = {
      isMulticastSupported: 1 << 0,
      isFragmentedDataSupported: 1 << 1
    };
    var examples$6 = {
      'version: 5, support only multicast': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
        parameters: {
          version: 5,
          capabilities: {
            isMulticastSupported: true,
            isFragmentedDataSupported: false
          }
        },
        bytes: [0x1f, 0x02, 0x02, 0x01, 0x05]
      },
      'version: 8, support multicast and fragmented data': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
        parameters: {
          version: 8,
          capabilities: {
            isMulticastSupported: true,
            isFragmentedDataSupported: true
          }
        },
        bytes: [0x1f, 0x02, 0x02, 0x03, 0x08]
      }
    };
    var fromBytes$6 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data);
      var capabilities = toObject(lmicCapabilitiesBitMask, buffer.getUint8());
      var version = buffer.getUint8();
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        capabilities: capabilities,
        version: version
      };
    };
    var toBytes$6 = function toBytes(parameters) {
      var capabilities = parameters.capabilities,
        version = parameters.version;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$2);
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

    var id$5 = 0x17;
    var name$5 = 'hourMC';
    var headerSize$5 = 2;
    var COMMAND_BODY_MAX_SIZE$2 = 164;
    var examples$5 = {
      '4 first channels at 2023.12.23 12:00:00 GMT': {
        id: id$5,
        name: name$5,
        headerSize: headerSize$5,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [{
            index: 1,
            value: 131,
            diff: [10]
          }, {
            index: 2,
            value: 832,
            diff: [12]
          }, {
            index: 3,
            value: 38,
            diff: [8]
          }, {
            index: 4,
            value: 234,
            diff: [11]
          }]
        },
        bytes: [0x17, 0x0f, 0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0xc0, 0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b]
      }
    };
    var fromBytes$5 = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$5 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
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

    var id$4 = 0x60;
    var name$4 = 'lastEvent';
    var headerSize$4 = 1;
    var examples$4 = {
      'status for GASI3': {
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
        parameters: {
          sequenceNumber: 32,
          status: {
            isBatteryLow: true,
            isButtonReleased: false,
            isConnectionLost: true,
            isMagneticInfluence: false
          }
        },
        config: {
          hardwareType: GASI3
        },
        bytes: [0x62, 0x20, 0x09]
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
        bytes: [0x63, 0x10, 0xe1, 0x01]
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
        bytes: [0x63, 0x30, 0x83, 0x0a]
      }
    };
    var fromBytes$4 = function fromBytes(data, config) {
      if (!config.hardwareType) {
        throw new Error('hardwareType in config is mandatory');
      }
      var buffer = new CommandBinaryBuffer(data);
      var sequenceNumber = buffer.getUint8();
      var status = buffer.getEventStatus(config.hardwareType);
      return {
        sequenceNumber: sequenceNumber,
        status: status
      };
    };
    var toBytes$4 = function toBytes(parameters, config) {
      if (!config.hardwareType) {
        throw new Error('hardwareType in config is mandatory');
      }
      var buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
      var sequenceNumber = parameters.sequenceNumber,
        status = parameters.status;
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

    var MAGNET_ON = 1;
    var MAGNET_OFF = 2;
    var ACTIVATE = 3;
    var DEACTIVATE = 4;
    var BATTERY_ALARM = 5;
    var CAN_OFF = 6;
    var INSERT = 7;
    var REMOVE = 8;
    var COUNTER_OVER = 9;
    var ACTIVATE_MTX = 11;
    var CONNECT = 12;
    var DISCONNECT = 13;
    var OPTOLOW = 15;
    var OPTOFLASH = 16;
    var MTX = 17;
    var JOIN_ACCEPT = 18;

    var getHexFromBytes = (function (bytes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _Object$assign = Object.assign({}, hexFormatOptions, options),
        separator = _Object$assign.separator,
        prefix = _Object$assign.prefix;
      return bytes.map(function (_byte) {
        return "".concat(prefix).concat(_byte.toString(16).padStart(2, '0'));
      }).join(separator);
    });

    var getBytesFromHex = (function (hex) {
      var cleanHex = hex.replace(/\s+|0x/g, '');
      if (cleanHex.length % 2 !== 0) {
        cleanHex = "0".concat(cleanHex);
      }
      var resultLength = cleanHex.length / 2;
      var bytes = new Array(resultLength);
      for (var index = 0; index < resultLength; index++) {
        bytes[index] = parseInt(cleanHex.substring(index * 2, index * 2 + 2), 16);
      }
      return bytes;
    });

    var id$3 = 0x15;
    var name$3 = 'newEvent';
    var headerSize$3 = 2;
    var COMMAND_BODY_MAX_SIZE$1 = 14;
    var MTX_ADDRESS_SIZE = 8;
    var examples$3 = {
      'event for MAGNET_ON': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          id: 1,
          sequenceNumber: 2,
          data: {
            time2000: 734015840
          }
        },
        bytes: [0x15, 0x06, 0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60]
      },
      'event for BATTERY_ALARM': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          id: 5,
          sequenceNumber: 2,
          data: {
            voltage: 3308
          }
        },
        bytes: [0x15, 0x04, 0x05, 0x02, 0x0c, 0xec]
      },
      'event for ACTIVATE_MTX': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          id: 11,
          sequenceNumber: 2,
          data: {
            time2000: 734015840,
            deviceId: '00 1a 79 88 17 01 23 56'
          }
        },
        bytes: [0x15, 0x0e, 0x0b, 0x02, 0x2b, 0xc0, 0x31, 0x60, 0x00, 0x1a, 0x79, 0x88, 0x17, 0x01, 0x23, 0x56]
      },
      'event for CONNECT': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          id: 12,
          sequenceNumber: 2,
          data: {
            channel: 1,
            value: 131
          }
        },
        bytes: [0x15, 0x05, 0x0c, 0x02, 0x00, 0x83, 0x01]
      },
      'event for DISCONNECT': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          id: 13,
          sequenceNumber: 2,
          data: {
            channel: 1,
            value: 131
          }
        },
        bytes: [0x15, 0x05, 0x0d, 0x02, 0x00, 0x83, 0x01]
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
        bytes: [0x15, 0x04, 0x11, 0x02, 0x83, 0x0a]
      }
    };
    var getVoltage = function getVoltage(buffer) {
      return buffer.getUint16(false);
    };
    var setVoltage = function setVoltage(buffer, value) {
      return buffer.setUint16(value, false);
    };
    var getDeviceId = function getDeviceId(buffer) {
      return getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE));
    };
    var setDeviceId = function setDeviceId(buffer, value) {
      getBytesFromHex(value).forEach(function (_byte) {
        return buffer.setUint8(_byte);
      });
    };
    var fromBytes$3 = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$1) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var eventId = buffer.getUint8();
      var sequenceNumber = buffer.getUint8();
      var eventData;
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
          eventData = {
            time2000: buffer.getTime()
          };
          break;
        case BATTERY_ALARM:
          eventData = {
            voltage: getVoltage(buffer)
          };
          break;
        case ACTIVATE_MTX:
          eventData = {
            time2000: buffer.getTime(),
            deviceId: getDeviceId(buffer)
          };
          break;
        case CONNECT:
        case DISCONNECT:
          eventData = {
            channel: buffer.getUint8() + 1,
            value: buffer.getExtendedValue()
          };
          break;
        case MTX:
          eventData = {
            status: buffer.getEventStatus(MTXLORA)
          };
          break;
        default:
          throw new Error("Event ".concat(id$3, " is not supported"));
      }
      return {
        id: eventId,
        sequenceNumber: sequenceNumber,
        data: eventData
      };
    };
    var toBytes$3 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$1);
      var eventId = parameters.id,
        sequenceNumber = parameters.sequenceNumber,
        data = parameters.data;
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
          throw new Error("Event ".concat(id$3, " is not supported"));
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

    var id$2 = 0x02;
    var name$2 = 'setTime2000';
    var headerSize$2 = 2;
    var COMMAND_BODY_SIZE$1 = 1;
    var examples$2 = {
      success: {
        id: id$2,
        name: name$2,
        headerSize: headerSize$2,
        parameters: {
          status: 1
        },
        bytes: [0x02, 0x01, 0x01]
      }
    };
    var fromBytes$2 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$1) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data, false);
      var parameters = {
        status: buffer.getUint8()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    var toBytes$2 = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$1, false);
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

    var roundNumber = (function (value) {
      var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var places = Math.pow(10, decimalPlaces);
      return Math.round(value * places * (1 + Number.EPSILON)) / places;
    });

    var id$1 = 0x14;
    var name$1 = 'status';
    var headerSize$1 = 2;
    var COMMAND_BODY_MAX_SIZE = 20;
    var UNKNOWN_BATTERY_RESISTANCE = 65535;
    var UNKNOWN_BATTERY_CAPACITY = 255;
    var examples$1 = {
      'status for GASI3': {
        id: id$1,
        name: name$1,
        headerSize: headerSize$1,
        parameters: {
          software: {
            type: 2,
            version: 10
          },
          hardware: {
            type: GASI3,
            version: 1
          },
          data: {
            batteryVoltage: {
              underLowLoad: 3158,
              underHighLoad: 3522
            },
            batteryInternalResistance: 10034,
            temperature: 14,
            remainingBatteryCapacity: 41,
            lastEventSequenceNumber: 34
          }
        },
        bytes: [0x14, 0x0c, 0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22]
      },
      'status for MTX': {
        id: id$1,
        name: name$1,
        headerSize: headerSize$1,
        parameters: {
          software: {
            type: 2,
            version: 10
          },
          hardware: {
            type: MTXLORA,
            version: 1
          },
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
        bytes: [0x14, 0x14, 0x02, 0x0a, 0x07, 0x01, 0x5c, 0x11, 0x00, 0x00, 0x01, 0x02, 0x06, 0x2a, 0x53, 0x8f, 0x02, 0x05, 0x0c, 0x0a, 0x02, 0x21]
      }
    };
    var fromBytes$1 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var software = {
        type: buffer.getUint8(),
        version: buffer.getUint8()
      };
      var hardware = {
        type: buffer.getUint8(),
        version: buffer.getUint8()
      };
      var data;
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
            var statusData = {
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
            } else if (statusData.remainingBatteryCapacity !== undefined) {
              statusData.remainingBatteryCapacity = roundNumber(statusData.remainingBatteryCapacity * 100 / (UNKNOWN_BATTERY_CAPACITY - 1), 0);
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
          throw new Error("".concat(id$1, ": hardware type ").concat(hardware.type, " is not supported"));
      }
      return {
        software: software,
        hardware: hardware,
        data: data
      };
    };
    var toBytes$1 = function toBytes(parameters) {
      var software = parameters.software,
        hardware = parameters.hardware,
        data = parameters.data;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
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
            var statusData = data;
            buffer.setBatteryVoltage(statusData.batteryVoltage);
            if (statusData.batteryInternalResistance === undefined) {
              buffer.setUint16(UNKNOWN_BATTERY_RESISTANCE, false);
            } else {
              buffer.setUint16(statusData.batteryInternalResistance, false);
            }
            buffer.setUint8(statusData.temperature);
            if (statusData.remainingBatteryCapacity === undefined) {
              buffer.setUint8(UNKNOWN_BATTERY_CAPACITY);
            } else {
              buffer.setUint8((UNKNOWN_BATTERY_CAPACITY - 1) * (statusData.remainingBatteryCapacity / 100));
            }
            buffer.setUint8(statusData.lastEventSequenceNumber);
          }
          break;
        case MTXLORA:
          {
            var _statusData = data;
            buffer.setUint32(_statusData.time2000);
            buffer.setUint8(_statusData.resetReason);
            buffer.setUint8(_statusData.rssiLastDownlinkFrame);
            buffer.setUint8(_statusData.snrLastDownlinkFrame);
            buffer.setUint8(_statusData.downlinkRequestsNumber);
            buffer.setUint8(_statusData.downlinkFragmentsNumber);
            buffer.setUint8(_statusData.uplinkResponsesNumber);
            buffer.setUint8(_statusData.uplinkFragmentsNumber);
            buffer.setUint8(_statusData.signalMarginToGateway);
            buffer.setUint8(_statusData.signalMarginFromGateway);
            buffer.setUint8(_statusData.detectedGatewaysNumber);
            buffer.setUint8(_statusData.gatewayDownlinkErrorRate);
            buffer.setUint8(_statusData.lastEventSequenceNumber);
          }
          break;
        case ELIMP:
        default:
          throw new Error("".concat(id$1, ": hardware type ").concat(hardware.type, " is not supported"));
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

    var id = 0x09;
    var name = 'time2000';
    var headerSize = 2;
    var COMMAND_BODY_SIZE = 5;
    var examples = {
      'time is 2023.04.03 14:01:17 GMT': {
        id: id,
        name: name,
        headerSize: headerSize,
        parameters: {
          sequenceNumber: 77,
          time2000: 733845677
        },
        bytes: [0x09, 0x05, 0x4d, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var parameters = {
        sequenceNumber: buffer.getUint8(),
        time2000: buffer.getTime()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        time2000 = parameters.time2000;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
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

    var equal = function equal(actual, expected) {
      if (actual !== expected) {
        console.log('actual:', actual);
        console.log('expected:', expected);
        throw new Error('Assertion error!', actual, expected);
      }
    };
    var deepEqual = function deepEqual(actual, expected) {
      equal(JSON.stringify(actual), JSON.stringify(expected));
    };
    var testCommands = function testCommands(direction, commands) {
      console.log(direction);
      for (var commandName in commands) {
        var command = commands[commandName];
        var examples = command === null || command === void 0 ? void 0 : command.examples;
        if (command) {
          console.log(' *', commandName);
          for (var exampleName in examples) {
            var exampleData = examples[exampleName];
            deepEqual(command.toBytes(exampleData.parameters, exampleData.config), exampleData.bytes);
            deepEqual(command.fromBytes(exampleData.bytes.slice(command.headerSize), exampleData.config), exampleData.parameters);
          }
        }
      }
    };
    testCommands('downlink', downlink);
    testCommands('uplink', uplink);

})();
