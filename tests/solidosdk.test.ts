import { SolidoSDK, TX_STAGE } from '@/index';
import { Connection, PublicKey } from '@solana/web3.js';
import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@/constants';

describe('SolidoSDK', () => {
  const walletWithStSolTokenAccount = new PublicKey('2Vn1xSUTo292A3knejUeifjt2A3aGNqyn9Svy8Kx8i4J');
  const cluster = 'testnet';
  const hash = 'hashed_of_transaction';
  let sdk, connection, transaction;
  const wallet = {
    signTransaction: () => ({
      serialize: () => '',
    }),
  };

  let txStage: TX_STAGE = TX_STAGE.IDLE;
  const setTxStage = (props: { txStage: TX_STAGE }) => {
    txStage = props.txStage;
  };

  beforeAll(() => {
    connection = new Connection(
      'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
    );
    sdk = new SolidoSDK(cluster, connection);
    sdk.getStakeTransaction({
      payerAddress: walletWithStSolTokenAccount,
      amount: 1,
    });
  });

  test('constructor throws error with devnet', () => {
    try {
      //@ts-ignore
      new SolidoSDK('devnet', connection);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.UNSUPPORTED_CLUSTER);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[ERROR_CODE.UNSUPPORTED_CLUSTER]);
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.UNSUPPORTED_CLUSTER]);
    }
  });

  test('signAndConfirmTransaction method success case', async () => {
    jest.spyOn(connection, 'sendRawTransaction').mockReturnValueOnce(hash);
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
    jest.spyOn(connection, 'sendRawTransaction').mockReturnValueOnce(hash);
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
