import axios from "axios";
import {sei} from "viem/chains";

import {PoolApi} from "../helpers/types";

export const getPool = async (poolId: string): Promise<PoolApi> => {
    const {data} = await axios({
        url: `${process.env.API_URL}/pools/${poolId}?networkId=${sei.id}`,
        method: "GET",
    });

    return data;
}
