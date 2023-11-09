import { SolidoSDK } from '@/index';

export async function isUnStakeAvailable(this: SolidoSDK) {
  const validators = await this.getValidatorList();

  const areValidatorsEmpty = validators.length === 0;
  const areExistSomeActiveValidators = validators.some(({ active }) => active);
  const isExistOneValidatorWithPositiveBalance = validators.some(
    (v) => !(v.effective_stake_balance === BigInt(0)),
  );

  return !areValidatorsEmpty && areExistSomeActiveValidators && isExistOneValidatorWithPositiveBalance;
}
