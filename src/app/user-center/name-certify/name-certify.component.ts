import {Component , OnInit} from '@angular/core';
import {YslHttpService} from "../../core/ysl-http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {resource} from "selenium-webdriver/http";
import {YslCommonService} from "../../core/ysl-common.service";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'name-certify',
  templateUrl: './name-certify.component.html',
  styleUrls: ['../user-center.component.css']
})

export class NameCertifyComponent implements OnInit{

  individualForm: FormGroup;
  organizationForm: FormGroup;
  userInfo: any;
  userId: any;
  CurrTab = 0;
  timer;
  countNum = 59;
  isBtnDisabled = false;
  btnContent = '发送验证码';
  modify = [];
  goviden = [];
  userTypeTabs = ['个人认证', '机构认证'];

  constructor(private httpService: YslHttpService,
              private fb: FormBuilder,
              private cookie: CookieService) {}

  ngOnInit() {
    this.getUserInfo();
    this.createForm();
  }

  // 获取用户信息
  getUserInfo() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.userInfo = res;
      });
  }

  // 获取验证码
  getValidateCode() {
    this.timer = setInterval(() => {
      this.btnContent = this.countNum + 's后重新发送';
      this.countNum--;
      this.isBtnDisabled = true;
      if (this.countNum <= 0) {
        clearInterval(this.timer);
        this.countNum = 59;
        this.btnContent = '发送验证码';
        this.isBtnDisabled = false;
      }
    }, 1000)
  }

  // 提交个人认证
  submitIndividual() {
    if (this.individualForm.invalid) { return }
    let form = this.individualForm;
    console.log('userId', this.userId)
    let option = {userId: this.userId, name: form.value['name']};
    this.httpService.verifyIndividual(option)
      .then(res => {
        // let userInfo = this.userInfo;
        // userInfo['userType'] = parseInt(userInfo['userType'] + '0');
        // this.cookie.putObject('yslUserInfo', userInfo);
        this.getUserInfo();
        // window.location.reload();
        console.log('认证成功 ', res)
      })
  }

  // 提交组织认证
  submitOrganization() {
    console.log('org test', this.organizationForm);
    if (this.organizationForm.invalid) { return }
    let form = this.organizationForm;
    let option = {userId: this.userId};
    for (let key in form.value) {
      option[key] = form.value[key];
    }
    this.httpService.verifyOrganization(option)
      .then(res => {
        // let userInfo = this.userInfo;
        // userInfo['userType'] = parseInt(userInfo['userType'] + '0');
        // this.cookie.putObject('yslUserInfo', userInfo);
        this.getUserInfo();
        // window.location.reload();
        console.log('组织认证 ', res)
      })
  }

  // 切换tab
  switchTab(i) {
    this.CurrTab = i;
  }

  // 创建表单
  createForm() {
    this.individualForm = this.fb.group({
      name: ['', Validators.required],
      tel: [''],
      validCode: ['']
    });

    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      webSite: ['', Validators.required]
    })
  }
}
