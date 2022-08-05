import { SolidoSDK } from '@/index';
import { toPrecision } from '@/utils/formatters';

export async function getExchangeRate(this: SolidoSDK, precision = 4) {
  const accountInfo = await this.getAccountInfo();

  const totalSolInLamports = accountInfo.exchange_rate.sol_balance.toNumber();
  const stSolSupplyInLamports = accountInfo.exchange_rate.st_sol_supply.toNumber();

  const SOLToStSOL = totalSolInLamports / stSolSupplyInLamports;
  const stSOLToSOL = stSolSupplyInLamports / totalSolInLamports;

  return {
    SOLToStSOL: toPrecision(SOLToStSOL, precision),
    stSOLToSOL: toPrecision(stSOLToSOL, precision),
    description:
      'Updates at the end of an epoch. Rising exchange rate indicates an appreciation in stSOL value',
  };
}
