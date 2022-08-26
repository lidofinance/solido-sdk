import BN from 'bn.js';
import { PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { INSTRUCTION, TX_STAGE, LidoVersion, INSTRUCTION_V2 } from '@/constants';

enum AccountType {
  Uninitialized,
  Lido,
  Validator,
  Maintainer,
}

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

export type WithdrawInstructionStruct = Pick<InstructionStruct, 'amount'> & {
  instruction: INSTRUCTION_V2;
  validator_index: number;
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

type ListHeader = {
  max_entries: BN;
  lido_version: LidoVersion;
  account_type: AccountType;
};

type SeedRange = {
  begin: BN;
  end: BN;
};

type ExchangeRate = {
  // The epoch in which when was last called `UpdateExchangeRate`
  computed_in_epoch: BN;
  // The amount of stSOL that existed at that time
  sol_balance: BN;
  // The amount of SOL we managed at that time, according to our internal
  // bookkeeping, so excluding the validation rewards paid at the start of
  // epoch `computed_in_epoch`.
  st_sol_supply: BN;
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

type RewardDistribution = {
  treasury_fee: number;
  developer_fee: number;
  st_sol_appreciation: number;
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

type FeeRecipients = {
  treasury_account: PublicKey;
  developer_account: PublicKey;
};

export type ValidatorV2 = {
  // Validator vote account address
  vote_account_address: PublicKey;
  // Seeds for active stake accounts
  stake_seeds: SeedRange;
  // Seeds for inactive stake accounts
  unstake_seeds: SeedRange;
  // Sum of the balances of the stake accounts and unstake accounts
  stake_accounts_balance: BN;
  // Sum of the balances of the unstake accounts
  unstake_accounts_balance: BN;
  // Effective stake balance is stake_accounts_balance - unstake_accounts_balance.
  // The result is stored on-chain to optimize compute budget
  effective_stake_balance: BN;
  // Controls if a validator is allowed to have new stake deposits
  active: boolean;
};

export type Validator = ValidatorV2;

export type ValidatorV1 = {
  entry: Omit<ValidatorV2, 'vote_account_address'>;
  pubkey: PublicKey;
};

export type AccountInfoV1 = {
  lido_version: LidoVersion;
  validators: {
    entries: ValidatorV1[];
  };
  exchange_rate: {
    sol_balance: BN;
    st_sol_supply: BN;
  };
  metrics: AccountInfoMetrics;
};

export type ValidatorsList = {
  header: ListHeader;
  entries: ValidatorV2[];
  account_type: AccountType;
};

export type AccountInfoV2 = {
  // Solido version
  lido_version: LidoVersion;

  // Account type, must be Lido
  account_type: AccountType;

  // Manager of the Lido program, able to execute administrative functions
  manager: PublicKey;

  // The SPL Token mint address for stSOL
  st_sol_mint: PublicKey;

  // Exchange rate to use when depositing.
  exchange_rate: ExchangeRate;

  // Bump seeds for signing messages on behalf of the authority
  sol_reserve_account_bump_seed: number;
  stake_authority_bump_seed: number;
  mint_authority_bump_seed: number;

  // How rewards are distributed.
  reward_distribution: RewardDistribution;

  // Accounts of the fee recipients
  fee_recipients: FeeRecipients;

  // Metrics for informational purposes
  metrics: AccountInfoMetrics;

  // Validator list account
  validators_list: PublicKey;
  // Maintainer list account
  maintainer_list: PublicKey;

  // Maximum validation commission percentage in [0, 100]
  max_commission_percentage: number;
};
