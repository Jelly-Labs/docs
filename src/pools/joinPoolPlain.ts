import {Contract} from "ethers";

import abi from "../abis/vault.json";
import {contracts} from "../helpers/contracts";
import {JoinPoolParams} from "../helpers/types";

const joinPoolPlain = async ({
                                 signer,
                                 userAddress,
                                 poolId,
                                 assets,
                                 maxAmountsIn,
                                 userData,
                                 nativeTokenValue,
                                 fromInternalBalance = false,
                             }: JoinPoolParams): Promise<string> => {
    const vaultContract = new Contract(contracts.vault, abi, signer);

    let joinPool;
    const joinData = {
        assets,
        maxAmountsIn,
        userData,
        fromInternalBalance,
    };

    if (nativeTokenValue) {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData, nativeTokenValue);
    } else {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData);
    }

    await joinPool?.wait();

    return joinPool.hash;
}

export default joinPoolPlain;