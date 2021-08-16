import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ApiService } from "src/lib/api.service";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "src/lib/authenication.service";
@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private api: ApiService, private auth: AuthenticationService) { }

  get(): Observable<any> {
    return  this.api
    .get(environment.PI_COIN.backend + `/${this.auth.userId}/friends/`)

  }
}
