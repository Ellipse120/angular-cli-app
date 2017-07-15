import {Injectable, EventEmitter, OnInit} from '@angular/core';
import {YslHttpService} from '../core/ysl-http.service';

@Injectable()
export class SearchService implements OnInit {

  public keyword: string;
  public keywordSearch: EventEmitter<any> = new EventEmitter<any>();
  public loginEvent = new EventEmitter<any>();      // 详情页未登录评论等操作响应登录事件
  public loginSuccessEvent = new EventEmitter<any>();     // 登录成功后返回给详情页响应
  public logoutEvent = new EventEmitter<any>();
  public changeKeyword = new EventEmitter<any>();         // 监听关键字改变
  public errataInfo: any;
  public advancedKeys = {
    data_category: [],
    data_source: [],
    data_collection: [],
    data_service: []
  };
  constructor(private httpService: YslHttpService) {
    this.keyword = '';
  }

  ngOnInit() {
    this.getAdvancedInfo();
  }

  getAdvancedInfo() {
    return new Promise(resolve => {
      this.httpService.getAdvancedSearchInfo()
        .then((res) => {
          this.advancedKeys = {
            data_category: [],
            data_source: [],
            data_collection: [],
            data_service: []
          };
          const data: any = res;
          const advanced = this.advancedKeys;

          for (const type in advanced) {
            data.forEach((item) => {
              if (item.categoryCode == type) {
                this.advancedKeys[type].push(item);
              }
            });
          }
          resolve(this.advancedKeys);
          // this.searchService.advancedKeys = this.advanceInfo;
        });
    });
  }

}
