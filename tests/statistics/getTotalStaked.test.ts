import { Connection } from '@solana/web3.js';

import { lamportsToSol, SolidoSDK } from '@/index';

import reserveAccountInfo from '../data/reserve_account_info.json';
import { validators } from '../data/snapshot';
import { mockValidatorList } from '../helpers/validators';
import { mockReserveAccountInfo } from '../helpers/accountInfo';

describe('getTotalStaked', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(async () => {
    connection = new Connection('https://api.testnet.solana.com/');
    sdk = new SolidoSDK(cluster, connection);
  });

  test('total staked returned value', async () => {
    mockValidatorList(connection);
    mockReserveAccountInfo(connection);

    const totalStaked = await sdk.getTotalStaked();

    const validatorsStake = validators.reduce(
      (arr, { stake_accounts_balance }) => arr + stake_accounts_balance.toNumber(),
      0,
    );

    const totalStakedExpected = lamportsToSol(validatorsStake + reserveAccountInfo.lamports, 2);

    expect(totalStaked).toEqual(totalStakedExpected);
  });
});
