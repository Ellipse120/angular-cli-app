import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';


import {YslHttpService} from '../../core/ysl-http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YslCommonService} from '../../core/ysl-common.service';
import {CookieService} from 'ngx-cookie';
import {MdSnackBar} from '@angular/material';
import {SearchService} from '../../search/search.service';

@Component({
  selector: 'psd-modify',
  templateUrl: 'psd-modify.component.html',
  styleUrls: ['./user-info.component.css']
})

export class PsdModifyComponent implements OnInit {

  modifyForm: FormGroup;
  userId: any;
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
      minlength: '密码长度不能小于8',
      maxlength: '密码长度不得超过16',
      notBlank: '密码不能以空格开头或空格结尾'
    },
    confirmPass: {
      required: '密码不能为空'
    },
    oldPass: {
      required: '请输入原密码'
    }
  };

  constructor(private httpService: YslHttpService,
              private fb: FormBuilder,
              private router: Router,
              private commonService: YslCommonService,
              private cookie: CookieService,
              public snackBar: MdSnackBar,
              private searchService: SearchService) {
  }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo')['id'];
    this.createForm();
  }

  // 修改密码
  modifySubmit() {
    const form = this.modifyForm;
    const formValue = form.value;
    console.log('form', form)
    this.isSubmit = true;
    this.isInconsistent = (formValue['newPass'] !== formValue['confirmPass']) ? true : false;
    for (const field in this.formError) {
      if (this.formError.hasOwnProperty(field)) {
        this.formError[field] = '';
        const control = form.controls[field];
        if (control && control.errors && !control.valid) {
          const mess = this.formErrorMess[field];
          for (const err in control.errors) {
            if (control.errors.hasOwnProperty(err)) {
              this.formError[field] += mess[err] + '';
            }
          }
        }
      }
    }
    if (form.invalid || this.isInconsistent) {
      return;
    }
    this.httpService.updatePass({
      userId: this.userId,
      data: {newPasscode: formValue['newPass'].replace(/(^\s*)|(\s*$)/g, ''), oldPasscode: formValue['oldPass'].replace(/(^\s*)|(\s*$)/g, '')}
    })
      .then(res => {
        this.snackBar.open('密码修改成功，请重新登录', '', {
          duration: 1000,
          extraClasses: ['ysl-snack-bar']
        });
        setTimeout(() => {
          this.searchService.logoutEvent.emit();
        }, 1000);
      }, error => {
        const err = error.json();
        if (!err.errorMessage) { return; }
        this.snackBar.open(err.errorMessage, '', {
          duration: 1500,
          extraClasses: ['ysl-snack-bar']
        });
      });
  }

  // 创建表单
  createForm() {
    this.modifyForm = this.fb.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        ((arg) => {
          return  arg.value.startsWith(' ') || arg.value.endsWith(' ') ? {'notBlank': true} : null;
        })
      ])],
      confirmPass: ['', Validators.required]
    });
  }
}
