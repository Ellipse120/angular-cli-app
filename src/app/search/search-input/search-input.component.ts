/**
 * Created by Administrator on 2017/5/8.
 */
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';

import { MyServiceService } from '../../core/app.service';
import { IMyDpOptions } from "mydatepicker";

import {SearchService} from "../search.service";


@Component({
  selector: 'search-input',
  outputs: ['keywordSearch', 'showAdvancedBox'],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit {

  @Input() hideAdvancedSearch;
  keywordSearch: EventEmitter<any>;
  showAdvancedBox: EventEmitter<any>;
  keywordSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  isShowAdvancedBox = false;
  advanceInfo = {
    data_category: [],
    data_source: [],
    data_collection: [],
    data_service: []
  };
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
              public service: MyServiceService,
              public router: Router,
              public searchService: SearchService) {
    this.keywordSearch = new EventEmitter();
    this.showAdvancedBox = new EventEmitter();
  }

  ngOnInit() {
    this.keywordSearchOption.keyword = this.searchService.keyword ?　this.searchService.keyword : '';
    this.createForm();
    document.addEventListener('click', () => {
      this.isShowAdvancedBox = false;
    }, false)
  }

  //关键字搜索
  keywordSubmit(form: any) {
    this.keywordSearchOption.keyword = this.keywordSearchForm.get('keyword').value;
    this.keywordSearch.emit(this.keywordSearchOption)
  }

  toggleAdvancedBox() {
    this.isShowAdvancedBox = !this.isShowAdvancedBox;
    this.showAdvancedBox.emit({isShowAdvancedBox: this.isShowAdvancedBox});
    this.getAdvancedInfo();
  }

  // 获取高级搜索字段
  getAdvancedInfo() {
    this.service.getAdvancedSearchInfo()
      .then((res) => {
        let data: any = res;
        let advanced = this.advanceInfo;

        for (const type in advanced) {
          data.forEach((item) => {
            if (item.categoryCode == type) {
              this.advanceInfo[type].push(item)
            }
          })
        }
        this.searchService.advancedKeys = this.advanceInfo;
        console.log('after', this.advanceInfo)
      })
  }

  // 提交高级搜索
  advancedSearchSubmit() {
    if (!this.advancedSearchForm) { return }
    let form = this.advancedSearchForm;
    let data = { offset: 0, limit: 10, sortBy: '', ascending: false};
    for (const key in form.value) {
      if (form.value[key]) {
        if (form.value[key] instanceof Object) {
          data[key] = form.value[key].epoc;
        } else {
          data[key] = form.value[key];
        }
      }
    }

    let navigationExtras: NavigationExtras = {
      queryParams: data
    }
    this.router.navigate(['datalist'], navigationExtras)
  }

  //创建表单
  createForm() {
    this.keywordSearchForm = this.fb.group({
      keyword: [this.keywordSearchOption.keyword, Validators.required]
    });
    this.advancedSearchForm = this.fb.group({
      keyword: '',
      dataSource: '',
      premium: '',
      dataCategory: '',
      serviceMethod: '',
      collectionMethod: '',
      sampleFileProvided: '',
      dataSince: null,
      dataUntil: null
    })
  }

  // my-date-picker
  setDate(): void {
    // Set today date using the setValue function
    let date = new Date();
    this.keywordSearchForm.setValue({dataSince: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
    this.keywordSearchForm.setValue({dataUntil: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
  }

}
