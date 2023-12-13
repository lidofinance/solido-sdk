import { Connection, Transaction } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { SolidoSDK, TX_STAGE } from '@/index';

import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@common/constants';
import { getConnection } from './helpers';
import { CLUSTER, walletWithStSolTokenAccount } from './constants';

describe('SolidoSDK', () => {
  const hash = 'hash_of_transaction';
  let sdk: SolidoSDK;
  let connection: Connection;
  let transaction: Transaction;
  const wallet = {
    signTransaction: () => ({
      serialize: () => '',
    }),
  } as any as SignerWalletAdapter;

  let txStage: TX_STAGE = TX_STAGE.IDLE;
  const setTxStage = (props: { txStage: TX_STAGE }) => {
    txStage = props.txStage;
  };

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
    sdk.getStakeTransaction({
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });
  });

  test('constructor throws error with devnet', () => {
    try {
      //@ts-expect-error devnet is not allowed
      new SolidoSDK('devnet', connection);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.UNSUPPORTED_CLUSTER);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[ERROR_CODE.UNSUPPORTED_CLUSTER]);
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.UNSUPPORTED_CLUSTER]);
    }
  });

  test('signAndConfirmTransaction method success case', async () => {
    jest.spyOn(connection, 'sendRawTransaction').mockReturnValueOnce(Promise.resolve(hash));
    // @ts-expect-error
    jest.spyOn(connection, 'confirmTransaction').mockReturnValueOnce({ value: 'ok' });

    const expectedHash = await sdk.signAndConfirmTransaction({
      transaction,
      wallet,
      setTxStage,
    });

    expect(expectedHash).toEqual(hash);
    expect(txStage).toEqual(TX_STAGE.SUCCESS);
  });

  test('signAndConfirmTransaction method error case', async () => {
    const err = new Error('expected error');
    jest.spyOn(connection, 'sendRawTransaction').mockReturnValueOnce(Promise.resolve(hash));
    // @ts-expect-error
    jest.spyOn(connection, 'confirmTransaction').mockReturnValueOnce({ value: { err } });

    try {
      await sdk.signAndConfirmTransaction({
        transaction,
        wallet,
        setTxStage,
      });
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.CANNOT_CONFIRM_TRANSACTION);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[ERROR_CODE.CANNOT_CONFIRM_TRANSACTION]);
    }
  });
});
