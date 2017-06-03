import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';

import { MdDialog } from '@angular/material';

import { LoginComponent } from "../../login/login.component";



@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  outputs: ['keywordSearch']
})

export class NavComponent implements OnInit {

  keywordSearch: EventEmitter<any>;
  isShowSearch = false;
  user = [];
  loginState: boolean = false;

  constructor(public router: Router,
              public dialog: MdDialog,
              public location: Location) {
    this.keywordSearch = new EventEmitter();
    this.setNavStyle();
  }

  ngOnInit() {
  }


  //  显示登录框
  showLogin(): void {
    let dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return }
      console.log('close', result)
      this.loginState = result.status;
    });
  }

  gotoRegitster() {
    this.loginState = false;
    this.router.navigate(['register'],1);
  }

  // 搜索
  keywordSubmit(data) {
    this.keywordSearch.emit(data)
  }

  setNavStyle() {
    let subscription = this.router.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        console.log('url', e.url)
        this.isShowSearch = (e.url.includes('/index') || e.url.includes('/register')) ? false : true;
      }
    })
  }
}


