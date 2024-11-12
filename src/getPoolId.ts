import {Contract} from "ethers";
import abi from "./abis/weightedPool.json";

const getPoolId = async (signer: any, poolAddress: string): Promise<string> => {
    const poolContract = new Contract(poolAddress, abi, signer);

    return await poolContract.getPoolId();
}

export default getPoolId;