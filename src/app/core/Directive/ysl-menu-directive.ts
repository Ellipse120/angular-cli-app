import { Directive, ElementRef, OnInit, HostListener, Renderer, EventEmitter  } from '@angular/core';

@Directive({
  selector: '[yslMenu]'
})

export class YslMenuDirective implements OnInit{

  closeMenuCont: EventEmitter<any>;
  yslMenuBtn: any;
  yslMenuCont: any;
  closeBtn: any;
  constructor(private elem: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.closeMenuCont = new EventEmitter();
    let wrapper = this.elem.nativeElement;
    this.yslMenuBtn = wrapper.querySelector('.ysl-menu-btn');
    this.yslMenuCont = wrapper.querySelector('.ysl-menu-cont');
    this.closeBtn = wrapper.querySelector('.ysl-menu-close');
    this.yslMenuBtn.addEventListener('click', (event) => {
      if (this.yslMenuCont.style.display == 'block') {
        this.yslMenuCont.style.display = 'none';
      } else {
        this.yslMenuCont.style.display = 'block';
      }
    }, false)
  }

  @HostListener('document:click', ['$event'])
  onClick(btn: Event) {
    if (this.yslMenuBtn == event.target || this.yslMenuCont == event.target || this.yslMenuCont.contains(event.target)) {
      this.yslMenuCont.style.display = 'block'
    } else {
      this.yslMenuCont.style.display = 'none'
    }
    // if (this.elem.nativeElement.contains(event.target)) {
    //   this.yslMenuCont.style.display = 'block'
    // } else {
    //   this.yslMenuCont.style.display = 'none'
    // }
  }
}
