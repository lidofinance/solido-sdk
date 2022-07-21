const LIDO_ON_SOLANA = 'https://solana.lido.fi';

export const getStakeLink = (referrer: string) => `${LIDO_ON_SOLANA}/?referrer=${referrer}`;

export const getDefiLink = (referrer: string) => `${LIDO_ON_SOLANA}/defi?referrer=${referrer}`;
