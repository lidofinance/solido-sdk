import { SOL_API_HOST } from './constants';

type StakeApyResponse = {
  data: {
    apy: number;
  };
};

export const STATIC_DEFAULT_APY = '5.74'; // TODO think

export const getStakeApy = async () => {
  try {
    const resp = await fetch(`${SOL_API_HOST}/v1/apy?since_launch`, { mode: 'cors' });
    const {
      data: { apy },
    } = (await resp.json()) as StakeApyResponse;

    return apy ? apy.toFixed(2) : STATIC_DEFAULT_APY;
  } catch {
    return STATIC_DEFAULT_APY;
  }
};
