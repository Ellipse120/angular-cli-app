import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {MdDialog, MdMenuTrigger} from '@angular/material';

import { LoginComponent } from '../../login/login.component';
import {SearchService} from '../../search/search.service';
import {MyServiceService} from '../app.service';
import {CookieService} from 'ngx-cookie';


@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  outputs: ['keywordSearch']
})

export class NavComponent implements OnInit {

  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  isShowSearch = false;
  user = [];
  loginState: any;
  loginInfo = {userType: ''};

  constructor(private router: Router,
              private dialog: MdDialog,
              private eventEmit: SearchService,
              private httpService: MyServiceService,
              private cookie: CookieService ) {
  }

  ngOnInit() {
    this.loginState = this.cookie.getObject('yslUserInfo') ? true : false;
    this.setNavStyle();
  }

  someMethod(elem) {
    console.log(elem)
    this.trigger.openMenu();
  }

  //  显示登录框
  showLogin(): void {
    let dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return }
      this.loginInfo = result.userLoginInfo;
      this.cookie.putObject('yslUserInfo', this.loginInfo);
      this.loginState = true;
    });
  }

  gotoRegitster() {
    this.router.navigate(['register'],1);
  }

  // 搜索
  keywordSubmit(data) {
    this.eventEmit.keywordSearch.emit(data)
  }

  // 退出
  logout() {
    const token = window.localStorage['user-token'];
    this.httpService.logout(token)
      .then(res => {
        this.cookie.remove('yslUserInfo');
        this.loginState = false;
      })
  }

  // 设置搜索框显示隐藏
  setNavStyle() {
    let subscription = this.router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        this.isShowSearch = (e.url.includes('/index') || e.url.includes('/register'))  || e.url == '/' ? false : true;
      }
    })
  }
}


