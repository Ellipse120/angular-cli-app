import {Component, OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {OperationService} from '../service/operation-service';
import {YslCommonService} from "../../core/ysl-common.service";
import {MdSnackBar} from "@angular/material";

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class UserListComponent implements OnInit {

  searchFilterForm: FormGroup;
  rows = [];
  selected = [];
  userInfo = [];
  isShowLoading: any;
  errorMessage: string;
  userTag = [
    {text: '用户管理', path: 'userManage'}
  ];
  userTypes = [
    {value: 1, viewValue: '未认证用户'},
    {value: 10, viewValue: '认证用户'},
    {value: 30, viewValue: '运营方用户'}
  ];
  status = [
    {value: 1, viewValue: '注册'},
    {value: 2, viewValue: '激活'},
    {value: 3, viewValue: '禁用'}
  ];
  pagingOption: any = {
    limit: 10,
    offset: 0,
    userName: '',
    userType: '',
    status: ''
  };
  dataItems = [];
  currentPage: any;
  totalLength: any;

  constructor(private service: YslHttpService,
              private commonService: YslCommonService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private operationService: OperationService,
              public snackbar: MdSnackBar) {}

  ngOnInit() {
    this.createForm();
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.pagingOption['offset'] = param['offset'];
        this.getUsers();
      });
}

  getUsers() {
    this.isShowLoading = true;
    this.service.getUserList(this.pagingOption)
      .then(data => {
        this.isShowLoading = false;
        this.errorMessage = data['items'].length ? undefined : '用户列表为空';
        this.rows = data.items;
        this.dataItems = data.items;
        this.totalLength = data['totalLength'];
        this.dataItems.forEach(item => {
          if (!item.userName) { item.userName = '匿名'; }
          switch ('' + item.userType) {
            case  '1': {
              item.userType = '未认证用户';
              break;
            }
            case  '2': {
              item.userType = '未认证用户';
              break;
            }
            case  '10': {
              item.userType = '认证用户';
              break;
            }
            case  '20': {
              item.userType = '认证用户';
              break;
            }
            case  '30': {
              item.userType = '运营方用户';
              break;
            }
            default: {
              break;
            }
          }
        });
      }, err => {
        this.errorMessage = err.message ? err.message : '请求出错了';
        this.commonService.requestErrorHandle(err);
      });
  }


  // 查看用户信息
  showInfo(row) {
    JSON.stringify(row);
    this.userInfo = row;
  }

  //  增加用户
  addUser() {
  }

  onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [ this.rows[1], this.rows[3] ];
  }

  remove() {
    this.selected = [];
  }

  enterKey(e, type) {
    if (e.keyCode === 13) {
      if (type === 1) {
        this.filter(1, 'loginId');
      } else {
        this.filter(1, 'userName');
      }
    }
  }

  // 筛选
  filter(type, name) {
    const form = this.searchFilterForm['value'];
    const control = this.searchFilterForm.controls[name];
    if (type === 1 && control.dirty) {
      this.pagingOption[name] = form[name];
      this.getUsers();
      this.searchFilterForm.reset(form);
    } else if (type === 2) {
      this.pagingOption[name] = form[name];
      this.getUsers();
    }
  }

  // 启用或禁用
  openOrClose(user, ind) {
    let status;
    status = (user['userStatus'] === 1 || user['userStatus'] === 3) ? 2 : 3;
    this.operationService.changeUserStatus(user.userId, status)
      .subscribe(res => {
        const userStatus = this.dataItems[ind]['userStatus'];
        if (userStatus === 1 || userStatus === 3) {
          this.dataItems[ind]['userStatus'] = 2;
          this.snackbar.open('激活成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
        } else {
          this.dataItems[ind]['userStatus'] = 3;
          this.snackbar.open('禁用成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 用户信息
  toUserDetail(user) {
    this.router.navigate(['../user-info', {userId: user.userId}], {relativeTo: this.route});
  }

  // 分页
  toNextPage(e) {
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['operation/userManage'], navigationExtras);
  }

  createForm() {
    this.searchFilterForm = this.fb.group({
      userName: '',
      userType: '',
      status: '',
      loginId: ''
    });
  }



}
