import { Connection } from '@solana/web3.js';
import BN from 'bn.js';

import { SolidoSDK } from '@/index';
import { ValidatorClass, SeedRange, getValidatorList } from '@/unstake';

import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getValidatorList', () => {
  let sdk: SolidoSDK, connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test('getValidatorList parsed correctly', async () => {
    mockValidatorList(connection);

    let validators = await getValidatorList.call(sdk);

    expect(validators).toHaveLength(2); // definite length from dump

    const validatorSample = validators[0];
    expect(validatorSample).toBeInstanceOf(ValidatorClass);

    const validatorPubkey = validatorSample.vote_account_address;
    expect(validatorPubkey).toBeInstanceOf(Uint8Array);
    expect(validatorPubkey).toHaveLength(32);

    expect(validatorSample.stake_seeds).toBeInstanceOf(SeedRange);
    expect(validatorSample.stake_seeds.begin).toBeInstanceOf(BN);
    expect(validatorSample.stake_seeds.end).toBeInstanceOf(BN);
    expect(validatorSample.unstake_seeds).toBeInstanceOf(SeedRange);

    expect(validatorSample.stake_accounts_balance).toBeInstanceOf(BN);
    expect(validatorSample.unstake_accounts_balance).toBeInstanceOf(BN);
    expect(validatorSample.effective_stake_balance).toBeInstanceOf(BN);

    expect(validatorSample.active).toBe(1);
  });
});
