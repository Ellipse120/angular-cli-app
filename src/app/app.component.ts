import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginState=true;
  registerState=true;


//  登录
  showLogin():void{
    this.loginState=false;
    this.registerState=true;
  }
//  关闭登录
  hideLogin():void{
    this.loginState=true;
  }
//  注册
  showRegister():void {
    this.registerState=false;
    this.loginState=true;
  }
//  关闭注册
  hideRegister():void{
    this.registerState=true;
  }
}
