import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { SolidoSDK } from '@/index';
import { getStakeTransaction } from '@/stake/getStakeTransaction';
import { MEMO_PROGRAM_ID } from '@/constants';
import { ERROR_CODE } from '@common/constants';

import {
  CLUSTER,
  stSolTokenAccount,
  walletWithoutStSolTokenAccount,
  walletWithStSolTokenAccount,
} from '../constants';
import { getConnection } from '../helpers';

describe('getStakeTransaction', () => {
  let sdk: SolidoSDK, connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  it('should throw Error "Max exceed"', async () => {
    try {
      await sdk.getStakeTransaction({ payerAddress: Keypair.generate().publicKey, amount: 100000 });
    } catch (error) {
      expect(error.message).toContain('Amount must not exceed MAX');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MAX);
    }
  });

  test('transaction structure correctness, recentBlockhash, feePayer, stSolAccountAddress', async () => {
    jest.spyOn(sdk, 'calculateMaxStakeAmount').mockReturnValueOnce(Promise.resolve(2 * LAMPORTS_PER_SOL));
    const { transaction: stakeTransaction, stSolAccountAddress } = await sdk.getStakeTransaction({
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
    jest.spyOn(sdk, 'calculateMaxStakeAmount').mockReturnValueOnce(Promise.resolve(2 * LAMPORTS_PER_SOL));
    const { transaction: stakeTransaction } = await sdk.getStakeTransaction({
      payerAddress: walletWithoutStSolTokenAccount,
      amount: 1,
    });

    expect(stakeTransaction.instructions).toHaveLength(2);

    const createAssociatedTokenAccountInstruction = stakeTransaction.instructions[0];
    expect(createAssociatedTokenAccountInstruction.programId).toStrictEqual(ASSOCIATED_TOKEN_PROGRAM_ID);
  });

  test('memoInstruction correctness, transaction had it', async () => {
    const sdk = new SolidoSDK(CLUSTER, connection, 'test_referrer_id');
    jest.spyOn(sdk, 'calculateMaxStakeAmount').mockReturnValueOnce(Promise.resolve(2 * LAMPORTS_PER_SOL));

    const { transaction: stakeTransaction } = await sdk.getStakeTransaction({
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });

    expect(stakeTransaction.instructions).toHaveLength(2);

    const memoInstruction = stakeTransaction.instructions[1];
    expect(memoInstruction.programId).toStrictEqual(MEMO_PROGRAM_ID);
  });
});
