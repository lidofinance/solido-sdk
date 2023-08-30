import { SolidoSDK } from '@/index';
import { StakeProgram } from '@solana/web3.js';

export async function getValidatorsInfo(this: SolidoSDK) {
  const { stakeAuthority } = this.programAddresses;

  const stakeAccounts = await this.connection.getProgramAccounts(StakeProgram.programId, {
    commitment: 'confirmed',
    filters: [
      {
        memcmp: {
          offset: 44,
          bytes: stakeAuthority.toBase58(),
        },
      },
    ],
  });
  return stakeAccounts;
}
