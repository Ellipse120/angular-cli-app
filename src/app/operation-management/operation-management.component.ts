import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../core/ysl-http.service';
import {MdSnackBar} from "@angular/material";
import {Router} from "@angular/router";
import {YslCommonService} from "../core/ysl-common.service";

@Component({
  selector: 'app-operation-management',
  templateUrl: './operation-management.component.html',
  styleUrls: ['./operation-management.component.css']
})
export class OperationManagementComponent implements OnInit {

  currSideIndex: number;
  currSideChild: number;
  // operateTag = [
  //   {text: '用户管理', path: 'userManage'},
  //   {text: '产品',path: 'productlist',children: [
  //     {text: '产品列表', path: 'productlist'},
  //     {text: '纠错处理', path: 'error'}
  //   ]}
  // ];

  userId: any;
  userInfo: any;
  profileSrc = '';
  selfIntroduction: string;
  isEditable: boolean = false;

  operateTag = [
    {text: '产品管理', path: 'productManagement'},
    {text: '用户管理', path: 'userManage'},
    {text: '运营报告', path: 'operationalReport'}
  ];

  constructor(private cookie: CookieService,
              private httpService: YslHttpService,
              private commonService: YslCommonService,
              public snackBar: MdSnackBar,
              private router: Router) {}

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.commonService.getLoginStatus().subscribe(data => {
      if (data.loginStatus) {
        this.userId = data['userInfo']['id'];
      }
    });

    if (this.userId) {
      this.httpService.getUserInfo(this.userId)
        .then(res => {
          this.userInfo = res;
          this.profileSrc = this.userInfo.logoFilePath ? this.httpService.url + 'api/file/' + this.userInfo.logoFilePath  + '/download' : '../../assets/images/userDefaultAvatar.png';
        }, error => {
          this.commonService.requestErrorHandle(error);
          this.profileSrc = '../../assets/images/userDefaultAvatar.png';
        });
    } else {
      this.profileSrc = '../../assets/images/userDefaultAvatar.png';
    }
  }
}
