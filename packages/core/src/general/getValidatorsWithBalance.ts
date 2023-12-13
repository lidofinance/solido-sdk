import { SolidoSDK } from '@/index';
import { ValidatorV2 } from '@/types';
import { getValidatorMaxUnstakeAmount } from '@/utils/getValidatorMaxUnstakeAmount';
import { PublicKey } from '@solana/web3.js';
import { getHeaviestValidator, getValidatorIndex } from './getValidatorList';

export type ValidatorWithBalance = ValidatorV2 & {
  balance: number;
  stakeAccount: PublicKey;
  index: number;
};

export async function getValidaror(this: SolidoSDK) {
  const validators = await this.getValidatorList();
  const heaviestValidator = getHeaviestValidator(validators);
  return {
    ...heaviestValidator,
    index: getValidatorIndex(validators, heaviestValidator),
    stakeAccount: await this.getValidatorStakeAccountAddress(heaviestValidator),
  };
}

export async function getValidatorsWithBalance(this: SolidoSDK) {
  const list = await this.getValidatorList();
  const accounts: PublicKey[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const validator of list) {
    const stakeAccount = await this.getValidatorStakeAccountAddress(validator);
    accounts.push(stakeAccount);
  }

  const accountsInfo = await this.connection.getMultipleAccountsInfo(accounts);
  const balances = accountsInfo.map((info) => {
    if (!info) return 0;
    return info.lamports;
  });

  return list.map(
    (validator, index) =>
      ({
        ...validator,
        stakeAccount: accounts[index],
        balance: balances[index],
        index,
      } as ValidatorWithBalance),
  );
}

export const selectValidatorForUnstake = ({
  validators,
}: {
  validators: Awaited<ReturnType<typeof getValidatorsWithBalance>>;
}) => {
  const validator = getHeaviestValidator(validators);
  // const maxUnstakeAmount = getValidatorMaxUnstakeAmount(validator.balance);
  // TODO: remove this
  const maxUnstakeAmount = 5_000_000;
  return { maxUnstakeAmount, validator };
};

export const updateValidators = ({
  unstakeAmount,
  validators,
  validatorIndex,
}: {
  unstakeAmount: number;
  validatorIndex: number;
  validators: ValidatorWithBalance[];
}) =>
  validators.map((v) =>
    v.index === validatorIndex
      ? {
          ...v,
          effective_stake_balance: v.effective_stake_balance - BigInt(unstakeAmount),
          balance: v.balance - unstakeAmount,
        }
      : v,
  );
