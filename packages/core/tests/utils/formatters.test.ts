import {
  formatWithCommas,
  lamportsToSol,
  lamportsToSolUp,
  solToLamports,
  toPrecision,
  toPrecisionUp,
} from '@/utils/formatters';

describe('formatters', () => {
  test('formatWithCommas', () => {
    expect(formatWithCommas(1)).toBe('1');
    expect(formatWithCommas(1000)).toBe('1,000');
    expect(formatWithCommas(1000000)).toBe('1,000,000');
  });

  test('toPrecision', () => {
    expect(toPrecision(0.9383, 2)).toEqual(0.93);
    expect(toPrecision(1.065793443, 4)).toEqual(1.0657);

    expect(toPrecision(0.9, 5)).toEqual(0.9);
  });

  test('toPrecisionUp', () => {
    expect(toPrecisionUp(0.9383, 2)).toEqual(0.94);
    expect(toPrecisionUp(1.065793443, 4)).toEqual(1.0658);

    expect(toPrecisionUp(0.9, 5)).toEqual(0.9);
  });

  test('lamportsToSol', () => {
    expect(lamportsToSol(7366553238)).toEqual(7.3665);
    expect(lamportsToSol(5000, 6)).toEqual(0.000005);
  });

  test('lamportsToSolUp', () => {
    expect(lamportsToSolUp(7366553238)).toEqual(7.3666);
    expect(lamportsToSolUp(2282880)).toEqual(0.0023);
  });

  test('solToLamports', () => {
    expect(solToLamports(7.3665)).toEqual(7366500000);
    expect(solToLamports(0.000005)).toEqual(5000);
  });
});
