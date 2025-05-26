import "dotenv/config";
import {ethers} from "ethers";
import {createPool, joinPool, getPoolId, addApprovals} from "./pools";
import {contracts} from "./helpers/contracts";
import {TokenData} from "./helpers/types";

const main = async () => {
    // >>>>> CHANGEABLE DATA <<<<<
    const tokensForPool: TokenData[] = [
        {
            symbol: "JLY",
            address: contracts.jly,
            amount: "0.02",
            weight: 50,
            decimals: 18
        },
        {
            symbol: "SEI",
            address: ethers.constants.AddressZero,
            amount: "0.1",
            weight: 50,
            decimals: 18
        },
    ]; // Weight sum must be 100!
    const fee = 0.01; // Fee range ->  [2.00 <= fee => 0.01]
    const poolName = "Super NEW Jellyverse Pool Name on Sei";
    // >>>>> CHANGEABLE DATA <<<<<

    try {
        const privateKey = process.env.PRIVATE_KEY as string;
        const provider = new ethers.providers.JsonRpcProvider(contracts.rpc);
        const signer = new ethers.Wallet(privateKey, provider);
        const userAddress = await signer.getAddress();

        const poolId = await poolCreateAndGetPoolId({signer, poolName, tokensForPool, fee, userAddress});

        await addApprovals(signer, tokensForPool);

        const txHash = await joinPool(signer, poolId, userAddress, tokensForPool);

        console.log("Pool created and joined, tx hash is: ", txHash);
    } catch (e) {
        console.error(e)
    }
}

const poolCreateAndGetPoolId = async ({signer, poolName, tokensForPool, fee, userAddress}: any) => {
    const poolAddress = await createPool(signer, poolName, tokensForPool, fee, userAddress);

    return await getPoolId(signer, poolAddress);
}

main().then();