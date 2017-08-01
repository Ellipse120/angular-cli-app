import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { YslHttpService } from '../core/ysl-http.service';
import {YslCommonService} from '../core/ysl-common.service';

@Component({
  selector: 'app-re-login',
  templateUrl: './re-login.component.html',
  styleUrls: ['./re-login.component.css']
})
export class ReLoginComponent implements OnInit {

  loginForm: FormGroup;
  isLogin: any;
  isLoginSubmit = false;
  isRem: boolean;             // 记住账号
  loginId: string;
  loginMess = '登录';
  loginFailed: string;
  loginFormError = {
    userAccount: '',
    userPassword: ''
  };
  loginErrorMess = {
    userAccount: {
      required: '账号不能为空'
    },
    userPassword: {
      required: '密码不能为空'
    }
  };

  constructor(
    private fb: FormBuilder,
    private httpServer: YslHttpService,
    private commonService: YslCommonService,
    private router: Router,
    private cookie: CookieService) {}

  ngOnInit() {
    if (this.cookie.get('userAccount')) {
      this.loginId = this.cookie.get('userAccount');
      this.isRem = true;
    } else {
      this.loginId = '';
      this.isRem = false;
    }
    this.createForm();
    this.isLogin = this.cookie.getObject('yslUserInfo');
    this.commonService.getLoginStatus().subscribe(data => {
      this.isLogin = data.loginStatus;
      if (this.isLogin) {
        this.router.navigate(['userCenter']);
      }
    });
  }

  // 提交登录
  loginSubmit() {
    if (!this.loginForm) { return; }
    this.isLoginSubmit = true;
    const form = this.loginForm;
    for (const field in this.loginFormError) {
      this.loginFormError[field] = '';
      const control = form.get(field);
      if (control && control.invalid) {
        const message = this.loginErrorMess[field];
        for (const error in control.errors) {
          this.loginFormError[field] += message[error] + '';
        }
      }
    }
    if (form.invalid) { return; }
    this.loginMess = '登录中....';
    const submitTime = new Date();
    const submitData = {
      loginId: form.value['userAccount'],
      passcode: form.value['userPassword'].replace(/(^\s*)|(\s*$)/g, ''),
      oneTimeCode: submitTime.getTime()
    };
    this.httpServer.userLogin(submitData)
      .then((res) => {
        this.commonService.modifyLoginStatus({loginStatus: true, userInfo: res});
        if (form.value['isRem']) {
          this.cookie.put('userAccount', res['loginId']);
        }
        this.router.navigate(['userCenter']);
      }, error => {
        const body = JSON.parse(error._body);
        this.loginMess = '登录';
        this.loginFailed = body.errorMessage;
      });
  }

  gotoRegitster() {
    this.router.navigate(['register']);
  }

  // 创建表单
  createForm() {
    this.loginForm = this.fb.group({
      userAccount: [this.loginId, Validators.required],
      userPassword: ['', Validators.required],
      isRem: this.isRem
    });
  }
}
