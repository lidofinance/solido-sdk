/* eslint-disable max-classes-per-file */
import { deserialize } from 'borsh';

import { SolidoSDK } from '@/index';
import { AccountInfoV2 } from '@/types';

import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';
import Schema from './schema';

export async function getAccountInfo(this: SolidoSDK): Promise<AccountInfoV2> {
  const { solidoInstanceId } = this.programAddresses;

  const accountInfo = await this.connection.getAccountInfo(solidoInstanceId);

  if (accountInfo === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_ACCOUNT_INFO });
  }

  return deserialize(Schema.Lido, accountInfo.data) as AccountInfoV2;
}
