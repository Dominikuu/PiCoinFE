import { createSelector } from "@ngrx/store";
import { FriendsSum, MiningState, MiningStatus } from "./mining.state";

const getFriends = (state: MiningState): FriendsSum => {
  return {
    activated_count: Object.values(state.friends || {}).reduce(
      (sum, isActivated) => {
        return isActivated ? (sum += 1) : sum;
      },
      0
    ),
    total: Object.keys(state.friends || {}).length,
  };
};
const getMiningStatus = (state: MiningState): MiningStatus =>
  state.mining_status;

const getStateFriends = createSelector(
  (state: any) => state.miningState,
  getFriends
);

const getStateMiningStatus = createSelector(
  (state: any) => state.miningState,
  getMiningStatus
);

export { getStateFriends, getStateMiningStatus };
