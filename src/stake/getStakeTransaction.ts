import { PublicKey, Transaction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { getMemoInstruction } from '@/utils/memo';
import { checkMaxExceed } from '@/utils/checkMaxExceed';
import { ensureTokenAccount } from './ensureTokenAccount';

type StakeTransactionProps = {
  amount: number;
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
};

export async function getStakeTransaction(
  this: SolidoSDK,
  props: StakeTransactionProps,
): Promise<Transaction> {
  const { payerAddress, recipientStSolAddress, amount } = props;
  const { stSolMintAddress } = this.programAddresses;

  const maxInLamports = await this.calculateMaxStakeAmount(payerAddress);
  checkMaxExceed(amount, maxInLamports);

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  let recipient = recipientStSolAddress;

  if (!recipient) {
    recipient = await ensureTokenAccount(transaction, payerAddress, stSolMintAddress);
  }

  const depositInstruction = await this.getDepositInstruction({
    ...props,
    recipientStSolAddress: recipient,
  });
  transaction.add(depositInstruction);

  // Add the referrer (if available) to a memo instruction with the transaction
  const memoData = this.referrerId;
  if (memoData) {
    transaction.add(getMemoInstruction({ referrer: memoData }, payerAddress));
  }

  return transaction;
}
