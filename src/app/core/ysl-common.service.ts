import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {SearchService} from '../search/search.service';
import {MdSnackBar} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

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

  requestErrorHandle(error) {
    if (error.status === 500) {
      this.snackBar.open('服务器出错', '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
      return;
    }
    const err = error.json();
    const token = window.localStorage['user-token'];
    if (err.errorCode && (err.errorCode === 2002)) {
      this.modifyLoginStatus({loginStatus: false, userInfo: null, logoutMess: '登录超时，请重新登录', duration: 3000});
      this.router.navigate(['re-login']);
    }
    if (err.errorCode && (err.errorCode !== 2002)) {
      this.snackBar.open(err.errorMessage, '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
    }
  }
}
