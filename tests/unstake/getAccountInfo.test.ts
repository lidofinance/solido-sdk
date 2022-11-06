import { Connection, PublicKey } from '@solana/web3.js';
import { when } from 'jest-when';
import BN from 'bn.js';

import { LidoVersion, SolidoSDK } from '@/index';
import { clusterProgramAddresses, ERROR_CODE, ERROR_MESSAGE, VALIDATOR_LIST } from '@/constants';
import {
  ExchangeRate,
  getAccountInfo,
  RewardDistribution,
  FeeRecipients,
  Metrics,
  ValidatorClass,
  SeedRange,
} from '@/unstake';
import { AccountInfoV2, AccountType } from '@/types';

import { mockValidatorList } from '../mocks/validators';

describe('getAccountInfo', () => {
  const cluster = 'testnet';
  let sdk, connection;

  const { solidoInstanceId, stSolMintAddress } = clusterProgramAddresses[cluster];

  beforeAll(async () => {
    // TODO get rpc endpoint from .env
    connection = new Connection(
      'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
    );
    sdk = new SolidoSDK(cluster, connection);
  });

  test(`Couldn't fetch getAccountInfo solidoInstanceId`, async () => {
    const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
    when(spiedGetAccountInfo).calledWith(solidoInstanceId).mockReturnValueOnce(null);

    try {
      await getAccountInfo.call(sdk);
    } catch (error) {
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.NO_ACCOUNT_INFO]);
      expect(error.code).toEqual(ERROR_CODE.NO_ACCOUNT_INFO);
    }
  });

  test(`Couldn't fetch getAccountInfo validatorList`, async () => {
    const spiedGetAccountInfo = jest.spyOn(connection, 'getAccountInfo');
    when(spiedGetAccountInfo).calledWith(VALIDATOR_LIST).mockReturnValueOnce(null);

    try {
      await getAccountInfo.call(sdk);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.NO_VALIDATORS);
    }
  });

  test('getAccountInfo success case, all fields parsed as expected', async () => {
    mockValidatorList(connection); // because it's not important here

    let { lidoVersion, accountInfo } = await getAccountInfo.call(sdk);
    accountInfo = accountInfo as AccountInfoV2;

    expect(lidoVersion).toEqual(LidoVersion.v2);
    expect(accountInfo.lido_version).toEqual(LidoVersion.v2);

    expect(accountInfo.account_type).toEqual(AccountType.Lido);

    expect(new PublicKey(accountInfo.st_sol_mint)).toStrictEqual(stSolMintAddress);
    expect(new PublicKey(accountInfo.validator_list)).toStrictEqual(VALIDATOR_LIST);

    expect(accountInfo.exchange_rate).toBeInstanceOf(ExchangeRate);
    expect(accountInfo.reward_distribution).toBeInstanceOf(RewardDistribution);
    expect(accountInfo.fee_recipients).toBeInstanceOf(FeeRecipients);
    expect(accountInfo.metrics).toBeInstanceOf(Metrics);

    expect(accountInfo.maintainer_list).toBeInstanceOf(Uint8Array);
    expect(accountInfo.maintainer_list).toHaveLength(32);

    expect(accountInfo.manager).toBeInstanceOf(Uint8Array);
    expect(accountInfo.manager).toHaveLength(32);

    expect(typeof accountInfo.sol_reserve_account_bump_seed).toBe('number');
    expect(typeof accountInfo.stake_authority_bump_seed).toBe('number');
    expect(typeof accountInfo.mint_authority_bump_seed).toBe('number');
    expect(typeof accountInfo.max_commission_percentage).toBe('number');
  });

  test('getAccountInfo parsed correctly validatorList', async () => {
    mockValidatorList(connection);

    let { lidoVersion, validators } = await getAccountInfo.call(sdk);

    expect(lidoVersion).toEqual(LidoVersion.v2);
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
