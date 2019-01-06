import { Actions, Effect, ofType } from '@ngrx/effects'

import * as RecipesActions from './recipe.action'
import { switchMap, map, withLatestFrom } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Recipe } from 'src/app/models/recipe.model'
import { Injectable } from '@angular/core'

import * as fromApp from '../../store/app.reducer'
import { Store } from '@ngrx/store'

@Injectable()
export class RecipeEffects {

    private baseUrl = "https://recipe-book-e082b.firebaseio.com/"


    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {

    }

    @Effect()
    fetchRecipes = this.actions$.pipe(ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(this.baseUrl + 'recipes.json')
        }),
        map((recipes) => {
            return recipes.map(
                recipe => {
                    return {
                        ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
                    }
                }
            )
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes)
        })
    )
    @Effect({ dispatch: false })
    storeRecipes = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipeState]) => {
            return this.http.put(this.baseUrl + 'recipes.json', recipeState.recipes)
        }))
}