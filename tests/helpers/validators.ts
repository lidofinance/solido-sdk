import { Connection } from '@solana/web3.js';
import { when } from 'jest-when';

import { validatorList } from '../data/snapshot';
import validatorListDump from '../data/validator_list.json';

// Mock Validator List response
export const mockValidatorList = (connection: Connection) => {
  const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
  when(spiedGetAccountInfo)
    .calledWith(validatorList)
    // @ts-ignore
    .mockReturnValueOnce({ data: Buffer.from(validatorListDump.data) });
};
