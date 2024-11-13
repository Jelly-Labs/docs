import {sei, seiTestnet} from "viem/chains";

const networks = {
    [sei.id]: {
        vault: "0xFB43069f6d0473B85686a85F4Ce4Fc1FD8F00875",
        weightedPool: "0xCe733ca21882D1407386aF13c59F59e02B1Db5A9",
        wSei: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
        rpc: "https://evm-rpc.sei-apis.com",
    },
    [seiTestnet.id]: {
        vault: "0x428AEc7c1E0c9A52686774434A1D6DE5134Ac529",
        weightedPool: "0x74737E1b3900Ed3CBc2b4cB32044e2e0540d1a69",
        wSei: "0xd63b330615C6591164f418fc522510f3D9A8Eb67", // Fake wSei
        rpc: "https://evm-rpc-testnet.sei-apis.com",
    }
}

const contracts = process.env.ENV === "production" ? networks[sei.id] : networks[seiTestnet.id];


export {
    networks,
    contracts
};