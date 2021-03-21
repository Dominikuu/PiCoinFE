import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { environment } from "src/environments/environment";
import { WithHeaderPage } from "src/app/outlets/with-header/with-header.component";

import { AuthGuard } from "src/lib/authenication.guard";

const RedirectChildren: Routes = [];

const WithHeaderChildren: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../pages/with-header.module").then((m) => m.WithHeaderModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: "",
          component: WithHeaderPage,
          children: WithHeaderChildren,
        },
      ],
      { useHash: true }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
