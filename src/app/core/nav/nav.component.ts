import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import { Location } from '@angular/common';

import {MdDialog} from '@angular/material';

import { LoginComponent } from '../../login/login.component';
import {SearchService} from '../../search/search.service';
import {YslHttpService} from '../ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {YslPopupDirective} from "../directive/ysl-popup.directive";


@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  outputs: ['keywordSearch']
})

export class NavComponent implements OnInit {

  isShowSearch = false;
  user = [];
  loginState: any;
  loginInfo: any;
  subnavStyle =  {};
  headerStyle = {};

  constructor(private router: Router,
              private dialog: MdDialog,
              public eventEmit: SearchService,
              private httpService: YslHttpService,
              private cookie: CookieService,
              private location: Location) {}

  ngOnInit() {
    if (this.cookie.getObject('yslUserInfo')) {
      this.loginState = true;
      this.loginInfo = this.cookie.getObject('yslUserInfo');
    } else {
      this.loginState = false;
      this.loginInfo = {userType: ''}
    }
    this.setNavStyle();
    this.eventEmit.loginEvent.subscribe(() => {
      this.showLogin();
    })
  }

  //  显示登录框
  showLogin(): void {
    let dialogRef = this.dialog.open(LoginComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return }
      this.loginInfo = result.userLoginInfo;
      this.cookie.putObject('yslUserInfo', this.loginInfo);
      this.eventEmit.loginSuccessEvent.emit();
      this.loginState = true;
    });
  }

  gotoRegitster() {
    this.router.navigate(['register'],1);
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
          this.router.navigate(['index'])
        }
      })
  }

  // 设置搜索框显示隐藏
  setNavStyle() {
    let subscription = this.router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        if (e.url.includes('/index') || e.url == '/') {
          this.subnavStyle = {background: 'rgba(0,0,0,0.3)'}
        } else {
          this.headerStyle = {justifyContent: 'space-between'};
          this.subnavStyle = {background: '#3f3f3f'}
        }
        if (e.url.includes('/index') || e.url.includes('/register') || e.url == '/') {
          this.isShowSearch = false;
          this.headerStyle = {justifyContent: 'flex-end'};
        } else {
          this.isShowSearch = true;
          this.headerStyle = {justifyContent: 'space-between'};
        }
      }
    })
  }
}


