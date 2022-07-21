import BN from 'bn.js';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { INSTRUCTION, TX_STAGE } from '@/constants';

export type SignAndConfirmTransactionProps = {
  /**
   * Ready @solana/web3.js Transaction, got from get(Un)StakeTransaction
   */
  transaction: Transaction;
  /**
   * Wallet instance
   */
  wallet: SignerWalletAdapter;
  /**
   * Optional Callback for getting information about transaction Stage
   */
  setTxStage?: (txStage: TX_STAGE) => void;
};

export interface ProgramAddresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}

export type TransactionProps = {
  /**
   * SOL(stSOL) amount to (un)stake transaction
   */
  amount: number;
  /**
   * address of user who is trying to make transaction
   */
  payerAddress: PublicKey;
};

export type InstructionStruct = {
  /**
   * instruction code (see INSTRUCTION enum)
   */
  instruction: INSTRUCTION;
  /**
   * amount of tokens for above instruction
   */
  amount: BN;
};

type ApiError = {
  code: string;
  msg: string;
};

export type SolApiResponse<K extends string, T extends Record<string, any>> = {
  batchData: {
    [key in K]: T;
  };
  batchError: Record<string, ApiError>;
  error: ApiError & {
    detail: string;
  };
};

export type SolApiPriceResponse<K extends string> = SolApiResponse<
  K,
  {
    symbol: string;
    symbolNotFormatted: string;
    priceUsd: number;
  }
>;

export type Validator = {
  entry: {
    stake_accounts_balance: BN;
    stake_seeds: {
      begin: BN;
      end: BN;
    };
  };
  pubkey: BN;
};

export type AccountInfo = {
  validators: {
    entries: Validator[];
  };
  exchange_rate: {
    sol_balance: BN;
    st_sol_supply: BN;
  };
};
