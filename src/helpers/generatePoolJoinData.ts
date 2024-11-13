import {TokenData} from "./generatePoolCreateData";
import {constants, Contract, utils} from "ethers";
import {contracts} from "./contracts";
import abi from '../abis/vault.json';

enum PoolJoinKind {
    INIT = 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT = 2,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT = 3,
    ADD_TOKEN = 4,
}

const generatePoolJoinData = async (signer: any, poolId: string, tokensForPool: TokenData[]) => {
    const joinKind: PoolJoinKind = PoolJoinKind.INIT;

    const tokens = tokensForPool.map(item => item.address);
    const amountsIn = tokensForPool.map(item => utils.parseUnits(String(item.amount), item.decimals).toString());


    const {assets, maxAmountsIn, nativeTokenValue} = await get({
        signer,
        poolId,
        assets: tokens,
        maxAmountsIn: amountsIn
    });

    return {
        joinKind, maxAmountsIn, assets, nativeTokenValue
    }
}

const get = async ({signer, poolId, maxAmountsIn, assets}: any) => {
    const scAssets = await getScAssets(signer, poolId);
    const nativeTokenValue = getNative(assets, maxAmountsIn);

    const generatedAssets = getAssets(scAssets, Boolean(nativeTokenValue));
    const generatedMaxAmountsIn = getMaxAmountsIn(assets, maxAmountsIn, generatedAssets);

    return {
        assets: generatedAssets,
        maxAmountsIn: generatedMaxAmountsIn,
        nativeTokenValue,
    };
};

// Reorder maxAmountsIn if an array of tokens from Smart Contract is ordered in different direction
const getMaxAmountsIn = (assets: string[], maxAmountsIn: string[], generatedAssets: string[]) => {
    return generatedAssets.map((itemAsset: string) => {
        const generatedAssetIndex = assets.findIndex(
            (itemOriginalAsset: string) => itemOriginalAsset === itemAsset
        );

        return maxAmountsIn[generatedAssetIndex];
    });
};

// If asset from Smart Contract contains WSEI replace it with native token/ETH/0x0000000000000000000000000000000000000000
const getAssets = (assets: string[], isNativeTokenSent: boolean) => {
    return assets.map((item: string) => {
        if (isNativeTokenSent && item === utils.getAddress(contracts.wSei)) return constants.AddressZero;

        return item;
    });
};

// Fetch pool tokens in right order from Smart Contract
const getScAssets = async (signer: any, poolId: string) => {
    const vaultContract = new Contract(contracts.vault, abi, signer);

    const assets = await vaultContract.getPoolTokens(poolId);

    return assets[0];
};

// If an array contains native token/ETH/0x0000000000000000000000000000000000000000 return value of it.
const getNative = (assets: Array<string>, maxAmountsIn: Array<string>) => {
    const nativeTokenIndex = assets.findIndex((token) => token === constants.AddressZero);

    return nativeTokenIndex !== -1 ? {value: maxAmountsIn[nativeTokenIndex]} : false;
};


export default generatePoolJoinData;