import { INSTRUCTION_V2 } from '@/constants';
import { SolidoSDK } from '@/index';
import { withdrawDataLayout } from '@/unstake';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

const MAX_ACCOUNT_SIGNATURES = 5;

export async function isSolidoStakeAccount(
  this: SolidoSDK,
  account: PublicKey,
  limit = MAX_ACCOUNT_SIGNATURES,
) {
  const { solidoProgramId } = this.programAddresses;

  const transactionList = await this.connection.getSignaturesForAddress(account, { limit });
  const signatureList = transactionList.map(({ signature }) => signature);
  const transactions = await this.connection.getTransactions(signatureList);

  return transactions.some((t) => {
    const message = t?.transaction.message;

    return message?.instructions?.some((i) => {
      const isSolidoProgram = message.accountKeys[i.programIdIndex].equals(solidoProgramId);
      if (!isSolidoProgram) return false;

      const isUnstakeInstruction =
        withdrawDataLayout.decode(bs58.decode(i.data)).instruction === INSTRUCTION_V2.UNSTAKE;
      if (!isUnstakeInstruction) return false;

      const isSameAccount = message.accountKeys[i.accounts[6]].equals(account);
      return !!isSameAccount;
    });
  });
}
