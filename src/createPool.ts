import abi from "./abis/weightedPoolFactory.json";
import {contracts} from "./helpers/contracts";
import generatePoolCreateData, {TokenData} from "./helpers/generatePoolCreateData";
import {Contract} from "ethers";

const createPool = async (signer: any, poolName: string, tokensForPool: TokenData[], fee: number, owner: `0x${string}` | string): Promise<string> => {
    // return "0xC449E9A668987d8c08b5614082596483D7A9F5be"; // mainnet pool
    // return "0x48aA150CfEE1c949C83c96653976fdF1f514b4c9"; // testnet pool

    const poolContract = new Contract(contracts.weightedPool, abi, signer);

    const {
        poolSymbol,
        tokens,
        normalizedWeights,
        rateProviders,
        swapFeePercentage,
        salt,
    } = generatePoolCreateData(tokensForPool, fee);


    const createTx = await poolContract.create(
        poolName,
        poolSymbol,
        tokens,
        normalizedWeights,
        rateProviders,
        swapFeePercentage,
        owner,
        salt
    );

    const createdWait = await createTx.wait();

    console.log(createdWait);
    const createdEvent = createdWait.events.find((item: any) => {
        return item.event === "PoolCreated";
    });

    return createdEvent.args[0];

    // const eventLog = createdWait.logs.find((item: Log | EventLog) => {
    //     return item instanceof EventLog;
    // });
    //
    // return eventLog.fragment.name === "PoolCreated" ? eventLog.args[0] : "";
}

export default createPool;