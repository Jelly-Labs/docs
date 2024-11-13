## How to create Weighted Pool on Jellyverse?

![Pool Create Diagram](https://github.com/Jelly-Labs/docs/blob/main/assets/pool-create.png?raw=true)

## Overview

This code demonstrates how to create a pool with specified tokens, approve their transfers, and join the pool using a
smart contract. It uses the ethers library for contract interactions.

### Pool tokens configuration

```javascript
const tokensForPool = [
    {
        tokenSymbol: "JLY",
        address: "0x1234...5678",
        amount: 150,
        weight: 50,
        decimals: 18
    },
    {
        tokenSymbol: "SEI",
        address: ethers.constants.AddressZero,
        amount: 50,
        weight: 50,
        decimals: 18
    }
    // ...
];

const fee = 0.01; // 2 <= fee => 0.01
const poolName = "Enter pool name";
```

### Functions Overview
- createPool(signer, poolName, tokensForPool, fee, userAddress):  
**Creates a pool with the specified parameters.**
- getPoolId(signer, poolAddress):  
**Retrieves the pool ID using the address of the pool.**
- addApprovals(signer, tokensForPool):\
**Approves tokens for transfer.**
- joinPool(signer, poolId, userAddress, tokensForPool):  
  **Joins the specified pool.**

### Notes
- Ensure that the PRIVATE_KEY is correctly set in your environment variables.
- Make sure that the sum of token weights equals 100.
- Consider gas fees for each transaction when running this code on a live network.