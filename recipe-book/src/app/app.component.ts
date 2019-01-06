import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';


import * as fromApp from "src/app/store/app.reducer"
import * as AuthActions from "src/app/auth/store/auth.action"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  userSub = new Subscription()
  isAuthenticated = false

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new AuthActions.Autologin())
    }
    this.userSub = this.store.select('auth').subscribe((authState) => {
      this.isAuthenticated = !!authState.user;
    })
  }
}
