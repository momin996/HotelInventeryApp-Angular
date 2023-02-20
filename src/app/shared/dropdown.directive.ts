import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'open');
  }

  

}
