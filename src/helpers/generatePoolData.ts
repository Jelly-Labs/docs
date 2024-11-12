import {generatePoolSymbol, generateSalt} from "./pool";
import {parseUnits, ZeroAddress} from "ethers";
import map from "lodash.map";
import sortBy from "lodash.sortby";

type PoolCreateContract = {
    poolSymbol: string;
    tokens: string[];
    normalizedWeights: string[];
    maxAmountsIn: string[];
    rateProviders: string[];
    swapFeePercentage: string;
    salt: string;
};

export type TokenData = {
    tokenSymbol: string;
    address: `0x${string}` | string;
    amount: number;
    weight: number;
    decimals: number;
}

const prepareTokenData = (tokenData: TokenData[], wrappedTokenAddress: `0x${string}` | string) => {
    const data: Array<any> = tokenData.map((item) => {
        const tokenAddress = item.address === ZeroAddress ? wrappedTokenAddress : item.address;

        return {
            token: tokenAddress,
            tokenAsNumeric: BigInt(tokenAddress),
            normalizedWeight: parseUnits(String(item.weight), 16).toString(),
            rateProvider: ZeroAddress,
            maxAmountIn: parseUnits(String(item.amount), item.decimals).toString(),
        };
    });

    return sortBy(data, "tokenAsNumeric");
}

const generatePoolData = (tokensForPool: TokenData[], fee: number): PoolCreateContract => {
    const wrappedTokenAddress = process.env.WRAPPED_NATIVE_ADDRESS as string;

    const data = prepareTokenData(tokensForPool, wrappedTokenAddress);

    const tokens = map(data, "token");
    const normalizedWeights = map(data, "normalizedWeight");
    const maxAmountsIn = map(data, "maxAmountIn");
    const rateProviders = map(data, "rateProvider");

    const salt = generateSalt();
    const swapFeePercentage = parseUnits(String(fee), 16).toString();

    const poolSymbol = generatePoolSymbol(tokensForPool.map(item => {
        return {
            symbol: item.tokenSymbol,
            value: item.weight
        }
    }));

    return {
        poolSymbol,
        tokens,
        normalizedWeights,
        rateProviders,
        swapFeePercentage,
        salt,
        maxAmountsIn
    }
}

export default generatePoolData;