import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginState = true;
  user = [];
  isLogin = false;


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
}
