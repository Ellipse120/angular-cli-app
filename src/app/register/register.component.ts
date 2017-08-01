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
  isBtnDisabled = false;
  registerSuccess: boolean;
  isSubmit: boolean;
  formErrors = {
    agreement: '',
    password: '',
    smsCode: '',
    phone: ''
  };
  validationMessages = {
    phone: {
      required: '请输入手机号',
      pattern: '请输入正确格式的手机号'
    },
    smsCode: {
      required: '请输入验证码'
    },
    password: {
      required: '请输入密码',
      minlength: '密码不能少于8位'
    },
    agreement: {
      required: '请仔细阅读用户协议并同意'
    }
  };
  timer;
  countNum = 59;
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
    this.isSubmit = true;
    const form = this.registerForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        let control;
        if (field === 'phone') {
          control = form.get(field);
        } else if (field === 'smsCode') {
          control = form.get(field);
        } else if (field === 'password') {
          control = form.get(field);
        } else if (field === 'agreement') {
          control = form.get(field);
        }
        this.formErrors[field] = '';
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const err in control.errors) {
            if (control.errors[err]) {
              this.formErrors[field] += messages[err] + '';
              this.snackBar.open(this.formErrors[field], '', {
                duration: 2000,
                extraClasses: ['ysl-snack-bar']
              });
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
      this.commonService.requestErrorHandle(error);
    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const phoneExp = '^1[34578]\\d{9}$';
    this.registerForm = this.fb.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(phoneExp)
      ])),
      smsCode: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      agreement: ['', Validators.required]
    });
  }

  getValidateCode(type) {
    const form = this.registerForm;
    if (form.controls['phone'].invalid) {
      const phone = form.controls['phone'];
      const errorMess = phone['errors']['required'] ? '请输入手机号' : '请输入正确格式的手机号';
      // this.formErrors.phone = '请输入手机号';
      this.snackBar.open(errorMess, '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
      return;
    }
    this.service.getValidateCode(form.value['phone'])
      .then(res => {
        this.sendValidCodeSuccess();
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 验证码发送成功
  sendValidCodeSuccess() {
    this.isBtnDisabled = true;
    this.snackBar.open('验证码发送成功', '', {
      duration: 2000,
      extraClasses: ['ysl-snack-bar']
    });
    this.timer = setInterval(() => {
      this.btnContent = this.countNum + '秒后重新发送';
      this.countNum--;
      if (this.countNum <= 0) {
        this.isBtnDisabled = false;
        clearInterval(this.timer);
        this.countNum = 59;
        this.btnContent = '重新发送';
      }
    }, 1000);
  }
}
