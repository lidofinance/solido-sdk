import { Connection } from '@solana/web3.js';
import { lamportsToSol, SolidoSDK } from '@/index';

import reserveAccountInfo from '../data/reserve_account_info.json';
import { mockReserveAccountInfo } from '../mocks/accountInfo';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';
import BN from 'bn.js';

describe('getTotalStaked', () => {
  let sdk: SolidoSDK, connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test('total staked returned value', async () => {
    const solBalance = 2701000960;
    // @ts-expect-error We don't need full state mock
    jest.spyOn(sdk, 'getAccountInfo').mockReturnValueOnce({
      exchange_rate: {
        sol_balance: new BN(solBalance),
      },
    });
    mockReserveAccountInfo(connection);

    const totalStaked = await sdk.getTotalStaked();

    const totalStakedExpected = lamportsToSol(solBalance + reserveAccountInfo.lamports, 2);

    expect(totalStaked).toEqual(totalStakedExpected);
  });
});
