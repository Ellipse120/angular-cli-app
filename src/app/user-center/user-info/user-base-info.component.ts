import {Component, OnInit, OnDestroy} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from "ngx-cookie";
import {FormBuilder, FormGroup} from "@angular/forms";
import {YslCommonService} from "../../core/ysl-common.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'user-info',
  templateUrl: './user-base-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class UserBaseInfoComponent implements OnInit,OnDestroy {

  editForm: FormGroup;
  subscription: Subscription;
  viewInfo: any;
  userId: any;
  userInfo = [
    {label: '姓名', formControlName: 'userName', model: '', edit: false},
    {label: '联系方式', formControlName: 'contactMail', model: '', edit: false}
  ];
  constructor(private httpService: YslHttpService,
              private cookie: CookieService,
              private fb: FormBuilder,
              private commonService: YslCommonService) {}

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.createForm();
    this.getViewInfo();

  }

  getViewInfo() {
    this.subscription = this.commonService.getUserInfo().subscribe(e => {
      this.viewInfo = e.userInfo;
      this.userInfo.forEach(item => {         // 初始化个人信息
        for (const key in this.viewInfo) {
          if (item.formControlName == key) {
            item.model = this.viewInfo[key];
          }
        }
      });
      this.viewInfo['lastLogonTime'] = this.commonService.getDateForDay(this.viewInfo['lastLogonTime']);
    });
  }

  // 编辑用户信息
  ableEdit(info) {
    let controls = {
      userName: '',
      contactMail: ''
    };
    this.userInfo.forEach(item => {
      if (item == info) {
        item.edit = true;
      }
      for(let key in controls) {
        controls[item.formControlName] = item.model;
      }
    });
    this.editForm.patchValue(controls);
  }

  // 提交修改资料
  infoEditSubmit(info) {
    if (!this.editForm) { return }
    let data = this.editForm.value;
    data.id = this.userId;
    this.httpService.updateUser(data)
      .then(res => {
        // 修改成功后对模板的修改
        this.userInfo.forEach(item => {
          if (item == info) { item.edit = false }
        });
        this.updateUserInfo();
      })
  }

  // 更新用户信息
  updateUserInfo() {
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.commonService.updateUserInfo(res);
      });
  }

  // 创建表单
  createForm() {
    this.editForm = this.fb.group({
      userName: '',
      contactMail: ''
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
