import { PublicKey, Cluster } from '@solana/web3.js';
import { ProgramAddresses } from '@/types';

export const INSTRUCTIONS = {
  STAKE: 1,
  UNSTAKE: 2,
};

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

export const clusterProgramAddresses: Record<Cluster, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  devnet: MAINNET_PROGRAM_ADDRESSES, // TODO change
  testnet: MAINNET_PROGRAM_ADDRESSES, // TODO change
}

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
