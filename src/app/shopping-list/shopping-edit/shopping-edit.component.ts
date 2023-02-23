import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) slForm: NgForm;
  isEditingSub: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editItem: Ingredient;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
    this.isEditingSub = this.shoppingService.startedEditing.subscribe((index) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.editItem = this.shoppingService.getIngredient(index);
      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount
      });
    })
  }

  ngOnDestroy(): void {
    this.isEditingSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
    }
    else {
      this.shoppingService.addIngredient(newIngredient);
    }
    this.editMode=false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

}
