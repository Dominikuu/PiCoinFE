import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

import { MaterialSharedModule } from "src/material-shared.module";
import { BlockModule } from "src/blocks/block.module";

import { MiningComponent } from "src/pages/mining/mining.component";

const routes: Routes = [
  { path: "", redirectTo: "/mining", pathMatch: "full" },
  {
    path: "mining",
    component: MiningComponent,
  },
];

@NgModule({
  declarations: [MiningComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BlockModule,
    MaterialSharedModule,
    // route
    RouterModule.forChild(routes),
  ],
})
export class WithHeaderModule {}
