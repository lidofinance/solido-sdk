import { nu64, struct, u32, u8 } from '@solana/buffer-layout';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,

  SYSVAR_CLOCK_PUBKEY,
  StakeProgram,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';

import { INSTRUCTION_V2 } from '@/constants';
import { ValidatorWithBalance } from '@/general';
import { SolidoSDK } from '@/index';
import { WithdrawInstructionStruct } from '@/types';

export type WithdrawInstructionProps = {
  amount: number; // in stSOL
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
  validator?: Pick<ValidatorWithBalance, 'index' | 'stakeAccount' | 'vote_account_address'>;
};

export const withdrawDataLayout = struct<WithdrawInstructionStruct>([
  u8('instruction'),
  nu64('amount'),
  u32('validator_index'),
]);

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId, stakeAuthority, validatorList } =
    this.programAddresses;

  const validator = props.validator ?? (await this.getValidaror());
  const validatorStakeAccount = validator.stakeAccount;
  const validatorVoteAccount = new PublicKey(validator.vote_account_address);

  const data: Buffer = Buffer.alloc(withdrawDataLayout.span);
  withdrawDataLayout.encode(
    {
      instruction: INSTRUCTION_V2.UNSTAKE,
      amount: new BN(amount),
      validator_index: validator.index,
    },
    data,
  );

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true },
    { pubkey: payerAddress, isSigner: true, isWritable: false },
    { pubkey: senderStSolAccountAddress, isSigner: false, isWritable: true },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true },
    { pubkey: validatorVoteAccount, isSigner: false, isWritable: false },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    { pubkey: stakeAccount, isSigner: true, isWritable: true },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: validatorList, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: solidoProgramId,
    data,
  });
}
