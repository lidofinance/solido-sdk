import { PublicKey } from '@solana/web3.js';
import { ProgramAddresses, SupportedClusters } from '@/types';
import {lamportsToSol} from '@/utils/formatters';

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
  NO_PUBLIC_KEY = 100,
  NO_ACCOUNT_INFO = 101,
  NO_VALIDATORS = 200,
  UNSTAKE_UNAVAILABLE = 201,
  UNSUPPORTED_CLUSTER = 300,
  EXCEED_MAX = 301,
  CANNOT_CONFIRM_TRANSACTION = 400,
}

export const ERROR_CODES_DESC = {
  [ERROR_CODES.NO_PUBLIC_KEY]: 'no_public_key',
  [ERROR_CODES.NO_ACCOUNT_INFO]: 'no_account_info',
  [ERROR_CODES.NO_VALIDATORS]: 'no_validators_found',
  [ERROR_CODES.UNSTAKE_UNAVAILABLE]: 'unstake_unavailable',
  [ERROR_CODES.UNSUPPORTED_CLUSTER]: 'unsupported_cluster',
  [ERROR_CODES.EXCEED_MAX]: 'exceed_max',
  [ERROR_CODES.CANNOT_CONFIRM_TRANSACTION]: 'cant_confirm_transaction',
}

export const ERROR_MESSAGE = {
  [ERROR_CODES.NO_PUBLIC_KEY]: 'SolidoSDK: publicKey is null in wallet',
  [ERROR_CODES.NO_ACCOUNT_INFO]: `Couldn't fetch getAccountInfo`,
  [ERROR_CODES.NO_VALIDATORS]: `Couldn't fetch validators list`,
  [ERROR_CODES.UNSTAKE_UNAVAILABLE]: 'Sorry, unStake is not available right now. Please contact lido developers for details.',
  [ERROR_CODES.UNSUPPORTED_CLUSTER]: `SolidoSDK doesn't support devnet, please specify mainnet-beta or testnet`,
}

