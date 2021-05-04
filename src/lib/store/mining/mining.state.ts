export interface MiningStatus {
  activated_time: number;
  expired_time: number;
  coins: number;
}

export interface MiningStatusState {
  mining_status: MiningStatus;
}

export const initialState: MiningStatusState = { mining_status: null };
