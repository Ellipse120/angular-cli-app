/**
 * Created by pengdaojing on 2017/6/18.
 */
import {
  Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, ViewChild,
  HostListener
} from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';

@Directive({
  selector: '[ysl-popup]'
})

export class YslPopupDirective {

  isOpen: boolean;
  popupComponentFactory: any;
  popupComponentRef: any;

  constructor(private _vcr: ViewContainerRef,
              private _cfr: ComponentFactoryResolver,
              private _el: ElementRef) {
  }

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
          resolve(e);
        });
      });
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(btn: Event) {
    // console.log('dir contains', this._el.nativeElement.nextElementSibling.contains(event.target))
    // console.log('parent next', this._el.nativeElement.nextElementSibling)
    // console.log('target -------------', event.target)
    // if (!this.isOpen || this.contains(this._el.nativeElement.nextElementSibling, btn)) { return; }
    if (!this.isOpen || this._el.nativeElement.nextElementSibling.contains(btn.target)) {
      return;
    }
    this._vcr.clear();
    this.isOpen = false;
  }

  contains(parentEl, el) {
    // 第一个节点是否包含第二个节点
    // contains 方法支持情况：chrome+ firefox9+ ie5+, opera9.64+(估计从9.0+),safari5.1.7+
    if (parentEl === el) {
      return true;
    }
    if (!el || !el.nodeType || el.nodeType !== 1) {
      return false;
    }
    if (parentEl.contains) {
      return parentEl.contains(el);
    }
    if (parentEl.compareDocumentPosition) {
      return !!(parentEl.compareDocumentPosition(el) & 16);
    }
    var prEl = el.parentNode;
    while (prEl) {
      if (prEl === parentEl) {
        return true;
      }
      prEl = prEl.parentNode;
    }
    return false;
  }
}
