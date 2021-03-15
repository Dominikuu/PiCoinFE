# PiCoinFE

Situation:
在手機上執行，身為使用者，點開 app 時會跳出畫面，正中間顯示你現在擁有的幣值，右手邊呈現總好友數，當使用者點擊畫面時，視為挖礦行為一次，挖礦後，則 24 小時之內則不可以再進行挖礦的動作，挖礦期間每秒可以得到一塊錢。同一時間也有朋友正在進行挖礦的話，則可以得到 0.25 塊錢。

API
取得用戶朋友的狀態
GET /{user_id}/friends

取得用戶的狀態
GET /{user_id}/mining

開始挖礦
POST /{user_id}/mining

coins: number
activated_time: number
expired_time: number

DB schema

friends:
user_id: string
firend: string[]

mining
user_id: string
expired_time: int
activated_time: int

mining_activate(){
  
}

get_mining_status() {

  return {
    point: null,
    activated_time,
    expired_time
  }
}

get_friends_mining_status() {

}
