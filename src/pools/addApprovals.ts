import {Contract, ethers, Wallet} from "ethers";

import abi from "../abis/erc20.json";
import {contracts} from "../helpers/contracts";
import {TokenData} from "../helpers/types";

const addApprovals = async (signer: Wallet, tokenData: TokenData[]) => {
    const preparedTokenData = tokenData.filter(item => item.address !== ethers.constants.AddressZero);

    const assets = preparedTokenData.map(item => item.address);
    const maxAmountsIn = preparedTokenData.map(item => ethers.utils.parseUnits(String(item.amount), item.decimals).toString());

    for (let index = 0; index < assets.length; index++) {
        const asset = assets[index];
        const tokenContract = new Contract(asset, abi, signer);
        const tx = await tokenContract.approve(contracts.vault, maxAmountsIn[index]);

        await tx.wait();
    }

    return true;
};

export default addApprovals;