import { Connection } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

import { getSolPriceMock } from '../mocks/getSolPrice';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getMarketCap', () => {
  let sdk: SolidoSDK;
  let connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    global.fetch = jest.fn();
  });

  test('market cap returned valued', async () => {
    jest.spyOn(sdk, 'getTotalStaked').mockReturnValueOnce(Promise.resolve(1000));
    getSolPriceMock(33);

    const marketCap = await sdk.getMarketCap();

    expect(marketCap).toEqual(33000);
  });
});
