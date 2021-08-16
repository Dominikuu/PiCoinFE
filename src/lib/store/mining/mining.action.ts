import { createAction, props, Action } from "@ngrx/store";
import { MiningStatus } from "src/lib/store/mining/mining.state";

export enum MiningActionType {
  Get = "GET",
  GetSuccess = "GET_SUCCESS",
  Add = "ADD",
  Toggle = "TOGGLE",
  Saved = "SAVED",
  Error = "ERROR",
}

export const getTodo = createAction(MiningActionType.Get);

export const getSuccessTodo = createAction(
  MiningActionType.GetSuccess,
  props<{ miningStatus: MiningStatus }>()
);

export const addTodo = createAction(
  MiningActionType.Add,
  props<{ text: string }>()
);

export const toggleTodo = createAction(
  MiningActionType.Toggle,
  props<{ index: number }>()
);

export const savedTodo = createAction(
  MiningActionType.Saved,
  props<{ index: number }>()
);

export const errorTodo = createAction(MiningActionType.Error, props<Error>());

export interface AddAction extends Action {
  type: "ADD";
  text: string;
}
