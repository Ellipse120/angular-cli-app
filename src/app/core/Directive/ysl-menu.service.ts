import {Injectable} from "@angular/core";
import {YslMenuDirective} from './ysl-menu-directive'


@Injectable()
export class YslMenuService {
  public isShowCont = false;
  toggle() {
    console.log('event')
  }
}
