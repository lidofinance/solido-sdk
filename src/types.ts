import BN from 'bn.js';
import { PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { INSTRUCTION, TX_STAGE } from '@/constants';

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

export type AccountInfo = {
  validators: {
    entries: Validator[];
  };
  exchange_rate: {
    sol_balance: BN;
    st_sol_supply: BN;
  };
};
