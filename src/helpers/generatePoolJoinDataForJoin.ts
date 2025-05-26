import {Decimal} from "decimal.js";
import {defaultAbiCoder} from "ethers/lib/utils";
import {getAllAssets} from "./generatePoolJoinData";
import {BigNumber, ethers, Wallet} from "ethers";
import {PoolApi, PoolCategory, PoolJoinKind, TokenData} from "./types";
import {ethToWei, sameAddress} from "./utils";
import {contracts} from "./contracts";

const getPoolToken = (poolTokens: any[], token: TokenData) => {
    let searchedTokenAddress = token.address;
    if (sameAddress(token.address, ethers.constants.AddressZero)) {
        searchedTokenAddress = contracts.wSei;
    }

    return poolTokens.find((poolToken) => sameAddress(poolToken.address, searchedTokenAddress));
};

const buildJoinData = async ({
                                 signer,
                                 pool,
                                 slippage,
                                 tokensForPool,
                                 actualSupply,
                             }: {
    signer: Wallet,
    pool: PoolApi,
    slippage: number,
    actualSupply: number | string,
    tokensForPool: TokenData[]
}) => {
    const {tokens: poolTokens, poolId, poolCategory} = pool;

    const sortedTokens = tokensForPool.sort((a, b) => a.address.localeCompare(b.address));

    const {
        assets, maxAmountsIn: formattedMaxAmountsIn,
        nativeTokenValue
    } = await getAllAssets({
        signer,
        poolId: pool.poolId,
        assets: sortedTokens.map((item: any) => item.address),
        maxAmountsIn: sortedTokens.map((item: any) => ethToWei(item.amount || "0", item.decimals)),
    });

    let userData = "";
    let maxAmountsIn: string[] | BigNumber[] = formattedMaxAmountsIn.map((item) => (item === undefined ? "0" : item));

    if (poolCategory === PoolCategory.WEIGHTED) {
        userData = defaultAbiCoder.encode(
            ["uint8", "uint256[]"],
            [PoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, maxAmountsIn]
        );
    } else if (poolCategory === PoolCategory.STABLE) {
        userData = defaultAbiCoder.encode(
            ["uint8", "uint256[]", "uint256"],
            [PoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, formattedMaxAmountsIn.filter((item) => item !== undefined), 1]
        );
    } else if (poolCategory === PoolCategory.GYRO) {
        const totalSupply = actualSupply;

        const bptMin = Math.min(
            ...sortedTokens.map((token) => {
                const poolToken = getPoolToken(poolTokens, token);

                return new Decimal(token.amount).mul(new Decimal(totalSupply).div(String(poolToken?.balance))).toNumber();
            })
        );

        const bptOut = bptMin * (1 - slippage / 100);

        maxAmountsIn = sortedTokens.map((token) => {
            return ethers.utils.parseUnits(ethToWei(token.amount, token.decimals))
        });

        userData = defaultAbiCoder.encode(
            ["uint8", "uint256"],
            [PoolJoinKind.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT, ethers.utils.parseEther(bptOut.toString())]
        );
    }

    return {
        poolId,
        assets,
        maxAmountsIn,
        userData,
        nativeTokenValue,
    };
};

export {
    buildJoinData
}