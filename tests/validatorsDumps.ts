import { Connection } from '@solana/web3.js';

import fs from 'fs';
import path from 'path';

import { validatorList } from './data/snapshot';
import { deserializeUnchecked, serialize } from 'borsh';
import { AccountList, validatorsSchema } from '@/unstake';
import { ValidatorsList } from '@/types';
import BN from 'bn.js';

const connection = new Connection(
  'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
);

const serializeAndSaveToFile = async (deserializedValidators, namePostFix: string) => {
  const serializedValidators = serialize(validatorsSchema, deserializedValidators);
  //@ts-ignore
  const { data } = serializedValidators.toJSON();

  const validatorsListJson = JSON.stringify({ data });

  const filename = `validator_list${namePostFix}.json`;
  fs.writeFileSync(path.join(__dirname, 'data', filename), validatorsListJson, 'utf-8');

  console.log(`Done ${filename}`);
};

const updateValidatorListDump = async () => {
  const validatorListResp = await connection.getAccountInfo(validatorList);

  if (validatorListResp === null) {
    console.log('getAccountInfo of validatorList returned null, try again');
    return;
  }

  const deserializedValidators = deserializeUnchecked(
    validatorsSchema,
    AccountList,
    validatorListResp.data,
  ) as any as ValidatorsList;

  await serializeAndSaveToFile(deserializedValidators, '_full');

  // Deactivate validators
  deserializedValidators.entries.forEach((validator) => {
    validator.active = false;
  });
  await serializeAndSaveToFile(deserializedValidators, '_inactive');

  // Set effective stake balances to 0
  deserializedValidators.entries.forEach((validator) => {
    validator.effective_stake_balance = new BN(0);
    validator.active = true;
  });
  await serializeAndSaveToFile(deserializedValidators, '_zero_balance');

  deserializedValidators.entries = [];
  await serializeAndSaveToFile(deserializedValidators, '_empty');
};

void updateValidatorListDump();