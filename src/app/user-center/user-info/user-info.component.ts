import {Component , OnInit} from '@angular/core';
import {MyServiceService} from '../../core/app.service';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../user-center.component.css']
})

export class UserInfoComponent implements OnInit{

  user = [];
  showEdit = true;
  able = false;
  constructor(public uservice: MyServiceService) {

  }

  // 获取用户信息
  getUserInfo() {
    this.uservice
      .getUserInfo()
      .then(user => {this.user = user; console.log(this.user)});
  }

  // 编辑用户信息
  ableEdit() {
    this.showEdit = false;
    this.able = true;
  }


  ngOnInit() {
    this.getUserInfo();
  }
}
