import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import { Recipe } from "../models/recipe.model";
import * as fromApp from '../store/app.reducer'
import * as RecipeActions from '../recipes/store/recipe.action'
import { ofType, Actions } from '@ngrx/effects'
import { take, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => {
                return recipeState.recipes
            }),
            switchMap(recipes => {
                if (recipes.length == 0) {
                    this.store.dispatch(new RecipeActions.FetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipeActions.SET_RECIPES),
                        take(1)
                    );
                }
                else {
                    return of(recipes)
                }
            })
        )
    }
}