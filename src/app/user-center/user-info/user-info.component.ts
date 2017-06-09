import {Component , OnInit} from '@angular/core';
import {MyServiceService} from '../../core/app.service';
import {CookieService} from "ngx-cookie";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../user-center.component.css']
})

export class UserInfoComponent implements OnInit {

  editForm: FormGroup;
  showSave = false;
  userInfo = [
    {label: '账号', formControlName: 'loginId', model: '', edit: false},
    {label: '姓名', formControlName: 'userName', model: '', edit: false},
    {label: '联系方式', formControlName: 'contactMail', model: '', edit: false}
  ];
  constructor(public httpService: MyServiceService,
              private cookie: CookieService,
              private fb: FormBuilder) {}

  ngOnInit() {
    let user = this.cookie.getObject('yslUserInfo');
    this.userInfo.forEach(item => {
      for (const key in user) {
        if (item.formControlName == key) {
          item.model = user[key];
          console.log('key', user[key])
        }
      }
    })
    console.log('user', user)
    this.createForm();
  }

  // 编辑用户信息
  ableEdit() {
    this.showSave = true;
    this.userInfo.forEach(item => {
      item.edit = true;
    })
  }

  // 提交修改资料
  infoEditSubmit() {
    console.log('user', this.editForm.value)

    // 修改成功后对模板的修改
    this.userInfo.forEach(item => {
      item.edit = false
      for (const key in this.editForm.value) {
        if (item.formControlName == key) {
          item.model = this.editForm.value[key];
        }
      }
    })
  }

  // 创建表单
  createForm() {
    this.editForm = this.fb.group({
      loginId: '',
      userName: '',
      contactMail: ''
    })
  }
}
