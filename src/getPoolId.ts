import {ethers} from "ethers";
import abi from "./abis/weightedPoolFactory.json";

const getPoolId = async (signer: any, poolAddress: string): Promise<string> => {
    const poolContract = new ethers.Contract(poolAddress, abi, signer);

    return await poolContract.getPoolId();
}

export default getPoolId;