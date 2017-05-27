import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MdDialog } from '@angular/material';

import { LoginComponent } from "../../login/login.component";



@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export  class NavComponent {
  user = [];
  loginState = false;
  isUserCenter = false;
  selectedOption: string;

  constructor(public router:Router, public dialog: MdDialog){

  }


  //  显示登录框
  showLogin(): void {
    // this.loginState = true;
    console.log('login')
    let dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  //  关闭登录框
  hideLogin(): void {
    this.loginState = false;
  }

  //  登录
  userLogin(user) {
    // console.log(user);
    // this.loginState = false;



  }

  gotoRegitster() {
    this.loginState = false;
    this.router.navigate(['register'],1);
  }
//  切换下拉列表
  toggle() {
    this.isUserCenter = !this.isUserCenter;
  }
}


