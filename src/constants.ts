import { PublicKey } from '@solana/web3.js';
import { ProgramAddresses, SupportedClusters } from '@/types';

export enum INSTRUCTION {
  STAKE = 1,
  UNSTAKE = 2,
}

export enum INSTRUCTION_V2 {
  STAKE = 1,
  UNSTAKE = 23,
}

export enum TX_STAGE {
  AWAITING_SIGNING = 1,
  AWAITING_BLOCK = 2,
  SUCCESS = 3,
  ERROR = 4,
}

export enum LidoVersion {
  v1,
  v2,
}

export const MAINNET_PROGRAM_ADDRESSES: ProgramAddresses = Object.freeze({
  solidoProgramId: new PublicKey('CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi'),
  solidoInstanceId: new PublicKey('49Yi1TKkNyYjPAFdR9LBvoHcUjuPX4Df5T5yv39w2XTn'),
  stSolMintAddress: new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj'),
});

export const TESTNET_PROGRAM_ADDRESSES: ProgramAddresses = Object.freeze({
  solidoProgramId: new PublicKey('CGB9MASv7Qrgi3cXZ9YgNp5XFcE6zuhkt5pZ1g473CbC'),
  solidoInstanceId: new PublicKey('33GsSURekhMQmVHeyFkGtW4ihDb5638exWD9Q8xV65RW'),
  stSolMintAddress: new PublicKey('2N1FMx6xqTqBYh4iqGifERV2BKH8gSk1PtHQ6Nt717DR'),
});

export const clusterProgramAddresses: Record<SupportedClusters, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  testnet: TESTNET_PROGRAM_ADDRESSES,
};

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const SOL_API_HOST = 'https://sol-api-pub.lido.fi';
