import {Component , OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from "ngx-cookie";
import {FormBuilder, FormGroup} from "@angular/forms";
import {YslCommonService} from "../../core/ysl-common.service";

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../user-center.component.css']
})

export class UserInfoComponent implements OnInit {

  editForm: FormGroup;
  showSave = false;
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
    this.getViewInfo();
    this.createForm();
  }

  getViewInfo() {
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.viewInfo = res;
        this.userInfo.forEach(item => {         // 初始化个人信息
          for (const key in this.viewInfo) {
            if (item.formControlName == key) {
              item.model = this.viewInfo[key];
            }
          }
        });
        this.viewInfo['lastLogonTime'] = this.commonService.getDateForDay(this.viewInfo['lastLogonTime']);
      })
  }

  // 编辑用户信息
  ableEdit() {
    let controls = {
      userName: '',
      contactMail: ''
    };
    this.showSave = true;
    this.userInfo.forEach(item => {
      for(let key in controls) {
        if (item.formControlName == key) {
          controls[key] = item.model;
          item.edit = true;
        }
      }
    });
    this.editForm.patchValue(controls);
  }

  // 提交修改资料
  infoEditSubmit() {
    if (!this.editForm) { return }
    let data = this.editForm.value;
    let option = {userId: '', data: {}};
    data.id = this.userId;
    option.userId = this.userId;
    option.data = data;
    this.httpService.updateUser(option)
      .then(res => {
        this.showSave = false;
        // 修改成功后对模板的修改
        this.getViewInfo();
        this.userInfo.forEach(item => {
          item.edit = false;
        })
      })
  }

  // 创建表单
  createForm() {
    this.editForm = this.fb.group({
      userName: '',
      contactMail: ''
    });
  }
}
