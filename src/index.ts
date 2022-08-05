import { Cluster, Connection, PublicKey, TransactionSignature } from '@solana/web3.js';

import { ProgramAddresses, SignAndConfirmTransactionProps, StakeProps } from '@/types';
import { clusterProgramAddresses, TX_STAGE } from '@/constants';

import {
  calculateMaxStakeAmount,
  findProgramAddress,
  getDepositInstruction,
  getStakeTransaction,
} from '@/stake';
import {
  calculateMaxUnStakeAmount,
  calculateStakeAccountAddress,
  getAccountInfo,
  getUnStakeTransaction,
  getWithdrawInstruction,
} from '@/unstake';

import { getExchangeRate } from '@/statistics/getExchangeRate';
import { getTransactionCost } from '@/statistics/getTransactionCost';
import { getStakingRewardsFee } from '@/statistics/getStakingRewardsFee';
import { getTransactionInfo } from '@/statistics/transactionInfo';

import { getTotalStaked } from '@/statistics/getTotalStaked';
import { getStakersCount } from '@/statistics/getStakersCount';
import { getMarketCap } from '@/statistics/getMarketCap';
import { getLidoStatistics } from '@/statistics/lidoStatistics';
import { getStSolAccountsForUser } from '@/stake/getStSolAccountsForUser';

export { default as LidoStakeBanner } from './banner';
export { getStakeApy } from '@/api/stakeApy';
export { INSTRUCTION, TX_STAGE } from '@/constants';

export class SolidoSDK {
  protected programAddresses: ProgramAddresses;

  protected connection: Connection;

  protected referrerId?: string;

  constructor(cluster: Cluster, connection: Connection, referrerId?: string) {
    this.programAddresses = clusterProgramAddresses[cluster];
    this.connection = connection;
    this.referrerId = referrerId;
  }

  public async signAndConfirmTransaction(
    props: SignAndConfirmTransactionProps,
  ): Promise<TransactionSignature | undefined> {
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

  public getStSolAccountsForUser = getStSolAccountsForUser.bind(this);

  // Staking functions
  public async stake(props: StakeProps) {
    const { amount, wallet, setTxStage } = props;

    if (wallet.publicKey === null) {
      throw new Error('SolidoSDK: publicKey is null in wallet');
    }

    const stakeTransaction = await this.getStakeTransaction({
      amount: +amount,
      payerAddress: new PublicKey(wallet.publicKey),
    });

    return this.signAndConfirmTransaction({
      transaction: stakeTransaction,
      wallet,
      setTxStage,
    });
  }

  public getStakeTransaction = getStakeTransaction.bind(this);

  public calculateMaxStakeAmount = calculateMaxStakeAmount.bind(this);

  protected findProgramAddress = findProgramAddress.bind(this);

  protected getDepositInstruction = getDepositInstruction.bind(this);

  // UnStaking functions
  public async unStake(props: StakeProps) {
    const { amount, wallet, setTxStage } = props;

    if (wallet.publicKey === null) {
      throw new Error('SolidoSDK: publicKey is null in wallet');
    }

    const { transaction } = await this.getUnStakeTransaction({
      amount: +amount,
      payerAddress: new PublicKey(wallet.publicKey),
    });

    return this.signAndConfirmTransaction({
      transaction,
      wallet,
      setTxStage,
    });
  }

  public getUnStakeTransaction = getUnStakeTransaction.bind(this);

  public calculateMaxUnStakeAmount = calculateMaxUnStakeAmount.bind(this);

  protected getWithdrawInstruction = getWithdrawInstruction.bind(this);

  protected getAccountInfo = getAccountInfo.bind(this);

  protected calculateStakeAccountAddress = calculateStakeAccountAddress.bind(this);

  // Transaction Info
  public getTransactionInfo = getTransactionInfo.bind(this);

  public getExchangeRate = getExchangeRate.bind(this);

  public getTransactionCost = getTransactionCost.bind(this);

  public getStakingRewardsFee = getStakingRewardsFee.bind(this);

  // Statistics
  public getLidoStatistics = getLidoStatistics.bind(this);

  public getTotalStaked = getTotalStaked.bind(this);

  public getStakersCount = getStakersCount.bind(this);

  public getMarketCap = getMarketCap.bind(this);
}
