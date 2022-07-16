import { Cluster, Connection, TransactionSignature } from '@solana/web3.js';

import { findProgramAddress, getDepositInstruction, getStakeTransaction, calculateMaxStakeAmount } from '@/stake';
import { ProgramAddresses, SignAndConfirmTransactionProps } from '@/types';
import { clusterProgramAddresses, TX_STAGE } from '@/constants';
import { getAccountInfo, getUnStakeTransaction, getWithdrawInstruction } from '@/unstake';

export { default as LidoStakeBanner } from './banner';

export class SolidoSDK {
  programAddresses: ProgramAddresses;
  connection: Connection;

  constructor(cluster: Cluster, connection: Connection) {
    this.programAddresses = clusterProgramAddresses[cluster];
    this.connection = connection;
  }

  private async signAndConfirmTransaction(props: SignAndConfirmTransactionProps): Promise<TransactionSignature | undefined> {
    const { transaction, wallet, setTxStage } = props;

    try {
      setTxStage?.(TX_STAGE.AWAITING_SIGNING);
      const signed = await wallet.signTransaction(transaction);

      const transactionHash = await this.connection.sendRawTransaction(signed.serialize());

      setTxStage?.(TX_STAGE.AWAITING_BLOCK);
      const { value: status } = await this.connection.confirmTransaction(transactionHash);

      if (status?.err) {
        throw status.err;
      }

      setTxStage?.(TX_STAGE.SUCCESS);
      return transactionHash;
    } catch (error) {
      console.error(error);
      setTxStage?.(TX_STAGE.ERROR);

      throw error;
    }
  }

  // Staking functions
  public stake = this.signAndConfirmTransaction;
  public getStakeTransaction = getStakeTransaction.bind(this);
  public calculateMaxStakeAmount = calculateMaxStakeAmount.bind(this);
  protected findProgramAddress = findProgramAddress.bind(this);
  protected getDepositInstruction = getDepositInstruction.bind(this);


  // UnStaking functions
  public unStake = this.signAndConfirmTransaction;
  public getUnStakeTransaction = getUnStakeTransaction.bind(this);
  protected getWithdrawInstruction = getWithdrawInstruction.bind(this);
  protected getAccountInfo = getAccountInfo.bind(this);
}
