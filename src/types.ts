import BN from 'bn.js';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { TX_STAGE } from '@/constants';

export class Lamports {
  lamports: BN;

  constructor(lamports: number | string | BN) {
    this.lamports = new BN(lamports);
  }
}

export type SignAndConfirmTransactionProps = {
  transaction: Transaction;
  wallet: SignerWalletAdapter;
  setTxStage?: (txStage: TX_STAGE) => void;
};

export interface ProgramAddresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}

export type InstructionStruct = {
  instruction: number;
  amount: BN;
};

type ApiError = {
  code: string;
  msg: string;
};

export type SolApiPriceResponse<K extends string> = SolApiResponse<K, {
  symbol: string;
  symbolNotFormatted: string;
  priceUsd: number;
}>

export type SolApiResponse<K extends string, T extends Record<string, any>> = {
  batchData: {
    [key in K]: T;
  };
  batchError: Record<string, ApiError>;
  error: ApiError & {
    detail: string;
  };
}

export type AccountInfo = {
  validators: {
    entries: [{
      entry: {
        stake_accounts_balance: BN;
      },
      pubkey: BN,
    }];
  };
  exchange_rate: {
    sol_balance: BN;
    st_sol_supply: BN;
  };
}
