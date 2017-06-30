import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';
import {YslCommonService} from "../core/ysl-common.service";
import {CookieService} from "ngx-cookie";
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css']
})
export class UserCenterComponent implements OnInit {

  userId: any;
  userInfo: any;
  userTag = [
    {text: '产品管理', path: 'productManagement'},
    {text: '评论', path: 'comment'},
    {text: '收藏', path: 'likes'},
    {text: '赞', path: 'favorite'},
    {text: '个人资料', path: 'userInfo'}
  ];

  constructor(private httpService: YslHttpService,
              private cookie: CookieService,
              private router: Router,
              private commonService: YslCommonService) {}

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.getUserInfo();
    this.updateUserInfo();
  }

  getUserInfo() {
    this.commonService.getUserInfo().subscribe(e => {
      if (e.userInfo) {
        this.userInfo = e.userInfo;
      } else {
        this.httpService.getUserInfo(this.userId)
          .then(res => {
            this.userInfo = res;
          })
      }
    })
  }

  updateUserInfo() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.httpService.getUserInfo(this.userId)
          .then(res => {
            this.commonService.updateUserInfo(res);
          })
      }
    });
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.commonService.updateUserInfo(res);
      })
  }
}
