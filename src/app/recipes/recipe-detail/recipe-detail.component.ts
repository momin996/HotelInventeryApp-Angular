import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shipping-list.actions';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes
            .find((recipe, index) => {
              return index === this.id;
            })
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
