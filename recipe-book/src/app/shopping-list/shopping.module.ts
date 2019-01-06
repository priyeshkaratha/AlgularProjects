import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        FormsModule,
        RouterModule.forChild([{ path: '', component: ShoppingListComponent, canActivate: [AuthGuard] }]),
        SharedModule
    ],
    exports: [
        ShoppingListComponent,
        ShoppingEditComponent,
        RouterModule
    ]
})

export class ShoppingModule {

}