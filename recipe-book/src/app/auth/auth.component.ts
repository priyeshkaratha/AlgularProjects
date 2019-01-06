import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AlertComponent } from "../shared/alert/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from 'src/app/store/app.reducer';
import * as fromAuth from 'src/app/auth/store/auth.action'


@Component({
    templateUrl: './auth.component.html',
    selector: 'app-auth'
})
export class AuthComponent implements OnDestroy, OnInit {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) { }
    isLoginMode = true;
    isLoading = false;

    error: string = null
    @ViewChild(PlaceholderDirective, { static: false }) addError: PlaceholderDirective
    private closeSub = new Subscription()
    private storeSub = new Subscription();


    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error)
            }
        })
    }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }
    onSubmit(form: NgForm) {

        if (!form.valid) {
            return
        }
        this.error = null
        const email = form.value.email
        const password = form.value.password
        this.isLoading = true

        if (!this.isLoginMode) {
            this.store.dispatch(new fromAuth.SignupStart({ email: email, password: password }))
        } else {
            this.store.dispatch(new fromAuth.LoginStart({ email: email, password: password }))
        }
        form.reset()
    }
    onHandleError() {
        this.store.dispatch(new fromAuth.ClearError())
    }
    private showErrorAlert(errormessage: string) {
        // const alertCmp = new AlertComponent()
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const viewCOntainerref = this.addError.viewContainerRef;
        viewCOntainerref.clear()
        const componentRef = viewCOntainerref.createComponent(alertCmpFactory);
        componentRef.instance.message = errormessage;
        this.closeSub = componentRef.instance.closeAlert.subscribe(() => {
            this.closeSub.unsubscribe()
            viewCOntainerref.clear()
        })
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe()
        }
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}