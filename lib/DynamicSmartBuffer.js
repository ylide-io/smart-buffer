"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicSmartBuffer = void 0;
var SmartBuffer_1 = require("./SmartBuffer");
var bufcode_1 = require("./bufcode");
var DynamicSmartBuffer = /** @class */ (function () {
    function DynamicSmartBuffer(_bytes) {
        this._offset = 0;
        if (_bytes) {
            this._buffer = new Uint8Array(_bytes);
            this._size = _bytes.length;
        }
        else {
            this._buffer = new Uint8Array(128);
            this._size = 0;
        }
    }
    DynamicSmartBuffer.prototype.seek = function (newOffset) {
        this._offset = newOffset;
    };
    DynamicSmartBuffer.prototype.compact = function () {
        this._buffer = this._buffer.slice(0, this._size);
    };
    Object.defineProperty(DynamicSmartBuffer.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicSmartBuffer.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        enumerable: false,
        configurable: true
    });
    DynamicSmartBuffer.ofBinaryString = function (str) {
        return new DynamicSmartBuffer(bufcode_1.bufcode.binary.from(str));
    };
    DynamicSmartBuffer.ofBase64String = function (str) {
        return new DynamicSmartBuffer(bufcode_1.bufcode.base64.from(str));
    };
    DynamicSmartBuffer.ofHexString = function (str) {
        return new DynamicSmartBuffer(bufcode_1.bufcode.hex.from(str));
    };
    DynamicSmartBuffer.ofWords = function (words) {
        return new DynamicSmartBuffer(bufcode_1.bufcode.words.from(words));
    };
    DynamicSmartBuffer.ofUTF8String = function (str) {
        return new DynamicSmartBuffer(bufcode_1.bufcode.utf8.from(str));
    };
    DynamicSmartBuffer.prototype.toHexString = function () {
        return bufcode_1.bufcode.hex.to(this.bytes);
    };
    DynamicSmartBuffer.prototype.toBinaryString = function () {
        return bufcode_1.bufcode.binary.to(this.bytes);
    };
    DynamicSmartBuffer.prototype.toBase64String = function () {
        return bufcode_1.bufcode.base64.to(this.bytes);
    };
    DynamicSmartBuffer.prototype.toWordsArray = function () {
        return bufcode_1.bufcode.words.to(this.bytes);
    };
    DynamicSmartBuffer.prototype.toUTF8String = function () {
        return bufcode_1.bufcode.utf8.to(this.bytes);
    };
    DynamicSmartBuffer.prototype.willWrite = function (size) {
        if (this._offset + size > this._buffer.length) {
            var newBuffer = new Uint8Array(this._buffer.length * 2);
            newBuffer.set(this._buffer);
            this._buffer = newBuffer;
            this._size = this._offset + size;
        }
    };
    DynamicSmartBuffer.prototype.writeUint8 = function (val) {
        this.willWrite(1);
        this._buffer[this._offset++] = val & 0xff;
    };
    DynamicSmartBuffer.prototype.writeUint16 = function (val) {
        this.willWrite(2);
        this._buffer[this._offset++] = (val >>> 8) & 0xff;
        this._buffer[this._offset++] = val & 0xff;
    };
    DynamicSmartBuffer.prototype.writeUint32 = function (val) {
        this.willWrite(4);
        this._buffer[this._offset++] = (val >>> 24) & 0xff;
        this._buffer[this._offset++] = (val >>> 16) & 0xff;
        this._buffer[this._offset++] = (val >>> 8) & 0xff;
        this._buffer[this._offset++] = val & 0xff;
    };
    DynamicSmartBuffer.prototype.writeBytes = function (val) {
        this.willWrite(val.length);
        this._buffer.set(val, this._offset);
        this._offset += val.length;
    };
    DynamicSmartBuffer.prototype.writeBuffer = function (val) {
        this.willWrite(val.size);
        this._buffer.set(val.bytes, this._offset);
        this._offset += val.bytes.length;
    };
    DynamicSmartBuffer.prototype.writeBytes8Length = function (val) {
        if (val.length > 255)
            throw new Error('Length for 8-bit length bytes must be less than 256');
        this.writeUint8(val.length);
        this.writeBytes(val);
    };
    DynamicSmartBuffer.prototype.writeBuffer8Length = function (val) {
        if (val.size > 255)
            throw new Error('Length for 8-bit length bytes must be less than 256');
        this.writeUint8(val.bytes.length);
        this.writeBuffer(val);
    };
    DynamicSmartBuffer.prototype.writeString8Length = function (val) {
        this.writeBytes8Length(bufcode_1.bufcode.utf8.from(val));
    };
    DynamicSmartBuffer.prototype.writeBytes16Length = function (val) {
        if (val.length > 65535)
            throw new Error('Length for 16-bit length bytes must be less than 65536');
        this.writeUint16(val.length);
        this.writeBytes(val);
    };
    DynamicSmartBuffer.prototype.writeBuffer16Length = function (val) {
        if (val.size > 65535)
            throw new Error('Length for 16-bit length bytes must be less than 65536');
        this.writeUint16(val.bytes.length);
        this.writeBuffer(val);
    };
    DynamicSmartBuffer.prototype.writeString16Length = function (val) {
        this.writeBytes16Length(bufcode_1.bufcode.utf8.from(val));
    };
    DynamicSmartBuffer.prototype.writeBytes32Length = function (val) {
        if (val.length > 4294967295)
            throw new Error('Length for 32-bit length bytes must be less than 4294967296');
        this.writeUint32(val.length);
        this.writeBytes(val);
    };
    DynamicSmartBuffer.prototype.writeBuffer32Length = function (val) {
        if (val.size > 4294967295)
            throw new Error('Length for 32-bit length bytes must be less than 4294967296');
        this.writeUint32(val.bytes.length);
        this.writeBuffer(val);
    };
    DynamicSmartBuffer.prototype.writeString32Length = function (val) {
        this.writeBytes32Length(bufcode_1.bufcode.utf8.from(val));
    };
    DynamicSmartBuffer.prototype.readUint8 = function () {
        return this._buffer[this._offset++] & 0xff;
    };
    DynamicSmartBuffer.prototype.readUint16 = function () {
        return ((this._buffer[this._offset++] & 0xff) << 8) + (this._buffer[this._offset++] & 0xff);
    };
    DynamicSmartBuffer.prototype.readUint32 = function () {
        return ((((this._buffer[this._offset++] & 0xff) << 24) >>> 0) +
            ((this._buffer[this._offset++] & 0xff) << 16) +
            ((this._buffer[this._offset++] & 0xff) << 8) +
            (this._buffer[this._offset++] & 0xff));
    };
    DynamicSmartBuffer.prototype.readBytes = function (length) {
        return this._buffer.slice(this._offset, (this._offset += length));
    };
    DynamicSmartBuffer.prototype.readBuffer = function (length) {
        return new SmartBuffer_1.SmartBuffer(this._buffer.slice(this._offset, (this._offset += length)));
    };
    DynamicSmartBuffer.prototype.readDynamicBuffer = function (length) {
        return new DynamicSmartBuffer(this._buffer.slice(this._offset, (this._offset += length)));
    };
    DynamicSmartBuffer.prototype.readBytes8Length = function () {
        return this.readBytes(this.readUint8());
    };
    DynamicSmartBuffer.prototype.readBuffer8Length = function () {
        return this.readBuffer(this.readUint8());
    };
    DynamicSmartBuffer.prototype.readString8Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes8Length());
    };
    DynamicSmartBuffer.prototype.readBytes16Length = function () {
        return this.readBytes(this.readUint16());
    };
    DynamicSmartBuffer.prototype.readBuffer16Length = function () {
        return this.readBuffer(this.readUint16());
    };
    DynamicSmartBuffer.prototype.readString16Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes16Length());
    };
    DynamicSmartBuffer.prototype.readBytes32Length = function () {
        return this.readBytes(this.readUint32());
    };
    DynamicSmartBuffer.prototype.readBuffer32Length = function () {
        return this.readBuffer(this.readUint32());
    };
    DynamicSmartBuffer.prototype.readString32Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes32Length());
    };
    Object.defineProperty(DynamicSmartBuffer.prototype, "bytes", {
        get: function () {
            return this._buffer.slice(0, this._size);
        },
        enumerable: false,
        configurable: true
    });
    return DynamicSmartBuffer;
}());
exports.DynamicSmartBuffer = DynamicSmartBuffer;
//# sourceMappingURL=DynamicSmartBuffer.js.map