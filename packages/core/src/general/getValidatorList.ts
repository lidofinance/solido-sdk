/* eslint-disable max-classes-per-file */
import { deserialize } from 'borsh';

import { SolidoSDK } from '@/index';
import { ValidatorsList } from '@/types';

import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';
import Schema from './schema';

export async function getValidatorList(this: SolidoSDK): Promise<ValidatorsList> {
  const { validatorList } = this.programAddresses;

  const validators = await this.connection.getAccountInfo(validatorList);

  if (validators === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_VALIDATORS });
  }

  return deserialize(Schema.ValidatorList, validators.data) as ValidatorsList;
}
