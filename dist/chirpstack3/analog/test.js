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
        if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e  ) {
          t && (r = t);
          var n = 0,
            F = function () {};
          return {
            s: F,
            n: function () {
              return n >= r.length ? {
                done: !0
              } : {
                done: !1,
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
        a = !0,
        u = !1;
      return {
        s: function () {
          t = t.call(r);
        },
        n: function () {
          var r = t.next();
          return a = r.done, r;
        },
        e: function (r) {
          u = !0, o = r;
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
        enumerable: !0,
        configurable: !0,
        writable: !0
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
        r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
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
        var i = e.call(t, r || "default");
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
      setInt24: function setInt24(value) {
        var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.isLittleEndian;
        writeUint24(this.data, this.offset, value < 0 ? value | 0x1000000 : value, isLittleEndian);
        this.offset += INT24_SIZE;
      },
      getInt24: function getInt24() {
        var isLittleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.isLittleEndian;
        var result = readUint24(this.data, this.offset, isLittleEndian);
        this.offset += INT24_SIZE;
        return result & 0x800000 ? result ^ -0x1000000 : result;
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
    var toBytes$V = function toBytes(commandId, commandSize) {
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

    var toBytes$U = function toBytes(commandId) {
      var commandData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var headerData = toBytes$V(commandId, commandData.length);
      return [].concat(_toConsumableArray(headerData), _toConsumableArray(commandData));
    };

    var id$T = 0x0c;
    var name$T = 'correctTime2000';
    var headerSize$T = 2;
    var COMMAND_BODY_SIZE$u = 2;
    var examples$T = {
      'correct time 120 seconds to the past': {
        id: id$T,
        name: name$T,
        headerSize: headerSize$T,
        parameters: {
          sequenceNumber: 45,
          seconds: -120
        },
        bytes: [0x0c, 0x02, 0x2d, 0x88]
      },
      'correct time 95 seconds to the future': {
        id: id$T,
        name: name$T,
        headerSize: headerSize$T,
        parameters: {
          sequenceNumber: 46,
          seconds: 95
        },
        bytes: [0x0c, 0x02, 0x2e, 0x5f]
      }
    };
    var fromBytes$T = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$u) {
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
    var toBytes$T = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$u, false);
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

    var INITIAL_YEAR_TIMESTAMP = 946684800000;
    var MILLISECONDS_IN_SECONDS = 1000;
    var getDateFromTime2000 = function getDateFromTime2000(time2000) {
      return new Date(INITIAL_YEAR_TIMESTAMP + time2000 * MILLISECONDS_IN_SECONDS);
    };
    var getTime2000FromDate = function getTime2000FromDate(date) {
      return (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
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

    var roundNumber = (function (value) {
      var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
      var places = Math.pow(10, decimalPlaces);
      return Math.round(value * places * (1 + Number.EPSILON)) / places;
    });

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

    var invertObject = (function (source) {
      var target = {};
      for (var property in source) {
        var value = source[property];
        target[value] = property;
      }
      return target;
    });

    var _parametersSizeMap, _deviceParameterConve;
    var INITIAL_YEAR = 2000;
    var MONTH_BIT_SIZE = 4;
    var DATE_BIT_SIZE = 5;
    var YEAR_START_INDEX = 1;
    var UNKNOWN_BATTERY_VOLTAGE = 4095;
    var EXTEND_BIT_MASK = 0x80;
    var LAST_BIT_INDEX = 7;
    var DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
    var DATA_SENDING_INTERVAL_RESERVED_BYTES = 3;
    var PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
    var SERIAL_NUMBER_SIZE = 6;
    var MAGNETIC_INFLUENCE_BIT_INDEX = 8;
    var LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
    var LEGACY_HOUR_DIFF_SIZE = 2;
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
    var parametersSizeMap = (_parametersSizeMap = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, REPORTING_DATA_INTERVAL, 1 + 4), DAY_CHECKOUT_HOUR, 1 + 1), REPORTING_DATA_TYPE, 1 + 1), PRIORITY_DATA_DELIVERY_TYPE, 1 + 1), ACTIVATION_METHOD, 1 + 1), BATTERY_DEPASSIVATION_INFO, 1 + 6), BATTERY_MINIMAL_LOAD_TIME, 1 + 4), CHANNELS_CONFIG, 1 + 1), RX2_CONFIG, 1 + 4), ABSOLUTE_DATA, 1 + 9), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, ABSOLUTE_DATA_ENABLE, 1 + 1), SERIAL_NUMBER, 1 + 6), GEOLOCATION, 1 + 10), EXTRA_FRAME_INTERVAL, 1 + 2), ABSOLUTE_DATA_MULTI_CHANNEL, 1 + 10), ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL, 1 + 2), PULSE_CHANNELS_SCAN_CONFIG, 1 + 3), PULSE_CHANNELS_SET_CONFIG, 1 + 1), BATTERY_DEPASSIVATION_CONFIG, 1 + 4), MQTT_SSL_ENABLE, 1 + 1), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_parametersSizeMap, MQTT_DATA_RECEIVE_CONFIG, 1 + 1), MQTT_DATA_SEND_CONFIG, 1 + 5), NBIOT_SSL_CONFIG, 1 + 2), NBIOT_SSL_CACERT_SET, 1 + 4), NBIOT_SSL_CLIENT_CERT_SET, 1 + 4), NBIOT_SSL_CLIENT_KEY_SET, 1 + 4), REPORTING_DATA_CONFIG, 1 + 4), EVENTS_CONFIG, 1 + 4));
    var fourChannelsBitMask = {
      channel1: Math.pow(2, 0),
      channel2: Math.pow(2, 1),
      channel3: Math.pow(2, 2),
      channel4: Math.pow(2, 3)
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
    var getChannelValue = function getChannelValue(buffer) {
      return buffer.getUint8() + 1;
    };
    var setChannelValue = function setChannelValue(buffer, value) {
      if (value < 1) {
        throw new Error('channel must be 1 or greater');
      }
      buffer.setUint8(value - 1);
    };
    var getNbiotSslWrite = function getNbiotSslWrite(buffer) {
      return {
        size: buffer.getUint16(false),
        position: buffer.getUint16(false),
        chunk: buffer.getBytesLeft()
      };
    };
    var setNbiotSslWrite = function setNbiotSslWrite(buffer, parameter) {
      if (parameter.size !== parameter.chunk.length) {
        throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
      }
      buffer.setUint16(parameter.size, false);
      buffer.setUint16(parameter.position, false);
      buffer.setBytes(parameter.chunk);
    };
    var getNbiotSslSet = function getNbiotSslSet(buffer) {
      return {
        crc32: buffer.getUint32(false)
      };
    };
    var setNbiotSslSet = function setNbiotSslSet(buffer, parameter) {
      buffer.setUint32(parameter.crc32, false);
    };
    var deviceParameterConvertersMap = (_deviceParameterConve = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, REPORTING_DATA_INTERVAL, {
      get: function get(buffer) {
        buffer.seek(buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);
        return {
          value: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
        };
      },
      set: function set(buffer, parameter) {
        buffer.seek(buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);
        buffer.setUint8(parameter.value / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
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
          loadTime: buffer.getUint16(false),
          internalResistance: buffer.getUint16(false),
          lowVoltage: buffer.getUint16(false)
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint16(parameter.loadTime, false);
        buffer.setUint16(parameter.internalResistance, false);
        buffer.setUint16(parameter.lowVoltage, false);
      }
    }), BATTERY_MINIMAL_LOAD_TIME, {
      get: function get(buffer) {
        return {
          value: buffer.getUint32(false)
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint32(parameter.value, false);
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
        return {
          spreadFactor: buffer.getUint8(),
          frequency: buffer.getUint24(false) * PARAMETER_RX2_FREQUENCY_COEFFICIENT
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.spreadFactor);
        buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT, false);
      }
    }), ABSOLUTE_DATA, {
      get: function get(buffer) {
        return {
          meterValue: buffer.getUint32(false),
          pulseCoefficient: buffer.getPulseCoefficient(),
          value: buffer.getUint32(false)
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint32(parameter.meterValue, false);
        buffer.setPulseCoefficient(parameter.pulseCoefficient);
        buffer.setUint32(parameter.value, false);
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
          channel: getChannelValue(buffer),
          meterValue: buffer.getUint32(false),
          pulseCoefficient: buffer.getPulseCoefficient(),
          value: buffer.getUint32(false)
        };
      },
      set: function set(buffer, parameter) {
        setChannelValue(buffer, parameter.channel);
        buffer.setUint32(parameter.meterValue, false);
        buffer.setPulseCoefficient(parameter.pulseCoefficient);
        buffer.setUint32(parameter.value, false);
      }
    }), ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL, {
      get: function get(buffer) {
        return {
          channel: getChannelValue(buffer),
          state: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        setChannelValue(buffer, parameter.channel);
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
      get: function get(buffer) {
        var object = toObject(fourChannelsBitMask, buffer.getUint8());
        return {
          channel1: object.channel1,
          channel2: object.channel2,
          channel3: object.channel3,
          channel4: object.channel4
        };
      },
      set: function set(buffer, parameter) {
        var channel1 = parameter.channel1,
          channel2 = parameter.channel2,
          channel3 = parameter.channel3,
          channel4 = parameter.channel4;
        buffer.setUint8(fromObject(fourChannelsBitMask, {
          channel1: channel1,
          channel2: channel2,
          channel3: channel3,
          channel4: channel4
        }));
      }
    }), BATTERY_DEPASSIVATION_CONFIG, {
      get: function get(buffer) {
        return {
          resistanceStartThreshold: buffer.getUint16(false),
          resistanceStopThreshold: buffer.getUint16(false)
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint16(parameter.resistanceStartThreshold, false);
        buffer.setUint16(parameter.resistanceStopThreshold, false);
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
          port: buffer.getUint16(false)
        };
      },
      set: function set(buffer, parameter) {
        buffer.setString(parameter.hostName);
        buffer.setUint16(parameter.port, false);
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
          qos: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.qos);
      }
    }), MQTT_DATA_SEND_CONFIG, {
      get: function get(buffer) {
        return {
          qos: buffer.getUint8(),
          retain: buffer.getUint8(),
          newestSendFirst: buffer.getUint8(),
          sendCountAttempts: buffer.getUint8(),
          sendTimeoutBetweenAttempts: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.qos);
        buffer.setUint8(parameter.retain);
        buffer.setUint8(parameter.newestSendFirst);
        buffer.setUint8(parameter.sendCountAttempts);
        buffer.setUint8(parameter.sendTimeoutBetweenAttempts);
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
    }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deviceParameterConve, NBIOT_SSL_CLIENT_KEY_WRITE, {
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
          enableEvent: buffer.getUint8(),
          sendEvent: buffer.getUint8(),
          saveEvent: buffer.getUint8()
        };
      },
      set: function set(buffer, parameter) {
        buffer.setUint8(parameter.eventId);
        buffer.setUint8(parameter.enableEvent);
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
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
        value += (_byte4 & 0x7f) << 7 * position;
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
      [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(function (_byte5) {
        return _this2.setUint8(_byte5);
      });
    };
    CommandBinaryBuffer.prototype.getLegacyCounterValue = function () {
      return this.getUint24(false);
    };
    CommandBinaryBuffer.prototype.setLegacyCounterValue = function (value) {
      this.setUint24(value, false);
    };
    CommandBinaryBuffer.prototype.getLegacyCounter = function () {
      var _byte6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getUint8();
      return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(_byte6),
        value: this.getLegacyCounterValue()
      };
    };
    CommandBinaryBuffer.prototype.setLegacyCounter = function (counter) {
      var _byte7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(_byte7, counter.isMagneticInfluence));
      this.setLegacyCounterValue(counter.value);
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
      var maxChannel = Math.max.apply(Math, _toConsumableArray(channelList.map(function (_ref) {
        var index = _ref.index;
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
        status = toObject(fourChannelBitMask, this.getUint16());
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
        this.setUint16(fromObject(fourChannelBitMask, status) | 1 << 7);
      } else if (MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1) {
        this.setUint16(fromObject(mtxBitMask, status));
      } else {
        throw new Error('wrong hardwareType');
      }
    };
    CommandBinaryBuffer.prototype.getParameter = function () {
      var id = this.getUint8();
      if (!deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get) {
        throw new Error("parameter ".concat(id, " is not supported"));
      }
      var data = deviceParameterConvertersMap[id].get(this);
      return {
        id: id,
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
      var data = null;
      switch (id) {
        case ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case ABSOLUTE_DATA_MULTI_CHANNEL:
          data = {
            channel: getChannelValue(this)
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
      var id = this.getUint8();
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
      var date = this.getDate();
      var _byte14 = this.getUint8();
      var _this$getHours2 = this.getHours(_byte14),
        hour = _this$getHours2.hour;
      var counter = {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(_byte14),
        value: this.getLegacyCounterValue()
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
      var date = getDateFromTime2000(hourCounter.startTime2000);
      var hour = date.getUTCHours();
      this.setDate(date);
      this.setHours(hour, 1);
      this.seek(this.offset - 1);
      var _byte15 = this.getUint8();
      this.seek(this.offset - 1);
      this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(_byte15, hourCounter.counter.isMagneticInfluence));
      this.setLegacyCounterValue(hourCounter.counter.value);
      hourCounter.diff.forEach(function (diffItem) {
        return _this12.setLegacyHourDiff(diffItem);
      });
    };
    CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiffExtended = function () {
      var _this13 = this;
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
          value: value,
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
      var date = getDateFromTime2000(parameters.startTime2000);
      this.setDate(date);
      this.setUint8(parameters.hour);
      this.setUint8(parameters.hours);
      this.setChannels(parameters.channelList);
      parameters.channelList.forEach(function (_ref5) {
        var value = _ref5.value,
          diff = _ref5.diff;
        _this14.setExtendedValue(value);
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

    var id$S = 0x1e;
    var name$S = 'dataSegment';
    var headerSize$S = 2;
    var COMMAND_BODY_MIN_SIZE$3 = 2;
    var examples$S = {
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
        bytes: [0x1e, 0x07, 0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04]
      }
    };
    var fromBytes$S = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getDataSegment();
    };
    var toBytes$S = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$3 + parameters.data.length);
      buffer.setDataSegment(parameters);
      return toBytes$U(id$S, buffer.data);
    };
    var toJson$1 = function toJson(parameters, options) {
      return JSON.stringify(_objectSpread2(_objectSpread2({}, parameters), {}, {
        data: getStringFromBytes(parameters.data, options)
      }));
    };

    var dataSegment$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$S,
        id: id$S,
        name: name$S,
        toBytes: toBytes$S,
        toJson: toJson$1
    });

    var id$R = 0x06;
    var name$R = 'getArchiveDays';
    var headerSize$R = 2;
    var COMMAND_BODY_SIZE$t = 3;
    var examples$R = {
      '1 day counter from 2023.03.10 00:00:00 GMT': {
        id: id$R,
        name: name$R,
        headerSize: headerSize$R,
        parameters: {
          startTime2000: 731721600,
          days: 1
        },
        bytes: [0x06, 0x03, 0x2e, 0x6a, 0x01]
      }
    };
    var fromBytes$R = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$t) {
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
    var toBytes$R = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$t);
      var startTime2000 = parameters.startTime2000,
        days = parameters.days;
      var date = getDateFromTime2000(startTime2000);
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

    var id$Q = 0x1b;
    var name$Q = 'getArchiveDaysMc';
    var headerSize$Q = 2;
    var COMMAND_BODY_SIZE$s = 4;
    var examples$Q = {
      '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
        id: id$Q,
        name: name$Q,
        headerSize: headerSize$Q,
        parameters: {
          startTime2000: 731721600,
          days: 1,
          channelList: [1]
        },
        bytes: [0x1b, 0x04, 0x2e, 0x6a, 0x01, 0x01]
      }
    };
    var fromBytes$Q = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$s) {
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
    var toBytes$Q = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$s);
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

    var id$P = 0x0b;
    var name$P = 'getArchiveEvents';
    var headerSize$P = 2;
    var COMMAND_BODY_SIZE$r = 5;
    var examples$P = {
      'request 4 events from 2023.04.03 14:01:17 GMT': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        parameters: {
          startTime2000: 733845677,
          events: 4
        },
        bytes: [0x0b, 0x05, 0x2b, 0xbd, 0x98, 0xad, 0x04]
      }
    };
    var fromBytes$P = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$r) {
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
    var toBytes$P = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        events = parameters.events;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$r);
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

    var id$O = 0x05;
    var name$O = 'getArchiveHours';
    var headerSize$O = 2;
    var COMMAND_BODY_SIZE$q = 4;
    var examples$O = {
      '2 hours counter from 2023.12.23 12:00:00 GMT': {
        id: id$O,
        name: name$O,
        headerSize: headerSize$O,
        parameters: {
          startTime2000: 756648000,
          hours: 2
        },
        bytes: [0x05, 0x04, 0x2f, 0x97, 0x0c, 0x02]
      }
    };
    var fromBytes$O = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$q) {
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
    var toBytes$O = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$q);
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
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

    var id$N = 0x1a;
    var name$N = 'getArchiveHoursMc';
    var headerSize$N = 2;
    var COMMAND_BODY_SIZE$p = 4;
    var examples$N = {
      'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$N,
        name: name$N,
        headerSize: headerSize$N,
        parameters: {
          startTime2000: 756648000,
          hours: 2,
          channelList: [1]
        },
        bytes: [0x1a, 0x04, 0x2f, 0x97, 0x2c, 0x01]
      }
    };
    var fromBytes$N = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$p) {
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
    var toBytes$N = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$p);
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

    var id$M = 0x051f;
    var name$M = 'getBatteryStatus';
    var headerSize$M = 3;
    var COMMAND_BODY_SIZE$o = 0;
    var examples$M = {
      'simple request': {
        id: id$M,
        name: name$M,
        headerSize: headerSize$M,
        parameters: {},
        bytes: [0x1f, 0x05, 0x00]
      }
    };
    var fromBytes$M = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$o) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$M = function toBytes() {
      return toBytes$U(id$M);
    };

    var getBatteryStatus$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$M,
        id: id$M,
        name: name$M,
        toBytes: toBytes$M
    });

    var id$L = 0x07;
    var name$L = 'getCurrent';
    var headerSize$L = 2;
    var COMMAND_BODY_SIZE$n = 0;
    var examples$L = {
      'simple request': {
        id: id$L,
        headerSize: headerSize$L,
        name: name$L,
        parameters: {},
        bytes: [0x07, 0x00]
      }
    };
    var fromBytes$L = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$n) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$L = function toBytes() {
      return toBytes$U(id$L);
    };

    var getCurrent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$L,
        fromBytes: fromBytes$L,
        headerSize: headerSize$L,
        id: id$L,
        name: name$L,
        toBytes: toBytes$L
    });

    var id$K = 0x18;
    var name$K = 'getCurrentMc';
    var headerSize$K = 2;
    var COMMAND_BODY_SIZE$m = 0;
    var examples$K = {
      'simple request': {
        id: id$K,
        name: name$K,
        headerSize: headerSize$K,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$K = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$m) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$K = function toBytes() {
      return toBytes$U(id$K);
    };

    var getCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        name: name$K,
        toBytes: toBytes$K
    });

    var id$J = 0x0d1f;
    var name$J = 'getExAbsArchiveDaysMc';
    var headerSize$J = 3;
    var COMMAND_BODY_SIZE$l = 4;
    var examples$J = {
      '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT': {
        id: id$J,
        name: name$J,
        headerSize: headerSize$J,
        parameters: {
          startTime2000: 756691200,
          days: 1,
          channelList: [1]
        },
        bytes: [0x1f, 0x0d, 0x04, 0x2f, 0x98, 0x01, 0x01]
      }
    };
    var fromBytes$J = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$l) {
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
    var toBytes$J = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$l);
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

    var id$I = 0x0c1f;
    var name$I = 'getExAbsArchiveHoursMc';
    var headerSize$I = 3;
    var COMMAND_BODY_SIZE$k = 4;
    var examples$I = {
      '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$I,
        name: name$I,
        headerSize: headerSize$I,
        parameters: {
          channelList: [1],
          hours: 1,
          startTime2000: 756648000
        },
        bytes: [0x1f, 0x0c, 0x04, 0x2f, 0x97, 0x0c, 0x01]
      }
    };
    var fromBytes$I = function fromBytes(data) {
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
    var toBytes$I = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$k);
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

    var id$H = 0x301f;
    var name$H = 'getArchiveHoursMcEx';
    var headerSize$H = 3;
    var COMMAND_BODY_SIZE$j = 5;
    var examples$H = {
      '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        parameters: {
          startTime2000: 756648000,
          hour: 12,
          hours: 2,
          channelList: [1]
        },
        bytes: [0x1f, 0x30, 0x05, 0x2f, 0x97, 0x0c, 0x02, 0x01]
      }
    };
    var fromBytes$H = function fromBytes(data) {
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
    var toBytes$H = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$j);
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

    var id$G = 0x0f1f;
    var name$G = 'getExAbsCurrentMc';
    var headerSize$G = 3;
    var COMMAND_BODY_SIZE$i = 0;
    var examples$G = {
      'simple request': {
        id: id$G,
        name: name$G,
        headerSize: headerSize$G,
        parameters: {},
        bytes: [0x1f, 0x0f, 0x00]
      }
    };
    var fromBytes$G = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$i) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$G = function toBytes() {
      return toBytes$U(id$G);
    };

    var getExAbsCurrentMc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$G,
        id: id$G,
        name: name$G,
        toBytes: toBytes$G
    });

    var id$F = 0x021f;
    var name$F = 'getLmicInfo';
    var headerSize$F = 3;
    var COMMAND_BODY_SIZE$h = 0;
    var examples$F = {
      'simple request': {
        id: id$F,
        name: name$F,
        headerSize: headerSize$F,
        parameters: {},
        bytes: [0x1f, 0x02, 0x00]
      }
    };
    var fromBytes$F = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$h) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$F = function toBytes() {
      return toBytes$U(id$F);
    };

    var getLmicInfo$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$F,
        id: id$F,
        name: name$F,
        toBytes: toBytes$F
    });

    var id$E = 0x04;
    var name$E = 'getParameter';
    var headerSize$E = 2;
    var examples$E = {
      'request absolute data (not multichannel device)': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 23,
          data: null
        },
        bytes: [0x04, 0x01, 0x17]
      },
      'request for state of absolute data (not multichannel device)': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 24,
          data: null
        },
        bytes: [0x04, 0x01, 0x18]
      },
      'request for state of absolute for multichannel device (1 channel)': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 29,
          data: {
            channel: 1
          }
        },
        bytes: [0x04, 0x02, 0x1d, 0x00]
      },
      'request for state of absolute data for multichannel device (1 channel)': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 30,
          data: {
            channel: 1
          }
        },
        bytes: [0x04, 0x02, 0x1e, 0x00]
      },
      'request for configuration for specific reporting data type': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 49,
          data: {
            dataType: 0
          }
        },
        bytes: [0x04, 0x02, 0x31, 0x00]
      },
      'request for configuration for specific event id': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        parameters: {
          id: 50,
          data: {
            eventId: 1
          }
        },
        bytes: [0x04, 0x02, 0x32, 0x01]
      }
    };
    var fromBytes$E = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getRequestParameter();
    };
    var toBytes$E = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getRequestParameterSize(parameters));
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

    var id$D = 0x14;
    var name$D = 'getStatus';
    var headerSize$D = 2;
    var COMMAND_BODY_SIZE$g = 0;
    var examples$D = {
      'simple request': {
        id: id$D,
        name: name$D,
        headerSize: headerSize$D,
        parameters: {},
        bytes: [0x14, 0x00]
      }
    };
    var fromBytes$D = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$g) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$D = function toBytes() {
      return toBytes$U(id$D);
    };

    var getStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$D,
        id: id$D,
        name: name$D,
        toBytes: toBytes$D
    });

    var id$C = 0x09;
    var name$C = 'getTime2000';
    var headerSize$C = 2;
    var COMMAND_BODY_SIZE$f = 0;
    var examples$C = {
      'simple request': {
        id: id$C,
        name: name$C,
        headerSize: headerSize$C,
        parameters: {},
        bytes: [0x09, 0x00]
      }
    };
    var fromBytes$C = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$f) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$C = function toBytes() {
      return toBytes$U(id$C, []);
    };

    var getTime2000 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$C,
        id: id$C,
        name: name$C,
        toBytes: toBytes$C
    });

    var id$B = 0x03;
    var name$B = 'setParameter';
    var headerSize$B = 2;
    var examples$B = {
      'set minimal reporting data interval to 1 hour': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 1,
          data: {
            value: 3600
          }
        },
        bytes: [0x03, 0x05, 0x01, 0x00, 0x00, 0x00, 0x06]
      },
      'set day checkout hour to 12:00': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 4,
          data: {
            value: 12
          }
        },
        bytes: [0x03, 0x02, 0x04, 0x0c]
      },
      'set reporting data type to "day"': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 5,
          data: {
            type: 1
          }
        },
        bytes: [0x03, 0x02, 0x05, 0x01]
      },
      'set "with confirmation" for delivery of priority data': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 8,
          data: {
            value: 0
          }
        },
        bytes: [0x03, 0x02, 0x08, 0x00]
      },
      'set activation method to "ABP"': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 9,
          data: {
            type: 1
          }
        },
        bytes: [0x03, 0x02, 0x09, 0x01]
      },
      'set battery depassivation info': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 10,
          data: {
            loadTime: 100,
            internalResistance: 3222,
            lowVoltage: 233
          }
        },
        bytes: [0x03, 0x07, 0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9]
      },
      'set battery minimal load time to "100"': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 11,
          data: {
            value: 100
          }
        },
        bytes: [0x03, 0x05, 0x0b, 0x00, 0x00, 0x00, 0x64]
      },
      'enable 1-4 channels, and disable serial channel for device': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 13,
          data: {
            value: 0
          }
        },
        bytes: [0x03, 0x02, 0x0d, 0x00]
      },
      'set spread factor and frequency for RX2 window': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 18,
          data: {
            spreadFactor: 5,
            frequency: 20000
          }
        },
        bytes: [0x03, 0x05, 0x12, 0x05, 0x00, 0x00, 0xc8]
      },
      'set absolute data (not multichannel device)': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 23,
          data: {
            meterValue: 204,
            pulseCoefficient: 100,
            value: 2023
          }
        },
        bytes: [0x03, 0x0a, 0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7]
      },
      'enable absolute data (not multichannel device)': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 24,
          data: {
            state: 1
          }
        },
        bytes: [0x03, 0x02, 0x18, 0x01]
      },
      'set device serial number': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 25,
          data: {
            value: '1b 0a 3e dc 3e 22'
          }
        },
        bytes: [0x03, 0x07, 0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22]
      },
      'set device geolocation': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 26,
          data: {
            latitude: 34.43,
            longitude: 43.43,
            altitude: 23
          }
        },
        bytes: [0x03, 0x0b, 0x1a, 0x52, 0xb8, 0x09, 0x42, 0x52, 0xb8, 0x2d, 0x42, 0x17, 0x00]
      },
      'set interval to send EXTRA FRAME': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 28,
          data: {
            value: 3600
          }
        },
        bytes: [0x03, 0x03, 0x1c, 0x10, 0x0e]
      },
      'set absolute data for multichannel device (1 channel)': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 29,
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
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 30,
          data: {
            channel: 2,
            state: 1
          }
        },
        bytes: [0x03, 0x03, 0x1e, 0x01, 0x01]
      },
      'set pulse channels config': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 31,
          data: {
            channelList: [1, 4],
            pullUpTime: 18,
            scanTime: 23
          }
        },
        bytes: [0x03, 0x04, 0x1f, 0x09, 0x12, 0x17]
      },
      'enable channels: 1, 2, disable channels: 3, 4, for pulse device': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 32,
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
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 33,
          data: {
            resistanceStartThreshold: 36000,
            resistanceStopThreshold: 26000
          }
        },
        bytes: [0x03, 0x05, 0x21, 0x8c, 0xa0, 0x65, 0x90]
      },
      'set nbiot bands': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        parameters: {
          id: 52,
          data: {
            bands: [3, 8, 20]
          }
        },
        bytes: [0x03, 0x05, 0x34, 0x03, 0x03, 0x08, 0x14]
      }
    };
    var fromBytes$B = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getParameter();
    };
    var toBytes$B = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getParameterSize(parameters));
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

    var id$A = 0x02;
    var name$A = 'setTime2000';
    var headerSize$A = 2;
    var COMMAND_BODY_SIZE$e = 5;
    var examples$A = {
      'set time to 2023.04.03 14:01:17 GMT': {
        id: id$A,
        headerSize: headerSize$A,
        parameters: {
          sequenceNumber: 78,
          seconds: 733845677
        },
        bytes: [0x02, 0x05, 0x4e, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes$A = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$e) {
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
    var toBytes$A = function toBytes(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        seconds = parameters.seconds;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$e, false);
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

    var id$z = 0x19;
    var name$z = 'softRestart';
    var headerSize$z = 2;
    var COMMAND_BODY_SIZE$d = 0;
    var examples$z = {
      'simple request': {
        id: id$z,
        name: name$z,
        headerSize: headerSize$z,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$z = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$d) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$z = function toBytes() {
      return toBytes$U(id$z);
    };

    var softRestart$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$z,
        fromBytes: fromBytes$z,
        headerSize: headerSize$z,
        id: id$z,
        name: name$z,
        toBytes: toBytes$z
    });

    var id$y = 0x2a1f;
    var name$y = 'writeImage';
    var headerSize$y = 3;
    var COMMAND_BODY_MIN_SIZE$2 = 4;
    var examples$y = {
      'write image': {
        id: id$y,
        name: name$y,
        headerSize: headerSize$y,
        parameters: {
          offset: 64,
          data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
        },
        bytes: [0x1f, 0x2a, 0x14, 0x00, 0x00, 0x00, 0x40, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
      }
    };
    var fromBytes$y = function fromBytes(data) {
      if (data.length < COMMAND_BODY_MIN_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      var offset = buffer.getUint32(false);
      return {
        offset: offset,
        data: data.slice(COMMAND_BODY_MIN_SIZE$2)
      };
    };
    var toBytes$y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$2);
      buffer.setUint32(parameters.offset, false);
      buffer.setBytes(parameters.data);
      return toBytes$U(id$y, buffer.data);
    };
    var toJson = function toJson(parameters) {
      return JSON.stringify(parameters);
    };

    var writeImage$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$y,
        id: id$y,
        name: name$y,
        toBytes: toBytes$y,
        toJson: toJson
    });

    var id$x = 0x2b1f;
    var name$x = 'verifyImage';
    var headerSize$x = 3;
    var COMMAND_BODY_SIZE$c = 0;
    var examples$x = {
      'simple request': {
        id: id$x,
        name: name$x,
        headerSize: headerSize$x,
        parameters: {},
        bytes: [0x1f, 0x2b, 0x00]
      }
    };
    var fromBytes$x = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$c) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$x = function toBytes() {
      return toBytes$U(id$x);
    };

    var verifyImage$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$x,
        fromBytes: fromBytes$x,
        headerSize: headerSize$x,
        id: id$x,
        name: name$x,
        toBytes: toBytes$x
    });

    var id$w = 0x2c1f;
    var name$w = 'updateRun';
    var headerSize$w = 3;
    var COMMAND_BODY_SIZE$b = 0;
    var examples$w = {
      'simple request': {
        id: id$w,
        name: name$w,
        headerSize: headerSize$w,
        parameters: {},
        bytes: [0x1f, 0x2c, 0x00]
      }
    };
    var fromBytes$w = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$b) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$w = function toBytes() {
      return toBytes$U(id$w);
    };

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

    var id$v = 0x0c;
    var name$v = 'correctTime2000';
    var headerSize$v = 2;
    var COMMAND_BODY_SIZE$a = 1;
    var examples$v = {
      'time correction failure': {
        id: id$v,
        name: name$v,
        headerSize: headerSize$v,
        parameters: {
          status: 0
        },
        bytes: [0x0c, 0x01, 0x00]
      },
      'time correction success': {
        id: id$v,
        name: name$v,
        headerSize: headerSize$v,
        parameters: {
          status: 1
        },
        bytes: [0x0c, 0x01, 0x01]
      }
    };
    var fromBytes$v = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$a) {
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
    var toBytes$v = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$a, false);
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

    var id$u = 0x07;
    var name$u = 'current';
    var headerSize$u = 2;
    var COMMAND_BODY_MAX_SIZE$e = 4;
    var examples$u = {
      'simple response channels': {
        id: id$u,
        name: name$u,
        headerSize: headerSize$u,
        parameters: {
          isMagneticInfluence: true,
          value: 342
        },
        bytes: [0x07, 0x04, 0x80, 0x00, 0x01, 0x56]
      }
    };
    var fromBytes$u = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$e) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyCounter();
    };
    var toBytes$u = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$e);
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

    var id$t = 0x18;
    var name$t = 'currentMc';
    var headerSize$t = 2;
    var COMMAND_BODY_MAX_SIZE$d = 37;
    var examples$t = {
      '4 first channels': {
        id: id$t,
        name: name$t,
        headerSize: headerSize$t,
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
      'single channel 2': {
        id: id$t,
        name: name$t,
        headerSize: headerSize$t,
        parameters: {
          channelList: [{
            value: 50,
            index: 2
          }]
        },
        bytes: [0x18, 0x02, 0x02, 0x32]
      },
      'channels 5, 6, 12': {
        id: id$t,
        name: name$t,
        headerSize: headerSize$t,
        parameters: {
          channelList: [{
            value: 8146,
            index: 5
          }, {
            value: 164,
            index: 6
          }, {
            value: 75,
            index: 12
          }]
        },
        bytes: [0x18, 0x07, 0xb0, 0x10, 0xd2, 0x3f, 0xa4, 0x01, 0x4b]
      }
    };
    var fromBytes$t = function fromBytes(data) {
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
    var toBytes$t = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$d);
      var channelList = parameters.channelList;
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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
        toBytes: toBytes$S,
        toJson: toJson$1
    });

    var id$s = 0x20;
    var name$s = 'day';
    var headerSize$s = 1;
    var COMMAND_BODY_SIZE$9 = 6;
    var examples$s = {
      'day value for 2023.12.23 00:00:00 GMT': {
        id: id$s,
        name: name$s,
        headerSize: headerSize$s,
        parameters: {
          value: 122,
          isMagneticInfluence: true,
          startTime2000: 756604800
        },
        bytes: [0x26, 0x2f, 0x97, 0x80, 0x00, 0x00, 0x7a]
      }
    };
    var fromBytes$s = function fromBytes(data) {
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
    var toBytes$s = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$9);
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

    var id$r = 0x16;
    var name$r = 'dayMc';
    var headerSize$r = 2;
    var COMMAND_BODY_MAX_SIZE$c = 32;
    var examples$r = {
      '4 channels at 2023.12.23 00:00:00 GMT': {
        id: id$r,
        name: name$r,
        headerSize: headerSize$r,
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
    var fromBytes$r = function fromBytes(data) {
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
    var toBytes$r = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$c);
      var channelList = parameters.channelList,
        startTime2000 = parameters.startTime2000;
      buffer.setDate(startTime2000);
      buffer.setChannels(channelList);
      channelList.forEach(function (_ref) {
        var value = _ref.value;
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

    var id$q = 0x0f1f;
    var name$q = 'exAbsCurrentMc';
    var headerSize$q = 3;
    var COMMAND_BODY_MAX_SIZE$b = 87;
    var examples$q = {
      'absolute current value from channel 3': {
        id: id$q,
        name: name$q,
        headerSize: headerSize$q,
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
    var fromBytes$q = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return {
        channelList: buffer.getChannelsWithAbsoluteValues()
      };
    };
    var toBytes$q = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$b);
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

    var id$p = 0x0b1f;
    var name$p = 'exAbsDayMc';
    var headerSize$p = 3;
    var COMMAND_BODY_MAX_SIZE$a = 89;
    var examples$p = {
      'absolute day value for 2023.03.10 00:00:00 GMT': {
        id: id$p,
        name: name$p,
        headerSize: headerSize$p,
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
    var fromBytes$p = function fromBytes(data) {
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
    var toBytes$p = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$a);
      var startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$o = 0x0a1f;
    var name$o = 'exAbsHourMc';
    var headerSize$o = 3;
    var COMMAND_BODY_MAX_SIZE$9 = 168;
    var examples$o = {
      '1 channel at 2023.03.10 12:00:00 GMT': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
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
    var fromBytes$o = function fromBytes(data) {
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
    var toBytes$o = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$9);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
      var date = getDateFromTime2000(startTime2000);
      var hour = date.getUTCHours();
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

    var id$n = 0x06;
    var name$n = 'getArchiveDays';
    var headerSize$n = 2;
    var COMMAND_BODY_MIN_SIZE$1 = 2;
    var DAY_COUNTER_SIZE = 4;
    var examples$n = {
      'get day values from 2001.03.10': {
        id: id$n,
        name: name$n,
        headerSize: headerSize$n,
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
    var fromBytes$n = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      var date = buffer.getDate();
      var dayList = [];
      while (buffer.offset < buffer.data.length) {
        dayList.push(buffer.getLegacyCounter());
      }
      return {
        startTime2000: getTime2000FromDate(date),
        dayList: dayList
      };
    };
    var toBytes$n = function toBytes(parameters) {
      var startTime2000 = parameters.startTime2000,
        dayList = parameters.dayList;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE$1 + dayList.length * DAY_COUNTER_SIZE);
      buffer.setDate(startTime2000);
      dayList.forEach(function (dayCounter) {
        return buffer.setLegacyCounter(dayCounter);
      });
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

    var id$m = 0x1b;
    var name$m = 'getArchiveDaysMc';
    var headerSize$m = 2;
    var COMMAND_BODY_MAX_SIZE$8 = 5104;
    var examples$m = {
      'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
        id: id$m,
        name: name$m,
        headerSize: headerSize$m,
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
        id: id$m,
        name: name$m,
        headerSize: headerSize$m,
        parameters: {
          startTime2000: 339897600,
          days: 1,
          channelList: [{
            dayList: [0],
            index: 1
          }]
        },
        bytes: [0x1b, 0x05, 0x15, 0x49, 0x01, 0x01, 0x00]
      }
    };
    var fromBytes$m = function fromBytes(data) {
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
    var toBytes$m = function toBytes(parameters) {
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

    var id$l = 0x0b;
    var name$l = 'getArchiveEvents';
    var headerSize$l = 2;
    var COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;
    var examples$l = {
      '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
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
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
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
    var fromBytes$l = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data, false);
      var eventList = [];
      while (buffer.bytesLeft > 0) {
        eventList.push(getEvent(buffer));
      }
      return {
        eventList: eventList
      };
    };
    function toBytes$l(parameters) {
      var eventList = parameters.eventList;
      var buffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE, false);
      eventList.forEach(function (event) {
        return setEvent(buffer, event);
      });
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

    var id$k = 0x05;
    var name$k = 'getArchiveHours';
    var headerSize$k = 2;
    var examples$k = {
      '1 hour archive from 2023.12.23 12:00:00 GMT': {
        id: id$k,
        name: name$k,
        headerSize: headerSize$k,
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
    var fromBytes$k = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyHourCounterWithDiff();
    };
    var toBytes$k = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
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

    var id$j = 0x1a;
    var name$j = 'getArchiveHoursMc';
    var headerSize$j = 2;
    var COMMAND_BODY_MAX_SIZE$7 = 164;
    var examples$j = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
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
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
        parameters: {
          startTime2000: 752889600,
          hours: 0,
          channelList: []
        },
        bytes: [0x1a, 0x04, 0x2f, 0x6a, 0x00, 0x00]
      }
    };
    var fromBytes$j = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$7) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$j = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$7);
      var hours = parameters.hours,
        startTime2000 = parameters.startTime2000,
        channelList = parameters.channelList;
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

    var id$i = 0x301f;
    var name$i = 'getArchiveHoursMcEx';
    var headerSize$i = 3;
    var COMMAND_BODY_MAX_SIZE$6 = 164;
    var examples$i = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
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
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        parameters: {
          startTime2000: 752889600,
          hour: 0,
          hours: 0,
          channelList: []
        },
        bytes: [0x1f, 0x30, 0x05, 0x2f, 0x6a, 0x00, 0x00, 0x00]
      }
    };
    var fromBytes$i = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$6) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiffExtended();
    };
    var toBytes$i = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$6);
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

    var id$h = 0x051f;
    var name$h = 'getBatteryStatus';
    var headerSize$h = 3;
    var COMMAND_BODY_SIZE$8 = 11;
    var examples$h = {
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
        bytes: [0x1f, 0x05, 0x0b, 0x10, 0x0e, 0x10, 0x0e, 0x0a, 0x04, 0x0f, 0x29, 0x00, 0x22, 0x00]
      }
    };
    var fromBytes$h = function fromBytes(data) {
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
    var toBytes$h = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$8);
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

    var id$g = 0x0d1f;
    var name$g = 'getExAbsArchiveDaysMc';
    var headerSize$g = 3;
    var COMMAND_BODY_MAX_SIZE$5 = 6124;
    var examples$g = {
      'archive days values at 4 channel from 2023.03.10 00:00:00 GMT': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
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
    var fromBytes$g = function fromBytes(data) {
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
          dayList.push(buffer.getExtendedValue());
        }
      });
      return {
        channelList: channelList,
        days: days,
        startTime2000: getTime2000FromDate(date)
      };
    };
    var toBytes$g = function toBytes(parameters) {
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

    var id$f = 0x0c1f;
    var name$f = 'getExAbsArchiveHoursMc';
    var headerSize$f = 3;
    var COMMAND_BODY_MAX_SIZE$4 = 164;
    var examples$f = {
      '4 channels at 2023.12.23 12:00:00 GMT': {
        id: id$f,
        name: name$f,
        headerSize: headerSize$f,
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
        id: id$f,
        name: name$f,
        headerSize: headerSize$f,
        parameters: {
          startTime2000: 752889600,
          hours: 0,
          channelList: []
        },
        bytes: [0x1f, 0x0c, 0x04, 0x2f, 0x6a, 0x00, 0x00]
      }
    };
    var fromBytes$f = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$f = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$4);
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

    var id$e = 0x021f;
    var name$e = 'getLmicInfo';
    var headerSize$e = 3;
    var COMMAND_BODY_SIZE$7 = 2;
    var lmicCapabilitiesBitMask = {
      isMulticastSupported: 1 << 0,
      isFragmentedDataSupported: 1 << 1
    };
    var examples$e = {
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
        bytes: [0x1f, 0x02, 0x02, 0x01, 0x05]
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
        bytes: [0x1f, 0x02, 0x02, 0x03, 0x08]
      }
    };
    var fromBytes$e = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$7) {
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
    var toBytes$e = function toBytes(parameters) {
      var capabilities = parameters.capabilities,
        version = parameters.version;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$7);
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

    var id$d = 0x04;
    var name$d = 'getParameter';
    var headerSize$d = 2;
    var examples$d = {
      'reporting data interval': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 1,
          data: {
            value: 2400
          }
        },
        bytes: [0x04, 0x05, 0x01, 0x00, 0x00, 0x00, 0x04]
      },
      'absolute data (not multichannel device)': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 23,
          data: {
            meterValue: 204,
            pulseCoefficient: 100,
            value: 2023
          }
        },
        bytes: [0x04, 0x0a, 0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7]
      },
      'state of absolute data (not multichannel device)': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 24,
          data: {
            state: 1
          }
        },
        bytes: [0x04, 0x02, 0x18, 0x01]
      },
      'absolute data for multichannel device (1 channel)': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 29,
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
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 30,
          data: {
            channel: 2,
            state: 1
          }
        },
        bytes: [0x04, 0x03, 0x1e, 0x01, 0x01]
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
        bytes: [0x04, 0x12, 0x33, 0x10, 0x42, 0x43, 0x36, 0x36, 0x30, 0x4B, 0x47, 0x4C, 0x41, 0x41, 0x52, 0x30, 0x31, 0x41, 0x30, 0x35]
      },
      'nbiot bands': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        parameters: {
          id: 52,
          data: {
            bands: [3, 20]
          }
        },
        bytes: [0x04, 0x04, 0x34, 0x02, 0x03, 0x14]
      }
    };
    var fromBytes$d = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getResponseParameter();
    };
    var toBytes$d = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getResponseParameterSize(parameters));
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

    var id$c = 0x40;
    var name$c = 'hour';
    var headerSize$c = 1;
    var examples$c = {
      '1 hour from 2023.12.23 12:00:00 GMT': {
        id: id$c,
        name: name$c,
        headerSize: headerSize$c,
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
    var fromBytes$c = function fromBytes(data) {
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getLegacyHourCounterWithDiff();
    };
    var toBytes$c = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));
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

    var id$b = 0x17;
    var name$b = 'hourMc';
    var headerSize$b = 2;
    var COMMAND_BODY_MAX_SIZE$3 = 164;
    var examples$b = {
      '4 first channels at 2023.12.23 12:00:00 GMT': {
        id: id$b,
        name: name$b,
        headerSize: headerSize$b,
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
    var fromBytes$b = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$3) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiff();
    };
    var toBytes$b = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$3);
      var startTime2000 = parameters.startTime2000,
        hours = parameters.hours,
        channelList = parameters.channelList;
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

    var id$a = 0x311f;
    var name$a = 'hourMcEx';
    var headerSize$a = 3;
    var COMMAND_BODY_MAX_SIZE$2 = 5125;
    var examples$a = {
      '1 channel at 2023.12.23 12:00:00 GMT': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
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
    var fromBytes$a = function fromBytes(data) {
      if (data.length > COMMAND_BODY_MAX_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      var buffer = new CommandBinaryBuffer(data);
      return buffer.getChannelsValuesWithHourDiffExtended();
    };
    var toBytes$a = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE$2);
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

    var id$9 = 0x60;
    var name$9 = 'lastEvent';
    var headerSize$9 = 1;
    var examples$9 = {
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
        bytes: [0x62, 0x20, 0x09]
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
        bytes: [0x63, 0x10, 0xe1, 0x01]
      },
      'status for IMP4EU (all false)': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
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
        bytes: [0x63, 0x30, 0x83, 0x0a]
      }
    };
    var fromBytes$9 = function fromBytes(data, config) {
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
    var toBytes$9 = function toBytes(parameters, config) {
      if (!config.hardwareType) {
        throw new Error('hardwareType in config is mandatory');
      }
      var buffer = new CommandBinaryBuffer(1 + getEventStatusSize(config.hardwareType));
      var sequenceNumber = parameters.sequenceNumber,
        status = parameters.status;
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

    var id$8 = 0x15;
    var name$8 = 'newEvent';
    var headerSize$8 = 2;
    var COMMAND_BODY_MAX_SIZE$1 = 14;
    var MTX_ADDRESS_SIZE = 8;
    var examples$8 = {
      'event for MAGNET_ON': {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
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
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
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
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
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
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
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
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
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
    var fromBytes$8 = function fromBytes(data) {
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
          throw new Error("Event ".concat(id$8, " is not supported"));
      }
      return {
        id: eventId,
        sequenceNumber: sequenceNumber,
        data: eventData
      };
    };
    var toBytes$8 = function toBytes(parameters) {
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
          throw new Error("Event ".concat(id$8, " is not supported"));
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

    var id$7 = 0x03;
    var name$7 = 'setParameter';
    var headerSize$7 = 2;
    var COMMAND_BODY_SIZE$6 = 2;
    var examples$7 = {
      'activation method set successfully': {
        id: id$7,
        name: name$7,
        headerSize: headerSize$7,
        parameters: {
          id: 9,
          status: 1
        },
        bytes: [0x03, 0x02, 0x09, 0x01]
      },
      'configuration for battery depassivation set successfully': {
        id: id$7,
        name: name$7,
        headerSize: headerSize$7,
        parameters: {
          id: 33,
          status: 1
        },
        bytes: [0x03, 0x02, 0x21, 0x01]
      }
    };
    var fromBytes$7 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$6) {
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
    var toBytes$7 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$6);
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

    var id$6 = 0x02;
    var name$6 = 'setTime2000';
    var headerSize$6 = 2;
    var COMMAND_BODY_SIZE$5 = 1;
    var examples$6 = {
      success: {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
        parameters: {
          status: 1
        },
        bytes: [0x02, 0x01, 0x01]
      }
    };
    var fromBytes$6 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$5) {
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
    var toBytes$6 = function toBytes(parameters) {
      var status = parameters.status;
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE$5, false);
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

    var id$5 = 0x19;
    var name$5 = 'softRestart';
    var headerSize$5 = 2;
    var COMMAND_BODY_SIZE$4 = 0;
    var examples$5 = {
      'simple response': {
        id: id$5,
        name: name$5,
        headerSize: headerSize$5,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$5 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$4) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$5 = function toBytes() {
      return toBytes$U(id$5);
    };

    var softRestart = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$5,
        fromBytes: fromBytes$5,
        headerSize: headerSize$5,
        id: id$5,
        name: name$5,
        toBytes: toBytes$5
    });

    var id$4 = 0x14;
    var name$4 = 'status';
    var headerSize$4 = 2;
    var COMMAND_BODY_MAX_SIZE = 20;
    var UNKNOWN_BATTERY_RESISTANCE = 65535;
    var UNKNOWN_BATTERY_CAPACITY = 255;
    var examples$4 = {
      'status for GASI3 (old)': {
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
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
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
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
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
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
    var fromBytes$4 = function fromBytes(bytes) {
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
          throw new Error("".concat(id$4, ": hardware type ").concat(hardware.type, " is not supported"));
      }
      return {
        software: software,
        hardware: hardware,
        data: data
      };
    };
    var toBytes$4 = function toBytes(parameters) {
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
          throw new Error("".concat(id$4, ": hardware type ").concat(hardware.type, " is not supported"));
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

    var id$3 = 0x09;
    var name$3 = 'time2000';
    var headerSize$3 = 2;
    var COMMAND_BODY_SIZE$3 = 5;
    var examples$3 = {
      'time is 2023.04.03 14:01:17 GMT': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        parameters: {
          sequenceNumber: 77,
          time2000: 733845677
        },
        bytes: [0x09, 0x05, 0x4d, 0x2b, 0xbd, 0x98, 0xad]
      }
    };
    var fromBytes$3 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$3) {
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
    function toBytes$3(parameters) {
      var sequenceNumber = parameters.sequenceNumber,
        time2000 = parameters.time2000;
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE$3);
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

    var id$2 = 0x2c1f;
    var name$2 = 'updateRun';
    var headerSize$2 = 3;
    var COMMAND_BODY_SIZE$2 = 0;
    var examples$2 = {
      'simple response': {
        id: id$2,
        name: name$2,
        headerSize: headerSize$2,
        parameters: {},
        bytes: [0x1f, 0x2c, 0x00]
      }
    };
    var fromBytes$2 = function fromBytes(data) {
      if (data.length !== COMMAND_BODY_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(data.length, "."));
      }
      return {};
    };
    var toBytes$2 = function toBytes() {
      return toBytes$U(id$2);
    };

    var updateRun = /*#__PURE__*/Object.freeze({
        __proto__: null,
        examples: examples$2,
        fromBytes: fromBytes$2,
        headerSize: headerSize$2,
        id: id$2,
        name: name$2,
        toBytes: toBytes$2
    });

    var id$1 = 0x2b1f;
    var name$1 = 'verifyImage';
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

    var id = 0x2a1f;
    var name = 'writeImage';
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
        offset: buffer.getUint32(false),
        status: buffer.getUint8()
      };
    };
    var toBytes = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
      buffer.setUint32(parameters.offset, false);
      buffer.setUint8(parameters.status);
      return toBytes$U(id, buffer.data);
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
