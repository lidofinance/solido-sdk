import { getSolPrice } from '@/api/solPrice';
import { SolidoSDK } from '@/index';

export async function getMarketCap(this: SolidoSDK, totalStakedInSol?: number) {
  let totalStaked = totalStakedInSol;
  if (!totalStaked) {
    totalStaked = await this.getTotalStaked();
  }

  const price = await getSolPrice();

  return Math.ceil(price * totalStaked);
}
