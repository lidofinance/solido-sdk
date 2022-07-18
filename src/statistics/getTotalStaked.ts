import { SolidoSDK } from '@/index';

export async function getTotalStaked(this: SolidoSDK) {
  const accountInfo = await this.getAccountInfo();

  const reserveAccount = await this.findProgramAddress('reserve_account');

  const reserveAccountInfo = await this.connection.getAccountInfo(reserveAccount);
  if (reserveAccountInfo === null) {
    return 0;
  }

  const reserveAccountRent = await this.connection.getMinimumBalanceForRentExemption(
    reserveAccountInfo.data.byteLength,
  );

  const reserveAccountBalanceInLamports = reserveAccountInfo.lamports - reserveAccountRent;

  // @ts-ignore
  const validatorsStakeAccountsBalanceInLamports = accountInfo.validators.entries
    .map((pubKeyAndEntry) => pubKeyAndEntry.entry)
    .map((validator) => validator.stake_accounts_balance.toNumber())
    .reduce((acc, current) => acc + current, 0);

  return validatorsStakeAccountsBalanceInLamports + reserveAccountBalanceInLamports;
}
