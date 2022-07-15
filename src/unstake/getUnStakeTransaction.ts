import { Keypair, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import { Lamports } from '@/types';
import { SolidoSDK } from '@/index';

type UnStakeTransactionProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
};

export async function getUnStakeTransaction(this: SolidoSDK, props: UnStakeTransactionProps) {
  const { senderStSolAccountAddress, payerAddress, amount } = props;

  const accountInfo = await this.getAccountInfo();

  const newStakeAccount = Keypair.generate();

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const withdrawInstruction = await this.getWithdrawInstruction(
    amount,
    payerAddress,
    senderStSolAccountAddress,
    newStakeAccount,
    accountInfo
  );
  transaction.add(withdrawInstruction);

  const deactivateTransaction = StakeProgram.deactivate({
    authorizedPubkey: payerAddress,
    stakePubkey: newStakeAccount.publicKey,
  });

  transaction.add(...deactivateTransaction.instructions);

  transaction.partialSign(newStakeAccount);

  return { transaction, stakeAccountAddress: newStakeAccount.publicKey };
};
