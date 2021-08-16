import { createReducer, on, Action } from "@ngrx/store";
import { Effect, Actions } from "@ngrx/effects";
import { initialState, MiningState } from "./mining.state";
import * as MiningActions from "./mining.action";

export const reducer = createReducer(
  initialState,
  on(MiningActions.getMiningStatusSuccess, (state, action) => ({
    mining_status: action.miningStatus,
    friends: state.friends,
  })),
  on(MiningActions.getFriendsSuccess, (state, action) => ({
    friends: action.friends,
    mining_status: state.mining_status,
  }))
);

export function MiningReducer(
  state: MiningState | undefined,
  action: Action
): MiningState {
  return reducer(state, action);
}
