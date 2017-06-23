import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
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

  @ViewChild('yslSideNav') sideNav;
  yearSearchForm: FormGroup;
  state = false;
  isShowLoading: boolean = true;
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
  currSortTagParent = [];
  currSortTag = [];
  tagSortList = [{}];
  isShowPeriod = true;
  searchCondition = [];
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
        this.getProjectList();
      });
    this.limit = this.searchOptions['limit'];
    this.keywordSearch();
    this.createForm();
  }

  // 侧边栏
  openSideNav() {
    this.sideNav.open();
  }

  // 获取产品列表
  getProjectList() {
    this.isShowLoading = true;
    if (!this.searchOptions['keyword']) { this.searchOptions['keyword'] = undefined}
    this.service.productKeywordSearch(this.searchOptions)
      .then(res => {
        this.product = res;
        this.handleDataList();
      });
  }

  // 解析产品列表数据
  handleDataList() {
    let keyword = this.searchOptions['keyword'];
    let keywordHis = window.localStorage.getItem('keyword_group') ? JSON.parse(window.localStorage.getItem('keyword_group')) : [];
    if (keyword && (keywordHis.indexOf(keyword) <= -1)) {
      keywordHis.push(keyword);
    }
    this.searchCondition = [];
    this.product['dateFacets'].forEach((item, ind) => {
      this.searchCondition[ind] = {text: (new Date(item)).getFullYear() + '年以来', value: item}
    })
    this.tagSortList = this.product['tagFacets'];
    this.tagSortList.forEach(tag => {
      this.currSortTag.forEach(curr => {
        tag['items'].forEach((_item, _ind) => {
          if (curr.id == _item.id) {
            tag['items'][_ind].currentTag = true;
          }
        })
      })
    });
    this.searchCondition.unshift({text: '时间不限', value: undefined});
    window.localStorage.setItem('keyword_group', JSON.stringify(keywordHis));
    this.isShowLoading = false;
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
    if (this.currSortTagParent.indexOf(item.parentId) <= -1) {
      this.currSortTagParent.push(item.parentId);
      this.currSortTag.push(item)
    } else {
      this.currSortTag.forEach((tag, ind) => {
        if (item.parentId == tag.parentId) {
          this.currSortTag.splice(ind, 1);
          this.currSortTag.push(item)
        }
      })
    }
    this.tagParams()
  }

  tagParams() {
    let tagS = '';
    this.currSortTag.forEach(tag => {
      tagS += tag.id + ','
    })
    this.searchOptions['tagId'] = tagS.substring(0, tagS.length - 1);
    this.getProjectList();
    this.sideNav.close();
  }

  cancelFilter(item) {
    this.currSortTagParent.forEach((p, pInd) => {
      if (item.parentId == p) { this.currSortTagParent.splice(pInd, 1)}
    })
    this.currSortTag.forEach((tag, ind) => {
      if (item.id == tag.id) { this.currSortTag.splice(ind, 1)}
    });
    this.tagParams()
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
    this.sideNav.close();
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
