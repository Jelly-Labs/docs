import {Buffer} from "buffer";
import {ethers, utils} from "ethers";

const getRandomBytes = (n: number) => {
    const QUOTA = 65536;

    const a = new Uint8Array(n);
    for (let i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, QUOTA)));
    }
    return a as Buffer;
};

/**
 Generates a random ASCII string with the given length
 We only use ASCII to enforce that all the strings have 1 byte size so that the resulting string will have exactly length bytes size

 Based on https://github.com/sindresorhus/crypto-random-string
 **/
const generateRandomAsciiCharacters = (length: number) => {
    const asciiPrintableCharacters = [
        ..."!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    ];
    // Generating entropy is faster than complex math operations, so we use the simplest way
    const characterCount = asciiPrintableCharacters.length;
    const maxValidSelector = Math.floor(0x1_00_00 / characterCount) * characterCount - 1; // Using values above this will ruin distribution when using modular division
    const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
    let string = "";
    let stringLength = 0;

    while (stringLength < length) {
        // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
        const entropy = getRandomBytes(entropyLength);

        let entropyPosition = 0;

        const readUInt16LE = (uInt8Array: Buffer, offset: number) => uInt8Array[offset] + (uInt8Array[offset + 1] << 8);

        while (entropyPosition < entropyLength && stringLength < length) {
            const entropyValue = entropy ? readUInt16LE(entropy, entropyPosition) : 1;
            entropyPosition += 2;
            if (entropyValue > maxValidSelector) {
                // Skip values which will ruin distribution when using modular division
                continue;
            }

            string += asciiPrintableCharacters[entropyValue % characterCount];
            stringLength++;
        }
    }

    return string;
};

const normalizeAddress = (address: string): string => {
    if (!address || address === "") return "";

    return utils.getAddress(address);
};

const sameAddress = (address1: string, address2: string): boolean => {
    return normalizeAddress(address1) === normalizeAddress(address2);
};

const roundCryptoString = (crypto: string, decimalPlaces = 18) => {
    const [integerPart, fractionPart] = crypto.split(".");
    if (!fractionPart) return integerPart;
    const fraction = fractionPart.slice(0, decimalPlaces);
    return `${integerPart}.${fraction}`;
};

const ethToWei = (amount: string, decimals: number): string => {
    if (amount === "") throw new Error("Invalid eth value");

    return ethers.utils.parseUnits(roundCryptoString(amount, decimals), decimals).toString();
};

export {
    generateRandomAsciiCharacters,
    sameAddress,
    normalizeAddress,
    ethToWei
};
