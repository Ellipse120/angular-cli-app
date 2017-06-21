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
  userId;

  constructor(private productListService: ProductListService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private cookie: CookieService,
              private service: YslHttpService) {

    this.userId = this.cookie.getObject('yslUserInfo');

    this.getProductList();
    // this.service.fetch(data => {
    //   this.rows = data;
    //   console.log(this.rows);
    // });
  }

  getProductList() {
    if (!isNullOrUndefined(this.userId)) {
      this.productListService.getProductList().then((data) => {
        this.isFinished = false;
        this.dataItems = data.items;
        this.rows = this.dataItems;

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

    let productTitle = '产品编辑';

    let dialogRef = this.dialog.open(ProductImportComponent, {data: {info, productTitle}, disableClose: true});
    dialogRef.componentInstance.productTitle = productTitle;
    dialogRef.componentInstance.isProImport = false;
    dialogRef.componentInstance.data = info;
    console.log(" dialogRef.componentInstance.data", dialogRef.componentInstance.data)
    dialogRef.afterClosed().subscribe(res => {
      this.getProductList();
    });

  }

  updateProduct() {
    this.productListService.doProductUpdate(this.proInfo)
      .then(res => {
        this.closeProInfo();
        this.showEdit = false;
        this.getProductList();
      });
  }

  // 关闭信息弹框
  closeProInfo() {
    this.showProInfo = false;
  }

  // 选择每一行触发事件
  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  importProduct(): void {
    if (!isNullOrUndefined(this.userId)) {
      let dialogRef = this.dialog.open(ProductImportComponent, {disableClose: true});
      dialogRef.afterClosed().subscribe(result => {
        this.getProductList();
      });
    } else {
      this.showLoginComp();
    }

    // let dialogRef = this.dialog.open(ProductImportComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   this.productListService.getProductList();
    // });

  }


  showLoginComp() {
    let dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
      this.getProductList();
    });
  }

  ngOnInit() {
  }
}
