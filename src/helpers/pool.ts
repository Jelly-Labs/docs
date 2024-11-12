import {encodeBytes32String} from "ethers";
import generateRandomAsciiCharacters from "./utils";

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