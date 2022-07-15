import { Cluster, Connection } from '@solana/web3.js';

import {
  stake,
  getDepositInstruction,
  findProgramAddress,
  getStakeTransaction,
} from '@/stake';
import { ProgramAddresses } from '@/types';
import { clusterProgramAddresses } from '@/constants';
import { getWithdrawInstruction, unStake } from '@/unstake';

export { default as LidoStakeBanner } from './banner';

export class SolidoSDK {
  programAddresses: ProgramAddresses;
  connection: Connection;

  constructor(cluster: Cluster, connection: Connection) {
    this.programAddresses = clusterProgramAddresses[cluster];
    this.connection = connection;
  }


  // Staking functions
  public stake = stake.bind(this);
  public getStakeTransaction = getStakeTransaction.bind(this);
  protected findProgramAddress = findProgramAddress.bind(this);
  protected getDepositInstruction = getDepositInstruction.bind(this);


  // UnStaking functions
  public unStake = unStake.bind(this);
  public getWithdrawInstruction = getWithdrawInstruction.bind(this);
}
