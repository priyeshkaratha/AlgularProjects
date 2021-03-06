import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from "src/app/store/app.reducer"

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe(take(1), map((authState) => {
            const auth = !!authState.user
            if (auth) {
                return true;
            }
            else {
                return this.router.createUrlTree(['/auth'])
            }
        }))
    }
}