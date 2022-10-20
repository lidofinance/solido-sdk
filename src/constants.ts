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
  IDLE = 0,
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
  solidoProgramId: new PublicKey('6RRggYnFe2EcD543QXrE3Wxp1Kgcq8qctwRrNnvjoYsL'),
  solidoInstanceId: new PublicKey('Hcqw2G2FkBhBiDZz3PXFBUKuMQiKMJmXvcfqRaXkyNXF'),
  stSolMintAddress: new PublicKey('Bz2UPiXJmCQYT8XQHaPPXG3fywNp2TENav5dcJdX9q21'),
});

export const clusterProgramAddresses: Record<SupportedClusters, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  testnet: TESTNET_PROGRAM_ADDRESSES,
};

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const SOL_API_HOST = 'https://sol-api-pub.lido.fi';

export enum ERROR_CODES {
  NO_PUBLIC_KEY = 'no_public_key',
  NO_ACCOUNT_INFO = 'no_account_info',
  NO_VALIDATORS = 'no_validators_found',
  UNSTAKE_UNAVAILABLE = 'unstake_unavailable',
  UNSUPPORTED_CLUSTER = 'unsupported_cluster',
  EXCEED_MAX = 'exceed_max',
  CANNOT_CONFIRM_TRANSACTION = 'cant_confirm_transaction',
}

