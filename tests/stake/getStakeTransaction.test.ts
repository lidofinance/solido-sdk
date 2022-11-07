import { Keypair, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { SolidoSDK } from '@/index';
import { getStakeTransaction } from '@/stake/getStakeTransaction';
import { ERROR_CODE, MEMO_PROGRAM_ID } from '@/constants';

import { stSolTokenAccount, walletWithoutStSolTokenAccount, walletWithStSolTokenAccount } from '../constants';
import { getConnection } from '../helpers';

describe('getStakeTransaction', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(cluster, connection);
  });

  it('should throw Error "Max exceed"', async () => {
    try {
      await getStakeTransaction.call(sdk, { payerAddress: Keypair.generate().publicKey, amount: 100000 });
    } catch (error) {
      expect(error.message).toContain('Amount must not exceed MAX');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MAX);
    }
  });

  test('transaction structure correctness, recentBlockhash, feePayer, stSolAccountAddress', async () => {
    const { transaction: stakeTransaction, stSolAccountAddress } = await getStakeTransaction.call(sdk, {
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });

    expect(stakeTransaction).toBeInstanceOf(Transaction);
    expect(stakeTransaction.recentBlockhash).toBeTruthy();
    expect(stakeTransaction.feePayer).toStrictEqual(walletWithStSolTokenAccount);
    expect(stakeTransaction.instructions).toHaveLength(1);

    expect(stSolAccountAddress).toStrictEqual(stSolTokenAccount);
  });

  test('not exist stSolAccountAddress case', async () => {
    const { transaction: stakeTransaction } = await getStakeTransaction.call(sdk, {
      payerAddress: walletWithoutStSolTokenAccount,
      amount: 1,
    });

    expect(stakeTransaction.instructions).toHaveLength(2);

    const createAssociatedTokenAccountInstruction = stakeTransaction.instructions[0];
    expect(createAssociatedTokenAccountInstruction.programId).toStrictEqual(ASSOCIATED_TOKEN_PROGRAM_ID);
  });

  test('memoInstruction correctness, transaction had it', async () => {
    const sdk = new SolidoSDK(cluster, connection, 'test_referrer_id');

    const { transaction: stakeTransaction } = await getStakeTransaction.call(sdk, {
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });

    expect(stakeTransaction.instructions).toHaveLength(2);

    const memoInstruction = stakeTransaction.instructions[1];
    expect(memoInstruction.programId).toStrictEqual(MEMO_PROGRAM_ID);
  });
});
