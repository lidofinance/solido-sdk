import fs from 'fs';
import path from 'path';
import { inspect } from 'util';

import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { findProgramAddress, getValidatorList, getValidatorStakeAccountAddress } from '@/general';
import { SolidoSDK } from '@/index';
import { Validator } from '@/types';
import { CLUSTER } from './constants';
import { getConnection } from './helpers';

export type TestValidator = Validator & { stake_account_address: PublicKey };

const connection = getConnection();
const sdk = new SolidoSDK(CLUSTER, connection);

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
  const validators = await getValidatorList.call(sdk);

  const validatorsToDump: TestValidator[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const validator of validators) {
    const { vote_account_address } = validator;

    validatorsToDump.push({
      ...validator,
      vote_account_address,
      stake_account_address: await getValidatorStakeAccountAddress.call(sdk, validator),
    });
  }

  let rawString = inspect(validatorsToDump);

  // Replace the ugly <BN: ...> public keys with readable ones
  rawString = rawString.replace(
    /PublicKey {\s+_bn: <BN: (\w+)>\s+}/g,
    (_match, tag: string) => `new PublicKey('${new PublicKey(new BN(tag.trim(), 'hex')).toString()}')`,
  );

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
