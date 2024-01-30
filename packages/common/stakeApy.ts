import { ErrorWrapper } from './errorWrapper';
import { ERROR_CODE } from './constants';

export const STATIC_DEFAULT_APY = 0;

// eslint-disable-next-line @typescript-eslint/require-await
export const getStakeApy = async (): Promise<never> => {
  throw new ErrorWrapper({ error: new Error('Method deprecated'), code: ERROR_CODE.NO_APY_DATA });
};
