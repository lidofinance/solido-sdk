import { deserializeUnchecked } from 'borsh';

import { SolidoSDK } from '@/index';
import { AccountInfoV2 } from '@/types';

import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

export class Lido {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class SeedRange {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class RewardDistribution {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class FeeRecipients {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class ExchangeRate {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class Metrics {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class LamportsHistogram {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class WithdrawMetric {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

const accountInfoV2Scheme = new Map([
  [
    ExchangeRate,
    {
      kind: 'struct',
      fields: [
        ['computed_in_epoch', 'u64'],
        ['st_sol_supply', 'u64'],
        ['sol_balance', 'u64'],
      ],
    },
  ],
  [
    LamportsHistogram,
    {
      kind: 'struct',
      fields: [
        ['counts1', 'u64'],
        ['counts2', 'u64'],
        ['counts3', 'u64'],
        ['counts4', 'u64'],
        ['counts5', 'u64'],
        ['counts6', 'u64'],
        ['counts7', 'u64'],
        ['counts8', 'u64'],
        ['counts9', 'u64'],
        ['counts10', 'u64'],
        ['counts11', 'u64'],
        ['counts12', 'u64'],
        ['total', 'u64'],
      ],
    },
  ],
  [
    WithdrawMetric,
    {
      kind: 'struct',
      fields: [
        ['total_st_sol_amount', 'u64'],
        ['total_sol_amount', 'u64'],
        ['count', 'u64'],
      ],
    },
  ],
  [
    Metrics,
    {
      kind: 'struct',
      fields: [
        ['fee_treasury_sol_total', 'u64'],
        ['fee_validation_sol_total', 'u64'],
        ['fee_developer_sol_total', 'u64'],
        ['st_sol_appreciation_sol_total', 'u64'],
        ['fee_treasury_st_sol_total', 'u64'],
        ['fee_validation_st_sol_total', 'u64'],
        ['fee_developer_st_sol_total', 'u64'],
        ['deposit_amount', LamportsHistogram],
        ['withdraw_amount', WithdrawMetric],
      ],
    },
  ],
  [
    RewardDistribution,
    {
      kind: 'struct',
      fields: [
        ['treasury_fee', 'u32'],
        ['developer_fee', 'u32'],
        ['st_sol_appreciation', 'u32'],
      ],
    },
  ],
  [
    FeeRecipients,
    {
      kind: 'struct',
      fields: [
        ['treasury_account', [32]],
        ['developer_account', [32]],
      ],
    },
  ],
  [
    Lido,
    {
      kind: 'struct',
      fields: [
        ['account_type', 'u8'],

        ['lido_version', 'u8'],

        ['manager', [32]],

        ['st_sol_mint', [32]],

        ['exchange_rate', ExchangeRate],

        ['sol_reserve_account_bump_seed', 'u8'],
        ['stake_authority_bump_seed', 'u8'],
        ['mint_authority_bump_seed', 'u8'],

        ['reward_distribution', RewardDistribution],

        ['fee_recipients', FeeRecipients],

        ['metrics', Metrics],

        ['validator_list', [32]],

        ['maintainer_list', [32]],

        ['max_commission_percentage', 'u8'],
      ],
    },
  ],
]);

export async function getAccountInfo(this: SolidoSDK): Promise<AccountInfoV2> {
  if (this.solidoAccountInfo) {
    return this.solidoAccountInfo;
  }

  const { solidoInstanceId } = this.programAddresses;

  const accountInfo = await this.connection.getAccountInfo(solidoInstanceId);

  if (accountInfo === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_ACCOUNT_INFO });
  }

  this.solidoAccountInfo = deserializeUnchecked(accountInfoV2Scheme, Lido, accountInfo.data) as AccountInfoV2;

  setTimeout(() => {
    // clear cache after 7 seconds, in order to avoid outdated data
    this.solidoAccountInfo = undefined;
  }, 7 * 1000);

  return this.solidoAccountInfo;
}
