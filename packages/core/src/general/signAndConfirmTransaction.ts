import { SignAndConfirmTransactionProps } from '@/types';
import { TransactionSignature } from '@solana/web3.js';
import { SolidoSDK, TX_STAGE } from '@/index';
import { ErrorWrapper } from '@common/errorWrapper';
import { ERROR_CODE } from '@common/constants';

export async function signAndConfirmTransaction(
  this: SolidoSDK,
  props: SignAndConfirmTransactionProps,
): Promise<TransactionSignature | undefined> {
  const { transaction, wallet, setTxStage } = props;

  try {
    const signed = await wallet.signTransaction(transaction);

    const transactionHash = await this.connection.sendRawTransaction(signed.serialize());

    setTxStage?.({ txStage: TX_STAGE.AWAITING_BLOCK, transactionHash });

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

    const { value: status } = await this.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: transactionHash,
    });

    if (status?.err) {
      throw status.err;
    }

    setTxStage?.({ txStage: TX_STAGE.SUCCESS });
    return transactionHash;
  } catch (error) {
    throw new ErrorWrapper({ error, code: ERROR_CODE.CANNOT_CONFIRM_TRANSACTION });
  }
}
