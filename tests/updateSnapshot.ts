import fs from 'fs';
import path from 'path';
import util from 'util';

import BN from 'bn.js';
import { Connection, PublicKey } from '@solana/web3.js';

import { SolidoSDK } from '@/index';
import { calculateStakeAccountAddress, getAccountInfo } from '@/unstake';
import { Validator } from '@/types';
import { findProgramAddress } from '@/stake';

export type TestValidator = Validator & { stake_account_address: PublicKey };

const cluster = 'testnet';
const connection = new Connection(
  'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
);
const sdk = new SolidoSDK(cluster, connection);

const toPublicKeyStrVar = (varObj: { [key: string]: PublicKey }) => {
  const [name, value] = Object.entries(varObj)[0];

  return `export const ${name} = new PublicKey('${value.toString()}');`;
};

const programAddresses = async () => {
  const reserveAccount = await findProgramAddress.call(sdk, 'reserve_account');
  const mintAuthority = await findProgramAddress.call(sdk, 'mint_authority');
  const stakeAuthority = await findProgramAddress.call(sdk, 'stake_authority');

  return `
  ${toPublicKeyStrVar({ reserveAccount })}
  ${toPublicKeyStrVar({ mintAuthority })}
  ${toPublicKeyStrVar({ stakeAuthority })}
  `;
};

const updateSnapshot = async () => {
  const { validators } = await getAccountInfo.call(sdk);

  const validatorsToDump: TestValidator[] = [];
  for (let validator of validators) {
    const { vote_account_address } = validator;

    const stake_account_address = await calculateStakeAccountAddress.call(sdk, validator);

    validatorsToDump.push({
      ...validator,
      vote_account_address: new PublicKey(vote_account_address),
      stake_account_address,
    });
  }

  let rawString = util.inspect(validatorsToDump);

  // Replace the ugly <BN: ...> public keys with readable ones
  rawString = rawString.replace(/PublicKey {\s+_bn: <BN: (\w+)>\s+}/g, (_match, tag: string) => {
    return `new PublicKey('${new PublicKey(new BN(tag.trim(), 'hex')).toString()}')`;
  });

  // Removed all type inferences
  // eg., reward_distribution: RewardDistribution {...}
  rawString = rawString.replace(/: \w+ {/g, ': {');

  // Replaced all big numbers to their values
  // <BN: 1> => new BN("1")
  rawString = rawString.replace(/<BN: (\w+)>/g, (_, tag: string) => {
    const parsedNumber = new BN(tag.trim(), 'hex').toString();
    return `new BN('${parsedNumber}')`;
  });

  // Update index of heaviestValidator manually
  rawString = `import BN from 'bn.js';
  import { PublicKey } from '@solana/web3.js';
  import { TestValidator } from '../updateSnapshot';
  
  export const validators: TestValidator[] = ${rawString};

  export const heaviestValidator = validators[0];
  
  ${await programAddresses()}
  `;

  fs.writeFileSync(path.join(__dirname, 'data', 'snapshot.ts'), rawString, 'utf-8');
};

void updateSnapshot();
