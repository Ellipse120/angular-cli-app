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
  searchOption = {tagId: '', tagName: '', tagParent: ''};
  activeProductCount;

  constructor(public service: YslHttpService,
              public router: Router,
              public eventEmit: SearchService) {}

  ngOnInit() {
    this.eventEmit.keyword = '';
    this.getTags();
    this.getQuantity();
    this.setStyle();
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
        setTimeout(() => {
          this.setStyle();
        });
      });
  }

  // 标签搜索
  tagSearch(tag, parentTag) {
    this.searchOption['tagId'] = tag.id;
    this.searchOption['tagName'] = tag.name;
    this.searchOption['tagParent'] = parentTag.name;
    this.toDataList();
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

    this.router.navigate(['datalist'], navigationExtras);
  }

  tagSelectChanged() {
    this.setStyle();
  }

  // 根据浏览器类型设置样式
  setStyle() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('AppleWebKit') <= -1) {
      const contents = document.getElementsByClassName('ysl-label-search-cont');
      const labels = document.getElementsByClassName('mat-tab-label-container')[0];
      labels['style'].overflow = 'hidden';
      for (let i = 0; i < contents.length; i ++) {
        contents[i]['style'].overflow = 'visible';
        contents[i]['style'].height = 'auto';
        contents[i]['style'].marginBottom = '60px';
      }
    }
  }
}
