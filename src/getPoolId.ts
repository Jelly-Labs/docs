import abi from "./abis/weightedPoolFactory.json";
import {ethers} from "ethers";

const getPoolId = async (signer: any, poolAddress: string): Promise<string> => {
    const poolContract = new ethers.Contract(poolAddress, abi, signer);

    return await poolContract.getPoolId();
}

export default getPoolId;