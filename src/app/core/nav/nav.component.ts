import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
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
  path: string;
  loginState: boolean = false;

  constructor(public router:Router,
              public dialog: MdDialog,
              public location: Location){
    this.keywordSearch = new EventEmitter()
  }

  ngOnInit() {
    this.path = this.location.path(false);
    this.isShowSearch = this.path.includes('/index') ? false : true;
    console.log('isSearch', this.path)
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
}


