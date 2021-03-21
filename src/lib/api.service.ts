import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "src/lib/authenication.service";
import { CookieService } from "ngx-cookie-service";
import { throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private prepareHeaders() {
    let headers = new HttpHeaders();
    if (this.authService.token != null) {
      headers = headers.append("Content-Type", "application/json");
      headers = headers.append("X-CSRFToken", this.authService.token);
      headers = headers.append(
        "Authorization",
        `jwt ${this.authService.token}`
      );
    }
    return headers;
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(path, { headers: this.prepareHeaders() })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(path, JSON.stringify(body), { headers: this.prepareHeaders() })
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(path, JSON.stringify(body), { headers: this.prepareHeaders() })
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(path).pipe(catchError(this.formatErrors));
  }
}
