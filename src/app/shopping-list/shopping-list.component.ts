import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients : Ingredient[];
  private ingChangeSub: Subscription;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();
    this.ingChangeSub = this.shoppingService.ingredientsChanged.subscribe(
      (updatedIngredients: Ingredient[]) => {
        this.ingredients = updatedIngredients;
    })
  }

  ngOnDestroy(): void {
    this.ingChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingService.startedEditing.next(index);
  }

}
