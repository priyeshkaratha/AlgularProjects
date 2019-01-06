import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from 'src/app/models/recipe.model';
import * as ShoppingListAction from "src/app/shopping-list/store/shopping-list.action";
import * as fromApp from 'src/app/store/app.reducer';
import * as RecipeActions from '../store/recipe.action'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: number;
  paramSubs = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {

    this.paramSubs = this.route.params.pipe(map(params => {
      return +params['id'];
    }),
      switchMap(id => {
        this.id = id
        return this.store.select('recipes');
      }),
      map(recipeState => recipeState.recipes.find((recipe, index) => {
        return index == this.id;
      })))
      .subscribe(recipe => {
        this.recipe = recipe;
      })
  }

  addToShopList() {
    this.store.dispatch(new ShoppingListAction.AddIngredients(this.recipe.ingredients))
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }
  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }
  ngOnDestroy() {
    this.paramSubs.unsubscribe();

  }
}
