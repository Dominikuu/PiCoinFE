import { createAction, props, Action } from "@ngrx/store";
import { MiningStatus, Friends } from "src/lib/store/mining/mining.state";

export enum MiningActionType {
  GetMiningStatus = "GET_MINING_STATUS",
  GetFriends = "GET_FRIENDS",
  GetMiningStatusSuccess = "GET_MINING_STATUS_SUCCESS",
  GetFriendsSuccess = "GET_FRIENDS_SUCCESS",
  ActivateMining = "ACTIVATE_MINING",
}

export const getMiningStatus = createAction(MiningActionType.GetMiningStatus);

export const getFriends = createAction(MiningActionType.GetFriends);

export const activateMining = createAction(MiningActionType.ActivateMining);

export const getMiningStatusSuccess = createAction(
  MiningActionType.GetMiningStatusSuccess,
  props<{ miningStatus: MiningStatus }>()
);

export const getFriendsSuccess = createAction(
  MiningActionType.GetFriendsSuccess,
  props<{ friends: Friends }>()
);
