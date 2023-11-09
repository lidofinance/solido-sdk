import { Connection, PublicKey } from '@solana/web3.js';
import { when } from 'jest-when';

import { LidoVersion, SolidoSDK } from '@/index';
import { clusterProgramAddresses } from '@/constants';
import { ERROR_CODE, ERROR_MESSAGE } from '@common/constants';
import { AccountInfoV2, AccountType } from '@/types';

import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER, VALIDATOR_LIST } from '../constants';
import { getAccountInfo } from '@/general';

describe('getAccountInfo', () => {
  let sdk: SolidoSDK;
  let connection: Connection;

  const { solidoInstanceId, stSolMintAddress } = clusterProgramAddresses[CLUSTER];

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test(`Couldn't fetch getAccountInfo solidoInstanceId`, async () => {
    const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
    when(spiedGetAccountInfo).calledWith(solidoInstanceId).mockReturnValueOnce(Promise.resolve(null));

    try {
      await getAccountInfo.call(sdk);
    } catch (error) {
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.NO_ACCOUNT_INFO]);
      expect(error.code).toEqual(ERROR_CODE.NO_ACCOUNT_INFO);
    }
  });

  test(`Couldn't fetch getAccountInfo validatorList`, async () => {
    const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
    when(spiedGetAccountInfo).calledWith(VALIDATOR_LIST).mockReturnValueOnce(Promise.resolve(null));

    try {
      await getAccountInfo.call(sdk);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.NO_VALIDATORS);
    }
  });

  test('getAccountInfo success case, all fields parsed as expected', async () => {
    mockValidatorList(connection); // because it's not important here

    const accountInfo = (await getAccountInfo.call(sdk)) as AccountInfoV2;

    expect(accountInfo.lido_version).toEqual(LidoVersion.v2);
    expect(accountInfo.account_type).toEqual(AccountType.Lido);

    expect(new PublicKey(accountInfo.st_sol_mint)).toStrictEqual(stSolMintAddress);
    expect(new PublicKey(accountInfo.validator_list)).toStrictEqual(VALIDATOR_LIST);

    expect(accountInfo.maintainer_list).toBeInstanceOf(Array);
    expect(accountInfo.maintainer_list).toHaveLength(32);

    expect(accountInfo.manager).toBeInstanceOf(Array);
    expect(accountInfo.manager).toHaveLength(32);

    expect(typeof accountInfo.sol_reserve_account_bump_seed).toBe('number');
    expect(typeof accountInfo.stake_authority_bump_seed).toBe('number');
    expect(typeof accountInfo.mint_authority_bump_seed).toBe('number');
    expect(typeof accountInfo.max_commission_percentage).toBe('number');
  });
});
