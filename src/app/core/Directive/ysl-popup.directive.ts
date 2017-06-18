/**
 * Created by pengdaojing on 2017/6/18.
 */
import {
    Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, ViewChild,
    HostListener
} from "@angular/core";
@Directive({
    selector: '[ysl-popup]'
})

export class YslPopupDirective {

    isOpen: boolean;
    popupCont: any;

    constructor(private _vcr:ViewContainerRef,
                private _cfr:ComponentFactoryResolver,
                private _el: ElementRef) {}

    toggle(tpl) {
        this.isOpen = !this.isOpen;
        this.popupCont = this._cfr.resolveComponentFactory(tpl);
        console.log('YslPopupDirective', this.popupCont)
        if (this.isOpen) {
            this._vcr.createComponent(this.popupCont);
        } else {
            this._vcr.clear();
        }
    }

    @HostListener('document:click', ['$event'])
    onClick(btn: Event) {

    }
}