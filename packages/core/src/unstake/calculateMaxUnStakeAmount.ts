import { MAX_UNSTAKE_COUNT } from '@/constants';
import { selectValidatorForUnstake, updateValidators } from '@/general';
import { SolidoSDK } from '@/index';

export async function calculateMaxUnStakeAmount(this: SolidoSDK) {
  const isUnStakeAvailable = await this.isUnStakeAvailable();
  const exchangeRate = await this.getExchangeRate();

  if (!isUnStakeAvailable) {
    return 0;
  }

  let validators = await this.getValidatorsWithBalance();
  let txAmount = 0;
  for (let i = 0; i < MAX_UNSTAKE_COUNT; i += 1) {
    const { maxUnstakeAmount: unstakeAmount, validator } = selectValidatorForUnstake({ validators });
    validators = updateValidators({
      validators,
      validatorIndex: validator.index,
      unstakeAmount,
    });
    txAmount += unstakeAmount;
  }
  return Math.floor(txAmount * exchangeRate.SOLToStSOL);
}
