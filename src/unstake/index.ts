import { Transaction } from '@solana/web3.js';
import { SolidoSDK } from '@/index';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

export * from './getWithdrawInstruction';
export * from './getUnStakeTransaction';
export * from './getAccountInfo';

type UnStakeProps = {
  transaction: Transaction;
  wallet: SignerWalletAdapter;
};

export async function unStake(this: SolidoSDK, props: UnStakeProps) {
  const { transaction, wallet } = props;

  const signed = await wallet.signTransaction(transaction);

  const transactionHash = await this.connection.sendRawTransaction(signed.serialize());

  const { value: status } = await this.connection.confirmTransaction(transactionHash);

  if (status?.err) {
    throw status.err;
  }
}
