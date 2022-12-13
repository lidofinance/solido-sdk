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
  reserveAccount: new PublicKey('3Kwv3pEAuoe4WevPB4rgMBTZndGDb53XT7qwQKnvHPfX'),
  mintAuthority: new PublicKey('8kRRsKezwXS21beVDcAoTmih1XbyFnEAMXXiGXz6J3Jz'),
  stakeAuthority: new PublicKey('W1ZQRwUfSkDKy2oefRBUWph82Vr2zg9txWMA8RQazN5'),
  validatorList: new PublicKey('GL9kqRNUTUosW3RsDoXHCuXUZn73SgQQmBvtp1ng2co4'),
});

export const TESTNET_PROGRAM_ADDRESSES: ProgramAddresses = Object.freeze({
  solidoProgramId: new PublicKey('6RRggYnFe2EcD543QXrE3Wxp1Kgcq8qctwRrNnvjoYsL'),
  solidoInstanceId: new PublicKey('Hcqw2G2FkBhBiDZz3PXFBUKuMQiKMJmXvcfqRaXkyNXF'),
  stSolMintAddress: new PublicKey('Bz2UPiXJmCQYT8XQHaPPXG3fywNp2TENav5dcJdX9q21'),
  reserveAccount: new PublicKey('9zu4upPBBDqbk6upLT4YycwUR9UoXWhs5NfMHeUdTDCv'),
  mintAuthority: new PublicKey('83xtC3WGv1kJXgGo2HFZv7dJSBQshee6HqUvRe9mnrqz'),
  stakeAuthority: new PublicKey('GnLPhRU8vP8kWkExA5s8pmzfr8tZgbyGNPNr7Qxef3Jx'),
  validatorList: new PublicKey('7mLYFE8uN37j4JjyGpqh8N8e5EDirLE86sSvNLSt5pPM'),
});

export const clusterProgramAddresses: Record<SupportedClusters, ProgramAddresses> = {
  'mainnet-beta': MAINNET_PROGRAM_ADDRESSES,
  testnet: TESTNET_PROGRAM_ADDRESSES,
};

export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const VALIDATOR_LIST = new PublicKey('7mLYFE8uN37j4JjyGpqh8N8e5EDirLE86sSvNLSt5pPM');
