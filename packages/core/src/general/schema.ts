import { Schema } from 'borsh';

const arr32 = { array: { type: 'u8', len: 32 } };

export const ExchangeRate: Schema = {
  struct: {
    computed_in_epoch: 'u64',
    st_sol_supply: 'u64',
    sol_balance: 'u64',
  },
};

export const RewardDistribution: Schema = {
  struct: {
    treasury_fee: 'u32',
    developer_fee: 'u32',
    st_sol_appreciation: 'u32',
  },
};

export const FeeRecipients: Schema = {
  struct: {
    treasury_account: arr32,
    developer_account: arr32,
  },
};

export const LamportsHistogram: Schema = {
  struct: {
    counts1: 'u64',
    counts2: 'u64',
    counts3: 'u64',
    counts4: 'u64',
    counts5: 'u64',
    counts6: 'u64',
    counts7: 'u64',
    counts8: 'u64',
    counts9: 'u64',
    counts10: 'u64',
    counts11: 'u64',
    counts12: 'u64',
    total: 'u64',
  },
};

export const WithdrawMetric: Schema = {
  struct: {
    total_st_sol_amount: 'u64',
    total_sol_amount: 'u64',
    count: 'u64',
  },
};

export const Metrics: Schema = {
  struct: {
    fee_treasury_sol_total: 'u64',
    fee_validation_sol_total: 'u64',
    fee_developer_sol_total: 'u64',
    st_sol_appreciation_sol_total: 'u64',
    fee_treasury_st_sol_total: 'u64',
    fee_validation_st_sol_total: 'u64',
    fee_developer_st_sol_total: 'u64',
    deposit_amount: LamportsHistogram,
    withdraw_amount: WithdrawMetric,
  },
};

export const Lido: Schema = {
  struct: {
    account_type: 'u8',
    lido_version: 'u8',
    manager: arr32,
    st_sol_mint: arr32,
    exchange_rate: ExchangeRate,
    sol_reserve_account_bump_seed: 'u8',
    stake_authority_bump_seed: 'u8',
    mint_authority_bump_seed: 'u8',
    reward_distribution: RewardDistribution,
    fee_recipients: FeeRecipients,
    metrics: Metrics,
    validator_list: arr32,
    maintainer_list: arr32,
    max_commission_percentage: 'u8',
  },
};

export const ListHeader: Schema = {
  struct: {
    account_type: 'u8',
    lido_version: 'u8',
    max_entries: 'u32',
  },
};

export const SeedRange: Schema = {
  struct: {
    begin: 'u64',
    end: 'u64',
  },
};

export const ValidatorClass: Schema = {
  struct: {
    vote_account_address: arr32,
    stake_seeds: SeedRange,
    unstake_seeds: SeedRange,
    stake_accounts_balance: 'u64',
    unstake_accounts_balance: 'u64',
    effective_stake_balance: 'u64',
    active: 'u8',
  },
};

export const MaintainerClass: Schema = {
  struct: {
    pubkey: arr32,
  },
};

export const ValidatorList: Schema = {
  struct: {
    header: ListHeader,
    entries: { array: { type: ValidatorClass } },
  },
};

export const MaintainerList: Schema = {
  struct: {
    header: ListHeader,
    entries: { array: { type: MaintainerClass } },
  },
};

export default {
  MaintainerList,
  ValidatorList,
  Lido,
};
