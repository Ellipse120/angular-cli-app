import {Component, OnInit} from "@angular/core";
import {YslCommonService} from "../../core/ysl-common.service";
import {ProductListService} from "./product-list.service";

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

  constructor(private productListService: ProductListService,
              private commonService: YslCommonService) {

    this.productListService.getProductList().then((data) => {
      this.isFinished = false;
      this.dataItems = data.items;
      this.dataItems = data.items;
      this.rows = this.dataItems;
      for (let i = 0; i < data.totalLength; i++) {
        switch (this.dataItems[i].userType) {
          case  1:
            this.dataItems[i].userType = "未认证的个人用户";
            break;
          case  2:
            this.dataItems[i].userType = "未认证的机构用户";
            break;
          case  10:
            this.dataItems[i].userType = "认证的个人用户";
            break;
          case  20:
            this.dataItems[i].userType = "认证的机构用户";
            break;
          case  30:
            this.dataItems[i].userType = "运营方用户";
            break;
        }

        switch (this.dataItems[i].status) {
          case 2:
            this.dataItems[i].status = "激活";
            break;
          case 1:
            this.dataItems[i].status = "注册";
            break;
          case 3:
            this.dataItems[i].status = "禁用";
            break;
        }
        this.dataItems[i].premium = this.dataItems[i].premium ? "是" : "否";
        this.dataItems[i].modifiedOn = this.commonService.getDateForDay(this.dataItems[i].modifiedOn);
        this.isOn.push(true);
      }
    });

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

  ngOnInit() {
  }
}
