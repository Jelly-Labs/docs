import {ethers} from "ethers";
import "dotenv/config";
import {getPool} from "./api/pools";
import exitPool from "./pools/exitPool";
import {contracts} from "./helpers/contracts";

const main = async () => {
    // >>>>> CHANGEABLE DATA <<<<<
    const poolId = "0x55d45c15a95abfbbce3c88f90adcd62cd873a2db000200000000000000000005";
    const balance = 50; // Number of BPT tokens to exit
    const slippage = 0.01;
    // >>>>> CHANGEABLE DATA <<<<<

    try {
        const privateKey = process.env.PRIVATE_KEY as string;
        const provider = new ethers.providers.JsonRpcProvider(contracts.rpc);
        const signer = new ethers.Wallet(privateKey, provider);
        const userAddress = await signer.getAddress();

        const pool = await getPool(poolId);

        // const tokenInUsd = pool.tokens.map((token) => {
        //     const returnLpAmount = new Decimal(balance)
        //         .div(pool.totalShares)
        //         .times(100)
        //         .div(100)
        //         .times(Number(token.balance))
        //         .toFixed(4);
        //
        //     return new Decimal(token.usd).mul(Number(returnLpAmount)).toFixed(2);
        // }

        await exitPool({
            signer,
            pool,
            userAddress,
            slippage,
            balance
        })

        console.log('Successfully exited from pool - ', poolId);

    } catch (e) {
        console.error(e);
    }
}


main().then();