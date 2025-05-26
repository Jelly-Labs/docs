import axios from "axios";
import {sei} from "viem/chains";

import {PoolTokenApi} from "../helpers/types";

const createToken = async () => {
    // const iconFile = fs.createReadStream("/path/to/token-icon.svg"); // Add a path to token icon
    //
    // const headers = {
    //     "accessKey": process.env.API_ACCESS_KEY,
    // }
    //
    // const data = new FormData();
    // data.append("name", "JellyToken Sample");
    // data.append("symbol", "JLYS");
    // data.append("decimals", 18);
    // data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");
    // data.append("icon", iconFile); // Optional
    // // data.append("iconTable", iconTableFile); // Optional
    //
    // const response = await axios({
    //     url: `${process.env.API_URL}/token/create`,
    //     method: "POST",
    //     data,
    //     headers,
    // });
    //
    // console.log(response.data)
}

const removeToken = async () => {
//     const headers = {
//         "accessKey": process.env.API_ACCESS_KEY,
//     }
//
//     const data = new FormData();
//     data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");
//
//     const response = await axios({
//         url: `${process.env.API_URL}/token/${address}/remove`,
//         method: "POST",
//         data,
//         headers,
//     });
//
//     console.log(response.data)
}

const updateToken = async () => {

}

const getTokens = async (): Promise<PoolTokenApi[]> => {
    const {data} = await axios({
        url: `${process.env.API_URL}/tokens?networkId=${sei.id}`,
        method: "GET",
    });

    return data;
}

export {createToken, removeToken, updateToken, getTokens};