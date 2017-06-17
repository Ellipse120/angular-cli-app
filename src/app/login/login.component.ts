import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { MdDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {YslHttpService} from '../core/ysl-http.service';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie";


@Component({
  selector: 'ysl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoginSubmit = false;
  isRem: boolean;             //记住账号
  loginId: string;
  loginMess = '登录';
  loginFormError = {
    userAccount: '',
    userPassword: ''
  }
  loginErrorMess = {
    userAccount: {
      required: '账号不能为空'
    },
    userPassword: {
      required: '密码不能为空'
    }
  }

  constructor(
    private dialogRef: MdDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private httpServer: YslHttpService,
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
    console.log('reme', this.loginForm);
    if (!this.loginForm) { return }
    this.isLoginSubmit = true;
    const form = this.loginForm;
    for (const field in this.loginFormError) {
      this.loginFormError[field] = '';
      const control = form.get(field);
      if (control && control.invalid) {
        const message = this.loginErrorMess[field];
        for (const error in control.errors) {
          this.loginFormError[field] += message[error] + ''
        }
      }
    }
    if (form.invalid) { return }
    this.loginMess = '登录中....';
    const submitTime = new Date();
    let submitData = {
      loginId: form.value['userAccount'],
      passcode: form.value['userPassword'],
      oneTimeCode: submitTime.getTime()
    };
    this.httpServer.userLogin(submitData)
      .then((res) => {
        console.log('user id', res)
        if (form.value['isRem']) { this.cookie.put('userAccount', res['loginId'])}
        this.dialogRef.close({userLoginInfo: res});
        const path = this.location.path();
        if (path.includes('/register')) {
          this.router.navigate(['index'])
        }
      })
  }

  gotoRegitster(){
    // todo
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

