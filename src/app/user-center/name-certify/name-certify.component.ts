import {Component , OnInit} from '@angular/core';
import {YslHttpService} from "../../core/ysl-http.service";

@Component({
  selector: 'name-certify',
  templateUrl: './name-certify.component.html',
  styleUrls: ['../user-center.component.css']
})

export class NameCertifyComponent implements OnInit{

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
  idenType = [
    {type: '个人认证'},
    {type: '机构认证'}
  ];

  constructor(public httpService: YslHttpService) {

  }

  // 获取验证码
  sendCode() {
    this.timer = setInterval(() => {
      this.content = this.num + 's后重新发送';
      this.num--;
      this.able = true;
      if (this.num <= 0) {
        clearInterval(this.timer);
        this.num = 59;
        this.content = '发送验证码';
        this.able = false;
      }
    }, 1000)

  }

  //// 获取用户信息
  //getUserInfo() {
  //  this.uservice
  //    .getUserInfo()
  //    .then(user => this.user = user);
  //}

  tabType(i) {
    this.indexType = i;
  }

  // 确定
  perEnsure(i) {
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
  }
}
