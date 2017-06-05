import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';

import 'rxjs/add/operator/switchMap'

import {MyServiceService} from '../../core/app.service';
import {SearchService} from "../search.service";

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {

  state = false;
  limit;
  searchOptions;
  product = {
    items: [],
    totalLength: 0
  };
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
  currPage: any;

  constructor(private service: MyServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private eventEmit: SearchService) {}
  ngOnInit() {
    this.route.queryParams
      .subscribe((params) => {
        this.searchOptions = Object.assign({}, params);
        this.eventEmit.keyword = params.keyword;
        this.currPage = params.offset ? (params.offset/params.limit) : 1;
        this.getProjectList();
      })
    this.limit = parseInt(this.searchOptions['limit']);
    this.keywordSearch()
  }

  // 获取产品列表
  getProjectList() {
    this.service.productKeywordSearch(this.searchOptions)
      .then(res => {
        this.product = res;
      });
  }

  // 关键字搜索
  keywordSearch() {
    this.eventEmit.keywordSearch.subscribe(e => {
      this.eventEmit.keyword = e.keyword;
      this.searchOptions.keyword = e.keyword;
      this.getProjectList()
    })
  }

  // 条件搜索
  conditionSearch(i, ind) {
    this.searchConditionIndex = i;
    this.searchConditionParentIndex = ind;
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    this.searchOptions['offset'] = parseInt(e) * (parseInt(this.searchOptions['limit']));
    let navigationExtras: NavigationExtras = {
      queryParams: this.searchOptions
    }
    this.router.navigate(['datalist'], navigationExtras)
  }

}
