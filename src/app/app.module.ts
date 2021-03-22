import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { CookieService } from "angular2-cookie/core";
import { MaterialSharedModule } from "src/material-shared.module";

import { environment } from "src/environments/environment";
import { MiningReducer } from "src/lib/store/mining/mining.reducer";
import { MiningEffects } from "src/lib/store/mining/mining.effect";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { WithHeaderPage } from "./outlets/with-header/with-header.component";
import { MasterPage } from "./outlets/master/master.component";

@NgModule({
  declarations: [HeaderComponent, FooterComponent, WithHeaderPage, MasterPage],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialSharedModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),

    AppRoutingModule,
    StoreModule.forRoot({ miningStatus: MiningReducer }),
    EffectsModule.forRoot([MiningEffects]),
  ],
  providers: [CookieService],
  bootstrap: [MasterPage],
})
export class AppModule {}
