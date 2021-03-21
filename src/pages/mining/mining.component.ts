import { Component, OnInit, ViewChild } from "@angular/core";

import { MiningBlockComponent } from "src/blocks/mining-block/mining-block.component";

@Component({
  selector: "app-mining",
  templateUrl: "./mining.component.html",
  styleUrls: ["./mining.component.scss"],
})
export class MiningComponent implements OnInit {
  @ViewChild(MiningBlockComponent, { static: true })
  mining: MiningBlockComponent;
  constructor() {}

  ngOnInit() {}
}
