import { SolidoSDK } from '@/index';
import { toPrecision } from '@/utils/formatters';

export async function getExchangeRate(this: SolidoSDK, precision: number = 4) {
  const accountInfo = await this.getAccountInfo();

  // @ts-ignore
  const totalSolInLamports = accountInfo.exchange_rate.sol_balance.toNumber();
  // @ts-ignore
  const stSolSupplyInLamports = accountInfo.exchange_rate.st_sol_supply.toNumber();

  const SOLToStSOL = totalSolInLamports / stSolSupplyInLamports;
  const stSOLToSOL = stSolSupplyInLamports / totalSolInLamports;

  return {
    SOLToStSOL: toPrecision(SOLToStSOL, precision),
    stSOLToSOL: toPrecision(stSOLToSOL, precision),
  };
}