import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[yslMenu]'
})

export class YslMenuDirective{
  constructor(private elem: ElementRef) {
    console.log('directive', this.elem)
  }
}
