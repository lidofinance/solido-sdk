import { Connection } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { getValidatorList } from '@/unstake';

import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getValidators', () => {
  let sdk: SolidoSDK;
  let connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test('getValidatorList parsed correctly', async () => {
    mockValidatorList(connection);

    const validators = await getValidatorList.call(sdk);

    expect(validators).toHaveLength(2); // definite length from dump

    const validatorSample = validators[0];

    const validatorPubkey = validatorSample.vote_account_address;
    expect(validatorPubkey).toBeInstanceOf(Array);
    expect(validatorPubkey).toHaveLength(32);

    expect(typeof validatorSample.stake_seeds.begin).toEqual('bigint');
    expect(typeof validatorSample.stake_seeds.end).toEqual('bigint');

    expect(typeof validatorSample.stake_accounts_balance).toEqual('bigint');
    expect(typeof validatorSample.unstake_accounts_balance).toEqual('bigint');
    expect(typeof validatorSample.effective_stake_balance).toEqual('bigint');

    expect(validatorSample.active).toBe(1);
  });
});
