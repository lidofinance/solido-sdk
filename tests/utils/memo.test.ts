import { getMemoInstruction } from '@/utils/memo';
import { Keypair } from '@solana/web3.js';
import { MEMO_PROGRAM_ID } from '@/constants';

describe('getMemoInstruction', () => {
  const payerAddress = Keypair.generate().publicKey;
  const referrer = 'referrerId';

  test('all fields are filled correct', () => {
    const memoInstruction = getMemoInstruction({ referrer }, payerAddress);

    expect(memoInstruction.programId).toEqual(MEMO_PROGRAM_ID);

    expect(memoInstruction.keys).toHaveLength(1);
    expect(memoInstruction.keys[0].pubkey).toStrictEqual(payerAddress);

    const parsedData = JSON.parse(memoInstruction.data.toString());
    expect(parsedData.referrer).toBe(referrer);
  });
});
