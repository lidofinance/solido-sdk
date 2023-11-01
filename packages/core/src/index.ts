import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';

import {
  AccountInfoV2,
  ProgramAddresses,
  SignAndConfirmTransactionProps,
  StakeProps,
  SupportedClusters,
} from '@/types';
import { clusterProgramAddresses, LidoVersion, TX_STAGE } from '@/constants';
import { ERROR_CODE } from '@common/constants';

import {
  calculateMaxStakeAmount,
  findProgramAddress,
  getDepositInstruction,
  getStakeTransaction,
} from '@/stake';
import {
  calculateMaxUnStakeAmount,
  calculateMinUnStakeAmount,
  calculateStakeAccountAddress,
  getAccountInfo,
  getUnStakeTransaction,
  getWithdrawInstruction,
  isUnStakeAvailable,
} from '@/unstake';
import { getValidatorList } from '@/unstake/getValidatorList';

import { getStakeAccounts, getWithdrawTransaction, isSolidoStakeAccount, withdraw } from '@/withdraw';

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
import { ErrorWrapper } from '@common/errorWrapper';

export { getStakeApy } from '@common/stakeApy';
export {
  MAINNET_PROGRAM_ADDRESSES,
  TESTNET_PROGRAM_ADDRESSES,
  INSTRUCTION,
  TX_STAGE,
  MAX_WITHDRAW_COUNT,
  LidoVersion,
} from '@/constants';
export * from '@/utils/formatters';
export { SupportedClusters };

export class SolidoSDK {
  protected connection: Connection;

  protected referrerId?: string;

  protected solidoAccountInfo?: AccountInfoV2;

  public lidoVersion: LidoVersion = LidoVersion.v2;

  public programAddresses: ProgramAddresses;

  constructor(cluster: SupportedClusters, connection: Connection, referrerId?: string) {
    // @ts-expect-error for js users
    if (cluster === 'devnet') {
      throw new ErrorWrapper({ code: ERROR_CODE.UNSUPPORTED_CLUSTER });
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

      throw new ErrorWrapper({ error, code: ERROR_CODE.CANNOT_CONFIRM_TRANSACTION });
    }
  }

  public getStSolAccountsForUser = getStSolAccountsForUser.bind(this);

  // Staking functions
  public async stake(props: StakeProps) {
    const { amount, wallet, setTxStage, allowOwnerOffCurve } = props;

    if (wallet.publicKey === null) {
      throw new ErrorWrapper({ code: ERROR_CODE.NO_PUBLIC_KEY });
    }

    const { transaction, stSolAccountAddress } = await this.getStakeTransaction({
      amount: +amount,
      payerAddress: new PublicKey(wallet.publicKey),
      allowOwnerOffCurve,
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
      throw new ErrorWrapper({ code: ERROR_CODE.NO_PUBLIC_KEY });
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

  public calculateMinUnStakeAmount = calculateMinUnStakeAmount.bind(this);

  public isUnStakeAvailable = isUnStakeAvailable.bind(this);

  protected getWithdrawInstruction = getWithdrawInstruction.bind(this);

  protected getAccountInfo = getAccountInfo.bind(this);

  protected getValidatorList = getValidatorList.bind(this);

  protected calculateStakeAccountAddress = calculateStakeAccountAddress.bind(this);

  // Withdraw functions

  protected isSolidoStakeAccount = isSolidoStakeAccount.bind(this);

  protected getWithdrawTransaction = getWithdrawTransaction.bind(this);

  public getStakeAccounts = getStakeAccounts.bind(this);

  public withdraw = withdraw.bind(this);

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
