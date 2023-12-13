import { SolidoSDK, TX_STAGE } from '@/index';
import { SignAndConfirmTransactionProps, WithdrawProps } from '@/types';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

type Props = Omit<SignAndConfirmTransactionProps, 'transaction'> & Pick<WithdrawProps, 'accounts'>;

export async function withdraw(this: SolidoSDK, props: Props) {
  const { wallet, setTxStage, accounts } = props;

  setTxStage?.({ txStage: TX_STAGE.PREPARE });

  if (wallet.publicKey === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_PUBLIC_KEY });
  }

  const { transaction } = await this.getWithdrawTransaction({ accounts, payerAddress: wallet.publicKey });

  setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING });

  const transactionHash = await this.signAndConfirmTransaction({
    transaction,
    wallet,
    setTxStage,
  });

  return { transactionHash };
}
