import {Component, OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YslCommonService} from '../../core/ysl-common.service';
import {CookieService} from 'ngx-cookie';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'name-certify',
  templateUrl: 'name-certify.component.html',
  styleUrls: ['./user-info.component.css']
})

export class NameCertifyComponent implements OnInit {

  individualForm: FormGroup;
  userInfo: any;
  userId: any;
  CurrTab = 0;
  timer;
  countNum = 59;
  isBtnDisabled = false;
  btnContent = '发送验证码';
  modify = [];
  userTypeTabs = ['个人认证', '机构认证'];
  individualFormError = {
    name: '',
    tel: '',
    validCode: ''
  };
  individualFormErrorMess = {
    // name: {
    //   required: '请输入姓名'
    // },
    tel: {
      required: '请输入手机号'
    },
    validCode: {
      required: '请输入验证码'
    }
  };

  constructor(private httpService: YslHttpService,
              private fb: FormBuilder,
              private cookie: CookieService,
              private commonService: YslCommonService,
              public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.userInfo = res;
        if (this.userInfo.userContactPhone) {
          const tel = this.userInfo.userContactPhone;
          // this.userInfo.userContactPhone = tel.substr(0, 3) + '****' + tel.substr(7);
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
    this.getUserInfo();
    this.createForm();
  }

  // 获取用户信息
  getUserInfo() {
    this.commonService.getUserInfo().subscribe(e => {
      this.userInfo = e.userInfo;
    });
  }

  // 获取验证码
  getValidateCode() {
    const form = this.individualForm;
    if (form.controls['tel'].invalid) {
      this.individualFormError.tel = '请输入手机号';
      return;
    }
    this.httpService.getValidateCode(form.value['tel'])
      .then(res => {
        this.snackBar.open('验证码发送成功', '', {
          duration: 3000,
          extraClasses: ['ysl-snack-bar']
        });
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
      }, error => {
        const body = JSON.parse(error._body);
          this.commonService.requestErrorHandle(error);
        this.snackBar.open(body.errorMessage, '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      });
  }

  // 提交个人认证
  submitIndividual() {
    const form = this.individualForm;
    for (const mess in this.individualFormError) {
      if (this.individualFormError.hasOwnProperty(mess)) {
        this.individualFormError[mess] = '';
        const control = form.get(mess);
        if (control && control.errors) {
          const message = this.individualFormErrorMess[mess];
          for (const error in control.errors) {
            if (control.errors.hasOwnProperty(error)) {
              this.individualFormError[mess] += message[error] + '';
            }
          }
        }
      }
    }

    if (this.individualForm.invalid) {
      return;
    }
    const option = {
      userId: this.userInfo['userId'],
      userContactPhone: form.value['tel'],
      smsCode: form.value['validCode']
    };
    this.httpService.verifyIndividual(option)
      .then(res => {
        // let userInfo = this.userInfo;
        // userInfo['userType'] = parseInt(userInfo['userType'] + '0');
        // this.cookie.putObject('yslUserInfo', userInfo);
        this.getUserInfo();
        // window.location.reload();
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 切换tab
  switchTab(i) {
    this.CurrTab = i;
  }

  // 创建表单
  createForm() {
    this.individualForm = this.fb.group({
      // name: ['', Validators.required],
      tel: ['', Validators.required],
      validCode: ['', Validators.required]
    });
  }
}
