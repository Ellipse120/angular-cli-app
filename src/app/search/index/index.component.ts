import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { YslHttpService } from "../../core/ysl-http.service";
import {SearchService} from "../search.service";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {
  tagDimensions = [];
  indexContStyle = {};
  searchOption = {tagId: ''};
  activeProductCount;

  constructor(public service: YslHttpService,
              public router: Router,
              public eventEmit: SearchService) {}

  ngOnInit() {
    this.eventEmit.keyword = '';
    this.getTags()
    this.getQuantity()
  }

  // 获取可用产品数量、供应商数量
  getQuantity() {
    this.service.getIndexQuantity()
      .then(res => {
        this.activeProductCount = res['activeProductCount'];
      })
  }

  // 获取首页标签数据
  getTags() {
    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensions = data;
      })
  }

  // 标签搜索
  tagSearch(tag) {
    this.searchOption['tagId'] = tag.id;
    this.toDataList()
  }

  // 切换高级搜索
  // showAdvancedBox(isShow) {
  //   console.log('toggle style')
  //   this.indexContStyle = isShow.isShowAdvancedBox ? {minHeight: '977px'} : {minHeight: 0}
  // }

  // 搜索跳转页面
  toDataList() {
    let navigationExtras: NavigationExtras = {
      queryParams: this.searchOption
    };

    this.router.navigate(['datalist'], navigationExtras)
  }

}
