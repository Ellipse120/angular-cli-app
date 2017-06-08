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
  userInfo = [
    {label: '账号', model: 'account', edit: false, tag: 'loginId'},
    {label: '用户名', model: 'username', edit: false},
    {label: '姓名', model: 'name', edit: false},
    {label: '性别', model: 'sex', edit: false},
    {label: '性别', model: 'birthday', edit: false},
    {label: '所在地', model: 'address', edit: false},
    {label: '联系方式', model: 'contact', edit: false},
    {label: '职业', model: 'job', edit: false}
  ];
  showEdit = true;
  able = false;
  constructor(public httpService: MyServiceService,
              private cookie: CookieService,
              private fb: FormBuilder) {}

  ngOnInit() {
    let user = this.cookie.getObject('yslUserInfo');
    // console.log('user', this.userInfo)
    this.createForm();
  }

  // 编辑用户信息
  ableEdit() {
    this.showEdit = false;
    this.able = true;
  }

  // 创建表单
  createForm() {
    this.editForm = this.fb.group({
      account: '',
      username: '',
      name: '',
      sex: '',
      birthday: '',
      address: '',
      contact: '',
      job: ''
    })
  }
}
