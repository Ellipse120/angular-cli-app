import { Component,OnInit} from '@angular/core';
import {Page} from "ng2-pagination/dist/pagination-controls.directive";

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit{


  import = false;
  //proList = [
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
  //  {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'}
  //];

  //定义table
  rows = [
    //{name: '全选',proName:'万里挑一',time: '1223'}
  ];
  selected = [];

  columns = [
    //{name: 'name'},
    //{name: 'proName'},
    //{name: 'time'}
  ];

  constructor() {
    this.fetch((data) => {
      this.rows = data;
      console.log(this.rows)
    })
  }
  //获取数据
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/productlist.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    }

    req.send();
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
  //录入产品
  proImport() {
    this.import = true;
  }
  ngOnInit() {}
}
