import { SolidoSDK } from '@/index';
import { lamportsToSol } from '@/utils/formatters';

export async function getTotalStaked(this: SolidoSDK, precision = 2) {
  const { validators } = await this.getAccountInfo();

  const reserveAccount = await this.findProgramAddress('reserve_account');

  const reserveAccountInfo = await this.connection.getAccountInfo(reserveAccount);
  if (reserveAccountInfo === null) {
    return 0;
  }

  const reserveAccountRent = await this.connection.getMinimumBalanceForRentExemption(
    reserveAccountInfo.data.byteLength,
  );

  const reserveAccountBalanceInLamports = reserveAccountInfo.lamports - reserveAccountRent;

  const validatorsStakeAccountsBalanceInLamports = validators
    .map((validator) => validator.stake_accounts_balance.toNumber())
    .reduce((acc, current) => acc + current, 0);

  const totalStakedInLamports = validatorsStakeAccountsBalanceInLamports + reserveAccountBalanceInLamports;

  return lamportsToSol(totalStakedInLamports, precision);
}
