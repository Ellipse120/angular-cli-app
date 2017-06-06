import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import {MdDialog, MdMenuTrigger} from '@angular/material';

import { LoginComponent } from "../../login/login.component";
import {SearchService} from "../../search/search.service";


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
  loginState = false;
  loginInfo;

  constructor(public router: Router,
              public dialog: MdDialog,
              public location: Location,
              public eventEmit: SearchService) {
  }

  ngOnInit() {
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
      this.loginState = true;
      this.loginInfo = result;
      console.log('close', result)
      // this.loginState = result.status;
    });
  }

  gotoRegitster() {
    this.loginState = false;
    this.router.navigate(['register'],1);
  }

  // 搜索
  keywordSubmit(data) {
    this.eventEmit.keywordSearch.emit(data)
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


