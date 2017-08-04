import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {YslHttpService} from '../core/ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../core/ysl-common.service';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-retrieve-pass',
  templateUrl: './retrieve-pass.component.html',
  styleUrls: ['./retrieve-pass.component.css']
})
export class RetrievePassComponent implements OnInit {

  registerForm: FormGroup;
  registerError: boolean;
  isBtnDisabled = false;
  registerSuccess: boolean;
  isSubmit: boolean;
  formErrors = {
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
      required: '请输入验证码',
    },
    password: {
      required: '请输入密码',
      minlength: '密码不能少于8位',
      pattern: '密码不能以空格开头或结尾',
      notBlank: '密码不能以空格开头或空格结尾'
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
      passcode: this.registerForm.value['password'].replace(/(^\s*)|(\s*$)/g, '')
    };
    this.service.resetPassword(signUpParas).subscribe(res => {
      this.registerSuccess = true;
      this.snackBar.open('密码修改成功', '', {
        duration: 2000,
        extraClasses: ['ysl-snack-bar']
      });
      this.router.navigate(['re-login']);
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
      smsCode: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        ((arg) => {
           return  arg.value.startsWith(' ') || arg.value.endsWith(' ') ? {'notBlank': true} : null;
        })
      ]))
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
    this.service.reacquireValidCode(form.value['phone'])
      .subscribe(res => {
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
