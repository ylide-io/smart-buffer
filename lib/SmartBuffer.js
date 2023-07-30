"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartBuffer = void 0;
var bufcode_1 = require("./bufcode");
var SmartBuffer = /** @class */ (function () {
    function SmartBuffer(_bytes) {
        this._bytes = _bytes;
        this._offset = 0;
    }
    SmartBuffer.prototype.seek = function (newOffset) {
        this._offset = newOffset;
    };
    Object.defineProperty(SmartBuffer.prototype, "size", {
        get: function () {
            return this._bytes.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SmartBuffer.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        enumerable: false,
        configurable: true
    });
    SmartBuffer.ofSize = function (size) {
        return new SmartBuffer(new Uint8Array(size));
    };
    SmartBuffer.ofBinaryString = function (str) {
        return new SmartBuffer(bufcode_1.bufcode.binary.from(str));
    };
    SmartBuffer.ofBase64String = function (str) {
        return new SmartBuffer(bufcode_1.bufcode.base64.from(str));
    };
    SmartBuffer.ofHexString = function (str) {
        return new SmartBuffer(bufcode_1.bufcode.hex.from(str));
    };
    SmartBuffer.ofWords = function (words) {
        return new SmartBuffer(bufcode_1.bufcode.words.from(words));
    };
    SmartBuffer.ofUTF8String = function (str) {
        return new SmartBuffer(bufcode_1.bufcode.utf8.from(str));
    };
    SmartBuffer.prototype.toHexString = function () {
        return bufcode_1.bufcode.hex.to(this._bytes);
    };
    SmartBuffer.prototype.toBinaryString = function () {
        return bufcode_1.bufcode.binary.to(this._bytes);
    };
    SmartBuffer.prototype.toBase64String = function () {
        return bufcode_1.bufcode.base64.to(this._bytes);
    };
    SmartBuffer.prototype.toWordsArray = function () {
        return bufcode_1.bufcode.words.to(this._bytes);
    };
    SmartBuffer.prototype.toUTF8String = function () {
        return bufcode_1.bufcode.utf8.to(this._bytes);
    };
    SmartBuffer.prototype.writeUint8 = function (val) {
        this._bytes[this._offset++] = val & 0xff;
    };
    SmartBuffer.prototype.writeUint16 = function (val) {
        this._bytes[this._offset++] = (val >>> 8) & 0xff;
        this._bytes[this._offset++] = val & 0xff;
    };
    SmartBuffer.prototype.writeUint32 = function (val) {
        this._bytes[this._offset++] = (val >>> 24) & 0xff;
        this._bytes[this._offset++] = (val >>> 16) & 0xff;
        this._bytes[this._offset++] = (val >>> 8) & 0xff;
        this._bytes[this._offset++] = val & 0xff;
    };
    SmartBuffer.prototype.writeBytes = function (val) {
        this._bytes.set(val, this._offset);
        this._offset += val.length;
    };
    SmartBuffer.prototype.writeBuffer = function (val) {
        this._bytes.set(val.bytes, this._offset);
        this._offset += val.bytes.length;
    };
    SmartBuffer.prototype.writeBytes8Length = function (val) {
        this.writeUint8(val.length);
        this.writeBytes(val);
    };
    SmartBuffer.prototype.writeBuffer8Length = function (val) {
        this.writeUint8(val.bytes.length);
        this.writeBuffer(val);
    };
    SmartBuffer.prototype.writeBytes16Length = function (val) {
        this.writeUint16(val.length);
        this.writeBytes(val);
    };
    SmartBuffer.prototype.writeBuffer16Length = function (val) {
        this.writeUint16(val.bytes.length);
        this.writeBuffer(val);
    };
    SmartBuffer.prototype.writeBytes32Length = function (val) {
        this.writeUint32(val.length);
        this.writeBytes(val);
    };
    SmartBuffer.prototype.writeBuffer32Length = function (val) {
        this.writeUint32(val.bytes.length);
        this.writeBuffer(val);
    };
    SmartBuffer.prototype.readUint8 = function () {
        return this._bytes[this._offset++] & 0xff;
    };
    SmartBuffer.prototype.readUint16 = function () {
        return ((this._bytes[this._offset++] & 0xff) << 8) + (this._bytes[this._offset++] & 0xff);
    };
    SmartBuffer.prototype.readUint32 = function () {
        return ((((this._bytes[this._offset++] & 0xff) << 24) >>> 0) +
            ((this._bytes[this._offset++] & 0xff) << 16) +
            ((this._bytes[this._offset++] & 0xff) << 8) +
            (this._bytes[this._offset++] & 0xff));
    };
    SmartBuffer.prototype.readBytes = function (length) {
        return this._bytes.slice(this._offset, (this._offset += length));
    };
    SmartBuffer.prototype.readBuffer = function (length) {
        return new SmartBuffer(this._bytes.slice(this._offset, (this._offset += length)));
    };
    SmartBuffer.prototype.readBytes8Length = function () {
        return this.readBytes(this.readUint8());
    };
    SmartBuffer.prototype.readBuffer8Length = function () {
        return this.readBuffer(this.readUint8());
    };
    SmartBuffer.prototype.readString8Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes32Length());
    };
    SmartBuffer.prototype.readBytes16Length = function () {
        return this.readBytes(this.readUint16());
    };
    SmartBuffer.prototype.readBuffer16Length = function () {
        return this.readBuffer(this.readUint16());
    };
    SmartBuffer.prototype.readString16Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes32Length());
    };
    SmartBuffer.prototype.readBytes32Length = function () {
        return this.readBytes(this.readUint32());
    };
    SmartBuffer.prototype.readBuffer32Length = function () {
        return this.readBuffer(this.readUint32());
    };
    SmartBuffer.prototype.readString32Length = function () {
        return bufcode_1.bufcode.utf8.to(this.readBytes32Length());
    };
    Object.defineProperty(SmartBuffer.prototype, "bytes", {
        get: function () {
            return this._bytes;
        },
        enumerable: false,
        configurable: true
    });
    return SmartBuffer;
}());
exports.SmartBuffer = SmartBuffer;
//# sourceMappingURL=SmartBuffer.js.map