import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { MaterialSharedModule } from "src/material-shared.module";
import { MiningBlockComponent } from "./mining-block/mining-block.component";

const Blocks = [MiningBlockComponent];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialSharedModule,
    RouterModule,
  ],
  declarations: Blocks,
  exports: Blocks,
})
export class BlockModule {}
