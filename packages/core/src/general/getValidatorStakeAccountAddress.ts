import { PublicKey } from '@solana/web3.js';
import { Validator } from '@/types';
import { SolidoSDK } from '@/index';
import { biToUint8Array } from '@/utils/biToUint8Array';
import { getHeaviestValidator } from '@/general';

export async function getValidatorStakeAccountAddress(this: SolidoSDK, heaviestValidator?: Validator) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;

  let validator = heaviestValidator;
  if (!validator) {
    const validators = await this.getValidatorList();
    validator = getHeaviestValidator(validators);
  }

  const validatorVoteAccount = new PublicKey(validator.vote_account_address);
  const seed = validator.stake_seeds.begin;

  const bufferArray = [
    solidoInstanceId.toBuffer(),
    validatorVoteAccount.toBuffer(),
    Buffer.from('validator_stake_account'),
    biToUint8Array(seed),
  ];

  const [stakeAccountAddress] = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return stakeAccountAddress;
}
