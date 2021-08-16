import { createReducer, on, Action } from "@ngrx/store";
import { initialState, MiningStatusState } from "./mining.state";
import * as MiningActions from "./mining.action";

export const reducer = createReducer(
  initialState,
  on(MiningActions.addTodo, (state, action) => ({
    mining_status: null,
  }))
);

export function MiningReducer(
  state: MiningStatusState | undefined,
  action: Action
): MiningStatusState {
  return reducer(state, action);
}
