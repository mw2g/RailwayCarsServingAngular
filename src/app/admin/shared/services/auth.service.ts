import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LoginResponsePayload} from '../../login-page/login-response.payload';
import {LoginRequestPayload} from '../../login-page/login-request.payload';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
    @Output() username: EventEmitter<string> = new EventEmitter();

    public error$: Subject<string> = new Subject<string>();

    constructor(private httpClient: HttpClient,
                private router: Router,
                private localStorage: LocalStorageService) {
    }

    login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
        return this.httpClient.post<LoginResponsePayload>(`${environment.dbUrl}/api/auth/login`,
            loginRequestPayload).pipe(map(data => {
            this.localStorage.store('authenticationToken', data.authenticationToken);
            this.localStorage.store('username', data.username);
            this.localStorage.store('userInitials', data.userInitials);
            this.localStorage.store('refreshToken', data.refreshToken);
            this.localStorage.store('expiresAt', data.expiresAt);
            this.loggedIn.emit(true);
            this.username.emit(data.username);
            return true;
        }), catchError(this.handleError.bind(this)));
    }

    getJwtToken(): string {
        return this.localStorage.retrieve('authenticationToken');
    }

    clearJwtToken(): void {
        this.localStorage.clear('authenticationToken');
    }

    refreshToken(): Observable<LoginResponsePayload> {
        return this.httpClient.post<LoginResponsePayload>(`${environment.dbUrl}/api/auth/refresh/token`,
            {refreshToken: this.getRefreshToken(), username: this.getUsername()})
            .pipe(tap(response => {
                if (response.refreshToken !== 'kickedOut') {
                    this.localStorage.clear('authenticationToken');
                    this.localStorage.clear('expiresAt');
                    this.localStorage.store('authenticationToken',
                        response.authenticationToken);
                    this.localStorage.store('expiresAt', response.expiresAt);
                }
            }));
    }

    logout(): void {
        this.httpClient.post(`${environment.dbUrl}/api/auth/logout`,
            {refreshToken: this.getRefreshToken(), username: this.getUsername()},
            {responseType: 'text'})
            .subscribe(data => {
                this.localStorage.clear('authenticationToken');
                this.localStorage.clear('username');
                this.localStorage.clear('userInitials');
                this.localStorage.clear('refreshToken');
                this.localStorage.clear('expiresAt');
                console.log(data);
            }, error => {
                throwError(error);
            });

        this.router.navigate(['/admin', 'login']);
    }

    getUsername(): any {
        return this.localStorage.retrieve('username');
    }

    getUserInitials(): any {
        return this.localStorage.retrieve('userInitials');
    }

    getRefreshToken(): any {
        return this.localStorage.retrieve('refreshToken');
    }

    getJwtTokenExpiresAt(): any {
        return this.localStorage.retrieve('expiresAt');
    }

    isLoggedIn(): boolean {
        return this.getJwtToken() != null;
    }


    private handleError(error: HttpErrorResponse): Observable<never> {
        const message = error.error.error.toString();

        switch (message) {
            case 'Forbidden':
                this.error$.next('Неверные данные');
                break;
            case 'INVALID_TOKEN':
                this.error$.next('Войдите заново+');
                break;
            case 'INVALID_USERNAME':
                this.error$.next('Неверное имя пользователя');
                break;
            case 'INVALID_PASSWORD':
                this.error$.next('Неверный пароль');
                break;
        }
        return throwError(error);
    }
}
