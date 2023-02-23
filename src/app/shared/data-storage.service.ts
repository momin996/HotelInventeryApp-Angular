import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    private baseURL = 'https://recipe-book-cd25e-default-rtdb.asia-southeast1.firebasedatabase.app';

    constructor(private http: HttpClient, private recipeService: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put<Recipe[]>(
                `${this.baseURL}/recipes.json`,
                recipes
            )
            .subscribe(responseData => {
                console.log(responseData);
            });
    }

    getRecipes() {
        return this.http
            .get<Recipe[]>(
                `${this.baseURL}/recipes.json`
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipesDB(recipes);
                })
            );
    }

}