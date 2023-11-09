import { PublicKey, Transaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TokenOwnerOffCurveError,
} from '@solana/spl-token';

import { ErrorWrapper } from '@common/errorWrapper';
import { ERROR_CODE } from '@common/constants';

export const ensureTokenAccount = async (
  transaction: Transaction,
  payer: PublicKey,
  stSolMint: PublicKey,
  allowOwnerOffCurve = false,
) => {
  try {
    // Creating the associated token account if not already exist
    const associatedStSolAccount = await getAssociatedTokenAddress(stSolMint, payer, allowOwnerOffCurve);
    transaction.add(createAssociatedTokenAccountInstruction(payer, associatedStSolAccount, payer, stSolMint));

    return associatedStSolAccount;
  } catch (error) {
    if (error instanceof TokenOwnerOffCurveError) {
      throw new ErrorWrapper({ error, code: ERROR_CODE.PUBLIC_KEY_IS_PDA });
    }

    throw error;
  }
};
