import { MAX_UNSTAKE_COUNT } from '@/constants';
import { ValidatorWithBalance, selectValidatorForUnstake, updateValidators } from '@/general';
import { SolidoSDK } from '@/index';
import { TransactionProps, UnstakeProps } from '@/types';
import { checkMaxExceed, checkMinExceed, checkUnstakeAvailable } from '@/utils/checks';

const calculateAmount = ({
  remainingAmount,
  maxUnstakeAmount,
  minUnstakeAmount,
}: {
  remainingAmount: number;
  maxUnstakeAmount: number;
  minUnstakeAmount: number;
}) => {
  const amount = Math.min(maxUnstakeAmount, remainingAmount);
  const unstakeAmount =
    amount === remainingAmount ? amount : Math.min(remainingAmount - minUnstakeAmount, amount);
  const nextTurnAmount = remainingAmount - unstakeAmount;
  return { nextTurnAmount, unstakeAmount };
};

export type UnstakeStep = { amount: number; validator: ValidatorWithBalance };
export type PrepareUnstakeProps = TransactionProps & Pick<UnstakeProps, 'allowMultipleTransactions'>;

export async function prepareUnstake(this: SolidoSDK, props: PrepareUnstakeProps) {
  const isUnStakeAvailable = await this.isUnStakeAvailable();
  checkUnstakeAvailable(isUnStakeAvailable);

  const [stSolAccount] = await this.getStSolAccountsForUser(props.payerAddress);
  const maxUserAmount = stSolAccount?.balanceInLamports ?? 0;
  checkMaxExceed(props.amount, maxUserAmount);

  const minUnstakeAmount = await this.calculateMinUnStakeAmount();
  checkMinExceed(props.amount, minUnstakeAmount);

  let validators = await this.getValidatorsWithBalance();

  const steps: UnstakeStep[] = [];
  let remainingAmount = props.amount;
  let txAmount = 0;
  let count = 0;

  while (remainingAmount > 0) {
    const { maxUnstakeAmount, validator } = selectValidatorForUnstake({ validators });
    const { nextTurnAmount, unstakeAmount } = calculateAmount({
      minUnstakeAmount,
      maxUnstakeAmount,
      remainingAmount,
    });

    validators = updateValidators({
      validators,
      validatorIndex: validator.index,
      unstakeAmount,
    });

    if (count < MAX_UNSTAKE_COUNT) {
      txAmount += unstakeAmount;
    }
    count += 1;
    remainingAmount = nextTurnAmount;

    steps.push({ amount: unstakeAmount, validator });
    if (count > 100) break;
  }

  if (!props.allowMultipleTransactions) {
    checkMaxExceed(props.amount, txAmount);
  }

  return {
    remainingCount: Math.ceil(count / MAX_UNSTAKE_COUNT) - 1,
    remainingAmount: props.amount - txAmount,
    unstakeAmount: txAmount,
    steps,
  };
}
