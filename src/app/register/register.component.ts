import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {YslHttpService} from '../core/ysl-http.service';
import {MdSnackBar} from '@angular/material';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {YslCommonService} from '../core/ysl-common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  registerError: boolean;
  errorMessage = '注册失败';
  registerSuccess: boolean;
  isSubmit: boolean;
  formErrors = {
    phone: '',
    smsCode: '',
    password: '',
    agreement: ''
  };
  validationMessages = {
    email: {
      required: '请输入邮箱',
      pattern: '邮箱格式不正确'
    },
    phone: {
      required: '请输入手机号'
    },
    smsCode: {
      required: '请输入验证码'
    },
    passcode: {
      required: '请输入密码',
      pattern: '密码不能少于8位'
    },
    agreement: {
      required: '请仔细阅读用户协议并同意'
    }
  };
  timer;
  countNum = 59;
  isBtnDisabled = false;
  btnContent = '发送验证码';

  constructor(public service: YslHttpService,
              private cookie: CookieService,
              private commonService: YslCommonService,
              public fb: FormBuilder,
              private snackBar: MdSnackBar,
              private router: Router) {
  }

  submit(): void {
    if (!this.registerForm) {
      return;
    }
    if (this.registerForm.invalid) {
      return;
    }
    this.isSubmit = true;
    const form = this.registerForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const err in control.errors) {
            if (control.errors.hasOwnProperty(err)) {
              this.formErrors[field] += messages[err] + '';
            }
          }
        }
      }
    }
    if (form.invalid) {
      return;
    }
    const signUpParas = {
      userContactPhone: this.registerForm.value['phone'],
      smsCode: this.registerForm.value['smsCode'],
      passcode: this.registerForm.value['password']
    };
    this.service.userRegister(signUpParas).then(res => {
      const loginData = {
        loginId: this.registerForm.value['phone'],
        passcode: this.registerForm.value['password'],
        oneTimeCode: new Date().getTime()
      };
      this.registerSuccess = true;
      this.snackBar.open('注册成功', '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
      this.service.userLogin(loginData).then((resp) => {
        this.commonService.modifyLoginStatus({loginStatus: true, userInfo: resp});
        this.router.navigate(['../index']);
      }, error => {
        // const body = JSON.parse(error._body);
        // console.log(body.errorMessage);
      });
    }, error => {
      const body = JSON.parse(error._body);
      this.errorMessage = body.errorMessage;
      this.registerError = true;
      this.snackBar.open('注册失败', '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
      console.log(body);
    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    // const emailExp = /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/;
    this.registerForm = this.fb.group({
      phone: new FormControl('', Validators.required),
      smsCode: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      agreement: ['', Validators.required]
    });
  }

  getValidateCode() {
    const form = this.registerForm;
    if (form.controls['phone'].invalid) {
      this.formErrors.phone = '请输入手机号';
      return;
    }
    this.timer = setInterval(() => {
      this.btnContent = this.countNum + '秒后重新发送';
      this.countNum--;
      this.isBtnDisabled = true;
      if (this.countNum <= 0) {
        clearInterval(this.timer);
        this.countNum = 59;
        this.btnContent = '发送验证码';
        this.isBtnDisabled = false;
      }
    }, 1000);

    this.service.getValidateCode(form.value['phone'])
      .then(res => {
        this.snackBar.open('验证码发送成功', '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      }, error => {
        const body = JSON.parse(error._body);
        this.errorMessage = body.errorMessage;
        this.snackBar.open(this.errorMessage, '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      });
  }

}
