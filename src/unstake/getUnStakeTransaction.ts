import { Keypair, StakeProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { TransactionProps } from '@/types';
import { checkMaxExceed } from '@/utils/checkMaxExceed';

export async function getUnStakeTransaction(this: SolidoSDK, props: TransactionProps) {
  const isUnStakeAvailable = await this.isUnStakeAvailable();

  if (!isUnStakeAvailable) {
    throw new Error('Sorry, unStake is not available right now. Please contact lido developers for details.');
  }

  const { payerAddress, amount } = props;

  const maxInLamports = await this.calculateMaxUnStakeAmount(payerAddress);
  checkMaxExceed(amount, maxInLamports);

  const newStakeAccount = Keypair.generate();
  const newStakeAccountPubkey = newStakeAccount.publicKey;

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const [stSolAccount] = await this.getStSolAccountsForUser(payerAddress);

  const withdrawInstruction = await this.getWithdrawInstruction({
    ...props,
    senderStSolAccountAddress: stSolAccount.address,
    stakeAccount: newStakeAccountPubkey,
  });
  transaction.add(withdrawInstruction);

  const deactivateTransaction = StakeProgram.deactivate({
    authorizedPubkey: payerAddress,
    stakePubkey: newStakeAccountPubkey,
  });

  deactivateTransaction.instructions.forEach((instruction) => {
    const txInstruction = new TransactionInstruction(instruction);
    transaction.add(txInstruction);
  });

  transaction.partialSign(newStakeAccount);

  return { transaction, deactivatingSolAccountAddress: newStakeAccountPubkey };
}
