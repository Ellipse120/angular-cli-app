import {Component, OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class UserManagementComponent implements OnInit {

  searchFilterForm: FormGroup;
  rows = [];
  selected = [];
  userInfo = [];
  newUser = false;
  showUserInfo = false;
  showEdit = true;
  isShowLoading: any;
  userTag = [
    {text: '用户管理', path: 'userManage'}
  ];
  userTypes = [
    {value: 1, viewValue: '未认证的个人用户'},
    {value: 2, viewValue: '未认证的机构用户'},
    {value: 10, viewValue: '认证的个人用户'},
    {value: 20, viewValue: '认证的机构用户'},
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
    sortBy: 'modifiedOn',
    ascending: false,
    userName: '',
    userType: '',
    status: ''
  };
  dataItems = [];
  currentPage: any;
  totalLength: any;

  constructor(private service: YslHttpService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.createForm();
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.getUsers();
      });
  }

  getUsers() {
    this.isShowLoading = true;
    this.service.getUserList()
      .then(data => {
        this.isShowLoading = false;
        this.rows = data.items;
        this.dataItems = data.items;
        this.dataItems.forEach(item => {
          switch ('' + item.userType) {
            case  '1': {
              item.userType = '未认证的个人用户';
              break;
            }
            case  '2': {
              item.userType = '未认证的机构用户';
              break;
            }
            case  '10': {
              item.userType = '认证的个人用户';
              break;
            }
            case  '20': {
              item.userType = '认证的机构用户';
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
      });
  }


  // 查看用户信息
  showInfo(row) {
    JSON.stringify(row);
    this.showUserInfo = true;
    this.userInfo = row;
  }

  //  增加用户
  addUser() {
    this.newUser = true;
  }

  // 修改用户信息
  editInfo() {
    this.showEdit = false;
  }
  closeUser() {
    this.newUser = false;
    this.showUserInfo = false;
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

  // 筛选
  filter(type) {
    const form = this.searchFilterForm['value'];
    const userNameControl = this.searchFilterForm.controls['userName'];
    if (type === 1 && userNameControl.dirty) {
      const name = form['userName'];
      this.pagingOption['userName'] = form['userName'];
      this.getUsers();
      this.searchFilterForm.reset();
      this.searchFilterForm.patchValue({userName: name});
    } else if (type === 2) {
      this.pagingOption['userType'] = form['userType'];
      this.pagingOption['status'] = form['status'];
      this.getUsers();
    }
  }

  // 分页
  toNextPage(e) {
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['operation/productManagement/list'], navigationExtras);
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
