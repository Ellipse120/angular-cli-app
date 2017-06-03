import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SearchService {
  public keyword: string;
  public keywordSearch: EventEmitter<any> = new EventEmitter();
  constructor() {
    this.keyword = ''
  }
}
