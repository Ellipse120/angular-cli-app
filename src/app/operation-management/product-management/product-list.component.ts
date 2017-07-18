import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie';
import {isNullOrUndefined} from 'util';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {YslCommonService} from '../../core/ysl-common.service';
import {LoginComponent} from '../../login/login.component';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class OperationProductListComponent implements OnInit {

  searchFilterForm: FormGroup;
  userInfo: any;
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
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true,
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
              private productListService: ProductListService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo') : null;
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.getProducts();
      });
  }

  getProducts() {
    if (!isNullOrUndefined(this.userInfo)) {
      this.pagingOption.userId = this.userInfo.id;
      this.productListService.getProductList(this.pagingOption).then((data) => {
        this.dataItems = data.items;
        this.totalLength = data.totalLength;
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

          item.premium = item.premium ? '是' : '否';
          item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn);
        });

      });
    } else {
      this.showLoginComp();
    }
  }

  // 登录判断
  showLoginComp() {
    const dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
      this.getProducts();
    });
  }

  // 启用或禁用
  openOrClose(product) {
    console.log('product', product)
    let status;
    if (product['status'] === 1 || product['status'] === 3) {
      status = 2;
    }
    if (product['status'] === 2) {
      status = 3;
    }
    this.productListService.doChangeStatus(product.productId, status)
      .then(res => {
      });
  }

  // 筛选
  filter() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['userName'] = form['userName'];
    this.pagingOption['userType'] = form['userType'];
    this.pagingOption['status'] = form['status'];
    this.getProducts();
  }

  // 关键字搜索
  keywordSearch() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['keyword'] = form['keyword'];
    this.getProducts();
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
      keyword: ''
    });
  }

}
