import { SolidoSDK } from '@/index';
import { lamportsToSol } from '@/utils/formatters';

export async function getTotalStaked(this: SolidoSDK, precision = 2) {
  const {
    exchange_rate: { sol_balance: balance },
  } = await this.getAccountInfo();
  let totalStakedInLamports = Number(balance);

  const { reserveAccount } = this.programAddresses;
  const reserveAccountInfo = await this.connection.getAccountInfo(reserveAccount);
  if (reserveAccountInfo) {
    totalStakedInLamports += reserveAccountInfo.lamports;
  }

  return lamportsToSol(totalStakedInLamports, precision);
}
