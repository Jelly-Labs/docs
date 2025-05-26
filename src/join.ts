import "dotenv/config";
import {ethers} from "ethers";
import {contracts} from "./helpers/contracts";
import {getPool} from "./api/pools";
import {PoolApi, PoolCategory, TokenData} from "./helpers/types";
import GyroECLPPoolAbi from "./abis/gyroEclp.json";
import {addApprovals, joinPool} from "./pools";
import {buildJoinData} from "./helpers/generatePoolJoinDataForJoin";
import joinPoolPlain from "./pools/joinPoolPlain";

const main = async () => {
    // >>>>> CHANGEABLE DATA <<<<<
    const poolId = "0x55d45c15a95abfbbce3c88f90adcd62cd873a2db000200000000000000000005";
    const slippage = 0.01;
    const tokensForPool: TokenData[] = [
        {
            symbol: "JLY",
            address: contracts.jly,
            amount: "100",
            decimals: 18,
            weight: 0,
        },
        {
            symbol: "SEI",
            address: ethers.constants.AddressZero,
            amount: "5",
            decimals: 18,
            weight: 0,
        },
    ];
    // TODO Add Gyro calculation for proportional weights
    // >>>>> CHANGEABLE DATA <<<<<

    try {
        const privateKey = process.env.PRIVATE_KEY as string;
        const provider = new ethers.providers.JsonRpcProvider(contracts.rpc);
        const signer = new ethers.Wallet(privateKey, provider);
        const userAddress = await signer.getAddress();
        const pool = await getPool(poolId);
        const actualSupply = await getActualSupply(pool, signer);

        const {assets, maxAmountsIn, userData, nativeTokenValue} = await buildJoinData({
            pool,
            signer,
            slippage,
            tokensForPool,
            actualSupply,
        });

        await addApprovals(signer, tokensForPool)

        const joinHash = await joinPoolPlain({
            signer,
            userAddress,
            poolId,
            assets,
            maxAmountsIn,
            userData,
            nativeTokenValue,
            fromInternalBalance: false
        });

        console.log('Successfully joined pool - ', poolId, "hash", joinHash);

    } catch (e) {
        console.error(e);
    }
}

const getActualSupply = async (pool: PoolApi, signer: ethers.Signer) => {
    const {poolCategory, address} = pool;
    if (poolCategory === PoolCategory.GYRO) {
        const contract = new ethers.Contract(address, GyroECLPPoolAbi, signer);
        const result = await contract.getActualSupply();

        return ethers.utils.formatEther(result);
    }

    return 0;
}

main().then();