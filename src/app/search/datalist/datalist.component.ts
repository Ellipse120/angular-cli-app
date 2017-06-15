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
  searchOptions = {
    limit: 10,
    offset: 0
  };
  product = {
    items: [],
    request: {},
    totalLength: 0
  };
  searchConditionIndex: number;
  currSortTag: string;
  tagSortList = [];
  isShowPeriod = true;
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
        // let param = Object.assign({}, params);
        let param = JSON.parse(params['search'])
        for (let k in param) {
          if (param[k] && (param[k] != 'null') && (param[k] != '')) {
            this.searchOptions[k] = param[k];
            if (param[k] instanceof Object) {
              this.searchOptions[k] = param[k].epoc;
            }
          }
        }
        console.log('options test', this.searchOptions, param);
        // this.searchOptions = Object.assign({}, params);
        this.eventEmit.keyword = this.searchOptions['keyword'];
        this.currPage = param['offset'] ? ((param['offset']/param['limit']) + 1) : 1;
        this.getProjectList();
      })
    this.limit = this.searchOptions['limit'];
    this.keywordSearch();
    this.createForm();
  }

  // 获取产品列表
  getProjectList() {
    if (!this.searchOptions['keyword']) { this.searchOptions['keyword'] = undefined}
    this.service.productKeywordSearch(this.searchOptions)
      .then(res => {
        this.product = res;
        this.product['items'].forEach(item => {
          item.tagOpen = false;
        })
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
    this.searchOptions['tagId'] = item.id;
    this.getProjectList();
  }

  // 关键字搜索
  keywordSearch() {
    this.eventEmit.keywordSearch.subscribe(e => {
      this.eventEmit.keyword = e.keyword;
      this.searchOptions['keyword'] = e.keyword;
      this.getProjectList()
    })
  }

  // 时间条件搜索
  conditionSearch(i, item) {
    this.searchConditionIndex = i;
    this.searchOptions['dataSince'] = item.value ? (new Date(item.value)).getTime() : undefined;
    this.getProjectList();
  }

  // 时间段搜索
  productSearchByYear() {
    const thisYear = (new Date()).getFullYear();
    let form = this.yearSearchForm;
    let values = form.value;
    if (form.invalid) { return }
    for (let key in values) {
      if (values[key] && (parseInt(values[key]) <= thisYear) && (parseInt(values[key]) >= 1970)) {
        this.searchOptions[key] = new Date(form.value[key] + '/01/01').getTime();
      } else {
        this.searchOptions[key] = undefined;
      }
    }
    let [since, until] = [this.searchOptions['dataSince'], this.searchOptions['dataUntil']];
    if (since || until) {
      // let item = {text: '', value: '', type: 'readonly'};
      // let [sinceText, untilText] = [((new Date(since)).getFullYear()).toString(), ((new Date(until)).getFullYear()).toString()];
      // if (since && until){
      //   item.text = sinceText + '-' + untilText;
      // } else if (until) {
      //   item.text = untilText + '年以前';
      // } else {
      //   item.text = sinceText + '年以来';
      // }
      this.service.productKeywordSearch(this.searchOptions)
        .then(res => {
          // searchCondition children
          let len = this.searchCondition[0]['children'].length;
        })
    }
  }

  cancelFilter() {
    this.searchOptions['tagId'] = undefined;
    this.currSortTag = '';
    this.getProjectList();
  }

  // 排序
  productSort(item) {
    this.currSortItem = item;
    this.searchOptions['sortBy'] = item.value;
    this.getProjectList();
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    this.searchOptions['offset'] = (e - 1) * (this.searchOptions['limit']);
    let navigationExtras: NavigationExtras = {
      queryParams: {search: JSON.stringify(this.searchOptions)}
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
