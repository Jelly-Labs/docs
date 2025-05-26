import {BigNumber, Wallet} from "ethers";

enum ComposablePoolExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
    BPT_IN_FOR_EXACT_TOKENS_OUT = 1,
    EXACT_BPT_IN_FOR_ALL_TOKENS_OUT = 2,
}

enum PoolExitKind {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
    EXACT_BPT_IN_FOR_TOKENS_OUT = 1,
    BPT_IN_FOR_EXACT_TOKENS_OUT = 2,
}

enum PoolCategory {
    STABLE = "stable",
    WEIGHTED = "weighted",
    GYRO = "gyro",
    UNKNOWN = "unknown",
    PLACEHOLDER = "placeholder",

    PORTFOLIO = "portfolio",
    CLASSIC = "classic",
}

enum PoolJoinKind {
    INIT = 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT = 2,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT = 3,
    ADD_TOKEN = 4,
}

export type TokenData = {
    symbol: string;
    address: `0x${string}` | string;
    amount: string;
    weight: number;
    decimals: number;
}
export type PoolCreateContract = {
    poolSymbol: string;
    tokens: string[];
    normalizedWeights: string[];
    maxAmountsIn: string[];
    rateProviders: string[];
    swapFeePercentage: string;
    salt: string;
};


export type PoolApiShares = {
    balance: number;
    userAddress: string | `0x${string}`;
};

export type PoolExitParams = {
    signer: any;
    pool: PoolApi;
    userAddress: `0x${string}` | string;
    slippage: number;
    balance: number;
};

interface PoolApiToken extends TokenBase {
    weight: null | number;
    balance: string;
}

interface TokenBase {
    address: string | `0x${string}`;
    name: string;
    symbol: string;
    decimals: number;
    usd: number;
    icon: string;
    iconTable: string;
}


// Tokens
interface PoolTokenApi extends TokenBase {
    weight: null | number;
    balance: string;
}

interface PoolApi {
    poolId: string | `0x${string}`;
    address: string | `0x${string}`;
    isPoolGroup: boolean;
    name: string;
    symbol: string;
    poolType: string;
    swapEnabled: boolean;
    swapFee: string | number;
    owner: string | `0x${string}`;
    officialPool: boolean;
    officialPoolWeight: null | string | number;
    poolCreatedAt: string;
    totalLiquidity: string;
    totalLiquidityUsdManual: string;
    totalSwapFee: string;
    yesterdayTotalSwapFee: string;
    dailyVolume: string;
    totalSwapVolume: string;
    totalWeight: string;
    totalShares: number;
    protocolSwapFeeCache: string;
    tokens: PoolApiToken[];
    shares: PoolApiShares[];
    poolCategory: PoolCategory;
    children: PoolApi[];
    alpha: number;
    beta: number;
    ranges: { from: number; to: number } | undefined;
    parentAddress: string | undefined;
    apr: any; // TODO Add type
}

interface JoinPoolParams {
    signer: Wallet;
    userAddress: string | `0x${string}`;
    poolId: string;
    assets: string[];
    maxAmountsIn: string[] | BigNumber[];
    fromInternalBalance?: boolean;
    userData: string;
    isStablePool?: boolean;
    isGyroPool?: boolean;
    nativeTokenValue: { value: number | string } | boolean;
}


export {
    PoolApi,
    PoolApiToken,
    PoolTokenApi,
    PoolExitKind,
    JoinPoolParams,
    ComposablePoolExitKind,
    PoolJoinKind,
    PoolCategory,
}