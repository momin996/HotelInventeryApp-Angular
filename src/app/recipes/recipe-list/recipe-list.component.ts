import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  recipes : Recipe[] = [
    new Recipe('Test Recipe', 'This is a recipe for testing', 
    'https://www.cookipedia.co.uk/wiki/images/e/e7/Bulghur_wheat_salad_recipe.jpg'),
    new Recipe('Another Test Recipe', 'This is another recipe for testing purposes only', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXXOZOwH40u717zqAqDVSGR0xhg7sPNfvc3LYiHYVFpcdaOL-TYWsw5bKyetTIZEHHi4c&usqp=CAU')
  ];

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  constructor() {};

  onRecipeSelected(recipeEl: Recipe){
    this.recipeWasSelected.emit(recipeEl);
  }

}
