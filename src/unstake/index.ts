import { Keypair, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import { getAccountInfo } from './getAccountInfo';
import { Lamports } from '@/types';
import { SolidoSDK } from '@/index';

export * from './getWithdrawInstruction';

type UnStakeProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
};

export async function unStake(this: SolidoSDK, props: UnStakeProps) {
  const { solidoInstanceId } = this.programAddresses;
  const { senderStSolAccountAddress, payerAddress, amount } = props;

  const accountInfo = await getAccountInfo(this.connection, solidoInstanceId);

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
