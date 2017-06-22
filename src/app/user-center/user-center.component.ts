import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';
import {YslCommonService} from "../core/ysl-common.service";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css']
})
export class UserCenterComponent implements OnInit {

  user = {
    count: ''
  };
  userInfo: any;
  userTag = [
    {text: '个人信息', path: 'userInfo'},
    {text: '实名认证', path: 'nameCertify'},
    {text: '修改密码', path: 'psdModify'}
  ];

  constructor(private httpService: YslHttpService, private cookie: CookieService) {}

  ngOnInit() {
    // this.getUserList();
    // this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo') : null;
    // let userType = this.userInfo['userType'];
    // if (userType == 30) {
    //   this.userTag.forEach((item, ind) => {
    //     if (item.text == '实名认证') {
    //       this.userTag.splice(ind, 1)
    //     }
    //   })
    // }
  }

  // 获取用户信息
  getUserList() {
    this.httpService
      .getUserList()
      .then(user => this.user = user);
  }
}
