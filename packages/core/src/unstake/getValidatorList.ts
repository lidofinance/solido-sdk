import { deserializeUnchecked } from 'borsh';

import { SolidoSDK } from '@/index';
import { ValidatorsList, ValidatorV2 } from '@/types';

import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';
import { SeedRange } from './getAccountInfo';

export class ValidatorClass {
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

export async function getValidatorList(this: SolidoSDK): Promise<ValidatorV2[]> {
  const { validatorList } = this.programAddresses;

  const validators = await this.connection.getAccountInfo(validatorList);

  if (validators === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_VALIDATORS });
  }

  const { entries } = deserializeUnchecked(validatorsSchema, AccountList, validators.data) as ValidatorsList;

  return entries;
}
