import { PublicKey, StakeProgram } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { StakeAccount, StakeAccountState } from '@/types';
import { calcStakeAccountState } from './calcStakeAccountState';
import { isParsedAccount } from './isParsedAccount';

const DEACTIVATED_STATES = [StakeAccountState.inactive, StakeAccountState.deactivating];

export async function getStakeAccounts(this: SolidoSDK, stakeAuthority: PublicKey) {
  const stakeAccounts = await this.connection.getParsedProgramAccounts(StakeProgram.programId, {
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
  const { epoch } = await this.connection.getEpochInfo('confirmed');

  const stakeAccountsWithStatus = await stakeAccounts
    .filter(isParsedAccount)
    // filter out active accounts
    .reduce((memo, { pubkey, account: { data, lamports } }) => {
      const state = calcStakeAccountState(epoch, data.parsed.info.stake.delegation);
      return DEACTIVATED_STATES.includes(state)
        ? [...memo, { pubkey, lamports, isReady: state === StakeAccountState.inactive }]
        : memo;
    }, [] as StakeAccount[])
    // filter out Non-Lido accounts
    .reduce(
      async (memo, account) => [
        ...(await memo),
        ...((await this.isSolidoStakeAccount(account.pubkey)) ? [account] : []),
      ],
      [] as unknown as Promise<StakeAccount[]>,
    );

  return stakeAccountsWithStatus.sort(
    (a, b) => Number(b.isReady) - Number(a.isReady) || b.lamports - a.lamports,
  );
}
