export const bufcode = {
	hex: {
		to: (arr: Uint8Array) => {
			const res = new Array(arr.length);
			for (let i = 0; i < arr.length; i++) {
				res[i] = arr[i].toString(16).padStart(2, '0');
			}
			return res.join('');
		},
		from: (hex: string) => {
			const uint8 = new Uint8Array(Math.floor(hex.length / 2));
			for (let i = 0; i < uint8.length; i++) {
				uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
			}
			return uint8;
		},
	},
	binary: {
		to: (arr: Uint8Array) => {
			// @ts-ignore
			return String.fromCharCode.apply(null, arr);
		},
		from: (bStr: string) => {
			const result = new Uint8Array(bStr.length);
			for (let i = 0; i < bStr.length; i++) {
				result[i] = bStr.charCodeAt(i);
			}
			return result;
		},
	},
	base64: {
		to: (arr: Uint8Array) => {
			return btoa(bufcode.binary.to(arr));
		},
		from: (str: string) => {
			return bufcode.binary.from(atob(str));
		},
	},
	words: {
		to: (arr: Uint8Array) => {
			const words = [];
			let i = 0;
			while (i < arr.length) {
				words.push((arr[i++] << 24) | (arr[i++] << 16) | (arr[i++] << 8) | arr[i++]);
			}
			return words;
		},
		from: (words: number[]) => {
			const result = new Uint8Array(words.length << 2);
			let offset = 0;
			for (const word of words) {
				result[offset++] = (word >> 24) & 0xff;
				result[offset++] = (word >> 16) & 0xff;
				result[offset++] = (word >> 8) & 0xff;
				result[offset++] = word & 0xff;
			}
			return result;
		},
	},
	utf8: {
		to: (arr: Uint8Array) => {
			return new TextDecoder().decode(arr);
		},
		from: (str: string) => {
			return new TextEncoder().encode(str);
		},
	},
};
