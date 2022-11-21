import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { ERROR_CODE, ERROR_MESSAGE } from '@/constants';
import { getUnStakeTransaction } from '@/unstake';

import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER, stSolTokenAccount, walletWithStSolTokenAccount } from '../constants';

describe('getUnStakeTransaction', () => {
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  it('should throw Error "UNSTAKE_UNAVAILABLE"', async () => {
    mockValidatorList(connection, 'empty');

    try {
      await sdk.getUnStakeTransaction({ payerAddress: Keypair.generate().publicKey, amount: 100000 });
    } catch (error) {
      expect(error.message).toContain(ERROR_MESSAGE[ERROR_CODE.UNSTAKE_UNAVAILABLE]);
      expect(error.code).toEqual(ERROR_CODE.UNSTAKE_UNAVAILABLE);
    }
  });

  it('should throw Error "Max exceed"', async () => {
    try {
      await sdk.getUnStakeTransaction({ payerAddress: Keypair.generate().publicKey, amount: 100000 });
    } catch (error) {
      expect(error.message).toContain('Amount must not exceed MAX');
      expect(error.code).toEqual(ERROR_CODE.EXCEED_MAX);
    }
  });

  test('transaction structure correctness, recentBlockhash, feePayer, stSolAccountAddress', async () => {
    jest.spyOn(sdk, 'calculateMaxUnStakeAmount').mockReturnValueOnce(Promise.resolve(2 * LAMPORTS_PER_SOL));
    const { transaction } = await sdk.getUnStakeTransaction({
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });

    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.recentBlockhash).toBeTruthy();
    expect(transaction.feePayer).toStrictEqual(walletWithStSolTokenAccount);
    expect(transaction.instructions).toHaveLength(2);

    // see withdrawInstruction keys validity
    const tokenAccount = transaction.instructions[0].keys[2].pubkey;
    expect(tokenAccount).toStrictEqual(stSolTokenAccount);
  });

  test('deactivateTransaction correctness', async () => {
    jest.spyOn(sdk, 'calculateMaxUnStakeAmount').mockReturnValueOnce(Promise.resolve(2 * LAMPORTS_PER_SOL));
    const { transaction, deactivatingSolAccountAddress } = await sdk.getUnStakeTransaction({
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });

    const deactivateTransactionInstruction = transaction.instructions[1];
    expect(deactivateTransactionInstruction).toBeInstanceOf(TransactionInstruction);

    expect(deactivateTransactionInstruction.keys).toHaveLength(3);

    // we check also keys order of StakeProgram.deactivate
    const stakeAccount = deactivateTransactionInstruction.keys[0].pubkey;
    const authorizedPubkey = deactivateTransactionInstruction.keys[2].pubkey;
    expect(authorizedPubkey).toStrictEqual(walletWithStSolTokenAccount);
    expect(stakeAccount).toStrictEqual(deactivatingSolAccountAddress);
  });
});
