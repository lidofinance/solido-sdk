import { SolidoSDK } from '@/index';
import { getStakeApy } from '@/api/stakeApy';
import { formatWithCommas } from '@/utils/formatters';

export async function getLidoStatistics(this: SolidoSDK) {
  const [apy, totalStaked, stakers, marketCap] = await Promise.all([
    getStakeApy(),
    this.getTotalStaked(),
    this.getStakersCount(),
    this.getMarketCap(),
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
  };
}
