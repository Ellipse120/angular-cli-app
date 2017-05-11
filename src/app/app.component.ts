import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginState = true;
  registerState = true;
  user = [];
  isLogin = false;


  //  显示登录框
  showLogin(): void {
    this.loginState = false;
    this.registerState = true;
  }

  //  关闭登录框
  hideLogin(): void {
    this.loginState = true;
  }

  //  显示注册框
  showRegister(): void {
    this.registerState = false;
    this.loginState = true;
  }

  //  关闭注册框
  hideRegister(): void {
    this.registerState = true;
  }

  //  登录
  userLogin(user) {
    console.log(user);
    this.isLogin = true;
    this.loginState = true;
  }
}
