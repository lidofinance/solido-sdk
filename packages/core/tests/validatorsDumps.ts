import { deserializeUnchecked, serialize } from 'borsh';
import BN from 'bn.js';

import fs from 'fs';
import path from 'path';

import { AccountList, validatorsSchema } from '@/unstake';
import { ValidatorsList } from '@/types';
import { getConnection } from './helpers';
import { VALIDATOR_LIST } from './constants';

const connection = getConnection();

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
  const validatorListResp = await connection.getAccountInfo(VALIDATOR_LIST);

  if (validatorListResp === null) {
    console.log('getAccountInfo of validatorList returned null, try again');
    return;
  }

  const deserializedValidators = deserializeUnchecked(
    validatorsSchema,
    AccountList,
    validatorListResp.data,
  ) as ValidatorsList;

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
