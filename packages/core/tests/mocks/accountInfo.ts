import { Connection } from '@solana/web3.js';
import { when } from 'jest-when';

import ReserveAccountInfoDump from '../data/reserve_account_info.json';
import { reserveAccount } from '../data/snapshot';

export const mockReserveAccountInfo = (connection: Connection) => {
  const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
  when(spiedGetAccountInfo)
    .calledWith(reserveAccount)
    // @ts-ignore
    .mockReturnValueOnce(ReserveAccountInfoDump);
};
