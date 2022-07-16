declare const utils: {
    hex: {
        to: (arr: Uint8Array) => string;
        from: (hex: string) => Uint8Array;
    };
    binary: {
        to: (arr: Uint8Array) => string;
        from: (bStr: string) => Uint8Array;
    };
    base64: {
        to: (arr: Uint8Array) => string;
        from: (str: string) => Uint8Array;
    };
    words: {
        to: (arr: Uint8Array) => number[];
        from: (words: number[]) => Uint8Array;
    };
    utf8: {
        to: (arr: Uint8Array) => string;
        from: (str: string) => Uint8Array;
    };
};
export default utils;
