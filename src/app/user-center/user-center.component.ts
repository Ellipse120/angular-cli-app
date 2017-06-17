import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css']
})
export class UserCenterComponent implements OnInit {

  user = {
    count: ''
  };
  index = 0;
  userTag = [
    {text: '个人信息', path: 'userInfo'},
    {text: '实名认证', path: 'nameCertify'},
    {text: '修改密码', path: 'psdModify'}
  ];

  constructor(public httpService: YslHttpService) {

  }

  获取用户信息
  getUserInfo() {
    this.httpService
      .getUserList()
      .then(user => this.user = user);
  }

  // 切换
  tab(index) {
    this.index = index;
    console.log(index);
  };

  ngOnInit() {
    this.getUserInfo();
  }

}
