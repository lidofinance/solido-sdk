import { SolidoSDK } from '@/index';

export async function isUnStakeAvailable(this: SolidoSDK) {
  const { validators } = await this.getAccountInfo();

  const areValidatorsEmpty = validators.length === 0;
  const areExistSomeActiveValidators = validators.some(({ active }) => active);
  const isExistOneValidatorWithPositiveBalance = validators.some(
    ({ effective_stake_balance }) => effective_stake_balance.toNumber() !== 0,
  );

  return !areValidatorsEmpty && areExistSomeActiveValidators && isExistOneValidatorWithPositiveBalance;
}
