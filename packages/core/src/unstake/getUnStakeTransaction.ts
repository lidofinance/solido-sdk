import { SolidoSDK } from '@/index';
import { TransactionProps, UnstakeProps } from '@/types';
import { getDeactivateInstructions } from './getDeactivateInstructions';

type Props = TransactionProps & Pick<UnstakeProps, 'allowMultipleTransactions'>;

export async function getUnStakeTransaction(this: SolidoSDK, props: Props) {
  const { steps, ...rest } = await this.prepareUnstake(props);

  const { instructions, signers, stakeAccounts } = await this.getWithdrawInstructions({
    payerAddress: props.payerAddress,
    steps,
  });

  const { instructions: deactivateInstructions, deactivatingStakeAccounts } = getDeactivateInstructions({
    stakeAccounts,
    payerAddress: props.payerAddress,
  });

  const transaction = await this.createTransaction({
    feePayer: props.payerAddress,
    instructions: [...instructions, ...deactivateInstructions],
    signers,
  });

  return { transaction, stakeAccounts: deactivatingStakeAccounts, ...rest };
}
