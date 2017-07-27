import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SearchService} from '../search/search.service';
import {MdSnackBar} from "@angular/material";

@Injectable()
export class YslCommonService {

  private subject = new Subject<any>();
  private loginStatus = new Subject<any>();

  constructor(private cookie: CookieService,
              private router: Router,
              private eventEmit: SearchService,
              public snackBar: MdSnackBar) {
    this.processingLogin();
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

  // 登录状态处理
  processingLogin() {
    this.getLoginStatus().subscribe(e => {
      if (e.loginStatus) {
        this.cookie.remove('x-access-token');
        this.cookie.put('x-access-token', e.userInfo['token']);
        this.cookie.putObject('yslUserInfo', e.userInfo);
        this.snackBar.open('登录成功', '', {
          duration: 1000,
          extraClasses: ['ysl-snack-bar']
        });
      } else {
        this.cookie.remove('yslUserInfo');
        this.cookie.remove('x-access-token');
        this.snackBar.open(e.logoutMess, '', {
          duration: e.duration,
          extraClasses: ['ysl-snack-bar']
        });
      }
    });
  }

  getLoginStatus(): Observable<any> {
    return this.loginStatus.asObservable();
  }

  modifyLoginStatus(data) {
    this.loginStatus.next(data);
  }

  // 为登录统一处理
  loginTimeout(error) {
    const err = error.json();
    if (err.errorCode && (err.errorCode === 2002)) {
      this.modifyLoginStatus({loginStatus: false, userInfo: null, logoutMess: '登录超时，请重新登录', duration: 3000});
      this.router.navigate(['re-login']);
    }
    const token = window.localStorage['user-token'];
  }
}
