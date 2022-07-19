type StakeApyResponse = {
  annual_percentage_yield: number;
};

export const STATIC_DEFAULT_APY = '5.74'; // TODO think

export const getStakeApy = async () => {
  try {
    const resp = await fetch('https://solana.lido.fi/api/apy/apy?since_launch');
    const { annual_percentage_yield: APY } = (await resp.json()) as StakeApyResponse;

    return APY ? APY.toFixed(2) : STATIC_DEFAULT_APY;
  } catch {
    return STATIC_DEFAULT_APY;
  }
};
