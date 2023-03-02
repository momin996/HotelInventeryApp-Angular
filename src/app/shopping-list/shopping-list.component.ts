import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shipping-list.actions';
import * as fromApp from "../store/app.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ ingredients : Ingredient[] }>;
  // private ingChangeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    
    // this.ingredients = this.shoppingService.getIngredients();
    // this.ingChangeSub = this.shoppingService.ingredientsChanged.subscribe(
      // (updatedIngredients: Ingredient[]) => {
        // this.ingredients = updatedIngredients;
    // })
  }

  ngOnDestroy(): void {
    // this.ingChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    // this.shoppingService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));

  }

}
