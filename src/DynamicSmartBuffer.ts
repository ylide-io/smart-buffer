import { SmartBuffer } from './SmartBuffer';
import { bufcode } from './bufcode';

export class DynamicSmartBuffer {
	private _offset = 0;
	private _size: number;
	private _buffer: Uint8Array;

	constructor(_bytes?: Uint8Array) {
		if (_bytes) {
			this._buffer = new Uint8Array(_bytes);
			this._size = _bytes.length;
		} else {
			this._buffer = new Uint8Array(128);
			this._size = 0;
		}
	}

	seek(newOffset: number) {
		this._offset = newOffset;
	}

	compact() {
		this._buffer = this._buffer.slice(0, this._size);
	}

	get size() {
		return this._size;
	}

	get offset() {
		return this._offset;
	}

	static ofBinaryString(str: string) {
		return new DynamicSmartBuffer(bufcode.binary.from(str));
	}

	static ofBase64String(str: string) {
		return new DynamicSmartBuffer(bufcode.base64.from(str));
	}

	static ofHexString(str: string) {
		return new DynamicSmartBuffer(bufcode.hex.from(str));
	}

	static ofWords(words: number[]) {
		return new DynamicSmartBuffer(bufcode.words.from(words));
	}

	static ofUTF8String(str: string) {
		return new DynamicSmartBuffer(bufcode.utf8.from(str));
	}

	toHexString() {
		return bufcode.hex.to(this.bytes);
	}

	toBinaryString() {
		return bufcode.binary.to(this.bytes);
	}

	toBase64String() {
		return bufcode.base64.to(this.bytes);
	}

	toWordsArray() {
		return bufcode.words.to(this.bytes);
	}

	toUTF8String() {
		return bufcode.utf8.to(this.bytes);
	}

	private willWrite(size: number) {
		if (this._offset + size > this._buffer.length) {
			const newBuffer = new Uint8Array(this._buffer.length * 2);
			newBuffer.set(this._buffer);
			this._buffer = newBuffer;
		}
	}

	writeUint8(val: number) {
		this.willWrite(1);
		this._buffer[this._offset++] = val & 0xff;
	}

	writeUint16(val: number) {
		this.willWrite(2);
		this._buffer[this._offset++] = (val >>> 8) & 0xff;
		this._buffer[this._offset++] = val & 0xff;
	}

	writeUint32(val: number) {
		this.willWrite(4);
		this._buffer[this._offset++] = (val >>> 24) & 0xff;
		this._buffer[this._offset++] = (val >>> 16) & 0xff;
		this._buffer[this._offset++] = (val >>> 8) & 0xff;
		this._buffer[this._offset++] = val & 0xff;
	}

	writeBytes(val: Uint8Array) {
		this.willWrite(val.length);
		this._buffer.set(val, this._offset);
		this._offset += val.length;
	}

	writeBuffer(val: SmartBuffer | DynamicSmartBuffer) {
		this.willWrite(val.size);
		this._buffer.set(val.bytes, this._offset);
		this._offset += val.bytes.length;
	}

	writeBytes8Length(val: Uint8Array) {
		if (val.length > 255) throw new Error('Length for 8-bit length bytes must be less than 256');
		this.willWrite(1 + val.length);
		this.writeUint8(val.length);
		this.writeBytes(val);
	}

	writeBuffer8Length(val: SmartBuffer | DynamicSmartBuffer) {
		if (val.size > 255) throw new Error('Length for 8-bit length bytes must be less than 256');
		this.willWrite(1 + val.size);
		this.writeUint8(val.bytes.length);
		this.writeBuffer(val);
	}

	writeBytes16Length(val: Uint8Array) {
		if (val.length > 65535) throw new Error('Length for 16-bit length bytes must be less than 65536');
		this.willWrite(2 + val.length);
		this.writeUint16(val.length);
		this.writeBytes(val);
	}

	writeBuffer16Length(val: SmartBuffer | DynamicSmartBuffer) {
		if (val.size > 65535) throw new Error('Length for 16-bit length bytes must be less than 65536');
		this.willWrite(2 + val.size);
		this.writeUint16(val.bytes.length);
		this.writeBuffer(val);
	}

	writeBytes32Length(val: Uint8Array) {
		if (val.length > 4294967295) throw new Error('Length for 32-bit length bytes must be less than 4294967296');
		this.willWrite(4 + val.length);
		this.writeUint32(val.length);
		this.writeBytes(val);
	}

	writeBuffer32Length(val: SmartBuffer | DynamicSmartBuffer) {
		if (val.size > 4294967295) throw new Error('Length for 32-bit length bytes must be less than 4294967296');
		this.willWrite(4 + val.size);
		this.writeUint32(val.bytes.length);
		this.writeBuffer(val);
	}

	readUint8() {
		return this._buffer[this._offset++] & 0xff;
	}

	readUint16() {
		return ((this._buffer[this._offset++] & 0xff) << 8) + (this._buffer[this._offset++] & 0xff);
	}

	readUint32() {
		return (
			(((this._buffer[this._offset++] & 0xff) << 24) >>> 0) +
			((this._buffer[this._offset++] & 0xff) << 16) +
			((this._buffer[this._offset++] & 0xff) << 8) +
			(this._buffer[this._offset++] & 0xff)
		);
	}

	readBytes(length: number) {
		return this._buffer.slice(this._offset, (this._offset += length));
	}

	readBuffer(length: number) {
		return new SmartBuffer(this._buffer.slice(this._offset, (this._offset += length)));
	}

	readDynamicBuffer(length: number) {
		return new DynamicSmartBuffer(this._buffer.slice(this._offset, (this._offset += length)));
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
		return this._buffer.slice(0, this._size);
	}
}
