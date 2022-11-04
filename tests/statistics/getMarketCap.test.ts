import { Connection } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { getMarketCap } from '@/statistics/getMarketCap';
import { getSolPriceMock } from '../mocks/getSolPrice';

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
    getSolPriceMock(33);

    const marketCap = await sdk.getMarketCap();

    expect(marketCap).toEqual(33000);
  });
});
