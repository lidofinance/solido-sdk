import { Transaction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { TransactionProps } from '@/types';
import { getMemoInstruction } from '@/utils/memo';
import { checkMaxExceed } from '@/utils/checkMaxExceed';
import { ensureTokenAccount } from './ensureTokenAccount';

export async function getStakeTransaction(this: SolidoSDK, props: TransactionProps) {
  const { payerAddress, amount } = props;
  const { stSolMintAddress } = this.programAddresses;

  const maxInLamports = await this.calculateMaxStakeAmount(payerAddress);
  checkMaxExceed(amount, maxInLamports);

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const [stSolAccount] = await this.getStSolAccountsForUser(payerAddress);
  let stSolAccountAddress = stSolAccount.address;

  if (!stSolAccountAddress) {
    stSolAccountAddress = await ensureTokenAccount(transaction, payerAddress, stSolMintAddress);
  }

  const depositInstruction = await this.getDepositInstruction({
    ...props,
    recipientStSolAddress: stSolAccountAddress,
  });
  transaction.add(depositInstruction);

  // Add the referrer (if available) to a memo instruction with the transaction
  const memoData = this.referrerId;
  if (memoData) {
    transaction.add(getMemoInstruction({ referrer: memoData }, payerAddress));
  }

  return { transaction, stSolAccountAddress };
}
