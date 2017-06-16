import {Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';


import {YslHttpService} from "../../core/ysl-http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {YslCommonService} from "../../core/ysl-common.service";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'psd-modify',
  templateUrl: './psd-modify.component.html',
  styleUrls: ['../user-center.component.css']
})

export class PsdModifyComponent implements OnInit{

  modifyForm: FormGroup;
  isSubmit = false;
  isInconsistent: boolean;
  formError = {
    newPass: '',
    confirmPass: '',
    oldPass: ''
  };
  formErrorMess = {
    newPass: {
      required: '新密码不能为空',
      pattern: '密码格式不正确',
      minlength: '密码长度不能小于6',
      maxlength: '密码长度不得超过12'
    },
    confirmPass: {
      required: '密码不能为空'
    },
    oldPass: {
      required: '请输入原密码'
    }
  }
  constructor(private httpService: YslHttpService,
              private fb: FormBuilder,
              private router: Router,
              private commonService: YslCommonService,
              private cookie: CookieService) {}

  ngOnInit() {
    this.createForm();
  }

  // 修改密码
  modifySubmit() {
    const form = this.modifyForm;
    const formValue = form.value;
    this.isSubmit = true;
    this.isInconsistent = (formValue['newPass'] != formValue['confirmPass']) ? true : false;
    for (const field in this.formError) {
      this.formError[field] = '';
      const control = form.controls[field];
      if (control && control.errors && !control.valid) {
        const mess = this.formErrorMess[field];
        for (const err in control.errors) {
          this.formError[field] += mess[err] + '';
        }
      }
    }
    console.log('form', form, formValue['newPass'] != formValue['confirmPass'])
    console.log('form invalid', form.invalid)
    if (form.invalid || this.isInconsistent) { return }
    this.httpService.updatePass({userId: this.commonService.userId, data: {newPasscode: formValue['newPass'], oldPasscode: formValue['oldPass']}})
      .then(res => {
        this.cookie.remove('yslUserInfo');
        this.router.navigate(['index']);
        window.location.reload();
      })
  }
  // 创建表单
  createForm() {
    this.modifyForm = this.fb.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9_]*$'),
        Validators.minLength(6),
        Validators.maxLength(12)
      ])],
      confirmPass: ['', Validators.required]
    })
  }
}
