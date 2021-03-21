# PiCoinFE

Situation:
在手機上執行，身為使用者，點開 app 時會跳出畫面，正中間顯示你現在擁有的幣值，右手邊呈現總好友數，當使用者點擊畫面時，視為挖礦行為一次，挖礦後，則 24 小時之內則不可以再進行挖礦的動作，挖礦期間每秒可以得到一塊錢。同一時間也有朋友正在進行挖礦的話，則可以得到 0.25 塊錢。

### GUI
Login
Ready for mining
Mining

### API
Get friend id list
- GET /{user_id}/friends

Get user's mining status (including coin, activate time and expired time)
- GET /{user_id}/mining

Start mining
- POST /{user_id}/mining


### Setup procedure
1. Install node-module
```
npm install
```

2. Set up backend service on VM
3. Check environment variable for Backend host
```
# /src/environment/environment.ts
# /src/environment/environment.prod.ts
export const environment = {
  production: true,
  PI_COIN: {
    backend: {{YOUR_BACKEND_DOMAIN}},
  },
};
```
5. Run Angular application
```
# Debug mode
ng serve
# Prod mode
ng build
