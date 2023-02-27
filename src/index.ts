import { bufcode } from './bufcode';

export { bufcode };

export default class SmartBuffer {
	private _offset = 0;

	constructor(private readonly _bytes: Uint8Array) {}

	seek(newOffset: number) {
		this._offset = newOffset;
	}

	get offset() {
		return this._offset;
	}

	static ofSize(size: number) {
		return new SmartBuffer(new Uint8Array(size));
	}

	static ofBinaryString(str: string) {
		return new SmartBuffer(bufcode.binary.from(str));
	}

	static ofBase64String(str: string) {
		return new SmartBuffer(bufcode.base64.from(str));
	}

	static ofHexString(str: string) {
		return new SmartBuffer(bufcode.hex.from(str));
	}

	static ofWords(words: number[]) {
		return new SmartBuffer(bufcode.words.from(words));
	}

	static ofUTF8String(str: string) {
		return new SmartBuffer(bufcode.utf8.from(str));
	}

	toHexString() {
		return bufcode.hex.to(this._bytes);
	}

	toBinaryString() {
		return bufcode.binary.to(this._bytes);
	}

	toBase64String() {
		return bufcode.base64.to(this._bytes);
	}

	toWordsArray() {
		return bufcode.words.to(this._bytes);
	}

	toUTF8String() {
		return bufcode.utf8.to(this._bytes);
	}

	writeUint8(val: number) {
		this._bytes[this._offset++] = val & 0xff;
	}

	writeUint16(val: number) {
		this._bytes[this._offset++] = (val >>> 8) & 0xff;
		this._bytes[this._offset++] = val & 0xff;
	}

	writeUint32(val: number) {
		this._bytes[this._offset++] = (val >>> 24) & 0xff;
		this._bytes[this._offset++] = (val >>> 16) & 0xff;
		this._bytes[this._offset++] = (val >>> 8) & 0xff;
		this._bytes[this._offset++] = val & 0xff;
	}

	writeBytes(val: Uint8Array) {
		this._bytes.set(val, this._offset);
		this._offset += val.length;
	}

	writeBuffer(val: SmartBuffer) {
		this._bytes.set(val.bytes, this._offset);
		this._offset += val.bytes.length;
	}

	writeBytes8Length(val: Uint8Array) {
		this.writeUint8(val.length);
		this.writeBytes(val);
	}

	writeBuffer8Length(val: SmartBuffer) {
		this.writeUint8(val.bytes.length);
		this.writeBuffer(val);
	}

	writeBytes16Length(val: Uint8Array) {
		this.writeUint16(val.length);
		this.writeBytes(val);
	}

	writeBuffer16Length(val: SmartBuffer) {
		this.writeUint16(val.bytes.length);
		this.writeBuffer(val);
	}

	writeBytes32Length(val: Uint8Array) {
		this.writeUint32(val.length);
		this.writeBytes(val);
	}

	writeBuffer32Length(val: SmartBuffer) {
		this.writeUint32(val.bytes.length);
		this.writeBuffer(val);
	}

	readUint8() {
		return this._bytes[this._offset++] & 0xff;
	}

	readUint16() {
		return ((this._bytes[this._offset++] & 0xff) << 8) + (this._bytes[this._offset++] & 0xff);
	}

	readUint32() {
		return (
			(((this._bytes[this._offset++] & 0xff) << 24) >>> 0) +
			((this._bytes[this._offset++] & 0xff) << 16) +
			((this._bytes[this._offset++] & 0xff) << 8) +
			(this._bytes[this._offset++] & 0xff)
		);
	}

	readBytes(length: number) {
		return this._bytes.slice(this._offset, (this._offset += length));
	}

	readBuffer(length: number) {
		return new SmartBuffer(this._bytes.slice(this._offset, (this._offset += length)));
	}

	readBytes8Length() {
		return this.readBytes(this.readUint8());
	}

	readBuffer8Length() {
		return this.readBuffer(this.readUint8());
	}

	readBytes16Length() {
		return this.readBytes(this.readUint16());
	}

	readBuffer16Length() {
		return this.readBuffer(this.readUint16());
	}

	readBytes32Length() {
		return this.readBytes(this.readUint32());
	}

	readBuffer32Length() {
		return this.readBuffer(this.readUint32());
	}

	get bytes() {
		return this._bytes;
	}
}
