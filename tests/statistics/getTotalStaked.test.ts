import { lamportsToSol, SolidoSDK } from '@/index';

import reserveAccountInfo from '../data/reserve_account_info.json';
import { validators } from '../data/snapshot';

import { mockValidatorList } from '../mocks/validators';
import { mockReserveAccountInfo } from '../mocks/accountInfo';
import { getConnection } from '../helpers';

describe('getTotalStaked', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
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
