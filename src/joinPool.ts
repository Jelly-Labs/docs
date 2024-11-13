import {Contract, ethers} from "ethers";
import abi from "./abis/vault.json";
import {contracts} from "./helpers/contracts";
import {TokenData} from "./helpers/generatePoolCreateData";
import generatePoolJoinData from "./helpers/generatePoolJoinData";

const joinPool = async (signer: any, poolId: string, userAddress: `0x${string}` | string, tokensForPool: TokenData[]): Promise<string> => {
    const vaultContract = new Contract(contracts.vault, abi, signer);

    const {
        joinKind,
        maxAmountsIn,
        assets,
        nativeTokenValue
    } = await generatePoolJoinData(signer, poolId, tokensForPool);

    let joinPool;

    const joinData = {
        assets,
        maxAmountsIn,
        userData: ethers.utils.defaultAbiCoder.encode(["uint8", "uint256[]"], [joinKind, maxAmountsIn]),
        fromInternalBalance: false,
    };

    if (nativeTokenValue) {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData, nativeTokenValue);
    } else {
        joinPool = await vaultContract.joinPool(poolId, userAddress, userAddress, joinData);
    }

    await joinPool?.wait();

    return joinPool.hash;
}

export default joinPool;