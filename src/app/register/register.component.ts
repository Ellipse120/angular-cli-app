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

  constructor(public service: MyServiceService, public fb: FormBuilder) { }

  submit(form: any): void {
    console.log('form', form)
    this.email = this.registerForm.value.email;
    console.log('email', this.email)
    if (!this.email) { return }
    this.service.userRegister(this.email).then(res => {
      console.log('注册', res)
    }, error => {
      console.log('error', error)
    })
  }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: [this.email, Validators.required]
    })
  }



}
