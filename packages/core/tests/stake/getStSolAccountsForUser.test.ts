import { PublicKey } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { getStSolAccountsForUser } from '@/stake/getStSolAccountsForUser';

import { getConnection } from '../helpers';
import {
  CLUSTER,
  stSolTokenAccount,
  walletWithoutStSolTokenAccount,
  walletWithStSolTokenAccount,
} from '../constants';

describe('getStSolAccountsForUser', () => {
  let sdk: SolidoSDK;

  beforeAll(() => {
    const connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
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
