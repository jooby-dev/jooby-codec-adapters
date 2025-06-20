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
    function _arrayWithHoles(r) {
      if (Array.isArray(r)) return r;
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
    function _iterableToArrayLimit(r, l) {
      var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (null != t) {
        var e,
          n,
          i,
          u,
          a = [],
          f = true,
          o = false;
        try {
          if (i = (t = t.call(r)).next, 0 === l) {
            if (Object(t) !== t) return;
            f = !1;
          } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
        } catch (r) {
          o = true, n = r;
        } finally {
          try {
            if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
          } finally {
            if (o) throw n;
          }
        }
        return a;
      }
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    function _slicedToArray(r, e) {
      return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }
    function _toArray(r) {
      return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
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

    var DEVICE_TYPE_INVALID_CHAR = 'x';
    var nibbles1 = ['.', '1', '3', 'R', 'M'];
    var nibbles2 = ['.', 'A', 'G', 'R', 'T', 'D'];
    var nibbles3 = ['.', '0', '1', '2', '3', '4', '5'];
    var nibbles4 = ['.', 'A', 'B', 'C', 'D', 'E', 'F'];
    var nibbles5 = ['.', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'K', 'G'];
    var nibbles6 = ['.', '1', '2', '3', '4'];
    var nibbles7 = ['.', 'L', 'M', 'Z', 'K'];
    var nibbles8 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var nibbles9 = ['.', 'D', 'B', 'C', 'E', 'P', 'R', 'O', 'L', 'F', 'S', 'M', 'Y', 'G', 'N', 'U'];
    var nibbles10 = ['.', '0', '1', '2', '3', '4', '5', '6', 'P', 'R', 'L', 'E', 'G', '-', '/'];
    var nibbles11 = ['.', 'H', 'A', 'T', '0', '0', '0', '0', '0', '1', '2', '3', '4', '0', '0', '0'];
    var nibbles12 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', 'I', 'X', 'G', 'W', 'M', '-'];
    var mtx1DeviceTypeDescriptorMask = {
      typeMeterG: 1 << 0,
      downgradedToA: 1 << 4,
      supportMeterInfo: 1 << 6
    };
    var mtx3DeviceTypeDescriptorMask = {
      typeMeterTransformer: 1 << 0,
      downgradedToR: 1 << 3,
      typeMeterG: 1 << 4,
      supportMeterInfo: 1 << 6,
      reactiveByQuadrants: 1 << 7
    };
    var mtx3DeviceTypeDescriptorFromByte = function mtx3DeviceTypeDescriptorFromByte(_byte) {
      var descriptor = toObject(mtx3DeviceTypeDescriptorMask, _byte);
      return _objectSpread2(_objectSpread2({
        meterType: 'mtx3'
      }, descriptor), {}, {
        typeMeterG: !descriptor.typeMeterG
      });
    };
    var mtx3DeviceTypeDescriptorToByte = function mtx3DeviceTypeDescriptorToByte(descriptor) {
      return fromObject(mtx3DeviceTypeDescriptorMask, _objectSpread2(_objectSpread2({}, descriptor), {}, {
        typeMeterG: !descriptor.typeMeterG
      }));
    };
    var splitByte = function splitByte(_byte2) {
      return [_byte2 >> 4, _byte2 & 0x0F];
    };
    var splitToNibbles = function splitToNibbles(data) {
      var result = new Array(data.length * 2).fill(0);
      data.forEach(function (_byte3, index) {
        var _splitByte = splitByte(_byte3),
          _splitByte2 = _slicedToArray(_splitByte, 2),
          high = _splitByte2[0],
          low = _splitByte2[1];
        result[index * 2] = high;
        result[index * 2 + 1] = low;
      });
      return result;
    };
    var joinNibbles = function joinNibbles(nibbles) {
      var hex = [];
      nibbles.forEach(function (nibble) {
        return hex.push(nibble.toString(16));
      });
      if (nibbles.length & 1) {
        hex.push('0');
      }
      return getBytesFromHex(hex.join(''));
    };
    var fromBytesMtx = function fromBytesMtx(nibbles) {
      var _nibbles1$nibbles$, _nibbles2$nibbles$, _nibbles3$nibbles$, _nibbles3$nibbles$2, _nibbles4$nibbles$, _nibbles5$nibbles$, _nibbles6$nibbles$, _nibbles7$nibbles$, _nibbles8$nibbles$;
      if (nibbles.length !== 14 && nibbles.length !== 16) {
        throw new Error('Device type bytes wrong size');
      }
      var type = ['MTX '];
      type.push((_nibbles1$nibbles$ = nibbles1[nibbles[0]]) !== null && _nibbles1$nibbles$ !== void 0 ? _nibbles1$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles2$nibbles$ = nibbles2[nibbles[1]]) !== null && _nibbles2$nibbles$ !== void 0 ? _nibbles2$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles3$nibbles$ = nibbles3[nibbles[2]]) !== null && _nibbles3$nibbles$ !== void 0 ? _nibbles3$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles3$nibbles$2 = nibbles3[nibbles[3]]) !== null && _nibbles3$nibbles$2 !== void 0 ? _nibbles3$nibbles$2 : DEVICE_TYPE_INVALID_CHAR);
      type.push('.');
      type.push((_nibbles4$nibbles$ = nibbles4[nibbles[4]]) !== null && _nibbles4$nibbles$ !== void 0 ? _nibbles4$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles5$nibbles$ = nibbles5[nibbles[5]]) !== null && _nibbles5$nibbles$ !== void 0 ? _nibbles5$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push('.');
      type.push((_nibbles6$nibbles$ = nibbles6[nibbles[6]]) !== null && _nibbles6$nibbles$ !== void 0 ? _nibbles6$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles7$nibbles$ = nibbles7[nibbles[7]]) !== null && _nibbles7$nibbles$ !== void 0 ? _nibbles7$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      var revision = nibbles[8];
      type.push((_nibbles8$nibbles$ = nibbles8[nibbles[9]]) !== null && _nibbles8$nibbles$ !== void 0 ? _nibbles8$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
      type.push('-');
      var deviceProtocolIndex;
      if (nibbles.length < 14 || nibbles[12] === 0 && nibbles[13] === 0) {
        var _nibbles9$nibbles$;
        type.push((_nibbles9$nibbles$ = nibbles9[nibbles[10]]) !== null && _nibbles9$nibbles$ !== void 0 ? _nibbles9$nibbles$ : DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 11;
      } else if (nibbles[13] === 0) {
        var _nibbles9$nibbles$2, _nibbles9$nibbles$3;
        type.push((_nibbles9$nibbles$2 = nibbles9[nibbles[10]]) !== null && _nibbles9$nibbles$2 !== void 0 ? _nibbles9$nibbles$2 : DEVICE_TYPE_INVALID_CHAR);
        type.push((_nibbles9$nibbles$3 = nibbles9[nibbles[11]]) !== null && _nibbles9$nibbles$3 !== void 0 ? _nibbles9$nibbles$3 : DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 12;
      } else {
        var _nibbles9$nibbles$4, _nibbles9$nibbles$5, _nibbles9$nibbles$6;
        type.push((_nibbles9$nibbles$4 = nibbles9[nibbles[10]]) !== null && _nibbles9$nibbles$4 !== void 0 ? _nibbles9$nibbles$4 : DEVICE_TYPE_INVALID_CHAR);
        type.push((_nibbles9$nibbles$5 = nibbles9[nibbles[11]]) !== null && _nibbles9$nibbles$5 !== void 0 ? _nibbles9$nibbles$5 : DEVICE_TYPE_INVALID_CHAR);
        type.push((_nibbles9$nibbles$6 = nibbles9[nibbles[12]]) !== null && _nibbles9$nibbles$6 !== void 0 ? _nibbles9$nibbles$6 : DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 13;
      }
      var deviceProtocolNibble = nibbles[deviceProtocolIndex];
      if (deviceProtocolNibble && deviceProtocolNibble !== 0) {
        var _nibbles11$deviceProt;
        type.push((_nibbles11$deviceProt = nibbles11[deviceProtocolNibble]) !== null && _nibbles11$deviceProt !== void 0 ? _nibbles11$deviceProt : DEVICE_TYPE_INVALID_CHAR);
      }
      return {
        type: type.join(''),
        revision: revision
      };
    };
    var toBytesMtx = function toBytesMtx(type, prefix, revision) {
      var nibbles = [];
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
      nibbles.push(revision !== null && revision !== void 0 ? revision : 0);
      nibbles.push(nibbles8.indexOf(type[10]));
      if (type[11] !== '-') {
        throw new Error('Wrong format');
      }
      var deviceProtocolIndex = type.length > 13 ? type.length - 1 : type.length;
      for (var index = 12; index < deviceProtocolIndex; index++) {
        nibbles.push(nibbles9.indexOf(type[index]));
      }
      if (deviceProtocolIndex < type.length) {
        nibbles.push(nibbles11.indexOf(type[deviceProtocolIndex]));
      }
      var bytes = joinNibbles(nibbles);
      var result = new Array(9).fill(0);
      result[0] = 0;
      for (var _index = 0; _index < bytes.length; _index++) {
        result[_index + (bytes.length < 8 ? 1 : 0)] = bytes[_index];
      }
      return result;
    };
    var fromBytesMtx2 = function fromBytesMtx2(nibbles) {
      var _nibbles1$nibbles$2, _nibbles2$nibbles$2;
      if (nibbles.length < 14) {
        throw new Error('The buffer is too small');
      }
      var type = ['MTX '];
      var separator = nibbles[1] === 5 ? '-' : ' ';
      type.push((_nibbles1$nibbles$2 = nibbles1[nibbles[0]]) !== null && _nibbles1$nibbles$2 !== void 0 ? _nibbles1$nibbles$2 : DEVICE_TYPE_INVALID_CHAR);
      type.push((_nibbles2$nibbles$2 = nibbles2[nibbles[1]]) !== null && _nibbles2$nibbles$2 !== void 0 ? _nibbles2$nibbles$2 : DEVICE_TYPE_INVALID_CHAR);
      type.push(separator);
      for (var index = 2; index < nibbles.length; index++) {
        if (nibbles[index] !== 0) {
          var _nibbles10$nibbles$in;
          type.push((_nibbles10$nibbles$in = nibbles10[nibbles[index]]) !== null && _nibbles10$nibbles$in !== void 0 ? _nibbles10$nibbles$in : DEVICE_TYPE_INVALID_CHAR);
        }
      }
      return {
        type: type.join('')
      };
    };
    var toBytesMtx2 = function toBytesMtx2(type) {
      if (type.length < 3) {
        throw new Error('Wrong format');
      }
      var nibbles = [];
      nibbles.push(nibbles1.indexOf(type[0]));
      nibbles.push(nibbles2.indexOf(type[1]));
      for (var index = 3; index < type.length; index++) {
        nibbles.push(nibbles10.indexOf(type[index]));
      }
      var bytes = joinNibbles(nibbles);
      if (bytes.length === 8) {
        return bytes;
      }
      if (bytes.length > 8) {
        throw new Error('Wrong format');
      }
      var result = new Array(8).fill(0);
      for (var _index2 = 0; _index2 < bytes.length; _index2++) {
        result[_index2] = bytes[_index2];
      }
      return result;
    };
    var fromBytesM = function fromBytesM(nibbles) {
      var _nibbles1$nibbles$3;
      if (nibbles.length < 14) {
        throw new Error('The buffer is too small');
      }
      var type = [];
      type.push((_nibbles1$nibbles$3 = nibbles1[nibbles[0]]) !== null && _nibbles1$nibbles$3 !== void 0 ? _nibbles1$nibbles$3 : DEVICE_TYPE_INVALID_CHAR);
      for (var index = 1; index < nibbles.length; index++) {
        if (nibbles[index] !== 0) {
          var _nibbles12$nibbles$in;
          type.push((_nibbles12$nibbles$in = nibbles12[nibbles[index]]) !== null && _nibbles12$nibbles$in !== void 0 ? _nibbles12$nibbles$in : DEVICE_TYPE_INVALID_CHAR);
        }
      }
      return {
        type: type.join('')
      };
    };
    var toBytesM = function toBytesM(type) {
      if (type.length < 1) {
        throw new Error('Wrong format');
      }
      var nibbles = [];
      nibbles.push(nibbles1.indexOf(type[0]));
      for (var index = 1; index < type.length; index++) {
        nibbles.push(nibbles12.indexOf(type[index]));
      }
      var bytes = joinNibbles(nibbles);
      var result = new Array(8).fill(0);
      for (var _index3 = 0; _index3 < bytes.length && _index3 < 8; _index3++) {
        result[_index3] = bytes[_index3];
      }
      return result;
    };
    var fromBytes$2g = function fromBytes(bytes) {
      if (bytes.length !== 9) {
        throw new Error('The buffer is too small');
      }
      var result;
      var reserve = [0x00, 0x05, 0x06, 0x07, 0x09, 0x7f, 0xef];
      var position = reserve.indexOf(bytes[0]) !== -1 ? 2 : 0;
      var nibbles = splitToNibbles(bytes.slice(0, 8));
      var deviceTypeNibble = nibbles[position];
      var deviceType = nibbles1[deviceTypeNibble];
      if (deviceType === '1' || deviceType === '3') {
        result = _objectSpread2(_objectSpread2({}, fromBytesMtx(nibbles.slice(position))), {}, {
          descriptor: deviceType === '3' ? mtx3DeviceTypeDescriptorFromByte(bytes[8]) : _objectSpread2({
            meterType: 'mtx1'
          }, toObject(mtx1DeviceTypeDescriptorMask, bytes[8]))
        });
      } else {
        result = deviceType === 'M' ? fromBytesM(nibbles) : fromBytesMtx2(nibbles);
      }
      return result;
    };
    var toBytes$2i = function toBytes(_ref, prefix) {
      var type = _ref.type,
        revision = _ref.revision,
        descriptor = _ref.descriptor;
      if (!type.startsWith('MTX ')) {
        throw new Error('Wrong format');
      }
      var result;
      var content = type.substring(4);
      var deviceTypeSymbol = type[4];
      if (deviceTypeSymbol === '1' || deviceTypeSymbol === '3') {
        result = toBytesMtx(content, prefix, revision);
      } else {
        result = deviceTypeSymbol === 'M' ? toBytesM(content) : toBytesMtx2(content);
      }
      if (descriptor !== null && descriptor !== void 0 && descriptor.meterType) {
        result[8] = descriptor.meterType === 'mtx1' ? fromObject(mtx1DeviceTypeDescriptorMask, descriptor) : mtx3DeviceTypeDescriptorToByte(descriptor);
      } else {
        result[8] = 0;
      }
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

    var DATA_REQUEST = 0x50;
    var DATA_RESPONSE = 0x51;
    var IDENT_REQUEST = 0x52;
    var IDENT_RESPONSE = 0x53;
    var L2_SET_ADDRESS_REQUEST = 0x54;
    var L2_SET_ADDRESS_RESPONSE = 0x55;
    var L2_CHECK_ADDRESS_REQUEST = 0x56;
    var L2_CHECK_ADDRESS_RESPONSE = 0x57;
    var L2_RM_ADDRESS_REQUEST = 0x58;
    var L2_RM_ADDRESS_RESPONSE = 0x59;
    var FRAGMENT_REQUEST = 0x5A;
    var FRAGMENT_RESPONSE = 0x5B;
    var INVALID = 0xFF;

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

    var invertObject = (function (source) {
      var target = {};
      for (var property in source) {
        var value = source[property];
        target[value] = property;
      }
      return target;
    });

    var frameNames = invertObject(frameTypes);

    var ENERGY_REGISTER_FAULT = 0x01;
    var VENDOR_PAR_FAULT = 0x02;
    var OP_PAR_FAULT = 0x03;
    var ACCESS_LOCKED$1 = 0x10;
    var ERR_ACCESS$1 = 0x11;
    var CASE_OPEN$2 = 0x12;
    var CASE_CLOSE$1 = 0x13;
    var MAGNETIC_ON$2 = 0x14;
    var MAGNETIC_OFF$1 = 0x15;
    var CHANGE_ACCESS_KEY0$1 = 0x20;
    var CHANGE_ACCESS_KEY1$1 = 0x21;
    var CHANGE_ACCESS_KEY2$1 = 0x22;
    var CHANGE_ACCESS_KEY3$1 = 0x23;
    var CHANGE_PAR_LOCAL = 0x24;
    var CHANGE_PAR_REMOTE = 0x25;
    var CMD_CHANGE_TIME$1 = 0x26;
    var CMD_RELAY_ON$1 = 0x27;
    var CMD_RELAY_OFF$1 = 0x28;
    var CHANGE_COR_TIME$1 = 0x29;
    var ENERGY_REGISTER_OVERFLOW$1 = 0x31;
    var CHANGE_TARIFF_TABLE$1 = 0x32;
    var SET_TARIFF_TABLE$1 = 0x33;
    var SUMMER_TIME$1 = 0x34;
    var WINTER_TIME$1 = 0x35;
    var RELAY_ON$1 = 0x36;
    var RELAY_OFF$1 = 0x37;
    var RESTART$2 = 0x38;
    var WD_RESTART$1 = 0x39;
    var POWER_B_ON$1 = 0x3c;
    var POWER_B_OFF$1 = 0x3d;
    var POWER_C_ON$1 = 0x3e;
    var POWER_C_OFF$1 = 0x3f;
    var V_MAX_OK = 0x40;
    var V_MAX_OVER = 0x41;
    var V_MIN_OK = 0x42;
    var V_MIN_OVER = 0x43;
    var T_MAX_OK$1 = 0x44;
    var T_MAX_OVER$1 = 0x45;
    var T_MIN_OK$1 = 0x46;
    var T_MIN_OVER = 0x47;
    var F_MAX_OK$1 = 0x48;
    var F_MAX_OVER$1 = 0x49;
    var F_MIN_OK$1 = 0x4a;
    var F_MIN_OVER = 0x4b;
    var I_MAX_OK = 0x4c;
    var I_MAX_OVER = 0x4d;
    var P_MAX_OK = 0x4e;
    var P_MAX_OVER = 0x4f;
    var POWER_SALDO_OK = 0x50;
    var POWER_SALDO_OVER = 0x51;
    var BATTERY_OK$1 = 0x52;
    var BATTERY_FAULT$1 = 0x53;
    var CALIBRATION_OK$1 = 0x54;
    var CALIBRATION_FAULT$1 = 0x55;
    var CLOCK_OK$1 = 0x56;
    var CLOCK_FAULT$1 = 0x57;
    var POWER_A_OFF$1 = 0x58;
    var POWER_A_ON$1 = 0x59;
    var CMD_RELAY_2_ON$1 = 0x60;
    var CMD_RELAY_2_OFF$1 = 0x61;
    var CROSS_ZERO_ENT0 = 0x62;
    var CROSS_ZERO_ENT1$1 = 0x63;
    var CROSS_ZERO_ENT2$1 = 0x64;
    var CROSS_ZERO_ENT3$1 = 0x65;
    var CALIBRATION_FLAG_SET$1 = 0x66;
    var CALIBRATION_FLAG_RESET$1 = 0x67;
    var BAD_TEST_EEPROM$1 = 0x68;
    var BAD_TEST_FRAM$1 = 0x69;
    var SET_NEW_SALDO$1 = 0x70;
    var SALDO_PARAM_BAD$1 = 0x71;
    var ACC_PARAM_BAD = 0x72;
    var ACC_PARAM_EXT_BAD = 0x73;
    var CALC_PERIOD_BAD = 0x74;
    var BLOCK_TARIFF_BAD$1 = 0x75;
    var CALIBRATION_PARAM_BAD$1 = 0x76;
    var WINTER_SUMMER_BAD$1 = 0x77;
    var SALDO_EN_BAD = 0x78;
    var TIME_CORRECT$2 = 0x79;
    var CASE_KLEMA_OPEN$1 = 0x7a;
    var CASE_KLEMA_CLOSE$1 = 0x7b;
    var CASE_MODULE_OPEN$2 = 0x7c;
    var CASE_MODULE_CLOSE$1 = 0x7d;
    var POWER_GOOD_DIO = 0x7e;
    var RELAY_HARD_BAD_OFF$1 = 0x90;
    var RELAY_HARD_ON$1 = 0x91;
    var RELAY_HARD_BAD_ON$1 = 0x93;
    var RELAY_HARD_OFF$1 = 0x94;
    var CHANGE_TARIFF_TBL_2 = 0x98;
    var SET_SALDO_PARAM$1 = 0x9c;
    var POWER_OVER_RELAY_OFF$1 = 0x9d;
    var CROSS_ZERO_EXPORT_ENT0 = 0x9e;
    var CROSS_ZERO_EXPORT_ENT1$1 = 0x9f;
    var CROSS_ZERO_EXPORT_ENT2$1 = 0xa0;
    var CROSS_ZERO_EXPORT_ENT3$1 = 0xa1;
    var TIME_CORRECT_NEW = 0xa2;
    var EM_MAGNETIC_ON$1 = 0xb0;
    var EM_MAGNETIC_OFF$1 = 0xb1;
    var CURRENT_UNEQUAL_FAULT = 0xb2;
    var CURRENT_UNEQUAL_OK = 0xb3;
    var BIPOLAR_POWER_FAULT = 0xb4;
    var BIPOLAR_POWER_OK = 0xb5;
    var RESET_EM_FLAG$1 = 0xB6;
    var RESET_MAGNET_FLAG = 0xB7;
    var CHANGE_PARAM_CANAL = 0xB9;
    var RELAY_OFF_BAD_SALDO = 0xBA;
    var SET_DEMAND_EN_1MIN = 0xE0;
    var SET_DEMAND_EN_3MIN = 0xE1;
    var SET_DEMAND_EN_5MIN = 0xE2;
    var SET_DEMAND_EN_10MIN = 0xE3;
    var SET_DEMAND_EN_15MIN = 0xE4;
    var SET_DEMAND_EN_30MIN = 0xE5;
    var SET_DEMAND_EN_60MIN = 0xE6;
    var P_MAX_A_MINUS_OK$1 = 0xE7;
    var P_MAX_A_MINUS_OVER$1 = 0xE8;

    var events$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_LOCKED: ACCESS_LOCKED$1,
        ACC_PARAM_BAD: ACC_PARAM_BAD,
        ACC_PARAM_EXT_BAD: ACC_PARAM_EXT_BAD,
        BAD_TEST_EEPROM: BAD_TEST_EEPROM$1,
        BAD_TEST_FRAM: BAD_TEST_FRAM$1,
        BATTERY_FAULT: BATTERY_FAULT$1,
        BATTERY_OK: BATTERY_OK$1,
        BIPOLAR_POWER_FAULT: BIPOLAR_POWER_FAULT,
        BIPOLAR_POWER_OK: BIPOLAR_POWER_OK,
        BLOCK_TARIFF_BAD: BLOCK_TARIFF_BAD$1,
        CALC_PERIOD_BAD: CALC_PERIOD_BAD,
        CALIBRATION_FAULT: CALIBRATION_FAULT$1,
        CALIBRATION_FLAG_RESET: CALIBRATION_FLAG_RESET$1,
        CALIBRATION_FLAG_SET: CALIBRATION_FLAG_SET$1,
        CALIBRATION_OK: CALIBRATION_OK$1,
        CALIBRATION_PARAM_BAD: CALIBRATION_PARAM_BAD$1,
        CASE_CLOSE: CASE_CLOSE$1,
        CASE_KLEMA_CLOSE: CASE_KLEMA_CLOSE$1,
        CASE_KLEMA_OPEN: CASE_KLEMA_OPEN$1,
        CASE_MODULE_CLOSE: CASE_MODULE_CLOSE$1,
        CASE_MODULE_OPEN: CASE_MODULE_OPEN$2,
        CASE_OPEN: CASE_OPEN$2,
        CHANGE_ACCESS_KEY0: CHANGE_ACCESS_KEY0$1,
        CHANGE_ACCESS_KEY1: CHANGE_ACCESS_KEY1$1,
        CHANGE_ACCESS_KEY2: CHANGE_ACCESS_KEY2$1,
        CHANGE_ACCESS_KEY3: CHANGE_ACCESS_KEY3$1,
        CHANGE_COR_TIME: CHANGE_COR_TIME$1,
        CHANGE_PARAM_CANAL: CHANGE_PARAM_CANAL,
        CHANGE_PAR_LOCAL: CHANGE_PAR_LOCAL,
        CHANGE_PAR_REMOTE: CHANGE_PAR_REMOTE,
        CHANGE_TARIFF_TABLE: CHANGE_TARIFF_TABLE$1,
        CHANGE_TARIFF_TBL_2: CHANGE_TARIFF_TBL_2,
        CLOCK_FAULT: CLOCK_FAULT$1,
        CLOCK_OK: CLOCK_OK$1,
        CMD_CHANGE_TIME: CMD_CHANGE_TIME$1,
        CMD_RELAY_2_OFF: CMD_RELAY_2_OFF$1,
        CMD_RELAY_2_ON: CMD_RELAY_2_ON$1,
        CMD_RELAY_OFF: CMD_RELAY_OFF$1,
        CMD_RELAY_ON: CMD_RELAY_ON$1,
        CROSS_ZERO_ENT0: CROSS_ZERO_ENT0,
        CROSS_ZERO_ENT1: CROSS_ZERO_ENT1$1,
        CROSS_ZERO_ENT2: CROSS_ZERO_ENT2$1,
        CROSS_ZERO_ENT3: CROSS_ZERO_ENT3$1,
        CROSS_ZERO_EXPORT_ENT0: CROSS_ZERO_EXPORT_ENT0,
        CROSS_ZERO_EXPORT_ENT1: CROSS_ZERO_EXPORT_ENT1$1,
        CROSS_ZERO_EXPORT_ENT2: CROSS_ZERO_EXPORT_ENT2$1,
        CROSS_ZERO_EXPORT_ENT3: CROSS_ZERO_EXPORT_ENT3$1,
        CURRENT_UNEQUAL_FAULT: CURRENT_UNEQUAL_FAULT,
        CURRENT_UNEQUAL_OK: CURRENT_UNEQUAL_OK,
        EM_MAGNETIC_OFF: EM_MAGNETIC_OFF$1,
        EM_MAGNETIC_ON: EM_MAGNETIC_ON$1,
        ENERGY_REGISTER_FAULT: ENERGY_REGISTER_FAULT,
        ENERGY_REGISTER_OVERFLOW: ENERGY_REGISTER_OVERFLOW$1,
        ERR_ACCESS: ERR_ACCESS$1,
        F_MAX_OK: F_MAX_OK$1,
        F_MAX_OVER: F_MAX_OVER$1,
        F_MIN_OK: F_MIN_OK$1,
        F_MIN_OVER: F_MIN_OVER,
        I_MAX_OK: I_MAX_OK,
        I_MAX_OVER: I_MAX_OVER,
        MAGNETIC_OFF: MAGNETIC_OFF$1,
        MAGNETIC_ON: MAGNETIC_ON$2,
        OP_PAR_FAULT: OP_PAR_FAULT,
        POWER_A_OFF: POWER_A_OFF$1,
        POWER_A_ON: POWER_A_ON$1,
        POWER_B_OFF: POWER_B_OFF$1,
        POWER_B_ON: POWER_B_ON$1,
        POWER_C_OFF: POWER_C_OFF$1,
        POWER_C_ON: POWER_C_ON$1,
        POWER_GOOD_DIO: POWER_GOOD_DIO,
        POWER_OVER_RELAY_OFF: POWER_OVER_RELAY_OFF$1,
        POWER_SALDO_OK: POWER_SALDO_OK,
        POWER_SALDO_OVER: POWER_SALDO_OVER,
        P_MAX_A_MINUS_OK: P_MAX_A_MINUS_OK$1,
        P_MAX_A_MINUS_OVER: P_MAX_A_MINUS_OVER$1,
        P_MAX_OK: P_MAX_OK,
        P_MAX_OVER: P_MAX_OVER,
        RELAY_HARD_BAD_OFF: RELAY_HARD_BAD_OFF$1,
        RELAY_HARD_BAD_ON: RELAY_HARD_BAD_ON$1,
        RELAY_HARD_OFF: RELAY_HARD_OFF$1,
        RELAY_HARD_ON: RELAY_HARD_ON$1,
        RELAY_OFF: RELAY_OFF$1,
        RELAY_OFF_BAD_SALDO: RELAY_OFF_BAD_SALDO,
        RELAY_ON: RELAY_ON$1,
        RESET_EM_FLAG: RESET_EM_FLAG$1,
        RESET_MAGNET_FLAG: RESET_MAGNET_FLAG,
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
        SET_TARIFF_TABLE: SET_TARIFF_TABLE$1,
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

    var defaultFrameHeader = {
      type: DATA_REQUEST,
      destination: 0xffff,
      source: 0xfffe
    };
    var TARIFF_PLAN_SIZE = 11;
    var SEASON_PROFILE_DAYS_NUMBER = 7;
    var SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;
    var TARIFF_NUMBER$1 = 4;
    var ENERGY_SIZE = 4;
    var DATE_SIZE$2 = 3;
    var MIN_HALF_HOUR_PERIODS = 48;
    var MAX_HALF_HOUR_PERIODS = 50;
    var MIN_HALF_HOUR_COMMAND_SIZE = 3 + MIN_HALF_HOUR_PERIODS * 2;
    var MAX_HALF_HOUR_COMMAND_SIZE = 4 + MAX_HALF_HOUR_PERIODS * 2;
    var baseDisplaySetMask = {
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
      POWER_FACTOR_PHASE_A: 0x00080000,
      POWER_FACTOR_PHASE_B: 0x00100000,
      BATTERY_VOLTAGE: 0x00200000,
      POWER_THRESHOLD_T1: 0x00400000,
      POWER_THRESHOLD_T2: 0x00800000,
      POWER_THRESHOLD_T3: 0x01000000,
      POWER_THRESHOLD_T4: 0x02000000,
      CURRENT_BALANCE: 0x20000000
    };
    var displaySetMask = _objectSpread2(_objectSpread2({}, baseDisplaySetMask), {}, {
      AUTO_SCREEN_SCROLLING: 0x80000000
    });
    var displaySetExtMask = _objectSpread2(_objectSpread2({}, baseDisplaySetMask), {}, {
      MAGNET_INDUCTION: 0x08000000,
      OPTOPORT_SPEED: 0x40000000,
      SORT_DISPLAY_SCREENS: 0x80000000
    });
    var relaySet1Mask = {
      RELAY_ON_Y: 0x01,
      RELAY_ON_CENTER: 0x02,
      RELAY_ON_PB: 0x04,
      RELAY_ON_TARIFF_1: 0x08,
      RELAY_ON_TARIFF_2: 0x10,
      RELAY_ON_TARIFF_3: 0x20,
      RELAY_ON_TARIFF_4: 0x40,
      RELAY_ON_V_GOOD: 0x80
    };
    var relaySet2Mask = {
      RELAY_OFF_Y: 0x01,
      RELAY_OFF_CENTER: 0x02,
      RELAY_OFF_TARIFF_1: 0x04,
      RELAY_OFF_TARIFF_2: 0x08,
      RELAY_OFF_TARIFF_3: 0x10,
      RELAY_OFF_TARIFF_4: 0x20,
      RELAY_OFF_I_LIMIT: 0x40,
      RELAY_OFF_V_BAD: 0x80
    };
    var relaySet3Mask = {
      RELAY_OFF_LIM_TARIFF_1: 0x02,
      RELAY_OFF_LIM_TARIFF_2: 0x04,
      RELAY_OFF_LIM_TARIFF_3: 0x08,
      RELAY_OFF_LIM_TARIFF_4: 0x10,
      RELAY_OFF_PF_MIN: 0x20
    };
    var relaySet4Mask = {
      RELAY_ON_TIMEOUT: 0x01,
      RELAY_ON_SALDO: 0x02,
      RELAY_OFF_SALDO: 0x04,
      RELAY_OFF_SALDO_SOFT: 0x08,
      RELAY_OFF_MAGNET: 0x10,
      RELAY_ON_MAGNET_TIMEOUT: 0x20,
      RELAY_ON_MAGNET_AUTO: 0x40
    };
    var relaySet5Mask = {
      RELAY_OFF_UNEQUAL_CURRENT: 0x01,
      RELAY_ON_UNEQUAL_CURRENT: 0x02,
      RELAY_OFF_BIPOLAR_POWER: 0x04,
      RELAY_ON_BIPOLAR_POWER: 0x08
    };
    var define1Mask$1 = {
      BLOCK_KEY_OPTOPORT: 0x02,
      MAGNET_SCREEN_CONST: 0x20
    };
    var eventStatusMask = {
      CASE_OPEN: Math.pow(2, 0),
      MAGNETIC_ON: Math.pow(2, 1),
      PARAMETERS_UPDATE_REMOTE: Math.pow(2, 2),
      PARAMETERS_UPDATE_LOCAL: Math.pow(2, 3),
      RESTART: Math.pow(2, 4),
      ERROR_ACCESS: Math.pow(2, 5),
      TIME_SET: Math.pow(2, 6),
      TIME_CORRECT: Math.pow(2, 7),
      DEVICE_FAILURE: Math.pow(2, 8),
      CASE_TERMINAL_OPEN: Math.pow(2, 9),
      CASE_MODULE_OPEN: Math.pow(2, 10),
      TARIFF_TABLE_SET: Math.pow(2, 11),
      TARIFF_TABLE_GET: Math.pow(2, 12),
      PROTECTION_RESET_EM: Math.pow(2, 13),
      PROTECTION_RESET_MAGNETIC: Math.pow(2, 14)
    };
    var extendedCurrentValues2RelayStatusMask = {
      RELAY_STATE: Math.pow(2, 0),
      RELAY_UBAD: Math.pow(2, 1),
      RELAY_UNEQ_CURRENT: Math.pow(2, 4),
      RELAY_OFF_CENTER: Math.pow(2, 5),
      RELAY_IMAX: Math.pow(2, 6),
      RELAY_PMAX: Math.pow(2, 7)
    };
    var extendedCurrentValues2RelayStatus2Mask = {
      RELAY_COSFI: Math.pow(2, 0),
      RELAY_SALDO_OFF_FLAG: Math.pow(2, 1),
      RELAY_UNEQUAL_CURRENT_OFF: Math.pow(2, 2),
      RELAY_BIPOLAR_POWER_OFF: Math.pow(2, 3),
      RELAY_SALDO_OFF_ON_MAX_POWER: Math.pow(2, 4),
      RELAY_HARD_ST1: Math.pow(2, 5)
    };
    var extendedCurrentValues2Status1Mask = {
      MAXVA: Math.pow(2, 0),
      MINVA: Math.pow(2, 1),
      MAXT: Math.pow(2, 2),
      MINT: Math.pow(2, 3),
      MAXF: Math.pow(2, 4),
      MINF: Math.pow(2, 5),
      MAXIA: Math.pow(2, 6),
      MAXP: Math.pow(2, 7)
    };
    var extendedCurrentValues2Status2Mask = {
      MAX_POWER_SALDO: Math.pow(2, 0),
      BATTERY_VBAT_BAD: Math.pow(2, 1),
      CLOCK_UNSET: Math.pow(2, 3),
      MIN_COS_FI: Math.pow(2, 5)
    };
    var extendedCurrentValues2Status3Mask = {
      UNEQUAL_CURRENT: Math.pow(2, 0),
      BIPOLAR_POWER: Math.pow(2, 1),
      POWER_A_NEGATIVE: Math.pow(2, 6),
      POWER_B_NEGATIVE: Math.pow(2, 7)
    };
    var operatorParametersExtended3RelaySetMask = {
      RELAY_OFF_LIMIT_P_MINUS_T1: 0x08,
      RELAY_OFF_LIMIT_P_MINUS_T2: 0x10,
      RELAY_OFF_LIMIT_P_MINUS_T3: 0x20,
      RELAY_OFF_LIMIT_P_MINUS_T4: 0x40
    };
    function getPackedEnergies$1(buffer, energyType, tariffMapByte) {
      var _byte = tariffMapByte >> TARIFF_NUMBER$1;
      var energies = new Array(TARIFF_NUMBER$1).fill(0);
      energies.forEach(function (energy, index) {
        var isTariffExists = !!extractBits(_byte, 1, index + 1);
        if (isTariffExists) {
          energies[index] = buffer.getUint32();
        } else {
          energies[index] = null;
        }
      });
      return energies;
    }
    function setPackedEnergyType(buffer, energyType, energies) {
      var indexShift = 1 + TARIFF_NUMBER$1;
      var tariffsByte = energyType;
      energies.forEach(function (energy, index) {
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
        tariff: period >> 14 & 0x03,
        energy: period & 0x3fff
      };
    }
    function setEnergyPeriod(buffer, _ref) {
      var tariff = _ref.tariff,
        energy = _ref.energy;
      if (tariff !== undefined && energy !== undefined) {
        buffer.setUint16(tariff << 14 | energy & 0x3fff);
      } else {
        buffer.setUint16(0xffff);
      }
    }
    function CommandBinaryBuffer$2(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer$2.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer$2.prototype.constructor = CommandBinaryBuffer$2;
    CommandBinaryBuffer$2.getDayProfileFromByte = function (value) {
      return {
        tariff: extractBits(value, 2, 1),
        isFirstHalfHour: !extractBits(value, 1, 3),
        hour: extractBits(value, 5, 4)
      };
    };
    CommandBinaryBuffer$2.getByteFromDayProfile = function (dayProfile) {
      var value = 0;
      value = fillBits(value, 2, 1, dayProfile.tariff);
      value = fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
      value = fillBits(value, 5, 4, dayProfile.hour);
      return value;
    };
    CommandBinaryBuffer$2.getDefaultSeasonProfile = function () {
      return {
        month: 1,
        date: 1,
        dayIndexes: [0, 0, 0, 0, 0, 0, 0]
      };
    };
    CommandBinaryBuffer$2.getDefaultOperatorParameters = function () {
      return {
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
      };
    };
    CommandBinaryBuffer$2.getDefaultOperatorParametersExtended3 = function () {
      return {
        pmaxMinusThreshold0: 0,
        pmaxMinusThreshold1: 0,
        pmaxMinusThreshold2: 0,
        pmaxMinusThreshold3: 0,
        relaySet: toObject(operatorParametersExtended3RelaySetMask, 0)
      };
    };
    CommandBinaryBuffer$2.prototype.getFrameHeader = function () {
      var type = this.getUint8();
      var typeName = frameNames[type];
      var destination = this.getUint16();
      var source = this.getUint16();
      return {
        type: type,
        typeName: typeName,
        destination: destination,
        source: source
      };
    };
    CommandBinaryBuffer$2.prototype.setFrameHeader = function (_ref2) {
      var _ref2$type = _ref2.type,
        type = _ref2$type === void 0 ? defaultFrameHeader.type : _ref2$type,
        _ref2$destination = _ref2.destination,
        destination = _ref2$destination === void 0 ? defaultFrameHeader.destination : _ref2$destination,
        _ref2$source = _ref2.source,
        source = _ref2$source === void 0 ? defaultFrameHeader.source : _ref2$source;
      this.setUint8(type);
      this.setUint16(destination);
      this.setUint16(source);
    };
    CommandBinaryBuffer$2.prototype.getDeviceId = function () {
      var manufacturer = getHexFromBytes(this.getBytes(3), {
        separator: ''
      });
      var type = this.getUint8();
      var year = this.getUint8();
      var serial = getHexFromBytes(this.getBytes(3), {
        separator: ''
      });
      return {
        manufacturer: manufacturer,
        type: type,
        year: year,
        serial: serial
      };
    };
    CommandBinaryBuffer$2.prototype.setDeviceId = function (_ref3) {
      var manufacturer = _ref3.manufacturer,
        type = _ref3.type,
        year = _ref3.year,
        serial = _ref3.serial;
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
      var _this = this;
      return {
        month: this.getUint8(),
        date: this.getUint8(),
        dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(function () {
          return _this.getUint8();
        })
      };
    };
    CommandBinaryBuffer$2.prototype.setSeasonProfile = function (seasonProfile) {
      var _this2 = this;
      this.setUint8(seasonProfile.month);
      this.setUint8(seasonProfile.date);
      seasonProfile.dayIndexes.forEach(function (value) {
        return _this2.setUint8(value);
      });
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
      return fromBytes$2g(this.getBytes(9));
    };
    CommandBinaryBuffer$2.prototype.setDeviceType = function (deviceType) {
      this.setBytes(toBytes$2i(deviceType));
    };
    CommandBinaryBuffer$2.prototype.getOperatorParameters = function () {
      var operatorParameters = {
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
      var timeCorrectPeriod = this.getUint8();
      operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
      operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);
      return operatorParameters;
    };
    CommandBinaryBuffer$2.prototype.setOperatorParameters = function (operatorParameters) {
      var timeCorrectPeriod = operatorParameters.timeCorrectPeriod | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);
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
      var _byte2 = this.getUint8();
      var energyType = extractBits(_byte2, TARIFF_NUMBER$1, 1);
      var energies = getPackedEnergies$1(this, energyType, _byte2);
      return {
        energyType: energyType,
        energies: energies
      };
    };
    CommandBinaryBuffer$2.prototype.setPackedEnergyWithType = function (_ref4) {
      var _this3 = this;
      var energyType = _ref4.energyType,
        energies = _ref4.energies;
      if (energyType) {
        setPackedEnergyType(this, energyType, energies);
      }
      energies.forEach(function (energy) {
        if (energy !== null) {
          _this3.setUint32(energy);
        }
      });
    };
    CommandBinaryBuffer$2.prototype.getEnergies = function () {
      var _this4 = this;
      return new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return _this4.getInt32();
      });
    };
    CommandBinaryBuffer$2.prototype.setEnergies = function (energies) {
      var _this5 = this;
      energies.forEach(function (value) {
        return _this5.setUint32(value);
      });
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
      var _this6 = this;
      return {
        coefficients: new Array(4).fill(0).map(function () {
          return _this6.getUint32();
        }),
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
      var _this7 = this;
      saldoParameters.coefficients.forEach(function (value) {
        return _this7.setUint32(value);
      });
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
      var _this8 = this;
      var periods = new Array(periodsNumber).fill(0).map(function () {
        return _this8.getUint16();
      });
      return periods.map(function (period) {
        return getEnergyPeriod(period);
      });
    };
    CommandBinaryBuffer$2.prototype.setEnergyPeriods = function (periods) {
      var _this9 = this;
      periods.forEach(function (period) {
        return setEnergyPeriod(_this9, period);
      });
    };
    CommandBinaryBuffer$2.prototype.getEventStatus = function () {
      var eventStatus = this.getUint16();
      return toObject(eventStatusMask, eventStatus);
    };
    CommandBinaryBuffer$2.prototype.setEventStatus = function (parameters) {
      this.setUint16(fromObject(eventStatusMask, parameters));
    };
    CommandBinaryBuffer$2.prototype.getExtendedCurrentValues2 = function () {
      var uBattery = this.getUint16();
      var relayStatus = toObject(extendedCurrentValues2RelayStatusMask, this.getUint8());
      var relayStatus2 = toObject(extendedCurrentValues2RelayStatus2Mask, this.getUint8());
      var status1 = toObject(extendedCurrentValues2Status1Mask, this.getUint8());
      var status2 = toObject(extendedCurrentValues2Status2Mask, this.getUint8());
      var status3 = toObject(extendedCurrentValues2Status3Mask, this.getUint8());
      return {
        uBattery: uBattery,
        relayStatus: relayStatus,
        relayStatus2: relayStatus2,
        status1: status1,
        status2: status2,
        status3: status3
      };
    };
    CommandBinaryBuffer$2.prototype.setExtendedCurrentValues2 = function (parameters) {
      var uBattery = parameters.uBattery,
        relayStatus = parameters.relayStatus,
        relayStatus2 = parameters.relayStatus2,
        status1 = parameters.status1,
        status2 = parameters.status2,
        status3 = parameters.status3;
      this.setUint16(uBattery);
      this.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, relayStatus));
      this.setUint8(fromObject(extendedCurrentValues2RelayStatus2Mask, relayStatus2));
      this.setUint8(fromObject(extendedCurrentValues2Status1Mask, status1));
      this.setUint8(fromObject(extendedCurrentValues2Status2Mask, status2));
      this.setUint8(fromObject(extendedCurrentValues2Status3Mask, status3));
    };
    CommandBinaryBuffer$2.prototype.getEvent = function () {
      var data = {
        hours: this.getUint8(),
        minutes: this.getUint8(),
        seconds: this.getUint8(),
        event: this.getUint8()
      };
      var event = data.event;
      var bytesLeft = this.bytesLeft;
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
          var _iterator = _createForOfIteratorHelper(event.power),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              this.setUint8(item);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          break;
        case CMD_CHANGE_TIME$1:
        case TIME_CORRECT$2:
          this.setDateTime(event.newDate);
          break;
      }
    };
    CommandBinaryBuffer$2.prototype.getDemand = function () {
      var date0 = this.getUint8();
      var date1 = this.getUint8();
      return {
        date: {
          year: date0 >> 1,
          month: date0 << 3 & 0x0f | date1 >> 5,
          date: date1 & 0x1f
        },
        energyType: this.getUint8(),
        firstIndex: this.getUint16(),
        count: this.getUint8(),
        period: this.getUint8()
      };
    };
    CommandBinaryBuffer$2.prototype.setDemand = function (parameters) {
      var date0 = parameters.date.year << 1 | parameters.date.month >> 3 & 0x01;
      var date1 = parameters.date.month << 5 & 0xe0 | parameters.date.date & 0x1f;
      this.setUint8(date0);
      this.setUint8(date1);
      this.setUint8(parameters.energyType);
      this.setUint16(parameters.firstIndex);
      this.setUint8(parameters.count);
      this.setUint8(parameters.period);
    };
    CommandBinaryBuffer$2.prototype.getDemandParameters = function () {
      var channelParam1 = this.getUint8();
      var counterInterval = this.getUint8();
      var channelParam2 = this.getUint8();
      return {
        channelParam1: channelParam1,
        counterInterval: counterInterval,
        channelParam2: channelParam2
      };
    };
    CommandBinaryBuffer$2.prototype.setDemandParameters = function (parameters) {
      this.setUint8(parameters.channelParam1);
      this.setUint8(parameters.counterInterval);
      this.setUint8(parameters.channelParam2);
      this.setUint8(0);
    };
    CommandBinaryBuffer$2.prototype.getDayMaxDemandResponse = function () {
      var _this0 = this;
      var date = this.getDate();
      var power = new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return {
          hours: _this0.getUint8(),
          minutes: _this0.getUint8(),
          power: _this0.getUint32()
        };
      });
      return {
        date: date,
        power: power
      };
    };
    CommandBinaryBuffer$2.prototype.setDayMaxDemandResponse = function (parameters) {
      var _this1 = this;
      this.setDate(parameters.date);
      parameters.power.forEach(function (value) {
        _this1.setUint8(value.hours);
        _this1.setUint8(value.minutes);
        _this1.setUint32(value.power);
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
      var pmaxMinusThreshold0 = parameters.pmaxMinusThreshold0,
        pmaxMinusThreshold1 = parameters.pmaxMinusThreshold1,
        pmaxMinusThreshold2 = parameters.pmaxMinusThreshold2,
        pmaxMinusThreshold3 = parameters.pmaxMinusThreshold3,
        relaySet = parameters.relaySet;
      this.setUint32(pmaxMinusThreshold0);
      this.setUint32(pmaxMinusThreshold1);
      this.setUint32(pmaxMinusThreshold2);
      this.setUint32(pmaxMinusThreshold3);
      this.setUint8(fromObject(operatorParametersExtended3RelaySetMask, relaySet));
    };
    CommandBinaryBuffer$2.prototype.getMonthMaxPowerByTariffs = function () {
      var _this10 = this;
      return new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return {
          date: _this10.getUint8(),
          hours: _this10.getUint8(),
          minutes: _this10.getUint8(),
          power: _this10.getUint32()
        };
      });
    };
    CommandBinaryBuffer$2.prototype.setMonthMaxPowerByTariffs = function (tariffs) {
      var _this11 = this;
      tariffs.forEach(function (tariff) {
        _this11.setUint8(tariff.date);
        _this11.setUint8(tariff.hours);
        _this11.setUint8(tariff.minutes);
        _this11.setUint32(tariff.power);
      });
    };

    var HEX = 1;

    var defaultFormatOptions = {
      bytesConversionFormat: HEX,
      bytesConversionFormatOptions: {}
    };

    var defaultDlmsJsonOptions = _objectSpread2(_objectSpread2({}, defaultFormatOptions), {}, {
      dlms: false
    });
    var toBytes$2h = function toBytes(commandId) {
      var commandBytes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return [commandId, commandBytes.length].concat(_toConsumableArray(commandBytes));
    };

    var UNENCRYPTED = 0x00;
    var READ_WRITE = 0x02;
    var READ_ONLY = 0x03;

    var getEventStatus$3 = 0x01;
    var getEnergyDayPrevious$3 = 0x03;
    var getDeviceType$3 = 0x04;
    var getDeviceId$3 = 0x05;
    var getDateTime$3 = 0x07;
    var setDateTime$3 = 0x08;
    var setAccessKey$3 = 0x09;
    var getCurrentValues$3 = 0x0d;
    var getEnergy$3 = 0x0f;
    var setDayProfile$3 = 0x10;
    var setSeasonProfile$3 = 0x11;
    var setSpecialDay$3 = 0x12;
    var activateRatePlan$3 = 0x13;
    var prepareRatePlan$3 = 0x14;
    var getHalfHourDemand$3 = 0x15;
    var getDayDemand$3 = 0x16;
    var getMonthDemand$3 = 0x17;
    var turnRelayOn$3 = 0x18;
    var turnRelayOff$3 = 0x19;
    var setCorrectTime$3 = 0x1c;
    var getOperatorParameters$3 = 0x1e;
    var setOperatorParameters$3 = 0x1f;
    var getVersion$3 = 0x28;
    var getSaldo$3 = 0x29;
    var setSaldo$3 = 0x2a;
    var getRatePlanInfo$3 = 0x2c;
    var getExtendedCurrentValues2 = 0x2d;
    var getSaldoParameters$3 = 0x2e;
    var setSaldoParameters$3 = 0x2f;
    var getDayMaxDemand$3 = 0x31;
    var getMonthMaxDemand$3 = 0x32;
    var getEvents$3 = 0x33;
    var getEventsCounters$3 = 0x34;
    var resetPowerMaxDay$3 = 0x35;
    var resetPowerMaxMonth$3 = 0x36;
    var getCurrentStatusMeter$3 = 0x39;
    var getExtendedCurrentValues$3 = 0x3a;
    var getDayProfile$3 = 0x3b;
    var getSeasonProfile$3 = 0x3c;
    var getSpecialDay$3 = 0x3d;
    var getCorrectTime$3 = 0x3e;
    var getCriticalEvent$3 = 0x41;
    var runTariffPlan$3 = 0x46;
    var getDayMaxDemandPrevious = 0x4a;
    var getHalfHourDemandPrevious = 0x4b;
    var getDayDemandExport$3 = 0x4f;
    var getEnergyExportDayPrevious$3 = 0x50;
    var getMonthDemandExport$3 = 0x52;
    var getHalfHourDemandExport$3 = 0x53;
    var getDayMaxDemandExport$3 = 0x58;
    var getMonthMaxDemandExport$3 = 0x59;
    var getEnergyExport$3 = 0x5b;
    var setCorrectDateTime$3 = 0x5c;
    var setDisplayParam$3 = 0x5d;
    var getDisplayParam$3 = 0x5e;
    var setSpecialOperation$3 = 0x64;
    var getMagneticFieldThreshold$3 = 0x6d;
    var getHalfHourEnergies$3 = 0x6f;
    var getBuildVersion$3 = 0x70;
    var getOperatorParametersExtended3$3 = 0x71;
    var setOperatorParametersExtended3$3 = 0x72;
    var setDemandParameters = 0x74;
    var getDemandParameters = 0x75;
    var getDemand$3 = 0x76;
    var getMeterInfo$3 = 0x7a;

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
        getDemandParameters: getDemandParameters,
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
        getHalfHourEnergies: getHalfHourEnergies$3,
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
        setDemandParameters: setDemandParameters,
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

    var id$2g = activateRatePlan$3;
    var name$2g = commandNames$3[activateRatePlan$3];
    var headerSize$2g = 2;
    var maxSize$2g = 1 + TARIFF_PLAN_SIZE;
    var accessLevel$2g = READ_WRITE;
    var isLoraOnly$2g = false;
    var examples$2f = {
      'set rate plan request': {
        id: id$2g,
        name: name$2g,
        headerSize: headerSize$2g,
        maxSize: maxSize$2g,
        accessLevel: accessLevel$2g,
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
        bytes: [0x13, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]
      }
    };
    var fromBytes$2f = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        tariffTable: buffer.getUint8(),
        tariffPlan: buffer.getTariffPlan()
      };
    };
    var toBytes$2g = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$2g);
      buffer.setUint8(parameters.tariffTable);
      buffer.setTariffPlan(parameters.tariffPlan);
      return toBytes$2h(id$2g, buffer.data);
    };

    var activateRatePlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2g,
        examples: examples$2f,
        fromBytes: fromBytes$2f,
        headerSize: headerSize$2g,
        id: id$2g,
        isLoraOnly: isLoraOnly$2g,
        maxSize: maxSize$2g,
        name: name$2g,
        toBytes: toBytes$2g
    });

    var id$2f = getBuildVersion$3;
    var name$2f = commandNames$3[getBuildVersion$3];
    var headerSize$2f = 2;
    var accessLevel$2f = READ_ONLY;
    var maxSize$2f = 0;
    var isLoraOnly$2f = false;
    var examples$2e = {
      'simple request': {
        id: id$2f,
        name: name$2f,
        headerSize: headerSize$2f,
        maxSize: maxSize$2f,
        accessLevel: accessLevel$2f,
        parameters: {},
        bytes: [0x70, 0x00]
      }
    };
    var fromBytes$2e = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2f) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2f = function toBytes() {
      return toBytes$2h(id$2f);
    };

    var getBuildVersion$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2f,
        examples: examples$2e,
        fromBytes: fromBytes$2e,
        headerSize: headerSize$2f,
        id: id$2f,
        isLoraOnly: isLoraOnly$2f,
        maxSize: maxSize$2f,
        name: name$2f,
        toBytes: toBytes$2f
    });

    var id$2e = getCorrectTime$3;
    var name$2e = commandNames$3[getCorrectTime$3];
    var headerSize$2e = 2;
    var maxSize$2e = 0;
    var accessLevel$2e = READ_ONLY;
    var isLoraOnly$2e = false;
    var examples$2d = {
      'simple request': {
        id: id$2e,
        name: name$2e,
        headerSize: headerSize$2e,
        maxSize: maxSize$2e,
        accessLevel: accessLevel$2e,
        parameters: {},
        bytes: [0x3e, 0x00]
      }
    };
    var fromBytes$2d = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2e) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2e = function toBytes() {
      return toBytes$2h(id$2e);
    };

    var getCorrectTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2e,
        examples: examples$2d,
        fromBytes: fromBytes$2d,
        headerSize: headerSize$2e,
        id: id$2e,
        isLoraOnly: isLoraOnly$2e,
        maxSize: maxSize$2e,
        name: name$2e,
        toBytes: toBytes$2e
    });

    var id$2d = getCurrentStatusMeter$3;
    var name$2d = commandNames$3[getCurrentStatusMeter$3];
    var headerSize$2d = 2;
    var accessLevel$2d = READ_ONLY;
    var maxSize$2d = 0;
    var isLoraOnly$2d = false;
    var examples$2c = {
      'simple request': {
        id: id$2d,
        name: name$2d,
        headerSize: headerSize$2d,
        maxSize: maxSize$2d,
        accessLevel: accessLevel$2d,
        parameters: {},
        bytes: [0x39, 0x00]
      }
    };
    var fromBytes$2c = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2d) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2d = function toBytes() {
      return toBytes$2h(id$2d);
    };

    var getCurrentStatusMeter$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2d,
        examples: examples$2c,
        fromBytes: fromBytes$2c,
        headerSize: headerSize$2d,
        id: id$2d,
        isLoraOnly: isLoraOnly$2d,
        maxSize: maxSize$2d,
        name: name$2d,
        toBytes: toBytes$2d
    });

    var id$2c = getCurrentValues$3;
    var name$2c = commandNames$3[getCurrentValues$3];
    var headerSize$2c = 2;
    var maxSize$2c = 0;
    var accessLevel$2c = READ_ONLY;
    var isLoraOnly$2c = false;
    var examples$2b = {
      'simple request': {
        id: id$2c,
        name: name$2c,
        headerSize: headerSize$2c,
        maxSize: maxSize$2c,
        accessLevel: accessLevel$2c,
        parameters: {},
        bytes: [0x0d, 0x00]
      }
    };
    var fromBytes$2b = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2c) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2c = function toBytes() {
      return toBytes$2h(id$2c);
    };

    var getCurrentValues$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2c,
        examples: examples$2b,
        fromBytes: fromBytes$2b,
        headerSize: headerSize$2c,
        id: id$2c,
        isLoraOnly: isLoraOnly$2c,
        maxSize: maxSize$2c,
        name: name$2c,
        toBytes: toBytes$2c
    });

    var id$2b = getDateTime$3;
    var name$2b = commandNames$3[getDateTime$3];
    var headerSize$2b = 2;
    var maxSize$2b = 0;
    var accessLevel$2b = READ_ONLY;
    var isLoraOnly$2b = false;
    var examples$2a = {
      'simple request': {
        id: id$2b,
        name: name$2b,
        headerSize: headerSize$2b,
        maxSize: maxSize$2b,
        accessLevel: accessLevel$2b,
        parameters: {},
        bytes: [0x07, 0x00]
      }
    };
    var fromBytes$2a = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2b) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2b = function toBytes() {
      return toBytes$2h(id$2b);
    };

    var getDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2b,
        examples: examples$2a,
        fromBytes: fromBytes$2a,
        headerSize: headerSize$2b,
        id: id$2b,
        isLoraOnly: isLoraOnly$2b,
        maxSize: maxSize$2b,
        name: name$2b,
        toBytes: toBytes$2b
    });

    var id$2a = getDayMaxDemand$3;
    var name$2a = commandNames$3[getDayMaxDemand$3];
    var headerSize$2a = 2;
    var maxSize$2a = 3;
    var accessLevel$2a = READ_ONLY;
    var isLoraOnly$2a = false;
    var examples$29 = {
      'request for 2024.03.22': {
        id: id$2a,
        name: name$2a,
        headerSize: headerSize$2a,
        maxSize: maxSize$2a,
        accessLevel: accessLevel$2a,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x31, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$29 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$2a = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$2a);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$2a, buffer.data);
    };

    var getDayMaxDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$2a,
        examples: examples$29,
        fromBytes: fromBytes$29,
        headerSize: headerSize$2a,
        id: id$2a,
        isLoraOnly: isLoraOnly$2a,
        maxSize: maxSize$2a,
        name: name$2a,
        toBytes: toBytes$2a
    });

    var id$29 = getDayMaxDemandExport$3;
    var name$29 = commandNames$3[getDayMaxDemandExport$3];
    var headerSize$29 = 2;
    var maxSize$29 = 3;
    var accessLevel$29 = READ_ONLY;
    var isLoraOnly$29 = false;
    var examples$28 = {
      'request for 2024.03.22': {
        id: id$29,
        name: name$29,
        headerSize: headerSize$29,
        maxSize: maxSize$29,
        accessLevel: accessLevel$29,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x58, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$28 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$29 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$29);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$29, buffer.data);
    };

    var getDayMaxDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$29,
        examples: examples$28,
        fromBytes: fromBytes$28,
        headerSize: headerSize$29,
        id: id$29,
        isLoraOnly: isLoraOnly$29,
        maxSize: maxSize$29,
        name: name$29,
        toBytes: toBytes$29
    });

    var id$28 = getDayProfile$3;
    var name$28 = commandNames$3[getDayProfile$3];
    var headerSize$28 = 2;
    var maxSize$28 = 3;
    var accessLevel$28 = READ_ONLY;
    var isLoraOnly$28 = false;
    var examples$27 = {
      'request for active tariff table A+': {
        id: id$28,
        name: name$28,
        maxSize: maxSize$28,
        headerSize: headerSize$28,
        accessLevel: accessLevel$28,
        parameters: {
          tariffTable: 0,
          index: 3,
          isActive: true
        },
        bytes: [0x3b, 0x03, 0x00, 0x03, 0x00]
      }
    };
    var fromBytes$27 = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
        tariffTable = _ref2[0],
        index = _ref2[1],
        isActive = _ref2[2];
      return {
        tariffTable: tariffTable,
        index: index,
        isActive: isActive === 0
      };
    };
    var toBytes$28 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$28);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$2h(id$28, buffer.data);
    };

    var getDayProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$28,
        examples: examples$27,
        fromBytes: fromBytes$27,
        headerSize: headerSize$28,
        id: id$28,
        isLoraOnly: isLoraOnly$28,
        maxSize: maxSize$28,
        name: name$28,
        toBytes: toBytes$28
    });

    var id$27 = getDeviceId$3;
    var name$27 = commandNames$3[getDeviceId$3];
    var headerSize$27 = 2;
    var accessLevel$27 = READ_ONLY;
    var maxSize$27 = 0;
    var isLoraOnly$27 = false;
    var examples$26 = {
      'simple request': {
        id: id$27,
        name: name$27,
        headerSize: headerSize$27,
        accessLevel: accessLevel$27,
        maxSize: maxSize$27,
        parameters: {},
        bytes: [0x05, 0x00]
      }
    };
    var fromBytes$26 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$27) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$27 = function toBytes() {
      return toBytes$2h(id$27);
    };

    var getDeviceId$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$27,
        examples: examples$26,
        fromBytes: fromBytes$26,
        headerSize: headerSize$27,
        id: id$27,
        isLoraOnly: isLoraOnly$27,
        maxSize: maxSize$27,
        name: name$27,
        toBytes: toBytes$27
    });

    var id$26 = getDeviceType$3;
    var name$26 = commandNames$3[getDeviceType$3];
    var headerSize$26 = 2;
    var accessLevel$26 = READ_ONLY;
    var maxSize$26 = 0;
    var isLoraOnly$26 = false;
    var examples$25 = {
      'simple request': {
        id: id$26,
        name: name$26,
        headerSize: headerSize$26,
        maxSize: maxSize$26,
        accessLevel: accessLevel$26,
        parameters: {},
        bytes: [0x04, 0x00]
      }
    };
    var fromBytes$25 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$26) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$26 = function toBytes() {
      return toBytes$2h(id$26);
    };

    var getDeviceType$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$26,
        examples: examples$25,
        fromBytes: fromBytes$25,
        headerSize: headerSize$26,
        id: id$26,
        isLoraOnly: isLoraOnly$26,
        maxSize: maxSize$26,
        name: name$26,
        toBytes: toBytes$26
    });

    var id$25 = getEvents$3;
    var name$25 = commandNames$3[getEvents$3];
    var headerSize$25 = 2;
    var accessLevel$25 = READ_ONLY;
    var maxSize$25 = 4;
    var isLoraOnly$25 = false;
    var examples$24 = {
      'simple request': {
        id: id$25,
        name: name$25,
        headerSize: headerSize$25,
        accessLevel: accessLevel$25,
        maxSize: maxSize$25,
        parameters: {
          date: {
            year: 24,
            month: 2,
            date: 12
          },
          offset: 23
        },
        bytes: [0x33, 0x04, 0x18, 0x02, 0x0c, 0x17]
      }
    };
    var fromBytes$24 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$25) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      var date = buffer.getDate();
      var offset = buffer.getUint8();
      return {
        date: date,
        offset: offset
      };
    };
    var toBytes$25 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$25);
      buffer.setDate(parameters.date);
      buffer.setUint8(parameters.offset);
      return toBytes$2h(id$25, buffer.data);
    };

    var getEvents$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$25,
        examples: examples$24,
        fromBytes: fromBytes$24,
        headerSize: headerSize$25,
        id: id$25,
        isLoraOnly: isLoraOnly$25,
        maxSize: maxSize$25,
        name: name$25,
        toBytes: toBytes$25
    });

    var id$24 = getEventsCounters$3;
    var name$24 = commandNames$3[getEventsCounters$3];
    var headerSize$24 = 2;
    var accessLevel$24 = READ_ONLY;
    var maxSize$24 = 0;
    var isLoraOnly$24 = false;
    var examples$23 = {
      'simple request': {
        id: id$24,
        name: name$24,
        headerSize: headerSize$24,
        accessLevel: accessLevel$24,
        maxSize: maxSize$24,
        parameters: {},
        bytes: [0x34, 0x00]
      }
    };
    var fromBytes$23 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$24) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$24 = function toBytes() {
      return toBytes$2h(id$24);
    };

    var getEventsCounters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$24,
        examples: examples$23,
        fromBytes: fromBytes$23,
        headerSize: headerSize$24,
        id: id$24,
        isLoraOnly: isLoraOnly$24,
        maxSize: maxSize$24,
        name: name$24,
        toBytes: toBytes$24
    });

    var id$23 = getEventStatus$3;
    var name$23 = commandNames$3[getEventStatus$3];
    var headerSize$23 = 2;
    var accessLevel$23 = READ_ONLY;
    var maxSize$23 = 0;
    var isLoraOnly$23 = false;
    var examples$22 = {
      'simple request': {
        id: id$23,
        name: name$23,
        headerSize: headerSize$23,
        accessLevel: accessLevel$23,
        maxSize: maxSize$23,
        parameters: {},
        bytes: [0x01, 0x00]
      }
    };
    var fromBytes$22 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$23) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$23 = function toBytes() {
      return toBytes$2h(id$23);
    };

    var getEventStatus$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$23,
        examples: examples$22,
        fromBytes: fromBytes$22,
        headerSize: headerSize$23,
        id: id$23,
        isLoraOnly: isLoraOnly$23,
        maxSize: maxSize$23,
        name: name$23,
        toBytes: toBytes$23
    });

    var id$22 = getExtendedCurrentValues$3;
    var name$22 = commandNames$3[getExtendedCurrentValues$3];
    var headerSize$22 = 2;
    var maxSize$22 = 0;
    var accessLevel$22 = READ_ONLY;
    var isLoraOnly$22 = false;
    var examples$21 = {
      'simple request': {
        id: id$22,
        name: name$22,
        headerSize: headerSize$22,
        maxSize: maxSize$22,
        accessLevel: accessLevel$22,
        parameters: {},
        bytes: [0x3a, 0x00]
      }
    };
    var fromBytes$21 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$22) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$22 = function toBytes() {
      return toBytes$2h(id$22);
    };

    var getExtendedCurrentValues$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$22,
        examples: examples$21,
        fromBytes: fromBytes$21,
        headerSize: headerSize$22,
        id: id$22,
        isLoraOnly: isLoraOnly$22,
        maxSize: maxSize$22,
        name: name$22,
        toBytes: toBytes$22
    });

    var id$21 = getHalfHourDemand$3;
    var name$21 = commandNames$3[getHalfHourDemand$3];
    var headerSize$21 = 2;
    var maxSize$21 = 3;
    var accessLevel$21 = READ_ONLY;
    var isLoraOnly$21 = false;
    var examples$20 = {
      'request archive values for 2024.03.22': {
        id: id$21,
        name: name$21,
        headerSize: headerSize$21,
        maxSize: maxSize$21,
        accessLevel: accessLevel$21,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x15, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$20 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$21 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$21);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$21, buffer.data);
    };

    var getHalfHourDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$21,
        examples: examples$20,
        fromBytes: fromBytes$20,
        headerSize: headerSize$21,
        id: id$21,
        isLoraOnly: isLoraOnly$21,
        maxSize: maxSize$21,
        name: name$21,
        toBytes: toBytes$21
    });

    var id$20 = getHalfHourDemandExport$3;
    var name$20 = commandNames$3[getHalfHourDemandExport$3];
    var headerSize$20 = 2;
    var maxSize$20 = 3;
    var accessLevel$20 = READ_ONLY;
    var isLoraOnly$20 = false;
    var examples$1$ = {
      'request archive values for 2024.03.22': {
        id: id$20,
        name: name$20,
        headerSize: headerSize$20,
        maxSize: maxSize$20,
        accessLevel: accessLevel$20,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x53, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1$ = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$20 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$20);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$20, buffer.data);
    };

    var getHalfHourDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$20,
        examples: examples$1$,
        fromBytes: fromBytes$1$,
        headerSize: headerSize$20,
        id: id$20,
        isLoraOnly: isLoraOnly$20,
        maxSize: maxSize$20,
        name: name$20,
        toBytes: toBytes$20
    });

    var TARIFF_NUMBER = 4;
    var ENERGY_NAMES = ['A+', 'A+R+', 'A+R-', 'A-', 'A-R+', 'A-R-'];
    var UNDEFINED_ENERGY_VALUE = 0xffffffff;
    var energiesMask = {
      'A+': 0x01,
      'A+R+': 0x02,
      'A+R-': 0x04,
      'A-': 0x08,
      'A-R+': 0x10,
      'A-R-': 0x20
    };
    var getEnergiesFlags = function getEnergiesFlags(energies) {
      var booleanObject = {};
      Object.keys(energies).forEach(function (name) {
        booleanObject[name] = !!energies[name];
      });
      return fromObject(energiesMask, booleanObject);
    };
    var getAPlusTariffBit = function getAPlusTariffBit(tariff) {
      return tariff < TARIFF_NUMBER ? 1 << tariff : 0;
    };
    var getAMinusTariffBit = function getAMinusTariffBit(tariff) {
      return tariff < TARIFF_NUMBER ? 1 << tariff << 4 : 0;
    };
    var getTariffEnergiesFlag = function getTariffEnergiesFlag(tariff, energies) {
      var flag = 0;
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
    function CommandBinaryBuffer$1(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      BinaryBuffer.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer$1.prototype = Object.create(BinaryBuffer.prototype);
    CommandBinaryBuffer$1.prototype.constructor = CommandBinaryBuffer$1;
    CommandBinaryBuffer$1.prototype.getDate = function () {
      var date0 = this.getUint8();
      var date1 = this.getUint8();
      return {
        year: date0 >> 1,
        month: date0 << 3 & 0x0f | date1 >> 5,
        date: date1 & 0x1f
      };
    };
    CommandBinaryBuffer$1.prototype.setDate = function (_ref) {
      var year = _ref.year,
        month = _ref.month,
        date = _ref.date;
      var date0 = year << 1 | month >> 3 & 0x01;
      var date1 = month << 5 & 0xe0 | date & 0x1f;
      this.setUint8(date0);
      this.setUint8(date1);
    };
    CommandBinaryBuffer$1.prototype.getEnergiesFlags = function () {
      var _byte = this.getUint8();
      return toObject(energiesMask, _byte);
    };
    CommandBinaryBuffer$1.prototype.setEnergiesFlags = function (energies) {
      this.setUint8(getEnergiesFlags(energies));
    };
    CommandBinaryBuffer$1.prototype.getHalfHourEnergy1 = function (halfhoursNumber) {
      var halfhours = [];
      for (var index = 0; index < halfhoursNumber; index++) {
        var value = this.getUint16();
        var tariff = value >> 14 & 3;
        var energy = value & 16383;
        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : {
          tariff: tariff,
          energy: energy
        });
      }
      return halfhours;
    };
    CommandBinaryBuffer$1.prototype.setHalfHourEnergy1 = function (halfhours) {
      if (halfhours) {
        for (var index = 0; index < halfhours.length; index++) {
          var _halfhours$index = halfhours[index],
            tariff = _halfhours$index.tariff,
            energy = _halfhours$index.energy;
          var value = tariff << 14 | energy;
          this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
      }
    };
    CommandBinaryBuffer$1.prototype.getHalfHourEnergy3 = function (halfhoursNumber) {
      var halfhours = [];
      for (var index = 0; index < halfhoursNumber; index++) {
        var value = this.getUint16();
        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
      }
      return halfhours;
    };
    CommandBinaryBuffer$1.prototype.setHalfHourEnergy3 = function (halfhours) {
      if (halfhours) {
        for (var index = 0; index < halfhours.length; index++) {
          var value = halfhours[index];
          this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
      }
    };
    CommandBinaryBuffer$1.prototype.getHalfHourEnergies1 = function (energiesFlags, halfhoursNumber) {
      var _this = this;
      var energies = {};
      ENERGY_NAMES.forEach(function (energyName) {
        if (energiesFlags[energyName]) {
          energies[energyName] = _this.getHalfHourEnergy1(halfhoursNumber);
        }
      });
      return energies;
    };
    CommandBinaryBuffer$1.prototype.getHalfHourEnergies3 = function (energiesFlags, halfhoursNumber) {
      var _this2 = this;
      var energies = {};
      ENERGY_NAMES.forEach(function (energyName) {
        if (energiesFlags[energyName]) {
          energies[energyName] = _this2.getHalfHourEnergy3(halfhoursNumber);
        }
      });
      return energies;
    };
    CommandBinaryBuffer$1.prototype.setHalfHourEnergies1 = function (energies) {
      var _this3 = this;
      ENERGY_NAMES.forEach(function (energyName) {
        _this3.setHalfHourEnergy1(energies[energyName]);
      });
    };
    CommandBinaryBuffer$1.prototype.setHalfHourEnergies3 = function (energies) {
      var _this4 = this;
      ENERGY_NAMES.forEach(function (energyName) {
        _this4.setHalfHourEnergy3(energies[energyName]);
      });
    };
    CommandBinaryBuffer$1.prototype.getAPlusTariffEnergies = function (energyFlags) {
      var energies = {};
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
      var energies = {};
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
      var energyFlags = this.getUint8();
      var tariffFlags = this.getUint8();
      var tariffs = new Array(TARIFF_NUMBER).fill(null);
      for (var index = 0; index < TARIFF_NUMBER; index++) {
        if (tariffFlags & getAPlusTariffBit(index)) {
          tariffs[index] = this.getAPlusTariffEnergies(energyFlags);
        }
      }
      for (var _index = 0; _index < TARIFF_NUMBER; _index++) {
        if (tariffFlags & getAMinusTariffBit(_index)) {
          tariffs[_index] = _objectSpread2(_objectSpread2({}, tariffs[_index]), this.getAMinusTariffEnergies(energyFlags));
        }
      }
      return tariffs;
    };
    CommandBinaryBuffer$1.prototype.setTariffsEnergies = function (tariffs) {
      var _this5 = this;
      var energiesFlags = 0;
      var tariffsFlags = 0;
      tariffs.forEach(function (tariff, index) {
        if (tariff) {
          energiesFlags |= getEnergiesFlags(tariff);
          tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
      });
      this.setUint8(energiesFlags);
      this.setUint8(tariffsFlags);
      tariffs.forEach(function (tariff) {
        return _this5.setAPlusTariffEnergies(tariff);
      });
      tariffs.forEach(function (tariff) {
        return _this5.setAMinusTariffEnergies(tariff);
      });
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
        var hours = value.hours,
          minutes = value.minutes,
          power = value.power;
        this.setUint8(hours);
        this.setUint8(minutes);
        this.setUint32(power);
      }
    };
    CommandBinaryBuffer$1.prototype.getAPlusTariffPowerMax = function (energyFlags) {
      var energies = {};
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
      var energies = {};
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
      var energyFlags = this.getUint8();
      var tariffFlags = this.getUint8();
      var tariffs = new Array(TARIFF_NUMBER).fill(null);
      for (var index = 0; index < TARIFF_NUMBER; index++) {
        if (tariffFlags & getAPlusTariffBit(index)) {
          tariffs[index] = this.getAPlusTariffPowerMax(energyFlags);
        }
      }
      for (var _index2 = 0; _index2 < TARIFF_NUMBER; _index2++) {
        if (tariffFlags & getAMinusTariffBit(_index2)) {
          tariffs[_index2] = _objectSpread2(_objectSpread2({}, tariffs[_index2]), this.getAMinusTariffPowerMax(energyFlags));
        }
      }
      return tariffs;
    };
    CommandBinaryBuffer$1.prototype.setTariffsPowerMax = function (tariffs) {
      var _this6 = this;
      var energiesFlags = 0;
      var tariffsFlags = 0;
      tariffs.forEach(function (tariff, index) {
        if (tariff) {
          energiesFlags |= getEnergiesFlags(tariff);
          tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
      });
      this.setUint8(energiesFlags);
      this.setUint8(tariffsFlags);
      tariffs.forEach(function (tariff) {
        return _this6.setAPlusTariffPowerMax(tariff);
      });
      tariffs.forEach(function (tariff) {
        return _this6.setAMinusTariffPowerMax(tariff);
      });
    };

    var id$1$ = getHalfHourEnergies$3;
    var name$1$ = commandNames$3[getHalfHourEnergies$3];
    var headerSize$1$ = 2;
    var maxSize$1$ = 5;
    var accessLevel$1$ = UNENCRYPTED;
    var isLoraOnly$1$ = true;
    var examples$1_ = {
      'request for halfhours energies': {
        id: id$1$,
        name: name$1$,
        headerSize: headerSize$1$,
        maxSize: maxSize$1$,
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
        bytes: [0x6f, 0x05, 0x2a, 0x43, 0x03, 0x05, 0x03]
      }
    };
    var fromBytes$1_ = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$1(bytes);
      return {
        date: buffer.getDate(),
        energies: buffer.getEnergiesFlags(),
        firstHalfhour: buffer.getUint8(),
        halfhoursNumber: buffer.getUint8()
      };
    };
    var toBytes$1$ = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$1(maxSize$1$);
      buffer.setDate(parameters.date);
      buffer.setEnergiesFlags(parameters.energies);
      buffer.setUint8(parameters.firstHalfhour);
      buffer.setUint8(parameters.halfhoursNumber);
      return toBytes$2h(id$1$, buffer.data);
    };

    var getHalfHourEnergies$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1$,
        examples: examples$1_,
        fromBytes: fromBytes$1_,
        headerSize: headerSize$1$,
        id: id$1$,
        isLoraOnly: isLoraOnly$1$,
        maxSize: maxSize$1$,
        name: name$1$,
        toBytes: toBytes$1$
    });

    var id$1_ = getMagneticFieldThreshold$3;
    var name$1_ = commandNames$3[getMagneticFieldThreshold$3];
    var headerSize$1_ = 2;
    var maxSize$1_ = 0;
    var accessLevel$1_ = READ_ONLY;
    var isLoraOnly$1_ = false;
    var examples$1Z = {
      'simple request': {
        id: id$1_,
        name: name$1_,
        headerSize: headerSize$1_,
        maxSize: maxSize$1_,
        accessLevel: accessLevel$1_,
        parameters: {},
        bytes: [0x6d, 0x00]
      }
    };
    var fromBytes$1Z = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1_) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1_ = function toBytes() {
      return toBytes$2h(id$1_);
    };

    var getMagneticFieldThreshold$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1_,
        examples: examples$1Z,
        fromBytes: fromBytes$1Z,
        headerSize: headerSize$1_,
        id: id$1_,
        isLoraOnly: isLoraOnly$1_,
        maxSize: maxSize$1_,
        name: name$1_,
        toBytes: toBytes$1_
    });

    var id$1Z = getMeterInfo$3;
    var name$1Z = commandNames$3[getMeterInfo$3];
    var headerSize$1Z = 2;
    var maxSize$1Z = 0;
    var accessLevel$1Z = READ_ONLY;
    var isLoraOnly$1Z = false;
    var examples$1Y = {
      'simple request': {
        id: id$1Z,
        name: name$1Z,
        headerSize: headerSize$1Z,
        maxSize: maxSize$1Z,
        accessLevel: accessLevel$1Z,
        parameters: {},
        bytes: [0x7a, 0x00]
      }
    };
    var fromBytes$1Y = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1Z) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1Z = function toBytes() {
      return toBytes$2h(id$1Z);
    };

    var getMeterInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Z,
        examples: examples$1Y,
        fromBytes: fromBytes$1Y,
        headerSize: headerSize$1Z,
        id: id$1Z,
        isLoraOnly: isLoraOnly$1Z,
        maxSize: maxSize$1Z,
        name: name$1Z,
        toBytes: toBytes$1Z
    });

    var id$1Y = getMonthDemand$3;
    var name$1Y = commandNames$3[getMonthDemand$3];
    var headerSize$1Y = 2;
    var maxSize$1Y = 2;
    var accessLevel$1Y = READ_ONLY;
    var isLoraOnly$1Y = false;
    var examples$1X = {
      'request energy for 2024.03': {
        id: id$1Y,
        name: name$1Y,
        headerSize: headerSize$1Y,
        maxSize: maxSize$1Y,
        accessLevel: accessLevel$1Y,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x17, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1X = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8()
      };
    };
    var toBytes$1Y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1Y);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      return toBytes$2h(id$1Y, buffer.data);
    };

    var getMonthDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Y,
        examples: examples$1X,
        fromBytes: fromBytes$1X,
        headerSize: headerSize$1Y,
        id: id$1Y,
        isLoraOnly: isLoraOnly$1Y,
        maxSize: maxSize$1Y,
        name: name$1Y,
        toBytes: toBytes$1Y
    });

    var id$1X = getMonthDemandExport$3;
    var name$1X = commandNames$3[getMonthDemandExport$3];
    var headerSize$1X = 2;
    var maxSize$1X = 2;
    var accessLevel$1X = READ_ONLY;
    var isLoraOnly$1X = false;
    var examples$1W = {
      'request energy for 2024.03': {
        id: id$1X,
        name: name$1X,
        headerSize: headerSize$1X,
        maxSize: maxSize$1X,
        accessLevel: accessLevel$1X,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x52, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1W = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8()
      };
    };
    var toBytes$1X = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1X);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      return toBytes$2h(id$1X, buffer.data);
    };

    var getMonthDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1X,
        examples: examples$1W,
        fromBytes: fromBytes$1W,
        headerSize: headerSize$1X,
        id: id$1X,
        isLoraOnly: isLoraOnly$1X,
        maxSize: maxSize$1X,
        name: name$1X,
        toBytes: toBytes$1X
    });

    var id$1W = getMonthMaxDemand$3;
    var name$1W = commandNames$3[getMonthMaxDemand$3];
    var headerSize$1W = 2;
    var maxSize$1W = 2;
    var accessLevel$1W = READ_ONLY;
    var isLoraOnly$1W = false;
    var examples$1V = {
      'request max power for 2024.03': {
        id: id$1W,
        name: name$1W,
        headerSize: headerSize$1W,
        maxSize: maxSize$1W,
        accessLevel: accessLevel$1W,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x32, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1V = function fromBytes(bytes) {
      var _bytes = _slicedToArray(bytes, 2),
        year = _bytes[0],
        month = _bytes[1];
      return {
        year: year,
        month: month
      };
    };
    var toBytes$1W = function toBytes(_ref) {
      var year = _ref.year,
        month = _ref.month;
      return toBytes$2h(id$1W, [year, month]);
    };

    var getMonthMaxDemand$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1W,
        examples: examples$1V,
        fromBytes: fromBytes$1V,
        headerSize: headerSize$1W,
        id: id$1W,
        isLoraOnly: isLoraOnly$1W,
        maxSize: maxSize$1W,
        name: name$1W,
        toBytes: toBytes$1W
    });

    var id$1V = getMonthMaxDemandExport$3;
    var name$1V = commandNames$3[getMonthMaxDemandExport$3];
    var headerSize$1V = 2;
    var maxSize$1V = 2;
    var accessLevel$1V = READ_ONLY;
    var isLoraOnly$1V = false;
    var examples$1U = {
      'request max power for 2024.03': {
        id: id$1V,
        name: name$1V,
        headerSize: headerSize$1V,
        maxSize: maxSize$1V,
        accessLevel: accessLevel$1V,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x59, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1U = function fromBytes(bytes) {
      var _bytes = _slicedToArray(bytes, 2),
        year = _bytes[0],
        month = _bytes[1];
      return {
        year: year,
        month: month
      };
    };
    var toBytes$1V = function toBytes(_ref) {
      var year = _ref.year,
        month = _ref.month;
      return toBytes$2h(id$1V, [year, month]);
    };

    var getMonthMaxDemandExport$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1V,
        examples: examples$1U,
        fromBytes: fromBytes$1U,
        headerSize: headerSize$1V,
        id: id$1V,
        isLoraOnly: isLoraOnly$1V,
        maxSize: maxSize$1V,
        name: name$1V,
        toBytes: toBytes$1V
    });

    var id$1U = getOperatorParameters$3;
    var name$1U = commandNames$3[getOperatorParameters$3];
    var headerSize$1U = 2;
    var maxSize$1U = 0;
    var accessLevel$1U = READ_ONLY;
    var isLoraOnly$1U = false;
    var examples$1T = {
      'simple request': {
        id: id$1U,
        name: name$1U,
        headerSize: headerSize$1U,
        maxSize: maxSize$1U,
        accessLevel: accessLevel$1U,
        parameters: {},
        bytes: [0x1e, 0x00]
      }
    };
    var fromBytes$1T = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1U) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1U = function toBytes() {
      return toBytes$2h(id$1U);
    };

    var getOperatorParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1U,
        examples: examples$1T,
        fromBytes: fromBytes$1T,
        headerSize: headerSize$1U,
        id: id$1U,
        isLoraOnly: isLoraOnly$1U,
        maxSize: maxSize$1U,
        name: name$1U,
        toBytes: toBytes$1U
    });

    var id$1T = getOperatorParametersExtended3$3;
    var name$1T = commandNames$3[getOperatorParametersExtended3$3];
    var headerSize$1T = 2;
    var maxSize$1T = 0;
    var accessLevel$1T = READ_ONLY;
    var isLoraOnly$1T = false;
    var examples$1S = {
      'simple request': {
        id: id$1T,
        name: name$1T,
        headerSize: headerSize$1T,
        maxSize: maxSize$1T,
        accessLevel: accessLevel$1T,
        parameters: {},
        bytes: [0x71, 0x00]
      }
    };
    var fromBytes$1S = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1T) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1T = function toBytes() {
      return toBytes$2h(id$1T);
    };

    var getOperatorParametersExtended3$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1T,
        examples: examples$1S,
        fromBytes: fromBytes$1S,
        headerSize: headerSize$1T,
        id: id$1T,
        isLoraOnly: isLoraOnly$1T,
        maxSize: maxSize$1T,
        name: name$1T,
        toBytes: toBytes$1T
    });

    var id$1S = getRatePlanInfo$3;
    var name$1S = commandNames$3[getRatePlanInfo$3];
    var headerSize$1S = 2;
    var maxSize$1S = 1;
    var accessLevel$1S = READ_ONLY;
    var isLoraOnly$1S = false;
    var examples$1R = {
      'request for table A-': {
        id: id$1S,
        name: name$1S,
        headerSize: headerSize$1S,
        maxSize: maxSize$1S,
        accessLevel: accessLevel$1S,
        parameters: {
          tariffTable: 1
        },
        bytes: [0x2c, 0x01, 0x01]
      }
    };
    var fromBytes$1R = function fromBytes(bytes) {
      return {
        tariffTable: bytes[0]
      };
    };
    var toBytes$1S = function toBytes(parameters) {
      return toBytes$2h(id$1S, [parameters.tariffTable]);
    };

    var getRatePlanInfo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1S,
        examples: examples$1R,
        fromBytes: fromBytes$1R,
        headerSize: headerSize$1S,
        id: id$1S,
        isLoraOnly: isLoraOnly$1S,
        maxSize: maxSize$1S,
        name: name$1S,
        toBytes: toBytes$1S
    });

    var id$1R = getSaldo$3;
    var name$1R = commandNames$3[getSaldo$3];
    var headerSize$1R = 2;
    var maxSize$1R = 0;
    var accessLevel$1R = READ_ONLY;
    var isLoraOnly$1R = false;
    var examples$1Q = {
      'simple request': {
        id: id$1R,
        name: name$1R,
        headerSize: headerSize$1R,
        maxSize: maxSize$1R,
        accessLevel: accessLevel$1R,
        parameters: {},
        bytes: [0x29, 0x00]
      }
    };
    var fromBytes$1Q = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1R) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1R = function toBytes() {
      return toBytes$2h(id$1R);
    };

    var getSaldo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1R,
        examples: examples$1Q,
        fromBytes: fromBytes$1Q,
        headerSize: headerSize$1R,
        id: id$1R,
        isLoraOnly: isLoraOnly$1R,
        maxSize: maxSize$1R,
        name: name$1R,
        toBytes: toBytes$1R
    });

    var id$1Q = getSaldoParameters$3;
    var name$1Q = commandNames$3[getSaldoParameters$3];
    var headerSize$1Q = 2;
    var maxSize$1Q = 0;
    var accessLevel$1Q = READ_ONLY;
    var isLoraOnly$1Q = false;
    var examples$1P = {
      'simple request': {
        id: id$1Q,
        name: name$1Q,
        headerSize: headerSize$1Q,
        maxSize: maxSize$1Q,
        accessLevel: accessLevel$1Q,
        parameters: {},
        bytes: [0x2e, 0x00]
      }
    };
    var fromBytes$1P = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1Q) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1Q = function toBytes() {
      return toBytes$2h(id$1Q);
    };

    var getSaldoParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1Q,
        examples: examples$1P,
        fromBytes: fromBytes$1P,
        headerSize: headerSize$1Q,
        id: id$1Q,
        isLoraOnly: isLoraOnly$1Q,
        maxSize: maxSize$1Q,
        name: name$1Q,
        toBytes: toBytes$1Q
    });

    var id$1P = getSeasonProfile$3;
    var name$1P = commandNames$3[getSeasonProfile$3];
    var headerSize$1P = 2;
    var maxSize$1P = 3;
    var accessLevel$1P = READ_ONLY;
    var isLoraOnly$1P = false;
    var examples$1O = {
      'request for passive tariff table A+': {
        id: id$1P,
        name: name$1P,
        headerSize: headerSize$1P,
        maxSize: maxSize$1P,
        accessLevel: accessLevel$1P,
        parameters: {
          tariffTable: 0,
          index: 5,
          isActive: false
        },
        bytes: [0x3c, 0x03, 0x00, 0x05, 0x01]
      }
    };
    var fromBytes$1O = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
        tariffTable = _ref2[0],
        index = _ref2[1],
        isActive = _ref2[2];
      return {
        tariffTable: tariffTable,
        index: index,
        isActive: isActive === 0
      };
    };
    var toBytes$1P = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1P);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$2h(id$1P, buffer.data);
    };

    var getSeasonProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1P,
        examples: examples$1O,
        fromBytes: fromBytes$1O,
        headerSize: headerSize$1P,
        id: id$1P,
        isLoraOnly: isLoraOnly$1P,
        maxSize: maxSize$1P,
        name: name$1P,
        toBytes: toBytes$1P
    });

    var id$1O = getSpecialDay$3;
    var name$1O = commandNames$3[getSpecialDay$3];
    var headerSize$1O = 2;
    var maxSize$1O = 3;
    var accessLevel$1O = READ_ONLY;
    var isLoraOnly$1O = false;
    var examples$1N = {
      'request for passive tariff table A+': {
        id: id$1O,
        name: name$1O,
        headerSize: headerSize$1O,
        maxSize: maxSize$1O,
        accessLevel: accessLevel$1O,
        parameters: {
          tariffTable: 0,
          index: 5,
          isActive: false
        },
        bytes: [0x3d, 0x03, 0x00, 0x05, 0x01]
      }
    };
    var fromBytes$1N = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
        tariffTable = _ref2[0],
        index = _ref2[1],
        isActive = _ref2[2];
      return {
        tariffTable: tariffTable,
        index: index,
        isActive: isActive === 0
      };
    };
    var toBytes$1O = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1O);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$2h(id$1O, buffer.data);
    };

    var getSpecialDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1O,
        examples: examples$1N,
        fromBytes: fromBytes$1N,
        headerSize: headerSize$1O,
        id: id$1O,
        isLoraOnly: isLoraOnly$1O,
        maxSize: maxSize$1O,
        name: name$1O,
        toBytes: toBytes$1O
    });

    var id$1N = getVersion$3;
    var name$1N = commandNames$3[getVersion$3];
    var headerSize$1N = 2;
    var maxSize$1N = 0;
    var accessLevel$1N = READ_ONLY;
    var isLoraOnly$1N = false;
    var examples$1M = {
      'simple request': {
        id: id$1N,
        name: name$1N,
        headerSize: headerSize$1N,
        maxSize: maxSize$1N,
        accessLevel: accessLevel$1N,
        parameters: {},
        bytes: [0x28, 0x00]
      }
    };
    var fromBytes$1M = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1N) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1N = function toBytes() {
      return toBytes$2h(id$1N);
    };

    var getVersion$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1N,
        examples: examples$1M,
        fromBytes: fromBytes$1M,
        headerSize: headerSize$1N,
        id: id$1N,
        isLoraOnly: isLoraOnly$1N,
        maxSize: maxSize$1N,
        name: name$1N,
        toBytes: toBytes$1N
    });

    var id$1M = prepareRatePlan$3;
    var name$1M = commandNames$3[prepareRatePlan$3];
    var headerSize$1M = 2;
    var maxSize$1M = 5;
    var accessLevel$1M = READ_WRITE;
    var isLoraOnly$1M = false;
    var examples$1L = {
      'prepare rate plan request': {
        id: id$1M,
        name: name$1M,
        headerSize: headerSize$1M,
        maxSize: maxSize$1M,
        accessLevel: accessLevel$1M,
        parameters: {
          tariffTable: 0,
          id: 987654321
        },
        bytes: [0x14, 0x05, 0x00, 0x3a, 0xde, 0x68, 0xb1]
      }
    };
    var fromBytes$1L = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        tariffTable: buffer.getUint8(),
        id: buffer.getUint32()
      };
    };
    var toBytes$1M = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1M);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint32(parameters.id);
      return toBytes$2h(id$1M, buffer.data);
    };

    var prepareRatePlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1M,
        examples: examples$1L,
        fromBytes: fromBytes$1L,
        headerSize: headerSize$1M,
        id: id$1M,
        isLoraOnly: isLoraOnly$1M,
        maxSize: maxSize$1M,
        name: name$1M,
        toBytes: toBytes$1M
    });

    var id$1L = resetPowerMaxDay$3;
    var name$1L = commandNames$3[resetPowerMaxDay$3];
    var headerSize$1L = 2;
    var maxSize$1L = 0;
    var accessLevel$1L = READ_WRITE;
    var isLoraOnly$1L = false;
    var examples$1K = {
      'simple request': {
        id: id$1L,
        name: name$1L,
        headerSize: headerSize$1L,
        maxSize: maxSize$1L,
        accessLevel: accessLevel$1L,
        parameters: {},
        bytes: [0x35, 0x00]
      }
    };
    var fromBytes$1K = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1L) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1L = function toBytes() {
      return toBytes$2h(id$1L);
    };

    var resetPowerMaxDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1L,
        examples: examples$1K,
        fromBytes: fromBytes$1K,
        headerSize: headerSize$1L,
        id: id$1L,
        isLoraOnly: isLoraOnly$1L,
        maxSize: maxSize$1L,
        name: name$1L,
        toBytes: toBytes$1L
    });

    var id$1K = resetPowerMaxMonth$3;
    var name$1K = commandNames$3[resetPowerMaxMonth$3];
    var headerSize$1K = 2;
    var maxSize$1K = 0;
    var accessLevel$1K = READ_WRITE;
    var isLoraOnly$1K = false;
    var examples$1J = {
      'simple request': {
        id: id$1K,
        name: name$1K,
        headerSize: headerSize$1K,
        maxSize: maxSize$1K,
        accessLevel: accessLevel$1K,
        parameters: {},
        bytes: [0x36, 0x00]
      }
    };
    var fromBytes$1J = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1K) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1K = function toBytes() {
      return toBytes$2h(id$1K);
    };

    var resetPowerMaxMonth$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1K,
        examples: examples$1J,
        fromBytes: fromBytes$1J,
        headerSize: headerSize$1K,
        id: id$1K,
        isLoraOnly: isLoraOnly$1K,
        maxSize: maxSize$1K,
        name: name$1K,
        toBytes: toBytes$1K
    });

    var id$1J = runTariffPlan$3;
    var name$1J = commandNames$3[runTariffPlan$3];
    var headerSize$1J = 2;
    var maxSize$1J = 1;
    var accessLevel$1J = READ_WRITE;
    var isLoraOnly$1J = false;
    var examples$1I = {
      'simple request': {
        id: id$1J,
        name: name$1J,
        headerSize: headerSize$1J,
        maxSize: maxSize$1J,
        accessLevel: accessLevel$1J,
        parameters: {
          tariffTable: 5
        },
        bytes: [0x46, 0x01, 0x05]
      }
    };
    var fromBytes$1I = function fromBytes(bytes) {
      return {
        tariffTable: bytes[0]
      };
    };
    var toBytes$1J = function toBytes(parameters) {
      return toBytes$2h(id$1J, [parameters.tariffTable]);
    };

    var runTariffPlan$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1J,
        examples: examples$1I,
        fromBytes: fromBytes$1I,
        headerSize: headerSize$1J,
        id: id$1J,
        isLoraOnly: isLoraOnly$1J,
        maxSize: maxSize$1J,
        name: name$1J,
        toBytes: toBytes$1J
    });

    var KEY_SIZE = 16;
    var id$1I = setAccessKey$3;
    var name$1I = commandNames$3[setAccessKey$3];
    var headerSize$1I = 2;
    var maxSize$1I = 1 + KEY_SIZE;
    var accessLevel$1I = READ_WRITE;
    var isLoraOnly$1I = false;
    var examples$1H = {
      'set key for READ_ONLY access level': {
        id: id$1I,
        name: name$1I,
        headerSize: headerSize$1I,
        maxSize: maxSize$1I,
        accessLevel: accessLevel$1I,
        parameters: {
          accessLevel: READ_ONLY,
          key: [0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0]
        },
        bytes: [0x09, 0x11, 0x03, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00]
      }
    };
    var fromBytes$1H = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        accessLevel: buffer.getUint8(),
        key: buffer.getBytes(KEY_SIZE)
      };
    };
    var toBytes$1I = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1I);
      buffer.setUint8(parameters.accessLevel);
      buffer.setBytes(parameters.key);
      return toBytes$2h(id$1I, buffer.data);
    };

    var setAccessKey$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1I,
        examples: examples$1H,
        fromBytes: fromBytes$1H,
        headerSize: headerSize$1I,
        id: id$1I,
        isLoraOnly: isLoraOnly$1I,
        maxSize: maxSize$1I,
        name: name$1I,
        toBytes: toBytes$1I
    });

    var id$1H = setCorrectDateTime$3;
    var name$1H = commandNames$3[setCorrectDateTime$3];
    var headerSize$1H = 2;
    var maxSize$1H = 2;
    var accessLevel$1H = READ_ONLY;
    var isLoraOnly$1H = false;
    var examples$1G = {
      'shift device time 5 seconds forward': {
        id: id$1H,
        name: name$1H,
        headerSize: headerSize$1H,
        maxSize: maxSize$1H,
        accessLevel: accessLevel$1H,
        parameters: {
          seconds: 5
        },
        bytes: [0x5c, 0x02, 0x00, 0x05]
      },
      'shift device time 5 seconds backward': {
        id: id$1H,
        name: name$1H,
        headerSize: headerSize$1H,
        maxSize: maxSize$1H,
        parameters: {
          seconds: -5
        },
        bytes: [0x5c, 0x02, 0xff, 0xfb]
      }
    };
    var fromBytes$1G = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1H) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        seconds: buffer.getInt16()
      };
    };
    var toBytes$1H = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1H);
      buffer.setInt16(parameters.seconds);
      return toBytes$2h(id$1H, buffer.data);
    };

    var setCorrectDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1H,
        examples: examples$1G,
        fromBytes: fromBytes$1G,
        headerSize: headerSize$1H,
        id: id$1H,
        isLoraOnly: isLoraOnly$1H,
        maxSize: maxSize$1H,
        name: name$1H,
        toBytes: toBytes$1H
    });

    var id$1G = setCorrectTime$3;
    var name$1G = commandNames$3[setCorrectTime$3];
    var headerSize$1G = 2;
    var maxSize$1G = 9;
    var accessLevel$1G = READ_WRITE;
    var isLoraOnly$1G = false;
    var examples$1F = {
      'default parameters': {
        id: id$1G,
        name: name$1G,
        headerSize: headerSize$1G,
        maxSize: maxSize$1G,
        accessLevel: accessLevel$1G,
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
        bytes: [0x1c, 0x09, 0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01]
      }
    };
    var fromBytes$1F = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1G) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getTimeCorrectionParameters();
    };
    var toBytes$1G = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1G);
      buffer.setTimeCorrectionParameters(parameters);
      return toBytes$2h(id$1G, buffer.data);
    };

    var setCorrectTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1G,
        examples: examples$1F,
        fromBytes: fromBytes$1F,
        headerSize: headerSize$1G,
        id: id$1G,
        isLoraOnly: isLoraOnly$1G,
        maxSize: maxSize$1G,
        name: name$1G,
        toBytes: toBytes$1G
    });

    var id$1F = setDateTime$3;
    var name$1F = commandNames$3[setDateTime$3];
    var headerSize$1F = 2;
    var maxSize$1F = 8;
    var accessLevel$1F = READ_ONLY;
    var isLoraOnly$1F = false;
    var examples$1E = {
      'time: 2024.02.19 18:31:55': {
        id: id$1F,
        name: name$1F,
        headerSize: headerSize$1F,
        maxSize: maxSize$1F,
        accessLevel: accessLevel$1F,
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
        bytes: [0x08, 0x08, 0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18]
      }
    };
    var fromBytes$1E = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getDateTime();
    };
    var toBytes$1F = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1F);
      buffer.setDateTime(parameters);
      return toBytes$2h(id$1F, buffer.data);
    };

    var setDateTime$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1F,
        examples: examples$1E,
        fromBytes: fromBytes$1E,
        headerSize: headerSize$1F,
        id: id$1F,
        isLoraOnly: isLoraOnly$1F,
        maxSize: maxSize$1F,
        name: name$1F,
        toBytes: toBytes$1F
    });

    var MAX_PERIODS_NUMBER$1 = 8;
    var PERIODS_FINAL_BYTE$1 = 0xff;
    var id$1E = setDayProfile$3;
    var name$1E = commandNames$3[setDayProfile$3];
    var headerSize$1E = 2;
    var maxSize$1E = 2 + MAX_PERIODS_NUMBER$1;
    var accessLevel$1E = READ_WRITE;
    var isLoraOnly$1E = false;
    var examples$1D = {
      'set day profile with 1 period': {
        id: id$1E,
        name: name$1E,
        headerSize: headerSize$1E,
        maxSize: maxSize$1E,
        accessLevel: accessLevel$1E,
        parameters: {
          tariffTable: 0,
          index: 3,
          periods: [{
            tariff: 0,
            isFirstHalfHour: true,
            hour: 2
          }]
        },
        bytes: [0x10, 0x04, 0x00, 0x03, 0x10, 0xff]
      },
      'set day profile with 4 periods': {
        id: id$1E,
        name: name$1E,
        headerSize: headerSize$1E,
        maxSize: maxSize$1E,
        accessLevel: accessLevel$1E,
        parameters: {
          tariffTable: 0,
          index: 5,
          periods: [{
            tariff: 0,
            isFirstHalfHour: true,
            hour: 2
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 3
          }, {
            tariff: 2,
            isFirstHalfHour: true,
            hour: 4
          }, {
            tariff: 3,
            isFirstHalfHour: false,
            hour: 5
          }]
        },
        bytes: [0x10, 0x07, 0x00, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff]
      },
      'set day profile with max periods': {
        id: id$1E,
        name: name$1E,
        headerSize: headerSize$1E,
        maxSize: maxSize$1E,
        accessLevel: accessLevel$1E,
        parameters: {
          tariffTable: 0,
          index: 3,
          periods: [{
            tariff: 0,
            isFirstHalfHour: true,
            hour: 2
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 3
          }, {
            tariff: 2,
            isFirstHalfHour: true,
            hour: 4
          }, {
            tariff: 3,
            isFirstHalfHour: false,
            hour: 5
          }, {
            tariff: 0,
            isFirstHalfHour: true,
            hour: 6
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 7
          }, {
            tariff: 2,
            isFirstHalfHour: false,
            hour: 8
          }, {
            tariff: 3,
            isFirstHalfHour: true,
            hour: 9
          }]
        },
        bytes: [0x10, 0x0a, 0x00, 0x03, 0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b]
      }
    };
    var fromBytes$1D = function fromBytes(bytes) {
      var finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE$1);
      var cleanBytes = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
      var buffer = new CommandBinaryBuffer$2(cleanBytes);
      return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        periods: _toConsumableArray(cleanBytes.slice(buffer.offset)).map(CommandBinaryBuffer$2.getDayProfileFromByte)
      };
    };
    var toBytes$1E = function toBytes(parameters) {
      var hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER$1;
      var size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
      var buffer = new CommandBinaryBuffer$2(size);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      parameters.periods.forEach(function (period) {
        buffer.setDayProfile(period);
      });
      if (hasPeriodsFinalByte) {
        buffer.setUint8(PERIODS_FINAL_BYTE$1);
      }
      return toBytes$2h(id$1E, buffer.data);
    };

    var setDayProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1E,
        examples: examples$1D,
        fromBytes: fromBytes$1D,
        headerSize: headerSize$1E,
        id: id$1E,
        isLoraOnly: isLoraOnly$1E,
        maxSize: maxSize$1E,
        name: name$1E,
        toBytes: toBytes$1E
    });

    var id$1D = setOperatorParametersExtended3$3;
    var name$1D = commandNames$3[setOperatorParametersExtended3$3];
    var headerSize$1D = 2;
    var maxSize$1D = 17;
    var accessLevel$1D = READ_WRITE;
    var isLoraOnly$1D = false;
    var examples$1C = {
      'simple request': {
        id: id$1D,
        name: name$1D,
        headerSize: headerSize$1D,
        maxSize: maxSize$1D,
        accessLevel: accessLevel$1D,
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
        bytes: [0x72, 0x11, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xc8, 0x00, 0x00, 0x01, 0x2c, 0x00, 0x00, 0x01, 0x90, 0x28]
      }
    };
    var fromBytes$1C = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getOperatorParametersExtended3();
    };
    var toBytes$1D = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1D);
      buffer.setOperatorParametersExtended3(parameters);
      return toBytes$2h(id$1D, buffer.data);
    };

    var setOperatorParametersExtended3$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1D,
        examples: examples$1C,
        fromBytes: fromBytes$1C,
        headerSize: headerSize$1D,
        id: id$1D,
        isLoraOnly: isLoraOnly$1D,
        maxSize: maxSize$1D,
        name: name$1D,
        toBytes: toBytes$1D
    });

    var id$1C = setSaldo$3;
    var name$1C = commandNames$3[setSaldo$3];
    var headerSize$1C = 2;
    var maxSize$1C = 12;
    var accessLevel$1C = READ_WRITE;
    var isLoraOnly$1C = false;
    var examples$1B = {
      'test request': {
        id: id$1C,
        name: name$1C,
        headerSize: headerSize$1C,
        maxSize: maxSize$1C,
        accessLevel: accessLevel$1C,
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
        bytes: [0x2a, 0x0c, 0x09, 0x17, 0x06, 0x23, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x05]
      }
    };
    var fromBytes$1B = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
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
    var toBytes$1C = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1C);
      buffer.setUint8(parameters.date.month);
      buffer.setUint8(parameters.date.date);
      buffer.setUint8(parameters.date.hours);
      buffer.setUint8(parameters.date.minutes);
      buffer.setInt32(parameters.saldoNew);
      buffer.setInt32(parameters.saldoOld);
      return toBytes$2h(id$1C, buffer.data);
    };

    var setSaldo$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1C,
        examples: examples$1B,
        fromBytes: fromBytes$1B,
        headerSize: headerSize$1C,
        id: id$1C,
        isLoraOnly: isLoraOnly$1C,
        maxSize: maxSize$1C,
        name: name$1C,
        toBytes: toBytes$1C
    });

    var id$1B = setSaldoParameters$3;
    var name$1B = commandNames$3[setSaldoParameters$3];
    var headerSize$1B = 2;
    var maxSize$1B = 37;
    var accessLevel$1B = READ_WRITE;
    var isLoraOnly$1B = false;
    var examples$1A = {
      'test parameters': {
        id: id$1B,
        name: name$1B,
        headerSize: headerSize$1B,
        maxSize: maxSize$1B,
        accessLevel: accessLevel$1B,
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
        bytes: [0x2f, 0x25, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x0e]
      }
    };
    var fromBytes$1A = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getSaldoParameters();
    };
    var toBytes$1B = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1B);
      buffer.setSaldoParameters(parameters);
      return toBytes$2h(id$1B, buffer.data);
    };

    var setSaldoParameters$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1B,
        examples: examples$1A,
        fromBytes: fromBytes$1A,
        headerSize: headerSize$1B,
        id: id$1B,
        isLoraOnly: isLoraOnly$1B,
        maxSize: maxSize$1B,
        name: name$1B,
        toBytes: toBytes$1B
    });

    var id$1A = setSeasonProfile$3;
    var name$1A = commandNames$3[setSeasonProfile$3];
    var headerSize$1A = 2;
    var maxSize$1A = SEASON_PROFILE_SIZE;
    var accessLevel$1A = READ_WRITE;
    var isLoraOnly$1A = false;
    var examples$1z = {
      'set default season profile': {
        id: id$1A,
        name: name$1A,
        headerSize: headerSize$1A,
        maxSize: maxSize$1A,
        accessLevel: accessLevel$1A,
        parameters: {
          tariffTable: 1,
          index: 8,
          month: 1,
          date: 1,
          dayIndexes: [0, 0, 0, 0, 0, 0, 0]
        },
        bytes: [0x11, 0x0b, 0x01, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
      },
      'set some season profile': {
        id: id$1A,
        name: name$1A,
        headerSize: headerSize$1A,
        maxSize: maxSize$1A,
        accessLevel: accessLevel$1A,
        parameters: {
          tariffTable: 0,
          index: 2,
          month: 5,
          date: 9,
          dayIndexes: [0, 1, 2, 3, 4, 5, 6]
        },
        bytes: [0x11, 0x0b, 0x00, 0x02, 0x05, 0x09, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]
      }
    };
    var fromBytes$1z = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return _objectSpread2({
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8()
      }, buffer.getSeasonProfile());
    };
    var toBytes$1A = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1A);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setSeasonProfile(parameters);
      return toBytes$2h(id$1A, buffer.data);
    };

    var setSeasonProfile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1A,
        examples: examples$1z,
        fromBytes: fromBytes$1z,
        headerSize: headerSize$1A,
        id: id$1A,
        isLoraOnly: isLoraOnly$1A,
        maxSize: maxSize$1A,
        name: name$1A,
        toBytes: toBytes$1A
    });

    var id$1z = setSpecialDay$3;
    var name$1z = commandNames$3[setSpecialDay$3];
    var headerSize$1z = 2;
    var maxSize$1z = 6;
    var accessLevel$1z = READ_WRITE;
    var isLoraOnly$1z = false;
    var examples$1y = {
      'set special day': {
        id: id$1z,
        name: name$1z,
        headerSize: headerSize$1z,
        maxSize: maxSize$1z,
        accessLevel: accessLevel$1z,
        parameters: {
          tariffTable: 1,
          index: 5,
          month: 1,
          date: 9,
          dayIndex: 3,
          isPeriodic: true
        },
        bytes: [0x12, 0x06, 0x01, 0x05, 0x01, 0x09, 0x03, 0x00]
      }
    };
    var fromBytes$1y = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return _objectSpread2({
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8()
      }, buffer.getSpecialDay());
    };
    var toBytes$1z = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1z);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setSpecialDay(parameters);
      return toBytes$2h(id$1z, buffer.data);
    };

    var setSpecialDay$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1z,
        examples: examples$1y,
        fromBytes: fromBytes$1y,
        headerSize: headerSize$1z,
        id: id$1z,
        isLoraOnly: isLoraOnly$1z,
        maxSize: maxSize$1z,
        name: name$1z,
        toBytes: toBytes$1z
    });

    var RESET_INFLUENCE_SCREENS = 0x55;

    var id$1y = setSpecialOperation$3;
    var name$1y = commandNames$3[setSpecialOperation$3];
    var headerSize$1y = 2;
    var maxSize$1y = 2;
    var accessLevel$1y = READ_WRITE;
    var isLoraOnly$1y = false;
    var examples$1x = {
      'read screens info': {
        id: id$1y,
        name: name$1y,
        headerSize: headerSize$1y,
        maxSize: maxSize$1y,
        accessLevel: accessLevel$1y,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: true,
          resetElectroMagneticIndication: false,
          resetMagneticIndication: false
        },
        bytes: [0x64, 0x02, 0x55, 0x80]
      },
      'reset both screens': {
        id: id$1y,
        name: name$1y,
        headerSize: headerSize$1y,
        maxSize: maxSize$1y,
        accessLevel: accessLevel$1y,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: false,
          resetElectroMagneticIndication: true,
          resetMagneticIndication: true
        },
        bytes: [0x64, 0x02, 0x55, 0x03]
      },
      'reset magnetic screen': {
        id: id$1y,
        name: name$1y,
        headerSize: headerSize$1y,
        maxSize: maxSize$1y,
        accessLevel: accessLevel$1y,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: false,
          resetElectroMagneticIndication: false,
          resetMagneticIndication: true
        },
        bytes: [0x64, 0x02, 0x55, 0x02]
      }
    };
    var fromBytes$1x = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      var type = buffer.getUint8();
      var flags = buffer.getUint8();
      var readScreensInfo = !!(flags & 0x80);
      var resetElectroMagneticIndication = !!(flags & 1);
      var resetMagneticIndication = !!(flags & 2);
      return {
        type: type,
        readScreensInfo: readScreensInfo,
        resetElectroMagneticIndication: resetElectroMagneticIndication,
        resetMagneticIndication: resetMagneticIndication
      };
    };
    var toBytes$1y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$1y);
      var flags = 0;
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
      return toBytes$2h(id$1y, buffer.data);
    };

    var setSpecialOperation$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1y,
        examples: examples$1x,
        fromBytes: fromBytes$1x,
        headerSize: headerSize$1y,
        id: id$1y,
        isLoraOnly: isLoraOnly$1y,
        maxSize: maxSize$1y,
        name: name$1y,
        toBytes: toBytes$1y
    });

    var id$1x = turnRelayOff$3;
    var name$1x = commandNames$3[turnRelayOff$3];
    var headerSize$1x = 2;
    var maxSize$1x = 0;
    var accessLevel$1x = READ_WRITE;
    var isLoraOnly$1x = false;
    var examples$1w = {
      'simple request': {
        id: id$1x,
        name: name$1x,
        headerSize: headerSize$1x,
        maxSize: maxSize$1x,
        accessLevel: accessLevel$1x,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$1w = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1x) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1x = function toBytes() {
      return toBytes$2h(id$1x);
    };

    var turnRelayOff$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1x,
        examples: examples$1w,
        fromBytes: fromBytes$1w,
        headerSize: headerSize$1x,
        id: id$1x,
        isLoraOnly: isLoraOnly$1x,
        maxSize: maxSize$1x,
        name: name$1x,
        toBytes: toBytes$1x
    });

    var id$1w = turnRelayOn$3;
    var name$1w = commandNames$3[turnRelayOn$3];
    var headerSize$1w = 2;
    var maxSize$1w = 0;
    var accessLevel$1w = READ_WRITE;
    var isLoraOnly$1w = false;
    var examples$1v = {
      'simple request': {
        id: id$1w,
        name: name$1w,
        headerSize: headerSize$1w,
        maxSize: maxSize$1w,
        accessLevel: accessLevel$1w,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$1v = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1w) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1w = function toBytes() {
      return toBytes$2h(id$1w);
    };

    var turnRelayOn$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1w,
        examples: examples$1v,
        fromBytes: fromBytes$1v,
        headerSize: headerSize$1w,
        id: id$1w,
        isLoraOnly: isLoraOnly$1w,
        maxSize: maxSize$1w,
        name: name$1w,
        toBytes: toBytes$1w
    });

    var CASE_OPEN$1 = 0;
    var MAGNETIC_ON$1 = 1;
    var PARAMETERS_UPDATE_REMOTE = 2;
    var PARAMETERS_UPDATE_LOCAL = 3;
    var RESTART$1 = 4;
    var ERROR_ACCESS = 5;
    var TIME_SET = 6;
    var TIME_CORRECT$1 = 7;
    var DEVICE_FAILURE = 8;
    var CASE_TERMINAL_OPEN = 9;
    var CASE_MODULE_OPEN$1 = 10;
    var TARIFF_TABLE_SET = 11;
    var TARIFF_TABLE_GET = 12;
    var PROTECTION_RESET_EM = 13;
    var PROTECTION_RESET_MAGNETIC = 14;

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

    var criticalEventNames = invertObject(criticalEvents);

    var getEventStatus$1 = 0x01;
    var getEnergyDayPrevious$2 = 0x03;
    var getDeviceType$1 = 0x04;
    var getDeviceId$1 = 0x05;
    var getDateTime$1 = 0x07;
    var setDateTime$1 = 0x08;
    var setAccessKey$1 = 0x09;
    var getCurrentValues$1 = 0x0d;
    var getEnergy$2 = 0x0f;
    var setDayProfile$1 = 0x10;
    var setSeasonProfile$1 = 0x11;
    var setSpecialDay$1 = 0x12;
    var activateRatePlan$1 = 0x13;
    var prepareRatePlan$1 = 0x14;
    var getHalfHourDemand$1 = 0x15;
    var getDayDemand$2 = 0x16;
    var getMonthDemand$1 = 0x17;
    var turnRelayOn$1 = 0x18;
    var turnRelayOff$1 = 0x19;
    var setCorrectTime$1 = 0x1c;
    var getOperatorParameters$1 = 0x1e;
    var setOperatorParameters$2 = 0x1f;
    var getVersion$1 = 0x28;
    var getSaldo$1 = 0x29;
    var setSaldo$1 = 0x2a;
    var getRatePlanInfo$1 = 0x2c;
    var getSaldoParameters$1 = 0x2e;
    var setSaldoParameters$1 = 0x2f;
    var getDayMaxDemand$1 = 0x31;
    var getMonthMaxDemand$1 = 0x32;
    var getEvents$1 = 0x33;
    var getEventsCounters$1 = 0x34;
    var resetPowerMaxDay$1 = 0x35;
    var resetPowerMaxMonth$1 = 0x36;
    var getCurrentStatusMeter$1 = 0x39;
    var getExtendedCurrentValues$1 = 0x3a;
    var getDayProfile$1 = 0x3b;
    var getSeasonProfile$1 = 0x3c;
    var getSpecialDay$1 = 0x3d;
    var getCorrectTime$1 = 0x3e;
    var getOperatorParametersExtended$2 = 0x3f;
    var setOperatorParametersExtended$2 = 0x40;
    var setOperatorParametersExtended2$2 = 0x45;
    var runTariffPlan$1 = 0x46;
    var getOperatorParametersExtended2$2 = 0x47;
    var getHalfHourDemandVari$2 = 0x48;
    var getHalfHourDemandVare$2 = 0x49;
    var getEnergyExport$2 = 0x4e;
    var getDayDemandExport$2 = 0x4f;
    var getEnergyExportDayPrevious$2 = 0x50;
    var getMonthDemandExport$1 = 0x52;
    var getHalfHourDemandExport$1 = 0x53;
    var getHalfHourDemandVariExport$2 = 0x54;
    var getHalfHourDemandVareExport$2 = 0x55;
    var getCriticalEvent$2 = 0x56;
    var getDayMaxDemandExport$1 = 0x58;
    var getMonthMaxDemandExport$1 = 0x59;
    var getHalfHourDemandChannel$2 = 0x5a;
    var setCorrectDateTime$1 = 0x5c;
    var setDisplayParam$2 = 0x5d;
    var getDisplayParam$2 = 0x5e;
    var setSpecialOperation$1 = 0x64;
    var getMagneticFieldThreshold$1 = 0x6d;
    var getHalfHourEnergies$1 = 0x6f;
    var getBuildVersion$1 = 0x70;
    var getOperatorParametersExtended3$1 = 0x71;
    var setOperatorParametersExtended3$1 = 0x72;
    var setOperatorParametersExtended4$2 = 0x74;
    var getOperatorParametersExtended4$2 = 0x75;
    var getDemand$2 = 0x76;
    var getMeterInfo$1 = 0x7a;

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
        getHalfHourEnergies: getHalfHourEnergies$1,
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
        getOperatorParametersExtended4: getOperatorParametersExtended4$2,
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

    var commandNames$2 = invertObject(downlinkIds);

    var id$1v = getCriticalEvent$2;
    var name$1v = commandNames$2[getCriticalEvent$2];
    var headerSize$1v = 2;
    var accessLevel$1v = READ_ONLY;
    var maxSize$1v = 2;
    var isLoraOnly$1v = false;
    var examples$1u = {
      'simple request': {
        id: id$1v,
        name: name$1v,
        headerSize: headerSize$1v,
        accessLevel: accessLevel$1v,
        maxSize: maxSize$1v,
        parameters: {
          event: 1,
          name: 'MAGNETIC_ON',
          index: 2
        },
        bytes: [0x56, 0x02, 0x01, 0x02]
      },
      'the last event': {
        id: id$1v,
        name: name$1v,
        headerSize: headerSize$1v,
        accessLevel: accessLevel$1v,
        maxSize: maxSize$1v,
        parameters: {
          event: 4,
          name: 'RESTART',
          index: 255
        },
        bytes: [0x56, 0x02, 0x04, 0xff]
      }
    };
    var fromBytes$1u = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1v) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var _bytes = _slicedToArray(bytes, 2),
        event = _bytes[0],
        index = _bytes[1];
      return {
        event: event,
        name: criticalEventNames[event],
        index: index
      };
    };
    var toBytes$1v = function toBytes(parameters) {
      return toBytes$2h(id$1v, [parameters.event, parameters.index]);
    };

    var getCriticalEvent$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1v,
        examples: examples$1u,
        fromBytes: fromBytes$1u,
        headerSize: headerSize$1v,
        id: id$1v,
        isLoraOnly: isLoraOnly$1v,
        maxSize: maxSize$1v,
        name: name$1v,
        toBytes: toBytes$1v
    });

    var OK = 0;
    var UNKNOWN_COMMAND = 0x80;
    var NOT_ALIGNED_DATA = 0x81;
    var DECRYPTION_FAILURE = 0x82;
    var UNKNOWN_PROTOCOL = 0x83;
    var BAD_MESSAGE = 0x84;
    var BAD_DATA_LENGTH = 0x85;
    var BAD_ARRAY_INDEX = 0x86;
    var NOT_PREPARED_RATE_PLAN = 0x87;
    var BAD_RATE_PLAN_ID = 0x88;
    var BAD_RATE_PLAN_SIZE = 0x89;
    var BAD_RESPONSE_LENGTH = 0x90;
    var NO_DATA_FOR_DATE = 0x91;
    var CALIBRATION_DISABLED = 0x92;
    var ACCESS_DENIED = 0x93;
    var BAD_SALDO_WRITE = 0x95;
    var BLOCKED_METER = 0x97;
    var UNENCRYPTED_COMMAND_DISABLED = 0x98;
    var TIME_CORRECTION_FAILURE = 0x99;
    var INVALID_CORRECTION_INTERVAL = 0x9a;
    var TIME_CORRECTION_OUT_HALF_HOUR_DISABLED = 0x9b;
    var BAD_BLOCK_NUMBER = 0x9c;
    var OUT_OFF_RANGE = 0x9f;
    var SET_METER_TYPE_FAILURE = 0xa0;
    var INTERNAL = 0xf0;

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

    var SET_ALL_SEGMENT_DISPLAY$1 = 1;
    var SOFTWARE_VERSION$1 = 2;
    var TOTAL_ACTIVE_ENERGY$1 = 3;
    var ACTIVE_ENERGY_T1$1 = 4;
    var ACTIVE_ENERGY_T2$1 = 5;
    var ACTIVE_ENERGY_T3$1 = 6;
    var ACTIVE_ENERGY_T4$1 = 7;
    var ACTIVE_POWER_PER_PHASE = 8;
    var ACTIVE_POWER_IN_NEUTRAL = 9;
    var CURRENT_IN_PHASE = 10;
    var CURRENT_IN_NEUTRAL$1 = 11;
    var VOLTAGE = 12;
    var HOUR_MINUTE_SECOND$1 = 13;
    var DATE_MONTH_YEAR$1 = 14;
    var TOTAL_EXPORTED_ACTIVE_ENERGY$1 = 15;
    var EXPORTED_ACTIVE_ENERGY_T1$1 = 16;
    var EXPORTED_ACTIVE_ENERGY_T2$1 = 17;
    var EXPORTED_ACTIVE_ENERGY_T3$1 = 18;
    var EXPORTED_ACTIVE_ENERGY_T4$1 = 19;
    var POWER_FACTOR_PHASE_A$1 = 20;
    var POWER_FACTOR_PHASE_B$1 = 21;
    var BATTERY_VOLTAGE$1 = 22;
    var POWER_THRESHOLD_T1$1 = 23;
    var POWER_THRESHOLD_T2$1 = 24;
    var POWER_THRESHOLD_T3$1 = 25;
    var POWER_THRESHOLD_T4$1 = 26;
    var MAGNET_INDUCTION$1 = 28;
    var CURRENT_BALANCE$1 = 30;
    var OPTOPORT_SPEED$1 = 31;

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
        POWER_FACTOR_PHASE_A: POWER_FACTOR_PHASE_A$1,
        POWER_FACTOR_PHASE_B: POWER_FACTOR_PHASE_B$1,
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

    var getDayEnergies$2 = 0x78;
    var getDayMaxPower = 0x79;
    var errorResponse$2 = 0xfe;

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
        getDayEnergies: getDayEnergies$2,
        getDayMaxDemand: getDayMaxDemand$3,
        getDayMaxDemandExport: getDayMaxDemandExport$3,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious,
        getDayMaxPower: getDayMaxPower,
        getDayProfile: getDayProfile$3,
        getDemand: getDemand$3,
        getDemandParameters: getDemandParameters,
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
        getHalfHourEnergies: getHalfHourEnergies$3,
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
        setDemandParameters: setDemandParameters,
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

    var commandNames$1 = invertObject(uplinkIds$1);

    var ENERGY_T1_FAULT = 0x01;
    var ENERGY_T2_FAULT = 0x02;
    var ENERGY_T3_FAULT = 0x03;
    var ENERGY_T4_FAULT = 0x04;
    var ACCESS_LOCKED = 0x11;
    var ACCESS_UNLOCKED = 0x12;
    var ERR_ACCESS = 0x13;
    var CASE_OPEN = 0x14;
    var CASE_CLOSE = 0x15;
    var MAGNETIC_ON = 0x16;
    var MAGNETIC_OFF = 0x17;
    var CHANGE_ACCESS_KEY0 = 0x20;
    var CHANGE_ACCESS_KEY1 = 0x21;
    var CHANGE_ACCESS_KEY2 = 0x22;
    var CHANGE_ACCESS_KEY3 = 0x23;
    var CHANGE_PARAMETERS_LOCAL = 0x24;
    var CHANGE_PARAMETERS_REMOTE = 0x25;
    var CMD_CHANGE_TIME = 0x26;
    var CMD_RELAY_ON = 0x27;
    var CMD_RELAY_OFF = 0x28;
    var ENERGY_REGISTER_OVERFLOW = 0x31;
    var CHANGE_TARIFF_TABLE = 0x32;
    var SET_TARIFF_TABLE = 0x33;
    var SUMMER_TIME = 0x34;
    var WINTER_TIME = 0x35;
    var RELAY_ON = 0x36;
    var RELAY_OFF = 0x37;
    var RESTART = 0x38;
    var WD_RESTART = 0x39;
    var VA_MAX_OK = 0x40;
    var VA_MAX_OVER = 0x41;
    var VA_MIN_OK = 0x42;
    var VA_MIN_UNDER = 0x43;
    var VB_MAX_OK = 0x44;
    var VB_MAX_OVER = 0x45;
    var VB_MIN_OK = 0x46;
    var VB_MIN_UNDER = 0x47;
    var VC_MAX_OK = 0x48;
    var VC_MAX_OVER = 0x49;
    var VC_MIN_OK = 0x4A;
    var VC_MIN_UNDER = 0x4B;
    var F_MAX_OK = 0x4C;
    var F_MAX_OVER = 0x4D;
    var F_MIN_OK = 0x4E;
    var F_MIN_UNDER = 0x4F;
    var T_MAX_OK = 0x50;
    var T_MAX_OVER = 0x51;
    var T_MIN_OK = 0x52;
    var T_MIN_UNDER = 0x53;
    var IA_MAX_OK = 0x54;
    var IA_MAX_OVER = 0x55;
    var IB_MAX_OK = 0x56;
    var IB_MAX_OVER = 0x57;
    var IC_MAX_OK = 0x58;
    var IC_MAX_OVER = 0x59;
    var PA_MAX_OK = 0x5A;
    var PA_MAX_OVER = 0x5B;
    var PV_MAX_OK = 0x5C;
    var PV_MAX_OVER = 0x5D;
    var IDIFF_OK = 0x5E;
    var IDIFF_OVER = 0x5F;
    var CLOCK_OK = 0x60;
    var CLOCK_FAULT = 0x61;
    var POWER_C_ON = 0x62;
    var POWER_C_OFF = 0x63;
    var POWER_B_ON = 0x64;
    var POWER_B_OFF = 0x65;
    var POWER_A_ON = 0x66;
    var POWER_A_OFF = 0x67;
    var BATTERY_OK = 0x68;
    var BATTERY_FAULT = 0x69;
    var CALIBRATION_OK = 0x6A;
    var CALIBRATION_FAULT = 0x6B;
    var V_PARAMETERS_OK = 0x6C;
    var V_PARAMETERS_FAULT = 0x6D;
    var O_PARAMETERS_OK = 0x6E;
    var O_PARAMETERS_FAULT = 0x6F;
    var CHANGE_COR_TIME = 0x70;
    var CMD_RELAY_2_ON = 0x71;
    var CMD_RELAY_2_OFF = 0x72;
    var CROSS_ZERO_ENT1 = 0x73;
    var CROSS_ZERO_ENT2 = 0x74;
    var CROSS_ZERO_ENT3 = 0x75;
    var CROSS_ZERO_ENT4 = 0x76;
    var CROSS_ZERO_VARI1 = 0x77;
    var CROSS_ZERO_VARI2 = 0x78;
    var CROSS_ZERO_VARI3 = 0x79;
    var CROSS_ZERO_VARI4 = 0x7A;
    var CROSS_ZERO_VARE1 = 0x7B;
    var CROSS_ZERO_VARE2 = 0x7C;
    var CROSS_ZERO_VARE3 = 0x7D;
    var CROSS_ZERO_VARE4 = 0x7E;
    var CALIBRATION_FLAG_SET = 0x7F;
    var CALIBRATION_FLAG_RESET = 0x80;
    var BAD_TEST_EEPROM = 0x81;
    var BAD_TEST_FRAM = 0x82;
    var SET_NEW_SALDO = 0x83;
    var SALDO_PARAM_BAD = 0x84;
    var ACCUMULATION_PARAM_BAD = 0x85;
    var ACCUMULATION_PARAM_EXT_BAD = 0x86;
    var CALCULATION_PERIOD_BAD = 0x87;
    var BLOCK_TARIFF_BAD = 0x88;
    var CALIBRATION_PARAM_BAD = 0x89;
    var WINTER_SUMMER_BAD = 0x8A;
    var OP_PARAM_BAD = 0x8B;
    var OP_PARAM_EXT_BAD = 0x8C;
    var SALDO_ENERGY_BAD = 0x8D;
    var TIME_CORRECT = 0x8E;
    var COEFFICIENT_TRANSFORMATION_CHANGE = 0x8F;
    var RELAY_HARD_BAD_OFF = 0x90;
    var RELAY_HARD_ON = 0x91;
    var RELAY_HARD_BAD_ON = 0x93;
    var RELAY_HARD_OFF = 0x94;
    var METER_TROUBLE = 0x95;
    var CASE_KLEMA_OPEN = 0x96;
    var CASE_KLEMA_CLOSE = 0x97;
    var CHANGE_TARIFF_TABLE_2 = 0x98;
    var CHANGE_TARIFF_TABLE_3 = 0x99;
    var CASE_MODULE_OPEN = 0x9A;
    var CASE_MODULE_CLOSE = 0x9B;
    var SET_SALDO_PARAM = 0x9C;
    var POWER_OVER_RELAY_OFF = 0x9D;
    var CHANGE_PARAM_CHANNEL1 = 0x9E;
    var CHANGE_PARAM_CHANNEL2 = 0x9F;
    var CHANGE_PARAM_CHANNEL3 = 0xA0;
    var CHANGE_PARAM_CHANNEL4 = 0xA1;
    var CHANGE_PARAM_CHANNEL5 = 0xA2;
    var CHANGE_PARAM_CHANNEL6 = 0xA3;
    var CROSS_ZERO_EXPORT_ENT1 = 0xA4;
    var CROSS_ZERO_EXPORT_ENT2 = 0xA5;
    var CROSS_ZERO_EXPORT_ENT3 = 0xA6;
    var CROSS_ZERO_EXPORT_ENT4 = 0xA7;
    var CROSS_ZERO_EXPORT_VARI1 = 0xA8;
    var CROSS_ZERO_EXPORT_VARI2 = 0xA9;
    var CROSS_ZERO_EXPORT_VARI3 = 0xAA;
    var CROSS_ZERO_EXPORT_VARI4 = 0xAB;
    var CROSS_ZERO_EXPORT_VARE1 = 0xAC;
    var CROSS_ZERO_EXPORT_VARE2 = 0xAD;
    var CROSS_ZERO_EXPORT_VARE3 = 0xAE;
    var CROSS_ZERO_EXPORT_VARE4 = 0xAF;
    var EM_MAGNETIC_ON = 0xB0;
    var EM_MAGNETIC_OFF = 0xB1;
    var RESET_EM_FLAG = 0xB2;
    var RESET_MAGNETIC_FLAG = 0xB3;
    var SET_DEMAND_EN_1_MIN = 0xE0;
    var SET_DEMAND_EN_3_MIN = 0xE1;
    var SET_DEMAND_EN_5_MIN = 0xE2;
    var SET_DEMAND_EN_10_MIN = 0xE3;
    var SET_DEMAND_EN_15_MIN = 0xE4;
    var SET_DEMAND_EN_30_MIN = 0xE5;
    var SET_DEMAND_EN_60_MIN = 0xE6;
    var P_MAX_A_MINUS_OK = 0xE7;
    var P_MAX_A_MINUS_OVER = 0xE8;

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
        CROSS_ZERO_ENT1: CROSS_ZERO_ENT1,
        CROSS_ZERO_ENT2: CROSS_ZERO_ENT2,
        CROSS_ZERO_ENT3: CROSS_ZERO_ENT3,
        CROSS_ZERO_ENT4: CROSS_ZERO_ENT4,
        CROSS_ZERO_EXPORT_ENT1: CROSS_ZERO_EXPORT_ENT1,
        CROSS_ZERO_EXPORT_ENT2: CROSS_ZERO_EXPORT_ENT2,
        CROSS_ZERO_EXPORT_ENT3: CROSS_ZERO_EXPORT_ENT3,
        CROSS_ZERO_EXPORT_ENT4: CROSS_ZERO_EXPORT_ENT4,
        CROSS_ZERO_EXPORT_VARE1: CROSS_ZERO_EXPORT_VARE1,
        CROSS_ZERO_EXPORT_VARE2: CROSS_ZERO_EXPORT_VARE2,
        CROSS_ZERO_EXPORT_VARE3: CROSS_ZERO_EXPORT_VARE3,
        CROSS_ZERO_EXPORT_VARE4: CROSS_ZERO_EXPORT_VARE4,
        CROSS_ZERO_EXPORT_VARI1: CROSS_ZERO_EXPORT_VARI1,
        CROSS_ZERO_EXPORT_VARI2: CROSS_ZERO_EXPORT_VARI2,
        CROSS_ZERO_EXPORT_VARI3: CROSS_ZERO_EXPORT_VARI3,
        CROSS_ZERO_EXPORT_VARI4: CROSS_ZERO_EXPORT_VARI4,
        CROSS_ZERO_VARE1: CROSS_ZERO_VARE1,
        CROSS_ZERO_VARE2: CROSS_ZERO_VARE2,
        CROSS_ZERO_VARE3: CROSS_ZERO_VARE3,
        CROSS_ZERO_VARE4: CROSS_ZERO_VARE4,
        CROSS_ZERO_VARI1: CROSS_ZERO_VARI1,
        CROSS_ZERO_VARI2: CROSS_ZERO_VARI2,
        CROSS_ZERO_VARI3: CROSS_ZERO_VARI3,
        CROSS_ZERO_VARI4: CROSS_ZERO_VARI4,
        EM_MAGNETIC_OFF: EM_MAGNETIC_OFF,
        EM_MAGNETIC_ON: EM_MAGNETIC_ON,
        ENERGY_REGISTER_OVERFLOW: ENERGY_REGISTER_OVERFLOW,
        ENERGY_T1_FAULT: ENERGY_T1_FAULT,
        ENERGY_T2_FAULT: ENERGY_T2_FAULT,
        ENERGY_T3_FAULT: ENERGY_T3_FAULT,
        ENERGY_T4_FAULT: ENERGY_T4_FAULT,
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

    var SET_ALL_SEGMENT_DISPLAY = 1;
    var SOFTWARE_VERSION = 2;
    var TOTAL_ACTIVE_ENERGY = 3;
    var ACTIVE_ENERGY_T1 = 4;
    var ACTIVE_ENERGY_T2 = 5;
    var ACTIVE_ENERGY_T3 = 6;
    var ACTIVE_ENERGY_T4 = 7;
    var TOTAL_REACTIVE_ENERGY = 8;
    var REACTIVE_ENERGY_T1 = 9;
    var REACTIVE_ENERGY_T2 = 10;
    var REACTIVE_ENERGY_T3 = 11;
    var REACTIVE_ENERGY_T4 = 12;
    var TOTAL_NEGATIVE_REACTIVE_ENERGY = 13;
    var NEGATIVE_REACTIVE_ENERGY_T1 = 14;
    var NEGATIVE_REACTIVE_ENERGY_T2 = 15;
    var NEGATIVE_REACTIVE_ENERGY_T3 = 16;
    var NEGATIVE_REACTIVE_ENERGY_T4 = 17;
    var TOTAL_EXPORTED_ACTIVE_ENERGY = 18;
    var EXPORTED_ACTIVE_ENERGY_T1 = 19;
    var EXPORTED_ACTIVE_ENERGY_T2 = 20;
    var EXPORTED_ACTIVE_ENERGY_T3 = 21;
    var EXPORTED_ACTIVE_ENERGY_T4 = 22;
    var TOTAL_EXPORTED_REACTIVE_ENERGY = 23;
    var EXPORTED_REACTIVE_ENERGY_T1 = 24;
    var EXPORTED_REACTIVE_ENERGY_T2 = 25;
    var EXPORTED_REACTIVE_ENERGY_T3 = 26;
    var EXPORTED_REACTIVE_ENERGY_T4 = 27;
    var TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY = 28;
    var EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1 = 29;
    var EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2 = 30;
    var EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3 = 31;
    var EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4 = 32;
    var CURRENT_IN_PHASE_A = 33;
    var CURRENT_IN_PHASE_B = 34;
    var CURRENT_IN_PHASE_C = 35;
    var CURRENT_IN_NEUTRAL = 36;
    var VOLTAGE_IN_PHASE_A = 37;
    var VOLTAGE_IN_PHASE_B = 38;
    var VOLTAGE_IN_PHASE_C = 39;
    var BATTERY_VOLTAGE = 40;
    var SUPPLY_FREQUENCY = 41;
    var TOTAL_ACTIVE_POWER = 42;
    var ACTIVE_POWER_PHASE_A = 43;
    var ACTIVE_POWER_PHASE_B = 44;
    var ACTIVE_POWER_PHASE_C = 45;
    var TOTAL_REACTIVE_POWER_QPLUS = 46;
    var REACTIVE_POWER_QPLUS_PHASE_A = 47;
    var REACTIVE_POWER_QPLUS_PHASE_B = 48;
    var REACTIVE_POWER_QPLUS_PHASE_C = 49;
    var TOTAL_REACTIVE_POWER_QMINUS = 50;
    var REACTIVE_POWER_QMINUS_PHASE_A = 51;
    var REACTIVE_POWER_QMINUS_PHASE_B = 52;
    var REACTIVE_POWER_QMINUS_PHASE_C = 53;
    var TOTAL_POWER_FACTOR = 54;
    var POWER_FACTOR_PHASE_A = 55;
    var POWER_FACTOR_PHASE_B = 56;
    var POWER_FACTOR_PHASE_C = 57;
    var TOTAL_APPARENT_POWER_QPLUS = 58;
    var APPARENT_POWER_QPLUS_PHASE_A = 59;
    var APPARENT_POWER_QPLUS_PHASE_B = 60;
    var APPARENT_POWER_QPLUS_PHASE_C = 61;
    var TOTAL_APPARENT_POWER_QMINUS = 62;
    var APPARENT_POWER_QMINUS_PHASE_A = 63;
    var APPARENT_POWER_QMINUS_PHASE_B = 64;
    var APPARENT_POWER_QMINUS_PHASE_C = 65;
    var MAX_ACTIVE_POWER_DAY_T1 = 66;
    var MAX_ACTIVE_POWER_DAY_T2 = 67;
    var MAX_ACTIVE_POWER_DAY_T3 = 68;
    var MAX_ACTIVE_POWER_DAY_T4 = 69;
    var MAX_ACTIVE_POWER_MONTH_T1 = 70;
    var MAX_ACTIVE_POWER_MONTH_T2 = 71;
    var MAX_ACTIVE_POWER_MONTH_T3 = 72;
    var MAX_ACTIVE_POWER_MONTH_T4 = 73;
    var MAX_REACTIVE_POWER_DAY_T1 = 74;
    var MAX_REACTIVE_POWER_DAY_T2 = 75;
    var MAX_REACTIVE_POWER_DAY_T3 = 76;
    var MAX_REACTIVE_POWER_DAY_T4 = 77;
    var MAX_REACTIVE_POWER_MONTH_T1 = 78;
    var MAX_REACTIVE_POWER_MONTH_T2 = 79;
    var MAX_REACTIVE_POWER_MONTH_T3 = 80;
    var MAX_REACTIVE_POWER_MONTH_T4 = 81;
    var MAX_NEGATIVE_REACTIVE_POWER_DAY_T1 = 82;
    var MAX_NEGATIVE_REACTIVE_POWER_DAY_T2 = 83;
    var MAX_NEGATIVE_REACTIVE_POWER_DAY_T3 = 84;
    var MAX_NEGATIVE_REACTIVE_POWER_DAY_T4 = 85;
    var MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1 = 86;
    var MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2 = 87;
    var MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3 = 88;
    var MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4 = 89;
    var MAX_EXPORTED_ACTIVE_POWER_DAY_T1 = 90;
    var MAX_EXPORTED_ACTIVE_POWER_DAY_T2 = 91;
    var MAX_EXPORTED_ACTIVE_POWER_DAY_T3 = 92;
    var MAX_EXPORTED_ACTIVE_POWER_DAY_T4 = 93;
    var MAX_EXPORTED_ACTIVE_POWER_MONTH_T1 = 94;
    var MAX_EXPORTED_ACTIVE_POWER_MONTH_T2 = 95;
    var MAX_EXPORTED_ACTIVE_POWER_MONTH_T3 = 96;
    var MAX_EXPORTED_ACTIVE_POWER_MONTH_T4 = 97;
    var MAX_EXPORTED_REACTIVE_POWER_DAY_T1 = 98;
    var MAX_EXPORTED_REACTIVE_POWER_DAY_T2 = 99;
    var MAX_EXPORTED_REACTIVE_POWER_DAY_T3 = 100;
    var MAX_EXPORTED_REACTIVE_POWER_DAY_T4 = 101;
    var MAX_EXPORTED_REACTIVE_POWER_MONTH_T1 = 102;
    var MAX_EXPORTED_REACTIVE_POWER_MONTH_T2 = 103;
    var MAX_EXPORTED_REACTIVE_POWER_MONTH_T3 = 104;
    var MAX_EXPORTED_REACTIVE_POWER_MONTH_T4 = 105;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1 = 106;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2 = 107;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3 = 108;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4 = 109;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1 = 110;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2 = 111;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3 = 112;
    var MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4 = 113;
    var HOUR_MINUTE_SECOND = 114;
    var DATE_MONTH_YEAR = 115;
    var CURRENT_TRANSFORMATION_RATIO = 116;
    var VOLTAGE_TRANSFORMATION_RATIO = 117;
    var CURRENT_BALANCE = 118;
    var POWER_THRESHOLD_T1 = 119;
    var POWER_THRESHOLD_T2 = 120;
    var POWER_THRESHOLD_T3 = 121;
    var POWER_THRESHOLD_T4 = 122;
    var OPTOPORT_SPEED = 123;
    var MAGNET_INDUCTION = 124;

    var screenIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIVE_ENERGY_T1: ACTIVE_ENERGY_T1,
        ACTIVE_ENERGY_T2: ACTIVE_ENERGY_T2,
        ACTIVE_ENERGY_T3: ACTIVE_ENERGY_T3,
        ACTIVE_ENERGY_T4: ACTIVE_ENERGY_T4,
        ACTIVE_POWER_PHASE_A: ACTIVE_POWER_PHASE_A,
        ACTIVE_POWER_PHASE_B: ACTIVE_POWER_PHASE_B,
        ACTIVE_POWER_PHASE_C: ACTIVE_POWER_PHASE_C,
        APPARENT_POWER_QMINUS_PHASE_A: APPARENT_POWER_QMINUS_PHASE_A,
        APPARENT_POWER_QMINUS_PHASE_B: APPARENT_POWER_QMINUS_PHASE_B,
        APPARENT_POWER_QMINUS_PHASE_C: APPARENT_POWER_QMINUS_PHASE_C,
        APPARENT_POWER_QPLUS_PHASE_A: APPARENT_POWER_QPLUS_PHASE_A,
        APPARENT_POWER_QPLUS_PHASE_B: APPARENT_POWER_QPLUS_PHASE_B,
        APPARENT_POWER_QPLUS_PHASE_C: APPARENT_POWER_QPLUS_PHASE_C,
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
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3,
        MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T1: MAX_EXPORTED_REACTIVE_POWER_DAY_T1,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T2: MAX_EXPORTED_REACTIVE_POWER_DAY_T2,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T3: MAX_EXPORTED_REACTIVE_POWER_DAY_T3,
        MAX_EXPORTED_REACTIVE_POWER_DAY_T4: MAX_EXPORTED_REACTIVE_POWER_DAY_T4,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: MAX_EXPORTED_REACTIVE_POWER_MONTH_T1,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: MAX_EXPORTED_REACTIVE_POWER_MONTH_T2,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: MAX_EXPORTED_REACTIVE_POWER_MONTH_T3,
        MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: MAX_EXPORTED_REACTIVE_POWER_MONTH_T4,
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
        POWER_FACTOR_PHASE_A: POWER_FACTOR_PHASE_A,
        POWER_FACTOR_PHASE_B: POWER_FACTOR_PHASE_B,
        POWER_FACTOR_PHASE_C: POWER_FACTOR_PHASE_C,
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
        REACTIVE_POWER_QPLUS_PHASE_A: REACTIVE_POWER_QPLUS_PHASE_A,
        REACTIVE_POWER_QPLUS_PHASE_B: REACTIVE_POWER_QPLUS_PHASE_B,
        REACTIVE_POWER_QPLUS_PHASE_C: REACTIVE_POWER_QPLUS_PHASE_C,
        SET_ALL_SEGMENT_DISPLAY: SET_ALL_SEGMENT_DISPLAY,
        SOFTWARE_VERSION: SOFTWARE_VERSION,
        SUPPLY_FREQUENCY: SUPPLY_FREQUENCY,
        TOTAL_ACTIVE_ENERGY: TOTAL_ACTIVE_ENERGY,
        TOTAL_ACTIVE_POWER: TOTAL_ACTIVE_POWER,
        TOTAL_APPARENT_POWER_QMINUS: TOTAL_APPARENT_POWER_QMINUS,
        TOTAL_APPARENT_POWER_QPLUS: TOTAL_APPARENT_POWER_QPLUS,
        TOTAL_EXPORTED_ACTIVE_ENERGY: TOTAL_EXPORTED_ACTIVE_ENERGY,
        TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY,
        TOTAL_EXPORTED_REACTIVE_ENERGY: TOTAL_EXPORTED_REACTIVE_ENERGY,
        TOTAL_NEGATIVE_REACTIVE_ENERGY: TOTAL_NEGATIVE_REACTIVE_ENERGY,
        TOTAL_POWER_FACTOR: TOTAL_POWER_FACTOR,
        TOTAL_REACTIVE_ENERGY: TOTAL_REACTIVE_ENERGY,
        TOTAL_REACTIVE_POWER_QMINUS: TOTAL_REACTIVE_POWER_QMINUS,
        TOTAL_REACTIVE_POWER_QPLUS: TOTAL_REACTIVE_POWER_QPLUS,
        VOLTAGE_IN_PHASE_A: VOLTAGE_IN_PHASE_A,
        VOLTAGE_IN_PHASE_B: VOLTAGE_IN_PHASE_B,
        VOLTAGE_IN_PHASE_C: VOLTAGE_IN_PHASE_C,
        VOLTAGE_TRANSFORMATION_RATIO: VOLTAGE_TRANSFORMATION_RATIO
    });

    invertObject(screenIds);

    var getDayEnergies$1 = 0x78;
    var errorResponse$1 = 0xfe;

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
        getDayEnergies: getDayEnergies$1,
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
        getHalfHourEnergies: getHalfHourEnergies$1,
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
        getOperatorParametersExtended4: getOperatorParametersExtended4$2,
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

    var RATE_2400 = 2400;
    var RATE_9600 = 9600;
    var valueToRate = {
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
    var rateToValue = {
      plc: invertObject(valueToRate.plc),
      optoport: invertObject(valueToRate.optoport)
    };

    var MAIN_1 = 0;
    var MAIN_2 = 1;

    var A_PLUS_R_PLUS_R_MINUS = 1;
    var A_MINUS_R_PLUS_R_MINUS = 2;

    var OPERATOR_PARAMETERS_SIZE = 95;
    var OPERATOR_PARAMETERS_EXTENDED_SIZE = 9;
    var OPERATOR_PARAMETERS_EXTENDED2_SIZE = 28;
    var OPERATOR_PARAMETERS_EXTENDED4_SIZE = 28;
    var PACKED_ENERGY_TYPE_SIZE = 1;
    var ENERGY_TYPE_BITS = 4;
    var displaySet1Mask = {
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
    var displaySet2Mask = {
      CURRENT_IN_PHASE_A: 1 << 0,
      CURRENT_IN_PHASE_B: 1 << 1,
      CURRENT_IN_PHASE_C: 1 << 2,
      CURRENT_IN_NEUTRAL: 1 << 3,
      VOLTAGE_IN_PHASE_A: 1 << 4,
      VOLTAGE_IN_PHASE_B: 1 << 5,
      VOLTAGE_IN_PHASE_C: 1 << 6,
      BATTERY_VOLTAGE: 1 << 7,
      SUPPLY_FREQUENCY: 1 << 8,
      TOTAL_ACTIVE_POWER: 1 << 9,
      ACTIVE_POWER_PHASE_A: 1 << 10,
      ACTIVE_POWER_PHASE_B: 1 << 11,
      ACTIVE_POWER_PHASE_C: 1 << 12,
      TOTAL_REACTIVE_POWER_QPLUS: 1 << 13,
      REACTIVE_POWER_QPLUS_PHASE_A: 1 << 14,
      REACTIVE_POWER_QPLUS_PHASE_B: 1 << 15,
      REACTIVE_POWER_QPLUS_PHASE_C: 1 << 16,
      TOTAL_REACTIVE_POWER_QMINUS: 1 << 17,
      REACTIVE_POWER_QMINUS_PHASE_A: 1 << 18,
      REACTIVE_POWER_QMINUS_PHASE_B: 1 << 19,
      REACTIVE_POWER_QMINUS_PHASE_C: 1 << 20,
      TOTAL_POWER_FACTOR: 1 << 21,
      POWER_FACTOR_PHASE_A: 1 << 22,
      POWER_FACTOR_PHASE_B: 1 << 23,
      POWER_FACTOR_PHASE_C: 1 << 24,
      TOTAL_APPARENT_POWER_QPLUS: 1 << 25,
      APPARENT_POWER_QPLUS_PHASE_A: 1 << 26,
      APPARENT_POWER_QPLUS_PHASE_B: 1 << 27,
      APPARENT_POWER_QPLUS_PHASE_C: 1 << 28,
      TOTAL_APPARENT_POWER_QMINUS: 1 << 29,
      APPARENT_POWER_QMINUS_PHASE_A: 1 << 30,
      APPARENT_POWER_QMINUS_PHASE_B: 1 << 31
    };
    var displaySet3Mask = {
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
    var displaySet4BaseMask = {
      MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: 1 << 0,
      MAX_EXPORTED_REACTIVE_POWER_DAY_T1: 1 << 1,
      MAX_EXPORTED_REACTIVE_POWER_DAY_T2: 1 << 2,
      MAX_EXPORTED_REACTIVE_POWER_DAY_T3: 1 << 3,
      MAX_EXPORTED_REACTIVE_POWER_DAY_T4: 1 << 4,
      MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: 1 << 5,
      MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: 1 << 6,
      MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: 1 << 7,
      MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: 1 << 8,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: 1 << 9,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: 1 << 10,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: 1 << 11,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: 1 << 12,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: 1 << 13,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: 1 << 14,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: 1 << 15,
      MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: 1 << 16,
      HOUR_MINUTE_SECOND: 1 << 17,
      DATE_MONTH_YEAR: 1 << 18,
      CURRENT_TRANSFORMATION_RATIO: 1 << 19,
      VOLTAGE_TRANSFORMATION_RATIO: 1 << 20,
      CURRENT_BALANCE: 1 << 21,
      POWER_THRESHOLD_T1: 1 << 22,
      POWER_THRESHOLD_T2: 1 << 23,
      POWER_THRESHOLD_T3: 1 << 24,
      POWER_THRESHOLD_T4: 1 << 25
    };
    var displaySet4Mask = _objectSpread2(_objectSpread2({}, displaySet4BaseMask), {}, {
      SORT_DISPLAY_SCREENS: 1 << 29,
      AUTO_SCREEN_SCROLLING: 1 << 31
    });
    var displaySet5Mask = {
      EVENT: 1 << 0,
      PROFILE_P01: 1 << 1,
      PROFILE_P02: 1 << 2,
      PROFILE_P03: 1 << 3,
      PROFILE_P04: 1 << 4,
      PROFILE_P05: 1 << 5,
      PROFILE_P06: 1 << 6
    };
    var relaySetMask = {
      RELAY_ON_Y: 1 << 0,
      RELAY_ON_CENTER: 1 << 1,
      RELAY_ON_PB: 1 << 2,
      RELAY_ON_TARIFF_1: 1 << 3,
      RELAY_ON_TARIFF_2: 1 << 4,
      RELAY_ON_TARIFF_3: 1 << 5,
      RELAY_ON_TARIFF_4: 1 << 6,
      RELAY_ON_V_GOOD: 1 << 7,
      RELAY_OFF_Y: 1 << 8,
      RELAY_OFF_CENTER: 1 << 9,
      RELAY_OFF_TARIFF_1: 1 << 10,
      RELAY_OFF_TARIFF_2: 1 << 11,
      RELAY_OFF_TARIFF_3: 1 << 12,
      RELAY_OFF_TARIFF_4: 1 << 13,
      RELAY_OFF_I_LIMIT: 1 << 14,
      RELAY_OFF_V_BAD: 1 << 15,
      RELAY_OFF_DIFF_CURRENT_BAD: 1 << 16,
      RELAY_OFF_LIM_TARIFF_1: 1 << 17,
      RELAY_OFF_LIM_TARIFF_2: 1 << 18,
      RELAY_OFF_LIM_TARIFF_3: 1 << 19,
      RELAY_OFF_LIM_TARIFF_4: 1 << 20,
      RELAY_OFF_LIM_VAR_TARIFF_1: 1 << 21,
      RELAY_OFF_LIM_VAR_TARIFF_2: 1 << 22,
      RELAY_OFF_LIM_VAR_TARIFF_3: 1 << 23,
      RELAY_OFF_LIM_VAR_TARIFF_4: 1 << 24,
      RELAY_ON_PF_MIN: 1 << 25,
      RELAY_OFF_PF_MIN: 1 << 26,
      RELAY_ON_TIMEOUT: 1 << 27,
      RELAY_ON_SALDO: 1 << 28,
      RELAY_OFF_SALDO: 1 << 29,
      RELAY_OFF_SALDO_SOFT: 1 << 30
    };
    var typeMeterMask = {
      TRANSFORMATION_RATIO: 1 << 0,
      METER_TYPE_R: 1 << 4,
      ACCUMULATE_BY_R_PLUS_MINUS: 1 << 7
    };
    var define1Mask = {
      RESET_DAY_MAX_POWER_KEY: 1 << 0,
      RESET_MONTH_MAX_POWER_KEY: 1 << 1,
      BLOCK_KEY_OPTOPORT: 1 << 2,
      MAGNET_SCREEN_CONST: 1 << 5,
      ALLOW_BROWNOUT_INDICATION: 1 << 7
    };
    var displaySet24Mask = _objectSpread2(_objectSpread2({}, displaySet4BaseMask), {}, {
      OPTOPORT_SPEED: 1 << 26,
      MAGNET_INDUCTION: 1 << 27
    });
    var relaySetExtMask = {
      RELAY_OFF_MAGNET: 1 << 0,
      RELAY_ON_MAGNET_TIMEOUT: 1 << 1,
      RELAY_ON_MAGNET_AUTO: 1 << 2
    };
    var getSpeedOptoPort = function getSpeedOptoPort(value) {
      return {
        plc: valueToRate.plc[extractBits(value, 4, 1)],
        optoport: valueToRate.optoport[extractBits(value, 4, 5)]
      };
    };
    var setSpeedOptoPort = function setSpeedOptoPort(speedOptoPort) {
      var result = 0;
      result = fillBits(result, 4, 1, Number(rateToValue.plc[speedOptoPort.plc]));
      result = fillBits(result, 4, 5, Number(rateToValue.optoport[speedOptoPort.optoport]));
      return result;
    };
    function getPackedEnergies(buffer, energyType, tariffMapByte) {
      var _byte = tariffMapByte >> ENERGY_TYPE_BITS;
      var wh = [];
      var vari = [];
      var vare = [];
      for (var index = 0; index < TARIFF_NUMBER$1; index++) {
        var isTariffExists = !!extractBits(_byte, 1, index + 1);
        if (isTariffExists) {
          wh.push(buffer.getInt32());
          vari.push(buffer.getInt32());
          vare.push(buffer.getInt32());
        } else {
          wh.push(null);
          vari.push(null);
          vare.push(null);
        }
      }
      return {
        wh: wh,
        vari: vari,
        vare: vare
      };
    }
    function getPackedEnergyType(energyType, energies) {
      var wh = energies.wh,
        vari = energies.vari,
        vare = energies.vare;
      var indexShift = 1 + ENERGY_TYPE_BITS;
      var tariffsByte = energyType;
      for (var index = 0; index < TARIFF_NUMBER$1; index++) {
        tariffsByte = fillBits(tariffsByte, 1, index + indexShift, Number(!!wh[index] && !!vari[index] && !!vare[index]));
      }
      return tariffsByte;
    }
    function CommandBinaryBuffer(dataOrLength) {
      var isLittleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      CommandBinaryBuffer$2.call(this, dataOrLength, isLittleEndian);
    }
    CommandBinaryBuffer.prototype = Object.create(CommandBinaryBuffer$2.prototype);
    CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;
    CommandBinaryBuffer.getDefaultOperatorParameters = function () {
      return {
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
      };
    };
    CommandBinaryBuffer.getDefaultOperatorParametersExtended = function () {
      return {
        timeoutRelayOn: 1,
        define1: toObject(define1Mask, 0),
        timeoutRelayKey: 0,
        timeoutRelayAuto: 5
      };
    };
    CommandBinaryBuffer.getDefaultOperatorParametersExtended2 = function () {
      return {
        deltaCorMin: 0,
        timeoutMagnetOff: 5,
        relaySetExt: toObject(relaySetExtMask, 0),
        timeoutMagnetOn: 5,
        defaultPlcPhase: 3,
        displaySet21: toObject(displaySet1Mask, 4231),
        displaySet22: toObject(displaySet2Mask, 31597303),
        displaySet23: toObject(displaySet3Mask, 0),
        displaySet24: toObject(displaySet24Mask, 393216),
        channel1: 0,
        channel2: 0,
        channel3: 0,
        channel4: 0,
        channel5: 0,
        channel6: 0,
        timeCorrectPeriod: 24,
        timeCorrectPassHalfhour: false
      };
    };
    CommandBinaryBuffer.getDefaultOperatorParametersExtended3 = CommandBinaryBuffer$2.getDefaultOperatorParametersExtended3;
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
      var wh = [];
      var vari = [];
      var vare = [];
      for (var index = 0; index < TARIFF_NUMBER$1; index++) {
        wh.push(this.getInt32());
        vari.push(this.getInt32());
        vare.push(this.getInt32());
      }
      return {
        wh: wh,
        vari: vari,
        vare: vare
      };
    };
    CommandBinaryBuffer.prototype.setEnergies = function (parameters) {
      for (var index = 0; index < TARIFF_NUMBER$1; index++) {
        this.setInt32(parameters.wh[index]);
        this.setInt32(parameters.vari[index]);
        this.setInt32(parameters.vare[index]);
      }
    };
    CommandBinaryBuffer.prototype.getPackedEnergyWithType = function () {
      var _byte2 = this.getUint8();
      var energyType = extractBits(_byte2, ENERGY_TYPE_BITS, 1);
      var energies = getPackedEnergies(this, energyType, _byte2);
      return {
        energyType: energyType,
        energies: energies
      };
    };
    CommandBinaryBuffer.prototype.setPackedEnergyWithType = function (_ref) {
      var energyType = _ref.energyType,
        energies = _ref.energies;
      if (energyType) {
        var energyTypeByte = getPackedEnergyType(energyType, energies);
        var tariffsByte = energyTypeByte >> ENERGY_TYPE_BITS;
        this.setUint8(energyTypeByte);
        for (var index = 0; index < TARIFF_NUMBER$1; index++) {
          var isTariffExists = !!extractBits(tariffsByte, 1, index + 1);
          if (isTariffExists) {
            this.setInt32(energies.wh[index]);
            this.setInt32(energies.vari[index]);
            this.setInt32(energies.vare[index]);
          }
        }
        return;
      }
      for (var _index = 0; _index < TARIFF_NUMBER$1; _index++) {
        this.setInt32(energies.wh[_index]);
        this.setInt32(energies.vari[_index]);
        this.setInt32(energies.vare[_index]);
      }
    };
    CommandBinaryBuffer.prototype.getEnergyPeriods = function (energiesNumber) {
      var _this = this;
      return new Array(energiesNumber).fill(0).map(function () {
        var energy = _this.getUint16();
        return energy === 0xffff ? undefined : energy;
      });
    };
    CommandBinaryBuffer.prototype.setEnergyPeriods = function (energies) {
      var _this2 = this;
      energies.forEach(function (energy) {
        return _this2.setUint16(energy === undefined ? 0xffff : energy);
      });
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
      var _this3 = this;
      var date = this.getDate();
      var maxDemands = new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return _this3.getMaxDemand();
      });
      return {
        date: date,
        maxDemands: maxDemands
      };
    };
    CommandBinaryBuffer.prototype.setDayMaxDemandResponse = function (parameters) {
      var _this4 = this;
      this.setDate(parameters.date);
      parameters.maxDemands.forEach(function (value) {
        return _this4.setMaxDemand(value);
      });
    };
    CommandBinaryBuffer.prototype.getMonthMaxDemandResponse = function () {
      var _this5 = this;
      var date = {
        year: this.getUint8(),
        month: this.getUint8()
      };
      var maxDemands = new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return _this5.getMaxDemand();
      });
      return {
        date: date,
        maxDemands: maxDemands
      };
    };
    CommandBinaryBuffer.prototype.setMonthMaxDemandResponse = function (parameters) {
      var _this6 = this;
      this.setUint8(parameters.date.year);
      this.setUint8(parameters.date.month);
      parameters.maxDemands.forEach(function (value) {
        return _this6.setMaxDemand(value);
      });
    };
    CommandBinaryBuffer.prototype.getEvent = function () {
      var data = {
        hours: this.getUint8(),
        minutes: this.getUint8(),
        seconds: this.getUint8(),
        event: this.getUint8()
      };
      var event = data.event;
      var bytesLeft = this.bytesLeft;
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
          var _iterator = _createForOfIteratorHelper(event.power),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              this.setUint8(item);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          break;
        case CMD_CHANGE_TIME:
        case TIME_CORRECT:
          this.setDateTime(event.newDate);
          break;
      }
    };
    CommandBinaryBuffer.prototype.getDemand = function () {
      var date0 = this.getUint8();
      var date1 = this.getUint8();
      return {
        date: {
          year: date0 >> 1,
          month: date0 << 3 & 0x0f | date1 >> 5,
          date: date1 & 0x1f
        },
        demandParam: this.getUint8(),
        firstIndex: this.getUint16(),
        count: this.getUint8(),
        period: this.getUint8()
      };
    };
    CommandBinaryBuffer.prototype.setDemand = function (parameters) {
      var date0 = parameters.date.year << 1 | parameters.date.month >> 3 & 0x01;
      var date1 = parameters.date.month << 5 & 0xe0 | parameters.date.date & 0x1f;
      this.setUint8(date0);
      this.setUint8(date1);
      this.setUint8(parameters.demandParam);
      this.setUint16(parameters.firstIndex);
      this.setUint8(parameters.count);
      this.setUint8(parameters.period);
    };
    CommandBinaryBuffer.prototype.getOperatorParametersExtended2 = function () {
      var operatorParametersExtended2 = {
        deltaCorMin: this.getUint8(),
        timeoutMagnetOff: this.getUint8(),
        relaySetExt: toObject(relaySetExtMask, this.getUint8()),
        timeoutMagnetOn: this.getUint8(),
        defaultPlcPhase: this.getUint8(),
        displaySet21: toObject(displaySet1Mask, this.getUint32()),
        displaySet22: toObject(displaySet2Mask, this.getUint32()),
        displaySet23: toObject(displaySet3Mask, this.getUint32()),
        displaySet24: toObject(displaySet24Mask, this.getUint32()),
        channel1: this.getUint8(),
        channel2: this.getUint8(),
        channel3: this.getUint8(),
        channel4: this.getUint8(),
        channel5: this.getUint8(),
        channel6: this.getUint8(),
        timeCorrectPeriod: 0,
        timeCorrectPassHalfhour: false
      };
      var timeCorrectPeriod = this.getUint8();
      operatorParametersExtended2.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
      operatorParametersExtended2.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);
      return operatorParametersExtended2;
    };
    CommandBinaryBuffer.prototype.setOperatorParametersExtended2 = function (operatorParametersExtended2) {
      var timeCorrectPeriod = operatorParametersExtended2.timeCorrectPeriod | (operatorParametersExtended2.timeCorrectPassHalfhour ? 0x80 : 0);
      this.setUint8(operatorParametersExtended2.deltaCorMin);
      this.setUint8(operatorParametersExtended2.timeoutMagnetOff);
      this.setUint8(fromObject(relaySetExtMask, operatorParametersExtended2.relaySetExt));
      this.setUint8(operatorParametersExtended2.timeoutMagnetOn);
      this.setUint8(operatorParametersExtended2.defaultPlcPhase);
      this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended2.displaySet21));
      this.setUint32(fromObject(displaySet2Mask, operatorParametersExtended2.displaySet22));
      this.setUint32(fromObject(displaySet3Mask, operatorParametersExtended2.displaySet23));
      this.setUint32(fromObject(displaySet24Mask, operatorParametersExtended2.displaySet24));
      this.setUint8(operatorParametersExtended2.channel1);
      this.setUint8(operatorParametersExtended2.channel2);
      this.setUint8(operatorParametersExtended2.channel3);
      this.setUint8(operatorParametersExtended2.channel4);
      this.setUint8(operatorParametersExtended2.channel5);
      this.setUint8(operatorParametersExtended2.channel6);
      this.setUint8(timeCorrectPeriod);
    };
    CommandBinaryBuffer.prototype.getOperatorParametersExtended4 = function () {
      return {
        displaySet5: toObject(displaySet5Mask, this.getUint32()),
        displaySet25: toObject(displaySet5Mask, this.getUint32()),
        displaySet31: toObject(displaySet1Mask, this.getUint32()),
        displaySet32: toObject(displaySet2Mask, this.getUint32()),
        displaySet33: toObject(displaySet3Mask, this.getUint32()),
        displaySet34: toObject(displaySet4Mask, this.getUint32()),
        displaySet35: toObject(displaySet5Mask, this.getUint32())
      };
    };
    CommandBinaryBuffer.prototype.setOperatorParametersExtended4 = function (operatorParametersExtended) {
      this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet5));
      this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet25));
      this.setUint32(fromObject(displaySet1Mask, operatorParametersExtended.displaySet31));
      this.setUint32(fromObject(displaySet2Mask, operatorParametersExtended.displaySet32));
      this.setUint32(fromObject(displaySet3Mask, operatorParametersExtended.displaySet33));
      this.setUint32(fromObject(displaySet4Mask, operatorParametersExtended.displaySet34));
      this.setUint32(fromObject(displaySet5Mask, operatorParametersExtended.displaySet35));
    };
    var getPackedEnergiesWithDateSize = function getPackedEnergiesWithDateSize(parameters) {
      var _parameters$energies = parameters.energies,
        wh = _parameters$energies.wh,
        vari = _parameters$energies.vari,
        vare = _parameters$energies.vare;
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = [].concat(_toConsumableArray(wh), _toConsumableArray(vari), _toConsumableArray(vare)).filter(function (energy) {
          return energy !== null;
        }).length;
        return DATE_SIZE$2 + PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      return DATE_SIZE$2 + ENERGY_SIZE * TARIFF_NUMBER$1;
    };

    var MIN_COMMAND_SIZE$2 = 3;
    var MAX_COMMAND_SIZE$4 = 4;
    var id$1u = getDayDemand$2;
    var name$1u = commandNames$2[getDayDemand$2];
    var headerSize$1u = 2;
    var maxSize$1u = MAX_COMMAND_SIZE$4;
    var accessLevel$1u = READ_ONLY;
    var isLoraOnly$1u = false;
    var examples$1t = {
      'request day values for 2024.03.22 00:00:00 GMT': {
        id: id$1u,
        name: name$1u,
        headerSize: headerSize$1u,
        maxSize: maxSize$1u,
        accessLevel: accessLevel$1u,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x16, 0x03, 0x18, 0x03, 0x16]
      },
      'request day values with energy type for 2024.03.22 00:00:00 GMT': {
        id: id$1u,
        name: name$1u,
        headerSize: headerSize$1u,
        maxSize: maxSize$1u,
        accessLevel: accessLevel$1u,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: A_PLUS_R_PLUS_R_MINUS
        },
        bytes: [0x16, 0x04, 0x18, 0x03, 0x16, 0x01]
      }
    };
    var fromBytes$1t = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      if (bytes.length === MAX_COMMAND_SIZE$4) {
        return {
          date: buffer.getDate(),
          energyType: buffer.getUint8()
        };
      }
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1u = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(parameters !== null && parameters !== void 0 && parameters.energyType ? MAX_COMMAND_SIZE$4 : MIN_COMMAND_SIZE$2);
      buffer.setDate(parameters === null || parameters === void 0 ? void 0 : parameters.date);
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        buffer.setUint8(parameters.energyType);
      }
      return toBytes$2h(id$1u, buffer.data);
    };

    var getDayDemand$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1u,
        examples: examples$1t,
        fromBytes: fromBytes$1t,
        headerSize: headerSize$1u,
        id: id$1u,
        isLoraOnly: isLoraOnly$1u,
        maxSize: maxSize$1u,
        name: name$1u,
        toBytes: toBytes$1u
    });

    var id$1t = getDayDemandExport$2;
    var name$1t = commandNames$2[getDayDemandExport$2];
    var headerSize$1t = 2;
    var maxSize$1t = 3;
    var accessLevel$1t = READ_ONLY;
    var isLoraOnly$1t = false;
    var examples$1s = {
      'request day values for 2024.03.22 00:00:00 GMT': {
        id: id$1t,
        name: name$1t,
        headerSize: headerSize$1t,
        maxSize: maxSize$1t,
        accessLevel: accessLevel$1t,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x4f, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1s = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1t = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1t);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1t, buffer.data);
    };

    var getDayDemandExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1t,
        examples: examples$1s,
        fromBytes: fromBytes$1s,
        headerSize: headerSize$1t,
        id: id$1t,
        isLoraOnly: isLoraOnly$1t,
        maxSize: maxSize$1t,
        name: name$1t,
        toBytes: toBytes$1t
    });

    var id$1s = getDemand$2;
    var name$1s = commandNames$2[getDemand$2];
    var headerSize$1s = 2;
    var maxSize$1s = 7;
    var accessLevel$1s = READ_ONLY;
    var isLoraOnly$1s = false;
    var examples$1r = {
      'request for A+': {
        id: id$1s,
        name: name$1s,
        headerSize: headerSize$1s,
        maxSize: maxSize$1s,
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
        bytes: [0x76, 0x07, 0x2a, 0xd2, 0x81, 0x00, 0x00, 0x02, 0x1e]
      }
    };
    var fromBytes$1r = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getDemand();
    };
    var toBytes$1s = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1s);
      buffer.setDemand(parameters);
      return toBytes$2h(id$1s, buffer.data);
    };

    var getDemand$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1s,
        examples: examples$1r,
        fromBytes: fromBytes$1r,
        headerSize: headerSize$1s,
        id: id$1s,
        isLoraOnly: isLoraOnly$1s,
        maxSize: maxSize$1s,
        name: name$1s,
        toBytes: toBytes$1s
    });

    var id$1r = getDisplayParam$2;
    var name$1r = commandNames$2[getDisplayParam$2];
    var headerSize$1r = 2;
    var maxSize$1r = 1;
    var accessLevel$1r = READ_ONLY;
    var isLoraOnly$1r = false;
    var examples$1q = {
      'get additional display parameters': {
        id: id$1r,
        name: name$1r,
        headerSize: headerSize$1r,
        maxSize: maxSize$1r,
        accessLevel: accessLevel$1r,
        parameters: {
          displayMode: MAIN_2
        },
        bytes: [0x5e, 0x01, 0x01]
      }
    };
    var fromBytes$1q = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        displayMode = _ref2[0];
      return {
        displayMode: displayMode
      };
    };
    var toBytes$1r = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1r);
      buffer.setUint8(parameters.displayMode);
      return toBytes$2h(id$1r, buffer.data);
    };

    var getDisplayParam$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1r,
        examples: examples$1q,
        fromBytes: fromBytes$1q,
        headerSize: headerSize$1r,
        id: id$1r,
        isLoraOnly: isLoraOnly$1r,
        maxSize: maxSize$1r,
        name: name$1r,
        toBytes: toBytes$1r
    });

    var id$1q = getEnergy$2;
    var name$1q = commandNames$2[getEnergy$2];
    var headerSize$1q = 2;
    var maxSize$1q = 0;
    var accessLevel$1q = READ_ONLY;
    var isLoraOnly$1q = false;
    var examples$1p = {
      'simple request': {
        id: id$1q,
        name: name$1q,
        headerSize: headerSize$1q,
        maxSize: maxSize$1q,
        accessLevel: accessLevel$1q,
        parameters: {},
        bytes: [0x0f, 0x00]
      }
    };
    var fromBytes$1p = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1q) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1q = function toBytes() {
      return toBytes$2h(id$1q);
    };

    var getEnergy$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1q,
        examples: examples$1p,
        fromBytes: fromBytes$1p,
        headerSize: headerSize$1q,
        id: id$1q,
        isLoraOnly: isLoraOnly$1q,
        maxSize: maxSize$1q,
        name: name$1q,
        toBytes: toBytes$1q
    });

    var MIN_COMMAND_SIZE$1 = 0;
    var MAX_COMMAND_SIZE$3 = 1;
    var id$1p = getEnergyDayPrevious$2;
    var name$1p = commandNames$2[getEnergyDayPrevious$2];
    var headerSize$1p = 2;
    var maxSize$1p = MAX_COMMAND_SIZE$3;
    var accessLevel$1p = READ_ONLY;
    var isLoraOnly$1p = false;
    var examples$1o = {
      'simple request': {
        id: id$1p,
        name: name$1p,
        headerSize: headerSize$1p,
        maxSize: maxSize$1p,
        accessLevel: accessLevel$1p,
        parameters: {},
        bytes: [0x03, 0x00]
      },
      'request A-R+R- energy': {
        id: id$1p,
        name: name$1p,
        headerSize: headerSize$1p,
        maxSize: maxSize$1p,
        accessLevel: accessLevel$1p,
        parameters: {
          energyType: A_MINUS_R_PLUS_R_MINUS
        },
        bytes: [0x03, 0x01, 0x02]
      }
    };
    var fromBytes$1o = function fromBytes(bytes) {
      var length = bytes.length;
      if (length !== MAX_COMMAND_SIZE$3 && length !== MIN_COMMAND_SIZE$1) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      if (length === MAX_COMMAND_SIZE$3) {
        return {
          energyType: bytes[0]
        };
      }
      return {};
    };
    var toBytes$1p = function toBytes(parameters) {
      if (parameters.energyType) {
        return toBytes$2h(id$1p, [parameters.energyType]);
      }
      return toBytes$2h(id$1p);
    };

    var getEnergyDayPrevious$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1p,
        examples: examples$1o,
        fromBytes: fromBytes$1o,
        headerSize: headerSize$1p,
        id: id$1p,
        isLoraOnly: isLoraOnly$1p,
        maxSize: maxSize$1p,
        name: name$1p,
        toBytes: toBytes$1p
    });

    var id$1o = getEnergyExport$2;
    var name$1o = commandNames$2[getEnergyExport$2];
    var headerSize$1o = 2;
    var maxSize$1o = 0;
    var accessLevel$1o = READ_ONLY;
    var isLoraOnly$1o = false;
    var examples$1n = {
      'simple request': {
        id: id$1o,
        name: name$1o,
        headerSize: headerSize$1o,
        maxSize: maxSize$1o,
        accessLevel: accessLevel$1o,
        parameters: {},
        bytes: [0x4e, 0x00]
      }
    };
    var fromBytes$1n = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1o) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1o = function toBytes() {
      return toBytes$2h(id$1o);
    };

    var getEnergyExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1o,
        examples: examples$1n,
        fromBytes: fromBytes$1n,
        headerSize: headerSize$1o,
        id: id$1o,
        isLoraOnly: isLoraOnly$1o,
        maxSize: maxSize$1o,
        name: name$1o,
        toBytes: toBytes$1o
    });

    var id$1n = getEnergyExportDayPrevious$2;
    var name$1n = commandNames$2[getEnergyExportDayPrevious$2];
    var headerSize$1n = 2;
    var maxSize$1n = 0;
    var accessLevel$1n = READ_ONLY;
    var isLoraOnly$1n = false;
    var examples$1m = {
      'simple request': {
        id: id$1n,
        name: name$1n,
        headerSize: headerSize$1n,
        maxSize: maxSize$1n,
        accessLevel: accessLevel$1n,
        parameters: {},
        bytes: [0x50, 0x00]
      }
    };
    var fromBytes$1m = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1n) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1n = function toBytes() {
      return toBytes$2h(id$1n);
    };

    var getEnergyExportDayPrevious$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1n,
        examples: examples$1m,
        fromBytes: fromBytes$1m,
        headerSize: headerSize$1n,
        id: id$1n,
        isLoraOnly: isLoraOnly$1n,
        maxSize: maxSize$1n,
        name: name$1n,
        toBytes: toBytes$1n
    });

    var id$1m = getHalfHourDemandChannel$2;
    var name$1m = commandNames$2[getHalfHourDemandChannel$2];
    var headerSize$1m = 2;
    var maxSize$1m = 5;
    var accessLevel$1m = READ_ONLY;
    var isLoraOnly$1m = false;
    var examples$1l = {
      'request A-R- energy for phase A on 2024.03.22': {
        id: id$1m,
        name: name$1m,
        headerSize: headerSize$1m,
        maxSize: maxSize$1m,
        accessLevel: accessLevel$1m,
        parameters: {
          channel: 1,
          loadProfile: 16,
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x5a, 0x05, 0x01, 0x10, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1l = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        channel: buffer.getUint8(),
        loadProfile: buffer.getUint8(),
        date: buffer.getDate()
      };
    };
    var toBytes$1m = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1m);
      buffer.setUint8(parameters.channel);
      buffer.setUint8(parameters.loadProfile);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1m, buffer.data);
    };

    var getHalfHourDemandChannel$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1m,
        examples: examples$1l,
        fromBytes: fromBytes$1l,
        headerSize: headerSize$1m,
        id: id$1m,
        isLoraOnly: isLoraOnly$1m,
        maxSize: maxSize$1m,
        name: name$1m,
        toBytes: toBytes$1m
    });

    var id$1l = getHalfHourDemandVare$2;
    var name$1l = commandNames$2[getHalfHourDemandVare$2];
    var headerSize$1l = 2;
    var maxSize$1l = 3;
    var accessLevel$1l = READ_ONLY;
    var isLoraOnly$1l = false;
    var examples$1k = {
      'request archive values for 2024.03.22': {
        id: id$1l,
        name: name$1l,
        headerSize: headerSize$1l,
        maxSize: maxSize$1l,
        accessLevel: accessLevel$1l,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x49, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1k = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1l = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1l);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1l, buffer.data);
    };

    var getHalfHourDemandVare$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1l,
        examples: examples$1k,
        fromBytes: fromBytes$1k,
        headerSize: headerSize$1l,
        id: id$1l,
        isLoraOnly: isLoraOnly$1l,
        maxSize: maxSize$1l,
        name: name$1l,
        toBytes: toBytes$1l
    });

    var id$1k = getHalfHourDemandVareExport$2;
    var name$1k = commandNames$2[getHalfHourDemandVareExport$2];
    var headerSize$1k = 2;
    var maxSize$1k = 3;
    var accessLevel$1k = READ_ONLY;
    var isLoraOnly$1k = false;
    var examples$1j = {
      'request archive values for 2024.03.22': {
        id: id$1k,
        name: name$1k,
        headerSize: headerSize$1k,
        maxSize: maxSize$1k,
        accessLevel: accessLevel$1k,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x55, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1j = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1k = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1k);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1k, buffer.data);
    };

    var getHalfHourDemandVareExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1k,
        examples: examples$1j,
        fromBytes: fromBytes$1j,
        headerSize: headerSize$1k,
        id: id$1k,
        isLoraOnly: isLoraOnly$1k,
        maxSize: maxSize$1k,
        name: name$1k,
        toBytes: toBytes$1k
    });

    var id$1j = getHalfHourDemandVari$2;
    var name$1j = commandNames$2[getHalfHourDemandVari$2];
    var headerSize$1j = 2;
    var maxSize$1j = 3;
    var accessLevel$1j = READ_ONLY;
    var isLoraOnly$1j = false;
    var examples$1i = {
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
        bytes: [0x48, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1i = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1j = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1j);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1j, buffer.data);
    };

    var getHalfHourDemandVari$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1j,
        examples: examples$1i,
        fromBytes: fromBytes$1i,
        headerSize: headerSize$1j,
        id: id$1j,
        isLoraOnly: isLoraOnly$1j,
        maxSize: maxSize$1j,
        name: name$1j,
        toBytes: toBytes$1j
    });

    var id$1i = getHalfHourDemandVariExport$2;
    var name$1i = commandNames$2[getHalfHourDemandVariExport$2];
    var headerSize$1i = 2;
    var maxSize$1i = 3;
    var accessLevel$1i = READ_ONLY;
    var isLoraOnly$1i = false;
    var examples$1h = {
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
        bytes: [0x54, 0x03, 0x18, 0x03, 0x16]
      }
    };
    var fromBytes$1h = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate()
      };
    };
    var toBytes$1i = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1i);
      buffer.setDate(parameters.date);
      return toBytes$2h(id$1i, buffer.data);
    };

    var getHalfHourDemandVariExport$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1i,
        examples: examples$1h,
        fromBytes: fromBytes$1h,
        headerSize: headerSize$1i,
        id: id$1i,
        isLoraOnly: isLoraOnly$1i,
        maxSize: maxSize$1i,
        name: name$1i,
        toBytes: toBytes$1i
    });

    var id$1h = getOperatorParametersExtended$2;
    var name$1h = commandNames$2[getOperatorParametersExtended$2];
    var headerSize$1h = 2;
    var maxSize$1h = 0;
    var accessLevel$1h = READ_ONLY;
    var isLoraOnly$1h = false;
    var examples$1g = {
      'simple request': {
        id: id$1h,
        name: name$1h,
        headerSize: headerSize$1h,
        maxSize: maxSize$1h,
        accessLevel: accessLevel$1h,
        parameters: {},
        bytes: [0x3f, 0x00]
      }
    };
    var fromBytes$1g = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1h) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1h = function toBytes() {
      return toBytes$2h(id$1h);
    };

    var getOperatorParametersExtended$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1h,
        examples: examples$1g,
        fromBytes: fromBytes$1g,
        headerSize: headerSize$1h,
        id: id$1h,
        isLoraOnly: isLoraOnly$1h,
        maxSize: maxSize$1h,
        name: name$1h,
        toBytes: toBytes$1h
    });

    var id$1g = getOperatorParametersExtended2$2;
    var name$1g = commandNames$2[getOperatorParametersExtended2$2];
    var headerSize$1g = 2;
    var maxSize$1g = 0;
    var accessLevel$1g = READ_ONLY;
    var isLoraOnly$1g = false;
    var examples$1f = {
      'simple request': {
        id: id$1g,
        name: name$1g,
        headerSize: headerSize$1g,
        maxSize: maxSize$1g,
        accessLevel: accessLevel$1g,
        parameters: {},
        bytes: [0x47, 0x00]
      }
    };
    var fromBytes$1f = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1g) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1g = function toBytes() {
      return toBytes$2h(id$1g);
    };

    var getOperatorParametersExtended2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1g,
        examples: examples$1f,
        fromBytes: fromBytes$1f,
        headerSize: headerSize$1g,
        id: id$1g,
        isLoraOnly: isLoraOnly$1g,
        maxSize: maxSize$1g,
        name: name$1g,
        toBytes: toBytes$1g
    });

    var id$1f = getOperatorParametersExtended4$2;
    var name$1f = commandNames$2[getOperatorParametersExtended4$2];
    var headerSize$1f = 2;
    var maxSize$1f = 0;
    var accessLevel$1f = READ_ONLY;
    var isLoraOnly$1f = false;
    var examples$1e = {
      'simple request': {
        id: id$1f,
        name: name$1f,
        headerSize: headerSize$1f,
        maxSize: maxSize$1f,
        accessLevel: accessLevel$1f,
        parameters: {},
        bytes: [0x75, 0x00]
      }
    };
    var fromBytes$1e = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1f) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1f = function toBytes() {
      return toBytes$2h(id$1f);
    };

    var getOperatorParametersExtended4$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1f,
        examples: examples$1e,
        fromBytes: fromBytes$1e,
        headerSize: headerSize$1f,
        id: id$1f,
        isLoraOnly: isLoraOnly$1f,
        maxSize: maxSize$1f,
        name: name$1f,
        toBytes: toBytes$1f
    });

    var id$1e = setDisplayParam$2;
    var name$1e = commandNames$2[setDisplayParam$2];
    var headerSize$1e = 2;
    var maxSize$1e = 65;
    var accessLevel$1e = READ_WRITE;
    var isLoraOnly$1e = false;
    var examples$1d = {
      'set params with order': {
        id: id$1e,
        name: name$1e,
        headerSize: headerSize$1e,
        maxSize: maxSize$1e,
        accessLevel: accessLevel$1e,
        parameters: {
          displayMode: MAIN_1,
          order: [4, 5, 6, 7]
        },
        bytes: [0x5d, 0x05, 0x00, 0x04, 0x05, 0x06, 0x07]
      },
      'set params without order': {
        id: id$1e,
        name: name$1e,
        headerSize: headerSize$1e,
        maxSize: maxSize$1e,
        accessLevel: accessLevel$1e,
        parameters: {
          displayMode: MAIN_2,
          order: []
        },
        bytes: [0x5d, 0x01, 0x01]
      }
    };
    var fromBytes$1d = function fromBytes(bytes) {
      if (bytes.length < 1 || bytes.length > maxSize$1e) {
        throw new Error('Invalid SetDisplayParam data size.');
      }
      var _bytes = _toArray(bytes),
        displayMode = _bytes[0],
        order = _bytes.slice(1);
      return {
        displayMode: displayMode,
        order: order
      };
    };
    var toBytes$1e = function toBytes(parameters) {
      return toBytes$2h(id$1e, [parameters.displayMode].concat(_toConsumableArray(parameters.order)));
    };

    var setDisplayParam$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1e,
        examples: examples$1d,
        fromBytes: fromBytes$1d,
        headerSize: headerSize$1e,
        id: id$1e,
        isLoraOnly: isLoraOnly$1e,
        maxSize: maxSize$1e,
        name: name$1e,
        toBytes: toBytes$1e
    });

    var id$1d = setOperatorParameters$2;
    var name$1d = commandNames$2[setOperatorParameters$2];
    var headerSize$1d = 2;
    var maxSize$1d = OPERATOR_PARAMETERS_SIZE;
    var accessLevel$1d = READ_WRITE;
    var isLoraOnly$1d = false;
    var examples$1c = {
      'set default operator parameters request': {
        id: id$1d,
        name: name$1d,
        headerSize: headerSize$1d,
        maxSize: maxSize$1d,
        accessLevel: accessLevel$1d,
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
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: true,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: true,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: true,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
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
            RELAY_ON_TARIFF_1: false,
            RELAY_ON_TARIFF_2: false,
            RELAY_ON_TARIFF_3: false,
            RELAY_ON_TARIFF_4: false,
            RELAY_ON_V_GOOD: false,
            RELAY_OFF_Y: true,
            RELAY_OFF_CENTER: true,
            RELAY_OFF_TARIFF_1: false,
            RELAY_OFF_TARIFF_2: false,
            RELAY_OFF_TARIFF_3: false,
            RELAY_OFF_TARIFF_4: false,
            RELAY_OFF_I_LIMIT: false,
            RELAY_OFF_V_BAD: false,
            RELAY_OFF_DIFF_CURRENT_BAD: false,
            RELAY_OFF_LIM_TARIFF_1: false,
            RELAY_OFF_LIM_TARIFF_2: false,
            RELAY_OFF_LIM_TARIFF_3: false,
            RELAY_OFF_LIM_TARIFF_4: false,
            RELAY_OFF_LIM_VAR_TARIFF_1: false,
            RELAY_OFF_LIM_VAR_TARIFF_2: false,
            RELAY_OFF_LIM_VAR_TARIFF_3: false,
            RELAY_OFF_LIM_VAR_TARIFF_4: false,
            RELAY_ON_PF_MIN: false,
            RELAY_OFF_PF_MIN: false,
            RELAY_ON_TIMEOUT: false,
            RELAY_ON_SALDO: false,
            RELAY_OFF_SALDO: false,
            RELAY_OFF_SALDO_SOFT: false
          },
          speedOptoPort: {
            plc: 9600,
            optoport: 9600
          },
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
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: true,
            DATE_MONTH_YEAR: true,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            SORT_DISPLAY_SCREENS: false,
            AUTO_SCREEN_SCROLLING: true
          }
        },
        bytes: [0x1f, 0x5f, 0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x1e, 0x01, 0x7f, 0x07, 0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03, 0x44, 0x1e, 0x1e, 0x03, 0x00, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x05, 0x05, 0x01, 0x80, 0x06, 0x00, 0x00]
      }
    };
    var fromBytes$1c = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1d) {
        throw new Error('Invalid SetOpParams data size.');
      }
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParameters();
    };
    var toBytes$1d = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1d);
      buffer.setOperatorParameters(parameters);
      return toBytes$2h(id$1d, buffer.data);
    };

    var setOperatorParameters$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1d,
        examples: examples$1c,
        fromBytes: fromBytes$1c,
        headerSize: headerSize$1d,
        id: id$1d,
        isLoraOnly: isLoraOnly$1d,
        maxSize: maxSize$1d,
        name: name$1d,
        toBytes: toBytes$1d
    });

    var id$1c = setOperatorParametersExtended$2;
    var name$1c = commandNames$2[setOperatorParametersExtended$2];
    var headerSize$1c = 2;
    var maxSize$1c = OPERATOR_PARAMETERS_EXTENDED_SIZE;
    var accessLevel$1c = READ_WRITE;
    var isLoraOnly$1c = false;
    var examples$1b = {
      'simple request': {
        id: id$1c,
        name: name$1c,
        headerSize: headerSize$1c,
        maxSize: maxSize$1c,
        accessLevel: accessLevel$1c,
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
        bytes: [0x40, 0x09, 0x01, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00]
      }
    };
    var fromBytes$1b = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1c) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended();
    };
    var toBytes$1c = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1c);
      buffer.setOperatorParametersExtended(parameters);
      return toBytes$2h(id$1c, buffer.data);
    };

    var setOperatorParametersExtended$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1c,
        examples: examples$1b,
        fromBytes: fromBytes$1b,
        headerSize: headerSize$1c,
        id: id$1c,
        isLoraOnly: isLoraOnly$1c,
        maxSize: maxSize$1c,
        name: name$1c,
        toBytes: toBytes$1c
    });

    var id$1b = setOperatorParametersExtended2$2;
    var name$1b = commandNames$2[setOperatorParametersExtended2$2];
    var headerSize$1b = 2;
    var maxSize$1b = OPERATOR_PARAMETERS_EXTENDED2_SIZE;
    var accessLevel$1b = READ_WRITE;
    var isLoraOnly$1b = false;
    var examples$1a = {
      'simple request': {
        id: id$1b,
        name: name$1b,
        headerSize: headerSize$1b,
        maxSize: maxSize$1b,
        accessLevel: accessLevel$1b,
        parameters: {
          deltaCorMin: 15,
          timeoutMagnetOff: 5,
          relaySetExt: {
            RELAY_OFF_MAGNET: true,
            RELAY_ON_MAGNET_TIMEOUT: false,
            RELAY_ON_MAGNET_AUTO: true
          },
          timeoutMagnetOn: 5,
          defaultPlcPhase: 1,
          displaySet21: {
            SET_ALL_SEGMENT_DISPLAY: false,
            SOFTWARE_VERSION: false,
            TOTAL_ACTIVE_ENERGY: false,
            ACTIVE_ENERGY_T1: false,
            ACTIVE_ENERGY_T2: false,
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
          displaySet22: {
            CURRENT_IN_PHASE_A: false,
            CURRENT_IN_PHASE_B: false,
            CURRENT_IN_PHASE_C: false,
            CURRENT_IN_NEUTRAL: false,
            VOLTAGE_IN_PHASE_A: false,
            VOLTAGE_IN_PHASE_B: false,
            VOLTAGE_IN_PHASE_C: false,
            BATTERY_VOLTAGE: false,
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: false,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: false,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: false,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
            APPARENT_POWER_QMINUS_PHASE_A: false,
            APPARENT_POWER_QMINUS_PHASE_B: false
          },
          displaySet23: {
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
          displaySet24: {
            MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: false,
            DATE_MONTH_YEAR: false,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            OPTOPORT_SPEED: true,
            MAGNET_INDUCTION: false
          },
          channel1: 1,
          channel2: 2,
          channel3: 3,
          channel4: 4,
          channel5: 5,
          channel6: 6,
          timeCorrectPeriod: 24,
          timeCorrectPassHalfhour: true
        },
        bytes: [0x45, 0x1c, 0x0f, 0x05, 0x05, 0x05, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x98]
      }
    };
    var fromBytes$1a = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1b) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended2();
    };
    var toBytes$1b = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1b);
      buffer.setOperatorParametersExtended2(parameters);
      return toBytes$2h(id$1b, buffer.data);
    };

    var setOperatorParametersExtended2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1b,
        examples: examples$1a,
        fromBytes: fromBytes$1a,
        headerSize: headerSize$1b,
        id: id$1b,
        isLoraOnly: isLoraOnly$1b,
        maxSize: maxSize$1b,
        name: name$1b,
        toBytes: toBytes$1b
    });

    var id$1a = setOperatorParametersExtended4$2;
    var name$1a = commandNames$2[setOperatorParametersExtended4$2];
    var headerSize$1a = 2;
    var maxSize$1a = OPERATOR_PARAMETERS_EXTENDED4_SIZE;
    var accessLevel$1a = READ_WRITE;
    var isLoraOnly$1a = false;
    var examples$19 = {
      'simple request': {
        id: id$1a,
        name: name$1a,
        headerSize: headerSize$1a,
        maxSize: maxSize$1a,
        accessLevel: accessLevel$1a,
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
          displaySet32: {
            CURRENT_IN_PHASE_A: false,
            CURRENT_IN_PHASE_B: false,
            CURRENT_IN_PHASE_C: false,
            CURRENT_IN_NEUTRAL: false,
            VOLTAGE_IN_PHASE_A: false,
            VOLTAGE_IN_PHASE_B: false,
            VOLTAGE_IN_PHASE_C: false,
            BATTERY_VOLTAGE: false,
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: true,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: true,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: true,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
            APPARENT_POWER_QMINUS_PHASE_A: false,
            APPARENT_POWER_QMINUS_PHASE_B: false
          },
          displaySet33: {
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
          displaySet34: {
            MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: true,
            DATE_MONTH_YEAR: true,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            SORT_DISPLAY_SCREENS: false,
            AUTO_SCREEN_SCROLLING: true
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
        bytes: [0x74, 0x1c, 0x00, 0x00, 0x00, 0x5b, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1c]
      }
    };
    var fromBytes$19 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1a) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended4();
    };
    var toBytes$1a = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1a);
      buffer.setOperatorParametersExtended4(parameters);
      return toBytes$2h(id$1a, buffer.data);
    };

    var setOperatorParametersExtended4$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$1a,
        examples: examples$19,
        fromBytes: fromBytes$19,
        headerSize: headerSize$1a,
        id: id$1a,
        isLoraOnly: isLoraOnly$1a,
        maxSize: maxSize$1a,
        name: name$1a,
        toBytes: toBytes$1a
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
        getHalfHourEnergies: getHalfHourEnergies$2,
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
        getOperatorParametersExtended4: getOperatorParametersExtended4$1,
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

    var id$19 = activateRatePlan$3;
    var name$19 = commandNames$1[activateRatePlan$3];
    var headerSize$19 = 2;
    var maxSize$19 = 0;
    var accessLevel$19 = READ_WRITE;
    var isLoraOnly$19 = false;
    var examples$18 = {
      'simple response': {
        id: id$19,
        name: name$19,
        headerSize: headerSize$19,
        maxSize: maxSize$19,
        accessLevel: accessLevel$19,
        parameters: {},
        bytes: [0x13, 0x00]
      }
    };
    var fromBytes$18 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$19) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$19 = function toBytes() {
      return toBytes$2h(id$19);
    };

    var activateRatePlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$19,
        examples: examples$18,
        fromBytes: fromBytes$18,
        headerSize: headerSize$19,
        id: id$19,
        isLoraOnly: isLoraOnly$19,
        maxSize: maxSize$19,
        name: name$19,
        toBytes: toBytes$19
    });

    var id$18 = getBuildVersion$3;
    var name$18 = commandNames$1[getBuildVersion$3];
    var headerSize$18 = 2;
    var maxSize$18 = 6;
    var accessLevel$18 = READ_ONLY;
    var isLoraOnly$18 = false;
    var examples$17 = {
      '2021.09.16/0.0.9': {
        id: id$18,
        name: name$18,
        headerSize: headerSize$18,
        maxSize: maxSize$18,
        accessLevel: accessLevel$18,
        parameters: {
          date: {
            date: 16,
            month: 9,
            year: 21
          },
          version: '0.0.9'
        },
        bytes: [0x70, 0x06, 0x10, 0x09, 0x15, 0x00, 0x00, 0x09]
      }
    };
    var fromBytes$17 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$18) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var _bytes = _slicedToArray(bytes, 6),
        date = _bytes[0],
        month = _bytes[1],
        year = _bytes[2],
        n3 = _bytes[3],
        n2 = _bytes[4],
        n1 = _bytes[5];
      return {
        date: {
          date: date,
          month: month,
          year: year
        },
        version: "".concat(n3, ".").concat(n2, ".").concat(n1)
      };
    };
    var toBytes$18 = function toBytes(parameters) {
      var date = parameters.date,
        version = parameters.version;
      var versionParts = version.split('.').map(function (part) {
        return parseInt(part, 10);
      });
      return toBytes$2h(id$18, [date.date, date.month, date.year].concat(_toConsumableArray(versionParts)));
    };

    var getBuildVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$18,
        examples: examples$17,
        fromBytes: fromBytes$17,
        headerSize: headerSize$18,
        id: id$18,
        isLoraOnly: isLoraOnly$18,
        maxSize: maxSize$18,
        name: name$18,
        toBytes: toBytes$18
    });

    var id$17 = getCorrectTime$3;
    var name$17 = commandNames$1[getCorrectTime$3];
    var headerSize$17 = 2;
    var accessLevel$17 = READ_ONLY;
    var maxSize$17 = 9;
    var isLoraOnly$17 = false;
    var examples$16 = {
      'default parameters': {
        id: id$17,
        name: name$17,
        headerSize: headerSize$17,
        maxSize: maxSize$17,
        accessLevel: accessLevel$17,
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
        bytes: [0x3e, 0x09, 0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01]
      }
    };
    var fromBytes$16 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getTimeCorrectionParameters();
    };
    var toBytes$17 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$17);
      buffer.setTimeCorrectionParameters(parameters);
      return toBytes$2h(id$17, buffer.data);
    };

    var getCorrectTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$17,
        examples: examples$16,
        fromBytes: fromBytes$16,
        headerSize: headerSize$17,
        id: id$17,
        isLoraOnly: isLoraOnly$17,
        maxSize: maxSize$17,
        name: name$17,
        toBytes: toBytes$17
    });

    var id$16 = getDateTime$3;
    var name$16 = commandNames$1[getDateTime$3];
    var headerSize$16 = 2;
    var maxSize$16 = 8;
    var accessLevel$16 = READ_ONLY;
    var isLoraOnly$16 = false;
    var examples$15 = {
      'time: 2024.02.19 18:31:55': {
        id: id$16,
        name: name$16,
        headerSize: headerSize$16,
        maxSize: maxSize$16,
        accessLevel: accessLevel$16,
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
        bytes: [0x07, 0x08, 0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18]
      }
    };
    var fromBytes$15 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getDateTime();
    };
    var toBytes$16 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$16);
      buffer.setDateTime(parameters);
      return toBytes$2h(id$16, buffer.data);
    };

    var getDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$16,
        examples: examples$15,
        fromBytes: fromBytes$15,
        headerSize: headerSize$16,
        id: id$16,
        isLoraOnly: isLoraOnly$16,
        maxSize: maxSize$16,
        name: name$16,
        toBytes: toBytes$16
    });

    var DATE_SIZE$1 = 2;
    var ENERGY_FLAGS_SIZE$1 = 1;
    var TARIFF_FLAGS_SIZE = 1;
    var MAX_TARIFFS_ENERGIES_SIZE = 6 * 4 * 4;
    var energiesToObis$1 = {
      'A+': '1.8.x',
      'A+R+': '3.8.x',
      'A+R-': '4.8.x',
      'A-': '2.8.x',
      'A-R+': '7.8.x',
      'A-R-': '8.8.x'
    };
    var convertEnergyToObis$1 = function convertEnergyToObis(energy) {
      var tariff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var obis = energiesToObis$1[energy];
      return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    var convertTariffsEnergiesToDlms = function convertTariffsEnergiesToDlms(energies) {
      var dlms = {};
      var _loop = function _loop(tariff) {
        var tariffEnergies = energies[tariff];
        if (tariffEnergies) {
          Object.keys(tariffEnergies).forEach(function (energy) {
            var value = tariffEnergies[energy];
            if (value || value === 0) {
              dlms[convertEnergyToObis$1(energy, tariff + 1)] = value;
            }
          });
        }
      };
      for (var tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
        _loop(tariff);
      }
      return dlms;
    };
    var id$15 = getDayEnergies$2;
    var name$15 = commandNames$1[getDayEnergies$2];
    var headerSize$15 = 2;
    var maxSize$15 = DATE_SIZE$1 + ENERGY_FLAGS_SIZE$1 + TARIFF_FLAGS_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
    var accessLevel$15 = UNENCRYPTED;
    var isLoraOnly$15 = true;
    var examples$14 = {
      'get day energies': {
        id: id$15,
        headerSize: headerSize$15,
        name: name$15,
        maxSize: maxSize$15,
        parameters: {
          date: {
            year: 21,
            month: 2,
            date: 3
          },
          energies: [null, {
            'A+': 0x1000,
            'A-R+': 0x2000
          }, null, null]
        },
        bytes: [0x78, 0x0c, 0x2a, 0x43, 0x11, 0x22, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00]
      }
    };
    var fromBytes$14 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$1(bytes);
      return {
        date: buffer.getDate(),
        energies: buffer.getTariffsEnergies()
      };
    };
    var toBytes$15 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$1(maxSize$15);
      buffer.setDate(parameters.date);
      buffer.setTariffsEnergies(parameters.energies);
      return toBytes$2h(id$15, buffer.getBytesToOffset());
    };
    var toJson$b = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var date = parameters.date,
        energies = parameters.energies;
      var result = dlms ? _objectSpread2({
        date: date
      }, convertTariffsEnergiesToDlms(energies)) : parameters;
      return JSON.stringify(result);
    };

    var getDayEnergies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$15,
        examples: examples$14,
        fromBytes: fromBytes$14,
        headerSize: headerSize$15,
        id: id$15,
        isLoraOnly: isLoraOnly$15,
        maxSize: maxSize$15,
        name: name$15,
        toBytes: toBytes$15,
        toJson: toJson$b
    });

    var MAX_PERIODS_NUMBER = 8;
    var PERIODS_FINAL_BYTE = 0xff;
    var id$14 = getDayProfile$3;
    var name$14 = commandNames$1[getDayProfile$3];
    var headerSize$14 = 2;
    var maxSize$14 = MAX_PERIODS_NUMBER;
    var accessLevel$14 = READ_ONLY;
    var isLoraOnly$14 = false;
    var examples$13 = {
      'full periods response': {
        id: id$14,
        name: name$14,
        headerSize: headerSize$14,
        maxSize: maxSize$14,
        accessLevel: accessLevel$14,
        parameters: {
          periods: [{
            tariff: 0,
            isFirstHalfHour: true,
            hour: 2
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 3
          }, {
            tariff: 2,
            isFirstHalfHour: true,
            hour: 4
          }, {
            tariff: 3,
            isFirstHalfHour: false,
            hour: 5
          }, {
            tariff: 0,
            isFirstHalfHour: true,
            hour: 6
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 7
          }, {
            tariff: 2,
            isFirstHalfHour: false,
            hour: 8
          }, {
            tariff: 3,
            isFirstHalfHour: true,
            hour: 9
          }]
        },
        bytes: [0x3b, 0x08, 0x10, 0x1d, 0x22, 0x2f, 0x30, 0x3d, 0x46, 0x4b]
      },
      'response with 4 periods': {
        id: id$14,
        name: name$14,
        headerSize: headerSize$14,
        maxSize: maxSize$14,
        accessLevel: accessLevel$14,
        parameters: {
          periods: [{
            tariff: 0,
            isFirstHalfHour: true,
            hour: 2
          }, {
            tariff: 1,
            isFirstHalfHour: false,
            hour: 3
          }, {
            tariff: 2,
            isFirstHalfHour: true,
            hour: 4
          }, {
            tariff: 3,
            isFirstHalfHour: false,
            hour: 5
          }]
        },
        bytes: [0x3b, 0x05, 0x10, 0x1d, 0x22, 0x2f, 0xff]
      }
    };
    var fromBytes$13 = function fromBytes(bytes) {
      var finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
      var cleanData = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
      return {
        periods: _toConsumableArray(cleanData).map(CommandBinaryBuffer$2.getDayProfileFromByte)
      };
    };
    var toBytes$14 = function toBytes(parameters) {
      var hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
      var size = parameters.periods.length + +hasPeriodsFinalByte;
      var buffer = new CommandBinaryBuffer$2(size);
      parameters.periods.forEach(function (period) {
        buffer.setDayProfile(period);
      });
      if (hasPeriodsFinalByte) {
        buffer.setUint8(PERIODS_FINAL_BYTE);
      }
      return toBytes$2h(id$14, buffer.data);
    };

    var getDayProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$14,
        examples: examples$13,
        fromBytes: fromBytes$13,
        headerSize: headerSize$14,
        id: id$14,
        isLoraOnly: isLoraOnly$14,
        maxSize: maxSize$14,
        name: name$14,
        toBytes: toBytes$14
    });

    var id$13 = getDeviceId$3;
    var name$13 = commandNames$1[getDeviceId$3];
    var headerSize$13 = 2;
    var accessLevel$13 = READ_ONLY;
    var maxSize$13 = 8;
    var isLoraOnly$13 = false;
    var examples$12 = {
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
        bytes: [0x05, 0x08, 0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a]
      }
    };
    var fromBytes$12 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getDeviceId();
    };
    var toBytes$13 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$13);
      buffer.setDeviceId(parameters);
      return toBytes$2h(id$13, buffer.data);
    };

    var getDeviceId = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$13,
        examples: examples$12,
        fromBytes: fromBytes$12,
        headerSize: headerSize$13,
        id: id$13,
        isLoraOnly: isLoraOnly$13,
        maxSize: maxSize$13,
        name: name$13,
        toBytes: toBytes$13
    });

    var id$12 = getDeviceType$3;
    var name$12 = commandNames$1[getDeviceType$3];
    var headerSize$12 = 2;
    var accessLevel$12 = READ_ONLY;
    var maxSize$12 = 9;
    var isLoraOnly$12 = false;
    var examples$11 = {
      'type 1': {
        id: id$12,
        name: name$12,
        headerSize: headerSize$12,
        maxSize: maxSize$12,
        accessLevel: accessLevel$12,
        parameters: {
          type: 'MTX 1A10.DG.2L5-LD4',
          revision: 0x0b,
          descriptor: {
            meterType: 'mtx1',
            typeMeterG: false,
            downgradedToA: false,
            supportMeterInfo: false
          }
        },
        bytes: [0x04, 0x09, 0x00, 0x11, 0x21, 0x49, 0x21, 0xB6, 0x81, 0xC0, 0x00]
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
          descriptor: {
            meterType: 'mtx1',
            typeMeterG: true,
            downgradedToA: true,
            supportMeterInfo: false
          }
        },
        bytes: [0x04, 0x09, 0x00, 0x12, 0x16, 0x47, 0x21, 0xb3, 0x17, 0x2c, 0x11]
      }
    };
    var fromBytes$11 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getDeviceType();
    };
    var toBytes$12 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$12);
      buffer.setDeviceType(parameters);
      return toBytes$2h(id$12, buffer.data);
    };

    var getDeviceType = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$12,
        examples: examples$11,
        fromBytes: fromBytes$11,
        headerSize: headerSize$12,
        id: id$12,
        isLoraOnly: isLoraOnly$12,
        maxSize: maxSize$12,
        name: name$12,
        toBytes: toBytes$12
    });

    var COMMAND_BODY_SIZE = 14;
    var OLD_COMMAND_BODY_SIZE = 20;
    var id$11 = getEventsCounters$3;
    var name$11 = commandNames$1[getEventsCounters$3];
    var headerSize$11 = 2;
    var accessLevel$11 = READ_ONLY;
    var maxSize$11 = OLD_COMMAND_BODY_SIZE;
    var isLoraOnly$11 = false;
    var examples$10 = {
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
        bytes: [0x34, 0x0e, 0x00, 0x48, 0x00, 0x42, 0x01, 0x56, 0x00, 0x4d, 0x00, 0x22, 0x00, 0x16, 0x01, 0x2a]
      }
    };
    var fromBytes$10 = function fromBytes(bytes) {
      if (bytes.length !== COMMAND_BODY_SIZE && bytes.length !== OLD_COMMAND_BODY_SIZE) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      var restart = buffer.getUint16();
      var powerOff = buffer.getUint16();
      var localParametersChange = buffer.getUint16();
      var remoteParametersChange = buffer.getUint16();
      var accessError = buffer.getUint16();
      var accessClosed = buffer.getUint16();
      var setClock = buffer.getUint16();
      return {
        accessClosed: accessClosed,
        accessError: accessError,
        localParametersChange: localParametersChange,
        remoteParametersChange: remoteParametersChange,
        powerOff: powerOff,
        restart: restart,
        setClock: setClock
      };
    };
    var toBytes$11 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(COMMAND_BODY_SIZE);
      buffer.setUint16(parameters.restart);
      buffer.setUint16(parameters.powerOff);
      buffer.setUint16(parameters.localParametersChange);
      buffer.setUint16(parameters.remoteParametersChange);
      buffer.setUint16(parameters.accessError);
      buffer.setUint16(parameters.accessClosed);
      buffer.setUint16(parameters.setClock);
      return toBytes$2h(id$11, buffer.data);
    };

    var getEventsCounters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$11,
        examples: examples$10,
        fromBytes: fromBytes$10,
        headerSize: headerSize$11,
        id: id$11,
        isLoraOnly: isLoraOnly$11,
        maxSize: maxSize$11,
        name: name$11,
        toBytes: toBytes$11
    });

    var BODY_WITHOUT_EVENTS_SIZE = 3 + 1;
    var EVENT_SIZE = 4;
    var id$10 = getEvents$3;
    var name$10 = commandNames$1[getEvents$3];
    var headerSize$10 = 2;
    var accessLevel$10 = READ_ONLY;
    var maxSize$10 = BODY_WITHOUT_EVENTS_SIZE + 255 * EVENT_SIZE;
    var isLoraOnly$10 = false;
    var examples$$ = {
      'simple response': {
        id: id$10,
        name: name$10,
        headerSize: headerSize$10,
        accessLevel: accessLevel$10,
        maxSize: maxSize$10,
        parameters: {
          date: {
            year: 23,
            month: 3,
            date: 12
          },
          eventsNumber: 2,
          events: [{
            hours: 1,
            minutes: 12,
            seconds: 33,
            event: 157,
            eventName: 'POWER_OVER_RELAY_OFF',
            power: [22, 25, 12, 143]
          }, {
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
          }]
        },
        bytes: [0x33, 0x18, 0x17, 0x03, 0x0c, 0x02, 0x01, 0x0c, 0x21, 0x9d, 0x16, 0x19, 0x0c, 0x8f, 0x01, 0x0c, 0x21, 0x79, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18]
      }
    };
    var getFromBytes$1 = function getFromBytes(BinaryBufferConstructor) {
      return function (bytes) {
        if (bytes.length > maxSize$10) {
          throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
        }
        var buffer = new BinaryBufferConstructor(bytes);
        var date = buffer.getDate();
        var eventsNumber = buffer.getUint8();
        var events = [];
        while (!buffer.isEmpty) {
          events.push(buffer.getEvent());
        }
        return {
          date: date,
          eventsNumber: eventsNumber,
          events: events
        };
      };
    };
    var getToBytes = function getToBytes(BinaryBufferConstructor) {
      return function (parameters) {
        var buffer = new BinaryBufferConstructor(maxSize$10);
        buffer.setDate(parameters.date);
        buffer.setUint8(parameters.eventsNumber);
        var _iterator = _createForOfIteratorHelper(parameters.events),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;
            buffer.setEvent(event);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return toBytes$2h(id$10, buffer.getBytesToOffset());
      };
    };
    var fromBytes$$ = getFromBytes$1(CommandBinaryBuffer$2);
    var toBytes$10 = getToBytes(CommandBinaryBuffer$2);

    var getEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$10,
        examples: examples$$,
        fromBytes: fromBytes$$,
        getFromBytes: getFromBytes$1,
        getToBytes: getToBytes,
        headerSize: headerSize$10,
        id: id$10,
        isLoraOnly: isLoraOnly$10,
        maxSize: maxSize$10,
        name: name$10,
        toBytes: toBytes$10
    });

    var id$$ = getEventStatus$3;
    var name$$ = commandNames$1[getEventStatus$3];
    var headerSize$$ = 2;
    var accessLevel$$ = READ_ONLY;
    var maxSize$$ = 2;
    var isLoraOnly$$ = false;
    var examples$_ = {
      'simple response': {
        id: id$$,
        name: name$$,
        headerSize: headerSize$$,
        accessLevel: accessLevel$$,
        maxSize: maxSize$$,
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
        bytes: [0x01, 0x02, 0x85, 0x10]
      }
    };
    var fromBytes$_ = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes, true);
      return buffer.getEventStatus();
    };
    var toBytes$$ = function toBytes(eventStatus) {
      var buffer = new CommandBinaryBuffer$2(maxSize$$, true);
      buffer.setEventStatus(eventStatus);
      return toBytes$2h(id$$, buffer.data);
    };

    var getEventStatus = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$$,
        examples: examples$_,
        fromBytes: fromBytes$_,
        headerSize: headerSize$$,
        id: id$$,
        isLoraOnly: isLoraOnly$$,
        maxSize: maxSize$$,
        name: name$$,
        toBytes: toBytes$$
    });

    var id$_ = getMagneticFieldThreshold$3;
    var name$_ = commandNames$1[getMagneticFieldThreshold$3];
    var headerSize$_ = 2;
    var maxSize$_ = 10;
    var accessLevel$_ = READ_ONLY;
    var isLoraOnly$_ = false;
    var examples$Z = {
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
        bytes: [0x6d, 0x0a, 0x00, 0x0a, 0x00, 0x05, 0x00, 0x7b, 0xff, 0xff, 0xff, 0xff]
      }
    };
    var fromBytes$Z = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        induction: buffer.getUint16(),
        threshold: buffer.getUint16(),
        inductionCoefficient: buffer.getUint16() / 100,
        reserved: buffer.getUint32()
      };
    };
    var toBytes$_ = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$_);
      buffer.setUint16(parameters.induction);
      buffer.setUint16(parameters.threshold);
      buffer.setUint16(parameters.inductionCoefficient * 100);
      buffer.setUint32(parameters.reserved);
      return toBytes$2h(id$_, buffer.data);
    };

    var getMagneticFieldThreshold = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$_,
        examples: examples$Z,
        fromBytes: fromBytes$Z,
        headerSize: headerSize$_,
        id: id$_,
        isLoraOnly: isLoraOnly$_,
        maxSize: maxSize$_,
        name: name$_,
        toBytes: toBytes$_
    });

    var id$Z = getMeterInfo$3;
    var name$Z = commandNames$1[getMeterInfo$3];
    var headerSize$Z = 2;
    var maxSize$Z = 1;
    var accessLevel$Z = READ_ONLY;
    var isLoraOnly$Z = false;
    var examples$Y = {
      'simple response': {
        id: id$Z,
        name: name$Z,
        headerSize: headerSize$Z,
        maxSize: maxSize$Z,
        accessLevel: accessLevel$Z,
        parameters: {
          ten: 0
        },
        bytes: [0x7a, 0x01, 0x00]
      }
    };
    var fromBytes$Y = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        ten = _ref2[0];
      return {
        ten: ten
      };
    };
    var toBytes$Z = function toBytes(_ref3) {
      var ten = _ref3.ten;
      return toBytes$2h(id$Z, [ten]);
    };

    var getMeterInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Z,
        examples: examples$Y,
        fromBytes: fromBytes$Y,
        headerSize: headerSize$Z,
        id: id$Z,
        isLoraOnly: isLoraOnly$Z,
        maxSize: maxSize$Z,
        name: name$Z,
        toBytes: toBytes$Z
    });

    var id$Y = getOperatorParametersExtended3$3;
    var name$Y = commandNames$1[getOperatorParametersExtended3$3];
    var headerSize$Y = 2;
    var maxSize$Y = 17;
    var accessLevel$Y = READ_ONLY;
    var isLoraOnly$Y = false;
    var examples$X = {
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
        bytes: [0x71, 0x11, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xc8, 0x00, 0x00, 0x01, 0x2c, 0x00, 0x00, 0x01, 0x90, 0x28]
      }
    };
    var fromBytes$X = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getOperatorParametersExtended3();
    };
    var toBytes$Y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$Y);
      buffer.setOperatorParametersExtended3(parameters);
      return toBytes$2h(id$Y, buffer.data);
    };

    var getOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Y,
        examples: examples$X,
        fromBytes: fromBytes$X,
        headerSize: headerSize$Y,
        id: id$Y,
        isLoraOnly: isLoraOnly$Y,
        maxSize: maxSize$Y,
        name: name$Y,
        toBytes: toBytes$Y
    });

    var id$X = getRatePlanInfo$3;
    var name$X = commandNames$1[getRatePlanInfo$3];
    var headerSize$X = 2;
    var maxSize$X = 1 + TARIFF_PLAN_SIZE * 2;
    var accessLevel$X = READ_ONLY;
    var isLoraOnly$X = false;
    var examples$W = {
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
        bytes: [0x2c, 0x17, 0x01, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x00, 0x00, 0x00, 0x0a, 0x14, 0x1e, 0x28, 0x32, 0x3c, 0x46, 0x50]
      }
    };
    var fromBytes$W = function fromBytes(bytes) {
      if (bytes.length !== maxSize$X) {
        throw new Error('Invalid getRatePlanInfo data size.');
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        tariffTable: buffer.getUint8(),
        activePlan: buffer.getTariffPlan(),
        passivePlan: buffer.getTariffPlan()
      };
    };
    var toBytes$X = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$X);
      buffer.setUint8(parameters.tariffTable);
      buffer.setTariffPlan(parameters.activePlan);
      buffer.setTariffPlan(parameters.passivePlan);
      return toBytes$2h(id$X, buffer.data);
    };

    var getRatePlanInfo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$X,
        examples: examples$W,
        fromBytes: fromBytes$W,
        headerSize: headerSize$X,
        id: id$X,
        isLoraOnly: isLoraOnly$X,
        maxSize: maxSize$X,
        name: name$X,
        toBytes: toBytes$X
    });

    var id$W = getSaldo$3;
    var name$W = commandNames$1[getSaldo$3];
    var headerSize$W = 2;
    var maxSize$W = 29;
    var accessLevel$W = READ_ONLY;
    var isLoraOnly$W = false;
    var examples$V = {
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
        bytes: [0x29, 0x1d, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x09, 0x17, 0x06, 0x23]
      }
    };
    var fromBytes$V = function fromBytes(bytes) {
      if (bytes.length !== maxSize$W) {
        throw new Error('Invalid getSaldo data size.');
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      return {
        currentSaldo: buffer.getInt32(),
        count: buffer.getUint8(),
        energy: new Array(4).fill(0).map(function () {
          return buffer.getInt32();
        }),
        beginSaldoOfPeriod: buffer.getInt32(),
        date: {
          month: buffer.getUint8(),
          date: buffer.getUint8(),
          hours: buffer.getUint8(),
          minutes: buffer.getUint8()
        }
      };
    };
    var toBytes$W = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$W);
      buffer.setInt32(parameters.currentSaldo);
      buffer.setUint8(parameters.count);
      parameters.energy.forEach(function (value) {
        return buffer.setInt32(value);
      });
      buffer.setInt32(parameters.beginSaldoOfPeriod);
      buffer.setUint8(parameters.date.month);
      buffer.setUint8(parameters.date.date);
      buffer.setUint8(parameters.date.hours);
      buffer.setUint8(parameters.date.minutes);
      return toBytes$2h(id$W, buffer.data);
    };

    var getSaldo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$W,
        examples: examples$V,
        fromBytes: fromBytes$V,
        headerSize: headerSize$W,
        id: id$W,
        isLoraOnly: isLoraOnly$W,
        maxSize: maxSize$W,
        name: name$W,
        toBytes: toBytes$W
    });

    var id$V = getSaldoParameters$3;
    var name$V = commandNames$1[getSaldoParameters$3];
    var headerSize$V = 2;
    var maxSize$V = 37;
    var accessLevel$V = READ_ONLY;
    var isLoraOnly$V = false;
    var examples$U = {
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
        bytes: [0x2e, 0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
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
        bytes: [0x2e, 0x25, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x00, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x0e]
      }
    };
    var fromBytes$U = function fromBytes(bytes) {
      if (bytes.length !== maxSize$V) {
        throw new Error('Invalid getSaldoParameters data size.');
      }
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getSaldoParameters();
    };
    var toBytes$V = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$V);
      buffer.setSaldoParameters(parameters);
      return toBytes$2h(id$V, buffer.data);
    };

    var getSaldoParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$V,
        examples: examples$U,
        fromBytes: fromBytes$U,
        headerSize: headerSize$V,
        id: id$V,
        isLoraOnly: isLoraOnly$V,
        maxSize: maxSize$V,
        name: name$V,
        toBytes: toBytes$V
    });

    var id$U = getSeasonProfile$3;
    var name$U = commandNames$1[getSeasonProfile$3];
    var headerSize$U = 2;
    var maxSize$U = 9;
    var accessLevel$U = READ_ONLY;
    var isLoraOnly$U = false;
    var examples$T = {
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
        bytes: [0x3c, 0x09, 0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00]
      }
    };
    var fromBytes$T = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getSeasonProfile();
    };
    var toBytes$U = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$U);
      buffer.setSeasonProfile(parameters);
      return toBytes$2h(id$U, buffer.data);
    };

    var getSeasonProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$U,
        examples: examples$T,
        fromBytes: fromBytes$T,
        headerSize: headerSize$U,
        id: id$U,
        isLoraOnly: isLoraOnly$U,
        maxSize: maxSize$U,
        name: name$U,
        toBytes: toBytes$U
    });

    var id$T = getSpecialDay$3;
    var name$T = commandNames$1[getSpecialDay$3];
    var headerSize$T = 2;
    var maxSize$T = 4;
    var accessLevel$T = READ_ONLY;
    var isLoraOnly$T = false;
    var examples$S = {
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
        bytes: [0x3d, 0x04, 0x01, 0x09, 0x03, 0x00]
      }
    };
    var fromBytes$S = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      return buffer.getSpecialDay();
    };
    var toBytes$T = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$T);
      buffer.setSpecialDay(parameters);
      return toBytes$2h(id$T, buffer.data);
    };

    var getSpecialDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$T,
        examples: examples$S,
        fromBytes: fromBytes$S,
        headerSize: headerSize$T,
        id: id$T,
        isLoraOnly: isLoraOnly$T,
        maxSize: maxSize$T,
        name: name$T,
        toBytes: toBytes$T
    });

    var id$S = getVersion$3;
    var name$S = commandNames$1[getVersion$3];
    var headerSize$S = 2;
    var maxSize$S = 10;
    var accessLevel$S = READ_ONLY;
    var isLoraOnly$S = false;
    var examples$R = {
      'simple response': {
        id: id$S,
        name: name$S,
        headerSize: headerSize$S,
        maxSize: maxSize$S,
        accessLevel: accessLevel$S,
        parameters: {
          version: '104.25.003'
        },
        bytes: [0x28, 0x0a, 0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33]
      }
    };
    var fromBytes$R = function fromBytes(bytes) {
      return {
        version: String.fromCharCode.apply(null, _toConsumableArray(bytes))
      };
    };
    var toBytes$S = function toBytes(parameters) {
      var version = parameters.version.split('').map(function (_char) {
        return _char.charCodeAt(0);
      });
      return toBytes$2h(id$S, version);
    };

    var getVersion = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$S,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$S,
        id: id$S,
        isLoraOnly: isLoraOnly$S,
        maxSize: maxSize$S,
        name: name$S,
        toBytes: toBytes$S
    });

    var id$R = prepareRatePlan$3;
    var name$R = commandNames$1[prepareRatePlan$3];
    var headerSize$R = 2;
    var maxSize$R = 0;
    var accessLevel$R = READ_WRITE;
    var isLoraOnly$R = false;
    var examples$Q = {
      'simple response': {
        id: id$R,
        name: name$R,
        headerSize: headerSize$R,
        maxSize: maxSize$R,
        accessLevel: accessLevel$R,
        parameters: {},
        bytes: [0x14, 0x00]
      }
    };
    var fromBytes$Q = function fromBytes(bytes) {
      if (bytes.length !== maxSize$R) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$R = function toBytes() {
      return toBytes$2h(id$R);
    };

    var prepareRatePlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$R,
        examples: examples$Q,
        fromBytes: fromBytes$Q,
        headerSize: headerSize$R,
        id: id$R,
        isLoraOnly: isLoraOnly$R,
        maxSize: maxSize$R,
        name: name$R,
        toBytes: toBytes$R
    });

    var id$Q = resetPowerMaxDay$3;
    var name$Q = commandNames$1[resetPowerMaxDay$3];
    var headerSize$Q = 2;
    var maxSize$Q = 0;
    var accessLevel$Q = READ_WRITE;
    var isLoraOnly$Q = false;
    var examples$P = {
      'simple response': {
        id: id$Q,
        name: name$Q,
        headerSize: headerSize$Q,
        maxSize: maxSize$Q,
        accessLevel: accessLevel$Q,
        parameters: {},
        bytes: [0x35, 0x00]
      }
    };
    var fromBytes$P = function fromBytes(bytes) {
      if (bytes.length !== maxSize$Q) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$Q = function toBytes() {
      return toBytes$2h(id$Q);
    };

    var resetPowerMaxDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Q,
        examples: examples$P,
        fromBytes: fromBytes$P,
        headerSize: headerSize$Q,
        id: id$Q,
        isLoraOnly: isLoraOnly$Q,
        maxSize: maxSize$Q,
        name: name$Q,
        toBytes: toBytes$Q
    });

    var id$P = resetPowerMaxMonth$3;
    var name$P = commandNames$1[resetPowerMaxMonth$3];
    var headerSize$P = 2;
    var maxSize$P = 0;
    var accessLevel$P = READ_WRITE;
    var isLoraOnly$P = false;
    var examples$O = {
      'simple response': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        accessLevel: accessLevel$P,
        parameters: {},
        bytes: [0x36, 0x00]
      }
    };
    var fromBytes$O = function fromBytes(bytes) {
      if (bytes.length !== maxSize$P) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$P = function toBytes() {
      return toBytes$2h(id$P);
    };

    var resetPowerMaxMonth = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$P,
        examples: examples$O,
        fromBytes: fromBytes$O,
        headerSize: headerSize$P,
        id: id$P,
        isLoraOnly: isLoraOnly$P,
        maxSize: maxSize$P,
        name: name$P,
        toBytes: toBytes$P
    });

    var id$O = runTariffPlan$3;
    var name$O = commandNames$1[runTariffPlan$3];
    var headerSize$O = 2;
    var maxSize$O = 0;
    var accessLevel$O = READ_WRITE;
    var isLoraOnly$O = false;
    var examples$N = {
      'simple response': {
        id: id$O,
        name: name$O,
        headerSize: headerSize$O,
        maxSize: maxSize$O,
        accessLevel: accessLevel$O,
        parameters: {},
        bytes: [0x46, 0x00]
      }
    };
    var fromBytes$N = function fromBytes(bytes) {
      if (bytes.length !== maxSize$O) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$O = function toBytes() {
      return toBytes$2h(id$O);
    };

    var runTariffPlan = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$O,
        examples: examples$N,
        fromBytes: fromBytes$N,
        headerSize: headerSize$O,
        id: id$O,
        isLoraOnly: isLoraOnly$O,
        maxSize: maxSize$O,
        name: name$O,
        toBytes: toBytes$O
    });

    var id$N = setAccessKey$3;
    var name$N = commandNames$1[setAccessKey$3];
    var headerSize$N = 2;
    var maxSize$N = 0;
    var accessLevel$N = READ_WRITE;
    var isLoraOnly$N = false;
    var examples$M = {
      'simple response': {
        id: id$N,
        name: name$N,
        headerSize: headerSize$N,
        maxSize: maxSize$N,
        accessLevel: accessLevel$N,
        parameters: {},
        bytes: [0x09, 0x00]
      }
    };
    var fromBytes$M = function fromBytes(bytes) {
      if (bytes.length !== maxSize$N) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$N = function toBytes() {
      return toBytes$2h(id$N);
    };

    var setAccessKey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$N,
        examples: examples$M,
        fromBytes: fromBytes$M,
        headerSize: headerSize$N,
        id: id$N,
        isLoraOnly: isLoraOnly$N,
        maxSize: maxSize$N,
        name: name$N,
        toBytes: toBytes$N
    });

    var id$M = setCorrectDateTime$3;
    var name$M = commandNames$1[setCorrectDateTime$3];
    var headerSize$M = 2;
    var maxSize$M = 0;
    var accessLevel$M = READ_ONLY;
    var isLoraOnly$M = false;
    var examples$L = {
      'simple response': {
        id: id$M,
        name: name$M,
        headerSize: headerSize$M,
        maxSize: maxSize$M,
        accessLevel: accessLevel$M,
        parameters: {},
        bytes: [0x5c, 0x00]
      }
    };
    var fromBytes$L = function fromBytes(bytes) {
      if (bytes.length !== maxSize$M) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$M = function toBytes() {
      return toBytes$2h(id$M);
    };

    var setCorrectDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$M,
        examples: examples$L,
        fromBytes: fromBytes$L,
        headerSize: headerSize$M,
        id: id$M,
        isLoraOnly: isLoraOnly$M,
        maxSize: maxSize$M,
        name: name$M,
        toBytes: toBytes$M
    });

    var id$L = setCorrectTime$3;
    var name$L = commandNames$1[setCorrectTime$3];
    var headerSize$L = 2;
    var maxSize$L = 0;
    var accessLevel$L = READ_WRITE;
    var isLoraOnly$L = false;
    var examples$K = {
      'simple response': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        maxSize: maxSize$L,
        accessLevel: accessLevel$L,
        parameters: {},
        bytes: [0x1c, 0x00]
      }
    };
    var fromBytes$K = function fromBytes(bytes) {
      if (bytes.length !== maxSize$L) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$L = function toBytes() {
      return toBytes$2h(id$L);
    };

    var setCorrectTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$L,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$L,
        id: id$L,
        isLoraOnly: isLoraOnly$L,
        maxSize: maxSize$L,
        name: name$L,
        toBytes: toBytes$L
    });

    var id$K = setDateTime$3;
    var name$K = commandNames$1[setDateTime$3];
    var headerSize$K = 2;
    var maxSize$K = 0;
    var accessLevel$K = READ_ONLY;
    var isLoraOnly$K = false;
    var examples$J = {
      'simple response': {
        id: id$K,
        name: name$K,
        headerSize: headerSize$K,
        maxSize: maxSize$K,
        accessLevel: accessLevel$K,
        parameters: {},
        bytes: [0x08, 0x00]
      }
    };
    var fromBytes$J = function fromBytes(bytes) {
      if (bytes.length !== maxSize$K) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$K = function toBytes() {
      return toBytes$2h(id$K);
    };

    var setDateTime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$K,
        examples: examples$J,
        fromBytes: fromBytes$J,
        headerSize: headerSize$K,
        id: id$K,
        isLoraOnly: isLoraOnly$K,
        maxSize: maxSize$K,
        name: name$K,
        toBytes: toBytes$K
    });

    var id$J = setDayProfile$3;
    var name$J = commandNames$1[setDayProfile$3];
    var headerSize$J = 2;
    var maxSize$J = 0;
    var accessLevel$J = READ_WRITE;
    var isLoraOnly$J = false;
    var examples$I = {
      'simple response': {
        id: id$J,
        name: name$J,
        headerSize: headerSize$J,
        maxSize: maxSize$J,
        accessLevel: accessLevel$J,
        parameters: {},
        bytes: [0x10, 0x00]
      }
    };
    var fromBytes$I = function fromBytes(bytes) {
      if (bytes.length !== maxSize$J) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$J = function toBytes() {
      return toBytes$2h(id$J);
    };

    var setDayProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$J,
        examples: examples$I,
        fromBytes: fromBytes$I,
        headerSize: headerSize$J,
        id: id$J,
        isLoraOnly: isLoraOnly$J,
        maxSize: maxSize$J,
        name: name$J,
        toBytes: toBytes$J
    });

    var id$I = setDisplayParam$3;
    var name$I = commandNames$1[setDisplayParam$3];
    var headerSize$I = 2;
    var maxSize$I = 0;
    var accessLevel$I = READ_WRITE;
    var isLoraOnly$I = false;
    var examples$H = {
      'simple response': {
        id: id$I,
        name: name$I,
        headerSize: headerSize$I,
        maxSize: maxSize$I,
        accessLevel: accessLevel$I,
        parameters: {},
        bytes: [0x5d, 0x00]
      }
    };
    var fromBytes$H = function fromBytes(bytes) {
      if (bytes.length !== maxSize$I) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$I = function toBytes() {
      return toBytes$2h(id$I);
    };

    var setDisplayParam = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$I,
        examples: examples$H,
        fromBytes: fromBytes$H,
        headerSize: headerSize$I,
        id: id$I,
        isLoraOnly: isLoraOnly$I,
        maxSize: maxSize$I,
        name: name$I,
        toBytes: toBytes$I
    });

    var id$H = setOperatorParameters$3;
    var name$H = commandNames$1[setOperatorParameters$3];
    var headerSize$H = 2;
    var maxSize$H = 0;
    var accessLevel$H = READ_WRITE;
    var isLoraOnly$H = false;
    var examples$G = {
      'simple response': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        maxSize: maxSize$H,
        accessLevel: accessLevel$H,
        parameters: {},
        bytes: [0x1f, 0x00]
      }
    };
    var fromBytes$G = function fromBytes(bytes) {
      if (bytes.length !== maxSize$H) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$H = function toBytes() {
      return toBytes$2h(id$H);
    };

    var setOperatorParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$H,
        examples: examples$G,
        fromBytes: fromBytes$G,
        headerSize: headerSize$H,
        id: id$H,
        isLoraOnly: isLoraOnly$H,
        maxSize: maxSize$H,
        name: name$H,
        toBytes: toBytes$H
    });

    var id$G = setOperatorParametersExtended3$3;
    var name$G = commandNames$1[setOperatorParametersExtended3$3];
    var headerSize$G = 2;
    var maxSize$G = 0;
    var accessLevel$G = READ_WRITE;
    var isLoraOnly$G = false;
    var examples$F = {
      'simple response': {
        id: id$G,
        name: name$G,
        headerSize: headerSize$G,
        maxSize: maxSize$G,
        accessLevel: accessLevel$G,
        parameters: {},
        bytes: [0x72, 0x00]
      }
    };
    var fromBytes$F = function fromBytes(bytes) {
      if (bytes.length !== maxSize$G) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$G = function toBytes() {
      return toBytes$2h(id$G);
    };

    var setOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$G,
        examples: examples$F,
        fromBytes: fromBytes$F,
        headerSize: headerSize$G,
        id: id$G,
        isLoraOnly: isLoraOnly$G,
        maxSize: maxSize$G,
        name: name$G,
        toBytes: toBytes$G
    });

    var id$F = setSaldo$3;
    var name$F = commandNames$1[setSaldo$3];
    var headerSize$F = 2;
    var maxSize$F = 0;
    var accessLevel$F = READ_WRITE;
    var isLoraOnly$F = false;
    var examples$E = {
      'simple response': {
        id: id$F,
        name: name$F,
        headerSize: headerSize$F,
        maxSize: maxSize$F,
        accessLevel: accessLevel$F,
        parameters: {},
        bytes: [0x2a, 0x00]
      }
    };
    var fromBytes$E = function fromBytes(bytes) {
      if (bytes.length !== maxSize$F) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$F = function toBytes() {
      return toBytes$2h(id$F);
    };

    var setSaldo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$F,
        examples: examples$E,
        fromBytes: fromBytes$E,
        headerSize: headerSize$F,
        id: id$F,
        isLoraOnly: isLoraOnly$F,
        maxSize: maxSize$F,
        name: name$F,
        toBytes: toBytes$F
    });

    var id$E = setSaldoParameters$3;
    var name$E = commandNames$1[setSaldoParameters$3];
    var headerSize$E = 2;
    var maxSize$E = 0;
    var accessLevel$E = READ_WRITE;
    var isLoraOnly$E = false;
    var examples$D = {
      'simple response': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        maxSize: maxSize$E,
        accessLevel: accessLevel$E,
        parameters: {},
        bytes: [0x2f, 0x00]
      }
    };
    var fromBytes$D = function fromBytes(bytes) {
      if (bytes.length !== maxSize$E) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$E = function toBytes() {
      return toBytes$2h(id$E);
    };

    var setSaldoParameters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$E,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$E,
        id: id$E,
        isLoraOnly: isLoraOnly$E,
        maxSize: maxSize$E,
        name: name$E,
        toBytes: toBytes$E
    });

    var id$D = setSeasonProfile$3;
    var name$D = commandNames$1[setSeasonProfile$3];
    var headerSize$D = 2;
    var maxSize$D = 0;
    var accessLevel$D = READ_WRITE;
    var isLoraOnly$D = false;
    var examples$C = {
      'simple response': {
        id: id$D,
        name: name$D,
        headerSize: headerSize$D,
        maxSize: maxSize$D,
        accessLevel: accessLevel$D,
        parameters: {},
        bytes: [0x11, 0x00]
      }
    };
    var fromBytes$C = function fromBytes(bytes) {
      if (bytes.length !== maxSize$D) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$D = function toBytes() {
      return toBytes$2h(id$D);
    };

    var setSeasonProfile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$D,
        examples: examples$C,
        fromBytes: fromBytes$C,
        headerSize: headerSize$D,
        id: id$D,
        isLoraOnly: isLoraOnly$D,
        maxSize: maxSize$D,
        name: name$D,
        toBytes: toBytes$D
    });

    var id$C = setSpecialDay$3;
    var name$C = commandNames$1[setSpecialDay$3];
    var headerSize$C = 2;
    var maxSize$C = 0;
    var accessLevel$C = READ_WRITE;
    var isLoraOnly$C = false;
    var examples$B = {
      'simple response': {
        id: id$C,
        name: name$C,
        headerSize: headerSize$C,
        maxSize: maxSize$C,
        accessLevel: accessLevel$C,
        parameters: {},
        bytes: [0x12, 0x00]
      }
    };
    var fromBytes$B = function fromBytes(bytes) {
      if (bytes.length !== maxSize$C) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$C = function toBytes() {
      return toBytes$2h(id$C);
    };

    var setSpecialDay = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$C,
        examples: examples$B,
        fromBytes: fromBytes$B,
        headerSize: headerSize$C,
        id: id$C,
        isLoraOnly: isLoraOnly$C,
        maxSize: maxSize$C,
        name: name$C,
        toBytes: toBytes$C
    });

    var id$B = setSpecialOperation$3;
    var name$B = commandNames$1[setSpecialOperation$3];
    var headerSize$B = 2;
    var maxSize$B = 1;
    var accessLevel$B = READ_WRITE;
    var isLoraOnly$B = false;
    var examples$A = {
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
        bytes: [0x64, 0x01, 0x01]
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
        bytes: [0x64, 0x01, 0x02]
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
        bytes: [0x64, 0x01, 0x03]
      }
    };
    var fromBytes$A = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$2(bytes);
      var flags = buffer.getUint8();
      var electroMagneticIndication = !!(flags & 1);
      var magneticIndication = !!(flags & 2);
      return {
        electroMagneticIndication: electroMagneticIndication,
        magneticIndication: magneticIndication
      };
    };
    var toBytes$B = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$B);
      var flags = 0;
      if (parameters.electroMagneticIndication) {
        flags |= 1;
      }
      if (parameters.magneticIndication) {
        flags |= 2;
      }
      buffer.setUint8(flags);
      return toBytes$2h(id$B, buffer.data);
    };

    var setSpecialOperation = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$B,
        examples: examples$A,
        fromBytes: fromBytes$A,
        headerSize: headerSize$B,
        id: id$B,
        isLoraOnly: isLoraOnly$B,
        maxSize: maxSize$B,
        name: name$B,
        toBytes: toBytes$B
    });

    var id$A = turnRelayOff$3;
    var name$A = commandNames$1[turnRelayOff$3];
    var headerSize$A = 2;
    var maxSize$A = 0;
    var accessLevel$A = READ_WRITE;
    var isLoraOnly$A = false;
    var examples$z = {
      'simple response': {
        id: id$A,
        name: name$A,
        headerSize: headerSize$A,
        maxSize: maxSize$A,
        accessLevel: accessLevel$A,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$z = function fromBytes(bytes) {
      if (bytes.length !== maxSize$A) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$A = function toBytes() {
      return toBytes$2h(id$A);
    };

    var turnRelayOff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$A,
        examples: examples$z,
        fromBytes: fromBytes$z,
        headerSize: headerSize$A,
        id: id$A,
        isLoraOnly: isLoraOnly$A,
        maxSize: maxSize$A,
        name: name$A,
        toBytes: toBytes$A
    });

    var id$z = turnRelayOn$3;
    var name$z = commandNames$1[turnRelayOn$3];
    var headerSize$z = 2;
    var maxSize$z = 0;
    var accessLevel$z = READ_WRITE;
    var isLoraOnly$z = false;
    var examples$y = {
      'simple response': {
        id: id$z,
        name: name$z,
        headerSize: headerSize$z,
        maxSize: maxSize$z,
        accessLevel: accessLevel$z,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$y = function fromBytes(bytes) {
      if (bytes.length !== maxSize$z) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$z = function toBytes() {
      return toBytes$2h(id$z);
    };

    var turnRelayOn = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$z,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$z,
        id: id$z,
        isLoraOnly: isLoraOnly$z,
        maxSize: maxSize$z,
        name: name$z,
        toBytes: toBytes$z
    });

    var id$y = errorResponse$2;
    var name$y = commandNames$1[errorResponse$2];
    var headerSize$y = 2;
    var accessLevel$y = READ_ONLY;
    var maxSize$y = 2;
    var isLoraOnly$y = false;
    var getFromBytes = function getFromBytes(commandNamesParameter) {
      return function (bytes) {
        var buffer = new CommandBinaryBuffer$2(bytes);
        var errorCommandId = buffer.getUint8();
        var errorCode = buffer.getUint8();
        return {
          commandId: errorCommandId,
          commandName: commandNamesParameter[errorCommandId],
          errorCode: errorCode,
          errorName: resultNames[errorCode]
        };
      };
    };
    var toBytes$y = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$2(maxSize$y);
      buffer.setUint8(parameters.commandId);
      buffer.setUint8(parameters.errorCode);
      return toBytes$2h(id$y, buffer.data);
    };

    var id$x = id$y,
      name$x = name$y,
      headerSize$x = headerSize$y,
      accessLevel$x = accessLevel$y,
      maxSize$x = maxSize$y,
      isLoraOnly$x = isLoraOnly$y,
      toBytes$x = toBytes$y;
    var examples$x = {
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
        bytes: [0xfe, 0x02, 0x54, 0x91]
      }
    };
    var fromBytes$x = getFromBytes(commandNames);

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

    var id$w = getCriticalEvent$2;
    var name$w = commandNames[getCriticalEvent$2];
    var headerSize$w = 2;
    var accessLevel$w = READ_ONLY;
    var maxSize$w = 9;
    var isLoraOnly$w = false;
    var examples$w = {
      'simple response': {
        id: id$w,
        name: name$w,
        headerSize: headerSize$w,
        accessLevel: accessLevel$w,
        maxSize: maxSize$w,
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
        bytes: [0x56, 0x09, 0x01, 0x01, 0x17, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07]
      }
    };
    var fromBytes$w = function fromBytes(bytes) {
      if (bytes.length !== maxSize$w) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var _bytes = _slicedToArray(bytes, 9),
        event = _bytes[0],
        index = _bytes[1],
        year = _bytes[2],
        month = _bytes[3],
        date = _bytes[4],
        hours = _bytes[5],
        minutes = _bytes[6],
        seconds = _bytes[7],
        count = _bytes[8];
      return {
        event: event,
        name: criticalEventNames[event],
        index: index,
        date: {
          year: year,
          month: month,
          date: date,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        },
        count: count
      };
    };
    var toBytes$w = function toBytes(parameters) {
      var event = parameters.event,
        index = parameters.index,
        date = parameters.date,
        count = parameters.count;
      return toBytes$2h(id$w, [event, index, date.year, date.month, date.date, date.hours, date.minutes, date.seconds, count]);
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

    var id$v = getCurrentStatusMeter$1;
    var name$v = commandNames[getCurrentStatusMeter$1];
    var headerSize$v = 2;
    var maxSize$v = 41;
    var accessLevel$v = READ_ONLY;
    var isLoraOnly$v = false;
    var examples$v = {
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
        bytes: [0x39, 0x29, 0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x00, 0x30, 0x39, 0x00, 0x01, 0x09, 0x32, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x01, 0x85, 0x01, 0x01, 0x01, 0x02, 0x03, 0x10, 0x01]
      }
    };
    var fromBytes$v = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var operatingSeconds = buffer.getUint32();
      var tbadVAAll = buffer.getUint32();
      var tbadVBAll = buffer.getUint32();
      var tbadVCAll = buffer.getUint32();
      var tbadIMAXAll = buffer.getUint32();
      var tbadPMAXAll = buffer.getUint32();
      buffer.getUint32();
      var tbadFREQ = buffer.getUint32();
      var relayStatus = !!(buffer.getUint8() & 1);
      var statusEvent1 = buffer.getUint8();
      var centerAlert = !!(buffer.getUint8() & 1);
      var calEnableFlag = !!(buffer.getUint8() & 1);
      var currentTariffs = {
        'A+': buffer.getUint8(),
        maximumPowers: buffer.getUint8(),
        'A-': buffer.getUint8()
      };
      var statusEvent2 = buffer.getUint8();
      var isSummerTime = !!(buffer.getUint8() & 1);
      var statusEventValue = statusEvent1 | statusEvent2 << 8;
      return {
        operatingSeconds: operatingSeconds,
        tbadVAAll: tbadVAAll,
        tbadVBAll: tbadVBAll,
        tbadVCAll: tbadVCAll,
        tbadIMAXAll: tbadIMAXAll,
        tbadPMAXAll: tbadPMAXAll,
        tbadFREQ: tbadFREQ,
        relayStatus: relayStatus,
        statusEvent: toObject(eventStatusMask, statusEventValue),
        centerAlert: centerAlert,
        calEnableFlag: calEnableFlag,
        currentTariffs: currentTariffs,
        isSummerTime: isSummerTime
      };
    };
    var toBytes$v = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$v);
      var statusEventValue = fromObject(eventStatusMask, parameters.statusEvent);
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
      buffer.setUint8(statusEventValue >> 8 & 0xff);
      buffer.setUint8(parameters.isSummerTime ? 1 : 0);
      return toBytes$2h(id$v, buffer.data);
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

    var defaultJsonOptions = _objectSpread2(_objectSpread2({}, defaultDlmsJsonOptions), {}, {
      isGreen: false
    });

    var id$u = getCurrentValues$1;
    var name$u = commandNames[getCurrentValues$1];
    var headerSize$u = 2;
    var accessLevel$u = READ_ONLY;
    var maxSize$u = 52;
    var isLoraOnly$u = false;
    var examples$u = {
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
        bytes: [0x0d, 0x34, 0x00, 0x03, 0x82, 0x70, 0x00, 0x03, 0x86, 0x58, 0x00, 0x03, 0x7e, 0x88, 0x00, 0x00, 0x13, 0x88, 0x00, 0x00, 0x13, 0x24, 0x00, 0x00, 0x13, 0xba, 0x00, 0x11, 0x8c, 0x30, 0x00, 0x11, 0x17, 0x00, 0x00, 0x11, 0xb3, 0x40, 0x00, 0x03, 0x0d, 0x40, 0x00, 0x02, 0xf9, 0xb8, 0x00, 0x03, 0x20, 0xc8, 0x00, 0x00, 0x05, 0xdc]
      }
    };
    var fromBytes$u = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
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
    var toBytes$u = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$u);
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
      return toBytes$2h(id$u, buffer.data);
    };
    var toJson$a = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var result = {
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
      var varAKey = parameters.varA >= 0 ? '1.23.7.0' : '1.24.7.0';
      var varBKey = parameters.varB >= 0 ? '1.43.7.0' : '1.44.7.0';
      var varCKey = parameters.varC >= 0 ? '1.63.7.0' : '1.64.7.0';
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
        toJson: toJson$a
    });

    var OBIS_BASES = {
      wh: _defineProperty(_defineProperty({}, A_PLUS_R_PLUS_R_MINUS, {
        gType: '1.8',
        rType: '1.8'
      }), A_MINUS_R_PLUS_R_MINUS, {
        gType: '2.8'
      }),
      vari: _defineProperty(_defineProperty({}, A_PLUS_R_PLUS_R_MINUS, {
        gType: '5.8',
        rType: '3.8'
      }), A_MINUS_R_PLUS_R_MINUS, {
        gType: '6.8'
      }),
      vare: _defineProperty(_defineProperty({}, A_PLUS_R_PLUS_R_MINUS, {
        gType: '8.8',
        rType: '4.8'
      }), A_MINUS_R_PLUS_R_MINUS, {
        gType: '7.8'
      })
    };
    var mapEnergiesToObisCodes = (function (energies, isGreen, energyType) {
      var result = {};
      Object.keys(energies).forEach(function (energyCategory) {
        var obisBase = isGreen ? OBIS_BASES[energyCategory][energyType].gType : OBIS_BASES[energyCategory][energyType].rType;
        energies[energyCategory].forEach(function (energy, index) {
          if (energy !== null && energy !== undefined) {
            result["".concat(obisBase, ".").concat(index + 1)] = energy;
          }
        });
      });
      return result;
    });

    var COMMAND_SIZE$1 = 51;
    var MAX_COMMAND_SIZE$2 = COMMAND_SIZE$1 + PACKED_ENERGY_TYPE_SIZE;
    var id$t = getDayDemand$2;
    var name$t = commandNames[getDayDemand$2];
    var headerSize$t = 2;
    var maxSize$t = MAX_COMMAND_SIZE$2;
    var accessLevel$t = READ_ONLY;
    var isLoraOnly$t = false;
    var examples$t = {
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
        bytes: [0x16, 0x33, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
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
        bytes: [0x16, 0x1c, 0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$t = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var parameters;
      if (bytes.length === COMMAND_SIZE$1) {
        parameters = {
          date: buffer.getDate(),
          energies: buffer.getEnergies()
        };
      } else {
        parameters = _objectSpread2({
          date: buffer.getDate()
        }, buffer.getPackedEnergyWithType());
      }
      return parameters;
    };
    var toBytes$t = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getPackedEnergiesWithDateSize(parameters));
      buffer.setDate(parameters.date);
      buffer.setPackedEnergyWithType(parameters);
      return toBytes$2h(id$t, buffer.data);
    };
    var toJson$9 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var date = parameters.date,
        energyType = parameters.energyType,
        energies = parameters.energies;
      return JSON.stringify(_objectSpread2({
        date: date
      }, mapEnergiesToObisCodes(energies, options.isGreen, energyType !== null && energyType !== void 0 ? energyType : A_PLUS_R_PLUS_R_MINUS)));
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
        toJson: toJson$9
    });

    var isGreen$3 = true;
    var id$s = getDayDemandExport$2;
    var name$s = commandNames[getDayDemandExport$2];
    var headerSize$s = 2;
    var maxSize$s = 51;
    var accessLevel$s = READ_ONLY;
    var isLoraOnly$s = false;
    var examples$s = {
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
        bytes: [0x4f, 0x33, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$s = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        date: buffer.getDate(),
        energies: buffer.getEnergies()
      };
    };
    var toBytes$s = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$s);
      buffer.setDate(parameters.date);
      buffer.setEnergies(parameters.energies);
      return toBytes$2h(id$s, buffer.data);
    };
    var toJson$8 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var date = parameters.date,
        energies = parameters.energies;
      return JSON.stringify(_objectSpread2({
        date: date
      }, mapEnergiesToObisCodes(energies, isGreen$3, A_MINUS_R_PLUS_R_MINUS)));
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
        toJson: toJson$8
    });

    var id$r = getDayMaxDemand$1;
    var name$r = commandNames[getDayMaxDemand$1];
    var headerSize$r = 2;
    var accessLevel$r = READ_ONLY;
    var maxSize$r = 75;
    var isLoraOnly$r = false;
    var examples$r = {
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
          maxDemands: [{
            hourPmax: 0,
            minPmax: 10,
            pmax: 100,
            hourVariMax: 1,
            minVariMax: 23,
            variMax: 2000,
            hourVareMax: 8,
            minVareMax: 15,
            vareMax: 5555
          }, {
            hourPmax: 2,
            minPmax: 20,
            pmax: 1000,
            hourVariMax: 3,
            minVariMax: 24,
            variMax: 20000,
            hourVareMax: 9,
            minVareMax: 16,
            vareMax: 55555
          }, {
            hourPmax: 4,
            minPmax: 30,
            pmax: 10000,
            hourVariMax: 5,
            minVariMax: 25,
            variMax: 200000,
            hourVareMax: 10,
            minVareMax: 17,
            vareMax: 555555
          }, {
            hourPmax: 6,
            minPmax: 40,
            pmax: 100000,
            hourVariMax: 7,
            minVariMax: 26,
            variMax: 2000000,
            hourVareMax: 11,
            minVareMax: 18,
            vareMax: 5555555
          }]
        },
        bytes: [0x31, 0x4b, 0x17, 0x03, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3, 0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03, 0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23, 0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63]
      }
    };
    var fromBytes$r = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getDayMaxDemandResponse();
    };
    var toBytes$r = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$r);
      buffer.setDayMaxDemandResponse(parameters);
      return toBytes$2h(id$r, buffer.getBytesToOffset());
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

    var id$q = getDayMaxDemandExport$1;
    var name$q = commandNames[getDayMaxDemandExport$1];
    var headerSize$q = 2;
    var accessLevel$q = READ_ONLY;
    var maxSize$q = 75;
    var isLoraOnly$q = false;
    var examples$q = {
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
          maxDemands: [{
            hourPmax: 0,
            minPmax: 10,
            pmax: 100,
            hourVariMax: 1,
            minVariMax: 23,
            variMax: 2000,
            hourVareMax: 8,
            minVareMax: 15,
            vareMax: 5555
          }, {
            hourPmax: 2,
            minPmax: 20,
            pmax: 1000,
            hourVariMax: 3,
            minVariMax: 24,
            variMax: 20000,
            hourVareMax: 9,
            minVareMax: 16,
            vareMax: 55555
          }, {
            hourPmax: 4,
            minPmax: 30,
            pmax: 10000,
            hourVariMax: 5,
            minVariMax: 25,
            variMax: 200000,
            hourVareMax: 10,
            minVareMax: 17,
            vareMax: 555555
          }, {
            hourPmax: 6,
            minPmax: 40,
            pmax: 100000,
            hourVariMax: 7,
            minVariMax: 26,
            variMax: 2000000,
            hourVareMax: 11,
            minVareMax: 18,
            vareMax: 5555555
          }]
        },
        bytes: [0x58, 0x4b, 0x17, 0x03, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3, 0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03, 0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23, 0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63]
      }
    };
    var fromBytes$q = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getDayMaxDemandResponse();
    };
    var toBytes$q = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$q);
      buffer.setDayMaxDemandResponse(parameters);
      return toBytes$2h(id$q, buffer.getBytesToOffset());
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

    var id$p = getDemand$2;
    var name$p = commandNames[getDemand$2];
    var headerSize$p = 2;
    var maxSize$p = maxSize$1s + 48 * 2;
    var accessLevel$p = READ_ONLY;
    var isLoraOnly$p = false;
    var examples$p = {
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
        bytes: [0x76, 0x0b, 0x2a, 0xd2, 0x81, 0x00, 0x00, 0x02, 0x1e, 0x07, 0xd0, 0xab, 0xcd]
      }
    };
    var fromBytes$p = function fromBytes(bytes) {
      if (!bytes || bytes.length < maxSize$1s) {
        throw new Error('Invalid uplink GetDemand byte length.');
      }
      var buffer = new CommandBinaryBuffer(bytes);
      var parameters = buffer.getDemand();
      if (bytes.length !== maxSize$1s + 2 * parameters.count) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
      }
      var demands = new Array(parameters.count).fill(0).map(function () {
        return buffer.getUint16();
      });
      return _objectSpread2(_objectSpread2({}, parameters), {}, {
        demands: demands
      });
    };
    var toBytes$p = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$1s + parameters.count * 2);
      buffer.setDemand(parameters);
      parameters.demands.forEach(function (value) {
        return buffer.setUint16(value);
      });
      return toBytes$2h(id$p, buffer.data);
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

    var id$o = getDisplayParam$2;
    var name$o = commandNames[getDisplayParam$2];
    var headerSize$o = 2;
    var maxSize$o = 65;
    var accessLevel$o = READ_ONLY;
    var isLoraOnly$o = false;
    var examples$o = {
      'mode with order': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
        maxSize: maxSize$o,
        accessLevel: accessLevel$o,
        parameters: {
          displayMode: MAIN_1,
          order: [4, 5, 6, 7]
        },
        bytes: [0x5e, 0x05, 0x00, 0x04, 0x05, 0x06, 0x07]
      },
      'mode without order': {
        id: id$o,
        name: name$o,
        maxSize: maxSize$o,
        accessLevel: accessLevel$o,
        parameters: {
          displayMode: MAIN_2,
          order: []
        },
        bytes: [0x5e, 0x01, 0x01]
      }
    };
    var fromBytes$o = function fromBytes(bytes) {
      var _bytes = _toArray(bytes),
        displayMode = _bytes[0],
        order = _bytes.slice(1);
      return {
        displayMode: displayMode,
        order: order
      };
    };
    var toBytes$o = function toBytes(parameters) {
      return toBytes$2h(id$o, [parameters.displayMode].concat(_toConsumableArray(parameters.order)));
    };

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

    var id$n = getEnergy$2;
    var name$n = commandNames[getEnergy$2];
    var headerSize$n = 2;
    var accessLevel$n = READ_ONLY;
    var maxSize$n = 48;
    var isLoraOnly$n = false;
    var examples$n = {
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
        bytes: [0x0f, 0x30, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$n = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getEnergies();
    };
    var toBytes$n = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$n);
      buffer.setEnergies(parameters);
      return toBytes$2h(id$n, buffer.data);
    };
    var toJson$7 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      return options.dlms ? JSON.stringify(mapEnergiesToObisCodes(parameters, options.isGreen, A_PLUS_R_PLUS_R_MINUS)) : JSON.stringify(parameters);
    };

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
        toJson: toJson$7
    });

    var COMMAND_SIZE = 51;
    var MAX_COMMAND_SIZE$1 = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;
    var id$m = getEnergyDayPrevious$2;
    var name$m = commandNames[getEnergyDayPrevious$2];
    var headerSize$m = 2;
    var maxSize$m = MAX_COMMAND_SIZE$1;
    var accessLevel$m = READ_ONLY;
    var isLoraOnly$m = false;
    var examples$m = {
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
        bytes: [0x03, 0x33, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
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
        bytes: [0x03, 0x1c, 0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$m = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var parameters;
      if (bytes.length === COMMAND_SIZE) {
        parameters = {
          date: buffer.getDate(),
          energies: buffer.getEnergies()
        };
      } else {
        parameters = _objectSpread2({
          date: buffer.getDate()
        }, buffer.getPackedEnergyWithType());
      }
      return parameters;
    };
    var toBytes$m = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(getPackedEnergiesWithDateSize(parameters));
      buffer.setDate(parameters.date);
      buffer.setPackedEnergyWithType(parameters);
      return toBytes$2h(id$m, buffer.data);
    };
    var toJson$6 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var date = parameters.date,
        energyType = parameters.energyType,
        energies = parameters.energies;
      return JSON.stringify(_objectSpread2({
        date: date
      }, mapEnergiesToObisCodes(energies, options.isGreen, energyType !== null && energyType !== void 0 ? energyType : A_PLUS_R_PLUS_R_MINUS)));
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
        toJson: toJson$6
    });

    var isGreen$2 = true;
    var id$l = getEnergyExport$2;
    var name$l = commandNames[getEnergyExport$2];
    var headerSize$l = 2;
    var accessLevel$l = READ_ONLY;
    var maxSize$l = 48;
    var isLoraOnly$l = false;
    var examples$l = {
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
        bytes: [0x4e, 0x30, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$l = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getEnergies();
    };
    var toBytes$l = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$l);
      buffer.setEnergies(parameters);
      return toBytes$2h(id$l, buffer.data);
    };
    var toJson$5 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
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
        toJson: toJson$5
    });

    var isGreen$1 = true;
    var id$k = getEnergyExportDayPrevious$2;
    var name$k = commandNames[getEnergyExportDayPrevious$2];
    var headerSize$k = 2;
    var maxSize$k = 48;
    var accessLevel$k = READ_ONLY;
    var isLoraOnly$k = false;
    var examples$k = {
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
        bytes: [0x50, 0x30, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$k = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getEnergies();
    };
    var toBytes$k = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$k);
      buffer.setEnergies(parameters);
      return toBytes$2h(id$k, buffer.data);
    };
    var toJson$4 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
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
        toJson: toJson$4
    });

    var id$j = getExtendedCurrentValues$1;
    var name$j = commandNames[getExtendedCurrentValues$1];
    var headerSize$j = 2;
    var maxSize$j = 38;
    var accessLevel$j = READ_ONLY;
    var isLoraOnly$j = false;
    var examples$j = {
      'simple response': {
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
        maxSize: maxSize$j,
        accessLevel: accessLevel$j,
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
        bytes: [0x3a, 0x26, 0x00, 0x43, 0x00, 0x3c, 0x00, 0x00, 0x00, 0x1e, 0x00, 0x00, 0x00, 0x2d, 0x01, 0xf4, 0xfe, 0x0c, 0x03, 0xe8, 0x03, 0xb6, 0x00, 0x00, 0x13, 0x88, 0x00, 0x00, 0x11, 0x94, 0x00, 0x00, 0x12, 0xc0, 0x00, 0x00, 0x37, 0xdc, 0x01, 0x52]
      }
    };
    var fromBytes$j = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
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
    var toBytes$j = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$j);
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
      return toBytes$2h(id$j, buffer.data);
    };
    var toJson$3 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var result = {
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
        accessLevel: accessLevel$j,
        examples: examples$j,
        fromBytes: fromBytes$j,
        headerSize: headerSize$j,
        id: id$j,
        isLoraOnly: isLoraOnly$j,
        maxSize: maxSize$j,
        name: name$j,
        toBytes: toBytes$j,
        toJson: toJson$3
    });

    var id$i = getHalfHourDemand$1;
    var name$i = commandNames[getHalfHourDemand$1];
    var headerSize$i = 2;
    var maxSize$i = MIN_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$i = READ_ONLY;
    var isLoraOnly$i = false;
    var examples$i = {
      'simple response': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        maxSize: maxSize$i,
        accessLevel: accessLevel$i,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x15, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
      },
      'response for day when DST start/end': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        maxSize: maxSize$i,
        accessLevel: accessLevel$i,
        parameters: {
          date: {
            year: 24,
            month: 2,
            date: 31
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x15, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$i = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$i = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$i, buffer.data);
    };

    var getHalfHourDemand = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE = MIN_HALF_HOUR_COMMAND_SIZE + 2;
    var MAX_COMMAND_SIZE = MAX_HALF_HOUR_COMMAND_SIZE + 2;
    var id$h = getHalfHourDemandChannel$2;
    var name$h = commandNames[getHalfHourDemandChannel$2];
    var headerSize$h = 2;
    var maxSize$h = MIN_COMMAND_SIZE;
    var accessLevel$h = READ_ONLY;
    var isLoraOnly$h = false;
    var examples$h = {
      'simple response': {
        id: id$h,
        name: name$h,
        headerSize: headerSize$h,
        maxSize: maxSize$h,
        accessLevel: accessLevel$h,
        parameters: {
          channel: 1,
          loadProfile: 16,
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x5a, 0x65, 0x01, 0x10, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
      },
      'response for day when DST start/end': {
        id: id$h,
        name: name$h,
        headerSize: headerSize$h,
        maxSize: maxSize$h,
        accessLevel: accessLevel$h,
        parameters: {
          channel: 1,
          loadProfile: 16,
          date: {
            year: 24,
            month: 2,
            date: 31
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x5a, 0x6a, 0x01, 0x10, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$h = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_COMMAND_SIZE;
      var channel = buffer.getUint8();
      var loadProfile = buffer.getUint8();
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          channel: channel,
          loadProfile: loadProfile,
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        channel: channel,
        loadProfile: loadProfile,
        date: date,
        energies: energies
      };
    };
    var toBytes$h = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setUint8(parameters.channel);
      buffer.setUint8(parameters.loadProfile);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$h, buffer.data);
    };

    var getHalfHourDemandChannel = /*#__PURE__*/Object.freeze({
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

    var id$g = getHalfHourDemandExport$1;
    var name$g = commandNames[getHalfHourDemandExport$1];
    var headerSize$g = 2;
    var maxSize$g = MAX_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$g = READ_ONLY;
    var isLoraOnly$g = false;
    var examples$g = {
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x53, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x53, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$g = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$g = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$g, buffer.data);
    };

    var getHalfHourDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$f = getHalfHourDemandVare$2;
    var name$f = commandNames[getHalfHourDemandVare$2];
    var headerSize$f = 2;
    var maxSize$f = MIN_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$f = READ_ONLY;
    var isLoraOnly$f = false;
    var examples$f = {
      'simple response': {
        id: id$f,
        name: name$f,
        headerSize: headerSize$f,
        maxSize: maxSize$f,
        accessLevel: accessLevel$f,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x49, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
      },
      'response for day when DST start/end': {
        id: id$f,
        name: name$f,
        headerSize: headerSize$f,
        maxSize: maxSize$f,
        accessLevel: accessLevel$f,
        parameters: {
          date: {
            year: 24,
            month: 2,
            date: 31
          },
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x49, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$f = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$f = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$f, buffer.data);
    };

    var getHalfHourDemandVare = /*#__PURE__*/Object.freeze({
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

    var id$e = getHalfHourDemandVareExport$2;
    var name$e = commandNames[getHalfHourDemandVareExport$2];
    var headerSize$e = 2;
    var maxSize$e = MIN_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$e = READ_ONLY;
    var isLoraOnly$e = false;
    var examples$e = {
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x55, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x55, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$e = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$e = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$e, buffer.data);
    };

    var getHalfHourDemandVareExport = /*#__PURE__*/Object.freeze({
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

    var id$d = getHalfHourDemandVari$2;
    var name$d = commandNames[getHalfHourDemandVari$2];
    var headerSize$d = 2;
    var maxSize$d = MIN_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$d = READ_ONLY;
    var isLoraOnly$d = false;
    var examples$d = {
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x48, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x48, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$d = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$d = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$d, buffer.data);
    };

    var getHalfHourDemandVari = /*#__PURE__*/Object.freeze({
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

    var id$c = getHalfHourDemandVariExport$2;
    var name$c = commandNames[getHalfHourDemandVariExport$2];
    var headerSize$c = 2;
    var maxSize$c = MIN_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$c = READ_ONLY;
    var isLoraOnly$c = false;
    var examples$c = {
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999]
        },
        bytes: [0x54, 0x63, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f]
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
          energies: [1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000, 2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000, 3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000, 4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000, 5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111],
          dstHour: 3
        },
        bytes: [0x54, 0x68, 0x18, 0x02, 0x1f, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f, 0x17, 0x70, 0x17, 0xdf, 0x03]
      }
    };
    var fromBytes$c = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = buffer.getDate();
      var energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          energies: energies,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        energies: energies
      };
    };
    var toBytes$c = function toBytes(parameters) {
      var size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
      var buffer = new CommandBinaryBuffer(size);
      buffer.setDate(parameters.date);
      buffer.setEnergyPeriods(parameters.energies);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$2h(id$c, buffer.data);
    };

    var getHalfHourDemandVariExport = /*#__PURE__*/Object.freeze({
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

    var DATE_SIZE = 2;
    var ENERGY_FLAGS_SIZE = 1;
    var START_HALFHOUR_SIZE = 1;
    var HALFHOURS_NUMBER_SIZE = 1;
    var MAX_HALFHOURS_ENERGY_SIZE = 247;
    var energiesToObis = {
      'A+': '1.5.x',
      'A+R+': '3.5.x',
      'A+R-': '4.5.x',
      'A-': '2.5.x',
      'A-R+': '6.5.x',
      'A-R-': '7.5.x'
    };
    var convertEnergyToObis = function convertEnergyToObis(energy) {
      var tariff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var obis = energiesToObis[energy];
      return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    var convertHalfHourEnergiesToDlms = function convertHalfHourEnergiesToDlms(energies) {
      var dlms = {};
      Object.keys(energies).forEach(function (energy) {
        var values = energies[energy];
        for (var tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
          var value = values[tariff];
          if (value || value === 0) {
            dlms[convertEnergyToObis(energy, tariff + 1)] = value;
          }
        }
      });
      return dlms;
    };
    var id$b = getHalfHourEnergies$3;
    var name$b = commandNames$1[getHalfHourEnergies$3];
    var headerSize$b = 2;
    var maxSize$b = DATE_SIZE + ENERGY_FLAGS_SIZE + START_HALFHOUR_SIZE + HALFHOURS_NUMBER_SIZE + MAX_HALFHOURS_ENERGY_SIZE;
    var accessLevel$b = UNENCRYPTED;
    var isLoraOnly$b = true;
    var toJson$2 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var date = parameters.date,
        firstHalfhour = parameters.firstHalfhour,
        halfhoursNumber = parameters.halfhoursNumber,
        energies = parameters.energies;
      var result = dlms ? _objectSpread2({
        date: date,
        firstHalfhour: firstHalfhour,
        halfhoursNumber: halfhoursNumber
      }, convertHalfHourEnergiesToDlms(energies)) : parameters;
      return JSON.stringify(result);
    };

    var examples$b = {
      'get halfhours energies': {
        id: id$b,
        headerSize: headerSize$b,
        name: name$b,
        maxSize: maxSize$b,
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
        bytes: [0x6f, 0x0d, 0x2a, 0x43, 0x11, 0x01, 0x02, 0x10, 0x00, 0x20, 0x00, 0x30, 0x00, 0x40, 0x00]
      }
    };
    var fromBytes$b = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer$1(bytes);
      var date = buffer.getDate();
      var energiesFlags = buffer.getEnergiesFlags();
      var firstHalfhour = buffer.getUint8();
      var halfhoursNumber = buffer.getUint8();
      return {
        date: date,
        firstHalfhour: firstHalfhour,
        halfhoursNumber: halfhoursNumber,
        energies: buffer.getHalfHourEnergies3(energiesFlags, halfhoursNumber)
      };
    };
    var toBytes$b = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer$1(maxSize$b);
      var date = parameters.date,
        firstHalfhour = parameters.firstHalfhour,
        halfhoursNumber = parameters.halfhoursNumber,
        energies = parameters.energies;
      buffer.setDate(date);
      buffer.setEnergiesFlags(energies);
      buffer.setUint8(firstHalfhour);
      buffer.setUint8(halfhoursNumber);
      buffer.setHalfHourEnergies3(energies);
      return toBytes$2h(id$b, buffer.getBytesToOffset());
    };

    var getHalfHourEnergies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$b,
        examples: examples$b,
        fromBytes: fromBytes$b,
        headerSize: headerSize$b,
        id: id$b,
        isLoraOnly: isLoraOnly$b,
        maxSize: maxSize$b,
        name: name$b,
        toBytes: toBytes$b,
        toJson: toJson$2
    });

    var id$a = getMonthDemand$1;
    var name$a = commandNames[getMonthDemand$1];
    var headerSize$a = 2;
    var accessLevel$a = READ_ONLY;
    var maxSize$a = 50;
    var isLoraOnly$a = false;
    var examples$a = {
      'response energy for 2024.03': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        maxSize: maxSize$a,
        accessLevel: accessLevel$a,
        parameters: {
          year: 24,
          month: 3,
          energies: {
            wh: [40301230, 3334244, 15000, 2145623],
            vari: [25000, 1234567, 789456, 9876543],
            vare: [987654, 654321, 123456, 789012]
          }
        },
        bytes: [0x17, 0x32, 0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$a = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        energies: buffer.getEnergies()
      };
    };
    var toBytes$a = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$a);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      buffer.setEnergies(parameters.energies);
      return toBytes$2h(id$a, buffer.data);
    };
    var toJson$1 = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var year = parameters.year,
        month = parameters.month,
        energies = parameters.energies;
      return JSON.stringify(_objectSpread2({
        year: year,
        month: month
      }, mapEnergiesToObisCodes(energies, options.isGreen, A_PLUS_R_PLUS_R_MINUS)));
    };

    var getMonthDemand = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$a,
        examples: examples$a,
        fromBytes: fromBytes$a,
        headerSize: headerSize$a,
        id: id$a,
        isLoraOnly: isLoraOnly$a,
        maxSize: maxSize$a,
        name: name$a,
        toBytes: toBytes$a,
        toJson: toJson$1
    });

    var isGreen = true;
    var id$9 = getMonthDemandExport$1;
    var name$9 = commandNames[getMonthDemandExport$1];
    var headerSize$9 = 2;
    var maxSize$9 = 50;
    var accessLevel$9 = READ_ONLY;
    var isLoraOnly$9 = false;
    var examples$9 = {
      'simple response': {
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
        bytes: [0x52, 0x32, 0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14]
      }
    };
    var fromBytes$9 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        energies: buffer.getEnergies()
      };
    };
    var toBytes$9 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$9);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      buffer.setEnergies(parameters.energies);
      return toBytes$2h(id$9, buffer.data);
    };
    var toJson = function toJson(parameters) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultJsonOptions;
      if (!options.dlms) {
        return JSON.stringify(parameters);
      }
      var year = parameters.year,
        month = parameters.month,
        energies = parameters.energies;
      return JSON.stringify(_objectSpread2({
        year: year,
        month: month
      }, mapEnergiesToObisCodes(energies, isGreen, A_MINUS_R_PLUS_R_MINUS)));
    };

    var getMonthDemandExport = /*#__PURE__*/Object.freeze({
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
        toJson: toJson
    });

    var id$8 = getMonthMaxDemand$1;
    var name$8 = commandNames[getMonthMaxDemand$1];
    var headerSize$8 = 2;
    var accessLevel$8 = READ_ONLY;
    var maxSize$8 = 74;
    var isLoraOnly$8 = false;
    var examples$8 = {
      'response for 2023.03': {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
        accessLevel: accessLevel$8,
        maxSize: maxSize$8,
        parameters: {
          date: {
            year: 23,
            month: 3
          },
          maxDemands: [{
            hourPmax: 0,
            minPmax: 10,
            pmax: 100,
            hourVariMax: 1,
            minVariMax: 23,
            variMax: 2000,
            hourVareMax: 8,
            minVareMax: 15,
            vareMax: 5555
          }, {
            hourPmax: 2,
            minPmax: 20,
            pmax: 1000,
            hourVariMax: 3,
            minVariMax: 24,
            variMax: 20000,
            hourVareMax: 9,
            minVareMax: 16,
            vareMax: 55555
          }, {
            hourPmax: 4,
            minPmax: 30,
            pmax: 10000,
            hourVariMax: 5,
            minVariMax: 25,
            variMax: 200000,
            hourVareMax: 10,
            minVareMax: 17,
            vareMax: 555555
          }, {
            hourPmax: 6,
            minPmax: 40,
            pmax: 100000,
            hourVariMax: 7,
            minVariMax: 26,
            variMax: 2000000,
            hourVareMax: 11,
            minVareMax: 18,
            vareMax: 5555555
          }]
        },
        bytes: [0x32, 0x4a, 0x17, 0x03, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3, 0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03, 0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23, 0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63]
      }
    };
    var fromBytes$8 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getMonthMaxDemandResponse();
    };
    var toBytes$8 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$8);
      buffer.setMonthMaxDemandResponse(parameters);
      return toBytes$2h(id$8, buffer.getBytesToOffset());
    };

    var getMonthMaxDemand = /*#__PURE__*/Object.freeze({
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

    var id$7 = getMonthMaxDemandExport$1;
    var name$7 = commandNames[getMonthMaxDemandExport$1];
    var headerSize$7 = 2;
    var accessLevel$7 = READ_ONLY;
    var maxSize$7 = 74;
    var isLoraOnly$7 = false;
    var examples$7 = {
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
          maxDemands: [{
            hourPmax: 0,
            minPmax: 10,
            pmax: 100,
            hourVariMax: 1,
            minVariMax: 23,
            variMax: 2000,
            hourVareMax: 8,
            minVareMax: 15,
            vareMax: 5555
          }, {
            hourPmax: 2,
            minPmax: 20,
            pmax: 1000,
            hourVariMax: 3,
            minVariMax: 24,
            variMax: 20000,
            hourVareMax: 9,
            minVareMax: 16,
            vareMax: 55555
          }, {
            hourPmax: 4,
            minPmax: 30,
            pmax: 10000,
            hourVariMax: 5,
            minVariMax: 25,
            variMax: 200000,
            hourVareMax: 10,
            minVareMax: 17,
            vareMax: 555555
          }, {
            hourPmax: 6,
            minPmax: 40,
            pmax: 100000,
            hourVariMax: 7,
            minVariMax: 26,
            variMax: 2000000,
            hourVareMax: 11,
            minVareMax: 18,
            vareMax: 5555555
          }]
        },
        bytes: [0x59, 0x4a, 0x17, 0x03, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x64, 0x01, 0x17, 0x00, 0x00, 0x07, 0xd0, 0x08, 0x0f, 0x00, 0x00, 0x15, 0xb3, 0x02, 0x14, 0x00, 0x00, 0x03, 0xe8, 0x03, 0x18, 0x00, 0x00, 0x4e, 0x20, 0x09, 0x10, 0x00, 0x00, 0xd9, 0x03, 0x04, 0x1e, 0x00, 0x00, 0x27, 0x10, 0x05, 0x19, 0x00, 0x03, 0x0d, 0x40, 0x0a, 0x11, 0x00, 0x08, 0x7a, 0x23, 0x06, 0x28, 0x00, 0x01, 0x86, 0xa0, 0x07, 0x1a, 0x00, 0x1e, 0x84, 0x80, 0x0b, 0x12, 0x00, 0x54, 0xc5, 0x63]
      }
    };
    var fromBytes$7 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getMonthMaxDemandResponse();
    };
    var toBytes$7 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$7);
      buffer.setMonthMaxDemandResponse(parameters);
      return toBytes$2h(id$7, buffer.getBytesToOffset());
    };

    var getMonthMaxDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$6 = getOperatorParameters$1;
    var name$6 = commandNames[getOperatorParameters$1];
    var headerSize$6 = 2;
    var maxSize$6 = OPERATOR_PARAMETERS_SIZE;
    var accessLevel$6 = READ_ONLY;
    var isLoraOnly$6 = false;
    var examples$6 = {
      'get default operator parameters response': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
        maxSize: maxSize$6,
        accessLevel: accessLevel$6,
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
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: true,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: true,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: true,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
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
            RELAY_ON_TARIFF_1: false,
            RELAY_ON_TARIFF_2: false,
            RELAY_ON_TARIFF_3: false,
            RELAY_ON_TARIFF_4: false,
            RELAY_ON_V_GOOD: false,
            RELAY_OFF_Y: true,
            RELAY_OFF_CENTER: true,
            RELAY_OFF_TARIFF_1: false,
            RELAY_OFF_TARIFF_2: false,
            RELAY_OFF_TARIFF_3: false,
            RELAY_OFF_TARIFF_4: false,
            RELAY_OFF_I_LIMIT: false,
            RELAY_OFF_V_BAD: false,
            RELAY_OFF_DIFF_CURRENT_BAD: false,
            RELAY_OFF_LIM_TARIFF_1: false,
            RELAY_OFF_LIM_TARIFF_2: false,
            RELAY_OFF_LIM_TARIFF_3: false,
            RELAY_OFF_LIM_TARIFF_4: false,
            RELAY_OFF_LIM_VAR_TARIFF_1: false,
            RELAY_OFF_LIM_VAR_TARIFF_2: false,
            RELAY_OFF_LIM_VAR_TARIFF_3: false,
            RELAY_OFF_LIM_VAR_TARIFF_4: false,
            RELAY_ON_PF_MIN: false,
            RELAY_OFF_PF_MIN: false,
            RELAY_ON_TIMEOUT: false,
            RELAY_ON_SALDO: false,
            RELAY_OFF_SALDO: false,
            RELAY_OFF_SALDO_SOFT: false
          },
          speedOptoPort: {
            plc: 9600,
            optoport: 9600
          },
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
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: true,
            DATE_MONTH_YEAR: true,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            SORT_DISPLAY_SCREENS: false,
            AUTO_SCREEN_SCROLLING: true
          }
        },
        bytes: [0x1e, 0x5f, 0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x1e, 0x01, 0x7f, 0x07, 0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03, 0x44, 0x1e, 0x1e, 0x03, 0x00, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x05, 0x05, 0x01, 0x80, 0x06, 0x00, 0x00]
      }
    };
    var fromBytes$6 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParameters();
    };
    var toBytes$6 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$6);
      buffer.setOperatorParameters(parameters);
      return toBytes$2h(id$6, buffer.data);
    };

    var getOperatorParameters = /*#__PURE__*/Object.freeze({
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

    var id$5 = getOperatorParametersExtended$2;
    var name$5 = commandNames[getOperatorParametersExtended$2];
    var headerSize$5 = 2;
    var maxSize$5 = OPERATOR_PARAMETERS_EXTENDED_SIZE;
    var accessLevel$5 = READ_ONLY;
    var isLoraOnly$5 = false;
    var examples$5 = {
      'simple response': {
        id: id$5,
        name: name$5,
        headerSize: headerSize$5,
        maxSize: maxSize$5,
        accessLevel: accessLevel$5,
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
        bytes: [0x3f, 0x09, 0x01, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00]
      }
    };
    var fromBytes$5 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended();
    };
    var toBytes$5 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$5);
      buffer.setOperatorParametersExtended(parameters);
      return toBytes$2h(id$5, buffer.data);
    };

    var getOperatorParametersExtended = /*#__PURE__*/Object.freeze({
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

    var id$4 = getOperatorParametersExtended2$2;
    var name$4 = commandNames[getOperatorParametersExtended2$2];
    var headerSize$4 = 2;
    var maxSize$4 = OPERATOR_PARAMETERS_EXTENDED2_SIZE;
    var accessLevel$4 = READ_ONLY;
    var isLoraOnly$4 = false;
    var examples$4 = {
      'simple response': {
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
        maxSize: maxSize$4,
        accessLevel: accessLevel$4,
        parameters: {
          deltaCorMin: 15,
          timeoutMagnetOff: 5,
          relaySetExt: {
            RELAY_OFF_MAGNET: true,
            RELAY_ON_MAGNET_TIMEOUT: false,
            RELAY_ON_MAGNET_AUTO: true
          },
          timeoutMagnetOn: 5,
          defaultPlcPhase: 1,
          displaySet21: {
            SET_ALL_SEGMENT_DISPLAY: false,
            SOFTWARE_VERSION: false,
            TOTAL_ACTIVE_ENERGY: false,
            ACTIVE_ENERGY_T1: false,
            ACTIVE_ENERGY_T2: false,
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
          displaySet22: {
            CURRENT_IN_PHASE_A: false,
            CURRENT_IN_PHASE_B: false,
            CURRENT_IN_PHASE_C: false,
            CURRENT_IN_NEUTRAL: false,
            VOLTAGE_IN_PHASE_A: false,
            VOLTAGE_IN_PHASE_B: false,
            VOLTAGE_IN_PHASE_C: false,
            BATTERY_VOLTAGE: false,
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: false,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: false,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: false,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
            APPARENT_POWER_QMINUS_PHASE_A: false,
            APPARENT_POWER_QMINUS_PHASE_B: false
          },
          displaySet23: {
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
          displaySet24: {
            MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: false,
            DATE_MONTH_YEAR: false,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            OPTOPORT_SPEED: true,
            MAGNET_INDUCTION: false
          },
          channel1: 1,
          channel2: 2,
          channel3: 3,
          channel4: 4,
          channel5: 5,
          channel6: 6,
          timeCorrectPeriod: 24,
          timeCorrectPassHalfhour: true
        },
        bytes: [0x47, 0x1c, 0x0f, 0x05, 0x05, 0x05, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x98]
      }
    };
    var fromBytes$4 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended2();
    };
    var toBytes$4 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$4);
      buffer.setOperatorParametersExtended2(parameters);
      return toBytes$2h(id$4, buffer.data);
    };

    var getOperatorParametersExtended2 = /*#__PURE__*/Object.freeze({
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

    var id$3 = getOperatorParametersExtended4$2;
    var name$3 = commandNames[getOperatorParametersExtended4$2];
    var headerSize$3 = 2;
    var maxSize$3 = OPERATOR_PARAMETERS_EXTENDED4_SIZE;
    var accessLevel$3 = READ_ONLY;
    var isLoraOnly$3 = false;
    var examples$3 = {
      'simple response': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        maxSize: maxSize$3,
        accessLevel: accessLevel$3,
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
          displaySet32: {
            CURRENT_IN_PHASE_A: false,
            CURRENT_IN_PHASE_B: false,
            CURRENT_IN_PHASE_C: false,
            CURRENT_IN_NEUTRAL: false,
            VOLTAGE_IN_PHASE_A: false,
            VOLTAGE_IN_PHASE_B: false,
            VOLTAGE_IN_PHASE_C: false,
            BATTERY_VOLTAGE: false,
            SUPPLY_FREQUENCY: false,
            TOTAL_ACTIVE_POWER: true,
            ACTIVE_POWER_PHASE_A: false,
            ACTIVE_POWER_PHASE_B: false,
            ACTIVE_POWER_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QPLUS: true,
            REACTIVE_POWER_QPLUS_PHASE_A: false,
            REACTIVE_POWER_QPLUS_PHASE_B: false,
            REACTIVE_POWER_QPLUS_PHASE_C: false,
            TOTAL_REACTIVE_POWER_QMINUS: true,
            REACTIVE_POWER_QMINUS_PHASE_A: false,
            REACTIVE_POWER_QMINUS_PHASE_B: false,
            REACTIVE_POWER_QMINUS_PHASE_C: false,
            TOTAL_POWER_FACTOR: false,
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
            POWER_FACTOR_PHASE_C: false,
            TOTAL_APPARENT_POWER_QPLUS: false,
            APPARENT_POWER_QPLUS_PHASE_A: false,
            APPARENT_POWER_QPLUS_PHASE_B: false,
            APPARENT_POWER_QPLUS_PHASE_C: false,
            TOTAL_APPARENT_POWER_QMINUS: false,
            APPARENT_POWER_QMINUS_PHASE_A: false,
            APPARENT_POWER_QMINUS_PHASE_B: false
          },
          displaySet33: {
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
          displaySet34: {
            MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
            MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
            HOUR_MINUTE_SECOND: true,
            DATE_MONTH_YEAR: true,
            CURRENT_TRANSFORMATION_RATIO: false,
            VOLTAGE_TRANSFORMATION_RATIO: false,
            CURRENT_BALANCE: false,
            POWER_THRESHOLD_T1: false,
            POWER_THRESHOLD_T2: false,
            POWER_THRESHOLD_T3: false,
            POWER_THRESHOLD_T4: false,
            SORT_DISPLAY_SCREENS: false,
            AUTO_SCREEN_SCROLLING: true
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
        bytes: [0x75, 0x1c, 0x00, 0x00, 0x00, 0x5b, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1c]
      }
    };
    var fromBytes$3 = function fromBytes(bytes) {
      var buffer = new CommandBinaryBuffer(bytes);
      return buffer.getOperatorParametersExtended4();
    };
    var toBytes$3 = function toBytes(parameters) {
      var buffer = new CommandBinaryBuffer(maxSize$3);
      buffer.setOperatorParametersExtended4(parameters);
      return toBytes$2h(id$3, buffer.data);
    };

    var getOperatorParametersExtended4 = /*#__PURE__*/Object.freeze({
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

    var id$2 = setOperatorParametersExtended$2;
    var name$2 = commandNames[setOperatorParametersExtended$2];
    var headerSize$2 = 2;
    var maxSize$2 = 0;
    var accessLevel$2 = READ_WRITE;
    var isLoraOnly$2 = false;
    var examples$2 = {
      'simple response': {
        id: id$2,
        name: name$2,
        headerSize: headerSize$2,
        maxSize: maxSize$2,
        accessLevel: accessLevel$2,
        parameters: {},
        bytes: [0x40, 0x00]
      }
    };
    var fromBytes$2 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$2) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$2 = function toBytes() {
      return toBytes$2h(id$2);
    };

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

    var id$1 = setOperatorParametersExtended2$2;
    var name$1 = commandNames[setOperatorParametersExtended2$2];
    var headerSize$1 = 2;
    var maxSize$1 = 0;
    var accessLevel$1 = READ_WRITE;
    var isLoraOnly$1 = false;
    var examples$1 = {
      'simple response': {
        id: id$1,
        name: name$1,
        headerSize: headerSize$1,
        maxSize: maxSize$1,
        accessLevel: accessLevel$1,
        parameters: {},
        bytes: [0x45, 0x00]
      }
    };
    var fromBytes$1 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1 = function toBytes() {
      return toBytes$2h(id$1);
    };

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

    var id = setOperatorParametersExtended4$2;
    var name = commandNames[setOperatorParametersExtended4$2];
    var headerSize = 2;
    var maxSize = 0;
    var accessLevel = READ_WRITE;
    var isLoraOnly = false;
    var examples = {
      'simple response': {
        id: id,
        name: name,
        headerSize: headerSize,
        maxSize: maxSize,
        accessLevel: accessLevel,
        parameters: {},
        bytes: [0x74, 0x00]
      }
    };
    var fromBytes = function fromBytes(bytes) {
      if (bytes.length !== maxSize) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes = function toBytes() {
      return toBytes$2h(id);
    };

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
        getDayEnergies: getDayEnergies,
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
        getHalfHourEnergies: getHalfHourEnergies,
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
        getOperatorParametersExtended4: getOperatorParametersExtended4,
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
