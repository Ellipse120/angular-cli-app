/**
 * Created by Administrator on 2017/5/8.
 */
import {Component, OnInit, EventEmitter, Input, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';

import { YslHttpService } from '../../core/ysl-http.service';
import { IMyDpOptions } from "mydatepicker";

import {SearchService} from "../search.service";
import {YslPopupDirective} from "../../core/directive/ysl-popup.directive";
import {SearchAdvancedComponent} from "./search-advanced/search-advanced.component";


@Component({
  selector: 'search-input',
  outputs: ['keywordSearch', 'showAdvancedBox'],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {

  @ViewChild(YslPopupDirective)
  private yslPopup: YslPopupDirective;
  @Input() hideAdvancedSearch;
  keywordSearch: EventEmitter<any>;
  showAdvancedBox: EventEmitter<any>;
  keywordSearchForm: FormGroup;
  urlTarget = '';
  isShowAdvancedBox: boolean;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd',
    inline: false,
    showClearDateBtn: false
  };
  data = {
    timeFrom: '',
    timeTo: ''
  };
  keywordSearchOption = {keyword: ''};
  advancedSearchOption = {};

  constructor(public fb: FormBuilder,
              public service: YslHttpService,
              public router: Router,
              public searchService: SearchService,
              private location: Location) {
    this.keywordSearch = new EventEmitter();
    this.showAdvancedBox = new EventEmitter();
    this.keywordSearchOption.keyword = this.searchService.keyword ?　this.searchService.keyword : '';
  }

  ngOnInit() {
    let path = this.location.path();
    this.createForm();
  }

  //关键字搜索
  keywordSubmit() {
    let navigationExtras: NavigationExtras = {
      queryParams: this.keywordSearchForm.value
    };
    this.router.navigate(['datalist'], navigationExtras);
    // this.keywordSearchOption.keyword = this.keywordSearchForm.get('keyword').value;
    // this.keywordSearch.emit(this.keywordSearchOption)
  }

  toggleAdvancedBox() {
    this.yslPopup.toggle(SearchAdvancedComponent);
    // this.isShowAdvancedBox = !this.isShowAdvancedBox;
    // this.showAdvancedBox.emit({isShowAdvancedBox: this.isShowAdvancedBox});
    // this.getAdvancedInfo();
  }

  //创建表单
  createForm() {
    this.keywordSearchForm = this.fb.group({
      keyword: [this.keywordSearchOption.keyword, Validators.required]
    });
  }
}
