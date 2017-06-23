import {Component, OnInit} from "@angular/core";

import {YslCommonService} from "../../core/ysl-common.service";
import {ProductListService} from "./product-list.service";
import {MdDialog} from "@angular/material";
import {ProductImportComponent} from "../product-import/product-import.component";
import {LoginComponent} from "../../login/login.component";
import {CookieService} from "ngx-cookie";
import {isNullOrUndefined} from "util";
import {YslHttpService} from "../../core/ysl-http.service";

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
    emptyMessage: " 无数据 ",

    totalMessage: " 总数",

    selectedMessage: " 条选中"
  };
  isFinished = true;
  userInfo: any;
  pagingOption: any = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true
  };

  count = 0;
  xxx = false;
  userTypes = [
    {value: '1', viewValue: '未认证的个人用户'},
    {value: '2', viewValue: '未认证的机构用户'},
    {value: '10', viewValue: '认证的个人用户'},
    {value: '20', viewValue: '认证的机构用户'},
    {value: '30', viewValue: '运营方用户'},
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
              item.userType = "未认证的个人用户";
              break;
            }
            case  '2': {
              item.userType = "未认证的机构用户";
              break;
            }
            case  '10': {
              item.userType = "认证的个人用户";
              break;
            }
            case  '20': {
              item.userType = "认证的机构用户";
              break;
            }
            case  '30': {
              item.userType = "运营方用户";
              break;
            }
            default: {
              break;
            }
          }

          switch ('' + item.status) {
            case '2':
              item.status = "激活";
              break;
            case '1':
              item.status = "注册";
              break;
            case '3':
              item.status = "禁用";
              break;
          }

          item.premium = item.premium ? "是" : "否";
          item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn);
          this.isOn.push(true);
        });

      });
    } else {
      this.showLoginComp();
    }

  }

  // 启用或禁用
  openOrClose(i) {
    this.isOn[i] = !this.isOn[i];
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
      case "未认证的个人用户": {
        info.userType = 1;
        break;
      }
      case "未认证的机构用户": {
        info.userType = 2;
        break;
      }
      case "认证的个人用户": {
        info.userType = 10;
        break;
      }
      case "认证的机构用户": {
        info.userType = 20;
        break;
      }
      case "运营方用户": {
        info.userType = 30;
        break;
      }
    }

    switch (info.status) {
      case "注册": {
        info.status = 1;
        break;
      }
      case "激活": {
        info.status = 2;
        break;
      }
      case "禁用": {
        info.status = 3;
        break;
      }
    }

    let productTitle = '产品修改';

    let dialogRef = this.dialog.open(ProductImportComponent, {data: {info, productTitle}, disableClose: true});
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
      let dialogRef = this.dialog.open(ProductImportComponent, {disableClose: true});
      dialogRef.afterClosed().subscribe(result => {
        this.getProducts();
      });
    } else {
      this.showLoginComp();
    }
  }

  showLoginComp() {
    let dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
      this.getProducts();
    });
  }

  setProductsPage(pageInfo) {
    this.pagingOption.offset = pageInfo.offset;
    this.pagingOption.userId = this.userInfo.id;
    this.getProducts();
  }

  // TODO: 后台asscending加上后 测试结果
  doProductsSort(event) {
    this.pagingOption.sortBy = event.column.prop;
    this.pagingOption.ascending = (event.newValue === 'asc');
    this.getProducts();

    // const sort = event.sorts[0];
    // const tmp = this.temp.sort((a,b) => {
    //   return a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1);
    // })
    // this.isOn = tmp;
  }

  // TODO 目前是页面过滤 要改为 server端过滤结果
  nameFilter(event) {
    const val = event.target.value;

    const tmp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = tmp;

    this.pagingOption.offset = 0;
  }

  // TODO 目前是页面过滤 要改为 server端过滤结果
  userTypeValueChange(event) {
    const val = event.source.selected._element.nativeElement.innerText;

    const tmp = this.temp.filter(function (d) {
      return d.userType.toLowerCase().indexOf(val) !== -1;
    });

    this.rows = tmp;

    this.pagingOption.offset = 0;
  }

  ngOnInit() {
  }
}
