import { PublicKey } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export async function calculateMaxStakeAmount(this: SolidoSDK, address: PublicKey) {
  const {
    feeCalculator: { lamportsPerSignature: fee },
  } = await this.connection.getRecentBlockhash();

  const accountInfo = await this.connection.getAccountInfo(address);
  if (accountInfo === null) {
    return 0;
  }

  const accountRent = await this.connection.getMinimumBalanceForRentExemption(accountInfo.data.byteLength);

  const balanceInLamports = accountInfo.lamports;

  return Math.max(balanceInLamports - accountRent - 50 * fee, 0);
}
