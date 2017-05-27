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
  loginState: boolean = false;
  isUserCenter = false;

  constructor(public router:Router, public dialog: MdDialog){

  }


  //  显示登录框
  showLogin(): void {
    // this.loginState = true;
    let dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('close', result)
      this.loginState = result.status;
    });
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


