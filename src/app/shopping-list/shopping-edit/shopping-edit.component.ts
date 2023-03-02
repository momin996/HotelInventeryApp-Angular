import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shipping-list.actions';
import * as fromApp from "../../store/app.reducer";



@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) slForm: NgForm;
  isEditingSub: Subscription;
  editMode: boolean = false;
  editItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.isEditingSub = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex>-1) {
        this.editMode = true;
        this.editItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      // this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    }
    else {
      // this.shoppingService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode=false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());

  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.isEditingSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
