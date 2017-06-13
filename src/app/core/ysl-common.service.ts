import {Injectable} from "@angular/core";

@Injectable()
export class YslCommonService {

  // 处理时间戳-天
  getDateForDay(time) {
    let date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate();
    };
    return date.toLocaleString();
  }
}
