import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from './recipe.actions';


@Injectable()
export class RecipeEffects {

    private baseURL = 'https://recipe-book-cd25e-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

    fetchRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(this.baseURL)
            }),
            map(recipes => {    // the recipes that we get from firebase
                // Some recipes may not have any ingredients and so we add an empty array of ingredients for these recipes
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            map((recipes: Recipe[]) => {
                return new RecipesActions.SetRecipes(recipes);
            })
        )
    });

    storeRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPE),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipeState]) => {
                return this.http.put<Recipe[]>(this.baseURL, recipeState.recipes);
            })
        )
    }, { dispatch: false })

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}