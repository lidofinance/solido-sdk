import { Keypair, StakeProgram, Transaction } from '@solana/web3.js';
import { getAccountInfo } from './getAccountInfo';
import { getWithdrawInstruction } from './getWithdrawInstruction';

export const unstake = async (connection, payer, stSolAddress, amount, config) => {
  const { lidoAddress } = config;

  const accountInfo = await getAccountInfo(connection, lidoAddress);

  const newStakeAccount = Keypair.generate();

  const transaction = new Transaction({ feePayer: payer });
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const withdrawInstruction = await getWithdrawInstruction(
    amount,
    payer,
    stSolAddress,
    newStakeAccount,
    accountInfo,
    config,
  );
  transaction.add(withdrawInstruction);

  const deactivateTransaction = StakeProgram.deactivate({
    authorizedPubkey: payer,
    stakePubkey: newStakeAccount.publicKey,
  });

  transaction.add(...deactivateTransaction.instructions);

  transaction.partialSign(newStakeAccount);

  return { transaction, stakeAccountAddress: newStakeAccount.publicKey };
};
