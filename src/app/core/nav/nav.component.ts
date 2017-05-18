import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export  class NavComponent {
  user = [];
  loginState = false;
  isLogin = false;
  isUserCenter = false;

  constructor(public router:Router){

  }


  //  显示登录框
  showLogin(): void {
    this.loginState = true;
  }

  //  关闭登录框
  hideLogin(): void {
    this.loginState = false;
  }

  //  登录
  userLogin(user) {
    console.log(user);
    this.isLogin = true;
    this.loginState = false;
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
