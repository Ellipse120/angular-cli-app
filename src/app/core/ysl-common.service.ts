import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from './ysl-http.service';
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SearchService} from '../search/search.service';

@Injectable()
export class YslCommonService {

  private subject = new Subject<any>();

  constructor(private cookie: CookieService,
              private httpService: YslHttpService,
              private router: Router, private eventEmit: SearchService) {
  }

  // 处理时间戳-天
  getDateForDay(time) {
    const date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate();
    };
    return date.toLocaleString();
  }

  // 处理时间-秒
  getDateForTime(time) {
    const date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
    };
    return date.toLocaleString();
  }

  updateUserInfo(user) {
    this.subject.next({userInfo: user});
  }

  getUserInfo(): Observable<any> {
    return this.subject.asObservable();
  }

  // 为登录统一处理
  loginTimeout() {
    this.cookie.remove('yslUserInfo');
    this.router.navigate(['index']);
    this.eventEmit.loginEvent.emit();
  }
}
