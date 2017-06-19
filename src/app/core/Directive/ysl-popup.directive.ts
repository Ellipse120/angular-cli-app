/**
 * Created by pengdaojing on 2017/6/18.
 */
import {Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, ViewChild,
    HostListener} from "@angular/core";

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
        if (!this.isOpen) {
          this.popupComponentRef = this._vcr.createComponent(this.popupComponentFactory);
          setTimeout(() => {
            this.isOpen = true;
          })
        } else {
          this._vcr.clear();
          setTimeout(() => {
            this.isOpen = false;
          })
        }
        this.popupComponentRef.instance.popupClose.subscribe((e) => {
          this.isOpen = false;
          this.popupComponentRef.destroy(e);
          resolve(e)
        })
        // setTimeout(() => {
        //   this.isOpen = !this.isOpen;
        //   console.log('boolean inner', this.isOpen)
        //   this.popupComponentFactory = this._cfr.resolveComponentFactory(tpl);
        //   if (this.isOpen) {
        //     this.popupComponentRef = this._vcr.createComponent(this.popupComponentFactory);
        //   } else {
        //     this._vcr.clear();
        //   }
        //   this.popupComponentRef.instance.popupClose.subscribe((e) => {
        //     this.isOpen = false;
        //     this.popupComponentRef.destroy(e);
        //     resolve(e)
        //   })
        // })
      })
    }

    @HostListener('document:click', ['$event'])
    onClick(btn: Event) {
      // if (this._el.nativeElement.contains(event.target)) { return }
      // this._vcr.clear();
      // this.isOpen = false;
    }
}
