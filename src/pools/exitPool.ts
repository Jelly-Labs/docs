import {Contract, ethers} from "ethers";
import {Decimal} from "decimal.js";

import abi from "../abis/vault.json";
import {sameAddress} from "../helpers/utils";
import {contracts} from "../helpers/contracts";
import {replaceAddressWithZero} from "../helpers/pool";
import {getAllAssets} from "../helpers/generatePoolJoinData";
import {ComposablePoolExitKind, PoolExitKind, PoolExitParams, PoolTokenApi} from "../helpers/types";

const exitPool = async ({
                            signer,
                            pool,
                            userAddress,
                            slippage,
                            balance: exitBalance,
                        }: PoolExitParams): Promise<any> => {

    const {poolType, poolId, tokens: poolTokens, totalShares: totalLpTokens} = pool;
    const toInternalBalance = false;
    const vaultContract = new Contract(contracts.vault, abi, signer);
    const poolKind = getPoolKind(poolType);

    const {assets} = await getAllAssets({
        signer,
        poolId: pool.poolId,
        assets: poolTokens.map((item) => item.address),
        maxAmountsIn: poolTokens.map((item) => item.balance),
    });

    const userData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256"],
        [poolKind, ethers.utils.parseUnits(exitBalance.toString(), 18)]
    );

    const minAmountsOut = calculateMinAmountsOut({
        assets, slippage, totalLpTokens, balance: exitBalance, tokens: poolTokens,
    });

    const exitTx = await vaultContract.exitPool(poolId, userAddress, userAddress, {
        assets: replaceAddressWithZero(assets, contracts.wSei),
        minAmountsOut,
        userData,
        toInternalBalance,
    });

    return await exitTx.wait();
}

const calculateMinAmountsOut = ({assets, slippage, balance, tokens, totalLpTokens}: {
    assets: string[],
    slippage: number,
    balance: number,
    totalLpTokens: number
    tokens: PoolTokenApi[]
}) => {
    return assets.map((assetAddress) => {
        const token = tokens.find((token) => sameAddress(token.address, assetAddress));
        if (token) {
            const amountOut = new Decimal(token.balance).mul(new Decimal(balance).dividedBy(totalLpTokens));
            const parseValue = amountOut.mul(new Decimal(1).minus(new Decimal(slippage).div(100))).toFixed(token.decimals);

            return ethers.utils.parseUnits(parseValue.toString(), token.decimals).toString();
        }
        return "0";
    });
};

const getPoolKind = (poolType: string) => {
    return poolType === "ComposableStable"
        ? ComposablePoolExitKind.EXACT_BPT_IN_FOR_ALL_TOKENS_OUT
        : PoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT;
}

export default exitPool;