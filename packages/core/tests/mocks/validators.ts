import { Connection } from '@solana/web3.js';
import { when } from 'jest-when';

import { VALIDATOR_LIST } from '../constants';

import validatorListFullDump from '../data/validator_list_full.json';
import validatorListInActiveDump from '../data/validator_list_inactive.json';
import validatorListZeroBalanceDump from '../data/validator_list_zero_balance.json';
import validatorListEmptyDump from '../data/validator_list_empty.json';

type ValidatorsDumpType = 'full' | 'inActive' | 'zeroBalance' | 'empty';

const validatorsDumpMap: Record<ValidatorsDumpType, any> = {
  full: validatorListFullDump,
  inActive: validatorListInActiveDump,
  zeroBalance: validatorListZeroBalanceDump,
  empty: validatorListEmptyDump,
};

// Mock Validator List response
export const mockValidatorList = (connection: Connection, dumpType: ValidatorsDumpType = 'full') => {
  const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
  when(spiedGetAccountInfo)
    .calledWith(VALIDATOR_LIST)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockReturnValueOnce({ data: Buffer.from(validatorsDumpMap[dumpType].data) });
};
