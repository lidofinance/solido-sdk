import { SolidoSDK } from '@/index';
import { formatWithCommas } from '@/utils/formatters';
import { STATIC_DEFAULT_APY } from '@common/stakeApy';

export async function getLidoStatistics(this: SolidoSDK) {
  const [totalStaked, stakers, marketCap, totalRewards] = await Promise.all([
    this.getTotalStaked(),
    this.getStakersCount(),
    this.getMarketCap(),
    this.getTotalRewards(),
  ]);

  return {
    apy: STATIC_DEFAULT_APY,
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
