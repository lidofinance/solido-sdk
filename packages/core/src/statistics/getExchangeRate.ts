import { SolidoSDK } from '@/index';
import { toPrecision } from '@/utils/formatters';

export async function getExchangeRate(this: SolidoSDK, precision = 4) {
  const accountInfo = await this.getAccountInfo();

  const totalSolInLamports = Number(accountInfo.exchange_rate.sol_balance);
  const stSolSupplyInLamports = Number(accountInfo.exchange_rate.st_sol_supply);

  const stSOLToSOL = totalSolInLamports / stSolSupplyInLamports;
  const SOLToStSOL = stSolSupplyInLamports / totalSolInLamports;

  return {
    SOLToStSOL: toPrecision(SOLToStSOL, precision),
    stSOLToSOL: toPrecision(stSOLToSOL, precision),
    description:
      'Updates at the end of an epoch. Rising exchange rate indicates an appreciation in stSOL value',
  };
}
