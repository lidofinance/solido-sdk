import { Keypair, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import { Lamports } from '@/types';
import { SolidoSDK } from '@/index';

type UnStakeTransactionProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
};

export async function getUnStakeTransaction(this: SolidoSDK, props: UnStakeTransactionProps) {
  const { payerAddress } = props;

  const newStakeAccount = Keypair.generate();
  const newStakeAccountPubkey = newStakeAccount.publicKey;

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const withdrawInstruction = await this.getWithdrawInstruction(
    {
      ...props,
      stakeAccount: newStakeAccountPubkey,
    }
  );
  transaction.add(withdrawInstruction);

  const deactivateTransaction = StakeProgram.deactivate({
    authorizedPubkey: payerAddress,
    stakePubkey: newStakeAccountPubkey,
  });

  transaction.add(...deactivateTransaction.instructions);

  transaction.partialSign(newStakeAccount);

  return { transaction, stakeAccountAddress: newStakeAccountPubkey };
};
