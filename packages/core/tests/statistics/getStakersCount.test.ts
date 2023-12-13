import { Connection } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getStakersCount', () => {
  let sdk: SolidoSDK;
  let connection: Connection;

  beforeAll(async () => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test('stakersCount accounts quantity', async () => {
    jest
      .spyOn(connection, 'getProgramAccounts')
      // @ts-expect-error not important result
      .mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // accountsTotal
      // @ts-expect-error not important result
      .mockReturnValueOnce([1, 2, 3, 4, 5]); // accountsEmpty

    const stakersCount = await sdk.getStakersCount();

    expect(stakersCount.accountsTotal).toEqual(10);
    expect(stakersCount.accountsEmpty).toEqual(5);
    expect(stakersCount.value).toEqual(5); // accountsTotal - accountsEmpty
  });
});
