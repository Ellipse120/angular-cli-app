import {Injectable, OnInit} from "@angular/core";
import {CookieService} from "ngx-cookie";

@Injectable()
export class YslCommonService {

  userId: string;

  constructor(private cookie: CookieService) {
    this.userId = this.cookie.getObject('yslUserInfo') ?　this.cookie.getObject('yslUserInfo')['id'] : '';
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
