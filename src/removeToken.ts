import FormData from 'form-data';
import axios from "axios";

const removeToken = async () => {
// Create headers
    const headers = {
        "accessKey": "{ACCESS_KEY}",
    }

// Create form data
    const data = new FormData();
    data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");

// Create request
    const response = await axios({
        url: "https://api-dev.jellyverse.org/api/remove/token",
        method: "POST",
        data,
        headers,
    });

    console.log(response.data)
}

export default removeToken;