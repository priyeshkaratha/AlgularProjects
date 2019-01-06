import { Actions, ofType, Effect } from "@ngrx/effects"
import * as AuthActions from './auth.action'
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

const handleAuthentication = (expiresIn: number, email: string, token: string, userId: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email: email,
        token: token,
        userId: userId,
        expirationDate: expirationDate,
        redirect: true
    });
}
const handleError = (errorRes: any) => {
    let errorMessage = "An unknown error occured"
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))

    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = "Email is already in use"
            break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = "Account is blocked. Try again later."
            break
        case 'OPERATION_NOT_ALLOWED':
            errorMessage = "Password sign in not allowed"
            break
        case 'EMAIL_NOT_FOUND':
            errorMessage = "Email doesn't exist"
            break;
        case 'INVALID_PASSWORD':
            errorMessage = "Incorrect password."
            break
        case 'USER_DISABLED':
            errorMessage = "The user account has been disabled by an administrator."
            break
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
    baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts:"
    apiKey = "key=AIzaSyB8s11k4uhL7NOm9L_iZBVLoLF85FvAaeo"

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(this.baseUrl + "signUp?" + this.apiKey, {
                email: signupData.payload.email,
                password: signupData.payload.password,
                returnSecureToken: true
            }).pipe(
                tap(resData => { this.authService.setLogoutTimer(+resData.expiresIn * 1000) }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.idToken, resData.localId)
                }),
                catchError(errorRes => {
                    return handleError(errorRes)
                })
            )
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(this.baseUrl + "signInWithPassword?" + this.apiKey, {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }).pipe(
                tap(resData => { this.authService.setLogoutTimer(+resData.expiresIn * 1000) }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.idToken, resData.localId)
                }),
                catchError(errorRes => {
                    return handleError(errorRes)
                })
            )
        }),
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string,
                id: string,
                userToken: string,
                tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem("userData"))
            if (!userData) {
                return { type: 'DUMMY' }
            }
            console.log('Effect1', userData)
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData.userToken,
                new Date(userData.tokenExpirationDate));
            console.log('Effect2', loadedUser)
            const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime()
            if (loadedUser.token) {
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData.tokenExpirationDate),
                    redirect: false
                })

            }
            return { type: 'DUMMY' }
        })
    )

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT, AuthActions.AUTO_LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer()
            localStorage.removeItem('userData');
            this.router.navigate(['/auth'])
        })
    )



    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap((authSuccees: AuthActions.AuthenticateSuccess) => {
        if (authSuccees.payload.redirect) {
            this.router.navigate(['/'])
        }

    }))
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { }
}