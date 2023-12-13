import { PublicKey } from '@solana/web3.js';

import { SolidoSDK } from '@/index';

type StSolAccount = {
  address: PublicKey;
  balanceInLamports: number;
};

export async function getStSolAccountsForUser(this: SolidoSDK, owner: PublicKey) {
  const stSolAccounts: StSolAccount[] = [];

  const { stSolMintAddress } = this.programAddresses;

  const { value } = await this.connection.getParsedTokenAccountsByOwner(owner, {
    mint: stSolMintAddress,
  });

  value.forEach((v) => {
    const address = v.pubkey;
    const balanceInLamports = parseInt(v.account.data.parsed?.info?.tokenAmount?.amount ?? '0', 10);

    stSolAccounts.push({ address, balanceInLamports });
  });

  return stSolAccounts;
}
