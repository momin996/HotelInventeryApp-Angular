import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  collapsed : boolean = false;

  @Output() featureSelect = new EventEmitter<string>();

  onSelect(feature: string){
    this.featureSelect.emit(feature);
  }

}
