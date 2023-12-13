import { Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js';

import { ensureTokenAccount } from '@/stake/ensureTokenAccount';

import { clusterProgramAddresses } from '@/constants';
import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@common/constants';
import { CLUSTER, examplePDAAccount } from '../constants';

describe('ensureTokenAccount', () => {
  const payerAddress = Keypair.generate().publicKey;
  let tokenAccount: PublicKey;
  let instruction: TransactionInstruction;

  const { stSolMintAddress } = clusterProgramAddresses[CLUSTER];

  beforeAll(async () => {
    const { instruction: i, tokenAccount: account } = await ensureTokenAccount(
      payerAddress,
      stSolMintAddress,
    );
    tokenAccount = account;
    instruction = i;
  });

  test('associatedStSolAccount has correct type', () => {
    expect(tokenAccount).toBeInstanceOf(PublicKey);
  });

  test('associatedStSolAccount instruction correctly added to transaction', () => {
    expect(instruction).toBeInstanceOf(TransactionInstruction);
  });

  test("associatedStSolAccount instruction keys' order are correct", () => {
    const { keys } = instruction;

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
    try {
      await ensureTokenAccount(examplePDAAccount, stSolMintAddress);
    } catch (error) {
      expect(error.code).toEqual(ERROR_CODE.PUBLIC_KEY_IS_PDA);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[ERROR_CODE.PUBLIC_KEY_IS_PDA]);
      expect(error.message).toEqual(ERROR_MESSAGE[ERROR_CODE.PUBLIC_KEY_IS_PDA]);
    }
  });

  it('should pass with PDA account when we pass allowOwnerOffCurve flag', async () => {
    await expect(ensureTokenAccount(examplePDAAccount, stSolMintAddress, true)).resolves.toBeTruthy();
  });
});
