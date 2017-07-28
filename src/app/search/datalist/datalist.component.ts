import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';

import 'rxjs/add/operator/switchMap'

import {YslHttpService} from '../../core/ysl-http.service';
import {SearchService} from "../search.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {

  @ViewChild('yslSideNav') sideNav;
  yearSearchForm: FormGroup;
  state = false;
  isShowLoading: boolean = false;
  isShowSide: boolean;
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
  advancedFilter = [
    {type: 'data_category', title: '数据类型', apiKey: 'dataCategory', child: []},
    {type: 'data_collection', title: '采集方式', apiKey: 'collectionMethod', child: []},
    {type: 'data_service', title: '服务类型', apiKey: 'serviceMethod', child: []},
    {type: 'data_source', title: '数据来源', apiKey: 'dataSource', child: []},
    {type: 'date_facets', title: '时间', apiKey: 'dataSince', child: []}
  ];
  selectAdvanced = [];
  advancedKey = [
    {label: 'data_category', text: '数据类型', data: []},
    {label: 'data_collection', text: '采集方式', data: []},
    {label: 'data_service', text: '服务方式', data: []},
    {label: 'data_source', text: '数据来源', data: []}
  ];
  tagsFilter = [{title: '', value: '', child: []}];
  selectedTagFilterO = {};
  selectedTagFilterA = [];
  sortList = [{text: '按日期排序', value: 'modifiedOn'}, {text: '按热度排序', value: 'viewedCount'}];
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
        let param = Object.assign({}, params);
        for (let k in param) {
          if (param[k] && (param[k] != 'null') && (param[k] != '')) {
            this.searchOptions[k] = param[k];
          }
        }
        this.eventEmit.keyword = this.searchOptions['keyword'];
        this.currPage = param['offset'] ? ((param['offset']/param['limit']) + 1) : 1;
        if (this.searchOptions['tagId']) {
          // this.tagParams();
          this.searchByTag({id: this.searchOptions['tagId'], name: params['tagName'], parent: params['tagParent']});
        } else {
          this.getProductList();
        }
      });
    this.limit = this.searchOptions['limit'];
    this.keywordSearch();
    this.createForm();
    this.handleAdvancedKey();
  }

  // 侧边栏
  openSideNav() {
    // this.sideNav.open();
    this.isShowSide = true;
  }

  // 获取产品列表
  getProductList() {
    this.isShowLoading = true;
    this.service.productKeywordSearch(this.searchOptions)
      .then(res => {
        this.product = res;
        this.isShowLoading = false;
        this.handleDataList();
      });
  }

  // 解析产品列表数据
  handleDataList() {
    this.selectAdvanced = [];
    let keyword = this.searchOptions['keyword'];
    let keywordHis = window.localStorage.getItem('keyword_group') ? JSON.parse(window.localStorage.getItem('keyword_group')) : [];
    if (keyword) {
      let idx = keywordHis.indexOf(keyword);
      if (idx > -1) {
        keywordHis.splice(idx,1);
      }
      keywordHis.push(keyword);
    }
    // 限制搜索历史为5条
    if (keywordHis.length > 5) {
      keywordHis = keywordHis.slice(1, 6);
    }

    window.localStorage.setItem('keyword_group', JSON.stringify(keywordHis));

    // 时间筛选
    if (this.product['dateFacets'].length) {
      let arr = [];
      this.advancedFilter.forEach(d => {
        this.product['dateFacets'].forEach((item, ind) => {
          if (d.apiKey == 'dataSince') {
            arr[ind] = {type: 'date_facets', title: (new Date(item)).getFullYear() + '年以来', value: item, parent: '时间', selected: false};
            d.child = arr;
          }
        });
      });
    }
    // 高级搜索字段筛选
    this.advancedFilter.forEach(item => {
      let filter = this.searchOptions[item.apiKey];
      if (!isNullOrUndefined(filter)) {
        item['child'].forEach(c => {
          if (c.value == filter) {
            c.selected = true;
            this.selectAdvanced.push(c);
          } else {
            c.selected = false;
          }
        })
      }
    });
    // 标签筛选
    this.tagsFilter = this.product['tagFacets'].length ? this.product['tagFacets'] : [];
    this.tagsFilter.forEach(p => {
      if (!p['items']) { return }
      p['items'].forEach(c => {
        c.parent = p['name'];
        this.selectedTagFilterA.forEach(selected => {
          if (selected.id == c.id) {
            c['selected'] = true;
          }
        })
      })
    });

  }

  // 高级搜索字段处理
  handleAdvancedKey() {
    this.eventEmit.getAdvancedInfo().then(() => {
      let advancedKeys = this.eventEmit.advancedKeys;
      for (let key in advancedKeys) {
        this.advancedFilter.forEach(t => {
          if (t.type == key) {
            advancedKeys[key].forEach((child, i) => {
              t.child[i] = {type: key, title: child.entryValue, value: child.entryCode, parent: t.title, selected: false};
            })
          }
        })
      }
    });
  }

  // 高级搜索字段搜索
  searchByAd(item) {
    switch (item.type) {
      case 'data_category':
        this.searchOptions['dataCategory'] = item['value'];
        break;
      case 'data_collection':
        this.searchOptions['collectionMethod'] = item['value'];
        break;
      case 'data_service':
        this.searchOptions['serviceMethod'] = item['value'];
        break;
      case 'data_source':
        this.searchOptions['dataSource'] = item['value'];
        break;
      case 'date_facets':
        this.searchOptions['dataSince'] = item['value'];
        break;
    }
    this.getProductList();
    this.isShowSide = false;
  }

  // 取消高级字段筛选
  cancelAdvancedFilter(item) {
    this.selectAdvanced.forEach((f, ind) => {
      if (f === item) {
        this.selectAdvanced.splice(ind, 1);
      }
    });
    this.advancedFilter.forEach(i => {
      if (item.type == i.type){
        i.child.forEach(c => {
          if (item.value == c.value) { c.selected = false }
        })
      }
    });
    switch (item.type) {
      case 'data_category':
        this.searchOptions['dataCategory'] = undefined;
        break;
      case 'data_collection':
        this.searchOptions['collectionMethod'] = undefined;
        break;
      case 'data_service':
        this.searchOptions['serviceMethod'] = undefined;
        break;
      case 'data_source':
        this.searchOptions['dataSource'] = undefined;
        break;
      case 'date_facets':
        this.searchOptions['dataSince'] = undefined;
        break;
    }
    this.getProductList();
  }

  // 标签搜索去重
  tagUnique() {
    const unique = {};
    if (this.product['items'].length) {
      this.product['items'].forEach(item => {
        item.tags.forEach(tag => {
          unique[JSON.stringify(tag)] = tag;
        });
      });
    }
    this.tagsFilter = Object.keys(unique).map(function(u){ return JSON.parse(u); });
  }

  // 标签搜索
  searchByTag(item) {
    // 设置选中的标签
    if (!this.selectedTagFilterO[item.id]) {
      this.selectedTagFilterO[item.id] = item;
      this.selectedTagFilterA.push(item);
      this.tagParams();
      this.isShowSide = false;
    }
  }

  /**
   * 构建 标签查询参数并调用搜索接口
   */
  tagParams() {
    let tagS = '';
    for (const key in this.selectedTagFilterO) {
      tagS += key + ',';
    }
    this.searchOptions['tagId'] = tagS.substring(0, tagS.length - 1);
    this.getProductList();
    this.isShowSide = false;
    // this.sideNav.close();
  }

  cancelTagFilter(item) {
    delete this.selectedTagFilterO[item.id];
    this.selectedTagFilterA.forEach((tag ,ind) => {
      if (tag == item) {
        this.selectedTagFilterA.splice(ind, 1);
      }
    });
    this.tagParams();
  }

  // 关键字搜索
  keywordSearch() {
    this.eventEmit.keywordSearch.subscribe(e => {
      this.eventEmit.keyword = e.keyword;
      this.searchOptions['keyword'] = e.keyword;
      this.searchOptions['offset'] = e.offset;
      this.getProductList();
    });
  }

  // 时间条件搜索
  searchByTime(i, item) {
    this.searchOptions['dataSince'] = item.value ? (new Date(item.value)).getTime() : undefined;
    this.getProductList();
    this.isShowSide = false;
    // this.sideNav.close();
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
          // let len = this.searchCondition[0]['children'].length;
        })
    }
  }

  // 排序
  productSort(item) {
    this.currSortItem = item;
    this.searchOptions['sortBy'] = item.value;
    this.getProductList();
  }

  // 进入产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    this.searchOptions['offset'] = (e - 1) * (this.searchOptions['limit']);
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
