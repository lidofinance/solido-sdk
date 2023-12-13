import { TransactionInstruction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { StakeAdditionalProps, TransactionProps } from '@/types';
import { checkMaxExceed } from '@/utils/checks';
import { getMemoInstruction } from '@/utils/memo';
import { ensureTokenAccount } from './ensureTokenAccount';

export async function getStakeTransaction(this: SolidoSDK, props: TransactionProps & StakeAdditionalProps) {
  const { payerAddress, amount, allowOwnerOffCurve } = props;
  const { stSolMintAddress } = this.programAddresses;

  const maxInLamports = await this.calculateMaxStakeAmount(payerAddress);
  checkMaxExceed(amount, maxInLamports);

  const instructions: TransactionInstruction[] = [];

  const [stSolAccount] = await this.getStSolAccountsForUser(payerAddress);
  let stSolAccountAddress = stSolAccount?.address;

  if (!stSolAccountAddress) {
    const { instruction, tokenAccount } = await ensureTokenAccount(
      payerAddress,
      stSolMintAddress,
      allowOwnerOffCurve,
    );
    instructions.push(instruction);
    stSolAccountAddress = tokenAccount;
  }

  instructions.push(
    await this.getDepositInstruction({
      ...props,
      recipientStSolAddress: stSolAccountAddress,
    }),
  );

  // Add the referrer (if available) to a memo instruction with the transaction
  const memoData = this.referrerId;
  if (memoData) {
    instructions.push(getMemoInstruction({ referrer: memoData }, payerAddress));
  }

  const transaction = await this.createTransaction({ feePayer: payerAddress });
  transaction.add(...instructions);

  return { transaction, stSolAccountAddress };
}
