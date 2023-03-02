import { Action } from "@ngrx/store";


export const SIGNUP_START = '[Auth] Sign Up Start';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGOUT = '[Auth] Auto Logout';

export class SignUpStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) { }
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) { }
}

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: {
            email: string,
            userId: string,
            token: string,
            expirationDate: Date,
        }
    ) { }
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string) { }
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class AutoLogout implements Action {
    readonly type = AUTO_LOGOUT;
}

export type AuthActions =
    | SignUpStart
    | LoginStart
    | AuthenticateSuccess
    | AuthenticateFail
    | AutoLogin
    | Logout
    | AutoLogout;