import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';
import {YslCommonService} from '../core/ysl-common.service';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {MdSnackBar} from '@angular/material';

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
    this.createForm();
    if (this.userId) {
      this.httpService.getUserInfo(this.userId)
        .then(res => {
          this.infoProcessing(res);
        }, error => {
          this.commonService.requestErrorHandle(error);
          this.profileSrc = '../../assets/images/userDefaultAvatar.png';
        });
    } else {
      this.profileSrc = '../../assets/images/userDefaultAvatar.png';
    }
    this.getUserInfo();
  }

  getUserInfo() {
    this.commonService.getUserInfo().subscribe(e => {
      if (e.userInfo) {
        this.infoProcessing(e.userInfo);
      }
    }, error => {
      this.commonService.requestErrorHandle(error);
    });
  }

  infoProcessing(data) {
    this.userInfo = data;
    if (!this.userInfo.selfIntroduction) {
      this.userInfo.selfIntroduction = '写句签名吧';
    }
    this.profileSrc = this.userInfo.logoFilePath ? this.httpService.url + 'api/file/' + this.userInfo.logoFilePath  + '/download' : '../../assets/images/userDefaultAvatar.png';
  }

  // 被修改信息时更新视图
  updateUserInfo() {
    this.httpService.getUserInfo(this.userId)
      .then(res => {
        this.commonService.updateUserInfo(res);
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 编辑个性签名
  editDes() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.userDesForm.patchValue({selfIntroduction: this.userInfo['selfIntroduction']});
    }
  }

  // 发布签名
  updateUserDes() {
    if (this.userDesForm.invalid) { return; }
    const data = {id: this.userId, selfIntroduction: this.userDesForm.value['selfIntroduction']};
    this.httpService.updateUser(data)
      .then(res => {
        this.isEditable = false;
        this.updateUserInfo();
      }, error => {
        this.commonService.requestErrorHandle(error);
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
    const len = this.uploader.queue.length;
    const file = this.uploader.queue[len - 1].file;
    if (file.size < 1024) {
      this.snackBar.open('图片大小不能小于1k', '', {
        duration: 1000,
        extraClasses: ['ysl-snack-bar']
      });
      return;
    } else if (file.size > (1024 * 1024 * 5)) {
      this.snackBar.open('图片大小不能大于5M', '', {
        duration: 1000,
        extraClasses: ['ysl-snack-bar']
      });
      return;
    }
    this.uploader.queue[len - 1].onSuccess = (response, status, headers) => {
      if (status === 200) {
        const res = JSON.parse(response);
        this.profileSrc = this.httpService.url + 'api/file/' + res['logoFilePath'] + '/download';
        this.snackBar.open('头像更改成功', '', {
          duration: 1000,
          extraClasses: ['ysl-snack-bar']
        });
      }
    };
    this.uploader.queue[len - 1].onError = (error, status) => {
      this.snackBar.open(error, '', {
        duration: 1000,
        extraClasses: ['ysl-snack-bar']
      });
    };
    this.uploader.queue[len - 1].upload();
  }

  createForm() {
    this.userDesForm = this.fb.group({
      selfIntroduction: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(45)
      ])]
    });
  }
}
