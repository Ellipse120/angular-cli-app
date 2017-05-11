import { Component } from '@angular/core';

@Component({
  selector: 'my-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export  class NavComponent {
  user = [];
  loginState = true;
  isLogin = false;
  isUserCenter = false;


  //  显示登录框
  showLogin(): void {
    this.loginState = false;
  }

  //  关闭登录框
  hideLogin(): void {
    this.loginState = true;
  }

  //  登录
  userLogin(user) {
    console.log(user);
    this.isLogin = true;
    this.loginState = true;
  }
//  切换下拉列表
  toggle() {
    this.isUserCenter = !this.isUserCenter;
  }
}
