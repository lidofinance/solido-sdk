import { Keypair, TransactionInstruction } from '@solana/web3.js';

import { SolidoSDK, solToLamports } from '@/index';
import { depositDataLayout, getDepositInstruction } from '@/stake/getDepositInstruction';
import { clusterProgramAddresses } from '@/constants';

import { mintAuthority, reserveAccount } from '../data/snapshot';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getDepositInstruction', () => {
  let depositInstruction: TransactionInstruction;
  const payerAddress = Keypair.generate().publicKey;
  const recipientStSolAddress = Keypair.generate().publicKey;
  const amount = solToLamports(10);
  let sdk: SolidoSDK;

  const { solidoInstanceId, solidoProgramId, stSolMintAddress } = clusterProgramAddresses[CLUSTER];

  beforeAll(async () => {
    const connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    depositInstruction = await getDepositInstruction.call(sdk, {
      amount,
      payerAddress,
      recipientStSolAddress,
    });
  });

  test('depositInstruction keys validity', () => {
    const { keys } = depositInstruction;

    expect(keys).toHaveLength(8);

    expect(keys[0].pubkey).toStrictEqual(solidoInstanceId);
    expect(keys[1].pubkey).toStrictEqual(payerAddress);
    expect(keys[2].pubkey).toStrictEqual(recipientStSolAddress);
    expect(keys[3].pubkey).toStrictEqual(stSolMintAddress);
    expect(keys[4].pubkey).toStrictEqual(reserveAccount);
    expect(keys[5].pubkey).toStrictEqual(mintAuthority);
  });

  test('depositInstruction.programId is correct', () => {
    expect(depositInstruction.programId).toStrictEqual(solidoProgramId);
  });

  test('depositInstruction.data is fulled as expected', () => {
    const data = depositDataLayout.decode(depositInstruction.data);

    expect(data.instruction).toBe(1);
    expect(data.amount).toBe(amount);
  });
});
