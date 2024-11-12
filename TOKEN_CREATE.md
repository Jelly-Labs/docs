## How to whitelist token on Jellyverse?


```javascript
// Create form data
const data = new FormData();
data.append("name", "JellyToken Sample");
data.append("symbol", "JLYS");
data.append("decimals", 18);
data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");
data.append("icon", iconFile); // Optional
data.append("iconTable", iconTableFile); // Optional


// Create request
const response = await axios({
    url: "https://api-dev.jellyverse.org/api/add/token",
    method: "POST",
    data,
    headers: {
        "accessKey": "{ACCESS_KEY}",
    }
});
```

### Response example
```json
{
  "message": "Success",
  "date": "2024-01-01T10:00:00.000Z",
  "data": {
    "name": "JellyToken Sample",
    "symbol": "JLYS",
    "address": "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1",
    "decimals": 18,
    "usd": 0,
    "chainId": 1329,
    "icon": "tokens/dev/1234567jlytoken-icon.png",
    "iconTable": null
  }
}
```

#### What is icon?
Upload your token’s icon for use on Jellyverse. Radius size should be 32 px. Maximum size: 5MB. Accepted formats: .jpg .jpeg .png .svg"

![Icon](https://github.com/Jelly-Labs/docs/blob/main/assets/icon-example.png?raw=true)


#### What is icon table (optional)?
Upload a more compact version of your token icon to be displayed in list views. Maximum size: 5MB. Accepted formats: .jpg .jpeg .png .svg

![Icon Table](https://github.com/Jelly-Labs/docs/blob/main/assets/icon-table-example.png?raw=true)

