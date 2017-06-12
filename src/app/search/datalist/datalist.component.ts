import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';

import 'rxjs/add/operator/switchMap'

import {YslHttpService} from '../../core/ysl-http.service';
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
    request: {},
    totalLength: 0
  };
  searchConditionIndex: number;
  currSortTag: number;
  tagSortList = [];
  searchCondition = [{
      type: 'a', children: [
      {text: '时间不限', value: '', type: 'readonly'},
      {text: '2017年以来', value: '2017', type: 'readonly'},
      {text: '2016年以来', value: '2016', type: 'readonly'},
      {text: '2013年以来', value: '2013', type: 'readonly'},
      {text: '', value: '', type: 'input'}
    ]}
  ];
  sortList = [{text: '按日期排序', id: ''}, {text: '按相关性排序', id: ''}];
  currSortItem = this.sortList[0];
  currPage: any;

  constructor(private service: YslHttpService,
              private route: ActivatedRoute,
              private router: Router,
              public eventEmit: SearchService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe((params) => {
        this.searchOptions = Object.assign({}, params);
        this.eventEmit.keyword = params.keyword;
        this.currPage = params.offset ? ((params.offset/params.limit) + 1) : 1;
        this.getProjectList();
      })
    this.limit = parseInt(this.searchOptions['limit']);
    this.keywordSearch();
  }

  // 获取产品列表
  getProjectList() {
    this.service.productKeywordSearch(this.searchOptions)
      .then(res => {
        this.product = res;
        // this.product.items[0].tags = [{name: 'test', id: '1'}, {name: 'test2', id: '2'}, {name: 'test', id: '1'}];
        // this.product.items[1].tags = [{name: 'test', id: '1'}, {name: 'test4', id: '4'}, {name: 'test5', id: '5'}];
        this.tagUnique();
      });
  }

  // 标签搜索去重
  tagUnique() {
    let unique = {};
    this.product['items'].forEach(item => {
      item.tags.forEach(tag => {
        unique[JSON.stringify(tag)] = tag
      })
    });
    this.tagSortList = Object.keys(unique).map(function(u){return JSON.parse(u) });
  }

  // 标签搜索
  sortByTag(item, ind) {
    this.currSortTag = ind;
    this.searchOptions.tagId = item.id;
    this.getProjectList()
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
  conditionSearch(i) {
    this.searchConditionIndex = i;
  }

  // 排序
  productSort(ind) {
    this.currSortItem = this.sortList[ind]
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    console.log('currPage', e)
    this.searchOptions['offset'] = (parseInt(e) - 1) * (parseInt(this.searchOptions['limit']));
    let navigationExtras: NavigationExtras = {
      queryParams: this.searchOptions
    }
    this.router.navigate(['datalist'], navigationExtras)
  }

}
