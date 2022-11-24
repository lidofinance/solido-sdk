import { deserializeUnchecked } from 'borsh';
import { PublicKey } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { AccountInfoV1, AccountInfoV2, ValidatorsList, Validator } from '@/types';
import { ERROR_CODE, LidoVersion } from '@/constants';
import { ErrorWrapper } from '@/utils/errorWrapper';

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

export class ValidatorClass {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class PubKeyAndEntry {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class PubKeyAndEntryMaintainer {
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

class Validators {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class Maintainers {
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

export class AccountList {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

class ListHeader {
  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

const accountInfoV1Scheme = new Map([
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
    SeedRange,
    {
      kind: 'struct',
      fields: [
        ['begin', 'u64'],
        ['end', 'u64'],
      ],
    },
  ],
  [
    ValidatorClass,
    {
      kind: 'struct',
      fields: [
        ['fee_credit', 'u64'],
        ['fee_address', [32]],
        ['stake_seeds', SeedRange],
        ['unstake_seeds', SeedRange],
        ['stake_accounts_balance', 'u64'],
        ['unstake_accounts_balance', 'u64'],
        ['active', 'u8'],
      ],
    },
  ],
  [
    PubKeyAndEntry,
    {
      kind: 'struct',
      fields: [
        ['pubkey', [32]],
        ['entry', ValidatorClass],
      ],
    },
  ],
  [
    PubKeyAndEntryMaintainer,
    {
      kind: 'struct',
      fields: [
        ['pubkey', [32]],
        ['entry', [0]],
      ],
    },
  ],
  [
    RewardDistribution,
    {
      kind: 'struct',
      fields: [
        ['treasury_fee', 'u32'],
        ['validation_fee', 'u32'],
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
    Validators,
    {
      kind: 'struct',
      fields: [
        ['entries', [PubKeyAndEntry]],
        ['maximum_entries', 'u32'],
      ],
    },
  ],
  [
    Maintainers,
    {
      kind: 'struct',
      fields: [
        ['entries', [PubKeyAndEntryMaintainer]],
        ['maximum_entries', 'u32'],
      ],
    },
  ],
  [
    Lido,
    {
      kind: 'struct',
      fields: [
        ['lido_version', 'u8'],

        ['manager', [32]],

        ['st_sol_mint', [32]],

        ['exchange_rate', ExchangeRate],

        ['sol_reserve_authority_bump_seed', 'u8'],
        ['stake_authority_bump_seed', 'u8'],
        ['mint_authority_bump_seed', 'u8'],
        ['rewards_withdraw_authority_bump_seed', 'u8'],

        ['reward_distribution', RewardDistribution],

        ['fee_recipients', FeeRecipients],

        ['metrics', Metrics],

        ['validators', Validators],

        ['maintainers', Maintainers],
      ],
    },
  ],
]);

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

export const validatorsSchema = new Map([
  [
    ListHeader,
    {
      kind: 'struct',
      fields: [
        ['account_type', 'u8'],
        ['lido_version', 'u8'],
        ['max_entries', 'u32'],
      ],
    },
  ],
  [
    SeedRange,
    {
      kind: 'struct',
      fields: [
        ['begin', 'u64'],
        ['end', 'u64'],
      ],
    },
  ],
  [
    ValidatorClass,
    {
      kind: 'struct',
      fields: [
        ['vote_account_address', [32]],
        ['stake_seeds', SeedRange],
        ['unstake_seeds', SeedRange],
        ['stake_accounts_balance', 'u64'],
        ['unstake_accounts_balance', 'u64'],
        ['effective_stake_balance', 'u64'],
        ['active', 'u8'],
      ],
    },
  ],
  [
    AccountList,
    {
      kind: 'struct',
      fields: [
        ['header', ListHeader],
        ['entries', [ValidatorClass]],
      ],
    },
  ],
]);

type AccountInfoMap = {
  [LidoVersion.v1]: AccountInfoV1;
  [LidoVersion.v2]: AccountInfoV2;
};

type AccountInfo<T extends keyof AccountInfoMap> = keyof AccountInfoMap extends T ? never : AccountInfoMap[T];

export type getAccountInfoResponse = {
  [K in keyof AccountInfoMap]: { lidoVersion: K; accountInfo: AccountInfo<K> } & { validators: Validator[] };
}[keyof AccountInfoMap];

export async function getAccountInfo(this: SolidoSDK): Promise<getAccountInfoResponse> {
  // save answer only for clients
  if (this.solidoAccountInfo && typeof window !== 'undefined') {
    return this.solidoAccountInfo;
  }

  const { solidoInstanceId } = this.programAddresses;

  const accountInfo = await this.connection.getAccountInfo(solidoInstanceId);

  if (accountInfo === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_ACCOUNT_INFO });
  }

  try {
    const deserializedAccountInfo = deserializeUnchecked(
      accountInfoV1Scheme,
      Lido,
      accountInfo.data,
    ) as AccountInfoV1;

    const validators = deserializedAccountInfo.validators.entries.map(({ entry, pubkey }) => ({
      vote_account_address: pubkey,
      ...entry,
      // effective_stake_balance doesn't exist in first version of protocol as a property
      // https://github.com/lidofinance/solido/blob/4a5fe34b2ecf937344a9dfcd389ffe120e587cfd/program/src/state.rs#L705-L708
      effective_stake_balance: entry.stake_accounts_balance.sub(entry.unstake_accounts_balance),
    }));

    this.lidoVersion = LidoVersion.v1;
    this.solidoAccountInfo = {
      lidoVersion: LidoVersion.v1,
      accountInfo: deserializedAccountInfo,
      validators,
    };
  } catch {
    const deserializedAccountInfo = deserializeUnchecked(
      accountInfoV2Scheme,
      Lido,
      accountInfo.data,
    ) as AccountInfoV2;

    const validatorsList = new PublicKey(deserializedAccountInfo.validator_list);
    const validators = await this.connection.getAccountInfo(validatorsList);

    if (validators === null) {
      throw new ErrorWrapper({ code: ERROR_CODE.NO_VALIDATORS });
    }

    const deserializedValidators = deserializeUnchecked(
      validatorsSchema,
      AccountList,
      validators.data,
    ) as ValidatorsList;

    this.lidoVersion = LidoVersion.v2;
    this.solidoAccountInfo = {
      lidoVersion: LidoVersion.v2,
      accountInfo: deserializedAccountInfo,
      validators: deserializedValidators.entries,
    };
  }

  setTimeout(() => {
    // clear cache after 7 seconds, in order to avoid outdated data
    this.solidoAccountInfo = undefined;
  }, 7 * 1000);

  return this.solidoAccountInfo;
}