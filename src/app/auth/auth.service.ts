import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, BehaviorSubject, tap, throwError } from "rxjs";
import { User } from "./user.model";


export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private signUpURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAHlRt13aFSfVKgKej9pMoo36l6tenvHHc';
    private signInURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAHlRt13aFSfVKgKej9pMoo36l6tenvHHc';

    user = new BehaviorSubject<User>(null);

    private tokenExpirationTimer: any = null;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.signUpURL,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.signInURL,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    autoLogin() {
        const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) return;
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationTime = (new Date(userData._tokenExpirationDate)).getTime() - (new Date().getTime())
            this.autoLogout(expirationTime);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
            );
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errMsg = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => new Error(errMsg));
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errMsg = 'Invalid Email/Password';
                break;
            case 'USER_DISABLED':
                errMsg = 'The user account has been disabled by an administrator';
                break;
            case 'EMAIL_EXISTS':
                errMsg = 'The email address is already in use by another account.';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errMsg = 'Password sign-in is disabled';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errMsg = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
        }
        return throwError(() => new Error(errMsg));
    }

}