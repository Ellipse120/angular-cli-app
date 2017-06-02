import { Component } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { FormBuilder, FormGroup } from '@angular/forms'


@Component({
  selector: 'ysl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent  {

  loginForm: FormGroup;

  constructor(
    public dialogRef: MdDialogRef<LoginComponent>, public fb: FormBuilder) {
    this.createForm();
  }


  // 创建表单
  createForm() {
    this.loginForm = this.fb.group({
      userAccount: [''],
      userPassword: ['']
    });
  }

  // 提交登录
  loginSubmit() {
    console.log('登录', this.loginForm.value)
    this.dialogRef.close({status: true});
  }

  gotoRegitster(){
    // todo
  }
}

