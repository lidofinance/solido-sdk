import { Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { SolidoSDK, solToLamports } from '@/index';
import { clusterProgramAddresses } from '@/constants';
import { getWithdrawInstruction, withdrawDataLayout } from '@/unstake';
import { getHeaviestValidator, getValidatorIndex, getValidatorStakeAccountAddress } from '@/general';

import { heaviestValidator, stakeAuthority, validators } from '../data/snapshot';
import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER, VALIDATOR_LIST } from '../constants';

describe('getHeaviestValidator', () => {
  test('heaviest validator from validators list', () => {
    const validator = getHeaviestValidator(validators);

    expect(validator).toStrictEqual(heaviestValidator);
  });
});

describe('getValidatorIndex', () => {
  test('get heaviest validator index from validators list', () => {
    const validator = getHeaviestValidator(validators);
    const index = getValidatorIndex(validators, validator);

    expect(index).toEqual(0);
  });
});

describe('getValidatorStakeAccountAddress', () => {
  let sdk;

  beforeAll(() => {
    const connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    mockValidatorList(connection);
  });

  test('return accountAddress', async () => {
    const validator = getHeaviestValidator(validators);
    const address = await getValidatorStakeAccountAddress.call(sdk, validator);

    expect(address).toStrictEqual(new PublicKey('7Z71Y3HQqWzbcQu3DnNVLdShWsBsF5K8yGxKtMtQVUNM'));
  });
});

describe('getWithdrawInstruction', () => {
  let withdrawInstruction: TransactionInstruction;
  const payerAddress = Keypair.generate().publicKey;
  const senderStSolAccountAddress = Keypair.generate().publicKey;
  const stakeAccount = Keypair.generate().publicKey;
  const amount = solToLamports(10);
  let sdk;

  const { solidoInstanceId, solidoProgramId, stSolMintAddress } = clusterProgramAddresses[CLUSTER];

  beforeAll(async () => {
    const connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    mockValidatorList(connection);

    withdrawInstruction = await getWithdrawInstruction.call(sdk, {
      amount,
      payerAddress,
      senderStSolAccountAddress,
      stakeAccount,
    });
  });

  test('withdrawInstruction keys validity', () => {
    const { keys } = withdrawInstruction;

    expect(keys).toHaveLength(13);

    expect(keys[0].pubkey).toStrictEqual(solidoInstanceId);
    expect(keys[1].pubkey).toStrictEqual(payerAddress);
    expect(keys[2].pubkey).toStrictEqual(senderStSolAccountAddress);
    expect(keys[3].pubkey).toStrictEqual(stSolMintAddress);
    expect(keys[4].pubkey).toStrictEqual(new PublicKey(heaviestValidator.vote_account_address));
    expect(keys[5].pubkey).toStrictEqual(heaviestValidator.stake_account_address);
    expect(keys[6].pubkey).toStrictEqual(stakeAccount);
    expect(keys[7].pubkey).toStrictEqual(stakeAuthority);
    expect(keys[8].pubkey).toStrictEqual(VALIDATOR_LIST);
  });

  test('withdrawInstruction.programId is correct', () => {
    expect(withdrawInstruction.programId).toStrictEqual(solidoProgramId);
  });

  test('withdrawInstruction.data is fulled as expected', () => {
    const data = withdrawDataLayout.decode(withdrawInstruction.data);

    expect(data.instruction).toBe(23);
    expect(data.amount).toBe(amount);
  });
});

describe('calculateStakeAccountAddress', () => {
  test.todo('think about it');
});
