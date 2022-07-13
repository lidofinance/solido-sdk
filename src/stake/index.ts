import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Lamports } from '@/types';

import { getDepositInstruction } from './getDepositInstruction';
import { ensureTokenAccount } from './ensureTokenAccount';

type StakeProps = {
  connection: Connection;
  amount: Lamports;
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
};

export const stake = async (props: StakeProps) => {
  const { stSolMintAddress, connection, payerAddress } = props;

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  let recipient = stSolMintAddress;

  if (!recipient) {
    recipient = await ensureTokenAccount(transaction, payerAddress, stSolMintAddress);
  }

  const depositInstruction = await getDepositInstruction({
    ...props,
    recipientStSolAddress: recipient,
  });
  transaction.add(depositInstruction);

  return transaction;
};
