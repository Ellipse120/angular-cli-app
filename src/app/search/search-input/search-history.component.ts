import {Component, EventEmitter, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {SearchService} from '../search.service';

@Component({
  template: `
    <div class="search-history" *ngIf="searchHistory?.length" (click)="$event.stopPropagation()">
      <ul>
        <li *ngFor="let h of searchHistory" (click)="searchByHistory(h)">{{h}}</li>
        <li class="close-history"><span (click)="clearSearchHistory()">清除</span></li>
      </ul>
    </div>
  `,
  styleUrls: ['./search-input.component.css']
})

export class SearchHistoryComponent implements OnInit {
  popupClose = new EventEmitter<any>();
  searchHistory = [];

  constructor(private router: Router, private eventEmit: SearchService) {}
  ngOnInit() {
    this.getSearchHistory();
  }

  // 获取搜索历史
  getSearchHistory() {
    this.searchHistory = window.localStorage.getItem('keyword_group') ? JSON.parse(window.localStorage.getItem('keyword_group')) : [];
    this.searchHistory = this.searchHistory.reverse();
  }

  // 按历史关键字搜索
  searchByHistory(key) {
    this.eventEmit.changeKeyword.emit({keyword: key, offset: 0});
    this.eventEmit.keywordSearch.emit({keyword: key, offset: 0});
    const navigationExtras: NavigationExtras = {
      queryParams: {keyword: key}
    };
    this.router.navigate(['datalist'], navigationExtras);
    this.popupClose.emit();
  }


  clearSearchHistory() {
    window.localStorage.removeItem('keyword_group');
    this.getSearchHistory();
  }
}
