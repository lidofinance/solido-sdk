import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

export const ensureTokenAccount = async (
  transaction: Transaction,
  payer: PublicKey,
  stSolMint: PublicKey,
) => {
  // Creating the associated token account if not already exist
  const associatedStSolAccount = await getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    false,
    stSolMint,
    payer,
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      stSolMint,
      associatedStSolAccount,
      payer,
      payer,
    ),
  );

  return associatedStSolAccount;
};
