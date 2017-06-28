import {Component , OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from "ngx-cookie";
import {FormBuilder, FormGroup} from "@angular/forms";
import {YslCommonService} from "../../core/ysl-common.service";

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../user-center.component.css']
})

export class UserInfoComponent implements OnInit {

  userTag = [
    {text: '个人信息', path: 'userBaseInfo'},
    {text: '修改密码', path: 'userPsdModify'},
    {text: '手机绑定', path: 'userVerify'}
  ];
  constructor(private httpService: YslHttpService,
              private cookie: CookieService,
              private fb: FormBuilder,
              private commonService: YslCommonService) {}

  ngOnInit() {

  }
}
