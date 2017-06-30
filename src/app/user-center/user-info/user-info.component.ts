import {Component , OnInit} from '@angular/core';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../user-center.component.css']
})

export class UserInfoComponent implements OnInit {

  userId: any;
  userTag = [
    {text: '个人信息', path: 'userBaseInfo'},
    {text: '组织信息', path: 'organizationInfo'},
    {text: '修改密码', path: 'userPsdModify'},
    {text: '手机绑定', path: 'userVerify'}
  ];

  constructor() {}

  ngOnInit() {}


}
