import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MdDialog } from '@angular/material';

import { LoginComponent } from "../../login/login.component";



@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  outputs: ['keywordSearch']
})

export class NavComponent implements OnInit {
  @Input() isShowSearch;

  keywordSearch: EventEmitter<any>;
  user = [];
  loginState: boolean = false;
  isUserCenter = false;

  constructor(public router:Router, public dialog: MdDialog){
    this.keywordSearch = new EventEmitter()
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

  //  切换下拉列表
  toggle() {
    this.isUserCenter = !this.isUserCenter;
  }
}


