import { Cluster } from '@solana/web3.js';

import {
  stake,
  getDepositInstruction,
  findProgramAddress
} from '@/stake';
import { ProgramAddresses } from '@/types';
import { clusterProgramAddresses } from '@/constants';

export { default as LidoStakeBanner } from './banner';

export class SolidoSDK {
  programAddresses: ProgramAddresses;

  constructor(cluster: Cluster) {
    this.programAddresses = clusterProgramAddresses[cluster];
  }


  // Staking functions
  public stake = stake.bind(this);
  protected findProgramAddress = findProgramAddress.bind(this);
  protected getDepositInstruction = getDepositInstruction.bind(this);
}
