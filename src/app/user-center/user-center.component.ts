import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';
import {YslCommonService} from '../core/ysl-common.service';
import {CookieService} from 'ngx-cookie';
import {Router, NavigationEnd} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {MdSnackBar} from '@angular/material';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css'],

})
export class UserCenterComponent implements OnInit {

  userDesForm: FormGroup;
  userId: any;
  userInfo: any;
  selfIntroduction: string;
  isEditable = false;
  profileSrc = '';
  userDesFormError = {
    selfIntroduction: {
      required: '请输入您的个性签名',
      maxlength: '字数不得超过100字'
    }
  };
  userTag = [
    {text: '产品', path: 'productManagement'},
    {text: '评论', path: 'comment'},
    {text: '收藏', path: 'likes'},
    {text: '赞', path: 'favorite'},
    {text: '个人', path: 'userInfo'}
  ];
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(private httpService: YslHttpService,
              private fb: FormBuilder,
              private cookie: CookieService,
              private router: Router,
              private commonService: YslCommonService,
              private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.uploader = new FileUploader({url: this.httpService.url + 'api/file/upload/user/logo/' + this.userId});
    if (isNullOrUndefined(this.userId)) {
      this.router.navigate(['re-login']);
    }
    this.createForm();
    this.getUserInfo();
    this.updateUserInfo();
  }

  getUserInfo() {
    this.commonService.getUserInfo().subscribe(e => {
      if (e.userInfo) {
        this.userInfo = e.userInfo;
        this.profileSrc = this.userInfo.logoFilePath ? this.httpService.url + 'api/file/' + this.userInfo.logoFilePath + '/download' : '../../assets/images/userDefaultAvatar.png';
      } else {
        this.httpService.getUserInfo(this.userId)
          .then(res => {
            this.userInfo = res;
            if (this.userInfo.logoFilePath) {
              this.profileSrc = this.httpService.url + 'api/file/' + this.userInfo.logoFilePath + '/download';
            } else {
              this.profileSrc = '../../assets/images/userDefaultAvatar.png';
            }
          });
      }
    });
  }

  // 被修改信息时更新视图
  updateUserInfo() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.httpService.getUserInfo(this.userId)
          .then(res => {
            this.commonService.updateUserInfo(res);
          });
      }
    });
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.commonService.updateUserInfo(res);
      });
  }

  // 编辑个性签名
  editDes() {
    this.isEditable = true;
    this.userDesForm.patchValue({selfIntroduction: this.userInfo['selfIntroduction']});
  }

  // 发布签名
  updateUserDes() {
    if (this.userDesForm.invalid) { return; }
    const data = {id: this.userId, selfIntroduction: this.userDesForm.value['selfIntroduction']};
    this.httpService.updateUser(data)
      .then(res => {
        this.isEditable = false;
        this.updateUserInfo();
      });
  }

  // 上传文件
  // 定义事件，选择文件
  selectedFileOnChanged(event: any) {
    // console.log('上传', event.target.value);
    this.uploadFile();
  }

  // 定义事件，上传文件
  uploadFile() {
    this.uploader.queue[0].onSuccess = (response, status, headers) => {
      if (status === 200) {
        const res = JSON.parse(response);
        this.profileSrc = this.httpService.url + 'api/file/' + res['logoFilePath'] + '/download';
        this.snackBar.open('头像更改成功', '', {
          duration: 1000,
          extraClasses: ['ysl-snack-bar']
        });
      }
    };
    this.uploader.queue[0].upload();
  }

  createForm() {
    this.userDesForm = this.fb.group({
      selfIntroduction: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])]
    });
  }
}
