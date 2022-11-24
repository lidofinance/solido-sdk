import { SolidoSDK } from '@/index';
import { getStakeApy } from '@common/stakeApy';
import { formatWithCommas } from '@/utils/formatters';

export async function getLidoStatistics(this: SolidoSDK) {
  const [stakeApy, totalStaked, stakers, marketCap, totalRewards] = await Promise.all([
    getStakeApy(),
    this.getTotalStaked(),
    this.getStakersCount(),
    this.getMarketCap(),
    this.getTotalRewards(),
  ]);

  return {
    stakeApy: stakeApy.max,
    totalStaked: {
      value: totalStaked,
      formatted: formatWithCommas(totalStaked),
    },
    stakers: {
      ...stakers,
      formatted: formatWithCommas(stakers.value),
    },
    marketCap,
    totalRewards: {
      value: totalRewards,
      formatted: formatWithCommas(totalRewards),
    },
  };
}
