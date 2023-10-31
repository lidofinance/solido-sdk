import { StakeAccountDelegation, StakeAccountState } from '@/types';
import BN from 'bn.js';

const DEACTIVATION_GAP = 3; // 3 epochs to deactivate

export const calcStakeAccountState = (epoch: number, delegation: StakeAccountDelegation) => {
  const activationEpoch = new BN(delegation.activationEpoch);
  const deactivationEpoch = new BN(delegation.deactivationEpoch);

  if (activationEpoch.gten(epoch)) return StakeAccountState.activating;
  if (deactivationEpoch.ltn(epoch)) return StakeAccountState.inactive;
  if (deactivationEpoch.ltn(epoch + DEACTIVATION_GAP)) return StakeAccountState.deactivating;

  return StakeAccountState.active;
};
