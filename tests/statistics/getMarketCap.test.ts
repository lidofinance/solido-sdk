import { Connection } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { getMarketCap } from '@/statistics/getMarketCap';

describe('getMarketCap', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(async () => {
    connection = new Connection('https://api.testnet.solana.com/');
    sdk = new SolidoSDK(cluster, connection);

    global.fetch = jest.fn();
  });

  test('market cap returned valued', async () => {
    jest.spyOn(sdk, 'getTotalStaked').mockReturnValueOnce(1000);
    jest.spyOn(global, 'fetch').mockReturnValueOnce(
      // @ts-ignore
      Promise.resolve({
        json: () => Promise.resolve({ batchData: { SOL: { priceUsd: 33 } } }),
      }),
    );

    const marketCap = await sdk.getMarketCap();

    expect(marketCap).toEqual(33000);
  });
});
