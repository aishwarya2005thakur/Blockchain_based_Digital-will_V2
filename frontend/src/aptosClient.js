import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const network = process.env.REACT_APP_APTOS_NETWORK || Network.TESTNET;
const aptosConfig = new AptosConfig({ network });

export const aptos = new Aptos(aptosConfig);
