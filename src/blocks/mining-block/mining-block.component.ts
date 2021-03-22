import { Component, OnInit } from "@angular/core";
import { cloneDeep } from "lodash";
import { ApiService } from "src/lib/api.service";
import {
  AuthenticationService,
  LogStatus,
} from "src/lib/authenication.service";
import { environment } from "src/environments/environment";
import { DEFAULT_COUNTDOWN, PERIMETER } from "./mining-block.definition";
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

  constructor(private api: ApiService, private auth: AuthenticationService) {
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

  async getCurrentMining() {
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
    this.points = points;
    this.executeCountdown();
  }

  async getFriendsList() {
    const resp = await this.api
      .get(environment.PI_COIN.backend + `/${this.auth.userId}/friends/`)
      .toPromise();
    this.friends = resp;
  }

  onRefreshBtnClick() {
    this.getCurrentMining();
    this.getFriendsList();
  }

  async activateMining() {
    const resp = await this.api
      .post(environment.PI_COIN.backend + `/${this.auth.userId}/mining/`, {
        activated: true,
      })
      .toPromise();
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
