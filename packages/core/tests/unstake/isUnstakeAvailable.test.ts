import { Connection } from '@solana/web3.js';
import { SolidoSDK } from '@/index';
import { isUnStakeAvailable } from '@/unstake';

import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('isUnStakeAvailable', () => {
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  it('should return true when validators are normal', async () => {
    mockValidatorList(connection, 'full');

    const actual = await isUnStakeAvailable.call(sdk);
    expect(actual).toBe(true);
  });

  it('should return false when validators are inactive', async () => {
    mockValidatorList(connection, 'inActive');

    const actual = await isUnStakeAvailable.call(sdk);
    expect(actual).toBe(false);
  });

  it('should return false when validators effective_stake_balance are 0', async () => {
    mockValidatorList(connection, 'zeroBalance');

    const actual = await isUnStakeAvailable.call(sdk);
    expect(actual).toBe(false);
  });

  it('should return false when validators list is empty', async () => {
    mockValidatorList(connection, 'empty');

    const actual = await isUnStakeAvailable.call(sdk);
    expect(actual).toBe(false);
  });
});
