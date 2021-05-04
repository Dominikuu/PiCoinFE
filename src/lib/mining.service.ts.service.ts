import { Injectable } from "@angular/core";

import { SocketService } from "./socket.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MiningServiceService {
  miningStatus$: Observable<any>;
  constructor(private socket: SocketService) {
    this.socket.join("notes");

    this.socket.listen("[Mining] Self Activated");
    this.socket.listen("[Mining] Self Expired");
    this.socket.listen("[Mining] Friend Activated");
    this.socket.listen("[Mining] Friend Expired");
  }

  activateMining() {
    this.socket.emit("[Mining] Self Activated");
  }
}
