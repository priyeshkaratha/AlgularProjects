import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "src/app/store/app.reducer"
import * as AuthActions from "src/app/auth/store/auth.action"


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private store: Store<fromApp.AppState>) { }
    private tokenExpirationTimer;

    setLogoutTimer(expirationDuration: number) {
        console.log(expirationDuration)
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
            this.tokenExpirationTimer = null
        }
    }
}