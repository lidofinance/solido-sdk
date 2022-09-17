import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

export const ensureTokenAccount = async (
  transaction: Transaction,
  payer: PublicKey,
  stSolMint: PublicKey,
) => {
  // Creating the associated token account if not already exist
  const associatedStSolAccount = await getAssociatedTokenAddress(stSolMint, payer, false);

  transaction.add(createAssociatedTokenAccountInstruction(payer, associatedStSolAccount, payer, stSolMint));

  return associatedStSolAccount;
};
