import {ethers} from "ethers";
import {encodeBytes32String} from "./ethers-v6";
import {generateRandomAsciiCharacters, normalizeAddress} from "./utils";

const generatePoolSymbol = (tokens: Array<{ symbol: string; value: number }>, prefix: string = "") => {
    const createPoolName = tokens
        .map((item) => `${item.symbol}/${item.value}`)
        .join("-")
        .toString();
    return `${prefix}${createPoolName}`;
};


const generateSalt = () => {
    return encodeBytes32String(generateRandomAsciiCharacters(31));
}

const replaceAddressWithZero = (addressArray: string[], addressToReplace: string): string[] => {
    const normalizedAddressArray = addressArray.map((address) => normalizeAddress(address));
    const index = normalizedAddressArray.indexOf(addressToReplace);
    if (index !== -1) {
        addressArray[index] = ethers.constants.AddressZero;
    }
    return addressArray;
};

export {
    generatePoolSymbol,
    generateSalt,
    replaceAddressWithZero
}