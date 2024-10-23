## How to createPool a Weighted Pool on Jellyverse?

```javascript
const abi = `[{"inputs": [{"internalType": "contract IVault","name": "vault","type": "address"},{"internalType": "contract IProtocolFeePercentagesProvider","name": "protocolFeeProvider","type": "address"},{"internalType": "string","name": "factoryVersion","type": "string"},{"internalType": "string","name": "poolVersion","type": "string"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [],"name": "FactoryDisabled","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "pool","type": "address"}],"name": "PoolCreated","type": "event"},{"inputs": [{"internalType": "string","name": "name","type": "string"},{"internalType": "string","name": "symbol","type": "string"},{"internalType": "contract IERC20[]","name": "tokens","type": "address[]"},{"internalType": "uint256[]","name": "normalizedWeights","type": "uint256[]"},{"internalType": "contract IRateProvider[]","name": "rateProviders","type": "address[]"},{"internalType": "uint256","name": "swapFeePercentage","type": "uint256"},{"internalType": "address","name": "owner","type": "address"},{"internalType": "bytes32","name": "salt","type": "bytes32"}],"name": "createPool","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "disable","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bytes4","name": "selector","type": "bytes4"}],"name": "getActionId","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getAuthorizer","outputs": [{"internalType": "contract IAuthorizer","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getCreationCode","outputs": [{"internalType": "bytes","name": "","type": "bytes"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getCreationCodeContracts","outputs": [{"internalType": "address","name": "contractA","type": "address"},{"internalType": "address","name": "contractB","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getPauseConfiguration","outputs": [{"internalType": "uint256","name": "pauseWindowDuration","type": "uint256"},{"internalType": "uint256","name": "bufferPeriodDuration","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getPoolVersion","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getProtocolFeePercentagesProvider","outputs": [{"internalType": "contract IProtocolFeePercentagesProvider","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getVault","outputs": [{"internalType": "contract IVault","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "isDisabled","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "pool","type": "address"}],"name": "isPoolFromFactory","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "version","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"}]`;
const weightedPoolFactoryContract = "0xCe733ca21882D1407386aF13c59F59e02B1Db5A9";

const poolContract = new ethers.Contract(
    weightedPoolFactoryContract,
    abi,
    signer
);

const createTx = await poolContract.createPool(
    name,
    symbol,
    tokens,
    normalizedWeights,
    rateProviders,
    swapFeePercentage,
    owner,
    salt
);

await createTx.wait();
```

```javascript
// If this event exists, pool is created
const createdWait = await createTx.wait();
const createdEvent = createdWait.events.find((item: any) => {
    return item.event === "PoolCreated";
});

// To get pool address (example: 0x55d45c15a95abfbbce3c88f90adcd62cd873a2db)
const poolAddress = createdEvent.args[0]
```



### How it looks on contract
Link to the [sample](https://seitrace.com/address/0xCe733ca21882D1407386aF13c59F59e02B1Db5A9?chain=pacific-1&tab=contract).

```solidity
  string memory name,
  string memory symbol,
  IERC20[] memory tokens,
  uint256[] memory normalizedWeights,
  IRateProvider[] memory rateProviders,
  uint256 swapFeePercentage,
  address owner,
  bytes32 salt
```

### How it looks in JavaScript:

```javascript
// Name of pool 
// Example: JLY/50-SEI/50 
// https://app.jellyverse.org/jellyswap/pool/0x55d45c15a95abfbbce3c88f90adcd62cd873a2db000200000000000000000005
const name = "My pool name";

// Token symbol which exists in pool
// Example: "JLY50-SEI50
const symbol = "tokenSymbol-tokenSymbol-tokenSymbol";

// encodeBytes32String - ethers6 or you can use formatBytes32String - ethers5  
// generateRandomAsciiCharacters - custom method
const salt = encodeBytes32String(generateRandomAsciiCharacters(31));

// Address of user who wants to createPool pool
const owner = "0xPOOL_OWNER_ADDRESS";

// Rate provider is 0x00000...000
// ethers.constants.AddressZero - ethers5 
const rateProviders = ethers.ZeroAddress;

// parseUnits from ethers
// fee is number, maximum value is 2
const swapFeePercentage = parseUnits(String(fee), 16).toString();

// tokenWeightInPool represents weight of token in pool 
// Must be a number between 1 and 99!
const normalizedWeights = [parseUnits(String(tokenWeightInPool), 16).toString(), parseUnits(String(tokenWeightInPool), 16).toString()];

// Tokens addresses
// If you making pool with SEI, please replace 0x00000...000 with wSEI address (0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7) 
const tokens = ['0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7', '0xDD7d5e4Ea2125d43C16eEd8f1FFeFffa2F4b4aF6']
```