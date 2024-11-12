import {JsonRpcProvider, Wallet} from "ethers";
import "dotenv/config";
import createPool from "./createPool";
import getPoolId from "./getPoolId";
import joinPool from "./joinPool";
import generatePoolData from "./helpers/generatePoolData";
import addApprovals from "./addApprovals";


const main = async () => {
    // >>>>> CHANGEABLE DATA <<<<<
    const tokensForPool = [
        {
            tokenSymbol: "JLY",
            address: "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1",
            amount: 50,
            weight: 50,
            decimals: 18
        },
        {
            tokenSymbol: "jSEI",
            address: "0xd63b330615C6591164f418fc522510f3D9A8Eb67",
            amount: 10,
            weight: 50,
            decimals: 18
        },
    ]; // Weight sum must be 100!

    const fee = 1; // 2 <= fee => 0.01
    const poolName = "My Pool Name"; // Name can be anything
    // >>>>> CHANGEABLE DATA <<<<<

    try {
        const privateKey = process.env.PRIVATE_KEY as string;
        const provider = new JsonRpcProvider(process.env.URL_RPC);
        const signer = new Wallet(privateKey, provider);
        const userAddress = await signer.getAddress();

        const {
            poolSymbol,
            tokens,
            normalizedWeights,
            rateProviders,
            swapFeePercentage,
            salt,
            maxAmountsIn
        } = generatePoolData(tokensForPool, fee);

        console.log("Creating pool...")
        const poolAddress = await createPool(signer, poolName, poolSymbol, tokens, normalizedWeights, rateProviders, swapFeePercentage, userAddress, salt);
        console.log(`Pool created, pool address is: ${poolAddress}.`);

        console.log("Getting pool id...")
        const poolId = await getPoolId(signer, poolAddress);
        console.log(`Received pool id: ${poolId}.`);

        console.log("Approving tokens...")
        const approvals = await addApprovals(signer, tokensForPool)
        console.log(`All tokens are approved - ${approvals}`);

        console.log("Joining in pool....")
        const txHash = await joinPool(signer, poolId, userAddress, tokens, maxAmountsIn);
        console.log(`Successfully joined in pool, hash: ${txHash}`);
    } catch (e) {
        console.error(`[Error] Pool - ${(e as Error).message}`)
    }
}

main().then();