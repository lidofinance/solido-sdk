import { Connection } from '@solana/web3.js';

import {
  createTransaction,
  findProgramAddress,
  getAccountInfo,
  getStSolAccountsForUser,
  getValidaror,
  getValidatorList,
  getValidatorStakeAccountAddress,
  getValidatorsData,
  getValidatorsWithBalance,
  signAndConfirmTransaction,
} from '@/general';
import { calculateMaxStakeAmount, getDepositInstruction, getStakeTransaction, stake } from '@/stake';
import {
  getExchangeRate,
  getLidoStatistics,
  getMarketCap,
  getStakersCount,
  getStakingRewardsFee,
  getTotalRewards,
  getTotalStaked,
  getTransactionCost,
  getTransactionInfo,
} from '@/statistics';
import {
  calculateMaxUnStakeAmount,
  calculateMinUnStakeAmount,
  getUnStakeTransaction,
  getWithdrawInstruction,
  getWithdrawInstructions,
  isUnStakeAvailable,
  prepareUnstake,
  unStake,
} from '@/unstake';
import { getStakeAccounts, getWithdrawTransaction, isSolidoStakeAccount, withdraw } from '@/withdraw';

import { LidoVersion, clusterProgramAddresses } from '@/constants';
import { ProgramAddresses, SupportedClusters } from '@/types';
import { withCache } from '@/utils/withCache';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

export {
  INSTRUCTION,
  LidoVersion,
  MAINNET_PROGRAM_ADDRESSES,
  MAX_WITHDRAW_COUNT,
  TESTNET_PROGRAM_ADDRESSES,
  TX_STAGE,
} from '@/constants';
export * from '@/utils/formatters';
export * from '@/utils/getValidatorMaxUnstakeAmount';
export { getStakeApy } from '@common/stakeApy';
export { SupportedClusters };

export class SolidoSDK {
  protected connection: Connection;

  protected referrerId?: string;

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

  public signAndConfirmTransaction = signAndConfirmTransaction.bind(this);

  public getStSolAccountsForUser = getStSolAccountsForUser.bind(this);

  public createTransaction = createTransaction.bind(this);

  // Staking functions
  public stake = stake.bind(this);

  public getStakeTransaction = getStakeTransaction.bind(this);

  public calculateMaxStakeAmount = calculateMaxStakeAmount.bind(this);

  protected findProgramAddress = findProgramAddress.bind(this);

  protected getDepositInstruction = getDepositInstruction.bind(this);

  // UnStaking functions
  public unStake = unStake.bind(this);

  public getUnStakeTransaction = getUnStakeTransaction.bind(this);

  public calculateMaxUnStakeAmount = calculateMaxUnStakeAmount.bind(this);

  public calculateMinUnStakeAmount = calculateMinUnStakeAmount.bind(this);

  public isUnStakeAvailable = isUnStakeAvailable.bind(this);

  protected getWithdrawInstruction = getWithdrawInstruction.bind(this);

  protected getValidatorList = getValidatorList.bind(this);

  protected getValidatorStakeAccountAddress = getValidatorStakeAccountAddress.bind(this);

  protected getWithdrawInstructions = getWithdrawInstructions.bind(this);

  public prepareUnstake = prepareUnstake.bind(this);

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

  // General
  protected getAccountInfo = withCache(getAccountInfo.bind(this), 'solidoAccountInfo', 7 * 1000);

  public getValidatorsData = getValidatorsData.bind(this);

  public getValidatorsWithBalance = getValidatorsWithBalance.bind(this);

  public getValidaror = getValidaror.bind(this);
}
