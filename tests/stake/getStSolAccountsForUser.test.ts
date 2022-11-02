import { Connection, PublicKey } from '@solana/web3.js';
import { SolidoSDK } from '@/index';
import { getStSolAccountsForUser } from '@/stake/getStSolAccountsForUser';

describe('getStSolAccountsForUser', () => {
  // Test accounts on Slope Wallet for tests
  const walletWithStSolTokenAccount = new PublicKey('2Vn1xSUTo292A3knejUeifjt2A3aGNqyn9Svy8Kx8i4J');
  const stSolTokenAccount = new PublicKey('Gwg78Gv1NZN6k4eFSm8pTQUz2bSRcLKbMVm72uYZL9mu');

  const walletWithoutStSolTokenAccount = new PublicKey('EBMf62pD8rcEJ9UeyJ4ghdm7hXpgVQCptkKdcmZ9eoJn');

  const cluster = 'testnet';
  let sdk;

  beforeAll(async () => {
    // TODO get rpc endpoint from .env
    const connection = new Connection(
      'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
    );
    sdk = new SolidoSDK(cluster, connection);
  });

  test('wallet with stSol tokenAccount returns account as expected', async () => {
    const stSolAccounts = await getStSolAccountsForUser.call(sdk, walletWithStSolTokenAccount);

    expect(stSolAccounts).toHaveLength(1);
    expect(stSolAccounts[0].address).toBeInstanceOf(PublicKey);
    expect(stSolAccounts[0].address).toStrictEqual(stSolTokenAccount);
  });

  test('wallet without stSol tokenAccount returns empty list', async () => {
    const stSolAccounts = await getStSolAccountsForUser.call(sdk, walletWithoutStSolTokenAccount);

    expect(stSolAccounts).toHaveLength(0);
  });
});
