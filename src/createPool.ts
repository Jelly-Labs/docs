import {ethers} from "ethers";
import abi from "./abis/weightedPoolFactory.json";

const createPool = async (signer: any, name: string, symbol: string, tokens: string[], normalizedWeights: string[], rateProviders: `0x${string}`, swapFeePercentage: string, owner: `0x${string}`, salt: string): Promise<string> => {
    const weightedPoolFactoryContract = "0xCe733ca21882D1407386aF13c59F59e02B1Db5A9";

    const poolContract = new ethers.Contract(
        weightedPoolFactoryContract,
        abi,
        signer
    );

    const createTx = await poolContract.create(
        name,
        symbol,
        tokens,
        normalizedWeights,
        rateProviders,
        swapFeePercentage,
        owner,
        salt
    );

    const createdWait = await createTx.wait();

    const createdEvent = createdWait.events.find((item: any) => {
        return item.event === "PoolCreated";
    });

    return createdEvent.args[0];
}

export default createPool;