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
  userInfo = [
    {label: '账号', formControlName: 'loginId', model: '', edit: false},
    {label: '姓名', formControlName: 'userName', model: '', edit: false},
    {label: '联系方式', formControlName: 'contactMail', model: '', edit: false}
  ];
  constructor(private httpService: YslHttpService,
              private cookie: CookieService,
              private fb: FormBuilder,
              private commonService: YslCommonService) {}

  ngOnInit() {
    this.viewInfo = this.cookie.getObject('yslUserInfo');
    this.userInfo.forEach(item => {         // 初始化个人信息
      for (const key in this.viewInfo) {
        if (item.formControlName == key) {
          item.model = this.viewInfo[key];
        } else if (item.formControlName == 'userName') {
          item.model = this.viewInfo['name']
        }
      }
    });
    this.viewInfo['loginTime'] = this.commonService.getDateForDay(this.viewInfo['loginTime']);
    console.log('user', this.viewInfo);
    this.createForm();
  }

  // 编辑用户信息
  ableEdit() {
    this.showSave = true;
    this.userInfo.forEach(item => {
      if (item.formControlName == 'loginId') {
        item.edit = false;
      } else {
        item.edit = true;
      }
    })
  }

  // 提交修改资料
  infoEditSubmit() {
    console.log('user', this.editForm.value);
    if (!this.editForm) { return }
    let data = this.editForm.value;
    let option = {userId: '', data: {}};
    data.id = this.viewInfo.id;
    option.userId = data.id;
    option.data = data;
    this.httpService.updateUser(option)
      .then(res => {
        console.log('修改成功', res)
        this.showSave = false;
        // 修改成功后对模板的修改
        this.userInfo.forEach(item => {
          item.edit = false;
          for (const key in this.editForm.value) {
            if (item.formControlName == key) {
              item.model = this.editForm.value[key];
            }
          }
        })
      })
  }

  // 创建表单
  createForm() {
    let controls = {
      loginId: '',
      userName: '',
      contactMail: ''
    };
    this.userInfo.forEach(item => {
      for (const key in controls) {
        if (item.formControlName == key) {
          controls[key] = item.model;
        }
      }
    })
    this.editForm = this.fb.group(controls);

  }
}
