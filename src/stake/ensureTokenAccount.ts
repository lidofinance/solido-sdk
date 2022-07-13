import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const ensureTokenAccount = async (transaction, payer, stSolMint) => {
  // Creating the associated token account if not already exist
  const associatedStSolAccount = await getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
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
