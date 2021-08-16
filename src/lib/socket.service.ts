import { Injectable } from "@angular/core";

import * as socketio from "socket.io-client";
import { environment } from "../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  connected$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket = socketio.connect(
      environment.PI_COIN.socket,
      environment.PI_COIN.config
    );
    // console.log(this.socket.connect());
    // this.socket.on("connection", () => this.connected$.next(true));
    // this.socket.on("disconnect", () => this.connected$.next(false));
  }

  join(room: string) {
    // auto rejoin after reconnect mechanism
    this.connected$.subscribe((connected) => {
      if (connected) {
        this.socket.emit("join", { room });
      }
    });
  }

  disconnect() {
    this.socket.disconnect();
    this.connected$.next(false);
  }

  emit(event: string, data?: any) {
    console.group();
    console.log("----- SOCKET OUTGOING -----");
    console.log("Action: ", event);
    console.log("Payload: ", data);
    console.groupEnd();

    this.socket.emit(event, data);
  }

  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        console.group();
        console.log("----- SOCKET INBOUND -----");
        console.log("Action: ", event);
        console.log("Payload: ", data);
        console.groupEnd();

        observer.next(data);
      });
      // dispose of the event listener when unsubscribed
      return () => this.socket.off(event);
    });
  }
}
