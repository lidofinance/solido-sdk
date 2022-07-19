import { SolidoSDK } from '@/index';
import { getStakeApy } from '@/api/stakeApy';
import { formatWithCommas } from '@/utils/formatters';

export async function getLidoStatistics(this: SolidoSDK) {
  const apy = getStakeApy();
  const totalStaked = await this.getTotalStaked();
  const stakers = await this.getStakersCount();
  const marketCap = await this.getMarketCap(totalStaked);

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
  }
}
