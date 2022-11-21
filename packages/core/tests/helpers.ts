import { Connection } from '@solana/web3.js';

export const getConnection = () => {
  const endpoint = process.env.RPC_ENDPOINT || 'https://api.testnet.solana.com/';

  return new Connection(endpoint);
};
