import { Connection, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INSTRUCTION, SolidoSDK, solToLamports } from '@/index';
import { depositDataLayout, getDepositInstruction } from '@/stake/getDepositInstruction';
import { clusterProgramAddresses } from '@/constants';
import { mintAuthority, reserveAccount } from '../data/snapshot';

describe('getDepositInstruction', () => {
  let depositInstruction: TransactionInstruction;
  const payerAddress = Keypair.generate().publicKey;
  const recipientStSolAddress = Keypair.generate().publicKey;
  const amount = 10;
  const cluster = 'testnet';
  let sdk;

  const { solidoInstanceId, solidoProgramId, stSolMintAddress } = clusterProgramAddresses[cluster];

  beforeAll(async () => {
    // TODO get rpc endpoint from .env
    const connection = new Connection(
      'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
    );
    sdk = new SolidoSDK(cluster, connection);

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

    expect(data.instruction).toBe(INSTRUCTION.STAKE);
    expect(data.amount).toBe(solToLamports(amount));
  });
});
