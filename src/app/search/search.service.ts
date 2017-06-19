import {Injectable, EventEmitter, OnInit} from '@angular/core';
import {YslHttpService} from "../core/ysl-http.service";

@Injectable()
export class SearchService implements OnInit{

  public keyword: string;
  public keywordSearch: EventEmitter<any> = new EventEmitter<any>();
  public errataInfo: any;
  public advancedKeys = {
    data_category: [],
    data_source: [],
    data_collection: [],
    data_service: []
  };
  constructor(private httpService: YslHttpService) {
    this.keyword = ''
  }

  ngOnInit() {
    this.getAdvancedInfo();
  }

  getAdvancedInfo() {
    this.httpService.getAdvancedSearchInfo()
      .then((res) => {
        let data: any = res;
        let advanced = this.advancedKeys;

        for (const type in advanced) {
          data.forEach((item) => {
            if (item.categoryCode == type) {
              this.advancedKeys[type].push(item)
            }
          })
        }
        // this.searchService.advancedKeys = this.advanceInfo;
      })
  }
}
