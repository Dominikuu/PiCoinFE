export interface MiningStatus {
  activated_time: number;
  expired_time: number;
  points: number;
}

export interface Friends {
  [key: string]: boolean;
}

export interface MiningState {
  mining_status: MiningStatus;
  friends: Friends;
}

export const initialState: MiningState = { mining_status: null, friends: null };

export interface FriendsSum {
  activated_count: number;
  total: number;
}
