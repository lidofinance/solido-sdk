import { SolidoSDK } from '@/index';
import { ValidatorV2 } from '@/types';

export async function getValidators(this: SolidoSDK): Promise<ValidatorV2[]> {
  const { entries } = await this.getValidatorsInfo();

  return entries;
}
