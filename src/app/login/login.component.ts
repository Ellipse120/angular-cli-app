import {Component, OnInit} from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MyServiceService} from '../core/app.service';


@Component({
  selector: 'ysl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoginSubmit = false;
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
    public dialogRef: MdDialogRef<LoginComponent>,
    public fb: FormBuilder,
    public httpServer: MyServiceService,) {
    this.createForm();
  }

  ngOnInit() {
  }

  // 提交登录
  loginSubmit() {
    if (!this.loginForm) { return }
    this.loginMess = '登录中....';
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

    const submitTime = new Date();
    let submitData = {
      loginId: form.value['userAccount'],
      passcode: form.value['userPassword'],
      oneTimeCode: submitTime.getTime()
    };
    this.httpServer.userLogin(submitData)
      .then((res) => {
        this.dialogRef.close({userLoginInfo: res});
      })
  }

  gotoRegitster(){
    // todo
  }

  // 创建表单
  createForm() {
    this.loginForm = this.fb.group({
      userAccount: ['', Validators.required],
      userPassword: ['', Validators.required]
    });
  }
}

