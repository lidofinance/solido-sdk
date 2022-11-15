import { SolidoSDK } from '@/index';
import { getStakeApy } from '../api/stakeApy';
import { formatWithCommas } from '@/utils/formatters';

export async function getLidoStatistics(this: SolidoSDK) {
  const [apy, totalStaked, stakers, marketCap, totalRewards] = await Promise.all([
    getStakeApy(),
    this.getTotalStaked(),
    this.getStakersCount(),
    this.getMarketCap(),
    this.getTotalRewards(),
  ]);

  return {
    apy,
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
