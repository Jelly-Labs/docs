import * as fs from "fs";
import FormData from 'form-data';
import axios from "axios";

const createToken = async () => {
    const iconFile = fs.createReadStream('/path/to/token-icon.svg');

// Create headers
    const headers = {
        "accessKey": "{ACCESS_KEY}",
    }

// Create form data
    const data = new FormData();
    data.append("name", "JellyToken Sample");
    data.append("symbol", "JLYS");
    data.append("decimals", 18);
    data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");
    data.append("icon", iconFile);
    // data.append("iconTable", iconTableFile); // Optional

// Create request
    const response = await axios({
        url: "https://api-dev.jellyverse.org/api/add/token",
        method: "POST",
        data,
        headers,
    });

    console.log(response.data)
}

export default createToken;