import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Lamports } from '@/types';

import { ensureTokenAccount } from './ensureTokenAccount';
import { SolidoSDK } from '@/index';

export * from './getDepositInstruction';

type StakeProps = {
  connection: Connection;
  amount: Lamports;
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
};

export async function stake(this: SolidoSDK, props: StakeProps) {
  const { connection, payerAddress } = props;
  const { stSolMintAddress } = this.programAddresses;

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  let recipient = stSolMintAddress;

  if (!recipient) {
    recipient = await ensureTokenAccount(transaction, payerAddress, stSolMintAddress);
  }

  const depositInstruction = await this.getDepositInstruction({
    ...props,
    recipientStSolAddress: recipient,
  });
  transaction.add(depositInstruction);

  return transaction;
};
