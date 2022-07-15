import BN from 'bn.js';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { TX_STAGE } from '@/constants';

export class Lamports {
  lamports: BN;

  constructor(lamports: number | string | BN) {
    this.lamports = new BN(lamports);
  }
}

export type SignAndConfirmTransactionProps = {
  transaction: Transaction;
  wallet: SignerWalletAdapter;
  setTxStage?: (txStage: TX_STAGE) => void;
};

export interface ProgramAddresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}

export type InstructionStruct = {
  instruction: number;
  amount: BN;
};
