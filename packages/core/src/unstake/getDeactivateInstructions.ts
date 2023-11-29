import { MAX_UNSTAKE_MERGE_CONT } from '@/constants';
import { PublicKey, StakeProgram, TransactionInstruction } from '@solana/web3.js';

type Props = { stakeAccounts: PublicKey[]; payerAddress: PublicKey };

export function getDeactivateInstructions({ stakeAccounts, payerAddress }: Props) {
  const instructions: TransactionInstruction[] = [];

  const headAccount = stakeAccounts[0];
  const deactivatingStakeAccounts = [
    ...stakeAccounts.slice(0, 1),
    ...stakeAccounts.slice(MAX_UNSTAKE_MERGE_CONT + 1),
  ];

  stakeAccounts.slice(1, MAX_UNSTAKE_MERGE_CONT + 1).forEach((stakeAccount) => {
    instructions.push(
      ...StakeProgram.merge({
        authorizedPubkey: payerAddress,
        stakePubkey: headAccount,
        sourceStakePubKey: stakeAccount,
      }).instructions,
    );
  });

  deactivatingStakeAccounts.forEach((stakeAccount) =>
    instructions.push(
      ...StakeProgram.deactivate({
        authorizedPubkey: payerAddress,
        stakePubkey: stakeAccount,
      }).instructions,
    ),
  );

  return { instructions, deactivatingStakeAccounts };
}
