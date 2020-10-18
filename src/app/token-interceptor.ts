import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {catchError, switchMap, take, filter, tap} from 'rxjs/operators';
import {AuthService} from './admin/shared/services/auth.service';
import {LoginResponsePayload} from './admin/login-page/login-response.payload';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authService: AuthService) {
  }

  private jwtTokenExpired(): boolean {
    const expiresAt = Number(this.authService.getJwtTokenExpiresAt().toString().replace('.', ''));
    const now = Date.now();
    if ((expiresAt - now) < 1000) {
      return true;
    }
    return false;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if (!this.authService.isLoggedIn()) {          // проверка годности токена на стороне клиента
    //   return next.handle(req);
    // }

    if (req.url.indexOf('refresh') !== -1) {
      // console.log('refresh in intercept ', req);
      return next.handle(req).pipe(tap(response => {
        const resp: HttpResponse<LoginResponsePayload> = response as HttpResponse<LoginResponsePayload>;
        if (resp instanceof HttpResponse) {
          // console.log(resp.body.authenticationToken);
          if (resp.body.refreshToken === 'kickedOut') {
            this.authService.clearJwtToken();
            this.authService.logout();
            throwError('Пользователь отключён');
          }
          // console.log('authenticationToken is ' + resp.body.authenticationToken);
        }
      }));
    }

    if (req.url.indexOf('login') !== -1 || req.url.indexOf('logout') !== -1) {
      return next.handle(req);
    }

    if (this.jwtTokenExpired()) {
      return this.handleAuthErrors(req, next);
    }

    const jwtToken = this.authService.getJwtToken();
    if (jwtToken) {
      return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse
          && error.status === 403) {
          return this.handleAuthErrors(req, next);
        } else {
          return throwError(error);
        }
      }));
    }
    return next.handle(req);

  }

  private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((refreshTokenResponse: LoginResponsePayload) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject
            .next(refreshTokenResponse.authenticationToken);

          if (refreshTokenResponse.refreshToken === 'kickedOut') {
            return next.handle(null);
          }

          return next.handle(this.addToken(req,
            refreshTokenResponse.authenticationToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap((res) => {
          return next.handle(this.addToken(req,
            this.authService.getJwtToken()));
        })
      );
    }
  }

  addToken(req: HttpRequest<any>, jwtToken: any): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization',
        'Bearer ' + jwtToken)
    });
  }

}
