import { Connection } from '@solana/web3.js';

const CUSTOM_ENDPOINT = 'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf';

export const getConnection = () => {
  const endpoint = CUSTOM_ENDPOINT || 'https://api.testnet.solana.com/';

  return new Connection(endpoint);
};
