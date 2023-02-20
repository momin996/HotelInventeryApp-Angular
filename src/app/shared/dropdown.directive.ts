import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen = false;

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    // event gets the element which is clicked
    // So if the directive host element is equal to the event.target element this means the directive host element is clicked
    // toggles isOpen if clicked on host element
    // sets is isOpen if clicked anywhere else on the page
  }

  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }

  // @HostListener('mouseenter') mouseenter() {
  //   this.renderer.addClass(this.elRef.nativeElement, 'open');
  // }
  
  // @HostListener('mouseleave') mouseleave() {
  //   this.renderer.removeClass(this.elRef.nativeElement, 'open');
  // }

}
