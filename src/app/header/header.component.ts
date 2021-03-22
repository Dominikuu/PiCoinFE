import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";

import { CookieService } from "angular2-cookie/core";

import {
  AuthenticationService,
  LandingType,
  LogStatus,
} from "src/lib/authenication.service";

export enum LoginWithSocial {
  FACEBOOK = "Facebook",
  INSTAGRAM = "Instagram",
  GITHUB = "Github",
}

@Component({
  selector: "ccn-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("landing", { static: false }) landingDiloag: TemplateRef<any>;

  form: FormGroup;

  landingType: LandingType = LandingType.Login;

  isLoggedIn: boolean = false;

  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    public cookieservice: CookieService,
    private cdr: ChangeDetectorRef
  ) {}
  get f() {
    return this.form.controls;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cdr.detectChanges();
    if (!this.isLoggedIn) {
      this.openDialog();
    }
    this.authService.logStatus$.subscribe((logStatus) => {
      if (logStatus === LogStatus.UnAuth) {
        this.openDialog();
      }
    });
  }

  private setForm(): void {
    const formGroup =
      this.landingType === LandingType.Login
        ? {
            email: ["", Validators.required],
            password: ["", Validators.required],
          }
        : {
            email: ["", Validators.required],
            username: ["", Validators.required],
            password: ["", Validators.required],
          };
    this.form = this.formBuilder.group(formGroup);
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.landingDiloag, {
      disableClose: true,
    });
    this.setForm();
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

    this.authService.logStatus$.subscribe((logStatus) => {
      this.isLoggedIn = logStatus === "SUCESS";

      if (this.isLoggedIn && this.dialog && this.form.valid) {
        this.dialog.closeAll();
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    const existed_account = this.form.value;
    this.authService.takeAuthAction(existed_account, this.landingType);
  }
  onSignup(): void {
    if (this.form.invalid) {
      return;
    }
    const new_account = this.form.value;
    this.authService.takeAuthAction(new_account, this.landingType);
  }

  onLogout(): void {
    this.authService.logout();
    this.openDialog();
  }

  switchLandingType(landingType: string) {
    this.landingType = LandingType[landingType];
    this.setForm();
  }
}
