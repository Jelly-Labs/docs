// import {Contract} from "ethers";
// import abi from "./abis/weightedPoolFactory.json";

const createPool = async (signer: any, name: string, symbol: string, tokens: string[], normalizedWeights: string[], rateProviders: string[], swapFeePercentage: string, owner: `0x${string}` | string, salt: string): Promise<string> => {
    // const contractAddress = process.env.CONTRACT_WEIGHTED_POOL as string;
    //
    // const poolContract = new Contract(
    //     contractAddress,
    //     abi,
    //     signer
    // );
    //
    // const createTx = await poolContract.create(
    //     name,
    //     symbol,
    //     tokens,
    //     normalizedWeights,
    //     rateProviders,
    //     swapFeePercentage,
    //     owner,
    //     salt
    // );
    //
    // const createdWait = await createTx.wait();
    //
    // console.log("created ->", createdWait);
    // const createdEvent = createdWait.events.find((item: any) => {
    //     return item.event === "PoolCreated";
    // });
    //
    // return createdEvent.args[0];

    return "0xddDa08d88845b6Dc3C45abafEa11b4b8657C822c";
}

export default createPool;