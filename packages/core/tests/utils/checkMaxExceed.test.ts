import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { checkMaxExceed, checkMinExceed } from '@/utils/checks';
import { lamportsToSol, solToLamports } from '@/utils/formatters';
import { ERROR_CODE } from '@common/constants';
import { RENT_EXEMPT_LAMPORTS } from '../constants';

describe('checkMaxExceed', () => {
  it('should throw Error if amount is bigger than maxInLamports', () => {
    const t = () => checkMaxExceed(solToLamports(10), solToLamports(9.9));
    expect(t).toThrow('Amount must not exceed MAX(9.9)');
  });

  it('should not throw Error if amount is less than maxInLamports', () => {
    const fn = () => checkMaxExceed(9.8, 9.9);
    expect(fn).not.toThrowError();
  });
});

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
    const fn = () => checkMinExceed(solToLamports(0.003), RENT_EXEMPT_LAMPORTS);
    expect(fn).not.toThrowError();
  });
});
