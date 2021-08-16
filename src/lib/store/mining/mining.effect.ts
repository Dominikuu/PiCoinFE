import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { MiningServiceService } from "../../mining.service";
import { MiningActionType } from "./mining.action";
import { FriendsService } from "src/lib/friends.service";

@Injectable()
export class MiningEffects {
  constructor(
    private action$: Actions,
    private miningStatusService: MiningServiceService,
    private friendsService: FriendsService
  ) {}

  @Effect()
  miningEffect$: Observable<Action> = this.action$.pipe(
    ofType(MiningActionType.GetMiningStatus),
    mergeMap(() =>
      this.miningStatusService.get().pipe(
        map((resp) => ({
          type: MiningActionType.GetMiningStatusSuccess,
          miningStatus: resp,
        }))
      )
    )
  );

  @Effect()
  friendsEffect$: Observable<Action> = this.action$.pipe(
    ofType(MiningActionType.GetFriends),
    mergeMap(() =>
      this.friendsService.get().pipe(
        map((resp) => ({
          type: MiningActionType.GetFriendsSuccess,
          friends: resp,
        }))
      )
    )
  );
  @Effect()
  ActivateEffect$: Observable<Action> = this.action$.pipe(
    ofType(MiningActionType.ActivateMining),
    mergeMap(() =>
      this.miningStatusService.post().pipe(
        map((resp) => ({
          type: MiningActionType.GetMiningStatusSuccess,
          miningStatus: resp,
        }))
      )
    )
  );
}
