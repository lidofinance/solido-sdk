import { Transaction } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { SolidoSDK } from '@/index';

export * from './getDepositInstruction';
export * from './getStakeTransaction';

type StakeProps = {
  transaction: Transaction;
  wallet: SignerWalletAdapter;
};

export async function stake(this: SolidoSDK, props: StakeProps) {
  const { transaction, wallet } = props;

  const signed = await wallet.signTransaction(transaction);

  const transactionHash = await this.connection.sendRawTransaction(signed.serialize());

  const { value: status } = await this.connection.confirmTransaction(transactionHash);

  if (status?.err) {
    throw status.err;
  }
}
