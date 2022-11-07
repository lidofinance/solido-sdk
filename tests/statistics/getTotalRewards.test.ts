import BN from 'bn.js';

import { SolidoSDK } from '@/index';
import { getConnection } from '../helpers';

describe('getTotalRewards', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(cluster, connection);
  });

  test('total rewards returned value', async () => {
    jest.spyOn(sdk, 'getAccountInfo').mockReturnValueOnce({
      accountInfo: { metrics: { st_sol_appreciation_sol_total: new BN('2701000960') } },
    });

    const totalRewards = await sdk.getTotalRewards(3);
    expect(totalRewards).toEqual(2.701);
  });
});
