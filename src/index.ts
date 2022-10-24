import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';

import { ProgramAddresses, SignAndConfirmTransactionProps, StakeProps, SupportedClusters } from '@/types';
import { clusterProgramAddresses, ERROR_CODE, LidoVersion, TX_STAGE } from '@/constants';

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
  getAccountInfoResponse,
  getUnStakeTransaction,
  getWithdrawInstruction,
  isUnStakeAvailable,
} from '@/unstake';

import { getExchangeRate } from '@/statistics/getExchangeRate';
import { getTransactionCost } from '@/statistics/getTransactionCost';
import { getStakingRewardsFee } from '@/statistics/getStakingRewardsFee';
import { getTransactionInfo } from '@/statistics/transactionInfo';

import { getTotalStaked } from '@/statistics/getTotalStaked';
import { getStakersCount } from '@/statistics/getStakersCount';
import { getMarketCap } from '@/statistics/getMarketCap';
import { getLidoStatistics } from '@/statistics/lidoStatistics';
import { getTotalRewards } from '@/statistics/getTotalRewards';
import { getStSolAccountsForUser } from '@/stake/getStSolAccountsForUser';
import { ErrorWrapper } from '@/utils/errorWrapper';

export { default as LidoStakeBanner } from './banner';
export { getStakeApy } from '@/api/stakeApy';
export {
  MAINNET_PROGRAM_ADDRESSES,
  TESTNET_PROGRAM_ADDRESSES,
  INSTRUCTION,
  TX_STAGE,
  LidoVersion,
} from '@/constants';
export * from '@/utils/formatters';

export class SolidoSDK {
  protected connection: Connection;

  protected referrerId?: string;

  protected solidoAccountInfo?: getAccountInfoResponse;

  public lidoVersion: LidoVersion = LidoVersion.v1;

  public programAddresses: ProgramAddresses;

  constructor(cluster: SupportedClusters, connection: Connection, referrerId?: string) {
    // @ts-expect-error for js users
    if (cluster === 'devnet') {
      throw new ErrorWrapper({code: ERROR_CODE.UNSUPPORTED_CLUSTER});
    }

    this.programAddresses = clusterProgramAddresses[cluster];
    this.connection = connection;
    this.referrerId = referrerId;
  }

  public async signAndConfirmTransaction(
    props: SignAndConfirmTransactionProps,
  ): Promise<TransactionSignature | undefined> {
    const { transaction, wallet, setTxStage } = props;

    try {
      const signed = await wallet.signTransaction(transaction);

      const transactionHash = await this.connection.sendRawTransaction(signed.serialize());

      setTxStage?.({ txStage: TX_STAGE.AWAITING_BLOCK, transactionHash });

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

      const { value: status } = await this.connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionHash,
      });

      if (status?.err) {
        throw status.err;
      }

      setTxStage?.({ txStage: TX_STAGE.SUCCESS });
      return transactionHash;
    } catch (error) {
      console.error(error);
      setTxStage?.({ txStage: TX_STAGE.ERROR });

      throw new ErrorWrapper({error, code: ERROR_CODE.CANNOT_CONFIRM_TRANSACTION});
    }
  }

  public getStSolAccountsForUser = getStSolAccountsForUser.bind(this);

  // Staking functions
  public async stake(props: StakeProps) {
    const { amount, wallet, setTxStage } = props;

    if (wallet.publicKey === null) {
      throw new ErrorWrapper({code: ERROR_CODE.NO_PUBLIC_KEY});
    }

    const { transaction, stSolAccountAddress } = await this.getStakeTransaction({
      amount: +amount,
      payerAddress: new PublicKey(wallet.publicKey),
    });

    setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING, stSolAccountAddress });

    const transactionHash = await this.signAndConfirmTransaction({
      transaction,
      wallet,
      setTxStage,
    });

    return { transactionHash, stSolAccountAddress };
  }

  public getStakeTransaction = getStakeTransaction.bind(this);

  public calculateMaxStakeAmount = calculateMaxStakeAmount.bind(this);

  protected findProgramAddress = findProgramAddress.bind(this);

  protected getDepositInstruction = getDepositInstruction.bind(this);

  // UnStaking functions
  public async unStake(props: StakeProps) {
    const { amount, wallet, setTxStage } = props;

    if (wallet.publicKey === null) {
      throw new ErrorWrapper({code: ERROR_CODE.NO_PUBLIC_KEY});
    }

    const { transaction, deactivatingSolAccountAddress } = await this.getUnStakeTransaction({
      amount: +amount,
      payerAddress: new PublicKey(wallet.publicKey),
    });

    setTxStage?.({ txStage: TX_STAGE.AWAITING_SIGNING, deactivatingSolAccountAddress });

    const transactionHash = await this.signAndConfirmTransaction({
      transaction,
      wallet,
      setTxStage,
    });

    return {
      transactionHash,
      deactivatingSolAccountAddress,
    };
  }

  public getUnStakeTransaction = getUnStakeTransaction.bind(this);

  public calculateMaxUnStakeAmount = calculateMaxUnStakeAmount.bind(this);

  public isUnStakeAvailable = isUnStakeAvailable.bind(this);

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

  public getTotalRewards = getTotalRewards.bind(this);
}
