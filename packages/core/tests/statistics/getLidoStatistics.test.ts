import { Connection } from '@solana/web3.js';
import { formatWithCommas, SolidoSDK } from '@/index';

import { getStakeApyMock } from '../mocks/getStakeApy';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getLidoStatistics', () => {
  const totalStaked = 1000;
  const stakersCount = 30;
  const marketCap = 30000;
  const totalRewards = 25;
  const apy = 7;

  let sdk: SolidoSDK, connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    global.fetch = jest.fn();
  });

  test('all returned values are correct', async () => {
    getStakeApyMock(apy);
    jest.spyOn(sdk, 'getTotalStaked').mockReturnValueOnce(Promise.resolve(totalStaked));
    // @ts-expect-error all fields not important
    jest.spyOn(sdk, 'getStakersCount').mockReturnValueOnce(Promise.resolve({ value: stakersCount }));
    jest.spyOn(sdk, 'getMarketCap').mockReturnValueOnce(Promise.resolve(marketCap));
    jest.spyOn(sdk, 'getTotalRewards').mockReturnValueOnce(Promise.resolve(totalRewards));

    const lidoStatistics = await sdk.getLidoStatistics();

    expect(lidoStatistics.apy).toEqual(apy.toFixed(2));
    expect(lidoStatistics.totalStaked.value).toEqual(totalStaked);
    expect(lidoStatistics.totalStaked.formatted).toEqual(formatWithCommas(totalStaked));
    expect(lidoStatistics.stakers.value).toEqual(stakersCount);
    expect(lidoStatistics.stakers.formatted).toEqual(formatWithCommas(stakersCount));
    expect(lidoStatistics.marketCap).toEqual(marketCap);
    expect(lidoStatistics.totalRewards.value).toEqual(totalRewards);
    expect(lidoStatistics.totalRewards.formatted).toEqual(formatWithCommas(totalRewards));
  });
});
