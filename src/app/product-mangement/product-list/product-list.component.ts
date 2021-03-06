import {Component, OnInit} from '@angular/core';

import {YslCommonService} from '../../core/ysl-common.service';
import {ProductListService} from './product-list.service';
import {MdDialog} from '@angular/material';
import {ProductImportComponent} from '../product-import/product-import.component';
import {LoginComponent} from '../../login/login.component';
import {CookieService} from 'ngx-cookie';
import {isNullOrUndefined} from 'util';
import {YslHttpService} from '../../core/ysl-http.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
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
  pagingOption: any = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true,
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
    {value: 1, viewValue: '注册'},
    {value: 2, viewValue: '激活'},
    {value: 3, viewValue: '禁用'}
  ];

  modifiedDates = [
    {value: 1, viewValue: '一周内'},
    {value: 2, viewValue: '一个月内'},
    {value: 3, viewValue: '三个月内'}
  ];

  constructor(private productListService: ProductListService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private cookie: CookieService,
              private service: YslHttpService) {

    this.userInfo = this.cookie.getObject('yslUserInfo');

    this.getProducts();

  }

  getProducts() {
    if (!isNullOrUndefined(this.userInfo)) {
      this.pagingOption.userId = this.userInfo.id;
      this.productListService.getProductList(this.pagingOption).then((data) => {
        this.isFinished = false;
        this.dataItems = data.items;
        this.rows = this.dataItems;

        this.temp = [...data.items];

        this.count = data.totalLength;

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

          switch ('' + item.status) {
            case '2':
              item.status = '激活';
              break;
            case '1':
              item.status = '注册';
              break;
            case '3':
              item.status = '禁用';
              break;
          }

          item.premium = item.premium ? '是' : '否';
          item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn);
          this.isOn.push(true);
        });

      });
    } else {
      this.showLoginComp();
    }

  }

  // 启用或禁用
  openOrClose(row) {
    this.isOn[row.$$index] = !this.isOn[row.$$index];

    this.productListService.doChangeStatus(row.productId, this.isOn[row.$$index] ? '2' : '3')
      .then(res => {
        // console.log(res);
      });

  }

  // 录入产品
  proImport() {
    this.import = true;
  }

  // 查看产品信息
  viewInfo(info) {
    this.proInfo = info;
    this.showProInfo = true;
  }

  // 编辑信息
  editInfo() {
    this.showEdit = false;
  }

  // 编辑产品
  editProduct(info) {
    if (info.premium === '是') {
      info.premium = 'true';
    } else {
      info.premium = 'false';
    }

    switch (info.userType) {
      case '未认证的个人用户': {
        info.userType = 1;
        break;
      }
      case '未认证的机构用户': {
        info.userType = 2;
        break;
      }
      case '认证的个人用户': {
        info.userType = 10;
        break;
      }
      case '认证的机构用户': {
        info.userType = 20;
        break;
      }
      case '运营方用户': {
        info.userType = 30;
        break;
      }
    }

    switch (info.status) {
      case '注册': {
        info.status = 1;
        break;
      }
      case '激活': {
        info.status = 2;
        break;
      }
      case '禁用': {
        info.status = 3;
        break;
      }
    }

    const productTitle = '产品修改';

    const dialogRef = this.dialog.open(ProductImportComponent, {data: {info, productTitle}, disableClose: true});
    dialogRef.componentInstance.productTitle = productTitle;
    dialogRef.componentInstance.isProImport = false;
    dialogRef.componentInstance.data = info;

    dialogRef.afterClosed().subscribe(res => {
      this.getProducts();
    });

  }

  // updateProduct() {
  //   this.productListService.doProductUpdate(this.proInfo)
  //     .then(res => {
  //       this.closeProInfo();
  //       this.showEdit = false;
  //       this.getProductList();
  //     });
  // }

  // 关闭信息弹框
  // closeProInfo() {
  //   this.showProInfo = false;
  // }

  // 选择每一行触发事件
  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  importProduct(): void {
    if (!isNullOrUndefined(this.userInfo)) {
      const dialogRef = this.dialog.open(ProductImportComponent, {disableClose: true});
      dialogRef.afterClosed().subscribe(result => {
        this.getProducts();
      });
    } else {
      this.showLoginComp();
    }
  }

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

  setProductsPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.pagingOption.offset = (pageInfo.offset) * 10;
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
  }

  getCellNameClass({row, column, value}) {
    return {
      'is-name-left': true
    };
  }

  ngOnInit() {
  }
}
