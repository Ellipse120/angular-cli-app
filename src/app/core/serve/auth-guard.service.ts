import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../ysl-http.service';
import {YslCommonService} from '../ysl-common.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class AuthGuardService implements CanActivate {

  userId: any;
  constructor(private cookie: CookieService,
              private commonService: YslCommonService,
              private router: Router,
              public snackBar: MdSnackBar) {
    this.userId = this.cookie.getObject('yslUserInfo');
    this.getLoginStatus();
  }

  getLoginStatus() {
    this.commonService.getLoginStatus().subscribe(e => {
      if (e.loginStatus) { this.userId = e.userInfo['id']; }
    });
  }

  canActivate() {
    if (this.userId) { return true; }
    this.snackBar.open('您未登录，请先登录', '', {
      duration: 2000,
      extraClasses: ['ysl-snack-bar']
    });
    this.router.navigate(['re-login']);
    return false;
  }
}
