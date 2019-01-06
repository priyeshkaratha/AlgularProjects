import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { Subscription, Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.action'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<fromApp.AppState>) { }
  shopSub = new Subscription();

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
    //this.ingredients = this.shopService.getIngredients();
    // this.shopSub = this.shopService.ingredientAdded.subscribe((igrediants: Ingredient[]) => {
    //   this.ingredients = this.store.select('shoppingList');
    // })
  }
  ngOnDestroy() {
    this.shopSub.unsubscribe();
  }
  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
