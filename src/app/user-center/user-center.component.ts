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

  userTag = [
    {text: '产品管理', path: 'productManagement'},
    {text: '评论', path: 'comment'},
    {text: '收藏', path: 'likes'},
    {text: '赞', path: 'favorite'},
    {text: '个人资料', path: 'userInfo'}
  ];

  constructor(private httpService: YslHttpService, private cookie: CookieService) {}

  ngOnInit() {
  }
}
