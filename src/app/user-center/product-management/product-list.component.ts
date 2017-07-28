import {Component, OnInit} from '@angular/core';
import {YslCommonService} from '../../core/ysl-common.service';
import {MdDialog} from '@angular/material';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../../core/ysl-http.service';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {isNullOrUndefined} from 'util';

import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductListComponent implements OnInit {

  // 定义table
  rows = [];
  rowIndex;
  selected = [];
  proInfo = [];
  isOn = [];
  temp = [];
  rowState = true;
  import = false;
  showEdit = true;
  showProInfo = false;
  dataItems = [];
  messages: any = {
    emptyMessage: ' 无数据 ',
    totalMessage: ' 总数',
    selectedMessage: ' 条选中'
  };
  isFinished = true;
  userInfo: any;
  userGenre: any;
  pagingOption: any = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: 'modifiedOn',
    ascending: false,
    userName: '',
    userType: '',
    status: '',
    startModifiedOn: ''
  };
  pageNumber = 0;

  count = 0;
  userTypes = [
    {value: 1, viewValue: '未认证的个人用户'},
    {value: 2, viewValue: '未认证的机构用户'},
    {value: 10, viewValue: '认证的个人用户'},
    {value: 20, viewValue: '认证的机构用户'},
    {value: 30, viewValue: '运营方用户'}
  ];

  status = [
    {value: 1, viewValue: '待发布'},
    {value: 2, viewValue: '已发布'},
    {value: 3, viewValue: '禁用'}
  ];

  modifiedDates = [
    {value: 1, viewValue: '一周内'},
    {value: 2, viewValue: '一个月内'},
    {value: 3, viewValue: '三个月内'}
  ];

  // paging args
  page = 1;
  isLoading: boolean;

  constructor(private productListService: ProductListService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private cookie: CookieService,
              private service: YslHttpService,
              private router: Router,
              private route: ActivatedRoute) {

    this.userInfo = this.cookie.getObject('yslUserInfo');
    this.userGenre = this.cookie.getObject('userType');
    this.getProducts();

  }

  getProducts() {
    if (!isNullOrUndefined(this.userInfo)) {
      this.pagingOption.userId = this.userInfo.id;
      this.productListService.getProductList(this.pagingOption).then((data) => {
        this.isFinished = false;
        this.isLoading = false;
        this.dataItems = data.items;
        data.items.forEach(item => {
          switch (item.status) {
            case 1: {
              item.statusText = '待发布';
              break;
            }
            case 2: {
              item.statusText = '已发布';
              break;
            }
            case 3: {
              item.statusText = '禁用';
              break;
            }
          }
        });

        this.rows = this.dataItems;

        this.temp = [...data.items];

        this.count = data.totalLength;

      }, error => {
        this.commonService.loginTimeout(error);
      });
    }
  }

  // 启用或禁用
  // openOrClose(i) {
  //   this.isOn[i] = !this.isOn[i];
  // }


  // 选择每一行触发事件
  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  importProductNew(e): void {
    this.router.navigate(['../import'], {relativeTo: this.route});
  }

  editProduct2(row): void {
    this.router.navigate(['../edit', row.productId], {relativeTo: this.route});
  }

  setProductsPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.pagingOption.offset = (pageInfo.offset) * 10;
    this.pagingOption.userId = this.userInfo.id;
    this.getProducts();
  }

  getPage(e) {
    this.isLoading = true;
    this.page = e;
    this.pagingOption.offset = (e - 1) * 10;
    this.pagingOption.userId = this.userInfo.id;
    this.getProducts();
  }

  doProductsSort(event) {
    this.pagingOption.sortBy = event.column.prop;
    this.pagingOption.ascending = (event.newValue === 'asc');
    this.getProducts();
  }

  doFilter() {
    switch (this.pagingOption.startModifiedOn) {
      case 1: {
        this.pagingOption.startModifiedOn = Date.now() - 7 * 24 * 60 * 60 * 1000;
        break;
      }
      case 2: {
        this.pagingOption.startModifiedOn = new Date().setMonth((new Date().getMonth() - 1 ));
        break;
      }
      case 3: {
        this.pagingOption.startModifiedOn = new Date().setMonth((new Date().getMonth() - 3 ));
        break;
      }
    }

    this.getProducts();
    this.pagingOption.userName = '';
    this.pagingOption.userType = '';
    this.pagingOption.status = '';
    this.pagingOption.startModifiedOn = '';
  }

  getCellNameClass({row, column, value}) {
    return {
      'is-name-left': true
    };
  }

  doViewProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

  ngOnInit(): void {
  }

}
