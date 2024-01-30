import { SolApiPriceResponse } from '@/types';

const SOL_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

export const getSolPrice = async () => {
  try {
    const resp = await fetch(SOL_PRICE_URL);
    const jsonResponse = (await resp.json()) as SolApiPriceResponse;
    const price = jsonResponse.solana?.usd;

    return price || 0;
  } catch {
    return 0;
  }
};
