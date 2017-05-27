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
  num: number;
  numc: number = 0;
  count: number = 384354;
  limit;
  keywordOptions = {};
  product = {};
  typeList = [
    {
      text: '时间分类', children: [
      {text: '时间不限'},
      {text: '2016-2017年'},
      {text: '2015-2016年'},
      {text: '2014-2015年'}
    ]
    },
    {
      text: '按照关系排序', children: [
      {text: '从大到小'},
      {text: '从小到大'},
      {text: '按价格'},
      {text: '按名称'}
    ]
    },
    {text: '按照特点排序'}
  ];

  constructor(public service: MyServiceService, public route: ActivatedRoute, public router: Router) {
    this.route.queryParams
      .subscribe((params) => {
        this.keywordOptions = Object.assign({},params);
        this.getProjectList();
      })
    this.limit = parseInt(this.keywordOptions['limit'])
  }

  // 二级菜单
  showMenu(i) {
    this.num = i;
  }

  showSecondMenu(i) {
    this.numc = i;
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
    this.keywordOptions['keyword'] = option.keyword;
    this.getProjectList()
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
