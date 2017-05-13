import { Component, OnInit } from '@angular/core';
import {MyServiceService} from '../core/app.service';

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css']
})
export class UserCenterComponent implements OnInit {

  user = {};
  showEdit = true;
  index = 0;
  indexType = 0;
  timer;
  num = 59;
  able = true;
  content = '发送验证码';
  perstate = false;
  govstate = false;
  modify = [];
  iden = [];
  goviden = [];
  userTag = [
    {text: '个人信息'},
    {text: '实名认证'},
    {text: '修改密码'}
  ];
  idenType = [
    {type: '个人认证'},
    {type: '机构认证'}
  ];

  constructor(public uservice: MyServiceService) {

  }

  // 获取验证码
  sendCode() {
    // if(this.iden.tel){
    //
    // }
    this.timer = setInterval(() => {
      this.content = this.num + 's后重新发送';
      this.num--;
      if (this.num <= 0) {
        clearInterval(this.timer);
        this.num = 59;
        this.content = '发送验证码';
      }
    }, 1000)

  }

  // 获取用户信息
  getUserInfo() {
    this.uservice
      .getUserInfo()
      .then(user => this.user = user);
  }

  // 编辑用户信息
  ableEdit() {
    this.showEdit = false;
  }

  // 切换
  tab(index) {
    this.index = index;

    console.log(index);
  };

  tabType(i) {
    this.indexType = i;
  }

  // 确定
  perEnsure(i) {
    console.log(i)
    this.perstate = true;
    switch (i) {
      case 0:
        this.perstate = true;
        break;
      case 1:
        this.govstate = true;
        break;
    }
  }

  ngOnInit() {
    this.getUserInfo();
  }

}
