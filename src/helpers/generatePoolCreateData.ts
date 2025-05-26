import {generatePoolSymbol, generateSalt} from "./pool";
import {utils, constants} from "ethers";
import map from "lodash.map";
import sortBy from "lodash.sortby";
import {contracts} from "./contracts";
import {PoolCreateContract, TokenData} from "./types";

const prepareTokenData = (tokenData: TokenData[]) => {
    const data: Array<any> = tokenData.map((item) => {
        const tokenAddress = item.address === constants.AddressZero ? contracts.wSei : item.address;

        return {
            token: tokenAddress,
            tokenAsNumeric: BigInt(tokenAddress),
            normalizedWeight: utils.parseUnits(String(item.weight), 16).toString(),
            rateProvider: constants.AddressZero,
            maxAmountIn: utils.parseUnits(String(item.amount), item.decimals).toString(),
        };
    });

    return sortBy(data, "tokenAsNumeric");
}

const generatePoolCreateData = (tokensForPool: TokenData[], fee: number): PoolCreateContract => {
    const data = prepareTokenData(tokensForPool);

    const tokens = map(data, "token");
    const normalizedWeights = map(data, "normalizedWeight");
    const maxAmountsIn = map(data, "maxAmountIn");
    const rateProviders = map(data, "rateProvider");

    const salt = generateSalt();
    const swapFeePercentage = utils.parseUnits(String(fee), 16).toString();

    const poolSymbol = generatePoolSymbol(tokensForPool.map(item => {
        return {
            symbol: item.symbol,
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

export default generatePoolCreateData;