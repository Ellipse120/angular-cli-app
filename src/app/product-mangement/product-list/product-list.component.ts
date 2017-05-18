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
  selected = [];
  proInfo = [];
  import = false;
  showEdit = true;
  showProInfo = false;

  constructor(public service: MyServiceService) {
    // 获取产品列表数据
    this.service.fetch((data) => {
      this.rows = data;
      console.log(this.rows)
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

  // 关闭信息弹框
  closeProInfo() {
    this.showProInfo = false;
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

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

  ngOnInit() {}
}
