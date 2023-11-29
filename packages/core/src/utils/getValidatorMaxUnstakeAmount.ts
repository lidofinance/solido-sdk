import { solToLamports } from './formatters';

// https://github.com/ChorusOne/solido/blob/v0.5.0/program/src/processor.rs#L799
export const getValidatorMaxUnstakeAmount = (validatorBalance: number) =>
  Math.floor(validatorBalance * 0.1 + solToLamports(10));
