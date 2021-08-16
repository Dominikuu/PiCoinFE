import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { cloneDeep } from "lodash";
import { ApiService } from "src/lib/api.service";
import {
  AuthenticationService,
  LogStatus,
} from "src/lib/authenication.service";
import { MiningStatusState } from "src/lib/store/mining/mining.state";
import { SocketService } from "src/lib/socket.service";
import { SocketEvent } from "src/lib/socket.definition";
import { environment } from "src/environments/environment";
import { DEFAULT_COUNTDOWN, PERIMETER } from "./mining-block.definition";
import { Observable, interval, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
@Component({
  selector: "mining-block",
  templateUrl: "./mining-block.component.html",
  styleUrls: ["./mining-block.component.scss"],
})
export class MiningBlockComponent implements OnInit {
  friends = [];
  points: number;
  remain = cloneDeep(DEFAULT_COUNTDOWN);
  totalLength = PERIMETER;
  expired_time: number = null;
  expired_date: string = "";
  activated_time: number = null;

  points$: Observable<number>;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private socketService: SocketService,
    private store: Store<{ miningStatus: MiningStatusState }>
  ) {
    this.auth.logStatus$.subscribe((logStatus) => {
      if (logStatus === LogStatus.LoginSuccess) {
        this.getCurrentMining();
        this.getFriendsList();
      }
    });
  }
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.getCurrentMining();
      this.getFriendsList();
    }

    this.inintMiningSocket();
  }

  private inintMiningSocket() {
    // Emit socket event to Server
    this.emitSocketEvent(SocketEvent.Init);
    // Listen socket event from Server
    this.socketService.listen(SocketEvent.FriendActivated).subscribe((data) => {
      this.getCurrentMining();
    });
    this.socketService
      .listen(SocketEvent.FriendExpired)
      .subscribe((data) => console.log(data));
    this.socketService
      .listen(SocketEvent.SelfExpired)
      .subscribe((data) => console.log(data));
  }

  private executeCountdown() {
    this.draw();
    setInterval(() => {
      this.draw();
    }, 1000);
    this.countdown();
  }

  private epochToDateFormat(epoch: number): string {
    const date = new Date(epoch);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private emitSocketEvent(event: SocketEvent): void {
    this.socketService.emit(event, this.auth.userId);
  }

  async getCurrentMining(): Promise<void> {
    try {
      const resp = await this.api
        .get(environment.PI_COIN.backend + `/${this.auth.userId}/mining/`)
        .toPromise();
      this.updateMiningStatus(resp);
    } catch (e) {
      this.auth.logout();
    }
  }

  updateMiningStatus({ expired_time, activated_time, points }) {
    this.expired_time = expired_time;
    this.activated_time = activated_time;
    this.expired_date = expired_time
      ? this.epochToDateFormat(expired_time)
      : null;
    if (expired_time) {
      this.points$ = interval(1000).pipe(
        map((s) => s * (0.25 * this.friends.length + 1) + points)
      );
    } else {
      this.points$ = new BehaviorSubject<any>(points);
    }
    this.executeCountdown();
  }

  async getFriendsList(): Promise<void> {
    const resp = await this.api
      .get(environment.PI_COIN.backend + `/${this.auth.userId}/friends/`)
      .toPromise();
    this.friends = resp;
  }

  onRefreshBtnClick(): void {
    this.getCurrentMining();
    this.getFriendsList();
  }

  async activateMining() {
    const resp = await this.api
      .post(environment.PI_COIN.backend + `/${this.auth.userId}/mining/`, {
        activated: true,
      })
      .toPromise();
    this.emitSocketEvent(SocketEvent.FriendActivated);
    this.updateMiningStatus(resp);
  }

  draw() {
    const circle = document.getElementById("circle");
    const now = new Date().getTime();
    const distance = now - this.activated_time;
    circle.style.strokeDasharray = `${
      (distance / (24 * 60 * 60 * 1000)) * this.totalLength
    } ${this.totalLength}`;
  }

  countdown() {
    if (!this.expired_time) {
      this.remain = cloneDeep(DEFAULT_COUNTDOWN);
      return;
    }
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.expired_time - now;
      if (distance < 0) {
        clearInterval(x);
      } else {
        this.remain.h = Math.floor((distance % day) / hour);
        this.remain.m = Math.floor((distance % hour) / minute);
        this.remain.s = Math.floor((distance % minute) / second);
      }
    }, 1000);
  }
}
