import { getSolPrice } from '@/api/solPrice';
import { SolidoSDK } from '@/index';

export async function getMarketCap(this: SolidoSDK, totalStaked?: number) {
  if (!totalStaked) {
    totalStaked = await this.getTotalStaked();
  }

  const price = await getSolPrice();

  return Math.ceil(price * totalStaked);
}
