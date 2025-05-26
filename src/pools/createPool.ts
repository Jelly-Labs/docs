import {Contract, Wallet} from "ethers";
import abi from "../abis/weightedPoolFactory.json";
import {contracts} from "../helpers/contracts";
import generatePoolCreateData from "../helpers/generatePoolCreateData";
import {TokenData} from "../helpers/types";

const createPool = async (signer: Wallet, poolName: string, tokensForPool: TokenData[], fee: number, owner: `0x${string}` | string): Promise<string> => {
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

    const createdEvent = createdWait.events.find((item: any) => {
        return item.event === "PoolCreated";
    });

    return createdEvent.args[0];
}

export default createPool;