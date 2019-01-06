import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes.component";
import { RecipStartComponent } from "./recip-start/recip-start.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeResolverService } from "../shared/recipe-resolver.service";

const recipeRoutes: Routes = [
    {
        path: '',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RecipStartComponent, pathMatch: 'full' },
            { path: "new", component: RecipeEditComponent },
            { path: ":id", component: RecipeDetailComponent, resolve: [RecipeResolverService] },
            { path: ":id/edit", component: RecipeEditComponent, resolve: [RecipeResolverService] }
        ]
    }]

@NgModule({
    imports: [RouterModule.forChild(recipeRoutes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {

}