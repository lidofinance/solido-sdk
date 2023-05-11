import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { checkMaxExceed } from '@/utils/checkMaxExceed';
import { ERROR_CODE } from '@common/constants';

describe('checkMaxExceed', () => {
  it('should throw Error if amount is bigger than maxInLamports', () => {
    expect.assertions(2);
    try {
      checkMaxExceed(10, 9.9 * LAMPORTS_PER_SOL);
    } catch (error) {
      expect(error.message).toContain('Amount must not exceed MAX');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MAX);
    }
  });

  it('should not throw Error if amount is less than maxInLamports', () => {
    const fn = () => checkMaxExceed(9.8, 9.9 * LAMPORTS_PER_SOL);
    expect(fn).not.toThrowError();
  });
});
