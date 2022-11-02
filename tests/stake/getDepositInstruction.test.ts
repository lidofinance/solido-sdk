import { Connection, Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { INSTRUCTION, SolidoSDK, solToLamports } from '@/index';
import { dataLayout, getDepositInstruction } from '@/stake/getDepositInstruction';
import { clusterProgramAddresses } from '@/constants';

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

  // test('test', async () => {
  //   const reserveAccount = await findProgramAddress.call(sdk, 'reserve_account');
  //   console.log(reserveAccount.toString());
  //   const mintAuthority = await findProgramAddress.call(sdk, 'mint_authority');
  //   console.log(mintAuthority.toString());
  // });

  test('depositInstruction keys validity', () => {
    const { keys } = depositInstruction;

    expect(keys).toHaveLength(8);

    // first key should be solido instance ID
    expect(keys[0].pubkey).toStrictEqual(solidoInstanceId);
    // second key should be payer address
    expect(keys[1].pubkey).toStrictEqual(payerAddress);
    // third key should be recipient StSol address
    expect(keys[2].pubkey).toStrictEqual(recipientStSolAddress);
    // fourth key should be stSolMintAddress
    expect(keys[3].pubkey).toStrictEqual(stSolMintAddress);
    // fifth key should be reserve account
    expect(keys[4].pubkey).toStrictEqual(new PublicKey('9zu4upPBBDqbk6upLT4YycwUR9UoXWhs5NfMHeUdTDCv'));
    // sixth key should be mintAuthority
    expect(keys[5].pubkey).toStrictEqual(new PublicKey('83xtC3WGv1kJXgGo2HFZv7dJSBQshee6HqUvRe9mnrqz'));
  });

  test('depositInstruction.programId is correct', () => {
    expect(depositInstruction.programId).toStrictEqual(solidoProgramId);
  });

  test('depositInstruction.data is fulled as expected', () => {
    const data = dataLayout.decode(depositInstruction.data);

    expect(data.instruction).toBe(INSTRUCTION.STAKE);
    expect(data.amount).toBe(solToLamports(amount));
  });
});
