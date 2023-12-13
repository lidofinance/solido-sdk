import { SolidoSDK, TX_STAGE } from '@/index';
import { UnstakeProps } from '@/types';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';
import { PublicKey } from '@solana/web3.js';

export async function unStake(this: SolidoSDK, props: UnstakeProps) {
  const { amount, wallet, setTxStage, allowMultipleTransactions } = props;

  setTxStage?.({ txStage: TX_STAGE.PREPARE });

  if (wallet.publicKey === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_PUBLIC_KEY });
  }

  const { transaction, ...rest } = await this.getUnStakeTransaction({
    amount: +amount,
    payerAddress: new PublicKey(wallet.publicKey),
    allowMultipleTransactions,
  });

  setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING, ...rest });

  const transactionHash = await this.signAndConfirmTransaction({
    transaction,
    wallet,
    setTxStage,
  });

  return {
    transactionHash,
    ...rest,
  };
}
