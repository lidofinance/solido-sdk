import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { checkMinExceed } from '@/utils/checkMinExceed';
import { ERROR_CODE } from '@common/constants';
import { RENT_EXEMPT_LAMPORTS } from '../constants';
import { lamportsToSol } from '@/index';

describe('checkMinExceed', () => {
  it('should throw Error if amount is less than minInLamports', async () => {
    expect.assertions(2);
    try {
      checkMinExceed(0.001, RENT_EXEMPT_LAMPORTS);
    } catch (error) {
      expect(error.message).toContain('Amount must be greater than rent-exempt fee');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MIN);
    }
  });

  it('should throw Error if amount is equal than minInLamports', async () => {
    expect.assertions(2);
    try {
      checkMinExceed(lamportsToSol(RENT_EXEMPT_LAMPORTS), RENT_EXEMPT_LAMPORTS);
    } catch (error) {
      expect(error.message).toContain('Amount must be greater than rent-exempt fee');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MIN);
    }
  });

  it('should not throw Error if amount is bigger than minInLamports', () => {
    const fn = () => checkMinExceed(0.003, RENT_EXEMPT_LAMPORTS);
    expect(fn).not.toThrowError();
  });
});
