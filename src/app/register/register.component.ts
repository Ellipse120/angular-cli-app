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
  isSubmit: boolean;
  formErrors = {
    email: '',
    agreement: ''
  }
  validationMessages = {
    email: {
      required: '请输入邮箱',
      pattern: '邮箱格式不正确'
    },
    agreement: {
      required: '请仔细阅读用户协议并同意'
    }
  }

  constructor(public service: MyServiceService, public fb: FormBuilder) { }

  submit(): void {
    if (!this.registerForm) { return }
    console.log('registerForm', this.registerForm)
    this.isSubmit = true;
    const form = this.registerForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.validationMessages[field];
        for (const err in control.errors) {
          this.formErrors[field] += messages[err] + ''
        }
      }
    }
    if (form.invalid) { return }
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
    const emailExp = /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/
    this.registerForm = this.fb.group({
      email: [this.email, Validators.compose([
        Validators.required,
        Validators.pattern(emailExp)
      ])],
      agreement: ['', Validators.required]
    })
  }



}
