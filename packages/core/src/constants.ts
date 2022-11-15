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

// 1xx - blockchain error
// 2xx - protocol errors
// 3xx - sdk errors
// 4xx - user's errors
export enum ERROR_CODE {
  CANNOT_CONFIRM_TRANSACTION = 100,
  NO_VALIDATORS = 200,
  UNSUPPORTED_CLUSTER = 300,
  UNSTAKE_UNAVAILABLE = 301,
  NO_PUBLIC_KEY = 302,
  NO_ACCOUNT_INFO = 303,
  EXCEED_MAX = 400,
}

export const ERROR_CODE_DESC: Record<ERROR_CODE, string> = {
  [ERROR_CODE.CANNOT_CONFIRM_TRANSACTION]: 'CANNOT_CONFIRM_TRANSACTION',
  [ERROR_CODE.NO_VALIDATORS]: 'NO_VALIDATORS',
  [ERROR_CODE.UNSUPPORTED_CLUSTER]: 'UNSUPPORTED_CLUSTER',
  [ERROR_CODE.UNSTAKE_UNAVAILABLE]: 'UNSTAKE_UNAVAILABLE',
  [ERROR_CODE.NO_PUBLIC_KEY]: 'NO_PUBLIC_KEY',
  [ERROR_CODE.NO_ACCOUNT_INFO]: 'NO_ACCOUNT_INFO',
  [ERROR_CODE.EXCEED_MAX]: 'EXCEED_MAX',
};

export const ERROR_MESSAGE: Partial<Record<ERROR_CODE, string>> = {
  [ERROR_CODE.NO_VALIDATORS]: `Couldn't fetch validators list`,
  [ERROR_CODE.UNSUPPORTED_CLUSTER]: `SolidoSDK doesn't support devnet, please specify mainnet-beta or testnet`,
  [ERROR_CODE.UNSTAKE_UNAVAILABLE]:
    'Sorry, unStake is not available right now. Please contact lido developers for details.',
  [ERROR_CODE.NO_PUBLIC_KEY]: 'SolidoSDK: publicKey is null in wallet',
  [ERROR_CODE.NO_ACCOUNT_INFO]: `Couldn't fetch getAccountInfo`,
};
