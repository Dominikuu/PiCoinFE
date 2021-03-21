import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { CookieService } from "angular2-cookie/core";
import { MaterialSharedModule } from "src/material-shared.module";

import { environment } from "src/environments/environment";
// import { TelemetryModule } from "src/lib/telemetry/telemetry.module";
import { AppRoutingModule } from "./app-routing.module";
// import { CoconutApiModule } from "src/lib/service/api.module";
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
  ],
  providers: [CookieService],
  bootstrap: [MasterPage],
})
export class AppModule {}
