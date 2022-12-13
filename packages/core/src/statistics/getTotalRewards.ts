import { SolidoSDK } from '@/index';
import { lamportsToSol } from '@/utils/formatters';

export async function getTotalRewards(this: SolidoSDK, precision = 2): Promise<number> {
  const { metrics } = await this.getAccountInfo();

  const totalRewards = metrics.st_sol_appreciation_sol_total.toNumber();

  return lamportsToSol(totalRewards, precision);
}
