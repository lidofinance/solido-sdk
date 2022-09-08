import BN from 'bn.js';
import { PublicKey, Transaction, TransactionSignature, Cluster } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { INSTRUCTION, TX_STAGE } from '@/constants';

export type SupportedClusters = Exclude<Cluster, 'devnet'>;

type SetTxStageProps = {
  txStage: TX_STAGE;
  transactionHash?: TransactionSignature;
  deactivatingSolAccountAddress?: PublicKey;
  stSolAccountAddress?: PublicKey;
};

export type SignAndConfirmTransactionProps = {
  /**
   * Ready @solana/web3.js Transaction, got from get(Un)StakeTransaction
   */
  transaction: Transaction;
  /**
   * Wallet instance from @solana/wallet-adapter-base
   */
  wallet: SignerWalletAdapter;
  /**
   * Optional callback for getting information about transaction stage
   */
  setTxStage?: (props: SetTxStageProps) => void;
};

export interface ProgramAddresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}

export type TransactionProps = {
  /**
   * The amount of (st)SOL which need to (un)stake
   */
  amount: number;
  /**
   * address of user who is trying to make the transaction (`wallet.publicKey`)
   */
  payerAddress: PublicKey;
};

export type StakeProps = Omit<SignAndConfirmTransactionProps, 'transaction'> &
  Pick<TransactionProps, 'amount'>;

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

export type ApiError = {
  code: string;
  msg: string;
};

export type BatchError = Record<string, ApiError>;

export type SolApiResponse<K extends string, T extends Record<string, any>> = {
  batchData: {
    [key in K]: T;
  };
  batchError: BatchError;
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

type LamportsHistogram = {
  counts1: BN;
  counts2: BN;
  counts3: BN;
  counts4: BN;
  counts5: BN;
  counts6: BN;
  counts7: BN;
  counts8: BN;
  counts9: BN;
  counts10: BN;
  counts11: BN;
  counts12: BN;
  total: BN;
};

type WithdrawMetric = {
  total_st_sol_amount: BN;
  total_sol_amount: BN;
  count: BN;
};

export type AccountInfoMetrics = {
  // Fees paid to the treasury, in total since we started tracking, before conversion to stSOL
  fee_treasury_sol_total: BN;
  // Fees paid to validators, in total since we started tracking, before conversion to stSOL
  fee_validation_sol_total: BN;
  // Fees paid to the developer, in total since we started tracking, before conversion to stSOL
  fee_developer_sol_total: BN;
  // Total rewards that benefited stSOL holders, in total, since we started tracking
  st_sol_appreciation_sol_total: BN;
  // Fees paid to the treasury, in total since we started tracking
  fee_treasury_st_sol_total: BN;
  // Fees paid to validators, in total since we started tracking
  fee_validation_st_sol_total: BN;
  // Fees paid to the developer, in total since we started tracking
  fee_developer_st_sol_total: BN;
  // Histogram of deposits, including the total amount deposited since we started tracking
  deposit_amount: LamportsHistogram;
  // Total amount withdrawn since the beginning
  withdraw_amount: WithdrawMetric;
};

export type AccountInfo = {
  validators: {
    entries: Validator[];
  };
  exchange_rate: {
    sol_balance: BN;
    st_sol_supply: BN;
  };
  metrics: AccountInfoMetrics;
};
