import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { ensureTokenAccount } from '@/stake/ensureTokenAccount';
import { clusterProgramAddresses } from '@/constants';

describe('ensureTokenAccount', () => {
  const payerAddress = Keypair.generate().publicKey;
  const transaction = new Transaction({ feePayer: payerAddress });
  const cluster = 'testnet';
  let tokenAccount;

  const { stSolMintAddress } = clusterProgramAddresses[cluster];

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
});
