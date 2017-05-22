import { Component,OnInit} from '@angular/core';


import {MyServiceService} from '../../core/app.service';
import {ProductImportComponent} from '../product-import/product-import.component';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit{


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

  constructor(public service: MyServiceService) {
    // 获取产品列表数据
    this.service.fetch((data) => {
      this.rows = data;
      for(let i=0;i<data.length;i++){
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
  onSelect({ selected }) {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  ngOnInit() {}
}
