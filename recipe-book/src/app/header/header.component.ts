import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.action'
import * as RecipesActions from '../recipes/store/recipe.action'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromApp.AppState>) { }
  isAuthenticated = false;
  private userSub = new Subscription()
  ngOnInit(): void {
  }
  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }
  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }
  onLogout() {
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
}
