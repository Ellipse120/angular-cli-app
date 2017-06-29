import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {YslHttpService} from "../../core/ysl-http.service";
import {CookieService} from "ngx-cookie";
import {YslCommonService} from "../../core/ysl-common.service";
import {resolve} from "url";

@Component({
  templateUrl: './organization-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class organizationInfoComponent implements OnInit {

  organizationForm: FormGroup;
  userId: any;
  userInfo: any;
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
              private cookie: CookieService) {}

  ngOnInit() {
    this.createForm();
    this.getUserInfo();
  }

  // 获取用户信息
  getUserInfo() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    // this.commonService.getUserInfo(this.userId).then(() => { this.userInfo = this.commonService.userInfo; });
    // console.log('org user info', this.userInfo)
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.userInfo = res;
      });
  }

  // 提交组织认证
  submitOrganization() {
    let form = this.organizationForm;
    for (let mess in this.orgFormError) {
      this.orgFormError[mess] = '';
      let control = form.get(mess);
      if (control && control.errors) {
        let message = this.orgFormErrorMess[mess];
        for (let error in control.errors) {
          this.orgFormError[mess] += message[error] + ''
        }
      }
    }
    if (this.organizationForm.invalid) { return }
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
      })
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
    })
  }
}

// ^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$
