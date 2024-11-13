import FormData from "form-data";
import axios from "axios";

const removeToken = async () => {
    const headers = {
        "accessKey": process.env.API_ACCESS_KEY,
    }

    const data = new FormData();
    data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");

    const response = await axios({
        url: `${process.env.API_URL}/api/remove/token`,
        method: "POST",
        data,
        headers,
    });

    console.log(response.data)
}

export default removeToken;