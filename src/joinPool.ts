import {AbiCoder, ethers} from "ethers";
import abi from "./abis/vault.json";

enum PoolJoinKind {
    INIT = 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT = 2,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT = 3,
    ADD_TOKEN = 4,
}

const getNative = (assets: string[], maxAmountsIn: string[]): false | { value: string } => {
    const nativeTokenIndex = assets.findIndex((token) => token === ethers.ZeroAddress);

    return nativeTokenIndex !== -1 ? {value: maxAmountsIn[nativeTokenIndex]} : false;
};

const joinPool = async (signer: any, poolId: string, userAddress: `0x${string}`, assets: string[], maxAmountsIn: string[], joinKind: PoolJoinKind = PoolJoinKind.INIT): Promise<string> => {
    const vaultContractAddress = "0xFB43069f6d0473B85686a85F4Ce4Fc1FD8F00875";

    const vaultContract = new ethers.Contract(vaultContractAddress, abi, signer);

    let joinPool;

    const joinData = {
        assets,
        maxAmountsIn,
        userData: AbiCoder.defaultAbiCoder().encode(["uint8", "uint256[]"], [joinKind, maxAmountsIn]),
        fromInternalBalance: false,
    };

    const nativeTokenValue = getNative(assets, maxAmountsIn);

    if (nativeTokenValue) {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData, nativeTokenValue);
    } else {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData);
    }

    await joinPool?.wait();

    return joinPool.hash;
}

export default joinPool;