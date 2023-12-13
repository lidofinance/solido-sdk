import { SolidoSDK } from '@/index';
import { Validator, ValidatorV2 } from '@/types';

export async function getValidatorList(this: SolidoSDK): Promise<ValidatorV2[]> {
  const { entries } = await this.getValidatorsData();
  return entries;
}

export const getHeaviestValidator = <T extends Pick<Validator, 'effective_stake_balance'>>(
  validatorEntries: T[],
): T =>
  validatorEntries.reduce((validatorB, validatorA) =>
    validatorB.effective_stake_balance > validatorA.effective_stake_balance ? validatorB : validatorA,
  );

export const getValidatorIndex = <T extends Pick<Validator, 'vote_account_address'>>(
  validatorEntries: T[],
  validator: T,
) =>
  validatorEntries.findIndex(
    ({ vote_account_address: voteAccountAddress }) =>
      voteAccountAddress.toString() === validator.vote_account_address.toString(),
  );
