import BN from 'bn.js';
import { PublicKey, Transaction, TransactionSignature, Cluster } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { INSTRUCTION, TX_STAGE, LidoVersion, INSTRUCTION_V2 } from '@/constants';

export enum AccountType {
  Uninitialized,
  Lido,
  Validator,
  Maintainer,
}

export type SupportedClusters = Exclude<Cluster, 'devnet'>;

export type SetTxStageProps = {
  txStage: TX_STAGE;
  transactionHash?: TransactionSignature;
  stSolAccountAddress?: PublicKey;
  stakeAccounts?: PublicKey[];
  remainingCount?: number;
  remainingAmount?: number;
  unstakeAmount?: number;
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
  reserveAccount: PublicKey;
  mintAuthority: PublicKey;
  stakeAuthority: PublicKey;
  validatorList: PublicKey;
}

export type TransactionProps = {
  /**
   * The amount of (st)SOL in lamports which need to (un)stake
   */
  amount: number;
  /**
   * address of user who is trying to make the transaction (`wallet.publicKey`)
   */
  payerAddress: PublicKey;
};

export type StakeAdditionalProps = {
  // Allow the owner account to be a PDA (Program Derived Address)
  // see getAssociatedTokenAddress in solana/web3.js
  allowOwnerOffCurve?: boolean;
};

export type StakeProps = Omit<SignAndConfirmTransactionProps, 'transaction'> &
  Pick<TransactionProps, 'amount'> &
  StakeAdditionalProps;

export type UnstakeProps = StakeProps & {
  allowMultipleTransactions?: boolean;
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

export type WithdrawInstructionStruct = Pick<InstructionStruct, 'amount'> & {
  instruction: INSTRUCTION_V2;
  validator_index: number;
};

export type SolApiPriceResponse = {
  solana: { usd: number };
};

type ListHeader = {
  max_entries: number;
  lido_version: LidoVersion;
  account_type: AccountType;
};

type SeedRange = {
  begin: bigint;
  end: bigint;
};

type ExchangeRate = {
  // The epoch in which when was last called `UpdateExchangeRate`
  computed_in_epoch: bigint;
  // The amount of stSOL that existed at that time
  sol_balance: bigint;
  // The amount of SOL we managed at that time, according to our internal
  // bookkeeping, so excluding the validation rewards paid at the start of
  // epoch `computed_in_epoch`.
  st_sol_supply: bigint;
};

type LamportsHistogram = {
  counts1: bigint;
  counts2: bigint;
  counts3: bigint;
  counts4: bigint;
  counts5: bigint;
  counts6: bigint;
  counts7: bigint;
  counts8: bigint;
  counts9: bigint;
  counts10: bigint;
  counts11: bigint;
  counts12: bigint;
  total: bigint;
};

type WithdrawMetric = {
  total_st_sol_amount: bigint;
  total_sol_amount: bigint;
  count: bigint;
};

type RewardDistribution = {
  treasury_fee: number;
  developer_fee: number;
  st_sol_appreciation: number;
};

export type AccountInfoMetrics = {
  // Fees paid to the treasury, in total since we started tracking, before conversion to stSOL
  fee_treasury_sol_total: bigint;
  // Fees paid to validators, in total since we started tracking, before conversion to stSOL
  fee_validation_sol_total: bigint;
  // Fees paid to the developer, in total since we started tracking, before conversion to stSOL
  fee_developer_sol_total: bigint;
  // Total rewards that benefited stSOL holders, in total, since we started tracking
  st_sol_appreciation_sol_total: bigint;
  // Fees paid to the treasury, in total since we started tracking
  fee_treasury_st_sol_total: bigint;
  // Fees paid to validators, in total since we started tracking
  fee_validation_st_sol_total: bigint;
  // Fees paid to the developer, in total since we started tracking
  fee_developer_st_sol_total: bigint;
  // Histogram of deposits, including the total amount deposited since we started tracking
  deposit_amount: LamportsHistogram;
  // Total amount withdrawn since the beginning
  withdraw_amount: WithdrawMetric;
};

type UintArray32 = Array<number>;

type FeeRecipients = {
  treasury_account: UintArray32;
  developer_account: UintArray32;
};

export type ValidatorV2 = {
  // Validator vote account address
  vote_account_address: UintArray32;
  // Seeds for active stake accounts
  stake_seeds: SeedRange;
  // Seeds for inactive stake accounts
  unstake_seeds: SeedRange;
  // Sum of the balances of the stake accounts and unstake accounts
  stake_accounts_balance: bigint;
  // Sum of the balances of the unstake accounts
  unstake_accounts_balance: bigint;
  // Effective stake balance is stake_accounts_balance - unstake_accounts_balance.
  // The result is stored on-chain to optimize compute budget
  effective_stake_balance: bigint;
  // Controls if a validator is allowed to have new stake deposits
  active: boolean | 0 | 1;
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
  manager: UintArray32;

  // The SPL Token mint address for stSOL
  st_sol_mint: UintArray32;

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
  validator_list: UintArray32;
  // Maintainer list account
  maintainer_list: UintArray32;

  // Maximum validation commission percentage in [0, 100]
  max_commission_percentage: number;
};

export enum StakeAccountState {
  activating,
  active,
  deactivating,
  inactive,
}

export type StakeAccountDelegation = {
  activationEpoch: string;
  deactivationEpoch: string;
};

export type StakeAccount = {
  pubkey: PublicKey;
  lamports: number;
  isReady: boolean;
};

export type WithdrawProps = {
  accounts: Omit<StakeAccount, 'isReady'>[];
  payerAddress: PublicKey;
};
