import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';

export class Lamports {
  lamports: BN;

  constructor(lamports: number | string | BN) {
    this.lamports = new BN(lamports);
  }
}

/**
 * Program addresses for the program deployment
 */
export interface ProgramAddresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}
