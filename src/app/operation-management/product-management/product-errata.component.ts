import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie';
import {isNullOrUndefined} from 'util';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {YslCommonService} from '../../core/ysl-common.service';
import {LoginComponent} from '../../login/login.component';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ProductErrorService} from "../../product-mangement/error-correct/product-error.service";
import {YslHttpService} from "../../core/ysl-http.service";

@Component({
  templateUrl: './product-errata.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class OperationProductErrataComponent implements OnInit {

  searchFilterForm: FormGroup;
  userId: any;
  userInfo: any;
  status = [
    {value: 1, viewValue: '注册'},
    {value: 2, viewValue: '激活'},
    {value: 3, viewValue: '禁用'}
  ];
  pagingOption: any = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: 'modifiedOn',
    ascending: false,
    userName: '',
    userType: '',
    status: '',
    keyword: ''
  };
  dataItems = [];
  currentPage: any;
  totalLength: any;
  constructor(private fb: FormBuilder,
              private cookie: CookieService,
              private productErrorService: ProductErrorService,
              private httpService: YslHttpService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.getUserInfo().then(() => {
      this.route.queryParams
        .subscribe((params) => {
          const param = Object.assign({}, params);
          this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
          this.listError();
        });
    });
  }

  getUserInfo() {
    if (!this.userId) { return; }
    return new Promise(resolve => {
      this.httpService.getUserInfo(this.userId)
        .then(res => {
          this.userInfo = res;
          resolve();
        });
    });
  }

  listError() {
    const params = {};
    if (this.userInfo['userType'] === 20) {
      params['userName'] = this.userInfo['name'];
    }
    this.productErrorService.list(params).subscribe(data => {
      console.log('errata data:', data);
      const total = data.totalLength;
      const items = data.items;
      items.forEach(item => {
        item.submitTime = this.commonService.getDateForDay(item.submitTime);
        if (item.status === 2) {
          item.statusText = '未修改';
        } else {
          item.statusText = '已修改';
        }
      });
    });
  }

  // 登录判断
  showLoginComp() {
    const dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
    });
  }

  // 筛选
  filter() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['userName'] = form['userName'];
    this.pagingOption['userType'] = form['userType'];
    this.pagingOption['status'] = form['status'];
  }

  // 关键字搜索
  keywordSearch() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['keyword'] = form['keyword'];
  }

  // 分页
  toNextPage(e) {
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['operation/productManagement/list'], navigationExtras);
  }

  // 添加产品
  addProduct() {
    this.router.navigate(['operation/productManagement/add']);
  }

  // 修改产品
  editProduct(product) {
    this.router.navigate(['../edit', {productId: product.productId}], {relativeTo: this.route});
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  createForm() {
    this.searchFilterForm = this.fb.group({
      userName: '',
      userType: '',
      status: '',
      keyword: ''
    });
  }

}

