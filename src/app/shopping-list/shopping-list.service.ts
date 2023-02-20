import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private ingredients : Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  ingredientsChanged = new EventEmitter<Ingredient[]>();

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  addIngredients(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientsChanged.emit(this.getIngredients());
  }

}
