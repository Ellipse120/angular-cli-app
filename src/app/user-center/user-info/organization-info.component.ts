import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../../core/ysl-common.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './organization-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class organizationInfoComponent implements OnInit {

  organizationForm: FormGroup;
  subscription: Subscription;
  userId: any;
  userInfo: any;
  isEditable = false;
  isSubmit = false;
  orgViewInfo = [
    {label: '组织名称', formControlName: 'name', model: ''},
    {label: '联系人姓名', formControlName: 'contactName', model: ''},
    {label: '手机号', formControlName: 'contactPhone', model: ''},
    {label: '公司官网URL', formControlName: 'webSite', model: ''},
  ];
  orgFormError = {
    name: '',
    contactName: '',
    contactPhone: '',
    webSite: ''
  };
  orgFormErrorMess = {
    name: {
      required: '请输入公司名称'
    },
    contactName: {
      required: '请输入联系人名称'
    },
    contactPhone: {
      required: '请输入联系人手机号码',
      pattern: '请输入正确格式的手机号或电话'
    },
    webSite: {
      required: '请输入组织官网',
      pattern: '请输入正确格式的网址'
    }
  };

  constructor(private fb: FormBuilder,
              private httpService: YslHttpService,
              private commonService: YslCommonService,
              private cookie: CookieService) {
  }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.createForm();
    if (this.userId) {
      this.httpService.getUserInfo(this.userId)
        .then(res => {
          this.infoProcessing(res);
        }, error => {
          this.commonService.requestErrorHandle(error);
        });
    }
    this.getUserInfo();
  }

  // 获取用户信息
  getUserInfo() {
    this.commonService.getUserInfo().subscribe(e => {
      if (e.userInfo) {
        this.infoProcessing(e.userInfo);
      }
    }, error => {
      this.commonService.requestErrorHandle(error);
    });
  }

  infoProcessing(data) {
    this.userInfo = data;
    if (!this.userInfo.hasOwnProperty('orgName')) {
      this.orgViewInfo.forEach(item => {
        item['model'] = this.userInfo[item.formControlName];
        if (item.formControlName === 'name') {
          item.model = this.userInfo['orgName'];
        }
        item['edit'] = true;
      });
      this.isEditable = true;
    } else {
      this.orgViewInfo.forEach(item => {
        item['model'] = this.userInfo[item.formControlName];
        if (item.formControlName === 'name') {
          item.model = this.userInfo['orgName'];
        }
        item['edit'] = false;
      });
    }
  }
  // 提交组织认证
  submitOrganization(isVerify) {
    this.isSubmit = true;
    const form = this.organizationForm;
    for (const mess in this.orgFormError) {
      if (this.orgFormError.hasOwnProperty(mess)) {
        this.orgFormError[mess] = '';
        const control = form.get(mess);
        if (control && control.errors) {
          const message = this.orgFormErrorMess[mess];
          for (const error in control.errors) {
            if (control.errors.hasOwnProperty(error)) {
              this.orgFormError[mess] += message[error] + '';
            }
          }
        }
      }
    }
    if (this.organizationForm.invalid) {
      return;
    }
    const option = {userId: this.userId};
    for (const key in form.value) {
      if (form.value.hasOwnProperty(key)) {
        option[key] = form.value[key];
      }
    }
    this.httpService.verifyOrganization(option)
      .then(res => {
        // let userInfo = this.userInfo;
        // userInfo['userType'] = parseInt(userInfo['userType'] + '0');
        // this.cookie.putObject('yslUserInfo', userInfo);
        this.updateUserInfo();
        // window.location.reload();
        if (!isVerify) {
          this.orgViewInfo.forEach(item => {
            item['edit'] = false;
            this.isEditable = false;
          });
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 更新用户信息
  updateUserInfo() {
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.commonService.updateUserInfo(res);
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 修改组织信息
  editable() {
    const controls = {
      name: '',
      contactName: '',
      contactPhone: '',
      webSite: ''
    };
    this.orgViewInfo.forEach(item => {
      item['edit'] = true;
      controls[item.formControlName] = item.model;
    });
    this.organizationForm.patchValue(controls);
    this.isEditable = true;
  }

  cancel() {
    this.orgViewInfo.forEach(item => {
      item['edit'] = false;
    });
    this.isEditable = false;
  }

  createForm() {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.compose([
        Validators.required,
      ])],
      webSite: ['', Validators.compose([
        Validators.required
      ])]
    });
  }
}

// ^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$
