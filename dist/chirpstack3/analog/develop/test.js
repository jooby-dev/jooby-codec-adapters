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
    if (!('EPSILON' in Number)) {
      Number.EPSILON = 2.220446049250313e-16;
    }

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

    function _arrayLikeToArray(r, a) {
      (null == a || a > r.length) && (a = r.length);
      for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
      return n;
    }
    function _arrayWithoutHoles(r) {
      if (Array.isArray(r)) return _arrayLikeToArray(r);
    }
    function _createForOfIteratorHelper(r, e) {
      var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (!t) {
        if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
          t && (r = t);
          var n = 0,
            F = function () {};
          return {
            s: F,
            n: function () {
              return n >= r.length ? {
                done: true
              } : {
                done: false,
                value: r[n++]
              };
            },
            e: function (r) {
              throw r;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var o,
        a = true,
        u = false;
      return {
        s: function () {
          t = t.call(r);
        },
        n: function () {
          var r = t.next();
          return a = r.done, r;
        },
        e: function (r) {
          u = true, o = r;
        },
        f: function () {
          try {
            a || null == t.return || t.return();
          } finally {
            if (u) throw o;
          }
        }
      };
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    function _iterableToArray(r) {
      if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _toConsumableArray(r) {
      return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r);
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _unsupportedIterableToArray(r, a) {
      if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = {}.toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
      }
    }

    var hexFormatOptions = {
      separator: ' ',
      prefix: ''
    };

    var INT8_SIZE = 1;
    var INT16_SIZE = 2;
    var INT24_SIZE = 3;
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
    var be3 = [2, 1, 0];
    var be4 = [3, 2, 1, 0];
    var le2 = [0, 1];
    var le3 = [0, 1, 2];
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
    var readUint24 = function readUint24(buffer, offset, isLittleEndian) {
      var order = isLittleEndian ? le3 : be3;
      var b0 = buffer[offset + order[0]];
      var b1 = buffer[offset + order[1]] << 8;
      var b2 = buffer[offset + order[2]] << 16;
      return b0 | b1 | b2;
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
    var writeUint24 = function writeUint24(buffer, offset, value, isLittleEndian) {
      var order = isLittleEndian ? le3 : be3;
      buffer[offset + order[0]] = value & 0xff;
      buffer[offset + order[1]] = value >>> 8 & 0xff;
      buffer[offset + order[2]] = value >>> 16 & 0xff;
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
        return result & 0x80 ? result ^ -256 : result;
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
        return result & 0x8000 ? result ^ -65536 : result;
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
      setInt24: function setInt24(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint24(this.data, this.offset, value < 0 ? value | 0x1000000 : value, isLittleEndian);
        this.offset += INT24_SIZE;
      },
      getInt24: function getInt24() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint24(this.data, this.offset, isLittleEndian);
        this.offset += INT24_SIZE;
        return result & 0x800000 ? result ^ -16777216 : result;
      },
      setUint24: function setUint24(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint24(this.data, this.offset, value, isLittleEndian);
        this.offset += INT24_SIZE;
      },
      getUint24: function getUint24() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint24(this.data, this.offset, isLittleEndian);
        this.offset += INT24_SIZE;
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
        return result & 0x80000000 ? result ^ -4294967296 : result;
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
          if (this.offset > this.data.length) {
            throw new Error("current offset ".concat(this.offset, " is outside the bounds of the buffer"));
          }
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
    var toBytes$12 = function toBytes(commandId, commandSize) {
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

    var toBytes$11 = function toBytes(commandId) {
      var commandData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var headerData = toBytes$12(commandId, commandData.length);
      return [].concat(_toConsumableArray(headerData), _toConsumableArray(commandData));
    };

    var setTime2000$3 = 0x02;
    var setParameter$3 = 0x03;
    var getParameter$3 = 0x04;
    var getArchiveHours$3 = 0x05;
    var getArchiveDays$3 = 0x06;
    var getCurrent$1 = 0x07;
    var getTime2000$1 = 0x09;
    var getArchiveEvents$3 = 0x0b;
    var correctTime2000$3 = 0x0c;
    var getStatus$1 = 0x14;
    var getCurrentMc$1 = 0x18;
    var softRestart$3 = 0x19;
    var getArchiveHoursMc$3 = 0x1a;
    var getArchiveDaysMc$3 = 0x1b;
    var dataSegment$3 = 0x1e;
    var getLmicInfo$3 = 0x21f;
    var getBatteryStatus$3 = 0x51f;
    var usWaterMeterCommand$3 = 0x71f;
    var getExAbsArchiveHoursMc$3 = 0xc1f;
    var getExAbsArchiveDaysMc$3 = 0xd1f;
    var getExAbsCurrentMc$1 = 0xf1f;
    var writeImage$3 = 0x2a1f;
    var verifyImage$3 = 0x2b1f;
    var updateRun$3 = 0x2c1f;
    var getArchiveHoursMcEx$3 = 0x301f;
    var getChannelsStatus$3 = 0x321f;
    var getChannelsTypes$3 = 0x331f;
    var getSignalQuality$1 = 0x341f;

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

    var invertObject = (function (source) {
      var target = {};
      for (var property in source) {
        var value = source[property];
        target[value] = property;
      }
      return target;
    });

    var commandNames$1 = invertObject(downlinkIds);

    var id$10 = correctTime2000$3;
    var name$10 = commandNames$1[correctTime2000$3];
    var headerSize$10 = 2;
    var COMMAND_BODY_SIZE$y = 2;
    var examples$10 = {
      'correct time 120 seconds to the past': {
        id: id$10,
        name: name$10,
        headerSize: headerSize$10,
        parameters: {
          sequenceNumber: 45,
          seconds: -120
        },
        bytes: [0x0c, 0x02, 0x2d, 0x88]
      },
      'correct time 95 seconds to the future': {
        id: id$10,
        name: name$10,
        headerSize: headerSize$10,
        parameters: {
          sequenceNumber: 46,
          seconds: 95
        },
        bytes: [0x0c, 0x02, 0x2e, 0x5f]
      }
    };
    var fromBytes$10 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$y) {
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
    var toBytes$10 = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$y, false);
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
    var extractBits = function extractBits(value, bitsNumber, startIndex) {
      return (1 << bitsNumber) - 1 & value >> startIndex - 1;
    };
    var fillBits = function fillBits(value, bitsNumber, startIndex, valueToSet) {
      var mask = (1 << bitsNumber) - 1 << startIndex - 1;
      var newValueToSet = valueToSet;
      var result = value;
      result &= ~mask;
      newValueToSet <<= startIndex - 1;
      result |= newValueToSet;
      return result;
    };

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
      var cleanHex = hex.trim();
      if (!cleanHex) {
        return [];
      }
      cleanHex = cleanHex.replace(/0x/g, '').split(/\s+/).map(function (_byte) {
        return _byte.padStart(2, '0');
      }).join('');
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

    var roundNumber = (function (value) {
      var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var places = Math.pow(10, decimalPlaces);
      return Math.round(value * places * (1 + Number.EPSILON)) / places;
    });

    var INITIAL_YEAR_TIMESTAMP = 946684800000;
    var MILLISECONDS_IN_SECONDS = 1000;
    var getDateFromTime2000 = function getDateFromTime2000(time2000) {
      return new Date(INITIAL_YEAR_TIMESTAMP + time2000 * MILLISECONDS_IN_SECONDS);
    };
    var getTime2000FromDate = function getTime2000FromDate(date) {
      return (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
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
    var US_WATER = 13;
    var NBIOT = 24;

    var REPORTING_DATA_INTERVAL = 1;
    var DAY_CHECKOUT_HOUR = 4;
    var REPORTING_DATA_TYPE = 5;
    var PRIORITY_DATA_DELIVERY_TYPE = 8;
    var ACTIVATION_METHOD = 9;
    var BATTERY_DEPASSIVATION_INFO = 10;
    var BATTERY_MINIMAL_LOAD_TIME = 11;
    var CHANNELS_CONFIG = 13;
    var RX2_CONFIG = 18;
    var ABSOLUTE_DATA = 23;
    var ABSOLUTE_DATA_ENABLE = 24;
    var SERIAL_NUMBER = 25;
    var GEOLOCATION = 26;
    var EXTRA_FRAME_INTERVAL = 28;
    var ABSOLUTE_DATA_MULTI_CHANNEL = 29;
    var ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL = 30;
    var PULSE_CHANNELS_SCAN_CONFIG = 31;
    var PULSE_CHANNELS_SET_CONFIG = 32;
    var BATTERY_DEPASSIVATION_CONFIG = 33;
    var MQTT_SESSION_CONFIG = 34;
    var MQTT_BROKER_ADDRESS = 35;
    var MQTT_SSL_ENABLE = 36;
    var MQTT_TOPIC_PREFIX = 37;
    var MQTT_DATA_RECEIVE_CONFIG = 38;
    var MQTT_DATA_SEND_CONFIG = 39;
    var NBIOT_SSL_CONFIG = 40;
    var NBIOT_SSL_CACERT_WRITE = 41;
    var NBIOT_SSL_CACERT_SET = 42;
    var NBIOT_SSL_CLIENT_CERT_WRITE = 43;
    var NBIOT_SSL_CLIENT_CERT_SET = 44;
    var NBIOT_SSL_CLIENT_KEY_WRITE = 45;
    var NBIOT_SSL_CLIENT_KEY_SET = 46;
    var NBIOT_DEVICE_SOFTWARE_UPDATE = 47;
    var NBIOT_MODULE_FIRMWARE_UPDATE = 48;
    var REPORTING_DATA_CONFIG = 49;
    var EVENTS_CONFIG = 50;
    var NBIOT_MODULE_INFO = 51;
    var NBIOT_BANDS = 52;
    var NBIOT_APN = 53;
    var NBIOT_LED_INDICATION = 54;
    var NBIOT_SIM = 55;
    var CHANNEL_TYPE = 56;
    var EXTRA_PAYLOAD_ENABLE = 57;
    var TIME_SYNCHRONIZATION_PERIOD_VIA_MAC = 58;
    var KEEP_LORA_CONNECTION_ON_REMOVAL = 59;

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

    var EMPTY_VALUE = 0xffffffff;

    var IDLE = 0;
    var POWER_CHANNEL = 2;
    var BINARY_SENSOR = 3;
    var TEMPERATURE_SENSOR = 4;

    var channelTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BINARY_SENSOR: BINARY_SENSOR,
        IDLE: IDLE,
        POWER_CHANNEL: POWER_CHANNEL,
        TEMPERATURE_SENSOR: TEMPERATURE_SENSOR
    });

    var SF12B125 = 0;
    var SF11B125 = 1;
    var SF10B125 = 2;
    var SF9B125 = 3;
    var SF8B125 = 4;
    var SF7B125 = 5;
    var SF7B250 = 6;

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

    var _parametersSizeMap, _deviceParameterConve;
    var INITIAL_YEAR = 2000;
    var MONTH_BIT_SIZE = 4;
    var DATE_BIT_SIZE = 5;
    var YEAR_START_INDEX = 1;
    var UNKNOWN_BATTERY_VOLTAGE = 4095;
    var EXTEND_BIT_MASK = 0x80;
    var LAST_BIT_INDEX = 7;
    var DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
    var PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
    var SERIAL_NUMBER_SIZE = 6;
    var MAGNETIC_INFLUENCE_BIT_INDEX = 8;
    var LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
    var LEGACY_HOUR_DIFF_SIZE = 2;
    var GAS_HARDWARE_TYPES = [GASI2, GASI3, GASI1, GASIC, NBIOT];
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
      isForthChannelInactive: Math.pow(2, 8)
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
    var usWaterMeterEventBitMask = {
      transportMode: 0x01,
      frequencyOutput: 0x02,
      reverseFlow: 0x04,
      tamperBreak: 0x08,
      leakage: 0x10,
      pipeBreak: 0x20,
      pipeEmpty: 0x40,
      batteryDischarge: 0x80
    };
    var getChannelTypeSize = function getChannelTypeSize(_ref) {
      var type = _ref.type;
      var size = 1;
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
    var parametersSizeMap = (_parametersSizeMap = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, REPORTING_DATA_INTERVAL, 1 + 4), DAY_CHECKOUT_HOUR, 1 + 1), REPORTING_DATA_TYPE, 1 + 1), PRIORITY_DATA_DELIVERY_TYPE, 1 + 1), ACTIVATION_METHOD, 1 + 1), BATTERY_DEPASSIVATION_INFO, 1 + 6), BATTERY_MINIMAL_LOAD_TIME, 1 + 4), CHANNELS_CONFIG, 1 + 1), RX2_CONFIG, 1 + 4), ABSOLUTE_DATA, 1 + 9), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, ABSOLUTE_DATA_ENABLE, 1 + 1), SERIAL_NUMBER, 1 + 6), GEOLOCATION, 1 + 10), EXTRA_FRAME_INTERVAL, 1 + 2), ABSOLUTE_DATA_MULTI_CHANNEL, 1 + 10), ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL, 1 + 2), PULSE_CHANNELS_SCAN_CONFIG, 1 + 3), PULSE_CHANNELS_SET_CONFIG, 1 + 1), BATTERY_DEPASSIVATION_CONFIG, 1 + 4), MQTT_SSL_ENABLE, 1 + 1), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, MQTT_DATA_RECEIVE_CONFIG, 1 + 3), MQTT_DATA_SEND_CONFIG, 1 + 3), NBIOT_SSL_CONFIG, 1 + 2), NBIOT_SSL_CACERT_SET, 1 + 4), NBIOT_SSL_CLIENT_CERT_SET, 1 + 4), NBIOT_SSL_CLIENT_KEY_SET, 1 + 4), REPORTING_DATA_CONFIG, 1 + 4), EVENTS_CONFIG, 1 + 3), NBIOT_LED_INDICATION, 1 + 2), NBIOT_SIM, 1 + 3), _defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, EXTRA_PAYLOAD_ENABLE, 1 + 1), TIME_SYNCHRONIZATION_PERIOD_VIA_MAC, 1 + 4), KEEP_LORA_CONNECTION_ON_REMOVAL, 1 + 1));
    var fourChannelsBitMask = {
      channel1: Math.pow(2, 0),
      channel2: Math.pow(2, 1),
      channel3: Math.pow(2, 2),
      channel4: Math.pow(2, 3)
    };
    var getChannelsMaskFromNumber = function getChannelsMaskFromNumber(value) {
      var object = toObject(fourChannelsBitMask, value);
      return {
        channel1: object.channel1,
        channel2: object.channel2,
        channel3: object.channel3,
        channel4: object.channel4
      };
    };
    var setChannelsMaskToNumber = function setChannelsMaskToNumber(channelsMask) {
      var channel1 = channelsMask.channel1,
        channel2 = channelsMask.channel2,
        channel3 = channelsMask.channel3,
        channel4 = channelsMask.channel4;
      return fromObject(fourChannelsBitMask, {
        channel1: channel1,
        channel2: channel2,
        channel3: channel3,
        channel4: channel4
      });
    };
    var getChannelsMask = function getChannelsMask(buffer) {
      return getChannelsMaskFromNumber(buffer.getUint8());
    };
    var setChannelsMask = function setChannelsMask(buffer, channelsMask) {
      return buffer.setUint8(setChannelsMaskToNumber(channelsMask));
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
    var getNbiotSslWrite = function getNbiotSslWrite(buffer) {
      return {
        size: buffer.getUint16(),
        position: buffer.getUint16(),
        chunk: buffer.getBytesLeft()
      };
    };
    var setNbiotSslWrite = function setNbiotSslWrite(buffer, parameter) {
      if (parameter.size !== parameter.chunk.length) {
        throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
      }
      buffer.setUint16(parameter.size);
      buffer.setUint16(parameter.position);
      buffer.setBytes(parameter.chunk);
    };
    var getNbiotSslSet = function getNbiotSslSet(buffer) {
      return {
        crc32: buffer.getUint32()
      };
    };
    var setNbiotSslSet = function setNbiotSslSet(buffer, parameter) {
      buffer.setUint32(parameter.crc32);
    };
    var deviceParameterConvertersMap = (_deviceParameterConve = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, REPORTING_DATA_INTERVAL, {
      get: function get(buffer) {
        return {
          specialSchedulePeriod: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT,
          firstDaysSpecialSchedule: buffer.getUint8(),
          lastDaysSpecialSchedule: buffer.getUint8(),
          period: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.specialSchedulePeriod / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
        buffer.setUint8(parameter.firstDaysSpecialSchedule);
        buffer.setUint8(parameter.lastDaysSpecialSchedule);
        buffer.setUint8(parameter.period / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
      }
    }), DAY_CHECKOUT_HOUR, {
      get: function get(buffer) {
        return {
          value: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.value);
      }
    }), REPORTING_DATA_TYPE, {
      get: function get(buffer) {
        return {
          type: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.type);
      }
    }), PRIORITY_DATA_DELIVERY_TYPE, {
      get: function get(buffer) {
        return {
          value: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.value);
      }
    }), ACTIVATION_METHOD, {
      get: function get(buffer) {
        return {
          type: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.type);
      }
    }), BATTERY_DEPASSIVATION_INFO, {
      get: function get(buffer) {
        return {
          loadTime: buffer.getUint16(),
          internalResistance: buffer.getUint16(),
          lowVoltage: buffer.getUint16()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint16(parameter.loadTime);
        buffer.setUint16(parameter.internalResistance);
        buffer.setUint16(parameter.lowVoltage);
      }
    }), BATTERY_MINIMAL_LOAD_TIME, {
      get: function get(buffer) {
        return {
          value: buffer.getUint32()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint32(parameter.value);
      }
    }), CHANNELS_CONFIG, {
      get: function get(buffer) {
        return {
          value: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        if (parameter.value < 0 || parameter.value > 18) {
          throw new Error('channels config must be between 0-18');
        }
        buffer.setUint8(parameter.value);
      }
    }), RX2_CONFIG, {
      get: function get(buffer) {
        var spreadFactor = buffer.getUint8();
        var spreadFactorName = spreadFactorNames[spreadFactor];
        var frequency = buffer.getUint24() * PARAMETER_RX2_FREQUENCY_COEFFICIENT;
        return {
          spreadFactor: spreadFactor,
          spreadFactorName: spreadFactorName,
          frequency: frequency
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.spreadFactor);
        buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT);
      }
    }), ABSOLUTE_DATA, {
      get: function get(buffer) {
        return {
          meterValue: buffer.getUint32(),
          pulseCoefficient: buffer.getPulseCoefficient(),
          value: buffer.getUint32()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint32(parameter.meterValue);
        buffer.setPulseCoefficient(parameter.pulseCoefficient);
        buffer.setUint32(parameter.value);
      }
    }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, ABSOLUTE_DATA_ENABLE, {
      get: function get(buffer) {
        return {
          state: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.state);
      }
    }), SERIAL_NUMBER, {
      get: function get(buffer) {
        return {
          value: getHexFromBytes(buffer.getBytes(SERIAL_NUMBER_SIZE))
        };
      },
      set: function set(buffer, parameter) {
        getBytesFromHex(parameter.value).forEach(function (_byte) {
          return buffer.setUint8(_byte);
        });
      }
    }), GEOLOCATION, {
      get: function get(buffer) {
        return {
          latitude: roundNumber(buffer.getFloat32()),
          longitude: roundNumber(buffer.getFloat32()),
          altitude: roundNumber(buffer.getUint16())
        };
      },
      set: function set(buffer, parameter) {
        buffer.setFloat32(roundNumber(parameter.latitude));
        buffer.setFloat32(roundNumber(parameter.longitude));
        buffer.setUint16(roundNumber(parameter.altitude));
      }
    }), EXTRA_FRAME_INTERVAL, {
      get: function get(buffer) {
        return {
          value: buffer.getUint16()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint16(parameter.value);
      }
    }), ABSOLUTE_DATA_MULTI_CHANNEL, {
      get: function get(buffer) {
        return {
          channel: buffer.getChannelValue(),
          meterValue: buffer.getUint32(),
          pulseCoefficient: buffer.getPulseCoefficient(),
          value: buffer.getUint32()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setChannelValue(parameter.channel);
        buffer.setUint32(parameter.meterValue);
        buffer.setPulseCoefficient(parameter.pulseCoefficient);
        buffer.setUint32(parameter.value);
      }
    }), ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL, {
      get: function get(buffer) {
        return {
          channel: buffer.getChannelValue(),
          state: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setChannelValue(parameter.channel);
        buffer.setUint8(parameter.state);
      }
    }), PULSE_CHANNELS_SCAN_CONFIG, {
      get: function get(buffer) {
        return {
          channelList: buffer.getChannels(),
          pullUpTime: buffer.getUint8(),
          scanTime: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        if (parameter.pullUpTime < 17) {
          throw new Error('minimal value for pullUpTime - 17');
        }
        if (parameter.scanTime < 15) {
          throw new Error('minimal value for scanTime - 15');
        }
        buffer.setChannels(parameter.channelList.map(function (index) {
          return {
            index: index
          };
        }));
        buffer.setUint8(parameter.pullUpTime);
        buffer.setUint8(parameter.scanTime);
      }
    }), PULSE_CHANNELS_SET_CONFIG, {
      get: getChannelsMask,
      set: setChannelsMask
    }), BATTERY_DEPASSIVATION_CONFIG, {
      get: function get(buffer) {
        return {
          resistanceStartThreshold: buffer.getUint16(),
          resistanceStopThreshold: buffer.getUint16()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint16(parameter.resistanceStartThreshold);
        buffer.setUint16(parameter.resistanceStopThreshold);
      }
    }), MQTT_SESSION_CONFIG, {
      get: function get(buffer) {
        return {
          clientId: buffer.getString(),
          username: buffer.getString(),
          password: buffer.getString(),
          cleanSession: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.clientId);
        buffer.setString(parameter.username);
        buffer.setString(parameter.password);
        buffer.setUint8(parameter.cleanSession);
      }
    }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, MQTT_BROKER_ADDRESS, {
      get: function get(buffer) {
        return {
          hostName: buffer.getString(),
          port: buffer.getUint16()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.hostName);
        buffer.setUint16(parameter.port);
      }
    }), MQTT_SSL_ENABLE, {
      get: function get(buffer) {
        return {
          enable: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.enable);
      }
    }), MQTT_TOPIC_PREFIX, {
      get: function get(buffer) {
        return {
          topicPrefix: buffer.getString()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.topicPrefix);
      }
    }), MQTT_DATA_RECEIVE_CONFIG, {
      get: function get(buffer) {
        return {
          qos: buffer.getUint8(),
          count: buffer.getUint8(),
          timeout: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.qos);
        buffer.setUint8(parameter.count);
        buffer.setUint8(parameter.timeout);
      }
    }), MQTT_DATA_SEND_CONFIG, {
      get: function get(buffer) {
        return {
          qos: buffer.getUint8(),
          retain: buffer.getUint8(),
          newestSendFirst: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.qos);
        buffer.setUint8(parameter.retain);
        buffer.setUint8(parameter.newestSendFirst);
      }
    }), NBIOT_SSL_CONFIG, {
      get: function get(buffer) {
        return {
          securityLevel: buffer.getUint8(),
          version: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.securityLevel);
        buffer.setUint8(parameter.version);
      }
    }), NBIOT_SSL_CACERT_WRITE, {
      get: getNbiotSslWrite,
      set: setNbiotSslWrite
    }), NBIOT_SSL_CACERT_SET, {
      get: getNbiotSslSet,
      set: setNbiotSslSet
    }), NBIOT_SSL_CLIENT_CERT_WRITE, {
      get: getNbiotSslWrite,
      set: setNbiotSslWrite
    }), NBIOT_SSL_CLIENT_CERT_SET, {
      get: getNbiotSslSet,
      set: setNbiotSslSet
    }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, NBIOT_SSL_CLIENT_KEY_WRITE, {
      get: getNbiotSslWrite,
      set: setNbiotSslWrite
    }), NBIOT_SSL_CLIENT_KEY_SET, {
      get: getNbiotSslSet,
      set: setNbiotSslSet
    }), NBIOT_DEVICE_SOFTWARE_UPDATE, {
      get: function get(buffer) {
        return {
          softwareImageUrl: buffer.getString()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.softwareImageUrl);
      }
    }), NBIOT_MODULE_FIRMWARE_UPDATE, {
      get: function get(buffer) {
        return {
          moduleFirmwareImageUrl: buffer.getString()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.moduleFirmwareImageUrl);
      }
    }), REPORTING_DATA_CONFIG, {
      get: function get(buffer) {
        return {
          dataType: buffer.getUint8(),
          hour: buffer.getUint8(),
          minutes: buffer.getUint8(),
          countToSend: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.dataType);
        buffer.setUint8(parameter.hour);
        buffer.setUint8(parameter.minutes);
        buffer.setUint8(parameter.countToSend);
      }
    }), EVENTS_CONFIG, {
      get: function get(buffer) {
        return {
          eventId: buffer.getUint8(),
          sendEvent: buffer.getUint8(),
          saveEvent: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.eventId);
        buffer.setUint8(parameter.sendEvent);
        buffer.setUint8(parameter.saveEvent);
      }
    }), NBIOT_MODULE_INFO, {
      get: function get(buffer) {
        return {
          moduleInfo: buffer.getString()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.moduleInfo);
      }
    }), NBIOT_BANDS, {
      get: function get(buffer) {
        var count = buffer.getUint8();
        var bands = [];
        for (var index = 0; index < count; index++) {
          bands.push(buffer.getUint8());
        }
        return {
          bands: bands
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.bands.length);
        var _iterator = _createForOfIteratorHelper(parameter.bands),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var band = _step.value;
            buffer.setUint8(band);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }), NBIOT_APN, {
      get: function get(buffer) {
        return {
          apn: buffer.getString()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.apn);
      }
    }), NBIOT_LED_INDICATION, {
      get: function get(buffer) {
        return {
          enableLed: buffer.getUint8(),
          enableNbiotNetworkLed: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.enableLed);
        buffer.setUint8(parameter.enableNbiotNetworkLed);
      }
    }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, NBIOT_SIM, {
      get: function get(buffer) {
        return {
          enable: buffer.getUint8(),
          pin: buffer.getUint16()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.enable);
        buffer.setUint16(parameter.pin);
      }
    }), CHANNEL_TYPE, {
      get: function get(buffer) {
        return buffer.getChannelType();
      },
      set: function set(buffer, parameter) {
        return buffer.setChannelType(parameter);
      }
    }), EXTRA_PAYLOAD_ENABLE, {
      get: function get(buffer) {
        return {
          enable: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.enable);
      }
    }), TIME_SYNCHRONIZATION_PERIOD_VIA_MAC, {
      get: function get(buffer) {
        return {
          period: buffer.getUint32()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint32(parameter.period);
      }
    }), KEEP_LORA_CONNECTION_ON_REMOVAL, {
      get: function get(buffer) {
        return {
          value: buffer.getUint8() !== 0
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.value ? 1 : 0);
      }
    }));
    var getEventStatusSize = function getEventStatusSize(hardwareType) {
      return TWO_BYTES_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ? 2 : 1;
    };
    var getParameterSize = function getParameterSize(parameter) {
      var size;
      var data;
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
    var getRequestParameterSize = function getRequestParameterSize(parameter) {
      var size;
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
    var getResponseParameterSize = function getResponseParameterSize(parameter) {
      var size;
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
    function CommandBinaryBuffer(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.getMagneticInfluenceBit = function (_byte2) {
      return !!extractBits(_byte2, 1, MAGNETIC_INFLUENCE_BIT_INDEX);
    };
    CommandBinaryBuffer.setMagneticInfluenceBit = function (_byte3, value) {
      return fillBits(_byte3, 1, MAGNETIC_INFLUENCE_BIT_INDEX, +value);
    };
    CommandBinaryBuffer.getLegacyHourCounterSize = function (hourCounter) {
      return LEGACY_HOUR_COUNTER_SIZE + hourCounter.diff.length * LEGACY_HOUR_DIFF_SIZE;
    };
    CommandBinaryBuffer.prototype.getExtendedValue = function () {
      var value = 0;
      var isByteExtended = true;
      var position = 0;
      while (isByteExtended && this.offset <= this.data.length) {
        var _byte4 = this.getUint8();
        isByteExtended = !!(_byte4 & EXTEND_BIT_MASK);
        value += (_byte4 & 0x7f) << 7 * position >>> 0;
        ++position;
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
        encodedValue >>>= 7;
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
      return this.getUint32();
    };
    CommandBinaryBuffer.prototype.setTime = function (value) {
      this.setUint32(value);
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
      [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(function (_byte5) {
        return _this2.setUint8(_byte5);
      });
    };
    CommandBinaryBuffer.prototype.getLegacyCounterValue = function () {
      return this.getUint24();
    };
    CommandBinaryBuffer.prototype.setLegacyCounterValue = function (value) {
      this.setUint24(value);
    };
    CommandBinaryBuffer.prototype.getLegacyCounter = function () {
      var _byte6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getUint8();
      var isArchiveValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var value = this.getLegacyCounterValue();
      return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(_byte6),
        value: isArchiveValue && value === EMPTY_VALUE ? 0 : value
      };
    };
    CommandBinaryBuffer.prototype.setLegacyCounter = function (counter) {
      var _byte7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var isArchiveValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(_byte7, counter.isMagneticInfluence));
      this.setLegacyCounterValue(isArchiveValue && counter.value === 0 ? EMPTY_VALUE : counter.value);
    };
    CommandBinaryBuffer.prototype.getChannels = function () {
      var channelList = [];
      var extended = true;
      var channelIndex = 1;
      while (extended) {
        var _byte8 = this.getUint8();
        var bits = _byte8.toString(2).padStart(LAST_BIT_INDEX + 1, '0').split('').reverse();
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
      var maxChannel = Math.max.apply(Math, _toConsumableArray(channelList.map(function (_ref2) {
        var index = _ref2.index;
        return index;
      })));
      var size = (maxChannel - maxChannel % 8) / 8;
      var data = new Array(size + 1).fill(0);
      var _byte9 = 0;
      data.forEach(function (_, byteIndex) {
        var channelIndex = byteIndex * LAST_BIT_INDEX + 1;
        var maxChannelIndex = channelIndex + LAST_BIT_INDEX;
        while (channelIndex < maxChannelIndex) {
          var channel = channelList.find(function (item) {
            return item.index === channelIndex;
          });
          if (channel !== undefined) {
            _byte9 |= 1 << (channel.index - 1) % LAST_BIT_INDEX;
          }
          ++channelIndex;
        }
        if (data[byteIndex + 1] !== undefined) {
          _byte9 |= 1 << LAST_BIT_INDEX;
        }
        data[byteIndex] = _byte9;
        _byte9 = 0;
      });
      data.forEach(function (value) {
        return _this3.setUint8(value);
      });
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
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiff = function () {
      var _this4 = this;
      var isArchiveValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
          value: value === isArchiveValue && EMPTY_VALUE ? 0 : value,
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
      var isArchiveValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
      this.setDate(date);
      this.setHours(hour, hours);
      this.setChannels(channelList);
      channelList.forEach(function (_ref3) {
        var value = _ref3.value,
          diff = _ref3.diff;
        _this5.setExtendedValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
        diff.forEach(function (diffValue) {
          return _this5.setExtendedValue(diffValue);
        });
      });
    };
    CommandBinaryBuffer.prototype.getHours = function () {
      var _byte10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getUint8();
      if (_byte10 === 0) {
        return {
          hours: 0,
          hour: 0
        };
      }
      var hours = ((_byte10 & 0xe0) >> 5) + 1;
      var hour = _byte10 & 0x1f;
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
      [yearMonthByte, monthDateByte].forEach(function (_byte11) {
        return _this6.setUint8(_byte11);
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
        var _byte12 = pulseCoefficientToByteMap[value];
        if (_byte12) {
          this.setUint8(_byte12);
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
      channelList.forEach(function (_ref4) {
        var value = _ref4.value,
          pulseCoefficient = _ref4.pulseCoefficient;
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
      channelList.forEach(function (_ref5) {
        var value = _ref5.value,
          diff = _ref5.diff,
          pulseCoefficient = _ref5.pulseCoefficient;
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
        status = toObject(fourChannelBitMask, this.getUint16(true));
      } else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        status = toObject(mtxBitMask, this.getUint16(true));
      } else if (hardwareType === US_WATER) {
        var event = toObject(usWaterMeterEventBitMask, this.getUint8());
        status = {
          event: event,
          error: this.getUint8()
        };
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
        this.setUint16(fromObject(fourChannelBitMask, status) | 1 << 7, true);
      } else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint16(fromObject(mtxBitMask, status), true);
      } else if (hardwareType === US_WATER) {
        var data = status;
        this.setUint8(fromObject(usWaterMeterEventBitMask, data.event));
        this.setUint8(data.error);
      } else {
        throw new Error('wrong hardwareType');
      }
    };
    CommandBinaryBuffer.prototype.getParameter = function () {
      var id = this.getUint8();
      var name = deviceParameterNames[id];
      if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
        throw new Error("parameter ".concat(id, " is not supported"));
      }
      var data = deviceParameterConvertersMap[id].get(this);
      return {
        id: id,
        name: name,
        data: data
      };
    };
    CommandBinaryBuffer.prototype.setParameter = function (parameter) {
      var id = parameter.id,
        data = parameter.data;
      if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set) {
        throw new Error("parameter ".concat(id, " is not supported"));
      }
      this.setUint8(id);
      deviceParameterConvertersMap[id].set(this, data);
    };
    CommandBinaryBuffer.prototype.getRequestParameter = function () {
      var id = this.getUint8();
      var name = deviceParameterNames[id];
      var data = null;
      switch (id) {
        case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case ABSOLUTE_DATA_MULTI_CHANNEL:
        case CHANNEL_TYPE:
          data = {
            channel: this.getChannelValue()
          };
          break;
        case REPORTING_DATA_CONFIG:
          data = {
            dataType: this.getUint8()
          };
          break;
        case EVENTS_CONFIG:
          data = {
            eventId: this.getUint8()
          };
          break;
      }
      return {
        id: id,
        name: name,
        data: data
      };
    };
    CommandBinaryBuffer.prototype.setRequestParameter = function (parameter) {
      var id = parameter.id,
        parameterData = parameter.data;
      var data;
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
      var id = this.getUint8();
      var name = deviceParameterNames[id];
      var data;
      if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
        throw new Error("parameter ".concat(id, " is not supported"));
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
      return {
        id: id,
        name: name,
        data: data
      };
    };
    CommandBinaryBuffer.prototype.setResponseParameter = function (parameter) {
      var id = parameter.id,
        data = parameter.data;
      if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set) {
        throw new Error("parameter ".concat(id, " is not supported"));
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
      var stateWithValueByte = this.getUint8();
      var valueLowerByte = this.getUint8();
      return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(stateWithValueByte),
        value: (stateWithValueByte & 0x1f) << 8 | valueLowerByte
      };
    };
    CommandBinaryBuffer.prototype.setLegacyHourDiff = function (diff) {
      var _this11 = this;
      var bytes = [diff.value >> 8, diff.value & 0xff];
      bytes[0] = CommandBinaryBuffer.setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);
      bytes.forEach(function (_byte13) {
        return _this11.setUint8(_byte13);
      });
    };
    CommandBinaryBuffer.prototype.getLegacyHourCounterWithDiff = function () {
      var isArchiveValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var date = this.getDate();
      var _byte14 = this.getUint8();
      var _this$getHours2 = this.getHours(_byte14),
        hour = _this$getHours2.hour;
      var value = this.getLegacyCounterValue();
      var counter = {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(_byte14),
        value: isArchiveValue && value === EMPTY_VALUE ? 0 : value
      };
      var diff = [];
      while (this.offset < this.data.length) {
        diff.push(this.getLegacyHourDiff());
      }
      date.setUTCHours(hour);
      return {
        startTime2000: getTime2000FromDate(date),
        counter: counter,
        diff: diff
      };
    };
    CommandBinaryBuffer.prototype.setLegacyHourCounterWithDiff = function (hourCounter) {
      var _this12 = this;
      var isArchiveValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var date = getDateFromTime2000(hourCounter.startTime2000);
      var hour = date.getUTCHours();
      var value = hourCounter.counter.value;
      this.setDate(date);
      this.setHours(hour, 1);
      this.seek(this.offset - 1);
      var _byte15 = this.getUint8();
      this.seek(this.offset - 1);
      this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(_byte15, hourCounter.counter.isMagneticInfluence));
      this.setLegacyCounterValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
      hourCounter.diff.forEach(function (diffItem) {
        return _this12.setLegacyHourDiff(diffItem);
      });
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiffExtended = function () {
      var _this13 = this;
      var isArchiveValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var date = this.getDate();
      var hour = this.getUint8();
      var hours = this.getUint8();
      var channels = this.getChannels();
      var channelList = [];
      date.setUTCHours(hour);
      channels.forEach(function (channelIndex) {
        var diff = [];
        var value = _this13.getExtendedValue();
        for (var diffHour = 0; diffHour < hours; ++diffHour) {
          diff.push(_this13.getExtendedValue());
        }
        channelList.push({
          value: value === isArchiveValue && EMPTY_VALUE ? 0 : value,
          diff: diff,
          index: channelIndex
        });
      });
      return {
        startTime2000: getTime2000FromDate(date),
        hour: hour,
        hours: hours,
        channelList: channelList
      };
    };
    CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiffExtended = function (parameters) {
      var _this14 = this;
      var isArchiveValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var date = getDateFromTime2000(parameters.startTime2000);
      this.setDate(date);
      this.setUint8(parameters.hour);
      this.setUint8(parameters.hours);
      this.setChannels(parameters.channelList);
      parameters.channelList.forEach(function (_ref6) {
        var value = _ref6.value,
          diff = _ref6.diff;
        _this14.setExtendedValue(isArchiveValue && value === 0 ? EMPTY_VALUE : value);
        diff.forEach(function (diffValue) {
          return _this14.setExtendedValue(diffValue);
        });
      });
    };
    CommandBinaryBuffer.prototype.getDataSegment = function () {
      var segmentationSessionId = this.getUint8();
      var flag = this.getUint8();
      return {
        segmentationSessionId: segmentationSessionId,
        segmentIndex: extractBits(flag, 3, 1),
        segmentsNumber: extractBits(flag, 3, 5),
        isLast: Boolean(extractBits(flag, 1, 8)),
        data: this.getBytesLeft()
      };
    };
    CommandBinaryBuffer.prototype.setDataSegment = function (parameters) {
      var flag = fillBits(0, 3, 1, parameters.segmentIndex);
      flag = fillBits(flag, 3, 5, parameters.segmentsNumber);
      flag = fillBits(flag, 1, 8, +parameters.isLast);
      this.setUint8(parameters.segmentationSessionId);
      this.setUint8(flag);
      this.setBytes(parameters.data);
    };
    CommandBinaryBuffer.prototype.getBinarySensor = function () {
      var activeStateTimeMs = this.getUint16();
      return {
        activeStateTimeMs: activeStateTimeMs
      };
    };
    CommandBinaryBuffer.prototype.setBinarySensor = function (parameters) {
      this.setUint16(parameters.activeStateTimeMs);
    };
    CommandBinaryBuffer.prototype.getTemperatureSensor = function () {
      var measurementPeriod = this.getUint16();
      var hysteresisSec = this.getUint8();
      var highTemperatureThreshold = this.getInt8();
      var lowTemperatureThreshold = this.getInt8();
      return {
        measurementPeriod: measurementPeriod,
        hysteresisSec: hysteresisSec,
        highTemperatureThreshold: highTemperatureThreshold,
        lowTemperatureThreshold: lowTemperatureThreshold
      };
    };
    CommandBinaryBuffer.prototype.setTemperatureSensor = function (parameters) {
      this.setInt16(parameters.measurementPeriod);
      this.setInt8(parameters.hysteresisSec);
      this.setInt8(parameters.highTemperatureThreshold);
      this.setInt8(parameters.lowTemperatureThreshold);
    };
    CommandBinaryBuffer.prototype.getChannelType = function () {
      var channel = this.getChannelValue();
      var type = this.getUint8();
      var parameters = {};
      switch (type) {
        case BINARY_SENSOR:
          parameters = this.getBinarySensor();
          break;
        case TEMPERATURE_SENSOR:
          parameters = this.getTemperatureSensor();
          break;
      }
      return {
        channel: channel,
        type: type,
        parameters: parameters
      };
    };
    CommandBinaryBuffer.prototype.setChannelType = function (_ref7) {
      var type = _ref7.type,
        channel = _ref7.channel,
        parameters = _ref7.parameters;
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

    var HEX = 1;

    var getBase64FromBytes = (function (bytes) {
      return btoa(bytes.map(function (_byte) {
        return String.fromCharCode(_byte);
      }).join(''));
    });

    var defaultFormatOptions = {
      bytesConversionFormat: HEX,
      bytesConversionFormatOptions: {}
    };
    var getStringFromBytes = function getStringFromBytes(bytes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFormatOptions;
      var _options$bytesConvers = options.bytesConversionFormat,
        bytesConversionFormat = _options$bytesConvers === void 0 ? defaultFormatOptions.bytesConversionFormat : _options$bytesConvers,
        _options$bytesConvers2 = options.bytesConversionFormatOptions,
        bytesConversionFormatOptions = _options$bytesConvers2 === void 0 ? defaultFormatOptions.bytesConversionFormatOptions : _options$bytesConvers2;
      return bytesConversionFormat === HEX ? getHexFromBytes(bytes, bytesConversionFormatOptions) : getBase64FromBytes(bytes);
    };

    var id$$ = dataSegment$3;
    var name$$ = commandNames$1[dataSegment$3];
    var headerSize$$ = 2;
    var COMMAND_BODY_MIN_SIZE$3 = 2;
    var examples$$ = {
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
        bytes: [0x1e, 0x07, 0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04]
      }
    };
    var fromBytes$$ = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getDataSegment();
    };
    var toBytes$$ = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$3 + parameters.data.length);
      buffer.setDataSegment(parameters);
      return toBytes$11(id$$, buffer.data);
    };
    var toJson$1 = function toJson(parameters, options) {
      return JSON.stringify(_objectSpread2(_objectSpread2({}, parameters), {}, {
        data: getStringFromBytes(parameters.data, options)
      }));
    };

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

    var id$_ = getArchiveDays$3;
    var name$_ = commandNames$1[getArchiveDays$3];
    var headerSize$_ = 2;
    var COMMAND_BODY_SIZE$x = 3;
    var examples$_ = {
      '1 day counter from 2023.03.10 00:00:00 GMT': {
        id: id$_,
        name: name$_,
        headerSize: headerSize$_,
        parameters: {
          startTime2000: 731721600,
          days: 1
        },
        bytes: [0x06, 0x03, 0x2e, 0x6a, 0x01]
      }
    };
    var fromBytes$_ = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$x) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var days = buffer.getUint8();
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: getTime2000FromDate(date),
        days: days
      };
    };
    var toBytes$_ = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$x);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days;
      var date = getDateFromTime2000(startTime2000);
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

    var id$Z = getArchiveDaysMc$3;
    var name$Z = commandNames$1[getArchiveDaysMc$3];
    var headerSize$Z = 2;
    var COMMAND_BODY_SIZE$w = 4;
    var examples$Z = {
      '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
        id: id$Z,
        name: name$Z,
        headerSize: headerSize$Z,
        parameters: {
          startTime2000: 731721600,
          days: 1,
          channelList: [1]
        },
        bytes: [0x1b, 0x04, 0x2e, 0x6a, 0x01, 0x01]
      }
    };
    var fromBytes$Z = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$w) {
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
    var toBytes$Z = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$w);
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

    var id$Y = getArchiveEvents$3;
    var name$Y = commandNames$1[getArchiveEvents$3];
    var headerSize$Y = 2;
    var COMMAND_BODY_SIZE$v = 5;
    var examples$Y = {
      'request 4 events from 2023.04.03 14:01:17 GMT': {
        id: id$Y,
        name: name$Y,
        headerSize: headerSize$Y,
        parameters: {
          startTime2000: 733845677,
          events: 4
        },
        bytes: [0x0b, 0x05, 0x2b, 0xbd, 0x98, 0xad, 0x04]
      }
    };
    var fromBytes$Y = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$v) {
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
    var toBytes$Y = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        events = parameters.events;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$v);
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

    var id$X = getArchiveHours$3;
    var name$X = commandNames$1[getArchiveHours$3];
    var headerSize$X = 2;
    var COMMAND_BODY_SIZE$u = 4;
    var examples$X = {
      '2 hours counter from 2023.12.23 12:00:00 GMT': {
        id: id$X,
        name: name$X,
        headerSize: headerSize$X,
        parameters: {
          startTime2000: 756648000,
          hours: 2
        },
        bytes: [0x05, 0x04, 0x2f, 0x97, 0x0c, 0x02]
      }
    };
    var fromBytes$X = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$u) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var _buffer$getHours = buffer.getHours(),
        hour = _buffer$getHours.hour;
      var hours = buffer.getUint8();
      date.setUTCHours(hour);
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: getTime2000FromDate(date),
        hours: hours
      };
    };
    var toBytes$X = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$u);
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
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

    var id$W = getArchiveHoursMc$3;
    var name$W = commandNames$1[getArchiveHoursMc$3];
    var headerSize$W = 2;
    var COMMAND_BODY_SIZE$t = 4;
    var examples$W = {
      'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$W,
        name: name$W,
        headerSize: headerSize$W,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [1]
        },
        bytes: [0x1a, 0x04, 0x2f, 0x97, 0x2c, 0x01]
      }
    };
    var fromBytes$W = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$t) {
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
    var toBytes$W = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$t);
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

    var id$V = getArchiveHoursMcEx$3;
    var name$V = commandNames$1[getArchiveHoursMcEx$3];
    var headerSize$V = 3;
    var COMMAND_BODY_SIZE$s = 5;
    var examples$V = {
      '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$V,
        name: name$V,
        headerSize: headerSize$V,
        parameters: {
          startTime2000: 756648000,
          hour: 12,
          hours: 2,
          channelList: [1]
        },
        bytes: [0x1f, 0x30, 0x05, 0x2f, 0x97, 0x0c, 0x02, 0x01]
      }
    };
    var fromBytes$V = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var hour = buffer.getUint8();
      var hours = buffer.getUint8();
      var channelList = buffer.getChannels();
      date.setUTCHours(hour);
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return {
        startTime2000: getTime2000FromDate(date),
        hour: hour,
        hours: hours,
        channelList: channelList
      };
    };
    var toBytes$V = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$s);
      var channelList = parameters.channelList,
        hour = parameters.hour,
        hours = parameters.hours,
        startTime2000 = parameters.startTime2000;
      var date = getDateFromTime2000(startTime2000);
      buffer.setDate(date);
      buffer.setUint8(hour);
      buffer.setUint8(hours);
      buffer.setChannels(channelList.map(function (index) {
        return {
          index: index
        };
      }));
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

    var id$U = getBatteryStatus$3;
    var name$U = commandNames$1[getBatteryStatus$3];
    var headerSize$U = 3;
    var COMMAND_BODY_SIZE$r = 0;
    var examples$U = {
      'simple request': {
        id: id$U,
        name: name$U,
        headerSize: headerSize$U,
        parameters: {},
        bytes: [0x1f, 0x05, 0x00]
      }
    };
    var fromBytes$U = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$r) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$U = function toBytes() {
      return toBytes$11(id$U);
    };

    var getBatteryStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$U,
        fromBytes: fromBytes$U,
        headerSize: headerSize$U,
        id: id$U,
        name: name$U,
        toBytes: toBytes$U
    });

    var id$T = getChannelsStatus$3;
    var name$T = commandNames$1[getChannelsStatus$3];
    var headerSize$T = 3;
    var examples$T = {
      'request the status of all channels': {
        id: id$T,
        name: name$T,
        headerSize: headerSize$T,
        parameters: {},
        bytes: [0x1f, 0x32, 0x00]
      },
      'request the status of the subsystems assigned to channels 0 and 1': {
        id: id$T,
        name: name$T,
        headerSize: headerSize$T,
        parameters: {
          channel1: true,
          channel2: true,
          channel3: false,
          channel4: false
        },
        bytes: [0x1f, 0x32, 0x01, 0x03]
      }
    };
    var fromBytes$T = function fromBytes(data) {
      return data.length === 0 ? {} : getChannelsMaskFromNumber(data[0]);
    };
    var toBytes$T = function toBytes(parameters) {
      return toBytes$11(id$T, Object.keys(parameters).length !== 0 ? [setChannelsMaskToNumber(parameters)] : []);
    };

    var getChannelsStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$T,
        id: id$T,
        name: name$T,
        toBytes: toBytes$T
    });

    var id$S = getChannelsTypes$3;
    var name$S = commandNames$1[getChannelsTypes$3];
    var headerSize$S = 3;
    var COMMAND_BODY_SIZE$q = 0;
    var examples$S = {
      'request the channels map': {
        id: id$S,
        name: name$S,
        headerSize: headerSize$S,
        parameters: {},
        bytes: [0x1f, 0x33, 0x00]
      }
    };
    var fromBytes$S = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$q) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$S = function toBytes() {
      return toBytes$11(id$S);
    };

    var getChannelsTypes$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        name: name$S,
        toBytes: toBytes$S
    });

    var id$R = getCurrent$1;
    var name$R = commandNames$1[getCurrent$1];
    var headerSize$R = 2;
    var COMMAND_BODY_SIZE$p = 0;
    var examples$R = {
      'simple request': {
        id: id$R,
        headerSize: headerSize$R,
        name: name$R,
        parameters: {},
        bytes: [0x07, 0x00]
      }
    };
    var fromBytes$R = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$p) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$R = function toBytes() {
      return toBytes$11(id$R);
    };

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$R,
        id: id$R,
        name: name$R,
        toBytes: toBytes$R
    });

    var id$Q = getCurrentMc$1;
    var name$Q = commandNames$1[getCurrentMc$1];
    var headerSize$Q = 2;
    var COMMAND_BODY_SIZE$o = 0;
    var examples$Q = {
      'simple request': {
        id: id$Q,
        name: name$Q,
        headerSize: headerSize$Q,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$Q = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$o) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$Q = function toBytes() {
      return toBytes$11(id$Q);
    };

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$Q,
        fromBytes: fromBytes$Q,
        headerSize: headerSize$Q,
        id: id$Q,
        name: name$Q,
        toBytes: toBytes$Q
    });

    var id$P = getExAbsArchiveDaysMc$3;
    var name$P = commandNames$1[getExAbsArchiveDaysMc$3];
    var headerSize$P = 3;
    var COMMAND_BODY_SIZE$n = 4;
    var examples$P = {
      '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        parameters: {
          startTime2000: 756691200,
          days: 1,
          channelList: [1]
        },
        bytes: [0x1f, 0x0d, 0x04, 0x2f, 0x98, 0x01, 0x01]
      }
    };
    var fromBytes$P = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$n) {
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
    var toBytes$P = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$n);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days,
        channelList = parameters.channelList;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList.map(function (index) {
        return {
          index: index
        };
      }));
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

    var id$O = getExAbsArchiveHoursMc$3;
    var name$O = commandNames$1[getExAbsArchiveHoursMc$3];
    var headerSize$O = 3;
    var COMMAND_BODY_SIZE$m = 4;
    var examples$O = {
      '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$O,
        name: name$O,
        headerSize: headerSize$O,
        parameters: {
          channelList: [1],
          hours: 1,
          startTime2000: 756648000
        },
        bytes: [0x1f, 0x0c, 0x04, 0x2f, 0x97, 0x0c, 0x01]
      }
    };
    var fromBytes$O = function fromBytes(data) {
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
        channelList: channelList,
        hours: hours,
        startTime2000: getTime2000FromDate(date)
      };
    };
    var toBytes$O = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$m);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
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

    var id$N = getExAbsCurrentMc$1;
    var name$N = commandNames$1[getExAbsCurrentMc$1];
    var headerSize$N = 3;
    var COMMAND_BODY_SIZE$l = 0;
    var examples$N = {
      'simple request': {
        id: id$N,
        name: name$N,
        headerSize: headerSize$N,
        parameters: {},
        bytes: [0x1f, 0x0f, 0x00]
      }
    };
    var fromBytes$N = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$l) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$N = function toBytes() {
      return toBytes$11(id$N);
    };

    var getExAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$N,
        fromBytes: fromBytes$N,
        headerSize: headerSize$N,
        id: id$N,
        name: name$N,
        toBytes: toBytes$N
    });

    var id$M = getLmicInfo$3;
    var name$M = commandNames$1[getLmicInfo$3];
    var headerSize$M = 3;
    var COMMAND_BODY_SIZE$k = 0;
    var examples$M = {
      'simple request': {
        id: id$M,
        name: name$M,
        headerSize: headerSize$M,
        parameters: {},
        bytes: [0x1f, 0x02, 0x00]
      }
    };
    var fromBytes$M = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$k) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$M = function toBytes() {
      return toBytes$11(id$M);
    };

    var getLmicInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$M,
        id: id$M,
        name: name$M,
        toBytes: toBytes$M
    });

    var id$L = getParameter$3;
    var name$L = commandNames$1[getParameter$3];
    var headerSize$L = 2;
    var examples$L = {
      'request absolute data (not multichannel device)': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 23,
          name: 'ABSOLUTE_DATA',
          data: null
        },
        bytes: [0x04, 0x01, 0x17]
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
        bytes: [0x04, 0x01, 0x18]
      },
      'request for state of absolute for multichannel device (1 channel)': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 29,
          name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
          data: {
            channel: 1
          }
        },
        bytes: [0x04, 0x02, 0x1d, 0x00]
      },
      'request for state of absolute data for multichannel device (1 channel)': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 30,
          name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
          data: {
            channel: 1
          }
        },
        bytes: [0x04, 0x02, 0x1e, 0x00]
      },
      'request for configuration for specific reporting data type': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 49,
          name: 'REPORTING_DATA_CONFIG',
          data: {
            dataType: 0
          }
        },
        bytes: [0x04, 0x02, 0x31, 0x00]
      },
      'request for configuration for specific event id': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 50,
          name: 'EVENTS_CONFIG',
          data: {
            eventId: 1
          }
        },
        bytes: [0x04, 0x02, 0x32, 0x01]
      },
      'get channel settings. channel: 2': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        parameters: {
          id: 56,
          name: 'CHANNEL_TYPE',
          data: {
            channel: 2
          }
        },
        bytes: [0x04, 0x02, 0x38, 0x01]
      }
    };
    var fromBytes$L = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getRequestParameter();
    };
    var toBytes$L = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getRequestParameterSize(parameters));
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

    var id$K = getSignalQuality$1;
    var name$K = commandNames$1[getSignalQuality$1];
    var headerSize$K = 3;
    var COMMAND_BODY_SIZE$j = 0;
    var examples$K = {
      'simple request': {
        id: id$K,
        name: name$K,
        headerSize: headerSize$K,
        parameters: {},
        bytes: [0x1f, 0x34, 0x00]
      }
    };
    var fromBytes$K = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$j) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$K = function toBytes() {
      return toBytes$11(id$K, []);
    };

    var getSignalQuality = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        name: name$K,
        toBytes: toBytes$K
    });

    var id$J = getStatus$1;
    var name$J = commandNames$1[getStatus$1];
    var headerSize$J = 2;
    var COMMAND_BODY_SIZE$i = 0;
    var examples$J = {
      'simple request': {
        id: id$J,
        name: name$J,
        headerSize: headerSize$J,
        parameters: {},
        bytes: [0x14, 0x00]
      }
    };
    var fromBytes$J = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$i) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$J = function toBytes() {
      return toBytes$11(id$J);
    };

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$J,
        id: id$J,
        name: name$J,
        toBytes: toBytes$J
    });

    var id$I = getTime2000$1;
    var name$I = commandNames$1[getTime2000$1];
    var headerSize$I = 2;
    var COMMAND_BODY_SIZE$h = 0;
    var examples$I = {
      'simple request': {
        id: id$I,
        name: name$I,
        headerSize: headerSize$I,
        parameters: {},
        bytes: [0x09, 0x00]
      }
    };
    var fromBytes$I = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$h) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$I = function toBytes() {
      return toBytes$11(id$I, []);
    };

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$I,
        id: id$I,
        name: name$I,
        toBytes: toBytes$I
    });

    var id$H = setParameter$3;
    var name$H = commandNames$1[setParameter$3];
    var headerSize$H = 2;
    var examples$H = {
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
        bytes: [0x03, 0x05, 0x01, 0x00, 0x00, 0x00, 0x06]
      },
      'set day checkout hour to 12:00': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 4,
          name: 'DAY_CHECKOUT_HOUR',
          data: {
            value: 12
          }
        },
        bytes: [0x03, 0x02, 0x04, 0x0c]
      },
      'set reporting data type to "day"': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 5,
          name: 'REPORTING_DATA_TYPE',
          data: {
            type: 1
          }
        },
        bytes: [0x03, 0x02, 0x05, 0x01]
      },
      'set "with confirmation" for delivery of priority data': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 8,
          name: 'PRIORITY_DATA_DELIVERY_TYPE',
          data: {
            value: 0
          }
        },
        bytes: [0x03, 0x02, 0x08, 0x00]
      },
      'set activation method to "ABP"': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 9,
          name: 'ACTIVATION_METHOD',
          data: {
            type: 1
          }
        },
        bytes: [0x03, 0x02, 0x09, 0x01]
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
        bytes: [0x03, 0x07, 0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9]
      },
      'set battery minimal load time to "100"': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 11,
          name: 'BATTERY_MINIMAL_LOAD_TIME',
          data: {
            value: 100
          }
        },
        bytes: [0x03, 0x05, 0x0b, 0x00, 0x00, 0x00, 0x64]
      },
      'enable 1-4 channels, and disable serial channel for device': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 13,
          name: 'CHANNELS_CONFIG',
          data: {
            value: 0
          }
        },
        bytes: [0x03, 0x02, 0x0d, 0x00]
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
        bytes: [0x03, 0x05, 0x12, 0x05, 0x00, 0x00, 0xc8]
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
        bytes: [0x03, 0x0a, 0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7]
      },
      'enable absolute data (not multichannel device)': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 24,
          name: 'ABSOLUTE_DATA_ENABLE',
          data: {
            state: 1
          }
        },
        bytes: [0x03, 0x02, 0x18, 0x01]
      },
      'set device serial number': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 25,
          name: 'SERIAL_NUMBER',
          data: {
            value: '1b 0a 3e dc 3e 22'
          }
        },
        bytes: [0x03, 0x07, 0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22]
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
        bytes: [0x03, 0x0b, 0x1a, 0x42, 0x09, 0xb8, 0x52, 0x42, 0x2d, 0xb8, 0x52, 0x00, 0x17]
      },
      'set interval to send EXTRA FRAME': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 28,
          name: 'EXTRA_FRAME_INTERVAL',
          data: {
            value: 3600
          }
        },
        bytes: [0x03, 0x03, 0x1c, 0x0e, 0x10]
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
        bytes: [0x03, 0x0b, 0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0]
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
        bytes: [0x03, 0x03, 0x1e, 0x01, 0x01]
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
        bytes: [0x03, 0x04, 0x1f, 0x09, 0x12, 0x17]
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
        bytes: [0x03, 0x02, 0x20, 0x03]
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
        bytes: [0x03, 0x05, 0x21, 0x8c, 0xa0, 0x65, 0x90]
      },
      'set nbiot bands': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 52,
          name: 'NBIOT_BANDS',
          data: {
            bands: [3, 8, 20]
          }
        },
        bytes: [0x03, 0x05, 0x34, 0x03, 0x03, 0x08, 0x14]
      },
      'set nbiot apn': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 53,
          name: 'NBIOT_APN',
          data: {
            apn: 'nbiot'
          }
        },
        bytes: [0x03, 0x07, 0x35, 0x05, 0x6e, 0x62, 0x69, 0x6f, 0x74]
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
        bytes: [0x03, 0x03, 0x36, 0x01, 0x01]
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
        bytes: [0x03, 0x04, 0x37, 0x01, 0x27, 0x0f]
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
        bytes: [0x03, 0x03, 0x38, 0x00, 0x02]
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
        bytes: [0x03, 0x05, 0x38, 0x01, 0x03, 0x13, 0x88]
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
        bytes: [0x03, 0x08, 0x38, 0x02, 0x04, 0x0e, 0x10, 0x02, 0x28, 0x05]
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
        bytes: [0x03, 0x03, 0x38, 0x03, 0x00]
      },
      'enable extra payload with signal quality on every uplink command': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          id: 57,
          name: 'EXTRA_PAYLOAD_ENABLE',
          data: {
            enable: 1
          }
        },
        bytes: [0x03, 0x02, 0x39, 0x01]
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
        bytes: [0x03, 0x05, 0x3a, 0x00, 0x00, 0x05, 0xa0]
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
        bytes: [0x03, 0x02, 0x3b, 0x01]
      }
    };
    var fromBytes$H = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getParameter();
    };
    var toBytes$H = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getParameterSize(parameters));
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

    var id$G = setTime2000$3;
    var name$G = commandNames$1[setTime2000$3];
    var headerSize$G = 2;
    var COMMAND_BODY_SIZE$g = 5;
    var examples$G = {
      'set time to 2023.04.03 14:01:17 GMT': {
        id: id$G,
        headerSize: headerSize$G,
        parameters: {
          sequenceNumber: 78,
          seconds: 733845677
        },
        bytes: [0x02, 0x05, 0x4e, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes$G = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$g) {
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
    var toBytes$G = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$g, false);
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

    var id$F = softRestart$3;
    var name$F = commandNames$1[softRestart$3];
    var headerSize$F = 2;
    var COMMAND_BODY_SIZE$f = 0;
    var examples$F = {
      'simple request': {
        id: id$F,
        name: name$F,
        headerSize: headerSize$F,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$F = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$f) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$F = function toBytes() {
      return toBytes$11(id$F);
    };

    var softRestart$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$F,
        id: id$F,
        name: name$F,
        toBytes: toBytes$F
    });

    var id$E = updateRun$3;
    var name$E = commandNames$1[updateRun$3];
    var headerSize$E = 3;
    var COMMAND_BODY_SIZE$e = 0;
    var examples$E = {
      'simple request': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {},
        bytes: [0x1f, 0x2c, 0x00]
      }
    };
    var fromBytes$E = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$e) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$E = function toBytes() {
      return toBytes$11(id$E);
    };

    var updateRun$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$E,
        fromBytes: fromBytes$E,
        headerSize: headerSize$E,
        id: id$E,
        name: name$E,
        toBytes: toBytes$E
    });

    var id$D = usWaterMeterCommand$3;
    var name$D = commandNames$1[usWaterMeterCommand$3];
    var headerSize$D = 3;
    var examples$D = {
      'request for current values': {
        id: id$D,
        headerSize: headerSize$D,
        parameters: {
          length: 3,
          data: [0x21, 0x02]
        },
        bytes: [0x1f, 0x07, 0x03, 0x03, 0x21, 0x02]
      }
    };
    var fromBytes$D = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var length = buffer.getUint8();
      return {
        length: length,
        data: data.slice(1)
      };
    };
    var toBytes$D = function toBytes(parameters) {
      var data = parameters.data,
        length = parameters.length;
      var buffer = new CommandBinaryBuffer(length);
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

    var id$C = verifyImage$3;
    var name$C = commandNames$1[verifyImage$3];
    var headerSize$C = 3;
    var COMMAND_BODY_SIZE$d = 0;
    var examples$C = {
      'simple request': {
        id: id$C,
        name: name$C,
        headerSize: headerSize$C,
        parameters: {},
        bytes: [0x1f, 0x2b, 0x00]
      }
    };
    var fromBytes$C = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$d) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$C = function toBytes() {
      return toBytes$11(id$C);
    };

    var verifyImage$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        name: name$C,
        toBytes: toBytes$C
    });

    var id$B = writeImage$3;
    var name$B = commandNames$1[writeImage$3];
    var headerSize$B = 3;
    var COMMAND_BODY_MIN_SIZE$2 = 4;
    var examples$B = {
      'write image': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          offset: 64,
          data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
        },
        bytes: [0x1f, 0x2a, 0x14, 0x00, 0x00, 0x00, 0x40, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
      }
    };
    var fromBytes$B = function fromBytes(data) {
      if (data.length < COMMAND_BODY_MIN_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var offset = buffer.getUint32();
      return {
        offset: offset,
        data: data.slice(COMMAND_BODY_MIN_SIZE$2)
      };
    };
    var toBytes$B = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$2);
      buffer.setUint32(parameters.offset);
      buffer.setBytes(parameters.data);
      return toBytes$11(id$B, buffer.data);
    };
    var toJson = function toJson(parameters) {
      return JSON.stringify(parameters);
    };

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

    var setTime2000$1 = 0x02;
    var setParameter$1 = 0x03;
    var getParameter$1 = 0x04;
    var getArchiveHours$1 = 0x05;
    var getArchiveDays$1 = 0x06;
    var current$1 = 0x07;
    var time2000$1 = 0x09;
    var getArchiveEvents$1 = 0x0b;
    var correctTime2000$1 = 0x0c;
    var status$1 = 0x14;
    var newEvent$1 = 0x15;
    var dayMc$1 = 0x16;
    var hourMc$1 = 0x17;
    var currentMc$1 = 0x18;
    var softRestart$1 = 0x19;
    var getArchiveHoursMc$1 = 0x1a;
    var getArchiveDaysMc$1 = 0x1b;
    var dataSegment$1 = 0x1e;
    var day$1 = 0x20;
    var hour$1 = 0x40;
    var lastEvent$1 = 0x60;
    var getLmicInfo$1 = 0x21f;
    var getBatteryStatus$1 = 0x51f;
    var usWaterMeterCommand$1 = 0x71f;
    var exAbsHourMc$1 = 0xa1f;
    var exAbsDayMc$1 = 0xb1f;
    var getExAbsArchiveHoursMc$1 = 0xc1f;
    var getExAbsArchiveDaysMc$1 = 0xd1f;
    var exAbsCurrentMc$1 = 0xf1f;
    var usWaterMeterBatteryStatus$1 = 0x141f;
    var writeImage$1 = 0x2a1f;
    var verifyImage$1 = 0x2b1f;
    var updateRun$1 = 0x2c1f;
    var getArchiveHoursMcEx$1 = 0x301f;
    var hourMcEx$1 = 0x311f;
    var getChannelsStatus$1 = 0x321f;
    var getChannelsTypes$1 = 0x331f;
    var signalQuality$1 = 0x341f;

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

    var id$A = correctTime2000$1;
    var name$A = commandNames[correctTime2000$1];
    var headerSize$A = 2;
    var COMMAND_BODY_SIZE$c = 1;
    var examples$A = {
      'time correction failure': {
        id: id$A,
        name: name$A,
        headerSize: headerSize$A,
        parameters: {
          status: 0
        },
        bytes: [0x0c, 0x01, 0x00]
      },
      'time correction success': {
        id: id$A,
        name: name$A,
        headerSize: headerSize$A,
        parameters: {
          status: 1
        },
        bytes: [0x0c, 0x01, 0x01]
      }
    };
    var fromBytes$A = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$c) {
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
    var toBytes$A = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$c, false);
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

    var id$z = current$1;
    var name$z = commandNames[current$1];
    var headerSize$z = 2;
    var COMMAND_BODY_MAX_SIZE$e = 4;
    var examples$z = {
      'simple response channels': {
        id: id$z,
        name: name$z,
        headerSize: headerSize$z,
        parameters: {
          isMagneticInfluence: true,
          value: 342
        },
        bytes: [0x07, 0x04, 0x80, 0x00, 0x01, 0x56]
      }
    };
    var fromBytes$z = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$e) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyCounter();
    };
    var toBytes$z = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$e);
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

    var id$y = currentMc$1;
    var name$y = commandNames[currentMc$1];
    var headerSize$y = 2;
    var COMMAND_BODY_MAX_SIZE$d = 37;
    var examples$y = {
      '4 channels for IMP4EU': {
        id: id$y,
        name: name$y,
        headerSize: headerSize$y,
        parameters: {
          channelList: [{
            value: 131,
            index: 1
          }, {
            value: 8,
            index: 2
          }, {
            value: 10,
            index: 3
          }, {
            value: 12,
            index: 4
          }]
        },
        bytes: [0x18, 0x06, 0x0f, 0x83, 0x01, 0x08, 0x0a, 0x0c]
      },
      'single channel for IMP2EU': {
        id: id$y,
        name: name$y,
        headerSize: headerSize$y,
        parameters: {
          channelList: [{
            value: 50,
            index: 2
          }]
        },
        bytes: [0x18, 0x02, 0x02, 0x32]
      },
      '3 channels for IMP4EU': {
        id: id$y,
        name: name$y,
        headerSize: headerSize$y,
        parameters: {
          channelList: [{
            value: 8146,
            index: 1
          }, {
            value: 164,
            index: 3
          }, {
            value: 75,
            index: 4
          }]
        },
        bytes: [0x18, 0x06, 0x0d, 0xd2, 0x3f, 0xa4, 0x01, 0x4b]
      },
      'single channel for ELIMP - max module value': {
        id: id$y,
        name: name$y,
        headerSize: headerSize$y,
        parameters: {
          channelList: [{
            value: 4294967295,
            index: 1
          }]
        },
        bytes: [0x18, 0x06, 0x01, 0xff, 0xff, 0xff, 0xff, 0x0f]
      }
    };
    var fromBytes$y = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$d) {
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
    var toBytes$y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$d);
      var channelList = parameters.channelList;
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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

    var id$x = day$1;
    var name$x = commandNames[day$1];
    var headerSize$x = 1;
    var COMMAND_BODY_SIZE$b = 6;
    var examples$x = {
      'day value for 2023.12.23 00:00:00 GMT': {
        id: id$x,
        name: name$x,
        headerSize: headerSize$x,
        parameters: {
          value: 122,
          isMagneticInfluence: true,
          startTime2000: 756604800
        },
        bytes: [0x26, 0x2f, 0x97, 0x80, 0x00, 0x00, 0x7a]
      }
    };
    var fromBytes$x = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var _byte = buffer.getUint8();
      var _buffer$getHours = buffer.getHours(_byte),
        hour = _buffer$getHours.hour;
      var isMagneticInfluence = CommandBinaryBuffer.getMagneticInfluenceBit(_byte);
      var value = buffer.getLegacyCounterValue();
      date.setUTCHours(hour);
      return {
        value: value,
        isMagneticInfluence: isMagneticInfluence,
        startTime2000: getTime2000FromDate(date)
      };
    };
    var toBytes$x = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$b);
      var value = parameters.value,
        isMagneticInfluence = parameters.isMagneticInfluence,
        startTime2000 = parameters.startTime2000;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
      buffer.setDate(date);
      buffer.setHours(hour, 1);
      buffer.seek(buffer.offset - 1);
      var _byte2 = buffer.getUint8();
      buffer.seek(buffer.offset - 1);
      buffer.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(_byte2, isMagneticInfluence));
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

    var id$w = dayMc$1;
    var name$w = commandNames[dayMc$1];
    var headerSize$w = 2;
    var COMMAND_BODY_MAX_SIZE$c = 32;
    var examples$w = {
      '4 channels at 2023.12.23 00:00:00 GMT': {
        id: id$w,
        name: name$w,
        headerSize: headerSize$w,
        parameters: {
          startTime2000: 756604800,
          channelList: [{
            value: 131,
            index: 3
          }, {
            value: 8,
            index: 5
          }, {
            value: 10,
            index: 7
          }, {
            value: 12,
            index: 1
          }]
        },
        bytes: [0x16, 0x08, 0x2f, 0x97, 0x55, 0x0c, 0x83, 0x01, 0x08, 0x0a]
      }
    };
    var fromBytes$w = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$c) {
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
    var toBytes$w = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$c);
      var channelList = parameters.channelList,
        startTime2000 = parameters.startTime2000;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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

    var id$v = exAbsCurrentMc$1;
    var name$v = commandNames[exAbsCurrentMc$1];
    var headerSize$v = 3;
    var COMMAND_BODY_MAX_SIZE$b = 87;
    var examples$v = {
      'absolute current value from channel 3': {
        id: id$v,
        name: name$v,
        headerSize: headerSize$v,
        parameters: {
          channelList: [{
            pulseCoefficient: 100,
            value: 342,
            index: 3
          }]
        },
        bytes: [0x1f, 0x0f, 0x04, 0x04, 0x83, 0xd6, 0x02]
      }
    };
    var fromBytes$v = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return {
        channelList: buffer.getChannelsWithAbsoluteValues()
      };
    };
    var toBytes$v = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$b);
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

    var id$u = exAbsDayMc$1;
    var name$u = commandNames[exAbsDayMc$1];
    var headerSize$u = 3;
    var COMMAND_BODY_MAX_SIZE$a = 89;
    var examples$u = {
      'absolute day value for 2023.03.10 00:00:00 GMT': {
        id: id$u,
        name: name$u,
        headerSize: headerSize$u,
        parameters: {
          startTime2000: 731721600,
          channelList: [{
            pulseCoefficient: 100,
            value: 342,
            index: 1
          }]
        },
        bytes: [0x1f, 0x0b, 0x06, 0x2e, 0x6a, 0x01, 0x83, 0xd6, 0x02]
      }
    };
    var fromBytes$u = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$a) {
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
    var toBytes$u = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$a);
      var startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$t = exAbsHourMc$1;
    var name$t = commandNames[exAbsHourMc$1];
    var headerSize$t = 3;
    var COMMAND_BODY_MAX_SIZE$9 = 168;
    var examples$t = {
      '1 channel at 2023.03.10 12:00:00 GMT': {
        id: id$t,
        name: name$t,
        headerSize: headerSize$t,
        parameters: {
          startTime2000: 731764800,
          hours: 2,
          channelList: [{
            diff: [128],
            value: 342457,
            pulseCoefficient: 100,
            index: 1
          }]
        },
        bytes: [0x1f, 0x0a, 0x0a, 0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01]
      }
    };
    var fromBytes$t = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$9) {
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
    var toBytes$t = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$9);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
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

    var id$s = getArchiveDays$1;
    var name$s = commandNames[getArchiveDays$1];
    var headerSize$s = 2;
    var COMMAND_BODY_MIN_SIZE$1 = 2;
    var DAY_COUNTER_SIZE = 4;
    var examples$s = {
      'get day values from 2001.03.10': {
        id: id$s,
        name: name$s,
        headerSize: headerSize$s,
        parameters: {
          startTime2000: 2678227200,
          dayList: [{
            isMagneticInfluence: true,
            value: 234
          }]
        },
        bytes: [0x06, 0x06, 0xa9, 0x6d, 0x80, 0x00, 0x00, 0xea]
      }
    };
    var fromBytes$s = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var dayList = [];
      while (buffer.offset < buffer.data.length) {
        dayList.push(buffer.getLegacyCounter(undefined, true));
      }
      return {
        startTime2000: getTime2000FromDate(date),
        dayList: dayList
      };
    };
    var toBytes$s = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        dayList = parameters.dayList;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$1 + dayList.length * DAY_COUNTER_SIZE);
      buffer.setDate(startTime2000);
      dayList.forEach(function (dayCounter) {
        return buffer.setLegacyCounter(dayCounter, undefined, true);
      });
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

    var id$r = getArchiveDaysMc$1;
    var name$r = commandNames[getArchiveDaysMc$1];
    var headerSize$r = 2;
    var COMMAND_BODY_MAX_SIZE$8 = 255;
    var examples$r = {
      'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
        id: id$r,
        name: name$r,
        headerSize: headerSize$r,
        parameters: {
          startTime2000: 2678227200,
          days: 2,
          channelList: [{
            dayList: [234, 332],
            index: 1
          }]
        },
        bytes: [0x1b, 0x08, 0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02]
      },
      'empty result from 2010.10.09 00:00:00 GMT for channel 1': {
        id: id$r,
        name: name$r,
        headerSize: headerSize$r,
        parameters: {
          startTime2000: 339897600,
          days: 1,
          channelList: [{
            dayList: [0],
            index: 1
          }]
        },
        bytes: [0x1b, 0x09, 0x15, 0x49, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0x0f]
      }
    };
    var fromBytes$r = function fromBytes(data) {
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
          var value = buffer.getExtendedValue();
          dayList.push(value === EMPTY_VALUE ? 0 : value);
        }
      });
      return {
        startTime2000: getTime2000FromDate(date),
        days: days,
        channelList: channelList
      };
    };
    var toBytes$r = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$8);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days,
        channelList = parameters.channelList;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      buffer.setUint8(days);
      channelList.forEach(function (_ref) {
        var dayList = _ref.dayList;
        dayList.forEach(function (value) {
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

    var MAGNET_ON = 1;
    var MAGNET_OFF = 2;
    var ACTIVATE = 3;
    var DEACTIVATE = 4;
    var BATTERY_ALARM = 5;
    var CAN_OFF = 6;
    var INSERT = 7;
    var REMOVE = 8;
    var COUNTER_OVER = 9;
    var SET_TIME = 10;
    var ACTIVATE_MTX = 11;
    var CONNECT = 12;
    var DISCONNECT = 13;
    var DEPASS_DONE = 14;
    var OPTOLOW = 15;
    var OPTOFLASH = 16;
    var MTX = 17;
    var JOIN_ACCEPT = 18;
    var WATER_EVENT = 19;
    var WATER_NO_RESPONSE = 20;
    var OPTOSENSOR_ERROR = 21;
    var BINARY_SENSOR_ON = 22;
    var BINARY_SENSOR_OFF = 23;
    var TEMPERATURE_SENSOR_HYSTERESIS = 24;
    var TEMPERATURE_SENSOR_LOW_TEMPERATURE = 25;
    var TEMPERATURE_SENSOR_HIGH_TEMPERATURE = 26;

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

    var id$q = getArchiveEvents$1;
    var name$q = commandNames[getArchiveEvents$1];
    var headerSize$q = 2;
    var COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    var examples$q = {
      '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
        id: id$q,
        name: name$q,
        headerSize: headerSize$q,
        parameters: {
          eventList: [{
            time2000: 734015840,
            id: 1,
            name: 'MAGNET_ON',
            sequenceNumber: 1
          }]
        },
        bytes: [0x0b, 0x06, 0x2b, 0xc0, 0x31, 0x60, 0x01, 0x01]
      },
      '4 events': {
        id: id$q,
        name: name$q,
        headerSize: headerSize$q,
        parameters: {
          eventList: [{
            time2000: 734015840,
            id: 2,
            name: 'MAGNET_OFF',
            sequenceNumber: 1
          }, {
            time2000: 734025840,
            id: 1,
            name: 'MAGNET_ON',
            sequenceNumber: 2
          }, {
            time2000: 734035840,
            id: 3,
            name: 'ACTIVATE',
            sequenceNumber: 3
          }, {
            time2000: 734045840,
            id: 4,
            name: 'DEACTIVATE',
            sequenceNumber: 4
          }]
        },
        bytes: [0x0b, 0x18, 0x2b, 0xc0, 0x31, 0x60, 0x02, 0x01, 0x2b, 0xc0, 0x58, 0x70, 0x01, 0x02, 0x2b, 0xc0, 0x7f, 0x80, 0x03, 0x03, 0x2b, 0xc0, 0xa6, 0x90, 0x04, 0x04]
      }
    };
    var getEvent = function getEvent(buffer) {
      var time2000 = buffer.getTime();
      var eventId = buffer.getUint8();
      var sequenceNumber = buffer.getUint8();
      return {
        time2000: time2000,
        id: eventId,
        name: eventNames[eventId],
        sequenceNumber: sequenceNumber
      };
    };
    var setEvent = function setEvent(buffer, event) {
      buffer.setTime(event.time2000);
      buffer.setUint8(event.id);
      buffer.setUint8(event.sequenceNumber);
    };
    var fromBytes$q = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var eventList = [];
      while (buffer.bytesLeft > 0) {
        eventList.push(getEvent(buffer));
      }
      return {
        eventList: eventList
      };
    };
    function toBytes$q(parameters) {
      var eventList = parameters.eventList;
      var buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE);
      eventList.forEach(function (event) {
        return setEvent(buffer, event);
      });
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

    var id$p = getArchiveHours$1;
    var name$p = commandNames[getArchiveHours$1];
    var headerSize$p = 2;
    var examples$p = {
      '1 hour archive from 2023.12.23 12:00:00 GMT': {
        id: id$p,
        name: name$p,
        headerSize: headerSize$p,
        parameters: {
          startTime2000: 756648000,
          counter: {
            isMagneticInfluence: true,
            value: 163
          },
          diff: [{
            isMagneticInfluence: true,
            value: 10
          }]
        },
        bytes: [0x05, 0x08, 0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a]
      }
    };
    var fromBytes$p = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyHourCounterWithDiff(true);
    };
    var toBytes$p = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
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

    var id$o = getArchiveHoursMc$1;
    var name$o = commandNames[getArchiveHoursMc$1];
    var headerSize$o = 2;
    var COMMAND_BODY_MAX_SIZE$7 = 164;
    var examples$o = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [{
            value: 131,
            diff: [10],
            index: 1
          }, {
            value: 8,
            diff: [10],
            index: 2
          }, {
            value: 8,
            diff: [10],
            index: 3
          }, {
            value: 12,
            diff: [10],
            index: 4
          }]
        },
        bytes: [0x1a, 0x0d, 0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a]
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
        bytes: [0x1a, 0x04, 0x2f, 0x6a, 0x00, 0x00]
      }
    };
    var fromBytes$o = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$7) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff(true);
    };
    var toBytes$o = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
      var hours = parameters.hours,
        startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$n = getArchiveHoursMcEx$1;
    var name$n = commandNames[getArchiveHoursMcEx$1];
    var headerSize$n = 3;
    var COMMAND_BODY_MAX_SIZE$6 = 255;
    var examples$n = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$n,
        name: name$n,
        headerSize: headerSize$n,
        parameters: {
          startTime2000: 756648000,
          hour: 12,
          hours: 1,
          channelList: [{
            value: 131,
            diff: [10],
            index: 1
          }, {
            value: 8,
            diff: [10],
            index: 2
          }, {
            value: 8,
            diff: [10],
            index: 3
          }, {
            value: 12,
            diff: [10],
            index: 4
          }]
        },
        bytes: [0x1f, 0x30, 0x0e, 0x2f, 0x97, 0x0c, 0x01, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a]
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
        bytes: [0x1f, 0x30, 0x05, 0x2f, 0x6a, 0x00, 0x00, 0x00]
      }
    };
    var fromBytes$n = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$6) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiffExtended(true);
    };
    var toBytes$n = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
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

    var id$m = getBatteryStatus$1;
    var name$m = commandNames[getBatteryStatus$1];
    var headerSize$m = 3;
    var COMMAND_BODY_SIZE$a = 11;
    var examples$m = {
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
        bytes: [0x1f, 0x05, 0x0b, 0x0e, 0x10, 0x0e, 0x10, 0x04, 0x0a, 0x0f, 0x29, 0x00, 0x00, 0x22]
      }
    };
    var fromBytes$m = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
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
    var toBytes$m = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$a);
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

    var id$l = getChannelsStatus$1;
    var name$l = commandNames[getChannelsStatus$1];
    var headerSize$l = 3;
    var examples$l = {
      'binary sensor, channel: 1, state: true': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
        parameters: [{
          type: BINARY_SENSOR,
          typeName: 'BINARY_SENSOR',
          channel: 1,
          status: {
            state: true
          }
        }],
        bytes: [0x1f, 0x32, 0x03, 0x03, 0x00, 0x01]
      },
      'temperature sensor, channel: 3, temperature: 24': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
        parameters: [{
          type: TEMPERATURE_SENSOR,
          typeName: 'TEMPERATURE_SENSOR',
          channel: 3,
          status: {
            temperature: 24,
            time2000: 22720
          }
        }],
        bytes: [0x1f, 0x32, 0x07, 0x04, 0x02, 0x18, 0x00, 0x00, 0x58, 0xc0]
      },
      'binary and temperature sensors': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
        parameters: [{
          type: BINARY_SENSOR,
          typeName: 'BINARY_SENSOR',
          channel: 1,
          status: {
            state: true
          }
        }, {
          type: TEMPERATURE_SENSOR,
          typeName: 'TEMPERATURE_SENSOR',
          channel: 3,
          status: {
            temperature: 20,
            time2000: 22720
          }
        }],
        bytes: [0x1f, 0x32, 0x0a, 0x03, 0x00, 0x01, 0x04, 0x02, 0x14, 0x00, 0x00, 0x58, 0xc0]
      }
    };
    var getBufferSize = function getBufferSize(channelsStatus) {
      var size = 0;
      for (var index = 0; index < channelsStatus.length; index++) {
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
    var getBinarySensorStatus = function getBinarySensorStatus(buffer) {
      return {
        state: buffer.getUint8() !== 0
      };
    };
    var setBinarySensorStatus = function setBinarySensorStatus(status, buffer) {
      buffer.setUint8(status.state ? 1 : 0);
    };
    var getTemperatureSensorStatus = function getTemperatureSensorStatus(buffer) {
      return {
        temperature: buffer.getInt8(),
        time2000: buffer.getTime()
      };
    };
    var setTemperatureSensorStatus = function setTemperatureSensorStatus(status, buffer) {
      buffer.setInt8(status.temperature);
      buffer.setTime(status.time2000);
    };
    var fromBytes$l = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var result = [];
      while (buffer.bytesLeft !== 0) {
        var type = buffer.getUint8();
        var channelStatus = {
          type: type,
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
    var toBytes$l = function toBytes(channelsStatus) {
      var buffer = new CommandBinaryBuffer(getBufferSize(channelsStatus));
      for (var index = 0; index < channelsStatus.length; index++) {
        var _channelsStatus$index = channelsStatus[index],
          type = _channelsStatus$index.type,
          channel = _channelsStatus$index.channel,
          status = _channelsStatus$index.status;
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

    var id$k = getChannelsTypes$1;
    var name$k = commandNames[getChannelsTypes$1];
    var headerSize$k = 3;
    var examples$k = {
      'channels: [POWER_CHANNEL (2), BINARY_SENSOR (3), TEMPERATURE_SENSOR (4), IDLE (0)]': {
        id: id$k,
        name: name$k,
        headerSize: headerSize$k,
        parameters: {
          channels: [{
            type: 2,
            typeName: 'POWER_CHANNEL'
          }, {
            type: 3,
            typeName: 'BINARY_SENSOR'
          }, {
            type: 4,
            typeName: 'TEMPERATURE_SENSOR'
          }, {
            type: 0,
            typeName: 'IDLE'
          }]
        },
        bytes: [0x1f, 0x33, 0x04, 0x02, 0x03, 0x04, 0x00]
      }
    };
    var fromBytes$k = function fromBytes(data) {
      return {
        channels: data.map(function (type) {
          return {
            type: type,
            typeName: channelNames[type]
          };
        })
      };
    };
    var toBytes$k = function toBytes(_ref) {
      var channels = _ref.channels;
      return toBytes$11(id$k, channels.map(function (channel) {
        return channel.type;
      }));
    };

    var getChannelsTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$k,
        fromBytes: fromBytes$k,
        headerSize: headerSize$k,
        id: id$k,
        name: name$k,
        toBytes: toBytes$k
    });

    var id$j = getExAbsArchiveDaysMc$1;
    var name$j = commandNames[getExAbsArchiveDaysMc$1];
    var headerSize$j = 3;
    var COMMAND_BODY_MAX_SIZE$5 = 255;
    var examples$j = {
      'archive days values at 4 channel from 2023.03.10 00:00:00 GMT': {
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
        parameters: {
          channelList: [{
            pulseCoefficient: 100,
            dayList: [5524, 5674],
            index: 4
          }],
          days: 2,
          startTime2000: 731721600
        },
        bytes: [0x1f, 0x0d, 0x09, 0x2e, 0x6a, 0x08, 0x02, 0x83, 0x94, 0x2b, 0xaa, 0x2c]
      }
    };
    var fromBytes$j = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var channels = buffer.getChannels();
      var days = buffer.getUint8();
      var channelList = [];
      channels.forEach(function (channelIndex) {
        var dayList = [];
        var pulseCoefficient = buffer.getPulseCoefficient();
        channelList.push({
          pulseCoefficient: pulseCoefficient,
          dayList: dayList,
          index: channelIndex
        });
        for (var day = 0; day < days; ++day) {
          var value = buffer.getExtendedValue();
          dayList.push(value === EMPTY_VALUE ? 0 : value);
        }
      });
      return {
        channelList: channelList,
        days: days,
        startTime2000: getTime2000FromDate(date)
      };
    };
    var toBytes$j = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$5);
      var channelList = parameters.channelList,
        startTime2000 = parameters.startTime2000,
        days = parameters.days;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      buffer.setUint8(days);
      channelList.forEach(function (_ref) {
        var pulseCoefficient = _ref.pulseCoefficient,
          dayList = _ref.dayList;
        buffer.setPulseCoefficient(pulseCoefficient);
        dayList.forEach(function (value) {
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

    var id$i = getExAbsArchiveHoursMc$1;
    var name$i = commandNames[getExAbsArchiveHoursMc$1];
    var headerSize$i = 3;
    var COMMAND_BODY_MAX_SIZE$4 = 164;
    var examples$i = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [{
            value: 131,
            diff: [10],
            index: 1
          }, {
            value: 8,
            diff: [10],
            index: 2
          }, {
            value: 8,
            diff: [10],
            index: 3
          }, {
            value: 12,
            diff: [10],
            index: 4
          }]
        },
        bytes: [0x1f, 0x0c, 0x0d, 0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a]
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
        bytes: [0x1f, 0x0c, 0x04, 0x2f, 0x6a, 0x00, 0x00]
      }
    };
    var fromBytes$i = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff(true);
    };
    var toBytes$i = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
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

    var id$h = getLmicInfo$1;
    var name$h = commandNames[getLmicInfo$1];
    var headerSize$h = 3;
    var COMMAND_BODY_SIZE$9 = 2;
    var lmicCapabilitiesBitMask = {
      isMulticastSupported: 1 << 0,
      isFragmentedDataSupported: 1 << 1
    };
    var examples$h = {
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
        bytes: [0x1f, 0x02, 0x02, 0x01, 0x05]
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
        bytes: [0x1f, 0x02, 0x02, 0x03, 0x08]
      }
    };
    var fromBytes$h = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$9) {
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
    var toBytes$h = function toBytes(parameters) {
      var capabilities = parameters.capabilities,
        version = parameters.version;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$9);
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

    var id$g = getParameter$1;
    var name$g = commandNames[getParameter$1];
    var headerSize$g = 2;
    var examples$g = {
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
        bytes: [0x04, 0x05, 0x01, 0x00, 0x00, 0x00, 0x04]
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
        bytes: [0x04, 0x05, 0x12, 0x05, 0x00, 0x00, 0xc8]
      },
      'absolute data (not multichannel device)': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        parameters: {
          id: 23,
          name: 'ABSOLUTE_DATA',
          data: {
            meterValue: 204,
            pulseCoefficient: 100,
            value: 2023
          }
        },
        bytes: [0x04, 0x0a, 0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7]
      },
      'state of absolute data (not multichannel device)': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        parameters: {
          id: 24,
          name: 'ABSOLUTE_DATA_ENABLE',
          data: {
            state: 1
          }
        },
        bytes: [0x04, 0x02, 0x18, 0x01]
      },
      'absolute data for multichannel device (1 channel)': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
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
        bytes: [0x04, 0x0b, 0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0]
      },
      'state of absolute data for multichannel device (1 channel)': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        parameters: {
          id: 30,
          name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
          data: {
            channel: 2,
            state: 1
          }
        },
        bytes: [0x04, 0x03, 0x1e, 0x01, 0x01]
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
        bytes: [0x04, 0x12, 0x33, 0x10, 0x42, 0x43, 0x36, 0x36, 0x30, 0x4B, 0x47, 0x4C, 0x41, 0x41, 0x52, 0x30, 0x31, 0x41, 0x30, 0x35]
      },
      'nbiot bands': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        parameters: {
          id: 52,
          name: 'NBIOT_BANDS',
          data: {
            bands: [3, 20]
          }
        },
        bytes: [0x04, 0x04, 0x34, 0x02, 0x03, 0x14]
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
        bytes: [0x04, 0x05, 0x3a, 0x00, 0x00, 0x05, 0xa0]
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
        bytes: [0x04, 0x02, 0x3b, 0x01]
      }
    };
    var fromBytes$g = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getResponseParameter();
    };
    var toBytes$g = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getResponseParameterSize(parameters));
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

    var id$f = signalQuality$1;
    var name$f = commandNames[signalQuality$1];
    var headerSize$f = 3;
    var COMMAND_BODY_SIZE$8 = 6;
    var examples$f = {
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
        bytes: [0x1f, 0x34, 0x06, 0xb7, 0xb3, 0xfc, 0x12, 0x01, 0x00]
      }
    };
    var fromBytes$f = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$8) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new BinaryBuffer(data, false);
      var parameters = {
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
    var toBytes$f = function toBytes(parameters) {
      var rssi = parameters.rssi,
        rsrp = parameters.rsrp,
        rsrq = parameters.rsrq,
        sinr = parameters.sinr,
        txPower = parameters.txPower,
        ecl = parameters.ecl;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$8, false);
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

    var id$e = hour$1;
    var name$e = commandNames[hour$1];
    var headerSize$e = 1;
    var examples$e = {
      '1 hour from 2023.12.23 12:00:00 GMT': {
        id: id$e,
        name: name$e,
        headerSize: headerSize$e,
        parameters: {
          startTime2000: 756648000,
          counter: {
            isMagneticInfluence: true,
            value: 163
          },
          diff: [{
            isMagneticInfluence: true,
            value: 10
          }]
        },
        bytes: [0x48, 0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a]
      }
    };
    var fromBytes$e = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyHourCounterWithDiff();
    };
    var toBytes$e = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
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

    var id$d = hourMc$1;
    var name$d = commandNames[hourMc$1];
    var headerSize$d = 2;
    var COMMAND_BODY_MAX_SIZE$3 = 164;
    var examples$d = {
      '4 first channels at 2023.12.23 12:00:00 GMT': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [{
            value: 131,
            diff: [10],
            index: 1
          }, {
            value: 832,
            diff: [12],
            index: 2
          }, {
            value: 38,
            diff: [8],
            index: 3
          }, {
            value: 234,
            diff: [11],
            index: 4
          }]
        },
        bytes: [0x17, 0x0f, 0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0xc0, 0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b]
      }
    };
    var fromBytes$d = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$3) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$d = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
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

    var id$c = hourMcEx$1;
    var name$c = commandNames[hourMcEx$1];
    var headerSize$c = 3;
    var COMMAND_BODY_MAX_SIZE$2 = 255;
    var examples$c = {
      '1 channel at 2023.12.23 12:00:00 GMT': {
        id: id$c,
        name: name$c,
        headerSize: headerSize$c,
        parameters: {
          startTime2000: 756648000,
          hour: 12,
          hours: 7,
          channelList: [{
            value: 131,
            diff: [10, 10, 10, 10, 10, 10, 10],
            index: 1
          }]
        },
        bytes: [0x1f, 0x31, 0x0e, 0x2f, 0x97, 0x0c, 0x07, 0x01, 0x83, 0x01, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a]
      }
    };
    var fromBytes$c = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiffExtended();
    };
    var toBytes$c = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
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

    var id$b = lastEvent$1;
    var name$b = commandNames[lastEvent$1];
    var headerSize$b = 1;
    var examples$b = {
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
        bytes: [0x62, 0x20, 0x09]
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
        bytes: [0x63, 0x10, 0xe1, 0x01]
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
        bytes: [0x63, 0x10, 0x80, 0x00]
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
        bytes: [0x63, 0x30, 0x83, 0x0a]
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
        bytes: [0x63, 0x30, 0x34, 0x00]
      }
    };
    var fromBytes$b = function fromBytes(data, config) {
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
    var toBytes$b = function toBytes(parameters, config) {
      if (!config.hardwareType) {
        throw new Error('hardwareType in config is mandatory');
      }
      var buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
      var sequenceNumber = parameters.sequenceNumber,
        status = parameters.status;
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

    var id$a = newEvent$1;
    var name$a = commandNames[newEvent$1];
    var headerSize$a = 2;
    var COMMAND_BODY_MAX_SIZE$1 = 14;
    var MTX_ADDRESS_SIZE = 8;
    var examples$a = {
      'event for MAGNET_ON': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          id: 1,
          name: 'MAGNET_ON',
          sequenceNumber: 2,
          data: {
            time2000: 734015840
          }
        },
        bytes: [0x15, 0x06, 0x01, 0x02, 0x2b, 0xc0, 0x31, 0x60]
      },
      'event for BATTERY_ALARM': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          id: 5,
          name: 'BATTERY_ALARM',
          sequenceNumber: 2,
          data: {
            voltage: 3308
          }
        },
        bytes: [0x15, 0x04, 0x05, 0x02, 0x0c, 0xec]
      },
      'event for ACTIVATE_MTX': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          id: 11,
          name: 'ACTIVATE_MTX',
          sequenceNumber: 2,
          data: {
            time2000: 734015840,
            deviceId: '00 1a 79 88 17 01 23 56'
          }
        },
        bytes: [0x15, 0x0e, 0x0b, 0x02, 0x2b, 0xc0, 0x31, 0x60, 0x00, 0x1a, 0x79, 0x88, 0x17, 0x01, 0x23, 0x56]
      },
      'event for CONNECT': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          id: 12,
          name: 'CONNECT',
          sequenceNumber: 2,
          data: {
            channel: 1,
            value: 131
          }
        },
        bytes: [0x15, 0x05, 0x0c, 0x02, 0x00, 0x83, 0x01]
      },
      'event for DISCONNECT': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        parameters: {
          id: 13,
          name: 'DISCONNECT',
          sequenceNumber: 2,
          data: {
            channel: 1,
            value: 131
          }
        },
        bytes: [0x15, 0x05, 0x0d, 0x02, 0x00, 0x83, 0x01]
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
        bytes: [0x15, 0x04, 0x11, 0x02, 0x83, 0x0a]
      }
    };
    var getVoltage = function getVoltage(buffer) {
      return buffer.getUint16();
    };
    var setVoltage = function setVoltage(buffer, value) {
      return buffer.setUint16(value);
    };
    var getDeviceId = function getDeviceId(buffer) {
      return getHexFromBytes(buffer.getBytes(MTX_ADDRESS_SIZE));
    };
    var setDeviceId = function setDeviceId(buffer, value) {
      getBytesFromHex(value).forEach(function (_byte) {
        return buffer.setUint8(_byte);
      });
    };
    var fromBytes$a = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$1) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var eventId = buffer.getUint8();
      var eventName = eventNames[eventId];
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
        case BINARY_SENSOR_ON:
        case BINARY_SENSOR_OFF:
          eventData = {
            time2000: buffer.getTime(),
            channel: buffer.getChannelValue()
          };
          break;
        case TEMPERATURE_SENSOR_HYSTERESIS:
        case TEMPERATURE_SENSOR_LOW_TEMPERATURE:
        case TEMPERATURE_SENSOR_HIGH_TEMPERATURE:
          eventData = {
            time2000: buffer.getTime(),
            channel: buffer.getChannelValue(),
            temperature: buffer.getInt8()
          };
          break;
        default:
          throw new Error("Event ".concat(id$a, " is not supported"));
      }
      return {
        id: eventId,
        name: eventName,
        sequenceNumber: sequenceNumber,
        data: eventData
      };
    };
    var toBytes$a = function toBytes(parameters) {
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
          throw new Error("Event ".concat(id$a, " is not supported"));
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

    var id$9 = setParameter$1;
    var name$9 = commandNames[setParameter$1];
    var headerSize$9 = 2;
    var COMMAND_BODY_SIZE$7 = 2;
    var examples$9 = {
      'activation method set successfully': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
        parameters: {
          id: 9,
          status: 1
        },
        bytes: [0x03, 0x02, 0x09, 0x01]
      },
      'configuration for battery depassivation set successfully': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
        parameters: {
          id: 33,
          status: 1
        },
        bytes: [0x03, 0x02, 0x21, 0x01]
      }
    };
    var fromBytes$9 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$7) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var parameters = {
        id: buffer.getUint8(),
        status: buffer.getUint8()
      };
      if (!buffer.isEmpty) {
        throw new Error('BinaryBuffer is not empty.');
      }
      return parameters;
    };
    var toBytes$9 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$7);
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

    var id$8 = setTime2000$1;
    var name$8 = commandNames[setTime2000$1];
    var headerSize$8 = 2;
    var COMMAND_BODY_SIZE$6 = 1;
    var examples$8 = {
      success: {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
        parameters: {
          status: 1
        },
        bytes: [0x02, 0x01, 0x01]
      }
    };
    var fromBytes$8 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$6) {
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
    var toBytes$8 = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$6, false);
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

    var id$7 = softRestart$1;
    var name$7 = commandNames[softRestart$1];
    var headerSize$7 = 2;
    var COMMAND_BODY_SIZE$5 = 0;
    var examples$7 = {
      'simple response': {
        id: id$7,
        name: name$7,
        headerSize: headerSize$7,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$7 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$5) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$7 = function toBytes() {
      return toBytes$11(id$7);
    };

    var softRestart = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$7,
        fromBytes: fromBytes$7,
        headerSize: headerSize$7,
        id: id$7,
        name: name$7,
        toBytes: toBytes$7
    });

    var id$6 = status$1;
    var name$6 = commandNames[status$1];
    var headerSize$6 = 2;
    var COMMAND_BODY_MAX_SIZE = 20;
    var UNKNOWN_BATTERY_RESISTANCE = 65535;
    var UNKNOWN_BATTERY_CAPACITY = 255;
    var examples$6 = {
      'status for GASI3 (old)': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
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
            remainingBatteryCapacity: 40.9,
            lastEventSequenceNumber: 34
          }
        },
        bytes: [0x14, 0x0c, 0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22]
      },
      'status for GASI3 (new)': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
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
            remainingBatteryCapacity: 40.9,
            lastEventSequenceNumber: 34,
            downlinkQuality: 42
          }
        },
        bytes: [0x14, 0x0d, 0x02, 0x0a, 0x03, 0x01, 0xc5, 0x6d, 0xc2, 0x27, 0x32, 0x0e, 0x68, 0x22, 0x2a]
      },
      'status for MTX': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
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
        bytes: [0x14, 0x14, 0x02, 0x0a, 0x07, 0x01, 0x00, 0x00, 0x11, 0x5c, 0x01, 0x02, 0x06, 0x2a, 0x53, 0x8f, 0x02, 0x05, 0x0c, 0x0a, 0x02, 0x21]
      }
    };
    var fromBytes$6 = function fromBytes(bytes) {
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
        case NBIOT:
          {
            var statusData = {
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
            } else if (statusData.remainingBatteryCapacity !== undefined) {
              statusData.remainingBatteryCapacity = roundNumber(statusData.remainingBatteryCapacity * 100 / (UNKNOWN_BATTERY_CAPACITY - 1), 1);
            }
            if (!buffer.isEmpty) {
              statusData.downlinkQuality = buffer.getUint8();
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
          throw new Error("".concat(id$6, ": hardware type ").concat(hardware.type, " is not supported"));
      }
      return {
        software: software,
        hardware: hardware,
        data: data
      };
    };
    var toBytes$6 = function toBytes(parameters) {
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
              buffer.setUint16(UNKNOWN_BATTERY_RESISTANCE);
            } else {
              buffer.setUint16(statusData.batteryInternalResistance);
            }
            buffer.setUint8(statusData.temperature);
            if (statusData.remainingBatteryCapacity === undefined) {
              buffer.setUint8(UNKNOWN_BATTERY_CAPACITY);
            } else {
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
          throw new Error("".concat(id$6, ": hardware type ").concat(hardware.type, " is not supported"));
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

    var id$5 = time2000$1;
    var name$5 = commandNames[time2000$1];
    var headerSize$5 = 2;
    var COMMAND_BODY_SIZE$4 = 5;
    var examples$5 = {
      'time is 2023.04.03 14:01:17 GMT': {
        id: id$5,
        name: name$5,
        headerSize: headerSize$5,
        parameters: {
          sequenceNumber: 77,
          time2000: 733845677
        },
        bytes: [0x09, 0x05, 0x4d, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes$5 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$4) {
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
    function toBytes$5(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        time2000 = parameters.time2000;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$4);
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

    var id$4 = updateRun$1;
    var name$4 = commandNames[updateRun$1];
    var headerSize$4 = 3;
    var COMMAND_BODY_SIZE$3 = 0;
    var examples$4 = {
      'simple response': {
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
        parameters: {},
        bytes: [0x1f, 0x2c, 0x00]
      }
    };
    var fromBytes$4 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$3) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$4 = function toBytes() {
      return toBytes$11(id$4);
    };

    var updateRun = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$4,
        fromBytes: fromBytes$4,
        headerSize: headerSize$4,
        id: id$4,
        name: name$4,
        toBytes: toBytes$4
    });

    var id$3 = usWaterMeterBatteryStatus$1;
    var name$3 = commandNames[usWaterMeterBatteryStatus$1];
    var headerSize$3 = 3;
    var COMMAND_BODY_SIZE$2 = 7;
    var examples$3 = {
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
        bytes: [0x1f, 0x14, 0x07, 0xe1, 0x0e, 0x10, 0x04, 0x0a, 0x00, 0x64]
      }
    };
    var fromBytes$3 = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return {
        voltage: buffer.getBatteryVoltage(),
        internalResistance: buffer.getUint16(),
        lastDepassivationTime: buffer.getUint16()
      };
    };
    var toBytes$3 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$2);
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

    var id$2 = usWaterMeterCommand$1;
    var name$2 = commandNames[usWaterMeterCommand$1];
    var headerSize$2 = 3;
    var examples$2 = {
      'response for current values': {
        id: id$2,
        name: name$2,
        headerSize: headerSize$2,
        parameters: {
          length: 4,
          data: [0x04, 0x22, 0x35, 0x28]
        },
        bytes: [0x1f, 0x07, 0x05, 0x04, 0x04, 0x22, 0x35, 0x28]
      }
    };
    var fromBytes$2 = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var length = buffer.getUint8();
      return {
        length: length,
        data: data.slice(1)
      };
    };
    var toBytes$2 = function toBytes(parameters) {
      var data = parameters.data,
        length = parameters.length;
      var buffer = new CommandBinaryBuffer(length);
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

    var id$1 = verifyImage$1;
    var name$1 = commandNames[verifyImage$1];
    var headerSize$1 = 3;
    var COMMAND_BODY_SIZE$1 = 1;
    var examples$1 = {
      'image is valid': {
        id: id$1,
        name: name$1,
        headerSize: headerSize$1,
        parameters: {
          status: 1
        },
        bytes: [0x1f, 0x2b, 0x01, 0x01]
      }
    };
    var fromBytes$1 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$1) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return {
        status: buffer.getUint8()
      };
    };
    var toBytes$1 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$1);
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

    var id = writeImage$1;
    var name = commandNames[writeImage$1];
    var headerSize = 3;
    var COMMAND_BODY_SIZE = 5;
    var examples = {
      'write image': {
        id: id,
        name: name,
        headerSize: headerSize,
        parameters: {
          offset: 64,
          status: 1
        },
        bytes: [0x1f, 0x2a, 0x05, 0x00, 0x00, 0x00, 0x40, 0x01]
      }
    };
    var fromBytes = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return {
        offset: buffer.getUint32(),
        status: buffer.getUint8()
      };
    };
    var toBytes = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
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
