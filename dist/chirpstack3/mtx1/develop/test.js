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
    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
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
    var fromBytes$26 = function fromBytes(bytes) {
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
    var toBytes$27 = function toBytes(_ref, prefix) {
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

    invertObject(frameTypes);

    var UNENCRYPTED = 0x00;
    var ROOT = 0x01;
    var READ_WRITE = 0x02;
    var READ_ONLY = 0x03;

    var accessLevels = /*#__PURE__*/Object.freeze({
        __proto__: null,
        READ_ONLY: READ_ONLY,
        READ_WRITE: READ_WRITE,
        ROOT: ROOT,
        UNENCRYPTED: UNENCRYPTED
    });

    invertObject(accessLevels);

    var CASE_OPEN = 0;
    var MAGNETIC_ON = 1;
    var PARAMETERS_UPDATE_REMOTE = 2;
    var PARAMETERS_UPDATE_LOCAL = 3;
    var RESTART$1 = 4;
    var ERROR_ACCESS = 5;
    var TIME_SET = 6;
    var TIME_CORRECT$1 = 7;
    var DEVICE_FAILURE = 8;
    var CASE_TERMINAL_OPEN = 9;
    var CASE_MODULE_OPEN = 10;
    var TARIFF_TABLE_SET = 11;
    var TARIFF_TABLE_GET = 12;
    var PROTECTION_RESET_EM = 13;
    var PROTECTION_RESET_MAGNETIC = 14;

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
        RESTART: RESTART$1,
        TARIFF_TABLE_GET: TARIFF_TABLE_GET,
        TARIFF_TABLE_SET: TARIFF_TABLE_SET,
        TIME_CORRECT: TIME_CORRECT$1,
        TIME_SET: TIME_SET
    });

    var criticalEventNames = invertObject(criticalEvents);

    var getEventStatus$3 = 0x01;
    var getEnergyDayPrevious$2 = 0x03;
    var getDeviceType$3 = 0x04;
    var getDeviceId$3 = 0x05;
    var getDateTime$3 = 0x07;
    var setDateTime$3 = 0x08;
    var setAccessKey$2 = 0x09;
    var getCurrentValues$2 = 0x0d;
    var getEnergy$2 = 0x0f;
    var setDayProfile$3 = 0x10;
    var setSeasonProfile$3 = 0x11;
    var setSpecialDay$3 = 0x12;
    var activateRatePlan$2 = 0x13;
    var prepareRatePlan$2 = 0x14;
    var getHalfHourDemand$2 = 0x15;
    var getDayDemand$2 = 0x16;
    var getMonthDemand$2 = 0x17;
    var turnRelayOn$2 = 0x18;
    var turnRelayOff$2 = 0x19;
    var setCorrectTime$2 = 0x1c;
    var getOperatorParameters$3 = 0x1e;
    var setOperatorParameters$3 = 0x1f;
    var getVersion$2 = 0x28;
    var getSaldo$2 = 0x29;
    var setSaldo$2 = 0x2a;
    var getRatePlanInfo$2 = 0x2c;
    var getExtendedCurrentValues2$3 = 0x2d;
    var getSaldoParameters$3 = 0x2e;
    var setSaldoParameters$3 = 0x2f;
    var getDayMaxDemand$2 = 0x31;
    var getMonthMaxDemand$2 = 0x32;
    var getEvents$2 = 0x33;
    var getEventsCounters$2 = 0x34;
    var resetPowerMaxDay$2 = 0x35;
    var resetPowerMaxMonth$2 = 0x36;
    var getCurrentStatusMeter$2 = 0x39;
    var getExtendedCurrentValues$2 = 0x3a;
    var getDayProfile$2 = 0x3b;
    var getSeasonProfile$3 = 0x3c;
    var getSpecialDay$3 = 0x3d;
    var getCorrectTime$2 = 0x3e;
    var getCriticalEvent$2 = 0x41;
    var runTariffPlan$2 = 0x46;
    var getDayMaxDemandPrevious$2 = 0x4a;
    var getHalfHourDemandPrevious$2 = 0x4b;
    var getDayDemandExport$2 = 0x4f;
    var getEnergyExportDayPrevious$2 = 0x50;
    var getMonthDemandExport$2 = 0x52;
    var getHalfHourDemandExport$2 = 0x53;
    var getDayMaxDemandExport$2 = 0x58;
    var getMonthMaxDemandExport$2 = 0x59;
    var getEnergyExport$2 = 0x5b;
    var setCorrectDateTime$2 = 0x5c;
    var setDisplayParam$2 = 0x5d;
    var getDisplayParam$2 = 0x5e;
    var setSpecialOperation$2 = 0x64;
    var getMagneticFieldThreshold$2 = 0x6d;
    var getHalfHourEnergies$2 = 0x6f;
    var getBv$2 = 0x70;
    var getOperatorParametersExtended3$3 = 0x71;
    var setOperatorParametersExtended3$3 = 0x72;
    var setDemandParameters$3 = 0x74;
    var getDemandParameters$3 = 0x75;
    var getDemand$3 = 0x76;
    var getMeterInfo$2 = 0x7a;

    var downlinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$2,
        getBv: getBv$2,
        getCorrectTime: getCorrectTime$2,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$2,
        getCurrentValues: getCurrentValues$2,
        getDateTime: getDateTime$3,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayMaxDemand: getDayMaxDemand$2,
        getDayMaxDemandExport: getDayMaxDemandExport$2,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious$2,
        getDayProfile: getDayProfile$2,
        getDemand: getDemand$3,
        getDemandParameters: getDemandParameters$3,
        getDeviceId: getDeviceId$3,
        getDeviceType: getDeviceType$3,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$3,
        getEvents: getEvents$2,
        getEventsCounters: getEventsCounters$2,
        getExtendedCurrentValues: getExtendedCurrentValues$2,
        getExtendedCurrentValues2: getExtendedCurrentValues2$3,
        getHalfHourDemand: getHalfHourDemand$2,
        getHalfHourDemandExport: getHalfHourDemandExport$2,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious$2,
        getHalfHourEnergies: getHalfHourEnergies$2,
        getMagneticFieldThreshold: getMagneticFieldThreshold$2,
        getMeterInfo: getMeterInfo$2,
        getMonthDemand: getMonthDemand$2,
        getMonthDemandExport: getMonthDemandExport$2,
        getMonthMaxDemand: getMonthMaxDemand$2,
        getMonthMaxDemandExport: getMonthMaxDemandExport$2,
        getOperatorParameters: getOperatorParameters$3,
        getOperatorParametersExtended3: getOperatorParametersExtended3$3,
        getRatePlanInfo: getRatePlanInfo$2,
        getSaldo: getSaldo$2,
        getSaldoParameters: getSaldoParameters$3,
        getSeasonProfile: getSeasonProfile$3,
        getSpecialDay: getSpecialDay$3,
        getVersion: getVersion$2,
        prepareRatePlan: prepareRatePlan$2,
        resetPowerMaxDay: resetPowerMaxDay$2,
        resetPowerMaxMonth: resetPowerMaxMonth$2,
        runTariffPlan: runTariffPlan$2,
        setAccessKey: setAccessKey$2,
        setCorrectDateTime: setCorrectDateTime$2,
        setCorrectTime: setCorrectTime$2,
        setDateTime: setDateTime$3,
        setDayProfile: setDayProfile$3,
        setDemandParameters: setDemandParameters$3,
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$3,
        setOperatorParametersExtended3: setOperatorParametersExtended3$3,
        setSaldo: setSaldo$2,
        setSaldoParameters: setSaldoParameters$3,
        setSeasonProfile: setSeasonProfile$3,
        setSpecialDay: setSpecialDay$3,
        setSpecialOperation: setSpecialOperation$2,
        turnRelayOff: turnRelayOff$2,
        turnRelayOn: turnRelayOn$2
    });

    var commandNames$1 = invertObject(downlinkIds);

    var ENERGY_REGISTER_FAULT = 0x01;
    var VENDOR_PAR_FAULT = 0x02;
    var OPERATOR_PARAMETERS_VALUES_FAULT = 0x03;
    var ACCESS_LOCKED = 0x10;
    var ACCESS_ERROR = 0x11;
    var CASE_OPENED = 0x12;
    var CASE_CLOSED = 0x13;
    var MAGNETIC_INFLUENCE_ON = 0x14;
    var MAGNETIC_INFLUENCE_OFF = 0x15;
    var CHANGE_ACCESS_KEY0 = 0x20;
    var CHANGE_ACCESS_KEY1 = 0x21;
    var CHANGE_ACCESS_KEY2 = 0x22;
    var CHANGE_ACCESS_KEY3 = 0x23;
    var CHANGE_PARAMETERS_LOCAL = 0x24;
    var CHANGE_PARAMETERS_REMOTE = 0x25;
    var CMD_SET_DATETIME = 0x26;
    var CMD_RELAY_ON = 0x27;
    var CMD_RELAY_OFF = 0x28;
    var CHANGE_COR_TIME = 0x29;
    var ENERGY_REGISTER_OVERFLOW = 0x31;
    var CHANGE_TARIFF_TABLE = 0x32;
    var SET_TARIFF_TABLE = 0x33;
    var SUMMER_TIME = 0x34;
    var WINTER_TIME = 0x35;
    var RELAY_ON = 0x36;
    var RELAY_OFF = 0x37;
    var RESTART = 0x38;
    var WATCHDOG_RESTART = 0x39;
    var POWER_B_ON = 0x3c;
    var POWER_B_OFF = 0x3d;
    var POWER_C_ON = 0x3E;
    var POWER_C_OFF = 0x3F;
    var V_MAX_OK = 0x40;
    var V_MAX_OVER = 0x41;
    var V_MIN_OK = 0x42;
    var V_MIN_OVER = 0x43;
    var T_MAX_OK = 0x44;
    var T_MAX_OVER = 0x45;
    var T_MIN_OK = 0x46;
    var T_MIN_OVER = 0x47;
    var F_MAX_OK = 0x48;
    var F_MAX_OVER = 0x49;
    var F_MIN_OK = 0x4a;
    var F_MIN_OVER = 0x4b;
    var I_MAX_OK = 0x4c;
    var I_MAX_OVER = 0x4d;
    var P_MAX_OK = 0x4E;
    var P_MAX_OVER = 0x4F;
    var POWER_SALDO_OK = 0x50;
    var POWER_SALDO_OVER = 0x51;
    var BATTERY_OK = 0x52;
    var BATTERY_FAULT = 0x53;
    var CALIBRATION_OK = 0x54;
    var CALIBRATION_FAULT = 0x55;
    var CLOCK_OK = 0x56;
    var CLOCK_FAULT = 0x57;
    var POWER_A_OFF = 0x58;
    var POWER_A_ON = 0x59;
    var CMD_RELAY_2_ON = 0x60;
    var CMD_RELAY_2_OFF = 0x61;
    var CROSS_ZERO_EN_T1 = 0x62;
    var CROSS_ZERO_EN_T2 = 0x63;
    var CROSS_ZERO_EN_T3 = 0x64;
    var CROSS_ZERO_EN_T4 = 0x65;
    var CALIBRATION_FLAG_SET = 0x66;
    var CALIBRATION_FLAG_RESET = 0x67;
    var BAD_TEST_EEPROM = 0x68;
    var BAD_TEST_FRAM = 0x69;
    var SET_NEW_SALDO = 0x70;
    var SALDO_PARAMETERS_FAULT = 0x71;
    var ACC_PARAMETERS_FAULT = 0x72;
    var ACC_PARAMETERS_EXT_FAULT = 0x73;
    var CALC_PERIOD_FAULT = 0x74;
    var BLOCK_TARIFF_FAULT = 0x75;
    var CALIBRATION_PARAMETERS_FAULT = 0x76;
    var WINTER_SUMMER_FAULT = 0x77;
    var SALDO_EN_FAULT = 0x78;
    var TIME_CORRECT = 0x79;
    var CASE_TERMINAL_BOX_OPENED = 0x7a;
    var CASE_TERMINAL_BOX_CLOSED = 0x7b;
    var CASE_MODULE_OPENED = 0x7c;
    var CASE_MODULE_CLOSED = 0x7d;
    var POWER_GOOD_DIO = 0x7E;
    var RELAY_HARD_BAD_OFF = 0x90;
    var RELAY_HARD_ON = 0x91;
    var RELAY_HARD_BAD_ON = 0x93;
    var RELAY_HARD_OFF = 0x94;
    var CHANGE_TARIFF_TABLE_2 = 0x98;
    var SET_SALDO_PARAM = 0x9c;
    var POWER_OVER_RELAY_OFF = 0x9d;
    var CROSS_ZERO_EXPORT_EN_T1 = 0x9E;
    var CROSS_ZERO_EXPORT_EN_T2 = 0x9F;
    var CROSS_ZERO_EXPORT_EN_T3 = 0xa0;
    var CROSS_ZERO_EXPORT_EN_T4 = 0xa1;
    var TIME_CORRECT_NEW = 0xa2;
    var EM_MAGNETIC_INFLUENCE_ON = 0xb0;
    var EM_MAGNETIC_INFLUENCE_OFF = 0xb1;
    var CURRENT_UNEQUAL_FAULT = 0xb2;
    var CURRENT_UNEQUAL_OK = 0xb3;
    var BIPOLAR_POWER_FAULT = 0xb4;
    var BIPOLAR_POWER_OK = 0xb5;
    var RESET_EM_FLAG = 0xb6;
    var RESET_MAGNET_FLAG = 0xb7;
    var CHANGE_PARAMETERS_CHANNEL = 0xb9;
    var RELAY_OFF_BAD_SALDO = 0xba;
    var SET_DEMAND_EN_1MIN = 0xe0;
    var SET_DEMAND_EN_3MIN = 0xe1;
    var SET_DEMAND_EN_5MIN = 0xe2;
    var SET_DEMAND_EN_10MIN = 0xe3;
    var SET_DEMAND_EN_15MIN = 0xe4;
    var SET_DEMAND_EN_30MIN = 0xe5;
    var SET_DEMAND_EN_60MIN = 0xe6;
    var P_MAX_A_MINUS_OK = 0xe7;
    var P_MAX_A_MINUS_OVER = 0xe8;

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACCESS_ERROR: ACCESS_ERROR,
        ACCESS_LOCKED: ACCESS_LOCKED,
        ACC_PARAMETERS_EXT_FAULT: ACC_PARAMETERS_EXT_FAULT,
        ACC_PARAMETERS_FAULT: ACC_PARAMETERS_FAULT,
        BAD_TEST_EEPROM: BAD_TEST_EEPROM,
        BAD_TEST_FRAM: BAD_TEST_FRAM,
        BATTERY_FAULT: BATTERY_FAULT,
        BATTERY_OK: BATTERY_OK,
        BIPOLAR_POWER_FAULT: BIPOLAR_POWER_FAULT,
        BIPOLAR_POWER_OK: BIPOLAR_POWER_OK,
        BLOCK_TARIFF_FAULT: BLOCK_TARIFF_FAULT,
        CALC_PERIOD_FAULT: CALC_PERIOD_FAULT,
        CALIBRATION_FAULT: CALIBRATION_FAULT,
        CALIBRATION_FLAG_RESET: CALIBRATION_FLAG_RESET,
        CALIBRATION_FLAG_SET: CALIBRATION_FLAG_SET,
        CALIBRATION_OK: CALIBRATION_OK,
        CALIBRATION_PARAMETERS_FAULT: CALIBRATION_PARAMETERS_FAULT,
        CASE_CLOSED: CASE_CLOSED,
        CASE_MODULE_CLOSED: CASE_MODULE_CLOSED,
        CASE_MODULE_OPENED: CASE_MODULE_OPENED,
        CASE_OPENED: CASE_OPENED,
        CASE_TERMINAL_BOX_CLOSED: CASE_TERMINAL_BOX_CLOSED,
        CASE_TERMINAL_BOX_OPENED: CASE_TERMINAL_BOX_OPENED,
        CHANGE_ACCESS_KEY0: CHANGE_ACCESS_KEY0,
        CHANGE_ACCESS_KEY1: CHANGE_ACCESS_KEY1,
        CHANGE_ACCESS_KEY2: CHANGE_ACCESS_KEY2,
        CHANGE_ACCESS_KEY3: CHANGE_ACCESS_KEY3,
        CHANGE_COR_TIME: CHANGE_COR_TIME,
        CHANGE_PARAMETERS_CHANNEL: CHANGE_PARAMETERS_CHANNEL,
        CHANGE_PARAMETERS_LOCAL: CHANGE_PARAMETERS_LOCAL,
        CHANGE_PARAMETERS_REMOTE: CHANGE_PARAMETERS_REMOTE,
        CHANGE_TARIFF_TABLE: CHANGE_TARIFF_TABLE,
        CHANGE_TARIFF_TABLE_2: CHANGE_TARIFF_TABLE_2,
        CLOCK_FAULT: CLOCK_FAULT,
        CLOCK_OK: CLOCK_OK,
        CMD_RELAY_2_OFF: CMD_RELAY_2_OFF,
        CMD_RELAY_2_ON: CMD_RELAY_2_ON,
        CMD_RELAY_OFF: CMD_RELAY_OFF,
        CMD_RELAY_ON: CMD_RELAY_ON,
        CMD_SET_DATETIME: CMD_SET_DATETIME,
        CROSS_ZERO_EN_T1: CROSS_ZERO_EN_T1,
        CROSS_ZERO_EN_T2: CROSS_ZERO_EN_T2,
        CROSS_ZERO_EN_T3: CROSS_ZERO_EN_T3,
        CROSS_ZERO_EN_T4: CROSS_ZERO_EN_T4,
        CROSS_ZERO_EXPORT_EN_T1: CROSS_ZERO_EXPORT_EN_T1,
        CROSS_ZERO_EXPORT_EN_T2: CROSS_ZERO_EXPORT_EN_T2,
        CROSS_ZERO_EXPORT_EN_T3: CROSS_ZERO_EXPORT_EN_T3,
        CROSS_ZERO_EXPORT_EN_T4: CROSS_ZERO_EXPORT_EN_T4,
        CURRENT_UNEQUAL_FAULT: CURRENT_UNEQUAL_FAULT,
        CURRENT_UNEQUAL_OK: CURRENT_UNEQUAL_OK,
        EM_MAGNETIC_INFLUENCE_OFF: EM_MAGNETIC_INFLUENCE_OFF,
        EM_MAGNETIC_INFLUENCE_ON: EM_MAGNETIC_INFLUENCE_ON,
        ENERGY_REGISTER_FAULT: ENERGY_REGISTER_FAULT,
        ENERGY_REGISTER_OVERFLOW: ENERGY_REGISTER_OVERFLOW,
        F_MAX_OK: F_MAX_OK,
        F_MAX_OVER: F_MAX_OVER,
        F_MIN_OK: F_MIN_OK,
        F_MIN_OVER: F_MIN_OVER,
        I_MAX_OK: I_MAX_OK,
        I_MAX_OVER: I_MAX_OVER,
        MAGNETIC_INFLUENCE_OFF: MAGNETIC_INFLUENCE_OFF,
        MAGNETIC_INFLUENCE_ON: MAGNETIC_INFLUENCE_ON,
        OPERATOR_PARAMETERS_VALUES_FAULT: OPERATOR_PARAMETERS_VALUES_FAULT,
        POWER_A_OFF: POWER_A_OFF,
        POWER_A_ON: POWER_A_ON,
        POWER_B_OFF: POWER_B_OFF,
        POWER_B_ON: POWER_B_ON,
        POWER_C_OFF: POWER_C_OFF,
        POWER_C_ON: POWER_C_ON,
        POWER_GOOD_DIO: POWER_GOOD_DIO,
        POWER_OVER_RELAY_OFF: POWER_OVER_RELAY_OFF,
        POWER_SALDO_OK: POWER_SALDO_OK,
        POWER_SALDO_OVER: POWER_SALDO_OVER,
        P_MAX_A_MINUS_OK: P_MAX_A_MINUS_OK,
        P_MAX_A_MINUS_OVER: P_MAX_A_MINUS_OVER,
        P_MAX_OK: P_MAX_OK,
        P_MAX_OVER: P_MAX_OVER,
        RELAY_HARD_BAD_OFF: RELAY_HARD_BAD_OFF,
        RELAY_HARD_BAD_ON: RELAY_HARD_BAD_ON,
        RELAY_HARD_OFF: RELAY_HARD_OFF,
        RELAY_HARD_ON: RELAY_HARD_ON,
        RELAY_OFF: RELAY_OFF,
        RELAY_OFF_BAD_SALDO: RELAY_OFF_BAD_SALDO,
        RELAY_ON: RELAY_ON,
        RESET_EM_FLAG: RESET_EM_FLAG,
        RESET_MAGNET_FLAG: RESET_MAGNET_FLAG,
        RESTART: RESTART,
        SALDO_EN_FAULT: SALDO_EN_FAULT,
        SALDO_PARAMETERS_FAULT: SALDO_PARAMETERS_FAULT,
        SET_DEMAND_EN_10MIN: SET_DEMAND_EN_10MIN,
        SET_DEMAND_EN_15MIN: SET_DEMAND_EN_15MIN,
        SET_DEMAND_EN_1MIN: SET_DEMAND_EN_1MIN,
        SET_DEMAND_EN_30MIN: SET_DEMAND_EN_30MIN,
        SET_DEMAND_EN_3MIN: SET_DEMAND_EN_3MIN,
        SET_DEMAND_EN_5MIN: SET_DEMAND_EN_5MIN,
        SET_DEMAND_EN_60MIN: SET_DEMAND_EN_60MIN,
        SET_NEW_SALDO: SET_NEW_SALDO,
        SET_SALDO_PARAM: SET_SALDO_PARAM,
        SET_TARIFF_TABLE: SET_TARIFF_TABLE,
        SUMMER_TIME: SUMMER_TIME,
        TIME_CORRECT: TIME_CORRECT,
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
        WATCHDOG_RESTART: WATCHDOG_RESTART,
        WINTER_SUMMER_FAULT: WINTER_SUMMER_FAULT,
        WINTER_TIME: WINTER_TIME
    });

    var eventNames = invertObject(events);

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

    var SET_ALL_SEGMENT_DISPLAY = 1;
    var SOFTWARE_VERSION = 2;
    var TOTAL_ACTIVE_ENERGY = 3;
    var ACTIVE_ENERGY_T1 = 4;
    var ACTIVE_ENERGY_T2 = 5;
    var ACTIVE_ENERGY_T3 = 6;
    var ACTIVE_ENERGY_T4 = 7;
    var ACTIVE_POWER_PER_PHASE = 8;
    var ACTIVE_POWER_IN_NEUTRAL = 9;
    var CURRENT_IN_PHASE = 10;
    var CURRENT_IN_NEUTRAL = 11;
    var VOLTAGE$1 = 12;
    var HOUR_MINUTE_SECOND = 13;
    var DATE_MONTH_YEAR = 14;
    var TOTAL_EXPORTED_ACTIVE_ENERGY = 15;
    var EXPORTED_ACTIVE_ENERGY_T1 = 16;
    var EXPORTED_ACTIVE_ENERGY_T2 = 17;
    var EXPORTED_ACTIVE_ENERGY_T3 = 18;
    var EXPORTED_ACTIVE_ENERGY_T4 = 19;
    var POWER_FACTOR_PHASE_A = 20;
    var POWER_FACTOR_PHASE_B = 21;
    var BATTERY_VOLTAGE = 22;
    var POWER_THRESHOLD_T1 = 23;
    var POWER_THRESHOLD_T2 = 24;
    var POWER_THRESHOLD_T3 = 25;
    var POWER_THRESHOLD_T4 = 26;
    var MAGNET_INDUCTION = 28;
    var CURRENT_BALANCE = 30;
    var OPTOPORT_SPEED = 31;

    var screenIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIVE_ENERGY_T1: ACTIVE_ENERGY_T1,
        ACTIVE_ENERGY_T2: ACTIVE_ENERGY_T2,
        ACTIVE_ENERGY_T3: ACTIVE_ENERGY_T3,
        ACTIVE_ENERGY_T4: ACTIVE_ENERGY_T4,
        ACTIVE_POWER_IN_NEUTRAL: ACTIVE_POWER_IN_NEUTRAL,
        ACTIVE_POWER_PER_PHASE: ACTIVE_POWER_PER_PHASE,
        BATTERY_VOLTAGE: BATTERY_VOLTAGE,
        CURRENT_BALANCE: CURRENT_BALANCE,
        CURRENT_IN_NEUTRAL: CURRENT_IN_NEUTRAL,
        CURRENT_IN_PHASE: CURRENT_IN_PHASE,
        DATE_MONTH_YEAR: DATE_MONTH_YEAR,
        EXPORTED_ACTIVE_ENERGY_T1: EXPORTED_ACTIVE_ENERGY_T1,
        EXPORTED_ACTIVE_ENERGY_T2: EXPORTED_ACTIVE_ENERGY_T2,
        EXPORTED_ACTIVE_ENERGY_T3: EXPORTED_ACTIVE_ENERGY_T3,
        EXPORTED_ACTIVE_ENERGY_T4: EXPORTED_ACTIVE_ENERGY_T4,
        HOUR_MINUTE_SECOND: HOUR_MINUTE_SECOND,
        MAGNET_INDUCTION: MAGNET_INDUCTION,
        OPTOPORT_SPEED: OPTOPORT_SPEED,
        POWER_FACTOR_PHASE_A: POWER_FACTOR_PHASE_A,
        POWER_FACTOR_PHASE_B: POWER_FACTOR_PHASE_B,
        POWER_THRESHOLD_T1: POWER_THRESHOLD_T1,
        POWER_THRESHOLD_T2: POWER_THRESHOLD_T2,
        POWER_THRESHOLD_T3: POWER_THRESHOLD_T3,
        POWER_THRESHOLD_T4: POWER_THRESHOLD_T4,
        SET_ALL_SEGMENT_DISPLAY: SET_ALL_SEGMENT_DISPLAY,
        SOFTWARE_VERSION: SOFTWARE_VERSION,
        TOTAL_ACTIVE_ENERGY: TOTAL_ACTIVE_ENERGY,
        TOTAL_EXPORTED_ACTIVE_ENERGY: TOTAL_EXPORTED_ACTIVE_ENERGY,
        VOLTAGE: VOLTAGE$1
    });

    invertObject(screenIds);

    var getDayEnergies$1 = 0x78;
    var getDayMaxPower$1 = 0x79;
    var errorResponse$1 = 0xfe;
    var errorDataFrameResponse$1 = 0xff;

    var uplinkIds = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$2,
        errorDataFrameResponse: errorDataFrameResponse$1,
        errorResponse: errorResponse$1,
        getBv: getBv$2,
        getCorrectTime: getCorrectTime$2,
        getCriticalEvent: getCriticalEvent$2,
        getCurrentStatusMeter: getCurrentStatusMeter$2,
        getCurrentValues: getCurrentValues$2,
        getDateTime: getDateTime$3,
        getDayDemand: getDayDemand$2,
        getDayDemandExport: getDayDemandExport$2,
        getDayEnergies: getDayEnergies$1,
        getDayMaxDemand: getDayMaxDemand$2,
        getDayMaxDemandExport: getDayMaxDemandExport$2,
        getDayMaxDemandPrevious: getDayMaxDemandPrevious$2,
        getDayMaxPower: getDayMaxPower$1,
        getDayProfile: getDayProfile$2,
        getDemand: getDemand$3,
        getDemandParameters: getDemandParameters$3,
        getDeviceId: getDeviceId$3,
        getDeviceType: getDeviceType$3,
        getDisplayParam: getDisplayParam$2,
        getEnergy: getEnergy$2,
        getEnergyDayPrevious: getEnergyDayPrevious$2,
        getEnergyExport: getEnergyExport$2,
        getEnergyExportDayPrevious: getEnergyExportDayPrevious$2,
        getEventStatus: getEventStatus$3,
        getEvents: getEvents$2,
        getEventsCounters: getEventsCounters$2,
        getExtendedCurrentValues: getExtendedCurrentValues$2,
        getExtendedCurrentValues2: getExtendedCurrentValues2$3,
        getHalfHourDemand: getHalfHourDemand$2,
        getHalfHourDemandExport: getHalfHourDemandExport$2,
        getHalfHourDemandPrevious: getHalfHourDemandPrevious$2,
        getHalfHourEnergies: getHalfHourEnergies$2,
        getMagneticFieldThreshold: getMagneticFieldThreshold$2,
        getMeterInfo: getMeterInfo$2,
        getMonthDemand: getMonthDemand$2,
        getMonthDemandExport: getMonthDemandExport$2,
        getMonthMaxDemand: getMonthMaxDemand$2,
        getMonthMaxDemandExport: getMonthMaxDemandExport$2,
        getOperatorParameters: getOperatorParameters$3,
        getOperatorParametersExtended3: getOperatorParametersExtended3$3,
        getRatePlanInfo: getRatePlanInfo$2,
        getSaldo: getSaldo$2,
        getSaldoParameters: getSaldoParameters$3,
        getSeasonProfile: getSeasonProfile$3,
        getSpecialDay: getSpecialDay$3,
        getVersion: getVersion$2,
        prepareRatePlan: prepareRatePlan$2,
        resetPowerMaxDay: resetPowerMaxDay$2,
        resetPowerMaxMonth: resetPowerMaxMonth$2,
        runTariffPlan: runTariffPlan$2,
        setAccessKey: setAccessKey$2,
        setCorrectDateTime: setCorrectDateTime$2,
        setCorrectTime: setCorrectTime$2,
        setDateTime: setDateTime$3,
        setDayProfile: setDayProfile$3,
        setDemandParameters: setDemandParameters$3,
        setDisplayParam: setDisplayParam$2,
        setOperatorParameters: setOperatorParameters$3,
        setOperatorParametersExtended3: setOperatorParametersExtended3$3,
        setSaldo: setSaldo$2,
        setSaldoParameters: setSaldoParameters$3,
        setSeasonProfile: setSeasonProfile$3,
        setSpecialDay: setSpecialDay$3,
        setSpecialOperation: setSpecialOperation$2,
        turnRelayOff: turnRelayOff$2,
        turnRelayOn: turnRelayOn$2
    });

    var commandNames = invertObject(uplinkIds);

    var RATE_2400 = 2400;
    var RATE_9600 = 9600;
    var valueToRate = {
      rs485orTwi: {
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
      rs485orTwi: invertObject(valueToRate.rs485orTwi),
      optoport: invertObject(valueToRate.optoport)
    };

    var A_PLUS$1 = 0x01;
    var A_MINUS$1 = 0x02;
    var VOLTAGE_10 = 0x40;
    var VOLTAGE = 0xa0;

    var MAIN = 0;
    var ADDITIONAL = 1;

    var A_PLUS = 1;
    var A_MINUS = 2;

    var RESET_INFLUENCE_SCREENS = 0x55;

    var TARIFF_PLAN_SIZE = 11;
    var OPERATOR_PARAMETERS_SIZE = 74;
    var SEASON_PROFILE_DAYS_NUMBER = 7;
    var SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;
    var TARIFF_NUMBER$1 = 4;
    var PACKED_ENERGY_TYPE_SIZE = 1;
    var ENERGY_SIZE = 4;
    var DATE_SIZE$3 = 3;
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
    var define1Mask = {
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
      RELAY_HARD_ST1: Math.pow(2, 5),
      RELAY_MAGNET_OFF: Math.pow(2, 6),
      RELAY_P_MINUS_MAX_OFF: Math.pow(2, 7)
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
    var getSerialPortsSpeed = function getSerialPortsSpeed(value) {
      return {
        rs485orTwi: valueToRate.rs485orTwi[extractBits(value, 4, 1)],
        optoport: valueToRate.optoport[extractBits(value, 4, 5)]
      };
    };
    var setSerialPortsSpeed = function setSerialPortsSpeed(serialPortsSpeed) {
      var result = 0;
      result = fillBits(result, 4, 1, Number(rateToValue.rs485orTwi[serialPortsSpeed.rs485orTwi]));
      result = fillBits(result, 4, 5, Number(rateToValue.optoport[serialPortsSpeed.optoport]));
      return result;
    };
    function getPackedEnergies(buffer, energyType, tariffMapByte) {
      var _byte = tariffMapByte >> TARIFF_NUMBER$1;
      var energies = new Array(TARIFF_NUMBER$1).fill(0);
      energies.forEach(function (energy, index) {
        var isTariffExists = !!extractBits(_byte, 1, index + 1);
        if (isTariffExists) {
          energies[index] = buffer.getInt32();
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
    var getDayProfileFromByte = function getDayProfileFromByte(value) {
      return {
        tariff: extractBits(value, 2, 1),
        isFirstHalfHour: !extractBits(value, 1, 3),
        hour: extractBits(value, 5, 4)
      };
    };
    var getByteFromDayProfile = function getByteFromDayProfile(dayProfile) {
      var value = 0;
      value = fillBits(value, 2, 1, dayProfile.tariff);
      value = fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
      value = fillBits(value, 5, 4, dayProfile.hour);
      return value;
    };
    var getDeviceId$2 = function getDeviceId(buffer) {
      var manufacturer = getHexFromBytes(buffer.getBytes(3), {
        separator: ''
      });
      var type = buffer.getUint8();
      var year = buffer.getUint8();
      var serial = getHexFromBytes(buffer.getBytes(3), {
        separator: ''
      });
      return {
        manufacturer: manufacturer,
        type: type,
        year: year,
        serial: serial
      };
    };
    var setDeviceId = function setDeviceId(buffer, _ref3) {
      var manufacturer = _ref3.manufacturer,
        type = _ref3.type,
        year = _ref3.year,
        serial = _ref3.serial;
      buffer.setBytes(getBytesFromHex(manufacturer));
      buffer.setUint8(type);
      buffer.setUint8(year);
      buffer.setBytes(getBytesFromHex(serial));
    };
    var getDateTime$2 = function getDateTime(buffer) {
      return {
        isSummerTime: !!buffer.getUint8(),
        seconds: buffer.getUint8(),
        minutes: buffer.getUint8(),
        hours: buffer.getUint8(),
        day: buffer.getUint8(),
        date: buffer.getUint8(),
        month: buffer.getUint8(),
        year: buffer.getUint8()
      };
    };
    var setDateTime$2 = function setDateTime(buffer, dateTime) {
      buffer.setUint8(dateTime.isSummerTime ? 1 : 0);
      buffer.setUint8(dateTime.seconds);
      buffer.setUint8(dateTime.minutes);
      buffer.setUint8(dateTime.hours);
      buffer.setUint8(dateTime.day || 0);
      buffer.setUint8(dateTime.date);
      buffer.setUint8(dateTime.month);
      buffer.setUint8(dateTime.year);
    };
    var getTariffPlan = function getTariffPlan(buffer) {
      return {
        id: buffer.getUint32(),
        tariffSet: buffer.getUint8(),
        activateYear: buffer.getUint8(),
        activateMonth: buffer.getUint8(),
        activateDay: buffer.getUint8(),
        specialProfilesArraySize: buffer.getUint8(),
        seasonProfilesArraySize: buffer.getUint8(),
        dayProfilesArraySize: buffer.getUint8()
      };
    };
    var setTariffPlan = function setTariffPlan(buffer, tariffPlan) {
      buffer.setUint32(tariffPlan.id);
      buffer.setUint8(tariffPlan.tariffSet);
      buffer.setUint8(tariffPlan.activateYear);
      buffer.setUint8(tariffPlan.activateMonth);
      buffer.setUint8(tariffPlan.activateDay);
      buffer.setUint8(tariffPlan.specialProfilesArraySize);
      buffer.setUint8(tariffPlan.seasonProfilesArraySize);
      buffer.setUint8(tariffPlan.dayProfilesArraySize);
    };
    var getTimeCorrectionParameters = function getTimeCorrectionParameters(buffer) {
      return {
        monthTransitionSummer: buffer.getUint8(),
        dateTransitionSummer: buffer.getUint8(),
        hoursTransitionSummer: buffer.getUint8(),
        hoursCorrectSummer: buffer.getUint8(),
        monthTransitionWinter: buffer.getUint8(),
        dateTransitionWinter: buffer.getUint8(),
        hoursTransitionWinter: buffer.getUint8(),
        hoursCorrectWinter: buffer.getUint8(),
        isCorrectionNeeded: buffer.getUint8() === 1
      };
    };
    var setTimeCorrectionParameters = function setTimeCorrectionParameters(buffer, parameters) {
      buffer.setUint8(parameters.monthTransitionSummer);
      buffer.setUint8(parameters.dateTransitionSummer);
      buffer.setUint8(parameters.hoursTransitionSummer);
      buffer.setUint8(parameters.hoursCorrectSummer);
      buffer.setUint8(parameters.monthTransitionWinter);
      buffer.setUint8(parameters.dateTransitionWinter);
      buffer.setUint8(parameters.hoursTransitionWinter);
      buffer.setUint8(parameters.hoursCorrectWinter);
      buffer.setUint8(+parameters.isCorrectionNeeded);
    };
    var setDayProfile$2 = function setDayProfile(buffer, dayProfile) {
      buffer.setUint8(getByteFromDayProfile(dayProfile));
    };
    var getSeasonProfile$2 = function getSeasonProfile(buffer) {
      return {
        month: buffer.getUint8(),
        date: buffer.getUint8(),
        dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(function () {
          return buffer.getUint8();
        })
      };
    };
    var setSeasonProfile$2 = function setSeasonProfile(buffer, seasonProfile) {
      buffer.setUint8(seasonProfile.month);
      buffer.setUint8(seasonProfile.date);
      seasonProfile.dayIndexes.forEach(function (value) {
        return buffer.setUint8(value);
      });
    };
    var getSpecialDay$2 = function getSpecialDay(buffer) {
      return {
        month: buffer.getUint8(),
        date: buffer.getUint8(),
        dayIndex: buffer.getUint8(),
        year: buffer.getUint8()
      };
    };
    var setSpecialDay$2 = function setSpecialDay(buffer, specialDay) {
      buffer.setUint8(specialDay.month);
      buffer.setUint8(specialDay.date);
      buffer.setUint8(specialDay.dayIndex);
      buffer.setUint8(specialDay.year);
    };
    var getDeviceType$2 = function getDeviceType(buffer) {
      return fromBytes$26(buffer.getBytes(9));
    };
    var setDeviceType = function setDeviceType(buffer, deviceType) {
      buffer.setBytes(toBytes$27(deviceType));
    };
    var getOperatorParameters$2 = function getOperatorParameters(buffer) {
      var operatorParameters = {
        vpThreshold: buffer.getUint32(),
        vThreshold: buffer.getUint32(),
        ipThreshold: buffer.getUint32(),
        pmaxThreshold0: buffer.getUint32(),
        pmaxThreshold1: buffer.getUint32(),
        pmaxThreshold2: buffer.getUint32(),
        pmaxThreshold3: buffer.getUint32(),
        serialPortsSpeed: getSerialPortsSpeed(buffer.getUint8()),
        tint: buffer.getUint8(),
        calcPeriodDate: buffer.getUint8(),
        timeoutDisplay: buffer.getUint8(),
        timeoutScreen: buffer.getUint8(),
        displaySet: toObject(displaySetMask, buffer.getUint32()),
        relaySet4: toObject(relaySet4Mask, buffer.getUint8()),
        relaySet3: toObject(relaySet3Mask, buffer.getUint8()),
        relaySet2: toObject(relaySet2Mask, buffer.getUint8()),
        relaySet1: toObject(relaySet1Mask, buffer.getUint8()),
        displayType: buffer.getUint8(),
        ten: buffer.getUint8(),
        timeoutRefresh: buffer.getUint16(),
        deltaCorMin: buffer.getUint8(),
        timeoutMagnetOff: buffer.getUint8(),
        timeoutMagnetOn: buffer.getUint8(),
        define1: toObject(define1Mask, buffer.getUint8()),
        timeoutRelayOn: buffer.getUint8(),
        timeoutRelayKey: buffer.getUint8(),
        timeoutRelayAuto: buffer.getUint8(),
        timeoutBadVAVB: buffer.getUint8(),
        freqMax: buffer.getUint8(),
        freqMin: buffer.getUint8(),
        phMin: buffer.getUint16(),
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        date: buffer.getUint8(),
        energyDecimalPoint: buffer.getUint8(),
        typeMeter: buffer.getUint8(),
        timeoutIMax: buffer.getUint8(),
        timeoutPMax: buffer.getUint8(),
        timeoutCos: buffer.getUint8(),
        pMaxDef: buffer.getUint8(),
        displaySetExt: toObject(displaySetExtMask, buffer.getUint32()),
        timeoutUneqCurrent: buffer.getUint8(),
        timeoutBipolarPower: buffer.getUint8(),
        relaySet5: toObject(relaySet5Mask, buffer.getUint8()),
        timeCorrectPeriod: 0,
        timeCorrectPassHalfhour: false
      };
      var timeCorrectPeriod = buffer.getUint8();
      operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
      operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);
      return operatorParameters;
    };
    var setOperatorParameters$2 = function setOperatorParameters(buffer, operatorParameters) {
      var timeCorrectPeriod = operatorParameters.timeCorrectPeriod | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);
      buffer.setUint32(operatorParameters.vpThreshold);
      buffer.setUint32(operatorParameters.vThreshold);
      buffer.setUint32(operatorParameters.ipThreshold);
      buffer.setUint32(operatorParameters.pmaxThreshold0);
      buffer.setUint32(operatorParameters.pmaxThreshold1);
      buffer.setUint32(operatorParameters.pmaxThreshold2);
      buffer.setUint32(operatorParameters.pmaxThreshold3);
      buffer.setUint8(setSerialPortsSpeed(operatorParameters.serialPortsSpeed));
      buffer.setUint8(operatorParameters.tint);
      buffer.setUint8(operatorParameters.calcPeriodDate);
      buffer.setUint8(operatorParameters.timeoutDisplay);
      buffer.setUint8(operatorParameters.timeoutScreen);
      buffer.setUint32(fromObject(displaySetMask, operatorParameters.displaySet));
      buffer.setUint8(fromObject(relaySet4Mask, operatorParameters.relaySet4));
      buffer.setUint8(fromObject(relaySet3Mask, operatorParameters.relaySet3));
      buffer.setUint8(fromObject(relaySet2Mask, operatorParameters.relaySet2));
      buffer.setUint8(fromObject(relaySet1Mask, operatorParameters.relaySet1));
      buffer.setUint8(operatorParameters.displayType);
      buffer.setUint8(operatorParameters.ten);
      buffer.setUint16(operatorParameters.timeoutRefresh);
      buffer.setUint8(operatorParameters.deltaCorMin);
      buffer.setUint8(operatorParameters.timeoutMagnetOff);
      buffer.setUint8(operatorParameters.timeoutMagnetOn);
      buffer.setUint8(fromObject(define1Mask, operatorParameters.define1));
      buffer.setUint8(operatorParameters.timeoutRelayOn);
      buffer.setUint8(operatorParameters.timeoutRelayKey);
      buffer.setUint8(operatorParameters.timeoutRelayAuto);
      buffer.setUint8(operatorParameters.timeoutBadVAVB);
      buffer.setUint8(operatorParameters.freqMax);
      buffer.setUint8(operatorParameters.freqMin);
      buffer.setUint16(operatorParameters.phMin);
      buffer.setUint8(operatorParameters.year);
      buffer.setUint8(operatorParameters.month);
      buffer.setUint8(operatorParameters.date);
      buffer.setUint8(operatorParameters.energyDecimalPoint);
      buffer.setUint8(operatorParameters.typeMeter);
      buffer.setUint8(operatorParameters.timeoutIMax);
      buffer.setUint8(operatorParameters.timeoutPMax);
      buffer.setUint8(operatorParameters.timeoutCos);
      buffer.setUint8(operatorParameters.pMaxDef);
      buffer.setUint32(fromObject(displaySetExtMask, operatorParameters.displaySetExt));
      buffer.setUint8(operatorParameters.timeoutUneqCurrent);
      buffer.setUint8(operatorParameters.timeoutBipolarPower);
      buffer.setUint8(fromObject(relaySet5Mask, operatorParameters.relaySet5));
      buffer.setUint8(timeCorrectPeriod);
    };
    var getPackedEnergyWithType = function getPackedEnergyWithType(buffer) {
      var _byte2 = buffer.getUint8();
      var energyType = extractBits(_byte2, TARIFF_NUMBER$1, 1);
      var energies = getPackedEnergies(buffer, energyType, _byte2);
      return {
        energyType: energyType,
        energies: energies
      };
    };
    var setPackedEnergyWithType = function setPackedEnergyWithType(buffer, _ref4) {
      var energyType = _ref4.energyType,
        energies = _ref4.energies;
      if (energyType) {
        setPackedEnergyType(buffer, energyType, energies);
      }
      energies.forEach(function (energy) {
        if (energy !== null) {
          buffer.setInt32(energy);
        }
      });
    };
    var getEnergies = function getEnergies(buffer) {
      return new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return buffer.getInt32();
      });
    };
    var setEnergies = function setEnergies(buffer, energies) {
      energies.forEach(function (value) {
        return buffer.setInt32(value);
      });
    };
    var getDate$1 = function getDate(buffer) {
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        date: buffer.getUint8()
      };
    };
    var setDate$1 = function setDate(buffer, date) {
      buffer.setUint8(date.year);
      buffer.setUint8(date.month);
      buffer.setUint8(date.date);
    };
    var getSaldoParameters$2 = function getSaldoParameters(buffer) {
      return {
        coefficients: new Array(4).fill(0).map(function () {
          return buffer.getUint32();
        }),
        decimalPointTariff: buffer.getUint8(),
        indicationThreshold: buffer.getInt32(),
        relayThreshold: buffer.getInt32(),
        mode: buffer.getUint8(),
        saldoOffTimeBegin: buffer.getUint8(),
        saldoOffTimeEnd: buffer.getUint8(),
        decimalPointIndication: buffer.getUint8(),
        powerThreshold: buffer.getUint32(),
        creditThreshold: buffer.getInt32()
      };
    };
    var setSaldoParameters$2 = function setSaldoParameters(buffer, saldoParameters) {
      saldoParameters.coefficients.forEach(function (value) {
        return buffer.setUint32(value);
      });
      buffer.setUint8(saldoParameters.decimalPointTariff);
      buffer.setInt32(saldoParameters.indicationThreshold);
      buffer.setInt32(saldoParameters.relayThreshold);
      buffer.setUint8(saldoParameters.mode);
      buffer.setUint8(saldoParameters.saldoOffTimeBegin);
      buffer.setUint8(saldoParameters.saldoOffTimeEnd);
      buffer.setUint8(saldoParameters.decimalPointIndication);
      buffer.setUint32(saldoParameters.powerThreshold);
      buffer.setInt32(saldoParameters.creditThreshold);
    };
    var getEnergyPeriods = function getEnergyPeriods(buffer, periodsNumber) {
      var periods = new Array(periodsNumber).fill(0).map(function () {
        return buffer.getUint16();
      });
      return periods.map(function (period) {
        return getEnergyPeriod(period);
      });
    };
    var setEnergyPeriods = function setEnergyPeriods(buffer, periods) {
      periods.forEach(function (period) {
        return setEnergyPeriod(buffer, period);
      });
    };
    var getEventStatus$2 = function getEventStatus(buffer) {
      var eventStatus = buffer.getUint16();
      return toObject(eventStatusMask, eventStatus);
    };
    var setEventStatus = function setEventStatus(buffer, parameters) {
      buffer.setUint16(fromObject(eventStatusMask, parameters));
    };
    var getExtendedCurrentValues2$2 = function getExtendedCurrentValues2(buffer) {
      var uBattery = buffer.getUint16();
      var relayStatus = toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8());
      var relayStatus2 = toObject(extendedCurrentValues2RelayStatus2Mask, buffer.getUint8());
      var status1 = toObject(extendedCurrentValues2Status1Mask, buffer.getUint8());
      var status2 = toObject(extendedCurrentValues2Status2Mask, buffer.getUint8());
      var status3 = toObject(extendedCurrentValues2Status3Mask, buffer.getUint8());
      return {
        uBattery: uBattery,
        relayStatus: relayStatus,
        relayStatus2: relayStatus2,
        status1: status1,
        status2: status2,
        status3: status3
      };
    };
    var setExtendedCurrentValues2 = function setExtendedCurrentValues2(buffer, parameters) {
      var uBattery = parameters.uBattery,
        relayStatus = parameters.relayStatus,
        relayStatus2 = parameters.relayStatus2,
        status1 = parameters.status1,
        status2 = parameters.status2,
        status3 = parameters.status3;
      buffer.setUint16(uBattery);
      buffer.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, relayStatus));
      buffer.setUint8(fromObject(extendedCurrentValues2RelayStatus2Mask, relayStatus2));
      buffer.setUint8(fromObject(extendedCurrentValues2Status1Mask, status1));
      buffer.setUint8(fromObject(extendedCurrentValues2Status2Mask, status2));
      buffer.setUint8(fromObject(extendedCurrentValues2Status3Mask, status3));
    };
    var getEvent = function getEvent(buffer) {
      var data = {
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        seconds: buffer.getUint8(),
        event: buffer.getUint8()
      };
      var event = data.event;
      var bytesLeft = buffer.bytesLeft;
      data.eventName = eventNames[event];
      switch (event) {
        case POWER_OVER_RELAY_OFF:
          if (bytesLeft < 4) {
            return data;
          }
          data.power = [buffer.getUint8(), buffer.getUint8(), buffer.getUint8(), buffer.getUint8()];
          break;
        case CMD_SET_DATETIME:
        case TIME_CORRECT:
          if (bytesLeft < 8) {
            return data;
          }
          data.newDate = getDateTime$2(buffer);
          break;
      }
      return data;
    };
    var setEvent = function setEvent(buffer, event) {
      buffer.setUint8(event.hours);
      buffer.setUint8(event.minutes);
      buffer.setUint8(event.seconds);
      buffer.setUint8(event.event);
      switch (event.event) {
        case POWER_OVER_RELAY_OFF:
          var _iterator = _createForOfIteratorHelper(event.power),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              buffer.setUint8(item);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          break;
        case CMD_SET_DATETIME:
        case TIME_CORRECT:
          setDateTime$2(buffer, event.newDate);
          break;
      }
    };
    var getDemand$2 = function getDemand(buffer) {
      var date0 = buffer.getUint8();
      var date1 = buffer.getUint8();
      return {
        date: {
          year: date0 >> 1,
          month: date0 << 3 & 0x0f | date1 >> 5,
          date: date1 & 0x1f
        },
        demandType: buffer.getUint8(),
        firstIndex: buffer.getUint16(),
        count: buffer.getUint8(),
        period: buffer.getUint8()
      };
    };
    var setDemand = function setDemand(buffer, parameters) {
      var date0 = parameters.date.year << 1 | parameters.date.month >> 3 & 0x01;
      var date1 = parameters.date.month << 5 & 0xe0 | parameters.date.date & 0x1f;
      buffer.setUint8(date0);
      buffer.setUint8(date1);
      buffer.setUint8(parameters.demandType);
      buffer.setUint16(parameters.firstIndex);
      buffer.setUint8(parameters.count);
      buffer.setUint8(parameters.period);
    };
    var getDemandParameters$2 = function getDemandParameters(buffer) {
      var channelParam1 = buffer.getUint8();
      var counterInterval = buffer.getUint8();
      var channelParam2 = buffer.getUint8();
      return {
        channelParam1: channelParam1,
        counterInterval: counterInterval,
        channelParam2: channelParam2
      };
    };
    var setDemandParameters$2 = function setDemandParameters(buffer, parameters) {
      buffer.setUint8(parameters.channelParam1);
      buffer.setUint8(parameters.counterInterval);
      buffer.setUint8(parameters.channelParam2);
      buffer.setUint8(0);
    };
    var getDayMaxDemandResponse = function getDayMaxDemandResponse(buffer) {
      var date = getDate$1(buffer);
      var power = new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return {
          hours: buffer.getUint8(),
          minutes: buffer.getUint8(),
          power: buffer.getUint32()
        };
      });
      return {
        date: date,
        power: power
      };
    };
    var setDayMaxDemandResponse = function setDayMaxDemandResponse(buffer, parameters) {
      setDate$1(buffer, parameters.date);
      parameters.power.forEach(function (value) {
        buffer.setUint8(value.hours);
        buffer.setUint8(value.minutes);
        buffer.setUint32(value.power);
      });
    };
    var getOperatorParametersExtended3$2 = function getOperatorParametersExtended3(buffer) {
      return {
        pmaxMinusThreshold0: buffer.getUint32(),
        pmaxMinusThreshold1: buffer.getUint32(),
        pmaxMinusThreshold2: buffer.getUint32(),
        pmaxMinusThreshold3: buffer.getUint32(),
        relaySet: toObject(operatorParametersExtended3RelaySetMask, buffer.getUint8())
      };
    };
    var setOperatorParametersExtended3$2 = function setOperatorParametersExtended3(buffer, parameters) {
      var pmaxMinusThreshold0 = parameters.pmaxMinusThreshold0,
        pmaxMinusThreshold1 = parameters.pmaxMinusThreshold1,
        pmaxMinusThreshold2 = parameters.pmaxMinusThreshold2,
        pmaxMinusThreshold3 = parameters.pmaxMinusThreshold3,
        relaySet = parameters.relaySet;
      buffer.setUint32(pmaxMinusThreshold0);
      buffer.setUint32(pmaxMinusThreshold1);
      buffer.setUint32(pmaxMinusThreshold2);
      buffer.setUint32(pmaxMinusThreshold3);
      buffer.setUint8(fromObject(operatorParametersExtended3RelaySetMask, relaySet));
    };
    var getMonthMaxPowerByTariffs = function getMonthMaxPowerByTariffs(buffer) {
      return new Array(TARIFF_NUMBER$1).fill(0).map(function () {
        return {
          date: buffer.getUint8(),
          hours: buffer.getUint8(),
          minutes: buffer.getUint8(),
          power: buffer.getUint32()
        };
      });
    };
    var setMonthMaxPowerByTariffs = function setMonthMaxPowerByTariffs(buffer, tariffs) {
      tariffs.forEach(function (tariff) {
        buffer.setUint8(tariff.date);
        buffer.setUint8(tariff.hours);
        buffer.setUint8(tariff.minutes);
        buffer.setUint32(tariff.power);
      });
    };
    var getPackedEnergiesWithDateSize = function getPackedEnergiesWithDateSize(parameters) {
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = parameters.energies.filter(function (energy) {
          return energy !== null;
        }).length;
        return DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      return DATE_SIZE$3 + ENERGY_SIZE * TARIFF_NUMBER$1;
    };

    var HEX = 1;

    var defaultFormatOptions = {
      bytesConversionFormat: HEX,
      bytesConversionFormatOptions: {}
    };

    var defaultDlmsJsonOptions = _objectSpread2(_objectSpread2({}, defaultFormatOptions), {}, {
      dlms: false
    });
    var toBytes$26 = function toBytes(commandId) {
      var commandBytes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return [commandId, commandBytes.length].concat(_toConsumableArray(commandBytes));
    };

    var id$25 = activateRatePlan$2;
    var name$25 = commandNames$1[activateRatePlan$2];
    var headerSize$25 = 2;
    var maxSize$25 = 1 + TARIFF_PLAN_SIZE;
    var accessLevel$25 = READ_WRITE;
    var isLoraOnly$25 = false;
    var examples$25 = {
      'set rate plan request': {
        id: id$25,
        name: name$25,
        headerSize: headerSize$25,
        maxSize: maxSize$25,
        accessLevel: accessLevel$25,
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
    var fromBytes$25 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        tariffTable: buffer.getUint8(),
        tariffPlan: getTariffPlan(buffer)
      };
    };
    var toBytes$25 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$25, false);
      buffer.setUint8(parameters.tariffTable);
      setTariffPlan(buffer, parameters.tariffPlan);
      return toBytes$26(id$25, buffer.data);
    };

    var activateRatePlan$1 = /*#__PURE__*/Object.freeze({
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

    var id$24 = getBv$2;
    var name$24 = commandNames$1[getBv$2];
    var headerSize$24 = 2;
    var accessLevel$24 = READ_ONLY;
    var maxSize$24 = 0;
    var isLoraOnly$24 = false;
    var examples$24 = {
      'simple request': {
        id: id$24,
        name: name$24,
        headerSize: headerSize$24,
        maxSize: maxSize$24,
        accessLevel: accessLevel$24,
        parameters: {},
        bytes: [0x70, 0x00]
      }
    };
    var fromBytes$24 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$24) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$24 = function toBytes() {
      return toBytes$26(id$24);
    };

    var getBv$1 = /*#__PURE__*/Object.freeze({
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

    var id$23 = getCorrectTime$2;
    var name$23 = commandNames$1[getCorrectTime$2];
    var headerSize$23 = 2;
    var maxSize$23 = 0;
    var accessLevel$23 = READ_ONLY;
    var isLoraOnly$23 = false;
    var examples$23 = {
      'simple request': {
        id: id$23,
        name: name$23,
        headerSize: headerSize$23,
        maxSize: maxSize$23,
        accessLevel: accessLevel$23,
        parameters: {},
        bytes: [0x3e, 0x00]
      }
    };
    var fromBytes$23 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$23) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$23 = function toBytes() {
      return toBytes$26(id$23);
    };

    var getCorrectTime$1 = /*#__PURE__*/Object.freeze({
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

    var id$22 = getCriticalEvent$2;
    var name$22 = commandNames$1[getCriticalEvent$2];
    var headerSize$22 = 2;
    var accessLevel$22 = READ_ONLY;
    var maxSize$22 = 2;
    var isLoraOnly$22 = false;
    var examples$22 = {
      'simple request': {
        id: id$22,
        name: name$22,
        headerSize: headerSize$22,
        accessLevel: accessLevel$22,
        maxSize: maxSize$22,
        parameters: {
          event: 1,
          name: 'MAGNETIC_ON',
          index: 2
        },
        bytes: [0x41, 0x02, 0x01, 0x02]
      },
      'the last event': {
        id: id$22,
        name: name$22,
        headerSize: headerSize$22,
        accessLevel: accessLevel$22,
        maxSize: maxSize$22,
        parameters: {
          event: 4,
          name: 'RESTART',
          index: 255
        },
        bytes: [0x41, 0x02, 0x04, 0xff]
      }
    };
    var fromBytes$22 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$22) {
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
    var toBytes$22 = function toBytes(parameters) {
      return toBytes$26(id$22, [parameters.event, parameters.index]);
    };

    var getCriticalEvent$1 = /*#__PURE__*/Object.freeze({
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

    var id$21 = getCurrentStatusMeter$2;
    var name$21 = commandNames$1[getCurrentStatusMeter$2];
    var headerSize$21 = 2;
    var accessLevel$21 = READ_ONLY;
    var maxSize$21 = 0;
    var isLoraOnly$21 = false;
    var examples$21 = {
      'simple request': {
        id: id$21,
        name: name$21,
        headerSize: headerSize$21,
        maxSize: maxSize$21,
        accessLevel: accessLevel$21,
        parameters: {},
        bytes: [0x39, 0x00]
      }
    };
    var fromBytes$21 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$21) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$21 = function toBytes() {
      return toBytes$26(id$21);
    };

    var getCurrentStatusMeter$1 = /*#__PURE__*/Object.freeze({
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

    var id$20 = getCurrentValues$2;
    var name$20 = commandNames$1[getCurrentValues$2];
    var headerSize$20 = 2;
    var maxSize$20 = 0;
    var accessLevel$20 = READ_ONLY;
    var isLoraOnly$20 = false;
    var examples$20 = {
      'simple request': {
        id: id$20,
        name: name$20,
        headerSize: headerSize$20,
        maxSize: maxSize$20,
        accessLevel: accessLevel$20,
        parameters: {},
        bytes: [0x0d, 0x00]
      }
    };
    var fromBytes$20 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$20) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$20 = function toBytes() {
      return toBytes$26(id$20);
    };

    var getCurrentValues$1 = /*#__PURE__*/Object.freeze({
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

    var id$1$ = getDateTime$3;
    var name$1$ = commandNames$1[getDateTime$3];
    var headerSize$1$ = 2;
    var maxSize$1$ = 0;
    var accessLevel$1$ = READ_ONLY;
    var isLoraOnly$1$ = false;
    var examples$1$ = {
      'simple request': {
        id: id$1$,
        name: name$1$,
        headerSize: headerSize$1$,
        maxSize: maxSize$1$,
        accessLevel: accessLevel$1$,
        parameters: {},
        bytes: [0x07, 0x00]
      }
    };
    var fromBytes$1$ = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1$) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1$ = function toBytes() {
      return toBytes$26(id$1$);
    };

    var getDateTime$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE$5 = 3;
    var MAX_COMMAND_SIZE$b = 4;
    var id$1_ = getDayDemand$2;
    var name$1_ = commandNames$1[getDayDemand$2];
    var headerSize$1_ = 2;
    var maxSize$1_ = MAX_COMMAND_SIZE$b;
    var accessLevel$1_ = READ_ONLY;
    var isLoraOnly$1_ = false;
    var examples$1_ = {
      'request day values for 2024.03.22 00:00:00 GMT': {
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
        bytes: [0x16, 0x03, 0x18, 0x03, 0x16]
      },
      'request day values with energy type for 2024.03.22 00:00:00 GMT': {
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
          },
          energyType: A_PLUS
        },
        bytes: [0x16, 0x04, 0x18, 0x03, 0x16, 0x01]
      }
    };
    var fromBytes$1_ = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes);
      if (bytes.length === MAX_COMMAND_SIZE$b) {
        return {
          date: getDate$1(buffer),
          energyType: buffer.getUint8()
        };
      }
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1_ = function toBytes(parameters) {
      var buffer = new BinaryBuffer(parameters !== null && parameters !== void 0 && parameters.energyType ? MAX_COMMAND_SIZE$b : MIN_COMMAND_SIZE$5);
      setDate$1(buffer, parameters === null || parameters === void 0 ? void 0 : parameters.date);
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        buffer.setUint8(parameters.energyType);
      }
      return toBytes$26(id$1_, buffer.data);
    };

    var getDayDemand$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE$4 = 3;
    var MAX_COMMAND_SIZE$a = 4;
    var id$1Z = getDayDemandExport$2;
    var name$1Z = commandNames$1[getDayDemandExport$2];
    var headerSize$1Z = 2;
    var maxSize$1Z = MAX_COMMAND_SIZE$a;
    var accessLevel$1Z = READ_ONLY;
    var isLoraOnly$1Z = false;
    var examples$1Z = {
      'request day values for 2024.03.22 00:00:00 GMT': {
        id: id$1Z,
        name: name$1Z,
        headerSize: headerSize$1Z,
        maxSize: maxSize$1Z,
        accessLevel: accessLevel$1Z,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          }
        },
        bytes: [0x4f, 0x03, 0x18, 0x03, 0x16]
      },
      'request day values with energy type for 2024.03.22 00:00:00 GMT': {
        id: id$1Z,
        name: name$1Z,
        headerSize: headerSize$1Z,
        maxSize: maxSize$1Z,
        accessLevel: accessLevel$1Z,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: A_PLUS
        },
        bytes: [0x4f, 0x04, 0x18, 0x03, 0x16, 0x01]
      }
    };
    var fromBytes$1Z = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      if (bytes.length === MAX_COMMAND_SIZE$a) {
        return {
          date: getDate$1(buffer),
          energyType: buffer.getUint8()
        };
      }
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1Z = function toBytes(parameters) {
      var buffer = new BinaryBuffer(parameters !== null && parameters !== void 0 && parameters.energyType ? MAX_COMMAND_SIZE$a : MIN_COMMAND_SIZE$4, false);
      setDate$1(buffer, parameters === null || parameters === void 0 ? void 0 : parameters.date);
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        buffer.setUint8(parameters.energyType);
      }
      return toBytes$26(id$1Z, buffer.data);
    };

    var getDayDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    var id$1Y = getDayMaxDemand$2;
    var name$1Y = commandNames$1[getDayMaxDemand$2];
    var headerSize$1Y = 2;
    var maxSize$1Y = 3;
    var accessLevel$1Y = READ_ONLY;
    var isLoraOnly$1Y = false;
    var examples$1Y = {
      'request for 2024.03.22': {
        id: id$1Y,
        name: name$1Y,
        headerSize: headerSize$1Y,
        maxSize: maxSize$1Y,
        accessLevel: accessLevel$1Y,
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
    var fromBytes$1Y = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1Y = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1Y, false);
      setDate$1(buffer, parameters.date);
      return toBytes$26(id$1Y, buffer.data);
    };

    var getDayMaxDemand$1 = /*#__PURE__*/Object.freeze({
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

    var id$1X = getDayMaxDemandExport$2;
    var name$1X = commandNames$1[getDayMaxDemandExport$2];
    var headerSize$1X = 2;
    var maxSize$1X = 3;
    var accessLevel$1X = READ_ONLY;
    var isLoraOnly$1X = false;
    var examples$1X = {
      'request for 2024.03.22': {
        id: id$1X,
        name: name$1X,
        headerSize: headerSize$1X,
        maxSize: maxSize$1X,
        accessLevel: accessLevel$1X,
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
    var fromBytes$1X = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1X = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1X, false);
      setDate$1(buffer, parameters.date);
      return toBytes$26(id$1X, buffer.data);
    };

    var getDayMaxDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    var id$1W = getDayMaxDemandPrevious$2;
    var name$1W = commandNames$1[getDayMaxDemandPrevious$2];
    var headerSize$1W = 2;
    var accessLevel$1W = READ_ONLY;
    var maxSize$1W = 0;
    var isLoraOnly$1W = false;
    var examples$1W = {
      'simple request': {
        id: id$1W,
        name: name$1W,
        headerSize: headerSize$1W,
        maxSize: maxSize$1W,
        accessLevel: accessLevel$1W,
        parameters: {},
        bytes: [0x4a, 0x00]
      }
    };
    var fromBytes$1W = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1W) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1W = function toBytes() {
      return toBytes$26(id$1W);
    };

    var getDayMaxDemandPrevious$1 = /*#__PURE__*/Object.freeze({
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

    var id$1V = getDayProfile$2;
    var name$1V = commandNames$1[getDayProfile$2];
    var headerSize$1V = 2;
    var maxSize$1V = 3;
    var accessLevel$1V = READ_ONLY;
    var isLoraOnly$1V = false;
    var examples$1V = {
      'request for active tariff table A+': {
        id: id$1V,
        name: name$1V,
        maxSize: maxSize$1V,
        headerSize: headerSize$1V,
        accessLevel: accessLevel$1V,
        parameters: {
          tariffTable: 0,
          index: 3,
          isActive: true
        },
        bytes: [0x3b, 0x03, 0x00, 0x03, 0x00]
      }
    };
    var fromBytes$1V = function fromBytes(_ref) {
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
    var toBytes$1V = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1V, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$26(id$1V, buffer.data);
    };

    var getDayProfile$1 = /*#__PURE__*/Object.freeze({
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

    var id$1U = getDemand$3;
    var name$1U = commandNames$1[getDemand$3];
    var headerSize$1U = 2;
    var maxSize$1U = 7;
    var accessLevel$1U = READ_ONLY;
    var isLoraOnly$1U = false;
    var examples$1U = {
      'request for A+': {
        id: id$1U,
        name: name$1U,
        headerSize: headerSize$1U,
        maxSize: maxSize$1U,
        parameters: {
          date: {
            year: 21,
            month: 6,
            date: 18
          },
          demandType: A_PLUS$1,
          firstIndex: 0,
          count: 2,
          period: 30
        },
        bytes: [0x76, 0x07, 0x2a, 0xd2, 0x01, 0x00, 0x00, 0x02, 0x1e]
      }
    };
    var fromBytes$1U = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDemand$2(buffer);
    };
    var toBytes$1U = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1U, false);
      setDemand(buffer, parameters);
      return toBytes$26(id$1U, buffer.data);
    };

    var getDemand$1 = /*#__PURE__*/Object.freeze({
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

    var validateCommandPayload = (function (commandName, bytes, expectedLength) {
      if (!commandName) {
        throw new Error('Command name is required.');
      }
      if (bytes && !Array.isArray(bytes)) {
        throw new Error("Invalid payload for ".concat(commandName, ". Expected array, got: ").concat(_typeof(bytes), "."));
      }
      if (bytes.length !== expectedLength) {
        var hex = getHexFromBytes(bytes, {
          separator: ''
        });
        throw new Error("Wrong buffer size for ".concat(commandName, ": ").concat(bytes.length, ". Expected: ").concat(expectedLength, ". Payload: 0x").concat(hex, "."));
      }
    });

    var id$1T = getDemandParameters$3;
    var name$1T = commandNames$1[getDemandParameters$3];
    var headerSize$1T = 2;
    var maxSize$1T = 0;
    var accessLevel$1T = READ_ONLY;
    var isLoraOnly$1T = false;
    var examples$1T = {
      'simple request': {
        id: id$1T,
        name: name$1T,
        headerSize: headerSize$1T,
        maxSize: maxSize$1T,
        parameters: {},
        bytes: [0x75, 0x00]
      }
    };
    var fromBytes$1T = function fromBytes(bytes) {
      validateCommandPayload(name$1T, bytes, maxSize$1T);
      return {};
    };
    var toBytes$1T = function toBytes() {
      return toBytes$26(id$1T);
    };

    var getDemandParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1S = getDeviceId$3;
    var name$1S = commandNames$1[getDeviceId$3];
    var headerSize$1S = 2;
    var accessLevel$1S = READ_ONLY;
    var maxSize$1S = 0;
    var isLoraOnly$1S = false;
    var examples$1S = {
      'simple request': {
        id: id$1S,
        name: name$1S,
        headerSize: headerSize$1S,
        accessLevel: accessLevel$1S,
        maxSize: maxSize$1S,
        parameters: {},
        bytes: [0x05, 0x00]
      }
    };
    var fromBytes$1S = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1S) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1S = function toBytes() {
      return toBytes$26(id$1S);
    };

    var getDeviceId$1 = /*#__PURE__*/Object.freeze({
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

    var id$1R = getDeviceType$3;
    var name$1R = commandNames$1[getDeviceType$3];
    var headerSize$1R = 2;
    var accessLevel$1R = READ_ONLY;
    var maxSize$1R = 0;
    var isLoraOnly$1R = false;
    var examples$1R = {
      'simple request': {
        id: id$1R,
        name: name$1R,
        headerSize: headerSize$1R,
        maxSize: maxSize$1R,
        accessLevel: accessLevel$1R,
        parameters: {},
        bytes: [0x04, 0x00]
      }
    };
    var fromBytes$1R = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1R) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1R = function toBytes() {
      return toBytes$26(id$1R);
    };

    var getDeviceType$1 = /*#__PURE__*/Object.freeze({
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

    var id$1Q = getDisplayParam$2;
    var name$1Q = commandNames$1[getDisplayParam$2];
    var headerSize$1Q = 2;
    var maxSize$1Q = 1;
    var accessLevel$1Q = READ_ONLY;
    var isLoraOnly$1Q = false;
    var examples$1Q = {
      'get additional display parameters': {
        id: id$1Q,
        name: name$1Q,
        headerSize: headerSize$1Q,
        maxSize: maxSize$1Q,
        accessLevel: accessLevel$1Q,
        parameters: {
          displayMode: ADDITIONAL
        },
        bytes: [0x5e, 0x01, 0x01]
      }
    };
    var fromBytes$1Q = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        displayMode = _ref2[0];
      return {
        displayMode: displayMode
      };
    };
    var toBytes$1Q = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1Q, false);
      buffer.setUint8(parameters.displayMode);
      return toBytes$26(id$1Q, buffer.data);
    };

    var getDisplayParam$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE$3 = 0;
    var MAX_COMMAND_SIZE$9 = 1;
    var id$1P = getEnergy$2;
    var name$1P = commandNames$1[getEnergy$2];
    var headerSize$1P = 2;
    var maxSize$1P = MAX_COMMAND_SIZE$9;
    var accessLevel$1P = READ_ONLY;
    var isLoraOnly$1P = false;
    var examples$1P = {
      'get default A+ energy': {
        id: id$1P,
        name: name$1P,
        headerSize: headerSize$1P,
        maxSize: maxSize$1P,
        accessLevel: accessLevel$1P,
        parameters: {},
        bytes: [0x0f, 0x00]
      },
      'get A- energy': {
        id: id$1P,
        name: name$1P,
        headerSize: headerSize$1P,
        maxSize: maxSize$1P,
        accessLevel: accessLevel$1P,
        parameters: {
          energyType: A_MINUS
        },
        bytes: [0x0f, 0x01, 0x02]
      }
    };
    var fromBytes$1P = function fromBytes(bytes) {
      if (bytes.length === MAX_COMMAND_SIZE$9) {
        return {
          energyType: bytes[0]
        };
      }
      return {};
    };
    var toBytes$1P = function toBytes() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var buffer = new BinaryBuffer(parameters !== null && parameters !== void 0 && parameters.energyType ? MAX_COMMAND_SIZE$9 : MIN_COMMAND_SIZE$3, false);
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        buffer.setUint8(parameters.energyType);
      }
      return toBytes$26(id$1P, buffer.data);
    };

    var getEnergy$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE$2 = 0;
    var MAX_COMMAND_SIZE$8 = 1;
    var id$1O = getEnergyDayPrevious$2;
    var name$1O = commandNames$1[getEnergyDayPrevious$2];
    var headerSize$1O = 2;
    var maxSize$1O = MAX_COMMAND_SIZE$8;
    var accessLevel$1O = READ_ONLY;
    var isLoraOnly$1O = false;
    var examples$1O = {
      'simple request': {
        id: id$1O,
        name: name$1O,
        headerSize: headerSize$1O,
        maxSize: maxSize$1O,
        accessLevel: accessLevel$1O,
        parameters: {},
        bytes: [0x03, 0x00]
      },
      'request A- energy': {
        id: id$1O,
        name: name$1O,
        headerSize: headerSize$1O,
        maxSize: maxSize$1O,
        accessLevel: accessLevel$1O,
        parameters: {
          energyType: A_MINUS
        },
        bytes: [0x03, 0x01, 0x02]
      }
    };
    var fromBytes$1O = function fromBytes(bytes) {
      var length = bytes.length;
      if (length !== MAX_COMMAND_SIZE$8 && length !== MIN_COMMAND_SIZE$2) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      if (length === MAX_COMMAND_SIZE$8) {
        return {
          energyType: bytes[0]
        };
      }
      return {};
    };
    var toBytes$1O = function toBytes(parameters) {
      if (parameters.energyType) {
        return toBytes$26(id$1O, [parameters.energyType]);
      }
      return toBytes$26(id$1O);
    };

    var getEnergyDayPrevious$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE$1 = 0;
    var MAX_COMMAND_SIZE$7 = 1;
    var id$1N = getEnergyExport$2;
    var name$1N = commandNames$1[getEnergyExport$2];
    var headerSize$1N = 2;
    var maxSize$1N = MAX_COMMAND_SIZE$7;
    var accessLevel$1N = READ_ONLY;
    var isLoraOnly$1N = false;
    var examples$1N = {
      'get default A+ energy': {
        id: id$1N,
        name: name$1N,
        headerSize: headerSize$1N,
        maxSize: maxSize$1N,
        accessLevel: accessLevel$1N,
        parameters: {},
        bytes: [0x5b, 0x00]
      },
      'get A- energy': {
        id: id$1N,
        name: name$1N,
        headerSize: headerSize$1N,
        maxSize: maxSize$1N,
        accessLevel: accessLevel$1N,
        parameters: {
          energyType: A_MINUS
        },
        bytes: [0x5b, 0x01, 0x02]
      }
    };
    var fromBytes$1N = function fromBytes(bytes) {
      if (bytes.length === MAX_COMMAND_SIZE$7) {
        return {
          energyType: bytes[0]
        };
      }
      return {};
    };
    var toBytes$1N = function toBytes() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var buffer = new BinaryBuffer(parameters !== null && parameters !== void 0 && parameters.energyType ? MAX_COMMAND_SIZE$7 : MIN_COMMAND_SIZE$1, false);
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        buffer.setUint8(parameters.energyType);
      }
      return toBytes$26(id$1N, buffer.data);
    };

    var getEnergyExport$1 = /*#__PURE__*/Object.freeze({
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

    var MIN_COMMAND_SIZE = 0;
    var MAX_COMMAND_SIZE$6 = 1;
    var id$1M = getEnergyExportDayPrevious$2;
    var name$1M = commandNames$1[getEnergyExportDayPrevious$2];
    var headerSize$1M = 2;
    var maxSize$1M = MAX_COMMAND_SIZE$6;
    var accessLevel$1M = READ_ONLY;
    var isLoraOnly$1M = false;
    var examples$1M = {
      'simple request': {
        id: id$1M,
        name: name$1M,
        headerSize: headerSize$1M,
        maxSize: maxSize$1M,
        accessLevel: accessLevel$1M,
        parameters: {},
        bytes: [0x50, 0x00]
      },
      'request A- energy': {
        id: id$1M,
        name: name$1M,
        headerSize: headerSize$1M,
        maxSize: maxSize$1M,
        accessLevel: accessLevel$1M,
        parameters: {
          energyType: A_MINUS
        },
        bytes: [0x50, 0x01, 0x02]
      }
    };
    var fromBytes$1M = function fromBytes(bytes) {
      var length = bytes.length;
      if (length !== MAX_COMMAND_SIZE$6 && length !== MIN_COMMAND_SIZE) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      if (length === MAX_COMMAND_SIZE$6) {
        return {
          energyType: bytes[0]
        };
      }
      return {};
    };
    var toBytes$1M = function toBytes(parameters) {
      if (parameters.energyType) {
        return toBytes$26(id$1M, [parameters.energyType]);
      }
      return toBytes$26(id$1M);
    };

    var getEnergyExportDayPrevious$1 = /*#__PURE__*/Object.freeze({
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

    var id$1L = getEvents$2;
    var name$1L = commandNames$1[getEvents$2];
    var headerSize$1L = 2;
    var accessLevel$1L = READ_ONLY;
    var maxSize$1L = 4;
    var isLoraOnly$1L = false;
    var examples$1L = {
      'simple request': {
        id: id$1L,
        name: name$1L,
        headerSize: headerSize$1L,
        accessLevel: accessLevel$1L,
        maxSize: maxSize$1L,
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
    var fromBytes$1L = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1L) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new BinaryBuffer(bytes, false);
      var date = getDate$1(buffer);
      var offset = buffer.getUint8();
      return {
        date: date,
        offset: offset
      };
    };
    var toBytes$1L = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1L, false);
      setDate$1(buffer, parameters.date);
      buffer.setUint8(parameters.offset);
      return toBytes$26(id$1L, buffer.data);
    };

    var getEvents$1 = /*#__PURE__*/Object.freeze({
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

    var id$1K = getEventsCounters$2;
    var name$1K = commandNames$1[getEventsCounters$2];
    var headerSize$1K = 2;
    var accessLevel$1K = READ_ONLY;
    var maxSize$1K = 0;
    var isLoraOnly$1K = false;
    var examples$1K = {
      'simple request': {
        id: id$1K,
        name: name$1K,
        headerSize: headerSize$1K,
        accessLevel: accessLevel$1K,
        maxSize: maxSize$1K,
        parameters: {},
        bytes: [0x34, 0x00]
      }
    };
    var fromBytes$1K = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1K) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1K = function toBytes() {
      return toBytes$26(id$1K);
    };

    var getEventsCounters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1J = getEventStatus$3;
    var name$1J = commandNames$1[getEventStatus$3];
    var headerSize$1J = 2;
    var accessLevel$1J = READ_ONLY;
    var maxSize$1J = 0;
    var isLoraOnly$1J = false;
    var examples$1J = {
      'simple request': {
        id: id$1J,
        name: name$1J,
        headerSize: headerSize$1J,
        accessLevel: accessLevel$1J,
        maxSize: maxSize$1J,
        parameters: {},
        bytes: [0x01, 0x00]
      }
    };
    var fromBytes$1J = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1J) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1J = function toBytes() {
      return toBytes$26(id$1J);
    };

    var getEventStatus$1 = /*#__PURE__*/Object.freeze({
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

    var id$1I = getExtendedCurrentValues$2;
    var name$1I = commandNames$1[getExtendedCurrentValues$2];
    var headerSize$1I = 2;
    var maxSize$1I = 0;
    var accessLevel$1I = READ_ONLY;
    var isLoraOnly$1I = false;
    var examples$1I = {
      'simple request': {
        id: id$1I,
        name: name$1I,
        headerSize: headerSize$1I,
        maxSize: maxSize$1I,
        accessLevel: accessLevel$1I,
        parameters: {},
        bytes: [0x3a, 0x00]
      }
    };
    var fromBytes$1I = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1I) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1I = function toBytes() {
      return toBytes$26(id$1I);
    };

    var getExtendedCurrentValues$1 = /*#__PURE__*/Object.freeze({
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

    var id$1H = getExtendedCurrentValues2$3;
    var name$1H = commandNames$1[getExtendedCurrentValues2$3];
    var headerSize$1H = 2;
    var accessLevel$1H = READ_ONLY;
    var maxSize$1H = 0;
    var isLoraOnly$1H = false;
    var examples$1H = {
      'simple request': {
        id: id$1H,
        name: name$1H,
        headerSize: headerSize$1H,
        maxSize: maxSize$1H,
        accessLevel: accessLevel$1H,
        parameters: {},
        bytes: [0x2d, 0x00]
      }
    };
    var fromBytes$1H = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1H) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1H = function toBytes() {
      return toBytes$26(id$1H);
    };

    var getExtendedCurrentValues2$1 = /*#__PURE__*/Object.freeze({
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

    var id$1G = getHalfHourDemand$2;
    var name$1G = commandNames$1[getHalfHourDemand$2];
    var headerSize$1G = 2;
    var maxSize$1G = 3;
    var accessLevel$1G = READ_ONLY;
    var isLoraOnly$1G = false;
    var examples$1G = {
      'request archive values for 2024.03.22': {
        id: id$1G,
        name: name$1G,
        headerSize: headerSize$1G,
        maxSize: maxSize$1G,
        accessLevel: accessLevel$1G,
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
    var fromBytes$1G = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1G = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1G, false);
      setDate$1(buffer, parameters.date);
      return toBytes$26(id$1G, buffer.data);
    };

    var getHalfHourDemand$1 = /*#__PURE__*/Object.freeze({
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

    var id$1F = getHalfHourDemandExport$2;
    var name$1F = commandNames$1[getHalfHourDemandExport$2];
    var headerSize$1F = 2;
    var maxSize$1F = 3;
    var accessLevel$1F = READ_ONLY;
    var isLoraOnly$1F = false;
    var examples$1F = {
      'request archive values for 2024.03.22': {
        id: id$1F,
        name: name$1F,
        headerSize: headerSize$1F,
        maxSize: maxSize$1F,
        accessLevel: accessLevel$1F,
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
    var fromBytes$1F = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate$1(buffer)
      };
    };
    var toBytes$1F = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1F, false);
      setDate$1(buffer, parameters.date);
      return toBytes$26(id$1F, buffer.data);
    };

    var getHalfHourDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    var id$1E = getHalfHourDemandPrevious$2;
    var name$1E = commandNames$1[getHalfHourDemandPrevious$2];
    var headerSize$1E = 2;
    var accessLevel$1E = READ_ONLY;
    var maxSize$1E = 0;
    var isLoraOnly$1E = false;
    var examples$1E = {
      'simple request': {
        id: id$1E,
        name: name$1E,
        headerSize: headerSize$1E,
        maxSize: maxSize$1E,
        accessLevel: accessLevel$1E,
        parameters: {},
        bytes: [0x4b, 0x00]
      }
    };
    var fromBytes$1E = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1E) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1E = function toBytes() {
      return toBytes$26(id$1E);
    };

    var getHalfHourDemandPrevious$1 = /*#__PURE__*/Object.freeze({
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
    var getEnergiesFlagsLocal = function getEnergiesFlagsLocal(energies) {
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
    var getDate = function getDate(buffer) {
      var date0 = buffer.getUint8();
      var date1 = buffer.getUint8();
      return {
        year: date0 >> 1,
        month: date0 << 3 & 0x0f | date1 >> 5,
        date: date1 & 0x1f
      };
    };
    var setDate = function setDate(buffer, _ref) {
      var year = _ref.year,
        month = _ref.month,
        date = _ref.date;
      var date0 = year << 1 | month >> 3 & 0x01;
      var date1 = month << 5 & 0xe0 | date & 0x1f;
      buffer.setUint8(date0);
      buffer.setUint8(date1);
    };
    var getEnergiesFlags = function getEnergiesFlags(buffer) {
      var _byte = buffer.getUint8();
      return toObject(energiesMask, _byte);
    };
    var setEnergiesFlags = function setEnergiesFlags(buffer, energies) {
      buffer.setUint8(getEnergiesFlagsLocal(energies));
    };
    var getHalfHourEnergy1 = function getHalfHourEnergy1(buffer, halfhoursNumber) {
      var halfhours = [];
      for (var index = 0; index < halfhoursNumber; index++) {
        var value = buffer.getUint16();
        var tariff = value >> 14 & 3;
        var energy = value & 16383;
        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : {
          tariff: tariff,
          energy: energy
        });
      }
      return halfhours;
    };
    var setHalfHourEnergy1 = function setHalfHourEnergy1(buffer, halfhours) {
      if (halfhours) {
        for (var index = 0; index < halfhours.length; index++) {
          var _halfhours$index = halfhours[index],
            tariff = _halfhours$index.tariff,
            energy = _halfhours$index.energy;
          var value = tariff << 14 | energy;
          buffer.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
      }
    };
    var getHalfHourEnergies1 = function getHalfHourEnergies1(buffer, energiesFlags, halfhoursNumber) {
      var energies = {};
      ENERGY_NAMES.forEach(function (energyName) {
        if (energiesFlags[energyName]) {
          energies[energyName] = getHalfHourEnergy1(buffer, halfhoursNumber);
        }
      });
      return energies;
    };
    var setHalfHourEnergies1 = function setHalfHourEnergies1(buffer, energies) {
      ENERGY_NAMES.forEach(function (energyName) {
        setHalfHourEnergy1(buffer, energies[energyName]);
      });
    };
    var getAPlusTariffEnergies = function getAPlusTariffEnergies(buffer, energyFlags) {
      var energies = {};
      if (energyFlags & energiesMask['A+']) {
        energies['A+'] = buffer.getUint32();
      }
      if (energyFlags & energiesMask['A+R+']) {
        energies['A+R+'] = buffer.getUint32();
      }
      if (energyFlags & energiesMask['A+R-']) {
        energies['A+R-'] = buffer.getUint32();
      }
      return energies;
    };
    var setAPlusTariffEnergies = function setAPlusTariffEnergies(buffer, energies) {
      if (energies) {
        if (energies['A+']) {
          buffer.setUint32(energies['A+']);
        }
        if (energies['A+R+']) {
          buffer.setUint32(energies['A+R+']);
        }
        if (energies['A+R-']) {
          buffer.setUint32(energies['A+R-']);
        }
      }
    };
    var getAMinusTariffEnergies = function getAMinusTariffEnergies(buffer, energyFlags) {
      var energies = {};
      if (energyFlags & energiesMask['A-']) {
        energies['A-'] = buffer.getUint32();
      }
      if (energyFlags & energiesMask['A-R+']) {
        energies['A-R+'] = buffer.getUint32();
      }
      if (energyFlags & energiesMask['A-R-']) {
        energies['A-R-'] = buffer.getUint32();
      }
      return energies;
    };
    var setAMinusTariffEnergies = function setAMinusTariffEnergies(buffer, energies) {
      if (energies) {
        if (energies['A-']) {
          buffer.setUint32(energies['A-']);
        }
        if (energies['A-R+']) {
          buffer.setUint32(energies['A-R+']);
        }
        if (energies['A-R-']) {
          buffer.setUint32(energies['A-R-']);
        }
      }
    };
    var getTariffsEnergies = function getTariffsEnergies(buffer) {
      var energyFlags = buffer.getUint8();
      var tariffFlags = buffer.getUint8();
      var tariffs = new Array(TARIFF_NUMBER).fill(null);
      for (var index = 0; index < TARIFF_NUMBER; index++) {
        if (tariffFlags & getAPlusTariffBit(index)) {
          tariffs[index] = getAPlusTariffEnergies(buffer, energyFlags);
        }
      }
      for (var _index = 0; _index < TARIFF_NUMBER; _index++) {
        if (tariffFlags & getAMinusTariffBit(_index)) {
          tariffs[_index] = _objectSpread2(_objectSpread2({}, tariffs[_index]), getAMinusTariffEnergies(buffer, energyFlags));
        }
      }
      return tariffs;
    };
    var setTariffsEnergies = function setTariffsEnergies(buffer, tariffs) {
      var energiesFlags = 0;
      var tariffsFlags = 0;
      tariffs.forEach(function (tariff, index) {
        if (tariff) {
          energiesFlags |= getEnergiesFlagsLocal(tariff);
          tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
      });
      buffer.setUint8(energiesFlags);
      buffer.setUint8(tariffsFlags);
      tariffs.forEach(function (tariff) {
        return setAPlusTariffEnergies(buffer, tariff);
      });
      tariffs.forEach(function (tariff) {
        return setAMinusTariffEnergies(buffer, tariff);
      });
    };
    var getPowerMax = function getPowerMax(buffer) {
      return {
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        power: buffer.getUint32()
      };
    };
    var setPowerMax = function setPowerMax(buffer, value) {
      if (value) {
        var hours = value.hours,
          minutes = value.minutes,
          power = value.power;
        buffer.setUint8(hours);
        buffer.setUint8(minutes);
        buffer.setUint32(power);
      }
    };
    var getAPlusTariffPowerMax = function getAPlusTariffPowerMax(buffer, energyFlags) {
      var energies = {};
      if (energyFlags & energiesMask['A+']) {
        energies['A+'] = getPowerMax(buffer);
      }
      if (energyFlags & energiesMask['A+R+']) {
        energies['A+R+'] = getPowerMax(buffer);
      }
      if (energyFlags & energiesMask['A+R-']) {
        energies['A+R-'] = getPowerMax(buffer);
      }
      return energies;
    };
    var setAPlusTariffPowerMax = function setAPlusTariffPowerMax(buffer, energies) {
      if (energies) {
        setPowerMax(buffer, energies['A+']);
        setPowerMax(buffer, energies['A+R+']);
        setPowerMax(buffer, energies['A+R+']);
      }
    };
    var getAMinusTariffPowerMax = function getAMinusTariffPowerMax(buffer, energyFlags) {
      var energies = {};
      if (energyFlags & energiesMask['A-']) {
        energies['A-'] = getPowerMax(buffer);
      }
      if (energyFlags & energiesMask['A-R+']) {
        energies['A-R+'] = getPowerMax(buffer);
      }
      if (energyFlags & energiesMask['A-R-']) {
        energies['A-R-'] = getPowerMax(buffer);
      }
      return energies;
    };
    var setAMinusTariffPowerMax = function setAMinusTariffPowerMax(buffer, energies) {
      if (energies) {
        setPowerMax(buffer, energies['A-']);
        setPowerMax(buffer, energies['A-R+']);
        setPowerMax(buffer, energies['A-R-']);
      }
    };
    var getTariffsPowerMax = function getTariffsPowerMax(buffer) {
      var energyFlags = buffer.getUint8();
      var tariffFlags = buffer.getUint8();
      var tariffs = new Array(TARIFF_NUMBER).fill(null);
      for (var index = 0; index < TARIFF_NUMBER; index++) {
        if (tariffFlags & getAPlusTariffBit(index)) {
          tariffs[index] = getAPlusTariffPowerMax(buffer, energyFlags);
        }
      }
      for (var _index2 = 0; _index2 < TARIFF_NUMBER; _index2++) {
        if (tariffFlags & getAMinusTariffBit(_index2)) {
          tariffs[_index2] = _objectSpread2(_objectSpread2({}, tariffs[_index2]), getAMinusTariffPowerMax(buffer, energyFlags));
        }
      }
      return tariffs;
    };
    var setTariffsPowerMax = function setTariffsPowerMax(buffer, tariffs) {
      var energiesFlags = 0;
      var tariffsFlags = 0;
      tariffs.forEach(function (tariff, index) {
        if (tariff) {
          energiesFlags |= getEnergiesFlagsLocal(tariff);
          tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
      });
      buffer.setUint8(energiesFlags);
      buffer.setUint8(tariffsFlags);
      tariffs.forEach(function (tariff) {
        return setAPlusTariffPowerMax(buffer, tariff);
      });
      tariffs.forEach(function (tariff) {
        return setAMinusTariffPowerMax(buffer, tariff);
      });
    };

    var id$1D = getHalfHourEnergies$2;
    var name$1D = commandNames$1[getHalfHourEnergies$2];
    var headerSize$1D = 2;
    var maxSize$1D = 5;
    var accessLevel$1D = UNENCRYPTED;
    var isLoraOnly$1D = true;
    var examples$1D = {
      'request for halfhours energies': {
        id: id$1D,
        name: name$1D,
        headerSize: headerSize$1D,
        maxSize: maxSize$1D,
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
    var fromBytes$1D = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate(buffer),
        energies: getEnergiesFlags(buffer),
        firstHalfhour: buffer.getUint8(),
        halfhoursNumber: buffer.getUint8()
      };
    };
    var toBytes$1D = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1D, false);
      setDate(buffer, parameters.date);
      setEnergiesFlags(buffer, parameters.energies);
      buffer.setUint8(parameters.firstHalfhour);
      buffer.setUint8(parameters.halfhoursNumber);
      return toBytes$26(id$1D, buffer.data);
    };

    var getHalfHourEnergies$1 = /*#__PURE__*/Object.freeze({
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

    var id$1C = getMagneticFieldThreshold$2;
    var name$1C = commandNames$1[getMagneticFieldThreshold$2];
    var headerSize$1C = 2;
    var maxSize$1C = 0;
    var accessLevel$1C = READ_ONLY;
    var isLoraOnly$1C = false;
    var examples$1C = {
      'simple request': {
        id: id$1C,
        name: name$1C,
        headerSize: headerSize$1C,
        maxSize: maxSize$1C,
        accessLevel: accessLevel$1C,
        parameters: {},
        bytes: [0x6d, 0x00]
      }
    };
    var fromBytes$1C = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1C) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1C = function toBytes() {
      return toBytes$26(id$1C);
    };

    var getMagneticFieldThreshold$1 = /*#__PURE__*/Object.freeze({
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

    var id$1B = getMeterInfo$2;
    var name$1B = commandNames$1[getMeterInfo$2];
    var headerSize$1B = 2;
    var maxSize$1B = 0;
    var accessLevel$1B = READ_ONLY;
    var isLoraOnly$1B = false;
    var examples$1B = {
      'simple request': {
        id: id$1B,
        name: name$1B,
        headerSize: headerSize$1B,
        maxSize: maxSize$1B,
        accessLevel: accessLevel$1B,
        parameters: {},
        bytes: [0x7a, 0x00]
      }
    };
    var fromBytes$1B = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1B) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1B = function toBytes() {
      return toBytes$26(id$1B);
    };

    var getMeterInfo$1 = /*#__PURE__*/Object.freeze({
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

    var id$1A = getMonthDemand$2;
    var name$1A = commandNames$1[getMonthDemand$2];
    var headerSize$1A = 2;
    var maxSize$1A = 2;
    var accessLevel$1A = READ_ONLY;
    var isLoraOnly$1A = false;
    var examples$1A = {
      'request energy for 2024.03': {
        id: id$1A,
        name: name$1A,
        headerSize: headerSize$1A,
        maxSize: maxSize$1A,
        accessLevel: accessLevel$1A,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x17, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1A = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8()
      };
    };
    var toBytes$1A = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1A, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      return toBytes$26(id$1A, buffer.data);
    };

    var getMonthDemand$1 = /*#__PURE__*/Object.freeze({
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

    var id$1z = getMonthDemandExport$2;
    var name$1z = commandNames$1[getMonthDemandExport$2];
    var headerSize$1z = 2;
    var maxSize$1z = 2;
    var accessLevel$1z = READ_ONLY;
    var isLoraOnly$1z = false;
    var examples$1z = {
      'request energy for 2024.03': {
        id: id$1z,
        name: name$1z,
        headerSize: headerSize$1z,
        maxSize: maxSize$1z,
        accessLevel: accessLevel$1z,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x52, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1z = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8()
      };
    };
    var toBytes$1z = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1z, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      return toBytes$26(id$1z, buffer.data);
    };

    var getMonthDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    var id$1y = getMonthMaxDemand$2;
    var name$1y = commandNames$1[getMonthMaxDemand$2];
    var headerSize$1y = 2;
    var maxSize$1y = 2;
    var accessLevel$1y = READ_ONLY;
    var isLoraOnly$1y = false;
    var examples$1y = {
      'request max power for 2024.03': {
        id: id$1y,
        name: name$1y,
        headerSize: headerSize$1y,
        maxSize: maxSize$1y,
        accessLevel: accessLevel$1y,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x32, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1y = function fromBytes(bytes) {
      var _bytes = _slicedToArray(bytes, 2),
        year = _bytes[0],
        month = _bytes[1];
      return {
        year: year,
        month: month
      };
    };
    var toBytes$1y = function toBytes(_ref) {
      var year = _ref.year,
        month = _ref.month;
      return toBytes$26(id$1y, [year, month]);
    };

    var getMonthMaxDemand$1 = /*#__PURE__*/Object.freeze({
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

    var id$1x = getMonthMaxDemandExport$2;
    var name$1x = commandNames$1[getMonthMaxDemandExport$2];
    var headerSize$1x = 2;
    var maxSize$1x = 2;
    var accessLevel$1x = READ_ONLY;
    var isLoraOnly$1x = false;
    var examples$1x = {
      'request max power for 2024.03': {
        id: id$1x,
        name: name$1x,
        headerSize: headerSize$1x,
        maxSize: maxSize$1x,
        accessLevel: accessLevel$1x,
        parameters: {
          year: 24,
          month: 3
        },
        bytes: [0x59, 0x02, 0x18, 0x03]
      }
    };
    var fromBytes$1x = function fromBytes(bytes) {
      var _bytes = _slicedToArray(bytes, 2),
        year = _bytes[0],
        month = _bytes[1];
      return {
        year: year,
        month: month
      };
    };
    var toBytes$1x = function toBytes(_ref) {
      var year = _ref.year,
        month = _ref.month;
      return toBytes$26(id$1x, [year, month]);
    };

    var getMonthMaxDemandExport$1 = /*#__PURE__*/Object.freeze({
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

    var id$1w = getOperatorParameters$3;
    var name$1w = commandNames$1[getOperatorParameters$3];
    var headerSize$1w = 2;
    var maxSize$1w = 0;
    var accessLevel$1w = READ_ONLY;
    var isLoraOnly$1w = false;
    var examples$1w = {
      'simple request': {
        id: id$1w,
        name: name$1w,
        headerSize: headerSize$1w,
        maxSize: maxSize$1w,
        accessLevel: accessLevel$1w,
        parameters: {},
        bytes: [0x1e, 0x00]
      }
    };
    var fromBytes$1w = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1w) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1w = function toBytes() {
      return toBytes$26(id$1w);
    };

    var getOperatorParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1v = getOperatorParametersExtended3$3;
    var name$1v = commandNames$1[getOperatorParametersExtended3$3];
    var headerSize$1v = 2;
    var maxSize$1v = 0;
    var accessLevel$1v = READ_ONLY;
    var isLoraOnly$1v = false;
    var examples$1v = {
      'simple request': {
        id: id$1v,
        name: name$1v,
        headerSize: headerSize$1v,
        maxSize: maxSize$1v,
        accessLevel: accessLevel$1v,
        parameters: {},
        bytes: [0x71, 0x00]
      }
    };
    var fromBytes$1v = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1v) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1v = function toBytes() {
      return toBytes$26(id$1v);
    };

    var getOperatorParametersExtended3$1 = /*#__PURE__*/Object.freeze({
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

    var id$1u = getRatePlanInfo$2;
    var name$1u = commandNames$1[getRatePlanInfo$2];
    var headerSize$1u = 2;
    var maxSize$1u = 1;
    var accessLevel$1u = READ_ONLY;
    var isLoraOnly$1u = false;
    var examples$1u = {
      'request for table A-': {
        id: id$1u,
        name: name$1u,
        headerSize: headerSize$1u,
        maxSize: maxSize$1u,
        accessLevel: accessLevel$1u,
        parameters: {
          tariffTable: 1
        },
        bytes: [0x2c, 0x01, 0x01]
      }
    };
    var fromBytes$1u = function fromBytes(bytes) {
      return {
        tariffTable: bytes[0]
      };
    };
    var toBytes$1u = function toBytes(parameters) {
      return toBytes$26(id$1u, [parameters.tariffTable]);
    };

    var getRatePlanInfo$1 = /*#__PURE__*/Object.freeze({
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

    var id$1t = getSaldo$2;
    var name$1t = commandNames$1[getSaldo$2];
    var headerSize$1t = 2;
    var maxSize$1t = 0;
    var accessLevel$1t = READ_ONLY;
    var isLoraOnly$1t = false;
    var examples$1t = {
      'simple request': {
        id: id$1t,
        name: name$1t,
        headerSize: headerSize$1t,
        maxSize: maxSize$1t,
        accessLevel: accessLevel$1t,
        parameters: {},
        bytes: [0x29, 0x00]
      }
    };
    var fromBytes$1t = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1t) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1t = function toBytes() {
      return toBytes$26(id$1t);
    };

    var getSaldo$1 = /*#__PURE__*/Object.freeze({
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

    var id$1s = getSaldoParameters$3;
    var name$1s = commandNames$1[getSaldoParameters$3];
    var headerSize$1s = 2;
    var maxSize$1s = 0;
    var accessLevel$1s = READ_ONLY;
    var isLoraOnly$1s = false;
    var examples$1s = {
      'simple request': {
        id: id$1s,
        name: name$1s,
        headerSize: headerSize$1s,
        maxSize: maxSize$1s,
        accessLevel: accessLevel$1s,
        parameters: {},
        bytes: [0x2e, 0x00]
      }
    };
    var fromBytes$1s = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1s) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1s = function toBytes() {
      return toBytes$26(id$1s);
    };

    var getSaldoParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1r = getSeasonProfile$3;
    var name$1r = commandNames$1[getSeasonProfile$3];
    var headerSize$1r = 2;
    var maxSize$1r = 3;
    var accessLevel$1r = READ_ONLY;
    var isLoraOnly$1r = false;
    var examples$1r = {
      'request for passive tariff table A+': {
        id: id$1r,
        name: name$1r,
        headerSize: headerSize$1r,
        maxSize: maxSize$1r,
        accessLevel: accessLevel$1r,
        parameters: {
          tariffTable: 0,
          index: 5,
          isActive: false
        },
        bytes: [0x3c, 0x03, 0x00, 0x05, 0x01]
      }
    };
    var fromBytes$1r = function fromBytes(_ref) {
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
    var toBytes$1r = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1r, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$26(id$1r, buffer.data);
    };

    var getSeasonProfile$1 = /*#__PURE__*/Object.freeze({
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

    var id$1q = getSpecialDay$3;
    var name$1q = commandNames$1[getSpecialDay$3];
    var headerSize$1q = 2;
    var maxSize$1q = 3;
    var accessLevel$1q = READ_ONLY;
    var isLoraOnly$1q = false;
    var examples$1q = {
      'request for passive tariff table A+': {
        id: id$1q,
        name: name$1q,
        headerSize: headerSize$1q,
        maxSize: maxSize$1q,
        accessLevel: accessLevel$1q,
        parameters: {
          tariffTable: 0,
          index: 5,
          isActive: false
        },
        bytes: [0x3d, 0x03, 0x00, 0x05, 0x01]
      }
    };
    var fromBytes$1q = function fromBytes(_ref) {
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
    var toBytes$1q = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1q, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      buffer.setUint8(parameters.isActive ? 0 : 1);
      return toBytes$26(id$1q, buffer.data);
    };

    var getSpecialDay$1 = /*#__PURE__*/Object.freeze({
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

    var id$1p = getVersion$2;
    var name$1p = commandNames$1[getVersion$2];
    var headerSize$1p = 2;
    var maxSize$1p = 0;
    var accessLevel$1p = READ_ONLY;
    var isLoraOnly$1p = false;
    var examples$1p = {
      'simple request': {
        id: id$1p,
        name: name$1p,
        headerSize: headerSize$1p,
        maxSize: maxSize$1p,
        accessLevel: accessLevel$1p,
        parameters: {},
        bytes: [0x28, 0x00]
      }
    };
    var fromBytes$1p = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1p) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1p = function toBytes() {
      return toBytes$26(id$1p);
    };

    var getVersion$1 = /*#__PURE__*/Object.freeze({
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

    var id$1o = prepareRatePlan$2;
    var name$1o = commandNames$1[prepareRatePlan$2];
    var headerSize$1o = 2;
    var maxSize$1o = 5;
    var accessLevel$1o = READ_WRITE;
    var isLoraOnly$1o = false;
    var examples$1o = {
      'prepare rate plan request': {
        id: id$1o,
        name: name$1o,
        headerSize: headerSize$1o,
        maxSize: maxSize$1o,
        accessLevel: accessLevel$1o,
        parameters: {
          tariffTable: 0,
          id: 987654321
        },
        bytes: [0x14, 0x05, 0x00, 0x3a, 0xde, 0x68, 0xb1]
      }
    };
    var fromBytes$1o = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        tariffTable: buffer.getUint8(),
        id: buffer.getUint32()
      };
    };
    var toBytes$1o = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1o, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint32(parameters.id);
      return toBytes$26(id$1o, buffer.data);
    };

    var prepareRatePlan$1 = /*#__PURE__*/Object.freeze({
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

    var id$1n = resetPowerMaxDay$2;
    var name$1n = commandNames$1[resetPowerMaxDay$2];
    var headerSize$1n = 2;
    var maxSize$1n = 0;
    var accessLevel$1n = READ_WRITE;
    var isLoraOnly$1n = false;
    var examples$1n = {
      'simple request': {
        id: id$1n,
        name: name$1n,
        headerSize: headerSize$1n,
        maxSize: maxSize$1n,
        accessLevel: accessLevel$1n,
        parameters: {},
        bytes: [0x35, 0x00]
      }
    };
    var fromBytes$1n = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1n) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1n = function toBytes() {
      return toBytes$26(id$1n);
    };

    var resetPowerMaxDay$1 = /*#__PURE__*/Object.freeze({
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

    var id$1m = resetPowerMaxMonth$2;
    var name$1m = commandNames$1[resetPowerMaxMonth$2];
    var headerSize$1m = 2;
    var maxSize$1m = 0;
    var accessLevel$1m = READ_WRITE;
    var isLoraOnly$1m = false;
    var examples$1m = {
      'simple request': {
        id: id$1m,
        name: name$1m,
        headerSize: headerSize$1m,
        maxSize: maxSize$1m,
        accessLevel: accessLevel$1m,
        parameters: {},
        bytes: [0x36, 0x00]
      }
    };
    var fromBytes$1m = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1m) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1m = function toBytes() {
      return toBytes$26(id$1m);
    };

    var resetPowerMaxMonth$1 = /*#__PURE__*/Object.freeze({
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

    var id$1l = runTariffPlan$2;
    var name$1l = commandNames$1[runTariffPlan$2];
    var headerSize$1l = 2;
    var maxSize$1l = 1;
    var accessLevel$1l = READ_WRITE;
    var isLoraOnly$1l = false;
    var examples$1l = {
      'simple request': {
        id: id$1l,
        name: name$1l,
        headerSize: headerSize$1l,
        maxSize: maxSize$1l,
        accessLevel: accessLevel$1l,
        parameters: {
          tariffTable: 5
        },
        bytes: [0x46, 0x01, 0x05]
      }
    };
    var fromBytes$1l = function fromBytes(bytes) {
      return {
        tariffTable: bytes[0]
      };
    };
    var toBytes$1l = function toBytes(parameters) {
      return toBytes$26(id$1l, [parameters.tariffTable]);
    };

    var runTariffPlan$1 = /*#__PURE__*/Object.freeze({
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

    var KEY_SIZE = 16;
    var id$1k = setAccessKey$2;
    var name$1k = commandNames$1[setAccessKey$2];
    var headerSize$1k = 2;
    var maxSize$1k = 1 + KEY_SIZE;
    var accessLevel$1k = READ_WRITE;
    var isLoraOnly$1k = false;
    var examples$1k = {
      'set key for READ_ONLY access level': {
        id: id$1k,
        name: name$1k,
        headerSize: headerSize$1k,
        maxSize: maxSize$1k,
        accessLevel: accessLevel$1k,
        parameters: {
          accessLevel: READ_ONLY,
          key: [0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0]
        },
        bytes: [0x09, 0x11, 0x03, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00]
      }
    };
    var fromBytes$1k = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        accessLevel: buffer.getUint8(),
        key: buffer.getBytes(KEY_SIZE)
      };
    };
    var toBytes$1k = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1k, false);
      buffer.setUint8(parameters.accessLevel);
      buffer.setBytes(parameters.key);
      return toBytes$26(id$1k, buffer.data);
    };

    var setAccessKey$1 = /*#__PURE__*/Object.freeze({
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

    var id$1j = setCorrectDateTime$2;
    var name$1j = commandNames$1[setCorrectDateTime$2];
    var headerSize$1j = 2;
    var maxSize$1j = 2;
    var accessLevel$1j = READ_ONLY;
    var isLoraOnly$1j = false;
    var examples$1j = {
      'shift device time 5 seconds forward': {
        id: id$1j,
        name: name$1j,
        headerSize: headerSize$1j,
        maxSize: maxSize$1j,
        accessLevel: accessLevel$1j,
        parameters: {
          seconds: 5
        },
        bytes: [0x5c, 0x02, 0x00, 0x05]
      },
      'shift device time 5 seconds backward': {
        id: id$1j,
        name: name$1j,
        headerSize: headerSize$1j,
        maxSize: maxSize$1j,
        parameters: {
          seconds: -5
        },
        bytes: [0x5c, 0x02, 0xff, 0xfb]
      }
    };
    var fromBytes$1j = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1j) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new BinaryBuffer(bytes, false);
      return {
        seconds: buffer.getInt16()
      };
    };
    var toBytes$1j = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1j, false);
      buffer.setInt16(parameters.seconds);
      return toBytes$26(id$1j, buffer.data);
    };

    var setCorrectDateTime$1 = /*#__PURE__*/Object.freeze({
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

    var id$1i = setCorrectTime$2;
    var name$1i = commandNames$1[setCorrectTime$2];
    var headerSize$1i = 2;
    var maxSize$1i = 9;
    var accessLevel$1i = READ_WRITE;
    var isLoraOnly$1i = false;
    var examples$1i = {
      'default parameters': {
        id: id$1i,
        name: name$1i,
        headerSize: headerSize$1i,
        maxSize: maxSize$1i,
        accessLevel: accessLevel$1i,
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
    var fromBytes$1i = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1i) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new BinaryBuffer(bytes, false);
      return getTimeCorrectionParameters(buffer);
    };
    var toBytes$1i = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1i, false);
      setTimeCorrectionParameters(buffer, parameters);
      return toBytes$26(id$1i, buffer.data);
    };

    var setCorrectTime$1 = /*#__PURE__*/Object.freeze({
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

    var id$1h = setDateTime$3;
    var name$1h = commandNames$1[setDateTime$3];
    var headerSize$1h = 2;
    var maxSize$1h = 8;
    var accessLevel$1h = READ_ONLY;
    var isLoraOnly$1h = false;
    var examples$1h = {
      'time: 2024.02.19 18:31:55': {
        id: id$1h,
        name: name$1h,
        headerSize: headerSize$1h,
        maxSize: maxSize$1h,
        accessLevel: accessLevel$1h,
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
    var fromBytes$1h = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDateTime$2(buffer);
    };
    var toBytes$1h = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1h, false);
      setDateTime$2(buffer, parameters);
      return toBytes$26(id$1h, buffer.data);
    };

    var setDateTime$1 = /*#__PURE__*/Object.freeze({
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

    var MAX_PERIODS_NUMBER$1 = 8;
    var PERIODS_FINAL_BYTE$1 = 0xff;
    var id$1g = setDayProfile$3;
    var name$1g = commandNames$1[setDayProfile$3];
    var headerSize$1g = 2;
    var maxSize$1g = 2 + MAX_PERIODS_NUMBER$1;
    var accessLevel$1g = READ_WRITE;
    var isLoraOnly$1g = false;
    var examples$1g = {
      'set day profile with 1 period': {
        id: id$1g,
        name: name$1g,
        headerSize: headerSize$1g,
        maxSize: maxSize$1g,
        accessLevel: accessLevel$1g,
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
        id: id$1g,
        name: name$1g,
        headerSize: headerSize$1g,
        maxSize: maxSize$1g,
        accessLevel: accessLevel$1g,
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
        id: id$1g,
        name: name$1g,
        headerSize: headerSize$1g,
        maxSize: maxSize$1g,
        accessLevel: accessLevel$1g,
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
    var fromBytes$1g = function fromBytes(bytes) {
      var finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE$1);
      var cleanBytes = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
      var buffer = new BinaryBuffer(cleanBytes, false);
      return {
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8(),
        periods: _toConsumableArray(cleanBytes.slice(buffer.offset)).map(getDayProfileFromByte)
      };
    };
    var toBytes$1g = function toBytes(parameters) {
      var hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER$1;
      var size = 2 + parameters.periods.length + +hasPeriodsFinalByte;
      var buffer = new BinaryBuffer(size, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      parameters.periods.forEach(function (period) {
        setDayProfile$2(buffer, period);
      });
      if (hasPeriodsFinalByte) {
        buffer.setUint8(PERIODS_FINAL_BYTE$1);
      }
      return toBytes$26(id$1g, buffer.data);
    };

    var setDayProfile$1 = /*#__PURE__*/Object.freeze({
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

    var id$1f = setDemandParameters$3;
    var name$1f = commandNames$1[setDemandParameters$3];
    var headerSize$1f = 2;
    var maxSize$1f = 4;
    var accessLevel$1f = READ_WRITE;
    var isLoraOnly$1f = false;
    var examples$1f = {
      'simple request': {
        id: id$1f,
        name: name$1f,
        headerSize: headerSize$1f,
        maxSize: maxSize$1f,
        parameters: {
          channelParam1: 0,
          counterInterval: 20,
          channelParam2: 160
        },
        bytes: [0x74, 0x04, 0x00, 0x14, 0xa0, 0x00]
      }
    };
    var fromBytes$1f = function fromBytes(bytes) {
      validateCommandPayload(name$1f, bytes, maxSize$1f);
      var buffer = new BinaryBuffer(bytes, false);
      return getDemandParameters$2(buffer);
    };
    var toBytes$1f = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1f, false);
      setDemandParameters$2(buffer, parameters);
      return toBytes$26(id$1f, buffer.data);
    };

    var setDemandParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1e = setDisplayParam$2;
    var name$1e = commandNames$1[setDisplayParam$2];
    var headerSize$1e = 2;
    var maxSize$1e = 33;
    var accessLevel$1e = READ_WRITE;
    var isLoraOnly$1e = false;
    var examples$1e = {
      'set params with order': {
        id: id$1e,
        name: name$1e,
        headerSize: headerSize$1e,
        maxSize: maxSize$1e,
        accessLevel: accessLevel$1e,
        parameters: {
          displayMode: MAIN,
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
          displayMode: ADDITIONAL,
          order: []
        },
        bytes: [0x5d, 0x01, 0x01]
      }
    };
    var fromBytes$1e = function fromBytes(bytes) {
      if (bytes.length < 1 || bytes.length > maxSize$1e) {
        throw new Error('Invalid SetDisplayParam data size.');
      }
      var _bytes = _toArray(bytes),
        displayMode = _bytes[0],
        order = _arrayLikeToArray(_bytes).slice(1);
      return {
        displayMode: displayMode,
        order: order
      };
    };
    var toBytes$1e = function toBytes(parameters) {
      return toBytes$26(id$1e, [parameters.displayMode].concat(_toConsumableArray(parameters.order)));
    };

    var setDisplayParam$1 = /*#__PURE__*/Object.freeze({
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

    var id$1d = setOperatorParameters$3;
    var name$1d = commandNames$1[setOperatorParameters$3];
    var headerSize$1d = 2;
    var maxSize$1d = OPERATOR_PARAMETERS_SIZE;
    var accessLevel$1d = READ_WRITE;
    var isLoraOnly$1d = false;
    var examples$1d = {
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
          serialPortsSpeed: {
            rs485orTwi: 9600,
            optoport: 2400
          },
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
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
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
            RELAY_OFF_LIM_TARIFF_1: false,
            RELAY_OFF_LIM_TARIFF_2: false,
            RELAY_OFF_LIM_TARIFF_3: false,
            RELAY_OFF_LIM_TARIFF_4: false,
            RELAY_OFF_PF_MIN: false
          },
          relaySet2: {
            RELAY_OFF_Y: true,
            RELAY_OFF_CENTER: true,
            RELAY_OFF_TARIFF_1: false,
            RELAY_OFF_TARIFF_2: false,
            RELAY_OFF_TARIFF_3: false,
            RELAY_OFF_TARIFF_4: false,
            RELAY_OFF_I_LIMIT: false,
            RELAY_OFF_V_BAD: false
          },
          relaySet1: {
            RELAY_ON_Y: true,
            RELAY_ON_CENTER: true,
            RELAY_ON_PB: false,
            RELAY_ON_TARIFF_1: false,
            RELAY_ON_TARIFF_2: false,
            RELAY_ON_TARIFF_3: false,
            RELAY_ON_TARIFF_4: false,
            RELAY_ON_V_GOOD: false
          },
          displayType: 0,
          ten: 0,
          timeoutRefresh: 240,
          deltaCorMin: 15,
          timeoutMagnetOff: 5,
          timeoutMagnetOn: 5,
          define1: {
            BLOCK_KEY_OPTOPORT: false,
            MAGNET_SCREEN_CONST: false
          },
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
            POWER_FACTOR_PHASE_A: true,
            POWER_FACTOR_PHASE_B: true,
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
        bytes: [0x1f, 0x4a, 0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x24, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18]
      }
    };
    var fromBytes$1d = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1d) {
        throw new Error('Invalid SetOpParams data size.');
      }
      var buffer = new BinaryBuffer(bytes, false);
      return getOperatorParameters$2(buffer);
    };
    var toBytes$1d = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1d, false);
      setOperatorParameters$2(buffer, parameters);
      return toBytes$26(id$1d, buffer.data);
    };

    var setOperatorParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$1c = setOperatorParametersExtended3$3;
    var name$1c = commandNames$1[setOperatorParametersExtended3$3];
    var headerSize$1c = 2;
    var maxSize$1c = 17;
    var accessLevel$1c = READ_WRITE;
    var isLoraOnly$1c = false;
    var examples$1c = {
      'simple request': {
        id: id$1c,
        name: name$1c,
        headerSize: headerSize$1c,
        maxSize: maxSize$1c,
        accessLevel: accessLevel$1c,
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
    var fromBytes$1c = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getOperatorParametersExtended3$2(buffer);
    };
    var toBytes$1c = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1c, false);
      setOperatorParametersExtended3$2(buffer, parameters);
      return toBytes$26(id$1c, buffer.data);
    };

    var setOperatorParametersExtended3$1 = /*#__PURE__*/Object.freeze({
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

    var id$1b = setSaldo$2;
    var name$1b = commandNames$1[setSaldo$2];
    var headerSize$1b = 2;
    var maxSize$1b = 12;
    var accessLevel$1b = READ_WRITE;
    var isLoraOnly$1b = false;
    var examples$1b = {
      'test request': {
        id: id$1b,
        name: name$1b,
        headerSize: headerSize$1b,
        maxSize: maxSize$1b,
        accessLevel: accessLevel$1b,
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
    var fromBytes$1b = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
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
    var toBytes$1b = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1b, false);
      buffer.setUint8(parameters.date.month);
      buffer.setUint8(parameters.date.date);
      buffer.setUint8(parameters.date.hours);
      buffer.setUint8(parameters.date.minutes);
      buffer.setInt32(parameters.saldoNew);
      buffer.setInt32(parameters.saldoOld);
      return toBytes$26(id$1b, buffer.data);
    };

    var setSaldo$1 = /*#__PURE__*/Object.freeze({
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

    var id$1a = setSaldoParameters$3;
    var name$1a = commandNames$1[setSaldoParameters$3];
    var headerSize$1a = 2;
    var maxSize$1a = 37;
    var accessLevel$1a = READ_WRITE;
    var isLoraOnly$1a = false;
    var examples$1a = {
      'test parameters': {
        id: id$1a,
        name: name$1a,
        headerSize: headerSize$1a,
        maxSize: maxSize$1a,
        accessLevel: accessLevel$1a,
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
    var fromBytes$1a = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getSaldoParameters$2(buffer);
    };
    var toBytes$1a = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1a, false);
      setSaldoParameters$2(buffer, parameters);
      return toBytes$26(id$1a, buffer.data);
    };

    var setSaldoParameters$1 = /*#__PURE__*/Object.freeze({
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

    var id$19 = setSeasonProfile$3;
    var name$19 = commandNames$1[setSeasonProfile$3];
    var headerSize$19 = 2;
    var maxSize$19 = SEASON_PROFILE_SIZE;
    var accessLevel$19 = READ_WRITE;
    var isLoraOnly$19 = false;
    var examples$19 = {
      'set default season profile': {
        id: id$19,
        name: name$19,
        headerSize: headerSize$19,
        maxSize: maxSize$19,
        accessLevel: accessLevel$19,
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
        id: id$19,
        name: name$19,
        headerSize: headerSize$19,
        maxSize: maxSize$19,
        accessLevel: accessLevel$19,
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
    var fromBytes$19 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return _objectSpread2({
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8()
      }, getSeasonProfile$2(buffer));
    };
    var toBytes$19 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$19, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      setSeasonProfile$2(buffer, parameters);
      return toBytes$26(id$19, buffer.data);
    };

    var setSeasonProfile$1 = /*#__PURE__*/Object.freeze({
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

    var id$18 = setSpecialDay$3;
    var name$18 = commandNames$1[setSpecialDay$3];
    var headerSize$18 = 2;
    var maxSize$18 = 6;
    var accessLevel$18 = READ_WRITE;
    var isLoraOnly$18 = false;
    var examples$18 = {
      'set special day': {
        id: id$18,
        name: name$18,
        headerSize: headerSize$18,
        maxSize: maxSize$18,
        accessLevel: accessLevel$18,
        parameters: {
          tariffTable: 1,
          index: 5,
          month: 1,
          date: 9,
          dayIndex: 3,
          year: 0
        },
        bytes: [0x12, 0x06, 0x01, 0x05, 0x01, 0x09, 0x03, 0x00]
      }
    };
    var fromBytes$18 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return _objectSpread2({
        tariffTable: buffer.getUint8(),
        index: buffer.getUint8()
      }, getSpecialDay$2(buffer));
    };
    var toBytes$18 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$18, false);
      buffer.setUint8(parameters.tariffTable);
      buffer.setUint8(parameters.index);
      setSpecialDay$2(buffer, parameters);
      return toBytes$26(id$18, buffer.data);
    };

    var setSpecialDay$1 = /*#__PURE__*/Object.freeze({
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

    var id$17 = setSpecialOperation$2;
    var name$17 = commandNames$1[setSpecialOperation$2];
    var headerSize$17 = 2;
    var maxSize$17 = 2;
    var accessLevel$17 = READ_WRITE;
    var isLoraOnly$17 = false;
    var examples$17 = {
      'read screens info': {
        id: id$17,
        name: name$17,
        headerSize: headerSize$17,
        maxSize: maxSize$17,
        accessLevel: accessLevel$17,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: true,
          resetElectroMagneticIndication: false,
          resetMagneticIndication: false
        },
        bytes: [0x64, 0x02, 0x55, 0x80]
      },
      'reset both screens': {
        id: id$17,
        name: name$17,
        headerSize: headerSize$17,
        maxSize: maxSize$17,
        accessLevel: accessLevel$17,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: false,
          resetElectroMagneticIndication: true,
          resetMagneticIndication: true
        },
        bytes: [0x64, 0x02, 0x55, 0x03]
      },
      'reset magnetic screen': {
        id: id$17,
        name: name$17,
        headerSize: headerSize$17,
        maxSize: maxSize$17,
        accessLevel: accessLevel$17,
        parameters: {
          type: RESET_INFLUENCE_SCREENS,
          readScreensInfo: false,
          resetElectroMagneticIndication: false,
          resetMagneticIndication: true
        },
        bytes: [0x64, 0x02, 0x55, 0x02]
      }
    };
    var fromBytes$17 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
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
    var toBytes$17 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$17, false);
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
      return toBytes$26(id$17, buffer.data);
    };

    var setSpecialOperation$1 = /*#__PURE__*/Object.freeze({
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

    var id$16 = turnRelayOff$2;
    var name$16 = commandNames$1[turnRelayOff$2];
    var headerSize$16 = 2;
    var maxSize$16 = 0;
    var accessLevel$16 = READ_WRITE;
    var isLoraOnly$16 = false;
    var examples$16 = {
      'simple request': {
        id: id$16,
        name: name$16,
        headerSize: headerSize$16,
        maxSize: maxSize$16,
        accessLevel: accessLevel$16,
        parameters: {},
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$16 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$16) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$16 = function toBytes() {
      return toBytes$26(id$16);
    };

    var turnRelayOff$1 = /*#__PURE__*/Object.freeze({
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

    var id$15 = turnRelayOn$2;
    var name$15 = commandNames$1[turnRelayOn$2];
    var headerSize$15 = 2;
    var maxSize$15 = 0;
    var accessLevel$15 = READ_WRITE;
    var isLoraOnly$15 = false;
    var examples$15 = {
      'simple request': {
        id: id$15,
        name: name$15,
        headerSize: headerSize$15,
        maxSize: maxSize$15,
        accessLevel: accessLevel$15,
        parameters: {},
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes$15 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$15) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$15 = function toBytes() {
      return toBytes$26(id$15);
    };

    var turnRelayOn$1 = /*#__PURE__*/Object.freeze({
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

    var downlink = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activateRatePlan: activateRatePlan$1,
        getBv: getBv$1,
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
        getDemandParameters: getDemandParameters$1,
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
        getHalfHourEnergies: getHalfHourEnergies$1,
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
        setDemandParameters: setDemandParameters$1,
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

    var id$14 = activateRatePlan$2;
    var name$14 = commandNames[activateRatePlan$2];
    var headerSize$14 = 2;
    var maxSize$14 = 0;
    var accessLevel$14 = READ_WRITE;
    var isLoraOnly$14 = false;
    var examples$14 = {
      'simple response': {
        id: id$14,
        name: name$14,
        headerSize: headerSize$14,
        maxSize: maxSize$14,
        accessLevel: accessLevel$14,
        parameters: {},
        bytes: [0x13, 0x00]
      }
    };
    var fromBytes$14 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$14) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$14 = function toBytes() {
      return toBytes$26(id$14);
    };

    var activateRatePlan = /*#__PURE__*/Object.freeze({
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

    var id$13 = errorDataFrameResponse$1;
    var name$13 = commandNames[errorDataFrameResponse$1];
    var headerSize$13 = 2;
    var maxSize$13 = 1;
    var accessLevel$13 = UNENCRYPTED;
    var isLoraOnly$13 = false;
    var examples$13 = {
      'simple response': {
        id: id$13,
        name: name$13,
        headerSize: headerSize$13,
        maxSize: maxSize$13,
        parameters: {
          errorCode: 130,
          errorName: 'DECRYPTION_FAILURE'
        },
        bytes: [0xff, 0x01, 0x82]
      }
    };
    var fromBytes$13 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$13) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var _bytes = _slicedToArray(bytes, 1),
        errorCode = _bytes[0];
      return {
        errorCode: errorCode,
        errorName: resultNames[errorCode]
      };
    };
    var toBytes$13 = function toBytes(parameters) {
      var errorCode = parameters.errorCode;
      return toBytes$26(id$13, [errorCode]);
    };

    var errorDataFrameResponse = /*#__PURE__*/Object.freeze({
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

    var id$12 = errorResponse$1;
    var name$12 = commandNames[errorResponse$1];
    var headerSize$12 = 2;
    var accessLevel$12 = READ_ONLY;
    var maxSize$12 = 2;
    var isLoraOnly$12 = false;
    var examples$12 = {
      'ACCESS_DENIED on TurnRelayOn command': {
        id: id$12,
        name: name$12,
        headerSize: headerSize$12,
        maxSize: maxSize$12,
        accessLevel: accessLevel$12,
        parameters: {
          commandId: 0x18,
          commandName: 'turnRelayOn',
          errorCode: ACCESS_DENIED,
          errorName: 'ACCESS_DENIED'
        },
        bytes: [0xfe, 0x02, 0x18, 0x93]
      }
    };
    var getFromBytes$1 = function getFromBytes(commandNamesParameter) {
      return function (bytes) {
        var buffer = new BinaryBuffer(bytes, false);
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
    var fromBytes$12 = getFromBytes$1(commandNames);
    var toBytes$12 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$12, false);
      buffer.setUint8(parameters.commandId);
      buffer.setUint8(parameters.errorCode);
      return toBytes$26(id$12, buffer.data);
    };

    var errorResponse = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$12,
        examples: examples$12,
        fromBytes: fromBytes$12,
        getFromBytes: getFromBytes$1,
        headerSize: headerSize$12,
        id: id$12,
        isLoraOnly: isLoraOnly$12,
        maxSize: maxSize$12,
        name: name$12,
        toBytes: toBytes$12
    });

    var id$11 = getBv$2;
    var name$11 = commandNames[getBv$2];
    var headerSize$11 = 2;
    var maxSize$11 = 6;
    var accessLevel$11 = READ_ONLY;
    var isLoraOnly$11 = false;
    var examples$11 = {
      test: {
        id: id$11,
        name: name$11,
        headerSize: headerSize$11,
        maxSize: maxSize$11,
        accessLevel: accessLevel$11,
        parameters: {
          vector: [16, 9, 21, 0, 0, 9]
        },
        bytes: [0x70, 0x06, 0x10, 0x09, 0x15, 0x00, 0x00, 0x09]
      }
    };
    var fromBytes$11 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$11) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {
        vector: bytes
      };
    };
    var toBytes$11 = function toBytes(parameters) {
      var vector = parameters.vector;
      return toBytes$26(id$11, vector);
    };

    var getBv = /*#__PURE__*/Object.freeze({
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

    var id$10 = getCorrectTime$2;
    var name$10 = commandNames[getCorrectTime$2];
    var headerSize$10 = 2;
    var accessLevel$10 = READ_ONLY;
    var maxSize$10 = 9;
    var isLoraOnly$10 = false;
    var examples$10 = {
      'default parameters': {
        id: id$10,
        name: name$10,
        headerSize: headerSize$10,
        maxSize: maxSize$10,
        accessLevel: accessLevel$10,
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
    var fromBytes$10 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getTimeCorrectionParameters(buffer);
    };
    var toBytes$10 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$10, false);
      setTimeCorrectionParameters(buffer, parameters);
      return toBytes$26(id$10, buffer.data);
    };

    var getCorrectTime = /*#__PURE__*/Object.freeze({
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

    var id$$ = getCriticalEvent$2;
    var name$$ = commandNames[getCriticalEvent$2];
    var headerSize$$ = 2;
    var accessLevel$$ = READ_ONLY;
    var maxSize$$ = 9;
    var isLoraOnly$$ = false;
    var examples$$ = {
      'simple response': {
        id: id$$,
        name: name$$,
        headerSize: headerSize$$,
        accessLevel: accessLevel$$,
        maxSize: maxSize$$,
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
        bytes: [0x41, 0x09, 0x01, 0x01, 0x17, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07]
      }
    };
    var fromBytes$$ = function fromBytes(bytes) {
      if (bytes.length !== maxSize$$) {
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
    var toBytes$$ = function toBytes(parameters) {
      var event = parameters.event,
        index = parameters.index,
        date = parameters.date,
        count = parameters.count;
      return toBytes$26(id$$, [event, index, date.year, date.month, date.date, date.hours, date.minutes, date.seconds, count]);
    };

    var getCriticalEvent = /*#__PURE__*/Object.freeze({
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

    var id$_ = getCurrentStatusMeter$2;
    var name$_ = commandNames[getCurrentStatusMeter$2];
    var headerSize$_ = 2;
    var maxSize$_ = 31;
    var accessLevel$_ = READ_ONLY;
    var isLoraOnly$_ = false;
    var calibrationFlagsMask = {
      calibrationEnable: 0x01,
      hardkey: 0x02,
      keyPressTest: 0x04,
      keyOpenkeyTest: 0x08,
      keyGerkonTest: 0x10,
      keyOpenKlemaTest: 0x20,
      keyOpenModuleTest: 0x40,
      keyPress2Test: 0x80
    };
    var examples$_ = {
      'simple response': {
        id: id$_,
        name: name$_,
        headerSize: headerSize$_,
        maxSize: maxSize$_,
        accessLevel: accessLevel$_,
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
        bytes: [0x39, 0x1f, 0x00, 0x01, 0x22, 0x50, 0x00, 0x00, 0x87, 0x07, 0x00, 0x0e, 0x99, 0x36, 0x00, 0x00, 0x01, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xb4, 0x61, 0x85, 0x10, 0x01, 0x01, 0x03, 0x01]
      }
    };
    var fromBytes$_ = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var operatingSeconds = buffer.getUint32();
      var tbadVAVB = buffer.getUint32();
      var tbadImaxAll = buffer.getUint32();
      var tbadPmaxAll = buffer.getUint32();
      buffer.getUint32();
      var tbadFREQ = buffer.getUint32();
      var relayStatus = toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8());
      var statusEvent1 = buffer.getUint8();
      var statusEvent2 = buffer.getUint8();
      var calibrationFlags = toObject(calibrationFlagsMask, buffer.getUint8());
      var currentTariffs = {
        'A+': buffer.getUint8(),
        'A-': buffer.getUint8()
      };
      var isSummerTime = !!(buffer.getUint8() & 1);
      var statusEventValue = statusEvent1 | statusEvent2 << 8;
      return {
        operatingSeconds: operatingSeconds,
        tbadVAVB: tbadVAVB,
        tbadImaxAll: tbadImaxAll,
        tbadPmaxAll: tbadPmaxAll,
        tbadFREQ: tbadFREQ,
        relayStatus: relayStatus,
        statusEvent: toObject(eventStatusMask, statusEventValue),
        calibrationFlags: calibrationFlags,
        currentTariffs: currentTariffs,
        isSummerTime: isSummerTime
      };
    };
    var toBytes$_ = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$_, false);
      var statusEventValue = fromObject(eventStatusMask, parameters.statusEvent);
      buffer.setUint32(parameters.operatingSeconds);
      buffer.setUint32(parameters.tbadVAVB);
      buffer.setUint32(parameters.tbadImaxAll);
      buffer.setUint32(parameters.tbadPmaxAll);
      buffer.setUint32(0);
      buffer.setUint32(parameters.tbadFREQ);
      buffer.setUint8(fromObject(extendedCurrentValues2RelayStatusMask, parameters.relayStatus));
      buffer.setUint8(statusEventValue & 0xff);
      buffer.setUint8(statusEventValue >> 8 & 0xff);
      buffer.setUint8(fromObject(calibrationFlagsMask, parameters.calibrationFlags));
      buffer.setUint8(parameters.currentTariffs['A+']);
      buffer.setUint8(parameters.currentTariffs['A-']);
      buffer.setUint8(parameters.isSummerTime ? 1 : 0);
      return toBytes$26(id$_, buffer.data);
    };

    var getCurrentStatusMeter = /*#__PURE__*/Object.freeze({
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

    var id$Z = getCurrentValues$2;
    var name$Z = commandNames[getCurrentValues$2];
    var headerSize$Z = 2;
    var accessLevel$Z = READ_ONLY;
    var maxSize$Z = 32;
    var isLoraOnly$Z = false;
    var examples$Z = {
      'simple response': {
        id: id$Z,
        name: name$Z,
        maxSize: maxSize$Z,
        headerSize: headerSize$Z,
        accessLevel: accessLevel$Z,
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
        bytes: [0x0d, 0x20, 0x00, 0x23, 0xd8, 0xb2, 0x00, 0x3d, 0xfa, 0x53, 0x00, 0x04, 0x9e, 0x89, 0x00, 0x01, 0xa1, 0x25, 0x01, 0xf4, 0x00, 0x04, 0xa6, 0x8b, 0x00, 0x01, 0x9f, 0x28, 0x00, 0x01, 0xa3, 0x1c, 0xfe, 0x0c]
      }
    };
    var fromBytes$Z = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
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
    var toBytes$Z = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$Z, false);
      buffer.setInt32(parameters.powerA);
      buffer.setInt32(parameters.iaRms);
      buffer.setInt32(parameters.vavbRms);
      buffer.setInt32(parameters.varA);
      buffer.setInt16(parameters.pfA * 1000);
      buffer.setInt32(parameters.ibRms);
      buffer.setInt32(parameters.powerB);
      buffer.setInt32(parameters.varB);
      buffer.setInt16(parameters.pfB * 1000);
      return toBytes$26(id$Z, buffer.data);
    };
    var toJson$a = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      if (!dlms) {
        return JSON.stringify(parameters);
      }
      var result = {
        '21.7.0': parameters.powerA,
        '31.7.0': parameters.iaRms,
        '32.7.0': parameters.vavbRms,
        '33.7.0': parameters.pfA,
        '51.7.0': parameters.ibRms,
        '41.7.0': parameters.powerB,
        '53.7.0': parameters.pfB
      };
      var varAKey = parameters.varA >= 0 ? '23.7.0' : '24.7.0';
      var varBKey = parameters.varB >= 0 ? '43.7.0' : '44.7.0';
      result[varAKey] = parameters.varA;
      result[varBKey] = parameters.varB;
      return JSON.stringify(result);
    };

    var getCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$Z,
        examples: examples$Z,
        fromBytes: fromBytes$Z,
        headerSize: headerSize$Z,
        id: id$Z,
        isLoraOnly: isLoraOnly$Z,
        maxSize: maxSize$Z,
        name: name$Z,
        toBytes: toBytes$Z,
        toJson: toJson$a
    });

    var id$Y = getDateTime$3;
    var name$Y = commandNames[getDateTime$3];
    var headerSize$Y = 2;
    var maxSize$Y = 8;
    var accessLevel$Y = READ_ONLY;
    var isLoraOnly$Y = false;
    var examples$Y = {
      'time: 2024.02.19 18:31:55': {
        id: id$Y,
        name: name$Y,
        headerSize: headerSize$Y,
        maxSize: maxSize$Y,
        accessLevel: accessLevel$Y,
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
    var fromBytes$Y = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDateTime$2(buffer);
    };
    var toBytes$Y = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$Y, false);
      setDateTime$2(buffer, parameters);
      return toBytes$26(id$Y, buffer.data);
    };

    var getDateTime = /*#__PURE__*/Object.freeze({
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

    var getObisByEnergy = (function (energy) {
      var tariff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var obis = energy === A_MINUS ? '2.8.x' : '1.8.x';
      return obis.replace('x', tariff.toString(10));
    });

    var COMMAND_SIZE$5 = 19;
    var MAX_COMMAND_SIZE$5 = COMMAND_SIZE$5 + PACKED_ENERGY_TYPE_SIZE;
    var id$X = getDayDemand$2;
    var name$X = commandNames[getDayDemand$2];
    var headerSize$X = 2;
    var maxSize$X = MAX_COMMAND_SIZE$5;
    var accessLevel$X = READ_ONLY;
    var isLoraOnly$X = false;
    var examples$X = {
      'default A+ energy': {
        id: id$X,
        name: name$X,
        headerSize: headerSize$X,
        maxSize: maxSize$X,
        accessLevel: accessLevel$X,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x16, 0x13, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'received A- energies': {
        id: id$X,
        name: name$X,
        headerSize: headerSize$X,
        maxSize: maxSize$X,
        accessLevel: accessLevel$X,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: A_MINUS,
          energies: [40301230, null, 2333, 2145623]
        },
        bytes: [0x16, 0x10, 0x18, 0x03, 0x16, 0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$X = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE$5) {
        parameters = {
          date: getDate$1(buffer),
          energies: getEnergies(buffer)
        };
      } else {
        parameters = _objectSpread2({
          date: getDate$1(buffer)
        }, getPackedEnergyWithType(buffer));
      }
      return parameters;
    };
    var toBytes$X = function toBytes(parameters) {
      var size = COMMAND_SIZE$5;
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = parameters.energies.filter(function (energy) {
          return energy !== null;
        }).length;
        size = DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      var buffer = new BinaryBuffer(size, false);
      setDate$1(buffer, parameters.date);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$X, buffer.data);
    };
    var toJson$9 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      if (!dlms) {
        return JSON.stringify(parameters);
      }
      var date = parameters.date,
        energyType = parameters.energyType,
        energies = parameters.energies;
      var result = {};
      for (var i = 0; i < TARIFF_NUMBER$1; i += 1) {
        if (energies[i] || energies[i] === 0) {
          result[getObisByEnergy(energyType, i + 1)] = energies[i];
        }
      }
      return JSON.stringify(_objectSpread2({
        date: date
      }, result));
    };

    var getDayDemand = /*#__PURE__*/Object.freeze({
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
        toJson: toJson$9
    });

    var COMMAND_SIZE$4 = 19;
    var MAX_COMMAND_SIZE$4 = COMMAND_SIZE$4 + PACKED_ENERGY_TYPE_SIZE;
    var id$W = getDayDemandExport$2;
    var name$W = commandNames[getDayDemandExport$2];
    var headerSize$W = 2;
    var maxSize$W = MAX_COMMAND_SIZE$4;
    var accessLevel$W = READ_ONLY;
    var isLoraOnly$W = false;
    var examples$W = {
      'default A- energy': {
        id: id$W,
        name: name$W,
        headerSize: headerSize$W,
        maxSize: maxSize$W,
        accessLevel: accessLevel$W,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x4f, 0x13, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'received A+ energies': {
        id: id$W,
        name: name$W,
        headerSize: headerSize$W,
        maxSize: maxSize$W,
        accessLevel: accessLevel$W,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: 1,
          energies: [40301230, null, 2333, 2145623]
        },
        bytes: [0x4f, 0x10, 0x18, 0x03, 0x16, 0xd1, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$W = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE$4) {
        parameters = {
          date: getDate$1(buffer),
          energies: getEnergies(buffer)
        };
      } else {
        parameters = _objectSpread2({
          date: getDate$1(buffer)
        }, getPackedEnergyWithType(buffer));
      }
      return parameters;
    };
    var toBytes$W = function toBytes(parameters) {
      var size = COMMAND_SIZE$4;
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = parameters.energies.filter(function (energy) {
          return energy !== null;
        }).length;
        size = DATE_SIZE$3 + PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      var buffer = new BinaryBuffer(size, false);
      setDate$1(buffer, parameters.date);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$W, buffer.data);
    };
    var toJson$8 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      if (!dlms) {
        return JSON.stringify(parameters);
      }
      var date = parameters.date,
        energyType = parameters.energyType,
        energies = parameters.energies;
      var result = {};
      for (var i = 0; i < TARIFF_NUMBER$1; i += 1) {
        if (energies[i] || energies[i] === 0) {
          result[getObisByEnergy(energyType, i + 1)] = energies[i];
        }
      }
      return JSON.stringify(_objectSpread2({
        date: date
      }, result));
    };

    var getDayDemandExport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$W,
        examples: examples$W,
        fromBytes: fromBytes$W,
        headerSize: headerSize$W,
        id: id$W,
        isLoraOnly: isLoraOnly$W,
        maxSize: maxSize$W,
        name: name$W,
        toBytes: toBytes$W,
        toJson: toJson$8
    });

    var DATE_SIZE$2 = 2;
    var ENERGY_FLAGS_SIZE$2 = 1;
    var TARIFF_FLAGS_SIZE$1 = 1;
    var MAX_TARIFFS_ENERGIES_SIZE$1 = 6 * 4 * 4;
    var energiesToObis$2 = {
      'A+': '1.8.x',
      'A+R+': '3.8.x',
      'A+R-': '4.8.x',
      'A-': '2.8.x',
      'A-R+': '7.8.x',
      'A-R-': '8.8.x'
    };
    var convertEnergyToObis$2 = function convertEnergyToObis(energy) {
      var tariff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var obis = energiesToObis$2[energy];
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
              dlms[convertEnergyToObis$2(energy, tariff + 1)] = value;
            }
          });
        }
      };
      for (var tariff = 0; tariff < TARIFF_NUMBER; tariff++) {
        _loop(tariff);
      }
      return dlms;
    };
    var id$V = getDayEnergies$1;
    var name$V = commandNames[getDayEnergies$1];
    var headerSize$V = 2;
    var maxSize$V = DATE_SIZE$2 + ENERGY_FLAGS_SIZE$2 + TARIFF_FLAGS_SIZE$1 + MAX_TARIFFS_ENERGIES_SIZE$1;
    var accessLevel$V = UNENCRYPTED;
    var isLoraOnly$V = true;
    var examples$V = {
      'get day energies': {
        id: id$V,
        headerSize: headerSize$V,
        name: name$V,
        maxSize: maxSize$V,
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
    var fromBytes$V = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate(buffer),
        energies: getTariffsEnergies(buffer)
      };
    };
    var toBytes$V = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$V, false);
      setDate(buffer, parameters.date);
      setTariffsEnergies(buffer, parameters.energies);
      return toBytes$26(id$V, buffer.getBytesToOffset());
    };
    var toJson$7 = function toJson(parameters) {
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
        accessLevel: accessLevel$V,
        examples: examples$V,
        fromBytes: fromBytes$V,
        headerSize: headerSize$V,
        id: id$V,
        isLoraOnly: isLoraOnly$V,
        maxSize: maxSize$V,
        name: name$V,
        toBytes: toBytes$V,
        toJson: toJson$7
    });

    var id$U = getDayMaxDemand$2;
    var name$U = commandNames[getDayMaxDemand$2];
    var headerSize$U = 2;
    var accessLevel$U = READ_ONLY;
    var maxSize$U = 27;
    var isLoraOnly$U = false;
    var examples$U = {
      'response for 2023.03.12': {
        id: id$U,
        name: name$U,
        headerSize: headerSize$U,
        accessLevel: accessLevel$U,
        maxSize: maxSize$U,
        parameters: {
          date: {
            year: 23,
            month: 3,
            date: 12
          },
          power: [{
            hours: 1,
            minutes: 0,
            power: 456
          }, {
            hours: 3,
            minutes: 12,
            power: 9474
          }, {
            hours: 7,
            minutes: 30,
            power: 78573
          }, {
            hours: 12,
            minutes: 59,
            power: 395639
          }]
        },
        bytes: [0x31, 0x1b, 0x17, 0x03, 0x0c, 0x01, 0x00, 0x00, 0x00, 0x01, 0xc8, 0x03, 0x0c, 0x00, 0x00, 0x25, 0x02, 0x07, 0x1e, 0x00, 0x01, 0x32, 0xed, 0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77]
      }
    };
    var fromBytes$U = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDayMaxDemandResponse(buffer);
    };
    var toBytes$U = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$U, false);
      setDayMaxDemandResponse(buffer, parameters);
      return toBytes$26(id$U, buffer.getBytesToOffset());
    };

    var getDayMaxDemand = /*#__PURE__*/Object.freeze({
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

    var id$T = getDayMaxDemandExport$2;
    var name$T = commandNames[getDayMaxDemandExport$2];
    var headerSize$T = 2;
    var accessLevel$T = READ_ONLY;
    var maxSize$T = 27;
    var isLoraOnly$T = false;
    var examples$T = {
      'response for 2023.03.12': {
        id: id$T,
        name: name$T,
        headerSize: headerSize$T,
        accessLevel: accessLevel$T,
        maxSize: maxSize$T,
        parameters: {
          date: {
            year: 23,
            month: 3,
            date: 12
          },
          power: [{
            hours: 1,
            minutes: 0,
            power: 456
          }, {
            hours: 3,
            minutes: 12,
            power: 9474
          }, {
            hours: 7,
            minutes: 30,
            power: 78573
          }, {
            hours: 12,
            minutes: 59,
            power: 395639
          }]
        },
        bytes: [0x58, 0x1b, 0x17, 0x03, 0x0c, 0x01, 0x00, 0x00, 0x00, 0x01, 0xc8, 0x03, 0x0c, 0x00, 0x00, 0x25, 0x02, 0x07, 0x1e, 0x00, 0x01, 0x32, 0xed, 0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77]
      }
    };
    var fromBytes$T = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDayMaxDemandResponse(buffer);
    };
    var toBytes$T = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$T, false);
      setDayMaxDemandResponse(buffer, parameters);
      return toBytes$26(id$T, buffer.getBytesToOffset());
    };

    var getDayMaxDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$S = getDayMaxDemandPrevious$2;
    var name$S = commandNames[getDayMaxDemandPrevious$2];
    var headerSize$S = 2;
    var accessLevel$S = READ_ONLY;
    var maxSize$S = 27;
    var isLoraOnly$S = false;
    var examples$S = {
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
          power: [{
            hours: 1,
            minutes: 0,
            power: 456
          }, {
            hours: 3,
            minutes: 12,
            power: 9474
          }, {
            hours: 7,
            minutes: 30,
            power: 78573
          }, {
            hours: 12,
            minutes: 59,
            power: 395639
          }]
        },
        bytes: [0x4a, 0x1b, 0x17, 0x03, 0x0c, 0x01, 0x00, 0x00, 0x00, 0x01, 0xc8, 0x03, 0x0c, 0x00, 0x00, 0x25, 0x02, 0x07, 0x1e, 0x00, 0x01, 0x32, 0xed, 0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77]
      }
    };
    var fromBytes$S = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDayMaxDemandResponse(buffer);
    };
    var toBytes$S = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$S, false);
      setDayMaxDemandResponse(buffer, parameters);
      return toBytes$26(id$S, buffer.getBytesToOffset());
    };

    var getDayMaxDemandPrevious = /*#__PURE__*/Object.freeze({
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

    var DATE_SIZE$1 = 2;
    var ENERGY_FLAGS_SIZE$1 = 1;
    var TARIFF_FLAGS_SIZE = 1;
    var MAX_TARIFFS_ENERGIES_SIZE = 6 * 4 * (1 + 1 + 4);
    var energiesToObis$1 = {
      'A+': '1.6.x',
      'A+R+': '3.6.x',
      'A+R-': '4.6.x',
      'A-': '2.6.x',
      'A-R+': '7.6.x',
      'A-R-': '8.6.x'
    };
    var convertEnergyToObis$1 = function convertEnergyToObis(energy) {
      var tariff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var obis = energiesToObis$1[energy];
      return obis ? obis.replace('x', tariff.toString(10)) : '';
    };
    var convertTariffsPowerMaxToDlms = function convertTariffsPowerMaxToDlms(energies) {
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
    var id$R = getDayMaxPower$1;
    var name$R = commandNames[getDayMaxPower$1];
    var headerSize$R = 2;
    var maxSize$R = DATE_SIZE$1 + ENERGY_FLAGS_SIZE$1 + TARIFF_FLAGS_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
    var accessLevel$R = UNENCRYPTED;
    var isLoraOnly$R = true;
    var examples$R = {
      'get day max power': {
        id: id$R,
        headerSize: headerSize$R,
        name: name$R,
        maxSize: maxSize$R,
        parameters: {
          date: {
            year: 21,
            month: 2,
            date: 3
          },
          tariffs: [null, null, {
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
          }, null]
        },
        bytes: [0x79, 0x10, 0x2a, 0x43, 0x11, 0x44, 0x02, 0x03, 0x00, 0x00, 0x10, 0x00, 0x04, 0x05, 0x00, 0x00, 0x20, 0x00]
      }
    };
    var fromBytes$R = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        date: getDate(buffer),
        tariffs: getTariffsPowerMax(buffer)
      };
    };
    var toBytes$R = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$R, false);
      setDate(buffer, parameters.date);
      setTariffsPowerMax(buffer, parameters.tariffs);
      return toBytes$26(id$R, buffer.getBytesToOffset());
    };
    var toJson$6 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var date = parameters.date,
        tariffs = parameters.tariffs;
      var result = dlms ? _objectSpread2({
        date: date
      }, convertTariffsPowerMaxToDlms(tariffs)) : parameters;
      return JSON.stringify(result);
    };

    var getDayMaxPower = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$R,
        examples: examples$R,
        fromBytes: fromBytes$R,
        headerSize: headerSize$R,
        id: id$R,
        isLoraOnly: isLoraOnly$R,
        maxSize: maxSize$R,
        name: name$R,
        toBytes: toBytes$R,
        toJson: toJson$6
    });

    var MAX_PERIODS_NUMBER = 8;
    var PERIODS_FINAL_BYTE = 0xff;
    var id$Q = getDayProfile$2;
    var name$Q = commandNames[getDayProfile$2];
    var headerSize$Q = 2;
    var maxSize$Q = MAX_PERIODS_NUMBER;
    var accessLevel$Q = READ_ONLY;
    var isLoraOnly$Q = false;
    var examples$Q = {
      'full periods response': {
        id: id$Q,
        name: name$Q,
        headerSize: headerSize$Q,
        maxSize: maxSize$Q,
        accessLevel: accessLevel$Q,
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
        id: id$Q,
        name: name$Q,
        headerSize: headerSize$Q,
        maxSize: maxSize$Q,
        accessLevel: accessLevel$Q,
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
    var fromBytes$Q = function fromBytes(bytes) {
      var finalByteIndex = bytes.indexOf(PERIODS_FINAL_BYTE);
      var cleanData = finalByteIndex === -1 ? bytes : bytes.slice(0, finalByteIndex);
      return {
        periods: _toConsumableArray(cleanData).map(getDayProfileFromByte)
      };
    };
    var toBytes$Q = function toBytes(parameters) {
      var hasPeriodsFinalByte = parameters.periods.length < MAX_PERIODS_NUMBER;
      var size = parameters.periods.length + +hasPeriodsFinalByte;
      var buffer = new BinaryBuffer(size, false);
      parameters.periods.forEach(function (period) {
        setDayProfile$2(buffer, period);
      });
      if (hasPeriodsFinalByte) {
        buffer.setUint8(PERIODS_FINAL_BYTE);
      }
      return toBytes$26(id$Q, buffer.data);
    };

    var getDayProfile = /*#__PURE__*/Object.freeze({
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

    var ADDITIONAL_HOUR = 25;
    var getRecordIndex = function getRecordIndex(hours, minutes, periodMin) {
      return Math.trunc((hours * 60 + minutes) / periodMin);
    };
    var getLastSummerHourIndex = function getLastSummerHourIndex(periodMin) {
      return getRecordIndex(ADDITIONAL_HOUR, 0, periodMin);
    };
    var energyFromWord = function energyFromWord(word, index, periodMin) {
      if (word === 0xffff) {
        return null;
      }
      var indexLastSummerRecord = getLastSummerHourIndex(periodMin);
      if (index === indexLastSummerRecord) {
        return {
          lastSummerHour: word >> 8 & 0xff
        };
      }
      return periodMin === 60 ? {
        energy: word
      } : {
        tariff: word >> 14 & 0x03,
        energy: word & 0x3fff
      };
    };
    var energyToWord = function energyToWord(data) {
      if (data === null) {
        return 0xffff;
      }
      var energy = data.energy,
        tariff = data.tariff,
        lastSummerHour = data.lastSummerHour;
      if (lastSummerHour) {
        return lastSummerHour << 8 | 0xff;
      }
      return tariff ? tariff << 14 | energy & 0x3fff : energy;
    };
    var energyFromBinary = function energyFromBinary(bytes, offset) {
      var periodMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
      return bytes.reduce(function (collector, value, index) {
        collector.push(energyFromWord(value, (offset !== null && offset !== void 0 ? offset : 0) + index, periodMin));
        return collector;
      }, []);
    };
    var energyToBinary = function energyToBinary(energies) {
      return energies.reduce(function (collector, value) {
        collector.push(energyToWord(value));
        return collector;
      }, []);
    };
    var voltageFromWord = function voltageFromWord(word, index, periodMin) {
      if (word === 0xffff) {
        return 0xffff;
      }
      var indexLastSummerRecord = getLastSummerHourIndex(periodMin);
      return index === indexLastSummerRecord ? {
        lastSummerHour: word >> 8 & 0xff
      } : {
        voltage: word
      };
    };
    var voltageToWord = function voltageToWord(_ref) {
      var voltage = _ref.voltage,
        lastSummerHour = _ref.lastSummerHour;
      if (lastSummerHour) {
        return lastSummerHour << 8 | 0xff;
      }
      return voltage;
    };
    var voltageFromBinary = function voltageFromBinary(bytes, offset) {
      var periodMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
      return bytes.reduce(function (collector, value, index) {
        collector.push(voltageFromWord(value, (offset !== null && offset !== void 0 ? offset : 0) + index, periodMin));
        return collector;
      }, []);
    };
    var voltageToBinary = function voltageToBinary(energies) {
      return energies.reduce(function (collector, value) {
        collector.push(voltageToWord(value));
        return collector;
      }, []);
    };

    var id$P = getDemand$3;
    var name$P = commandNames[getDemand$3];
    var headerSize$P = 2;
    var maxSize$P = maxSize$1U + 48;
    var accessLevel$P = READ_ONLY;
    var isLoraOnly$P = false;
    var examples$P = {
      'response for A+': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 2
          },
          demandType: A_PLUS$1,
          firstIndex: 0,
          count: 48,
          period: 5,
          demands: [{
            tariff: 0,
            energy: 177
          }, {
            tariff: 0,
            energy: 177
          }, {
            tariff: 0,
            energy: 176
          }, null, null, null, null, null, null, null, null, null, {
            tariff: 0,
            energy: 178
          }, {
            tariff: 0,
            energy: 175
          }, {
            tariff: 0,
            energy: 177
          }, null, null, null, null, null, null, null, null, null, {
            tariff: 0,
            energy: 178
          }, {
            tariff: 0,
            energy: 178
          }, {
            tariff: 0,
            energy: 178
          }, null, null, null, null, null, null, null, null, null, {
            tariff: 0,
            energy: 177
          }, null, {
            tariff: 0,
            energy: 99
          }, null, null, null, null, null, null, null, null, null]
        },
        bytes: [0x76, 0x67, 0x31, 0x42, 0x01, 0x00, 0x00, 0x30, 0x05, 0x00, 0xb1, 0x00, 0xb1, 0x00, 0xb0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0xb2, 0x00, 0xaf, 0x00, 0xb1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0xb2, 0x00, 0xb2, 0x00, 0xb2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0xb1, 0xff, 0xff, 0x00, 0x63, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
      },
      'response for A+ (period: 60, no tariff)': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 2
          },
          demandType: A_PLUS$1,
          firstIndex: 0,
          count: 24,
          period: 60,
          demands: [{
            energy: 177
          }, {
            energy: 177
          }, {
            energy: 176
          }, null, null, null, null, null, null, null, null, null, {
            energy: 178
          }, {
            energy: 175
          }, {
            energy: 177
          }, null, null, null, null, null, null, null, null, null]
        },
        bytes: [0x76, 0x37, 0x31, 0x42, 0x01, 0x00, 0x00, 0x18, 0x3c, 0x00, 0xb1, 0x00, 0xb1, 0x00, 0xb0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0xb2, 0x00, 0xaf, 0x00, 0xb1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
      },
      'response for A+ (lastSummerHour)': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 2
          },
          demandType: A_PLUS$1,
          firstIndex: 25,
          count: 1,
          period: 60,
          demands: [{
            lastSummerHour: 4
          }]
        },
        bytes: [0x76, 0x09, 0x31, 0x42, 0x01, 0x00, 0x19, 0x01, 0x3c, 0x04, 0xff]
      },
      'response for voltage (period: 60, no tariff)': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 2
          },
          demandType: VOLTAGE,
          firstIndex: 0,
          count: 1,
          period: 60,
          demands: [{
            voltage: 1026
          }]
        },
        bytes: [0x76, 0x09, 0x31, 0x42, 0xa0, 0x00, 0x00, 0x01, 0x3c, 0x04, 0x02]
      },
      'response for voltage (lastSummerHour)': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 2
          },
          demandType: VOLTAGE,
          firstIndex: 25,
          count: 1,
          period: 60,
          demands: [{
            lastSummerHour: 4
          }]
        },
        bytes: [0x76, 0x09, 0x31, 0x42, 0xa0, 0x00, 0x19, 0x01, 0x3c, 0x04, 0xff]
      },
      'response for voltage 10 min (lastSummerHour)': {
        id: id$P,
        name: name$P,
        headerSize: headerSize$P,
        maxSize: maxSize$P,
        parameters: {
          date: {
            year: 24,
            month: 10,
            date: 27
          },
          demandType: VOLTAGE_10,
          firstIndex: 144,
          count: 7,
          period: 10,
          demands: [{
            voltage: 2375
          }, {
            voltage: 2381
          }, {
            voltage: 2372
          }, {
            voltage: 2373
          }, {
            voltage: 2374
          }, {
            voltage: 2365
          }, {
            lastSummerHour: 3
          }]
        },
        bytes: [0x76, 0x15, 0x31, 0x5b, 0x40, 0x00, 0x90, 0x07, 0x0a, 0x09, 0x47, 0x09, 0x4d, 0x09, 0x44, 0x09, 0x45, 0x09, 0x46, 0x09, 0x3d, 0x03, 0xff]
      }
    };
    var fromBytes$P = function fromBytes(bytes) {
      if (!bytes || bytes.length < maxSize$1U) {
        throw new Error('Invalid uplink GetDemand byte length.');
      }
      var buffer = new BinaryBuffer(bytes, false);
      var parameters = getDemand$2(buffer);
      if (bytes.length !== maxSize$1U + 2 * parameters.count) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
      }
      var demandsBytes = new Array(parameters.count).fill(0).map(function () {
        return buffer.getUint16();
      });
      var isEnergiesDemand = parameters.demandType === A_PLUS$1 || parameters.demandType === A_MINUS$1;
      parameters.demands = isEnergiesDemand ? energyFromBinary(demandsBytes, parameters.firstIndex, parameters.period) : voltageFromBinary(demandsBytes, parameters.firstIndex, parameters.period);
      return parameters;
    };
    var toBytes$P = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$1U + parameters.count * 2, false);
      setDemand(buffer, parameters);
      if (parameters.demandType === A_PLUS$1 || parameters.demandType === A_MINUS$1) {
        energyToBinary(parameters.demands).forEach(function (value) {
          return buffer.setUint16(value);
        });
      } else {
        voltageToBinary(parameters.demands).forEach(function (value) {
          return buffer.setUint16(value);
        });
      }
      return toBytes$26(id$P, buffer.data);
    };

    var getDemand = /*#__PURE__*/Object.freeze({
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

    var id$O = getDemandParameters$3;
    var name$O = commandNames[getDemandParameters$3];
    var headerSize$O = 2;
    var maxSize$O = 4;
    var accessLevel$O = READ_ONLY;
    var isLoraOnly$O = false;
    var examples$O = {
      'simple response': {
        id: id$O,
        name: name$O,
        headerSize: headerSize$O,
        maxSize: maxSize$O,
        parameters: {
          channelParam1: 0,
          counterInterval: 20,
          channelParam2: 160
        },
        bytes: [0x75, 0x04, 0x00, 0x14, 0xa0, 0x00]
      }
    };
    var fromBytes$O = function fromBytes(bytes) {
      validateCommandPayload(name$O, bytes, maxSize$O);
      var buffer = new BinaryBuffer(bytes, false);
      return getDemandParameters$2(buffer);
    };
    var toBytes$O = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$O, false);
      setDemandParameters$2(buffer, parameters);
      return toBytes$26(id$O, buffer.data);
    };

    var getDemandParameters = /*#__PURE__*/Object.freeze({
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

    var id$N = getDeviceId$3;
    var name$N = commandNames[getDeviceId$3];
    var headerSize$N = 2;
    var accessLevel$N = READ_ONLY;
    var maxSize$N = 8;
    var isLoraOnly$N = false;
    var examples$N = {
      'simple response': {
        id: id$N,
        name: name$N,
        headerSize: headerSize$N,
        accessLevel: accessLevel$N,
        maxSize: maxSize$N,
        parameters: {
          manufacturer: '001a79',
          type: 23,
          year: 20,
          serial: '1b1d6a'
        },
        bytes: [0x05, 0x08, 0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a]
      }
    };
    var fromBytes$N = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDeviceId$2(buffer);
    };
    var toBytes$N = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$N, false);
      setDeviceId(buffer, parameters);
      return toBytes$26(id$N, buffer.data);
    };

    var getDeviceId = /*#__PURE__*/Object.freeze({
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

    var id$M = getDeviceType$3;
    var name$M = commandNames[getDeviceType$3];
    var headerSize$M = 2;
    var accessLevel$M = READ_ONLY;
    var maxSize$M = 9;
    var isLoraOnly$M = false;
    var examples$M = {
      'type 1': {
        id: id$M,
        name: name$M,
        headerSize: headerSize$M,
        maxSize: maxSize$M,
        accessLevel: accessLevel$M,
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
        id: id$M,
        name: name$M,
        headerSize: headerSize$M,
        maxSize: maxSize$M,
        accessLevel: accessLevel$M,
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
    var fromBytes$M = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getDeviceType$2(buffer);
    };
    var toBytes$M = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$M, false);
      setDeviceType(buffer, parameters);
      return toBytes$26(id$M, buffer.data);
    };

    var getDeviceType = /*#__PURE__*/Object.freeze({
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

    var id$L = getDisplayParam$2;
    var name$L = commandNames[getDisplayParam$2];
    var headerSize$L = 2;
    var maxSize$L = 33;
    var accessLevel$L = READ_ONLY;
    var isLoraOnly$L = false;
    var examples$L = {
      'mode with order': {
        id: id$L,
        name: name$L,
        headerSize: headerSize$L,
        maxSize: maxSize$L,
        accessLevel: accessLevel$L,
        parameters: {
          displayMode: MAIN,
          order: [4, 5, 6, 7]
        },
        bytes: [0x5e, 0x05, 0x00, 0x04, 0x05, 0x06, 0x07]
      },
      'mode without order': {
        id: id$L,
        name: name$L,
        maxSize: maxSize$L,
        accessLevel: accessLevel$L,
        parameters: {
          displayMode: ADDITIONAL,
          order: []
        },
        bytes: [0x5e, 0x01, 0x01]
      }
    };
    var fromBytes$L = function fromBytes(bytes) {
      var _bytes = _toArray(bytes),
        displayMode = _bytes[0],
        order = _arrayLikeToArray(_bytes).slice(1);
      return {
        displayMode: displayMode,
        order: order
      };
    };
    var toBytes$L = function toBytes(parameters) {
      return toBytes$26(id$L, [parameters.displayMode].concat(_toConsumableArray(parameters.order)));
    };

    var getDisplayParam = /*#__PURE__*/Object.freeze({
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

    var COMMAND_SIZE$3 = 16;
    var MAX_COMMAND_SIZE$3 = COMMAND_SIZE$3 + PACKED_ENERGY_TYPE_SIZE;
    var id$K = getEnergy$2;
    var name$K = commandNames[getEnergy$2];
    var headerSize$K = 2;
    var accessLevel$K = READ_ONLY;
    var maxSize$K = MAX_COMMAND_SIZE$3;
    var isLoraOnly$K = false;
    var examples$K = {
      'default A+ energy': {
        id: id$K,
        name: name$K,
        headerSize: headerSize$K,
        maxSize: maxSize$K,
        accessLevel: accessLevel$K,
        parameters: {
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x0f, 0x10, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'received A- energies': {
        id: id$K,
        name: name$K,
        headerSize: headerSize$K,
        maxSize: maxSize$K,
        accessLevel: accessLevel$K,
        parameters: {
          energyType: 2,
          energies: [40301230, null, 2333, 2145623]
        },
        bytes: [0x0f, 0x0d, 0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$K = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE$3) {
        parameters = {
          energies: getEnergies(buffer)
        };
      } else {
        parameters = getPackedEnergyWithType(buffer);
      }
      return parameters;
    };
    var toBytes$K = function toBytes(parameters) {
      var size = COMMAND_SIZE$3;
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = parameters.energies.filter(function (energy) {
          return energy !== null;
        }).length;
        size = PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      var buffer = new BinaryBuffer(size, false);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$K, buffer.data);
    };
    var toJson$5 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      if (!dlms) {
        return JSON.stringify(parameters);
      }
      var energyType = parameters.energyType,
        energies = parameters.energies;
      var result = {};
      for (var i = 0; i < TARIFF_NUMBER$1; i += 1) {
        if (energies[i] || energies[i] === 0) {
          result[getObisByEnergy(energyType, i + 1)] = energies[i];
        }
      }
      return JSON.stringify(result);
    };

    var getEnergy = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$K,
        examples: examples$K,
        fromBytes: fromBytes$K,
        headerSize: headerSize$K,
        id: id$K,
        isLoraOnly: isLoraOnly$K,
        maxSize: maxSize$K,
        name: name$K,
        toBytes: toBytes$K,
        toJson: toJson$5
    });

    var convertAPlusEnergyToObis$1 = function convertAPlusEnergyToObis() {
      var tariff = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return '1.8.x'.replace('x', tariff.toString(10));
    };
    var convertEnergiesToDlms$1 = function convertEnergiesToDlms(energy) {
      var dlms = {};
      for (var tariff = 0; tariff < TARIFF_NUMBER$1; tariff++) {
        var value = energy[tariff];
        if (value || value === 0) {
          dlms[convertAPlusEnergyToObis$1(tariff + 1)] = value;
        }
      }
      return dlms;
    };
    var COMMAND_SIZE$2 = 19;
    var MAX_COMMAND_SIZE$2 = COMMAND_SIZE$2 + PACKED_ENERGY_TYPE_SIZE;
    var id$J = getEnergyDayPrevious$2;
    var name$J = commandNames[getEnergyDayPrevious$2];
    var headerSize$J = 2;
    var maxSize$J = MAX_COMMAND_SIZE$2;
    var accessLevel$J = READ_ONLY;
    var isLoraOnly$J = false;
    var examples$J = {
      'simple response': {
        id: id$J,
        name: name$J,
        headerSize: headerSize$J,
        maxSize: maxSize$J,
        accessLevel: accessLevel$J,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x03, 0x13, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'response with A- energy by T1, T4 only': {
        id: id$J,
        name: name$J,
        headerSize: headerSize$J,
        maxSize: maxSize$J,
        accessLevel: accessLevel$J,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: 2,
          energies: [40301230, null, null, 2145623]
        },
        bytes: [0x03, 0x0c, 0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$J = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE$2) {
        parameters = {
          date: getDate$1(buffer),
          energies: getEnergies(buffer)
        };
      } else {
        parameters = _objectSpread2({
          date: getDate$1(buffer)
        }, getPackedEnergyWithType(buffer));
      }
      return parameters;
    };
    var toBytes$J = function toBytes(parameters) {
      var buffer = new BinaryBuffer(getPackedEnergiesWithDateSize(parameters), false);
      setDate$1(buffer, parameters.date);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$J, buffer.data);
    };
    var toJson$4 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var date = parameters.date,
        energies = parameters.energies;
      var result = dlms ? _objectSpread2({
        date: date
      }, convertEnergiesToDlms$1(energies)) : parameters;
      return JSON.stringify(result);
    };

    var getEnergyDayPrevious = /*#__PURE__*/Object.freeze({
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
        toJson: toJson$4
    });

    var COMMAND_SIZE$1 = 16;
    var MAX_COMMAND_SIZE$1 = COMMAND_SIZE$1 + PACKED_ENERGY_TYPE_SIZE;
    var id$I = getEnergyExport$2;
    var name$I = commandNames[getEnergyExport$2];
    var headerSize$I = 2;
    var accessLevel$I = READ_ONLY;
    var maxSize$I = MAX_COMMAND_SIZE$1;
    var isLoraOnly$I = false;
    var examples$I = {
      'default response': {
        id: id$I,
        name: name$I,
        headerSize: headerSize$I,
        maxSize: maxSize$I,
        accessLevel: accessLevel$I,
        parameters: {
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x5b, 0x10, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'received A- energies by tariffs': {
        id: id$I,
        name: name$I,
        headerSize: headerSize$I,
        maxSize: maxSize$I,
        accessLevel: accessLevel$I,
        parameters: {
          energyType: 2,
          energies: [40301230, null, 2333, 2145623]
        },
        bytes: [0x5b, 0x0d, 0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$I = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE$1) {
        parameters = {
          energies: getEnergies(buffer)
        };
      } else {
        parameters = getPackedEnergyWithType(buffer);
      }
      return parameters;
    };
    var toBytes$I = function toBytes(parameters) {
      var size = COMMAND_SIZE$1;
      if (parameters !== null && parameters !== void 0 && parameters.energyType) {
        var energiesNumber = parameters.energies.filter(function (energy) {
          return energy !== null;
        }).length;
        size = PACKED_ENERGY_TYPE_SIZE + energiesNumber * ENERGY_SIZE;
      }
      var buffer = new BinaryBuffer(size, false);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$I, buffer.data);
    };
    var toJson$3 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      if (!dlms) {
        return JSON.stringify(parameters);
      }
      var energyType = parameters.energyType,
        energies = parameters.energies;
      var result = {};
      for (var i = 0; i < TARIFF_NUMBER$1; i += 1) {
        if (energies[i] || energies[i] === 0) {
          result[getObisByEnergy(energyType, i + 1)] = energies[i];
        }
      }
      return JSON.stringify(result);
    };

    var getEnergyExport = /*#__PURE__*/Object.freeze({
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
        toJson: toJson$3
    });

    var convertAPlusEnergyToObis = function convertAPlusEnergyToObis() {
      var tariff = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return '1.8.x'.replace('x', tariff.toString(10));
    };
    var convertEnergiesToDlms = function convertEnergiesToDlms(energy) {
      var dlms = {};
      for (var tariff = 0; tariff < TARIFF_NUMBER$1; tariff++) {
        var value = energy[tariff];
        if (value || value === 0) {
          dlms[convertAPlusEnergyToObis(tariff + 1)] = value;
        }
      }
      return dlms;
    };
    var COMMAND_SIZE = 19;
    var MAX_COMMAND_SIZE = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;
    var id$H = getEnergyExportDayPrevious$2;
    var name$H = commandNames[getEnergyExportDayPrevious$2];
    var headerSize$H = 2;
    var maxSize$H = MAX_COMMAND_SIZE;
    var accessLevel$H = READ_ONLY;
    var isLoraOnly$H = false;
    var examples$H = {
      'simple response': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        maxSize: maxSize$H,
        accessLevel: accessLevel$H,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x50, 0x13, 0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      },
      'response with A- energy by T1, T4': {
        id: id$H,
        name: name$H,
        headerSize: headerSize$H,
        maxSize: maxSize$H,
        accessLevel: accessLevel$H,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          energyType: 2,
          energies: [40301230, null, null, 2145623]
        },
        bytes: [0x50, 0x0c, 0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$H = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var parameters;
      if (bytes.length === COMMAND_SIZE) {
        parameters = {
          date: getDate$1(buffer),
          energies: getEnergies(buffer)
        };
      } else {
        parameters = _objectSpread2({
          date: getDate$1(buffer)
        }, getPackedEnergyWithType(buffer));
      }
      return parameters;
    };
    var toBytes$H = function toBytes(parameters) {
      var buffer = new BinaryBuffer(getPackedEnergiesWithDateSize(parameters), false);
      setDate$1(buffer, parameters.date);
      setPackedEnergyWithType(buffer, parameters);
      return toBytes$26(id$H, buffer.data);
    };
    var toJson$2 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var date = parameters.date,
        energies = parameters.energies;
      var result = dlms ? _objectSpread2({
        date: date
      }, convertEnergiesToDlms(energies)) : parameters;
      return JSON.stringify(result);
    };

    var getEnergyExportDayPrevious = /*#__PURE__*/Object.freeze({
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
        toJson: toJson$2
    });

    var BODY_WITHOUT_EVENTS_SIZE = 3 + 1;
    var EVENT_SIZE = 4;
    var id$G = getEvents$2;
    var name$G = commandNames[getEvents$2];
    var headerSize$G = 2;
    var accessLevel$G = READ_ONLY;
    var maxSize$G = BODY_WITHOUT_EVENTS_SIZE + 255 * EVENT_SIZE;
    var isLoraOnly$G = false;
    var examples$G = {
      'simple response': {
        id: id$G,
        name: name$G,
        headerSize: headerSize$G,
        accessLevel: accessLevel$G,
        maxSize: maxSize$G,
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
    var getFromBytes = function getFromBytes(BinaryBufferConstructor) {
      return function (bytes) {
        if (bytes.length > maxSize$G) {
          throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
        }
        var buffer = new BinaryBufferConstructor(bytes, false);
        var date = getDate$1(buffer);
        var eventsNumber = buffer.getUint8();
        var events = [];
        while (!buffer.isEmpty) {
          events.push(getEvent(buffer));
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
        var buffer = new BinaryBufferConstructor(maxSize$G, false);
        setDate$1(buffer, parameters.date);
        buffer.setUint8(parameters.eventsNumber);
        var _iterator = _createForOfIteratorHelper(parameters.events),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;
            setEvent(buffer, event);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return toBytes$26(id$G, buffer.getBytesToOffset());
      };
    };
    var fromBytes$G = getFromBytes(BinaryBuffer);
    var toBytes$G = getToBytes(BinaryBuffer);

    var getEvents = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$G,
        examples: examples$G,
        fromBytes: fromBytes$G,
        getFromBytes: getFromBytes,
        getToBytes: getToBytes,
        headerSize: headerSize$G,
        id: id$G,
        isLoraOnly: isLoraOnly$G,
        maxSize: maxSize$G,
        name: name$G,
        toBytes: toBytes$G
    });

    var COMMAND_BODY_SIZE = 14;
    var OLD_COMMAND_BODY_SIZE = 20;
    var id$F = getEventsCounters$2;
    var name$F = commandNames[getEventsCounters$2];
    var headerSize$F = 2;
    var accessLevel$F = READ_ONLY;
    var maxSize$F = OLD_COMMAND_BODY_SIZE;
    var isLoraOnly$F = false;
    var examples$F = {
      'simple response': {
        id: id$F,
        name: name$F,
        headerSize: headerSize$F,
        accessLevel: accessLevel$F,
        maxSize: maxSize$F,
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
    var fromBytes$F = function fromBytes(bytes) {
      if (bytes.length !== COMMAND_BODY_SIZE && bytes.length !== OLD_COMMAND_BODY_SIZE) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      var buffer = new BinaryBuffer(bytes, false);
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
    var toBytes$F = function toBytes(parameters) {
      var buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);
      buffer.setUint16(parameters.restart);
      buffer.setUint16(parameters.powerOff);
      buffer.setUint16(parameters.localParametersChange);
      buffer.setUint16(parameters.remoteParametersChange);
      buffer.setUint16(parameters.accessError);
      buffer.setUint16(parameters.accessClosed);
      buffer.setUint16(parameters.setClock);
      return toBytes$26(id$F, buffer.data);
    };

    var getEventsCounters = /*#__PURE__*/Object.freeze({
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

    var id$E = getEventStatus$3;
    var name$E = commandNames[getEventStatus$3];
    var headerSize$E = 2;
    var accessLevel$E = READ_ONLY;
    var maxSize$E = 2;
    var isLoraOnly$E = false;
    var examples$E = {
      'simple response': {
        id: id$E,
        name: name$E,
        headerSize: headerSize$E,
        accessLevel: accessLevel$E,
        maxSize: maxSize$E,
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
    var fromBytes$E = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, true);
      return getEventStatus$2(buffer);
    };
    var toBytes$E = function toBytes(eventStatus) {
      var buffer = new BinaryBuffer(maxSize$E, true);
      setEventStatus(buffer, eventStatus);
      return toBytes$26(id$E, buffer.data);
    };

    var getEventStatus = /*#__PURE__*/Object.freeze({
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

    var id$D = getExtendedCurrentValues$2;
    var name$D = commandNames[getExtendedCurrentValues$2];
    var headerSize$D = 2;
    var maxSize$D = 4;
    var accessLevel$D = READ_ONLY;
    var isLoraOnly$D = false;
    var examples$D = {
      'simple response': {
        id: id$D,
        name: name$D,
        headerSize: headerSize$D,
        maxSize: maxSize$D,
        accessLevel: accessLevel$D,
        parameters: {
          temperature: 67,
          frequency: 60
        },
        bytes: [0x3a, 0x04, 0x00, 0x43, 0x00, 0x3c]
      }
    };
    var fromBytes$D = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        temperature: buffer.getInt16(),
        frequency: buffer.getInt16()
      };
    };
    var toBytes$D = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$D, false);
      buffer.setInt16(parameters.temperature);
      buffer.setInt16(parameters.frequency);
      return toBytes$26(id$D, buffer.data);
    };
    var toJson$1 = function toJson(parameters) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDlmsJsonOptions,
        dlms = _ref.dlms;
      var temperature = parameters.temperature,
        frequency = parameters.frequency;
      var result = dlms ? {
        '0.11.0': temperature,
        '14.7.0': frequency
      } : parameters;
      return JSON.stringify(result);
    };

    var getExtendedCurrentValues = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$D,
        examples: examples$D,
        fromBytes: fromBytes$D,
        headerSize: headerSize$D,
        id: id$D,
        isLoraOnly: isLoraOnly$D,
        maxSize: maxSize$D,
        name: name$D,
        toBytes: toBytes$D,
        toJson: toJson$1
    });

    var id$C = getExtendedCurrentValues2$3;
    var name$C = commandNames[getExtendedCurrentValues2$3];
    var headerSize$C = 2;
    var maxSize$C = 7;
    var accessLevel$C = READ_ONLY;
    var isLoraOnly$C = false;
    var examples$C = {
      'simple response': {
        id: id$C,
        name: name$C,
        headerSize: headerSize$C,
        maxSize: maxSize$C,
        accessLevel: accessLevel$C,
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
            RELAY_UNEQUAL_CURRENT_OFF: false,
            RELAY_BIPOLAR_POWER_OFF: false,
            RELAY_SALDO_OFF_ON_MAX_POWER: false,
            RELAY_HARD_ST1: true,
            RELAY_MAGNET_OFF: false,
            RELAY_P_MINUS_MAX_OFF: false
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
            UNEQUAL_CURRENT: true,
            BIPOLAR_POWER: false,
            POWER_A_NEGATIVE: false,
            POWER_B_NEGATIVE: true
          }
        },
        bytes: [0x2d, 0x07, 0x01, 0x66, 0x61, 0x21, 0x59, 0x0a, 0x81]
      }
    };
    var fromBytes$C = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getExtendedCurrentValues2$2(buffer);
    };
    var toBytes$C = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$C, false);
      setExtendedCurrentValues2(buffer, parameters);
      return toBytes$26(id$C, buffer.data);
    };

    var getExtendedCurrentValues2 = /*#__PURE__*/Object.freeze({
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

    var id$B = getHalfHourDemand$2;
    var name$B = commandNames[getHalfHourDemand$2];
    var headerSize$B = 2;
    var maxSize$B = MAX_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$B = READ_ONLY;
    var isLoraOnly$B = false;
    var examples$B = {
      'simple response': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        maxSize: maxSize$B,
        accessLevel: accessLevel$B,
        parameters: {
          date: {
            year: 24,
            month: 3,
            date: 22
          },
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }]
        },
        bytes: [0x15, 0x63, 0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f]
      },
      'response with no periods': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        maxSize: maxSize$B,
        accessLevel: accessLevel$B,
        parameters: {
          date: {
            year: 22,
            month: 6,
            date: 18
          },
          periods: [{
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }]
        },
        bytes: [0x15, 0x63, 0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
      },
      'response for day when DST start/end': {
        id: id$B,
        name: name$B,
        headerSize: headerSize$B,
        maxSize: maxSize$B,
        accessLevel: accessLevel$B,
        parameters: {
          date: {
            year: 24,
            month: 2,
            date: 31
          },
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }, {
            tariff: 1,
            energy: 6000
          }, {
            tariff: 1,
            energy: 6111
          }],
          dstHour: 3
        },
        bytes: [0x15, 0x68, 0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03]
      }
    };
    var fromBytes$B = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = getDate$1(buffer);
      var periods = getEnergyPeriods(buffer, hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          periods: periods,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        periods: periods
      };
    };
    var toBytes$B = function toBytes(parameters) {
      var buffer = new BinaryBuffer(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE, false);
      setDate$1(buffer, parameters.date);
      setEnergyPeriods(buffer, parameters.periods);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$26(id$B, buffer.data);
    };

    var getHalfHourDemand = /*#__PURE__*/Object.freeze({
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

    var id$A = getHalfHourDemandExport$2;
    var name$A = commandNames[getHalfHourDemandExport$2];
    var headerSize$A = 2;
    var maxSize$A = MAX_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$A = READ_ONLY;
    var isLoraOnly$A = false;
    var examples$A = {
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
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }]
        },
        bytes: [0x53, 0x63, 0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f]
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
          periods: [{
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }]
        },
        bytes: [0x53, 0x63, 0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
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
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }, {
            tariff: 1,
            energy: 6000
          }, {
            tariff: 1,
            energy: 6111
          }],
          dstHour: 3
        },
        bytes: [0x53, 0x68, 0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03]
      }
    };
    var fromBytes$A = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = getDate$1(buffer);
      var periods = getEnergyPeriods(buffer, hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          periods: periods,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        periods: periods
      };
    };
    var toBytes$A = function toBytes(parameters) {
      var buffer = new BinaryBuffer(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE, false);
      setDate$1(buffer, parameters.date);
      setEnergyPeriods(buffer, parameters.periods);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$26(id$A, buffer.data);
    };

    var getHalfHourDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$z = getHalfHourDemandPrevious$2;
    var name$z = commandNames[getHalfHourDemandPrevious$2];
    var headerSize$z = 2;
    var maxSize$z = MAX_HALF_HOUR_COMMAND_SIZE;
    var accessLevel$z = READ_ONLY;
    var isLoraOnly$z = false;
    var examples$z = {
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
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }]
        },
        bytes: [0x4b, 0x63, 0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f]
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
          periods: [{
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }, {
            tariff: undefined,
            energy: undefined
          }]
        },
        bytes: [0x4b, 0x63, 0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
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
          periods: [{
            tariff: 1,
            energy: 1111
          }, {
            tariff: 1,
            energy: 1222
          }, {
            tariff: 1,
            energy: 1333
          }, {
            tariff: 1,
            energy: 1444
          }, {
            tariff: 1,
            energy: 1555
          }, {
            tariff: 1,
            energy: 1666
          }, {
            tariff: 1,
            energy: 1777
          }, {
            tariff: 1,
            energy: 1888
          }, {
            tariff: 1,
            energy: 1999
          }, {
            tariff: 1,
            energy: 2000
          }, {
            tariff: 1,
            energy: 2111
          }, {
            tariff: 1,
            energy: 2222
          }, {
            tariff: 1,
            energy: 2333
          }, {
            tariff: 1,
            energy: 2444
          }, {
            tariff: 1,
            energy: 2555
          }, {
            tariff: 1,
            energy: 2666
          }, {
            tariff: 1,
            energy: 2777
          }, {
            tariff: 1,
            energy: 2888
          }, {
            tariff: 1,
            energy: 2999
          }, {
            tariff: 1,
            energy: 3000
          }, {
            tariff: 1,
            energy: 3111
          }, {
            tariff: 1,
            energy: 3222
          }, {
            tariff: 1,
            energy: 3333
          }, {
            tariff: 1,
            energy: 3444
          }, {
            tariff: 1,
            energy: 3555
          }, {
            tariff: 1,
            energy: 3666
          }, {
            tariff: 1,
            energy: 3777
          }, {
            tariff: 1,
            energy: 3888
          }, {
            tariff: 1,
            energy: 3999
          }, {
            tariff: 1,
            energy: 4000
          }, {
            tariff: 1,
            energy: 4111
          }, {
            tariff: 1,
            energy: 4222
          }, {
            tariff: 1,
            energy: 4333
          }, {
            tariff: 1,
            energy: 4444
          }, {
            tariff: 1,
            energy: 4555
          }, {
            tariff: 1,
            energy: 4666
          }, {
            tariff: 1,
            energy: 4777
          }, {
            tariff: 1,
            energy: 4888
          }, {
            tariff: 1,
            energy: 4999
          }, {
            tariff: 1,
            energy: 5000
          }, {
            tariff: 1,
            energy: 5222
          }, {
            tariff: 1,
            energy: 5333
          }, {
            tariff: 1,
            energy: 5444
          }, {
            tariff: 1,
            energy: 5555
          }, {
            tariff: 1,
            energy: 5666
          }, {
            tariff: 1,
            energy: 5777
          }, {
            tariff: 1,
            energy: 5888
          }, {
            tariff: 1,
            energy: 5999
          }, {
            tariff: 1,
            energy: 6000
          }, {
            tariff: 1,
            energy: 6111
          }],
          dstHour: 3
        },
        bytes: [0x4b, 0x68, 0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46, 0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49, 0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d, 0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50, 0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53, 0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57, 0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03]
      }
    };
    var fromBytes$z = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
      var date = getDate$1(buffer);
      var periods = getEnergyPeriods(buffer, hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);
      if (hasDst) {
        return {
          date: date,
          periods: periods,
          dstHour: buffer.getUint8()
        };
      }
      return {
        date: date,
        periods: periods
      };
    };
    var toBytes$z = function toBytes(parameters) {
      var buffer = new BinaryBuffer(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE, false);
      setDate$1(buffer, parameters.date);
      setEnergyPeriods(buffer, parameters.periods);
      if (parameters.dstHour) {
        buffer.setUint8(parameters.dstHour);
      }
      return toBytes$26(id$z, buffer.data);
    };

    var getHalfHourDemandPrevious = /*#__PURE__*/Object.freeze({
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
    var id$y = getHalfHourEnergies$2;
    var name$y = commandNames[getHalfHourEnergies$2];
    var headerSize$y = 2;
    var maxSize$y = DATE_SIZE + ENERGY_FLAGS_SIZE + START_HALFHOUR_SIZE + HALFHOURS_NUMBER_SIZE + MAX_HALFHOURS_ENERGY_SIZE;
    var accessLevel$y = UNENCRYPTED;
    var isLoraOnly$y = true;
    var examples$y = {
      'get halfhours energies': {
        id: id$y,
        headerSize: headerSize$y,
        name: name$y,
        maxSize: maxSize$y,
        parameters: {
          date: {
            year: 21,
            month: 2,
            date: 3
          },
          firstHalfhour: 1,
          halfhoursNumber: 2,
          energies: {
            'A+': [{
              tariff: 1,
              energy: 0
            }, {
              tariff: 2,
              energy: 47
            }],
            'A-R+': [{
              tariff: 1,
              energy: 1234
            }, {
              tariff: 2,
              energy: 12345
            }]
          }
        },
        bytes: [0x6f, 0x0d, 0x2a, 0x43, 0x11, 0x01, 0x02, 0x40, 0x00, 0x80, 0x2f, 0x44, 0xd2, 0xb0, 0x39]
      }
    };
    var fromBytes$y = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var date = getDate(buffer);
      var energiesFlags = getEnergiesFlags(buffer);
      var firstHalfhour = buffer.getUint8();
      var halfhoursNumber = buffer.getUint8();
      return {
        date: date,
        firstHalfhour: firstHalfhour,
        halfhoursNumber: halfhoursNumber,
        energies: getHalfHourEnergies1(buffer, energiesFlags, halfhoursNumber)
      };
    };
    var toBytes$y = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$y, false);
      var date = parameters.date,
        firstHalfhour = parameters.firstHalfhour,
        halfhoursNumber = parameters.halfhoursNumber,
        energies = parameters.energies;
      setDate(buffer, date);
      setEnergiesFlags(buffer, energies);
      buffer.setUint8(firstHalfhour);
      buffer.setUint8(halfhoursNumber);
      setHalfHourEnergies1(buffer, energies);
      return toBytes$26(id$y, buffer.getBytesToOffset());
    };
    var toJson = function toJson(parameters) {
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

    var getHalfHourEnergies = /*#__PURE__*/Object.freeze({
        __proto__: null,
        accessLevel: accessLevel$y,
        examples: examples$y,
        fromBytes: fromBytes$y,
        headerSize: headerSize$y,
        id: id$y,
        isLoraOnly: isLoraOnly$y,
        maxSize: maxSize$y,
        name: name$y,
        toBytes: toBytes$y,
        toJson: toJson
    });

    var id$x = getMagneticFieldThreshold$2;
    var name$x = commandNames[getMagneticFieldThreshold$2];
    var headerSize$x = 2;
    var maxSize$x = 10;
    var accessLevel$x = READ_ONLY;
    var isLoraOnly$x = false;
    var examples$x = {
      'simple response': {
        id: id$x,
        name: name$x,
        headerSize: headerSize$x,
        maxSize: maxSize$x,
        accessLevel: accessLevel$x,
        parameters: {
          induction: 10,
          threshold: 5,
          inductionCoefficient: 1.23,
          reserved: 0xffffffff
        },
        bytes: [0x6d, 0x0a, 0x00, 0x0a, 0x00, 0x05, 0x00, 0x7b, 0xff, 0xff, 0xff, 0xff]
      }
    };
    var fromBytes$x = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        induction: buffer.getUint16(),
        threshold: buffer.getUint16(),
        inductionCoefficient: buffer.getUint16() / 100,
        reserved: buffer.getUint32()
      };
    };
    var toBytes$x = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$x, false);
      buffer.setUint16(parameters.induction);
      buffer.setUint16(parameters.threshold);
      buffer.setUint16(parameters.inductionCoefficient * 100);
      buffer.setUint32(parameters.reserved);
      return toBytes$26(id$x, buffer.data);
    };

    var getMagneticFieldThreshold = /*#__PURE__*/Object.freeze({
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

    var id$w = getMeterInfo$2;
    var name$w = commandNames[getMeterInfo$2];
    var headerSize$w = 2;
    var maxSize$w = 1;
    var accessLevel$w = READ_ONLY;
    var isLoraOnly$w = false;
    var examples$w = {
      'simple response': {
        id: id$w,
        name: name$w,
        headerSize: headerSize$w,
        maxSize: maxSize$w,
        accessLevel: accessLevel$w,
        parameters: {
          ten: 0
        },
        bytes: [0x7a, 0x01, 0x00]
      }
    };
    var fromBytes$w = function fromBytes(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        ten = _ref2[0];
      return {
        ten: ten
      };
    };
    var toBytes$w = function toBytes(_ref3) {
      var ten = _ref3.ten;
      return toBytes$26(id$w, [ten]);
    };

    var getMeterInfo = /*#__PURE__*/Object.freeze({
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

    var id$v = getMonthDemand$2;
    var name$v = commandNames[getMonthDemand$2];
    var headerSize$v = 2;
    var accessLevel$v = READ_ONLY;
    var maxSize$v = 18;
    var isLoraOnly$v = false;
    var examples$v = {
      'response energy for 2024.03': {
        id: id$v,
        name: name$v,
        headerSize: headerSize$v,
        maxSize: maxSize$v,
        accessLevel: accessLevel$v,
        parameters: {
          year: 24,
          month: 3,
          energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [0x17, 0x12, 0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$v = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        energies: getEnergies(buffer)
      };
    };
    var toBytes$v = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$v, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      setEnergies(buffer, parameters.energies);
      return toBytes$26(id$v, buffer.data);
    };

    var getMonthDemand = /*#__PURE__*/Object.freeze({
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

    var id$u = getMonthDemandExport$2;
    var name$u = commandNames[getMonthDemandExport$2];
    var headerSize$u = 2;
    var accessLevel$u = READ_ONLY;
    var maxSize$u = 18;
    var isLoraOnly$u = false;
    var examples$u = {
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
        bytes: [0x52, 0x12, 0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57]
      }
    };
    var fromBytes$u = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        energies: getEnergies(buffer)
      };
    };
    var toBytes$u = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$u, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      setEnergies(buffer, parameters.energies);
      return toBytes$26(id$u, buffer.data);
    };

    var getMonthDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$t = getMonthMaxDemand$2;
    var name$t = commandNames[getMonthMaxDemand$2];
    var headerSize$t = 2;
    var accessLevel$t = READ_ONLY;
    var maxSize$t = 2 + TARIFF_NUMBER$1 * 7;
    var isLoraOnly$t = false;
    var examples$t = {
      'response max power for 2024.03': {
        id: id$t,
        name: name$t,
        headerSize: headerSize$t,
        maxSize: maxSize$t,
        accessLevel: accessLevel$t,
        parameters: {
          year: 24,
          month: 3,
          tariffs: [{
            date: 22,
            hours: 12,
            minutes: 48,
            power: 2424
          }, {
            date: 12,
            hours: 12,
            minutes: 33,
            power: 3644
          }, {
            date: 25,
            hours: 15,
            minutes: 4,
            power: 1244
          }, {
            date: 8,
            hours: 17,
            minutes: 32,
            power: 5244
          }]
        },
        bytes: [0x32, 0x1e, 0x18, 0x03, 0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78, 0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c, 0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc, 0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c]
      }
    };
    var fromBytes$t = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        tariffs: getMonthMaxPowerByTariffs(buffer)
      };
    };
    var toBytes$t = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$t, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      setMonthMaxPowerByTariffs(buffer, parameters.tariffs);
      return toBytes$26(id$t, buffer.data);
    };

    var getMonthMaxDemand = /*#__PURE__*/Object.freeze({
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

    var id$s = getMonthMaxDemandExport$2;
    var name$s = commandNames[getMonthMaxDemandExport$2];
    var headerSize$s = 2;
    var accessLevel$s = READ_ONLY;
    var maxSize$s = 2 + TARIFF_NUMBER$1 * 7;
    var isLoraOnly$s = false;
    var examples$s = {
      'response max power for 2024.03': {
        id: id$s,
        name: name$s,
        headerSize: headerSize$s,
        maxSize: maxSize$s,
        accessLevel: accessLevel$s,
        parameters: {
          year: 24,
          month: 3,
          tariffs: [{
            date: 22,
            hours: 12,
            minutes: 48,
            power: 2424
          }, {
            date: 12,
            hours: 12,
            minutes: 33,
            power: 3644
          }, {
            date: 25,
            hours: 15,
            minutes: 4,
            power: 1244
          }, {
            date: 8,
            hours: 17,
            minutes: 32,
            power: 5244
          }]
        },
        bytes: [0x59, 0x1e, 0x18, 0x03, 0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78, 0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c, 0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc, 0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c]
      }
    };
    var fromBytes$s = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return {
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        tariffs: getMonthMaxPowerByTariffs(buffer)
      };
    };
    var toBytes$s = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$s, false);
      buffer.setUint8(parameters.year);
      buffer.setUint8(parameters.month);
      setMonthMaxPowerByTariffs(buffer, parameters.tariffs);
      return toBytes$26(id$s, buffer.data);
    };

    var getMonthMaxDemandExport = /*#__PURE__*/Object.freeze({
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

    var id$r = getOperatorParameters$3;
    var name$r = commandNames[getOperatorParameters$3];
    var headerSize$r = 2;
    var maxSize$r = OPERATOR_PARAMETERS_SIZE;
    var accessLevel$r = READ_ONLY;
    var isLoraOnly$r = false;
    var examples$r = {
      'get default operator parameters response': {
        id: id$r,
        name: name$r,
        headerSize: headerSize$r,
        maxSize: maxSize$r,
        accessLevel: accessLevel$r,
        parameters: {
          vpThreshold: 265000,
          vThreshold: 156000,
          ipThreshold: 120000,
          pmaxThreshold0: 31800,
          pmaxThreshold1: 31800,
          pmaxThreshold2: 31800,
          pmaxThreshold3: 31800,
          serialPortsSpeed: {
            rs485orTwi: 9600,
            optoport: 2400
          },
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
            POWER_FACTOR_PHASE_A: false,
            POWER_FACTOR_PHASE_B: false,
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
            RELAY_OFF_LIM_TARIFF_1: false,
            RELAY_OFF_LIM_TARIFF_2: false,
            RELAY_OFF_LIM_TARIFF_3: false,
            RELAY_OFF_LIM_TARIFF_4: false,
            RELAY_OFF_PF_MIN: false
          },
          relaySet2: {
            RELAY_OFF_Y: true,
            RELAY_OFF_CENTER: true,
            RELAY_OFF_TARIFF_1: false,
            RELAY_OFF_TARIFF_2: false,
            RELAY_OFF_TARIFF_3: false,
            RELAY_OFF_TARIFF_4: false,
            RELAY_OFF_I_LIMIT: false,
            RELAY_OFF_V_BAD: false
          },
          relaySet1: {
            RELAY_ON_Y: true,
            RELAY_ON_CENTER: true,
            RELAY_ON_PB: false,
            RELAY_ON_TARIFF_1: false,
            RELAY_ON_TARIFF_2: false,
            RELAY_ON_TARIFF_3: false,
            RELAY_ON_TARIFF_4: false,
            RELAY_ON_V_GOOD: false
          },
          displayType: 0,
          ten: 0,
          timeoutRefresh: 240,
          deltaCorMin: 15,
          timeoutMagnetOff: 5,
          timeoutMagnetOn: 5,
          define1: {
            BLOCK_KEY_OPTOPORT: false,
            MAGNET_SCREEN_CONST: false
          },
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
            POWER_FACTOR_PHASE_A: true,
            POWER_FACTOR_PHASE_B: true,
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
        bytes: [0x1e, 0x4a, 0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x24, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18]
      }
    };
    var fromBytes$r = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getOperatorParameters$2(buffer);
    };
    var toBytes$r = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$r, false);
      setOperatorParameters$2(buffer, parameters);
      return toBytes$26(id$r, buffer.data);
    };

    var getOperatorParameters = /*#__PURE__*/Object.freeze({
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

    var id$q = getOperatorParametersExtended3$3;
    var name$q = commandNames[getOperatorParametersExtended3$3];
    var headerSize$q = 2;
    var maxSize$q = 17;
    var accessLevel$q = READ_ONLY;
    var isLoraOnly$q = false;
    var examples$q = {
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
        bytes: [0x71, 0x11, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xc8, 0x00, 0x00, 0x01, 0x2c, 0x00, 0x00, 0x01, 0x90, 0x28]
      }
    };
    var fromBytes$q = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getOperatorParametersExtended3$2(buffer);
    };
    var toBytes$q = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$q, false);
      setOperatorParametersExtended3$2(buffer, parameters);
      return toBytes$26(id$q, buffer.data);
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

    var id$p = getRatePlanInfo$2;
    var name$p = commandNames[getRatePlanInfo$2];
    var headerSize$p = 2;
    var maxSize$p = 1 + TARIFF_PLAN_SIZE * 2;
    var accessLevel$p = READ_ONLY;
    var isLoraOnly$p = false;
    var examples$p = {
      'rate plan info response for A- table': {
        id: id$p,
        name: name$p,
        headerSize: headerSize$p,
        maxSize: maxSize$p,
        accessLevel: accessLevel$p,
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
    var fromBytes$p = function fromBytes(bytes) {
      if (bytes.length !== maxSize$p) {
        throw new Error('Invalid getRatePlanInfo data size.');
      }
      var buffer = new BinaryBuffer(bytes, false);
      return {
        tariffTable: buffer.getUint8(),
        activePlan: getTariffPlan(buffer),
        passivePlan: getTariffPlan(buffer)
      };
    };
    var toBytes$p = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$p, false);
      buffer.setUint8(parameters.tariffTable);
      setTariffPlan(buffer, parameters.activePlan);
      setTariffPlan(buffer, parameters.passivePlan);
      return toBytes$26(id$p, buffer.data);
    };

    var getRatePlanInfo = /*#__PURE__*/Object.freeze({
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

    var id$o = getSaldo$2;
    var name$o = commandNames[getSaldo$2];
    var headerSize$o = 2;
    var maxSize$o = 29;
    var accessLevel$o = READ_ONLY;
    var isLoraOnly$o = false;
    var examples$o = {
      'test response': {
        id: id$o,
        name: name$o,
        headerSize: headerSize$o,
        maxSize: maxSize$o,
        accessLevel: accessLevel$o,
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
    var fromBytes$o = function fromBytes(bytes) {
      if (bytes.length !== maxSize$o) {
        throw new Error('Invalid getSaldo data size.');
      }
      var buffer = new BinaryBuffer(bytes, false);
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
    var toBytes$o = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$o, false);
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
      return toBytes$26(id$o, buffer.data);
    };

    var getSaldo = /*#__PURE__*/Object.freeze({
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

    var id$n = getSaldoParameters$3;
    var name$n = commandNames[getSaldoParameters$3];
    var headerSize$n = 2;
    var maxSize$n = 37;
    var accessLevel$n = READ_ONLY;
    var isLoraOnly$n = false;
    var examples$n = {
      'default response': {
        id: id$n,
        name: name$n,
        headerSize: headerSize$n,
        maxSize: maxSize$n,
        accessLevel: accessLevel$n,
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
        id: id$n,
        name: name$n,
        headerSize: headerSize$n,
        maxSize: maxSize$n,
        accessLevel: accessLevel$n,
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
    var fromBytes$n = function fromBytes(bytes) {
      if (bytes.length !== maxSize$n) {
        throw new Error('Invalid getSaldoParameters data size.');
      }
      var buffer = new BinaryBuffer(bytes, false);
      return getSaldoParameters$2(buffer);
    };
    var toBytes$n = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$n, false);
      setSaldoParameters$2(buffer, parameters);
      return toBytes$26(id$n, buffer.data);
    };

    var getSaldoParameters = /*#__PURE__*/Object.freeze({
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

    var id$m = getSeasonProfile$3;
    var name$m = commandNames[getSeasonProfile$3];
    var headerSize$m = 2;
    var maxSize$m = 9;
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
          month: 1,
          date: 2,
          dayIndexes: [0, 1, 0, 1, 0, 1, 0]
        },
        bytes: [0x3c, 0x09, 0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00]
      }
    };
    var fromBytes$m = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getSeasonProfile$2(buffer);
    };
    var toBytes$m = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$m, false);
      setSeasonProfile$2(buffer, parameters);
      return toBytes$26(id$m, buffer.data);
    };

    var getSeasonProfile = /*#__PURE__*/Object.freeze({
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

    var id$l = getSpecialDay$3;
    var name$l = commandNames[getSpecialDay$3];
    var headerSize$l = 2;
    var maxSize$l = 4;
    var accessLevel$l = READ_ONLY;
    var isLoraOnly$l = false;
    var examples$l = {
      'special day response': {
        id: id$l,
        name: name$l,
        headerSize: headerSize$l,
        maxSize: maxSize$l,
        accessLevel: accessLevel$l,
        parameters: {
          month: 1,
          date: 9,
          dayIndex: 3,
          year: 10
        },
        bytes: [0x3d, 0x04, 0x01, 0x09, 0x03, 0x0a]
      }
    };
    var fromBytes$l = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      return getSpecialDay$2(buffer);
    };
    var toBytes$l = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$l, false);
      setSpecialDay$2(buffer, parameters);
      return toBytes$26(id$l, buffer.data);
    };

    var getSpecialDay = /*#__PURE__*/Object.freeze({
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

    var id$k = getVersion$2;
    var name$k = commandNames[getVersion$2];
    var headerSize$k = 2;
    var maxSize$k = 10;
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
          version: '104.25.003'
        },
        bytes: [0x28, 0x0a, 0x31, 0x30, 0x34, 0x2e, 0x32, 0x35, 0x2e, 0x30, 0x30, 0x33]
      }
    };
    var fromBytes$k = function fromBytes(bytes) {
      return {
        version: String.fromCharCode.apply(null, _toConsumableArray(bytes))
      };
    };
    var toBytes$k = function toBytes(parameters) {
      var version = parameters.version.split('').map(function (_char) {
        return _char.charCodeAt(0);
      });
      return toBytes$26(id$k, version);
    };

    var getVersion = /*#__PURE__*/Object.freeze({
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

    var id$j = prepareRatePlan$2;
    var name$j = commandNames[prepareRatePlan$2];
    var headerSize$j = 2;
    var maxSize$j = 0;
    var accessLevel$j = READ_WRITE;
    var isLoraOnly$j = false;
    var examples$j = {
      'simple response': {
        id: id$j,
        name: name$j,
        headerSize: headerSize$j,
        maxSize: maxSize$j,
        accessLevel: accessLevel$j,
        parameters: {},
        bytes: [0x14, 0x00]
      }
    };
    var fromBytes$j = function fromBytes(bytes) {
      if (bytes.length !== maxSize$j) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$j = function toBytes() {
      return toBytes$26(id$j);
    };

    var prepareRatePlan = /*#__PURE__*/Object.freeze({
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

    var id$i = resetPowerMaxDay$2;
    var name$i = commandNames[resetPowerMaxDay$2];
    var headerSize$i = 2;
    var maxSize$i = 0;
    var accessLevel$i = READ_WRITE;
    var isLoraOnly$i = false;
    var examples$i = {
      'simple response': {
        id: id$i,
        name: name$i,
        headerSize: headerSize$i,
        maxSize: maxSize$i,
        accessLevel: accessLevel$i,
        parameters: {},
        bytes: [0x35, 0x00]
      }
    };
    var fromBytes$i = function fromBytes(bytes) {
      if (bytes.length !== maxSize$i) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$i = function toBytes() {
      return toBytes$26(id$i);
    };

    var resetPowerMaxDay = /*#__PURE__*/Object.freeze({
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

    var id$h = resetPowerMaxMonth$2;
    var name$h = commandNames[resetPowerMaxMonth$2];
    var headerSize$h = 2;
    var maxSize$h = 0;
    var accessLevel$h = READ_WRITE;
    var isLoraOnly$h = false;
    var examples$h = {
      'simple response': {
        id: id$h,
        name: name$h,
        headerSize: headerSize$h,
        maxSize: maxSize$h,
        accessLevel: accessLevel$h,
        parameters: {},
        bytes: [0x36, 0x00]
      }
    };
    var fromBytes$h = function fromBytes(bytes) {
      if (bytes.length !== maxSize$h) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$h = function toBytes() {
      return toBytes$26(id$h);
    };

    var resetPowerMaxMonth = /*#__PURE__*/Object.freeze({
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

    var id$g = runTariffPlan$2;
    var name$g = commandNames[runTariffPlan$2];
    var headerSize$g = 2;
    var maxSize$g = 0;
    var accessLevel$g = READ_WRITE;
    var isLoraOnly$g = false;
    var examples$g = {
      'simple response': {
        id: id$g,
        name: name$g,
        headerSize: headerSize$g,
        maxSize: maxSize$g,
        accessLevel: accessLevel$g,
        parameters: {},
        bytes: [0x46, 0x00]
      }
    };
    var fromBytes$g = function fromBytes(bytes) {
      if (bytes.length !== maxSize$g) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$g = function toBytes() {
      return toBytes$26(id$g);
    };

    var runTariffPlan = /*#__PURE__*/Object.freeze({
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

    var id$f = setAccessKey$2;
    var name$f = commandNames[setAccessKey$2];
    var headerSize$f = 2;
    var maxSize$f = 0;
    var accessLevel$f = READ_WRITE;
    var isLoraOnly$f = false;
    var examples$f = {
      'simple response': {
        id: id$f,
        name: name$f,
        headerSize: headerSize$f,
        maxSize: maxSize$f,
        accessLevel: accessLevel$f,
        parameters: {},
        bytes: [0x09, 0x00]
      }
    };
    var fromBytes$f = function fromBytes(bytes) {
      if (bytes.length !== maxSize$f) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$f = function toBytes() {
      return toBytes$26(id$f);
    };

    var setAccessKey = /*#__PURE__*/Object.freeze({
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

    var id$e = setCorrectDateTime$2;
    var name$e = commandNames[setCorrectDateTime$2];
    var headerSize$e = 2;
    var maxSize$e = 0;
    var accessLevel$e = READ_ONLY;
    var isLoraOnly$e = false;
    var examples$e = {
      'simple response': {
        id: id$e,
        name: name$e,
        headerSize: headerSize$e,
        maxSize: maxSize$e,
        accessLevel: accessLevel$e,
        parameters: {},
        bytes: [0x5c, 0x00]
      }
    };
    var fromBytes$e = function fromBytes(bytes) {
      if (bytes.length !== maxSize$e) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$e = function toBytes() {
      return toBytes$26(id$e);
    };

    var setCorrectDateTime = /*#__PURE__*/Object.freeze({
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

    var id$d = setCorrectTime$2;
    var name$d = commandNames[setCorrectTime$2];
    var headerSize$d = 2;
    var maxSize$d = 0;
    var accessLevel$d = READ_WRITE;
    var isLoraOnly$d = false;
    var examples$d = {
      'simple response': {
        id: id$d,
        name: name$d,
        headerSize: headerSize$d,
        maxSize: maxSize$d,
        accessLevel: accessLevel$d,
        parameters: {},
        bytes: [0x1c, 0x00]
      }
    };
    var fromBytes$d = function fromBytes(bytes) {
      if (bytes.length !== maxSize$d) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$d = function toBytes() {
      return toBytes$26(id$d);
    };

    var setCorrectTime = /*#__PURE__*/Object.freeze({
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

    var id$c = setDateTime$3;
    var name$c = commandNames[setDateTime$3];
    var headerSize$c = 2;
    var maxSize$c = 0;
    var accessLevel$c = READ_ONLY;
    var isLoraOnly$c = false;
    var examples$c = {
      'simple response': {
        id: id$c,
        name: name$c,
        headerSize: headerSize$c,
        maxSize: maxSize$c,
        accessLevel: accessLevel$c,
        parameters: {},
        bytes: [0x08, 0x00]
      }
    };
    var fromBytes$c = function fromBytes(bytes) {
      if (bytes.length !== maxSize$c) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$c = function toBytes() {
      return toBytes$26(id$c);
    };

    var setDateTime = /*#__PURE__*/Object.freeze({
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

    var id$b = setDayProfile$3;
    var name$b = commandNames[setDayProfile$3];
    var headerSize$b = 2;
    var maxSize$b = 0;
    var accessLevel$b = READ_WRITE;
    var isLoraOnly$b = false;
    var examples$b = {
      'simple response': {
        id: id$b,
        name: name$b,
        headerSize: headerSize$b,
        maxSize: maxSize$b,
        accessLevel: accessLevel$b,
        parameters: {},
        bytes: [0x10, 0x00]
      }
    };
    var fromBytes$b = function fromBytes(bytes) {
      if (bytes.length !== maxSize$b) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$b = function toBytes() {
      return toBytes$26(id$b);
    };

    var setDayProfile = /*#__PURE__*/Object.freeze({
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

    var id$a = setDemandParameters$3;
    var name$a = commandNames[setDemandParameters$3];
    var headerSize$a = 2;
    var maxSize$a = 0;
    var accessLevel$a = READ_WRITE;
    var isLoraOnly$a = false;
    var examples$a = {
      'simple response': {
        id: id$a,
        name: name$a,
        headerSize: headerSize$a,
        maxSize: maxSize$a,
        accessLevel: accessLevel$a,
        parameters: {},
        bytes: [0x74, 0x00]
      }
    };
    var fromBytes$a = function fromBytes(bytes) {
      validateCommandPayload(name$a, bytes, maxSize$a);
      return {};
    };
    var toBytes$a = function toBytes() {
      return toBytes$26(id$a);
    };

    var setDemandParameters = /*#__PURE__*/Object.freeze({
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

    var id$9 = setDisplayParam$2;
    var name$9 = commandNames[setDisplayParam$2];
    var headerSize$9 = 2;
    var maxSize$9 = 0;
    var accessLevel$9 = READ_WRITE;
    var isLoraOnly$9 = false;
    var examples$9 = {
      'simple response': {
        id: id$9,
        name: name$9,
        headerSize: headerSize$9,
        maxSize: maxSize$9,
        accessLevel: accessLevel$9,
        parameters: {},
        bytes: [0x5d, 0x00]
      }
    };
    var fromBytes$9 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$9) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$9 = function toBytes() {
      return toBytes$26(id$9);
    };

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

    var id$8 = setOperatorParameters$3;
    var name$8 = commandNames[setOperatorParameters$3];
    var headerSize$8 = 2;
    var maxSize$8 = 0;
    var accessLevel$8 = READ_WRITE;
    var isLoraOnly$8 = false;
    var examples$8 = {
      'simple response': {
        id: id$8,
        name: name$8,
        headerSize: headerSize$8,
        maxSize: maxSize$8,
        accessLevel: accessLevel$8,
        parameters: {},
        bytes: [0x1f, 0x00]
      }
    };
    var fromBytes$8 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$8) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$8 = function toBytes() {
      return toBytes$26(id$8);
    };

    var setOperatorParameters = /*#__PURE__*/Object.freeze({
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

    var id$7 = setOperatorParametersExtended3$3;
    var name$7 = commandNames[setOperatorParametersExtended3$3];
    var headerSize$7 = 2;
    var maxSize$7 = 0;
    var accessLevel$7 = READ_WRITE;
    var isLoraOnly$7 = false;
    var examples$7 = {
      'simple response': {
        id: id$7,
        name: name$7,
        headerSize: headerSize$7,
        maxSize: maxSize$7,
        accessLevel: accessLevel$7,
        parameters: {},
        bytes: [0x72, 0x00]
      }
    };
    var fromBytes$7 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$7) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$7 = function toBytes() {
      return toBytes$26(id$7);
    };

    var setOperatorParametersExtended3 = /*#__PURE__*/Object.freeze({
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

    var id$6 = setSaldo$2;
    var name$6 = commandNames[setSaldo$2];
    var headerSize$6 = 2;
    var maxSize$6 = 0;
    var accessLevel$6 = READ_WRITE;
    var isLoraOnly$6 = false;
    var examples$6 = {
      'simple response': {
        id: id$6,
        name: name$6,
        headerSize: headerSize$6,
        maxSize: maxSize$6,
        accessLevel: accessLevel$6,
        parameters: {},
        bytes: [0x2a, 0x00]
      }
    };
    var fromBytes$6 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$6) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$6 = function toBytes() {
      return toBytes$26(id$6);
    };

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

    var id$5 = setSaldoParameters$3;
    var name$5 = commandNames[setSaldoParameters$3];
    var headerSize$5 = 2;
    var maxSize$5 = 0;
    var accessLevel$5 = READ_WRITE;
    var isLoraOnly$5 = false;
    var examples$5 = {
      'simple response': {
        id: id$5,
        name: name$5,
        headerSize: headerSize$5,
        maxSize: maxSize$5,
        accessLevel: accessLevel$5,
        parameters: {},
        bytes: [0x2f, 0x00]
      }
    };
    var fromBytes$5 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$5) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$5 = function toBytes() {
      return toBytes$26(id$5);
    };

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

    var id$4 = setSeasonProfile$3;
    var name$4 = commandNames[setSeasonProfile$3];
    var headerSize$4 = 2;
    var maxSize$4 = 0;
    var accessLevel$4 = READ_WRITE;
    var isLoraOnly$4 = false;
    var examples$4 = {
      'simple response': {
        id: id$4,
        name: name$4,
        headerSize: headerSize$4,
        maxSize: maxSize$4,
        accessLevel: accessLevel$4,
        parameters: {},
        bytes: [0x11, 0x00]
      }
    };
    var fromBytes$4 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$4) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$4 = function toBytes() {
      return toBytes$26(id$4);
    };

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

    var id$3 = setSpecialDay$3;
    var name$3 = commandNames[setSpecialDay$3];
    var headerSize$3 = 2;
    var maxSize$3 = 0;
    var accessLevel$3 = READ_WRITE;
    var isLoraOnly$3 = false;
    var examples$3 = {
      'simple response': {
        id: id$3,
        name: name$3,
        headerSize: headerSize$3,
        maxSize: maxSize$3,
        accessLevel: accessLevel$3,
        parameters: {},
        bytes: [0x12, 0x00]
      }
    };
    var fromBytes$3 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$3) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$3 = function toBytes() {
      return toBytes$26(id$3);
    };

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

    var id$2 = setSpecialOperation$2;
    var name$2 = commandNames[setSpecialOperation$2];
    var headerSize$2 = 2;
    var maxSize$2 = 1;
    var accessLevel$2 = READ_WRITE;
    var isLoraOnly$2 = false;
    var examples$2 = {
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
        bytes: [0x64, 0x01, 0x01]
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
        bytes: [0x64, 0x01, 0x02]
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
        bytes: [0x64, 0x01, 0x03]
      }
    };
    var fromBytes$2 = function fromBytes(bytes) {
      var buffer = new BinaryBuffer(bytes, false);
      var flags = buffer.getUint8();
      var electroMagneticIndication = !!(flags & 1);
      var magneticIndication = !!(flags & 2);
      return {
        electroMagneticIndication: electroMagneticIndication,
        magneticIndication: magneticIndication
      };
    };
    var toBytes$2 = function toBytes(parameters) {
      var buffer = new BinaryBuffer(maxSize$2, false);
      var flags = 0;
      if (parameters.electroMagneticIndication) {
        flags |= 1;
      }
      if (parameters.magneticIndication) {
        flags |= 2;
      }
      buffer.setUint8(flags);
      return toBytes$26(id$2, buffer.data);
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

    var id$1 = turnRelayOff$2;
    var name$1 = commandNames[turnRelayOff$2];
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
        bytes: [0x19, 0x00]
      }
    };
    var fromBytes$1 = function fromBytes(bytes) {
      if (bytes.length !== maxSize$1) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes$1 = function toBytes() {
      return toBytes$26(id$1);
    };

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

    var id = turnRelayOn$2;
    var name = commandNames[turnRelayOn$2];
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
        bytes: [0x18, 0x00]
      }
    };
    var fromBytes = function fromBytes(bytes) {
      if (bytes.length !== maxSize) {
        throw new Error("Wrong buffer size: ".concat(bytes.length, "."));
      }
      return {};
    };
    var toBytes = function toBytes() {
      return toBytes$26(id);
    };

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
        errorDataFrameResponse: errorDataFrameResponse,
        errorResponse: errorResponse,
        getBv: getBv,
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
        getDemandParameters: getDemandParameters,
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
        getHalfHourEnergies: getHalfHourEnergies,
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
        setDemandParameters: setDemandParameters,
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
