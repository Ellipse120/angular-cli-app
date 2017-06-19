import {Component, EventEmitter} from "@angular/core";
@Component({
    template: `<span>child</span><input type="text"><button (click)="close()">关闭</button>`
})

export class SearchAdvancedComponent {
  popupClose = new EventEmitter<any>();
  name = 'child';
  close() {
    this.popupClose.emit('close')
  }
}
