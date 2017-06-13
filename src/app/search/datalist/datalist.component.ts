import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

  yearSearchForm: FormGroup;
  state = false;
  limit;
  searchOptions;
  product = {
    items: [],
    request: {},
    totalLength: 0
  };
  searchConditionIndex: number;
  currSortTag: string;
  tagSortList = [];
  searchCondition = [{
      type: 'a', children: [
      {text: '时间不限', value: undefined, type: 'readonly'},
      {text: '2017年以来', value: '2017/01/01', type: 'readonly'},
      {text: '2016年以来', value: '2016/01/01', type: 'readonly'},
      {text: '2013年以来', value: '2013/01/01', type: 'readonly'},
      {text: '', value: '', type: 'input'}
    ]}
  ];
  sortList = [{text: '按日期排序', value: 'modified_on'}, {text: '按相关性排序', value: 'viewed_count'}];
  currSortItem = this.sortList[0];
  currPage: any;

  constructor(private service: YslHttpService,
              private route: ActivatedRoute,
              private router: Router,
              public eventEmit: SearchService,
              private fb: FormBuilder) {}

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
    this.createForm();
  }

  // 获取产品列表
  getProjectList() {
    if (!this.searchOptions.keyword) { this.searchOptions.keyword = undefined}
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
  sortByTag(item) {
    this.currSortTag = item.name;
    this.searchOptions.tagId = item.id;
    this.getProjectList();
  }

  // 关键字搜索
  keywordSearch() {
    this.eventEmit.keywordSearch.subscribe(e => {
      this.eventEmit.keyword = e.keyword;
      this.searchOptions.keyword = e.keyword;
      this.getProjectList()
    })
  }

  // 时间条件搜索
  conditionSearch(i, item) {
    this.searchConditionIndex = i;
    this.searchOptions.dataSince = item.value ? (new Date(item.value)).getTime() : undefined;
    this.getProjectList();
  }

  productSearchByYear() {
    console.log('form', this.yearSearchForm)
    if (!this.yearSearchForm && this.yearSearchForm.invalid) { return }
    let data = {dataSince: '', dataUntil: ''};
    let form = this.yearSearchForm;
    const thisYear = (new Date()).getFullYear();
    for (let key in data) {
      if (form[key] || (form.value[key] <= thisYear)) {
        data[key] = form.value[key] + '/01/01';
        console.log('year', data)
      }
    }
  }

  cancelFilter() {
    this.searchOptions.tagId = undefined;
    this.currSortTag = '';
    this.getProjectList();
  }

  // 排序
  productSort(item) {
    this.currSortItem = item;
    this.searchOptions.sortBy = item.value;
    this.getProjectList();
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    this.searchOptions['offset'] = (parseInt(e) - 1) * (parseInt(this.searchOptions['limit']));
    let navigationExtras: NavigationExtras = {
      queryParams: this.searchOptions
    }
    this.router.navigate(['datalist'], navigationExtras)
  }

  createForm() {
    let exp = /[0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3}/;
    this.yearSearchForm = this.fb.group({
      dataSince: ['', Validators.compose([
        Validators.minLength(4),
        Validators.pattern(exp)
      ])],
      dataUntil: ['', Validators.compose([
        Validators.minLength(4),
        Validators.pattern(exp)
      ])]
    })
  }

}
