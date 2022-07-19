import { Keypair, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { checkMaxExceed } from '@/utils/checkMaxExceed';

type UnStakeTransactionProps = {
  amount: number;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
};

export async function getUnStakeTransaction(this: SolidoSDK, props: UnStakeTransactionProps) {
  const { payerAddress, amount } = props;

  const maxInLamports = await this.calculateMaxStakeAmount(payerAddress);
  checkMaxExceed(amount, maxInLamports);

  const newStakeAccount = Keypair.generate();
  const newStakeAccountPubkey = newStakeAccount.publicKey;

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const withdrawInstruction = await this.getWithdrawInstruction({
    ...props,
    stakeAccount: newStakeAccountPubkey,
  });
  transaction.add(withdrawInstruction);

  const deactivateTransaction = StakeProgram.deactivate({
    authorizedPubkey: payerAddress,
    stakePubkey: newStakeAccountPubkey,
  });

  transaction.add(...deactivateTransaction.instructions);

  transaction.partialSign(newStakeAccount);

  return { transaction, stakeAccountAddress: newStakeAccountPubkey };
}
