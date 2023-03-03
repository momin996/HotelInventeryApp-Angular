import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number = null;
  editMode: boolean;
  recipeForm: FormGroup;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = (this.id >= 0) ? true : false;         // if id is present(not null) it means we are in edit mode
      this.initForm();
    })
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipeActions.UpdateRecipe({ index: this.id, newRecipe: this.recipeForm.value }))
      this.editMode = false;
    }
    else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.leavePage();
  }

  leavePage() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {

    let recipeName = '', recipeImgPath = '', recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipesState => {
            return recipesState.recipes
              .find((recipe, index) => {
                if (index === this.id) {
                  return true;
                }
                else {
                  return false;
                }
              })
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImgPath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name, Validators.required),
                  'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                })
              )
            }
          }
        })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
