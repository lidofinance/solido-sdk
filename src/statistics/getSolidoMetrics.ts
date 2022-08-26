import { SolidoSDK } from '@/index';
import { AccountInfoMetrics } from '@/types';

export async function getSolidoMetrics(this: SolidoSDK): Promise<AccountInfoMetrics> {
  const { metrics } = await this.getAccountInfo();

  return metrics;
}
