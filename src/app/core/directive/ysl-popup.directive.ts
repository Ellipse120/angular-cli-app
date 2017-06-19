/**
 * Created by pengdaojing on 2017/6/18.
 */
import {Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, ViewChild,
    HostListener} from "@angular/core";
import {Input} from "@angular/core/src/metadata/directives";

@Directive({
    selector: '[ysl-popup]'
})

export class YslPopupDirective {

    isOpen: boolean;
    popupComponentFactory: any;
    popupComponentRef: any;

    constructor(private _vcr:ViewContainerRef,
                private _cfr:ComponentFactoryResolver,
                private _el: ElementRef) {}

    toggle(tpl) {
      return new Promise(resolve => {
        this.popupComponentFactory = this._cfr.resolveComponentFactory(tpl);
        setTimeout(() => {
          if (!this.isOpen) {
            this.popupComponentRef = this._vcr.createComponent(this.popupComponentFactory);
            this.isOpen = true;
          } else {
            this._vcr.clear();
            this.isOpen = false;
          }
          this.popupComponentRef.instance.popupClose.subscribe((e) => {
            this.isOpen = false;
            this.popupComponentRef.destroy(e);
            resolve(e)
          })
        })
      })
    }

    @HostListener('document:click', ['$event'])
    onClick(btn: Event) {
      // console.log('dir contains', this._el.nativeElement.nextElementSibling.contains(event.target))
      // console.log('parent next', this._el.nativeElement.nextElementSibling)
      // console.log('target -------------', event.target)
      if (!this.isOpen || this._el.nativeElement.nextElementSibling.contains(event.target)) { return }
      this._vcr.clear();
      this.isOpen = false;
    }
}
