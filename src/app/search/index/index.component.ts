import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { MyServiceService } from "../../core/app.service";
import {SearchService} from "../search.service";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  tagDimensions = [];
  indexContStyle = {};
  searchOption;
  activeProductCount;

  constructor(public service: MyServiceService,
              public router: Router,
              private eventEmit: SearchService) {}

  ngOnInit() {
    this.eventEmit.keyword = '';
    this.searchOption = { offset: 0, limit: 10, sortBy: '', ascending: false};
    this.getTags()
    this.getQuantity()
  }

  // 获取可用产品数量、供应商数量
  getQuantity() {
    this.service.getIndexQuantity()
      .then(res => {
        this.activeProductCount = res['activeProductCount'];
        console.log('provider', res)
      })
  }

  // 获取首页标签数据
  getTags() {
    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensions = data;
        console.log(this.tagDimensions);
      })
  }

  // 关键字搜索
  keywordSearch(option) {
    this.searchOption.keyword = option.keyword;
    this.toDataList()
  }

  // 标签搜索
  tagSearch(tag) {
    this.searchOption.tagId = tag;
    this.toDataList()
  }

  // 切换高级搜索
  showAdvancedBox(isShow) {
    this.indexContStyle = isShow.isShowAdvancedBox ? {minHeight: '977px'} : {minHeight: 0}
  }

  // 搜索跳转页面
  toDataList() {
    let navigationExtras: NavigationExtras = {
      queryParams: this.searchOption
    }

    this.router.navigate(['datalist'], navigationExtras)
  }

}
