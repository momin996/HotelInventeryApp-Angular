import * as AuthActions from './auth.actions';
import { User } from '../user.model';

export interface State {
    user: User,
    authError: string,
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {

        case AuthActions.SIGNUP_START:
        case AuthActions.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            }

        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            )
            return {
                ...state,
                authError: null,
                user: user,
                loading: false
            }

        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }

        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
                loading: false
            }

        default:
            return state;
    }
}