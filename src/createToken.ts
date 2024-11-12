import * as fs from "fs";
import FormData from "form-data";
import axios from "axios";

const createToken = async () => {
    const iconFile = fs.createReadStream("/path/to/token-icon.svg"); // Add a path to token icon

    const headers = {
        "accessKey": process.env.API_ACCESS_KEY,
    }

    const data = new FormData();
    data.append("name", "JellyToken Sample");
    data.append("symbol", "JLYS");
    data.append("decimals", 18);
    data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");
    data.append("icon", iconFile); // Optional
    // data.append("iconTable", iconTableFile); // Optional

    const response = await axios({
        url: `${process.env.API_URL}/api/add/token`,
        method: "POST",
        data,
        headers,
    });

    console.log(response.data)
}

export default createToken;