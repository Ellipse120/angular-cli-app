import { Directive, ElementRef, OnInit, HostListener, Renderer  } from '@angular/core';
// import Promise = Q.Promise;

@Directive({
  selector: '[yslMenu]'
})

export class YslMenuDirective implements OnInit{

  yslMenuBtn: any;
  yslMenuCont: any;
  closeBtn: any;
  constructor(private elem: ElementRef,
              private renderer: Renderer) {}

  ngOnInit() {
    let wrapper = this.elem.nativeElement;
    this.yslMenuBtn = wrapper.querySelector('.ysl-menu-btn');
    this.yslMenuCont = wrapper.querySelector('.ysl-menu-cont');
    this.closeBtn = wrapper.querySelector('.ysl-menu-close');
    this.yslMenuBtn.addEventListener('click', (event) => {
      // if (wrapper.contains(this.yslMenuCont) || this.yslMenuCont.style.display == 'none') {
      //   console.log('containes', wrapper.contains(this.yslMenuCont))
      //   this.elem.nativeElement.removeChild(this.yslMenuCont)
      // } else {
      //   console.log('false')
      //   this.elem.nativeElement.appendChild(this.yslMenuCont)
      //   this.yslMenuCont.style.display = 'block';
      // }
      if (this.yslMenuCont.style.display == 'block') {
        this.yslMenuCont.style.display = 'none';
      } else {
        this.yslMenuCont.style.display = 'block';
      }
    }, false)
  }

  // remove() {
  //   let wrapper = this.elem.nativeElement;
  //   return new Promise((resolve, reject) => {
  //     let removeCont = wrapper.removeChild(this.yslMenuCont);
  //     if (removeCont) { resolve() }
  //   })
  // }

  @HostListener('document:click', ['$event'])
  onClick(btn: Event) {
    // if (window.Node && Node.prototype && !Node.prototype.contains){
    //   Node.prototype.contains = function (arg) {
    //     return !!(this.compareDocumentPosition(arg) & 16)
    //   }
    // }
    if (this.yslMenuBtn == event.target || this.yslMenuCont == event.target || this.yslMenuCont.contains(event.target)) {
      this.yslMenuCont.style.display = 'block';
      // this.elem.nativeElement.appendChild(this.yslMenuCont)
    } else {
      this.yslMenuCont.style.display = 'none'
      // this.elem.nativeElement.removeChild(this.yslMenuCont)
    }
  }
}
