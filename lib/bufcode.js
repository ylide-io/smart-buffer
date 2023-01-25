"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufcode = void 0;
exports.bufcode = {
    hex: {
        to: function (arr) {
            var res = new Array(arr.length);
            for (var i = 0; i < arr.length; i++) {
                res[i] = arr[i].toString(16).padStart(2, '0');
            }
            return res.join('');
        },
        from: function (hex) {
            var uint8 = new Uint8Array(Math.floor(hex.length / 2));
            for (var i = 0; i < uint8.length; i++) {
                uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
            }
            return uint8;
        },
    },
    binary: {
        to: function (arr) {
            // @ts-ignore
            return String.fromCharCode.apply(null, arr);
        },
        from: function (bStr) {
            var result = new Uint8Array(bStr.length);
            for (var i = 0; i < bStr.length; i++) {
                result[i] = bStr.charCodeAt(i);
            }
            return result;
        },
    },
    base64: {
        to: function (arr) {
            return btoa(exports.bufcode.binary.to(arr));
        },
        from: function (str) {
            return exports.bufcode.binary.from(atob(str));
        },
    },
    base64url: {
        to: function (arr) {
            return exports.bufcode.base64.to(arr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        },
        from: function (str) {
            return exports.bufcode.base64.from(str.replace(/-/g, '+').replace(/_/g, '/'));
        },
    },
    words: {
        to: function (arr) {
            var words = [];
            var i = 0;
            while (i < arr.length) {
                words.push((arr[i++] << 24) | (arr[i++] << 16) | (arr[i++] << 8) | arr[i++]);
            }
            return words;
        },
        from: function (words) {
            var result = new Uint8Array(words.length << 2);
            var offset = 0;
            for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                var word = words_1[_i];
                result[offset++] = (word >> 24) & 0xff;
                result[offset++] = (word >> 16) & 0xff;
                result[offset++] = (word >> 8) & 0xff;
                result[offset++] = word & 0xff;
            }
            return result;
        },
    },
    utf8: {
        to: function (arr) {
            return new TextDecoder().decode(arr);
        },
        from: function (str) {
            return new TextEncoder().encode(str);
        },
    },
};
//# sourceMappingURL=bufcode.js.map