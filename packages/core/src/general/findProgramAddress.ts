import { PublicKey } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export async function findProgramAddress(
  this: SolidoSDK,
  bufferFrom: 'reserve_account' | 'mint_authority' | 'stake_authority',
) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;
  const bufferArray = [solidoInstanceId.toBuffer(), Buffer.from(bufferFrom)];

  const [programAddress] = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return programAddress;
}
