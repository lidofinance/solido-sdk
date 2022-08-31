import { PublicKey } from '@solana/web3.js';
import { ProgramAddresses, SupportedClusters } from '@/types';

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

export const TESTNET_PROGRAM_ADDRESSES: ProgramAddresses = {
  solidoProgramId: new PublicKey('79FkHD3z4c4dJBtA3r9F1z5qoU2Mq1aW7MVgTe9TWp7i'),
  solidoInstanceId: new PublicKey('7djThAZ462gRyj8SPYXDfdiJcfsCotaBDw1LBCtBA2KR'),
  stSolMintAddress: new PublicKey('GohGUeqp5BenhzipjwXu1G46hQYPUVF1hqWxbQkfJ5Nm'),
};

export const clusterProgramAddresses: Record<SupportedClusters, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  testnet: TESTNET_PROGRAM_ADDRESSES,
};

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const SOL_API_HOST = 'https://sol-api-pub.lido.fi';
