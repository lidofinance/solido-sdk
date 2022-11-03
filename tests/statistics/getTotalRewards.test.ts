import { Connection } from '@solana/web3.js';
import BN from 'bn.js';

import { SolidoSDK } from '@/index';

describe('getTotalRewards', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(async () => {
    connection = new Connection('https://api.testnet.solana.com/');
    sdk = new SolidoSDK(cluster, connection);
  });

  test('total rewards returned valued', async () => {
    jest.spyOn(sdk, 'getAccountInfo').mockReturnValueOnce({
      accountInfo: { metrics: { st_sol_appreciation_sol_total: new BN('2701000960') } },
    });

    const totalRewards = await sdk.getTotalRewards(3);
    expect(totalRewards).toEqual(2.701);
  });
});
