import { formatWithCommas, SolidoSDK } from '@/index';

import { getStakeApyMock } from '../mocks/getStakeApy';
import { getConnection } from '../helpers';

describe('getLidoStatistics', () => {
  const cluster = 'testnet';
  const totalStaked = 1000;
  const stakersCount = 30;
  const marketCap = 30000;
  const totalRewards = 25;
  const apy = 7;

  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(cluster, connection);

    global.fetch = jest.fn();
  });

  test('all returned values are correct', async () => {
    getStakeApyMock(apy);
    jest.spyOn(sdk, 'getTotalStaked').mockReturnValueOnce(totalStaked);
    jest.spyOn(sdk, 'getStakersCount').mockReturnValueOnce({ value: stakersCount });
    jest.spyOn(sdk, 'getMarketCap').mockReturnValueOnce(marketCap);
    jest.spyOn(sdk, 'getTotalRewards').mockReturnValueOnce(totalRewards);

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
