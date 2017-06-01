import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap'


import {MyServiceService} from '../../core/app.service';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {

  state = false;
  limit;
  keywordOptions = {};
  product = {};
  isShowSearch = true;
  searchConditionParentIndex: number;
  searchConditionIndex: number;
  searchCondition = [{
      type: 'a', children: [
      {text: '时间不限', value: '', type: 'readonly'},
      {text: '2017年以来', value: '2017', type: 'readonly'},
      {text: '2016年以来', value: '2016', type: 'readonly'},
      {text: '2013年以来', value: '2013', type: 'readonly'},
      {text: '', value: '', type: 'input'}
    ]}, {
      type: 'b', children: [
      {text: '按相关性排序', value: '', type: 'readonly'},
      {text: '按日期排序', value: '', type: 'readonly'}
    ]}, {
      type: 'c', children: [
      {text: '包括专利', value: '', type: 'checkbox'},
      {text: '包括引用', value: '', type: 'checkbox'}
    ]}
  ];

  constructor(public service: MyServiceService, public route: ActivatedRoute, public router: Router) {
    this.route.queryParams
      .subscribe((params) => {
        this.keywordOptions = Object.assign({},params);
        this.getProjectList();
      })
    this.limit = parseInt(this.keywordOptions['limit'])
  }


  // 获取数据
  // getData(): void {
  //   this.service
  //     .getList()
  //     // .then((function(data){this.dataList=data}))
  //     .then(dataList => {
  //       this.productList = dataList;
  //       console.log(this.productList);
  //     })
  //
  // }

  ngOnInit() {

  }

  // 获取产品列表
  getProjectList() {
    this.service.productKeywordSearch(this.keywordOptions)
      .then(res => {
        this.product = res;
      })
  }

  // 关键词搜索
  keywordSearch(option) {
    console.log('sousuo', option)
    this.keywordOptions['keyword'] = option.keyword;
    this.getProjectList()
  }

  // 条件搜索
  conditionSearch(i, ind) {
    this.searchConditionIndex = i;
    this.searchConditionParentIndex = ind;
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}])
  }


  // 下一页
  toNextPage(e) {
    this.keywordOptions['offset'] = parseInt(e) * (parseInt(this.keywordOptions['limit']));
    this.getProjectList()
  }

}
