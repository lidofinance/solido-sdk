import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { clusterProgramAddresses } from '@/constants';

export const walletWithStSolTokenAccount = new PublicKey('2Vn1xSUTo292A3knejUeifjt2A3aGNqyn9Svy8Kx8i4J');
export const stSolTokenAccount = new PublicKey('Gwg78Gv1NZN6k4eFSm8pTQUz2bSRcLKbMVm72uYZL9mu');

export const walletWithoutStSolTokenAccount = new PublicKey('EBMf62pD8rcEJ9UeyJ4ghdm7hXpgVQCptkKdcmZ9eoJn');

export const examplePDAAccount = new PublicKey('BFH9gd1KGXYtVdYMe1TNnq9Pc2jRWJ2nN9fqFkyFcayN');

export const CLUSTER = 'testnet';

export const VALIDATOR_LIST = clusterProgramAddresses[CLUSTER].validatorList;

export const RENT_EXEMPT_LAMPORTS = 0.0022 * LAMPORTS_PER_SOL;
