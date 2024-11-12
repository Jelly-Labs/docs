import {Contract, parseUnits, ZeroAddress} from "ethers";
import abi from "./abis/erc20.json";
import {TokenData} from "./helpers/generatePoolData";

const addApprovals = async (signer: any, tokenData: TokenData[]) => {
    const contractAddress = process.env.CONTRACT_VAULT as string;
    const preparedTokenData = tokenData.filter(item => item.address !== ZeroAddress);

    const assets = preparedTokenData.map(item => item.address);
    const maxAmountsIn = preparedTokenData.map(item => parseUnits(String(item.amount), item.decimals).toString());

    return await Promise.all(
        assets.map(async (asset: string, index: number) => {
            const tokenContract = new Contract(asset, abi, signer);
            const tx = await tokenContract.approve(contractAddress, maxAmountsIn[index]);
            console.log("waiting on tx....");

            return await tx.wait();
        })
    );
};

export default addApprovals;