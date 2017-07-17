import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import { Location } from '@angular/common';

import {MdDialog} from '@angular/material';

import { LoginComponent } from '../../login/login.component';
import {SearchService} from '../../search/search.service';
import {YslHttpService} from '../ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {YslPopupDirective} from '../directive/ysl-popup.directive';
import {YslCommonService} from '../ysl-common.service';


@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  outputs: ['keywordSearch']
})

export class NavComponent implements OnInit {

  isShowSearch = false;
  isShowPhoneNav = false;
  user = [];
  loginState: any;
  userId: string;
  loginInfo: any;
  subnavStyle =  {};

  constructor(private router: Router,
              private dialog: MdDialog,
              public eventEmit: SearchService,
              private commonService: YslCommonService,
              private httpService: YslHttpService,
              private cookie: CookieService,
              private location: Location) {}

  ngOnInit() {
    if (this.cookie.getObject('yslUserInfo')) {
      this.loginState = true;
      this.userId = this.cookie.getObject('yslUserInfo')['id'];
    } else {
      this.loginState = false;
      this.userId = undefined;
    }
    this.setNavStyle();
    this.getUserInfo();
    this.eventEmit.loginEvent.subscribe(() => {
      this.showLogin();
    });
    this.eventEmit.logoutEvent.subscribe(() => {
      this.logout();
    });
    document.addEventListener('click', () => { this.isShowPhoneNav = false; }, false);
  }

  getUserInfo() {
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.loginInfo = res;
      });
    this.commonService.getUserInfo().subscribe(e => {
      this.loginInfo = e.userInfo;
    });
  }

  // 小屏个人中心等导航
  showPhoneNav(e) {
    e.stopPropagation();
    this.isShowPhoneNav = !this.isShowPhoneNav;
  }

  //  显示登录框
  showLogin(): void {
    let dialogRef = this.dialog.open(LoginComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }
      this.cookie.putObject('yslUserInfo', this.loginInfo);
      this.eventEmit.loginSuccessEvent.emit();
      this.loginState = true;
    });
  }

  // 搜索
  keywordSubmit(data) {
    this.eventEmit.keywordSearch.emit(data);
  }

  // 退出
  logout() {
    const token = window.localStorage['user-token'];
    this.httpService.logout(token)
      .then(res => {
        const path = this.location.path();
        this.cookie.remove('yslUserInfo');
        this.cookie.remove('x-access-token');
        this.loginState = false;
        if (!path.includes('/datalist') || !path.includes('/datadetail')) {
          this.router.navigate(['index']);
        }
      });
  }

  // 设置搜索框显示隐藏
  setNavStyle() {
    const subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url.includes('/index') || e.url === '/') {
          this.subnavStyle = {background: 'rgba(0,0,0,0.3)'};
        } else {
          this.subnavStyle = {background: '#3f3f3f'};
        }
        if (e.url.includes('/index') || e.url.includes('/register') || e.url === '/') {
          this.isShowSearch = false;
        } else {
          this.isShowSearch = true;
        }
      }
    });
  }
}


