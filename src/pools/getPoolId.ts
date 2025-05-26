import {Contract, Wallet} from "ethers";

import abi from "../abis/weightedPool.json";

const getPoolId = async (signer: Wallet, poolAddress: string): Promise<string> => {
    const poolContract = new Contract(poolAddress, abi, signer);

    return await poolContract.getPoolId();
}

export default getPoolId;