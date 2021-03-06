import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {YslHttpService} from '../core/ysl-http.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../core/ysl-common.service';


@Component({
  selector: 'ysl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
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
    public dialogRef: MdDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private httpServer: YslHttpService,
    private commonService: YslCommonService,
    private location: Location,
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
  }

  // 提交登录
  loginSubmit() {
    this.cookie.remove('x-access-token');
    if (!this.loginForm) { return; }
    this.isLoginSubmit = true;
    const form = this.loginForm;
    for (const field in this.loginFormError) {
      if (this.loginFormError.hasOwnProperty(field)) {
        this.loginFormError[field] = '';
        const control = form.get(field);
        if (control && control.invalid) {
          const message = this.loginErrorMess[field];
          for (const error in control.errors) {
            if (control.errors.hasOwnProperty(error)) {
              this.loginFormError[field] += message[error] + '';
            }
          }
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
          // ae5125977d4a40269ce1abde1ad89951
          this.cookie.put('userAccount', res['loginId']);
        }
        this.dialogRef.close();
        const path = this.location.path();
        if (path.includes('/register')) {
          this.router.navigate(['index']);
        }
      }, error => {
        const body = JSON.parse(error._body);
        this.loginMess = '登录';
        this.loginFailed = body.errorMessage;

      });
  }

  gotoRegitster() {
    this.dialogRef.close();
    this.router.navigate(['register']);
  }

  // 找回密码
  toRetrievePass() {
    this.dialogRef.close();
    this.router.navigate(['retrieve-pass']);
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

