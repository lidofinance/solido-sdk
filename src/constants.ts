import { PublicKey, Cluster } from '@solana/web3.js';
import { ProgramAddresses } from '@/types';

export enum INSTRUCTION {
  STAKE = 1,
  UNSTAKE = 2,
}

export enum TX_STAGE {
  AWAITING_SIGNING = 1,
  AWAITING_BLOCK = 2,
  SUCCESS = 3,
  ERROR = 4,
}

export const MAINNET_PROGRAM_ADDRESSES: ProgramAddresses = {
  solidoProgramId: new PublicKey('CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi'),
  solidoInstanceId: new PublicKey('49Yi1TKkNyYjPAFdR9LBvoHcUjuPX4Df5T5yv39w2XTn'),
  stSolMintAddress: new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj'),
};

export const DEVNET_PROGRAM_ADDRESSES: ProgramAddresses = {
  solidoProgramId: new PublicKey('CbxVmURN74QZGuFj6qKjM8VDM8b8KKZrbPFLM2CC2hC8'),
  solidoInstanceId: new PublicKey('8sqs4Jzs8uq7CEtimhXf32gioVUN3n5Qk65YMkNU5E4F'),
  stSolMintAddress: new PublicKey('5nnLCgZn1EQaLj1ub8vYbQgBhkWi97x4JC5ARVPhci4V'),
};

export const TESTNET_PROGRAM_ADDRESSES: ProgramAddresses = {
  solidoProgramId: new PublicKey('7k3rzqoNQxgTLTooAvXriGBKYsd16bV3JMvatvXcBfNo'),
  solidoInstanceId: new PublicKey('7yoacaUf7yu5wqxpcHaXtwCaMciR7kFqps8FwnX4cjeK'),
  stSolMintAddress: new PublicKey('8ry9FhmvhifEBwLPJpg89fAu19rmUHskDVvEfKuDbQbT'),
};

export const clusterProgramAddresses: Record<Cluster, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  devnet: DEVNET_PROGRAM_ADDRESSES,
  testnet: TESTNET_PROGRAM_ADDRESSES,
};

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const SOL_API_HOST = 'https://sol-api.infra-staging.org';
