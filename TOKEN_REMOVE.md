## How to remove token from Jellyverse?

```javascript
// Create form data
const data = new FormData();
data.append("address", "0xB218459C01F94974AAA1c5B25d11E7758A02b0A1");

// Create request
const response = await axios({
    url: "https://api-dev.jellyverse.org/api/remove/token",
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
  "date": "2024-01-01T10:00:00.000Z"
}
```

## Note 
You can only remove the tokens you created!
