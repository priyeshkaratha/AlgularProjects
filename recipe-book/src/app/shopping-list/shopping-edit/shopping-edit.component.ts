import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient, AddIngredients, UpdateIngredient, DeleteIngredient } from '../store/shopping-list.action';
import * as fromApp from 'src/app/store/app.reducer';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.action'
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromApp.AppState>) { }
  subscription: Subscription
  editMode = false;
  editedItem: Ingredient;
  @ViewChild('f') slForm: NgForm;


  ngOnInit(): void {

    this.subscription = this.store.select('shoppingList').subscribe(
      stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true
          this.editedItem = stateData.editedIngredient
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
        else {
          this.editMode = false
        }

      }
    )
    // this.subscription = this.shopService.startedEditing.subscribe((index: number) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index
    //   this.editedItem = this.shopService.getIngredient(index);
    //   this.slForm.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   })
    // })
  }
  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  // onAddItem(form: NgForm) {
  //   const value = form.value
  //   const newIngredient = new Ingredient(value.name, value.amount)
  //   if (this.editMode) {
  //     const updateIng = new UpdateIngredient({ index: this.editedItemIndex, ingredient: newIngredient })
  //     this.store.dispatch(updateIng)
  //   }
  //   else {
  //     const addIng = new AddIngredient(newIngredient)
  //     this.store.dispatch(addIng)
  //   }
  //   this.slForm.reset()
  //   this.editMode = false;
  // }
  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
  onDelete() {
    this.store.dispatch(new DeleteIngredient())
    this.onClear();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
}
