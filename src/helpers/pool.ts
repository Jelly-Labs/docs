import generateRandomAsciiCharacters from "./utils";
import {encodeBytes32String} from "./ethers-v6";

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

export {
    generatePoolSymbol,
    generateSalt,
}