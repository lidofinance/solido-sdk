import {
  TokenOwnerOffCurveError,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

export const ensureTokenAccount = async (
  payer: PublicKey,
  stSolMint: PublicKey,
  allowOwnerOffCurve = false,
) => {
  try {
    // Creating the associated token account if not already exist
    const tokenAccount = await getAssociatedTokenAddress(stSolMint, payer, allowOwnerOffCurve);
    const instruction = createAssociatedTokenAccountInstruction(payer, tokenAccount, payer, stSolMint);

    return { instruction, tokenAccount };
  } catch (error) {
    if (error instanceof TokenOwnerOffCurveError) {
      throw new ErrorWrapper({ error, code: ERROR_CODE.PUBLIC_KEY_IS_PDA });
    }

    throw error;
  }
};
