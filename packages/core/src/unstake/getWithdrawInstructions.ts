import { MAX_UNSTAKE_COUNT } from '@/constants';
import { SolidoSDK } from '@/index';
import { TransactionProps } from '@/types';
import { Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { UnstakeStep } from './prepareUnstake';

type Props = Pick<TransactionProps, 'payerAddress'> & { steps: UnstakeStep[] };

export async function getWithdrawInstructions(this: SolidoSDK, { payerAddress, steps }: Props) {
  const [stSolAccount] = await this.getStSolAccountsForUser(payerAddress);
  const senderStSolAccountAddress = stSolAccount.address;

  const instructions: TransactionInstruction[] = [];
  const signers: Keypair[] = [];
  const stakeAccounts: PublicKey[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const { amount, validator } of steps) {
    const keypair = Keypair.generate();
    const stakeAccount = keypair.publicKey;

    const instruction = await this.getWithdrawInstruction({
      payerAddress,
      amount,
      validator,
      stakeAccount,
      senderStSolAccountAddress,
    });

    instructions.push(instruction);
    signers.push(keypair);
    stakeAccounts.push(stakeAccount);

    if (instructions.length >= MAX_UNSTAKE_COUNT) {
      break;
    }
  }

  return {
    instructions,
    signers,
    stakeAccounts,
  };
}
