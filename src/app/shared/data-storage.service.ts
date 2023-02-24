import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    private baseURL = 'https://recipe-book-cd25e-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put<Recipe[]>(this.baseURL, recipes)
            .subscribe(responseData => {
                console.log(responseData);
            });
    }

    getRecipes() {
        return this.http
            .get<Recipe[]>(this.baseURL)
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipesDB(recipes);
                })
            );
    }

}