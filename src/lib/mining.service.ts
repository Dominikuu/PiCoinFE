import { Injectable } from "@angular/core";

import { SocketService } from "./socket.service";
import { Observable } from "rxjs";
import { ApiService } from "src/lib/api.service";
import { AuthenticationService } from "src/lib/authenication.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MiningServiceService {
  miningStatus$: Observable<any>;
  constructor(private socket: SocketService, private auth: AuthenticationService, private api: ApiService,) {
    this.socket.join("notes");

    this.socket.listen("[Mining] Self Activated");
    this.socket.listen("[Mining] Self Expired");
    this.socket.listen("[Mining] Friend Activated");
    this.socket.listen("[Mining] Friend Expired");
  }

  get() {
   return this.api
        .get(environment.PI_COIN.backend + `/${this.auth.userId}/mining/`)
  }

  post() {
    return this.api
      .post(environment.PI_COIN.backend + `/${this.auth.userId}/mining/`, {
        activated: true,
      })
  }
}
