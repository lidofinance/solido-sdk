import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { TestValidator } from '../updateSnapshot';

export const validators: TestValidator[] = [
  {
    vote_account_address: new PublicKey('69rUCD1qk6hJ3AqEkCi236QaceHTBSv1isiCEW6EZnVa'),
    stake_seeds: { begin: new BN('3'), end: new BN('4') },
    unstake_seeds: { begin: new BN('0'), end: new BN('0') },
    stake_accounts_balance: new BN('15881359081'),
    unstake_accounts_balance: new BN('0'),
    effective_stake_balance: new BN('15881359081'),
    active: 1,
    stake_account_address: new PublicKey('7Z71Y3HQqWzbcQu3DnNVLdShWsBsF5K8yGxKtMtQVUNM'),
  },
  {
    vote_account_address: new PublicKey('AKEi12v5czReh65rUmhBGqvm71vQgRjz4vPrCjnVDSsA'),
    stake_seeds: { begin: new BN('2'), end: new BN('3') },
    unstake_seeds: { begin: new BN('0'), end: new BN('0') },
    stake_accounts_balance: new BN('15844159777'),
    unstake_accounts_balance: new BN('0'),
    effective_stake_balance: new BN('15844159777'),
    active: 1,
    stake_account_address: new PublicKey('2xFUjXVatLehWbjoUc5ogVApKQAUGP3tnY66BJcYhEMi'),
  },
];

export const heaviestValidator = validators[0];

export const reserveAccount = new PublicKey('9zu4upPBBDqbk6upLT4YycwUR9UoXWhs5NfMHeUdTDCv');
export const mintAuthority = new PublicKey('83xtC3WGv1kJXgGo2HFZv7dJSBQshee6HqUvRe9mnrqz');
export const stakeAuthority = new PublicKey('GnLPhRU8vP8kWkExA5s8pmzfr8tZgbyGNPNr7Qxef3Jx');
