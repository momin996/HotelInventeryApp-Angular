import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, (new Date(expirationDate)));
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({ email, userId, token, expirationDate });
}

const handleError = (errorRes: any) => {
    let errMsg = 'An unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errMsg));
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
    return of(new AuthActions.AuthenticateFail(errMsg));
}

@Injectable()
export class AuthEffects {

    private signUpURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAHlRt13aFSfVKgKej9pMoo36l6tenvHHc';
    private loginURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAHlRt13aFSfVKgKej9pMoo36l6tenvHHc';

    authSignUp$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((authData: AuthActions.SignUpStart) => {
                return this.http
                    .post<AuthResponseData>(
                        this.signUpURL,
                        {
                            email: authData.payload.email,
                            password: authData.payload.password,
                            returnSecureToken: true
                        }
                    )
                    .pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes);
                        })
                    );
            })
        )
    })

    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http
                    .post<AuthResponseData>(
                        this.loginURL,
                        {
                            email: authData.payload.email,
                            password: authData.payload.password,
                            returnSecureToken: true
                        }
                    )
                    .pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes);
                        })
                    );
            })
        )
    });

    autoLogin = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
                if (!userData) {
                    return { type: 'DUMMY' };       // If userData does not exist return
                }
                const expDate: Date = new Date(userData._tokenExpirationDate);
                const loadedUser = new User(userData.email, userData.id, userData._token, expDate);
                if (loadedUser.token) {
                    const expirationTime = (new Date(userData._tokenExpirationDate)).getTime() - (new Date().getTime())
                    this.authService.setLogoutTimer(expirationTime);

                    return new AuthActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: expDate });
                }
                return { type: 'DUMMY' };
            })
        )
    })

    autoLogout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        )
    }, { dispatch: false });

    authRedirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap(() => {
                this.router.navigate(['/']);
            })
        )
    }, { dispatch: false });

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { };
}