import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

import { ensureTokenAccount } from '@/stake/ensureTokenAccount';

import { clusterProgramAddresses } from '@/constants';
import { CLUSTER, examplePDAAccount } from '../constants';
import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@common/constants';

describe('ensureTokenAccount', () => {
  const payerAddress = Keypair.generate().publicKey;
  const transaction = new Transaction({ feePayer: payerAddress });
  let tokenAccount: PublicKey;

  const { stSolMintAddress } = clusterProgramAddresses[CLUSTER];

  beforeAll(async () => {
    tokenAccount = await ensureTokenAccount(transaction, payerAddress, stSolMintAddress);
  });

  test('associatedStSolAccount has correct type', () => {
    expect(tokenAccount).toBeInstanceOf(PublicKey);
  });

  test('associatedStSolAccount instruction correctly added to transaction', () => {
    expect(transaction.instructions).toHaveLength(1);

    const instruction = transaction.instructions[0];

    expect(instruction).toBeInstanceOf(TransactionInstruction);
  });

  test("associatedStSolAccount instruction keys' order are correct", () => {
    const { keys } = transaction.instructions[0];

    expect(keys).toHaveLength(7);

    // first key should be payer address
    expect(keys[0].pubkey).toStrictEqual(payerAddress);
    // second key should be stSol account
    expect(keys[1].pubkey).toStrictEqual(tokenAccount);
    // third key should be owner (payer)
    expect(keys[2].pubkey).toStrictEqual(payerAddress);
    // fourth key should be stSolMintAddress
    expect(keys[3].pubkey).toStrictEqual(stSolMintAddress);
  });

  it('throw error when try to use PDA account', async () => {
    const tx = new Transaction();

    try {
      await ensureTokenAccount(tx, examplePDAAccount, stSolMintAddress);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.PUBLIC_KEY_IS_PDA);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[ERROR_CODE.PUBLIC_KEY_IS_PDA]);
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.PUBLIC_KEY_IS_PDA]);
    }
  });

  it('should pass with PDA account when we pass allowOwnerOffCurve flag', async () => {
    const tx = new Transaction();

    await expect(ensureTokenAccount(tx, examplePDAAccount, stSolMintAddress, true)).resolves.toBeTruthy();
  });
});
