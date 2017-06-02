import { Component, OnInit } from '@angular/core';
import {MyServiceService} from "../core/app.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  registerForm: FormGroup;
  formErrorTip = {
    email: ''
  }

  constructor(public service: MyServiceService, public fb: FormBuilder) { }

  submit(): void {
    let emailControl = this.registerForm.get('email');
    console.log('form-control', emailControl)
    this.email = this.registerForm.value.email;
    console.log('email', this.email)

    if (emailControl.errors && emailControl.errors.required) {
      this.formErrorTip.email = '请填写邮箱'
    } else if (emailControl.errors && emailControl.errors.pattern) {
      this.formErrorTip.email = '请填写正确格式的邮箱'
    } else {
      this.formErrorTip.email = ''
    }
    // return
    // if (!this.email) { return }
    // this.service.userRegister(this.email).then(res => {
    //   console.log('注册', res)
    // }, error => {
    //   console.log('error', error)
    // })
  }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: [this.email, Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+')
      ])]
    })
  }



}
