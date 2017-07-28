import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../ysl-common.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class OperationAuthGuardService implements CanActivate {

  userInfo: any;
  constructor(private cookie: CookieService,
              private commonService: YslCommonService,
              private router: Router,
              public snackBar: MdSnackBar) {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo') : null;
    this.getLoginStatus();
  }

  getLoginStatus() {
    this.commonService.getLoginStatus().subscribe(e => {
      if (e.loginStatus) { this.userInfo = e.userInfo; }
    });
  }

  canActivate() {
    const userType = this.userInfo ? (this.userInfo['userType'] + '') : undefined;
    if (userType === '30') { return true; }
    this.snackBar.open('没有权限访问', '', {
      duration: 2000,
      extraClasses: ['ysl-snack-bar']
    });
    this.router.navigate(['userCenter']);
    return false;
  }

}
