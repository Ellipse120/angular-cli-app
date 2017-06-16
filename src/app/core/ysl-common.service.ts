import {Injectable, OnInit} from "@angular/core";
import {CookieService} from "ngx-cookie";

@Injectable()
export class YslCommonService {

  userInfo: any;

  constructor(private cookie: CookieService) {
    this.userInfo = this.cookie.getObject('yslUserInfo') ?　this.cookie.getObject('yslUserInfo') : null;
  }

  // 处理时间戳-天
  getDateForDay(time) {
    let date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate();
    };
    return date.toLocaleString();
  }
}
