import "dotenv/config";

import createPool from "./createPool";
import getPoolId from "./getPoolId";
import joinPool from "./joinPool";
import addApprovals from "./addApprovals";
import {contracts} from "./helpers/contracts";
import {ethers} from "ethers";

const main = async () => {
    // >>>>> CHANGEABLE DATA <<<<<
    const tokensForPool = [
        {
            tokenSymbol: "JLY",
            address: "0xDD7d5e4Ea2125d43C16eEd8f1FFeFffa2F4b4aF6", // mainnet
            // address: "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1", // testnet
            amount: 0.02,
            weight: 50,
            decimals: 18
        },
        {
            tokenSymbol: "SEI",
            address: ethers.constants.AddressZero, // mainnet
            // address: "0xd63b330615C6591164f418fc522510f3D9A8Eb67", // testnet
            amount: 0.1,
            weight: 50,
            decimals: 18
        },
    ]; // Weight sum must be 100!

    const fee = 0.01; // 2 <= fee => 0.01
    const poolName = "Test Pool Name Sei"; // Name can be anything
    // >>>>> CHANGEABLE DATA <<<<<

    try {
        const privateKey = process.env.PRIVATE_KEY as string;
        const provider = new ethers.providers.JsonRpcProvider(contracts.rpc);
        const signer = new ethers.Wallet(privateKey, provider);
        const userAddress = await signer.getAddress();

        console.log("Creating pool...")
        const poolAddress = await createPool(signer, poolName, tokensForPool, fee, userAddress);
        console.log(`Pool created, pool address is: ${poolAddress}.`);

        console.log("Getting pool id...")
        const poolId = await getPoolId(signer, poolAddress);
        console.log(`Received pool id: ${poolId}.`);

        console.log("Approving tokens...")
        const approvals = await addApprovals(signer, tokensForPool)
        console.log(`All tokens are approved - ${approvals}`);

        console.log("Joining in pool....")
        const txHash = await joinPool(signer, poolId, userAddress, tokensForPool);
        console.log(`Successfully joined in pool, hash: ${txHash}`);
    } catch (e) {
        console.error(e)
    }
}

main().then();