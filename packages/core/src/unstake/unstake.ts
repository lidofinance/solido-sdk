import { SolidoSDK, TX_STAGE } from '@/index';
import { StakeProps } from '@/types';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';
import { PublicKey } from '@solana/web3.js';

export async function unStake(this: SolidoSDK, props: StakeProps) {
  const { amount, wallet, setTxStage } = props;

  if (wallet.publicKey === null) {
    throw new ErrorWrapper({ code: ERROR_CODE.NO_PUBLIC_KEY });
  }

  const { transaction, deactivatingSolAccountAddress } = await this.getUnStakeTransaction({
    amount: +amount,
    payerAddress: new PublicKey(wallet.publicKey),
  });

  setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING, deactivatingSolAccountAddress });

  const transactionHash = await this.signAndConfirmTransaction({
    transaction,
    wallet,
    setTxStage,
  });

  return {
    transactionHash,
    deactivatingSolAccountAddress,
  };
}
