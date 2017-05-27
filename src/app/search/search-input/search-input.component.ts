/**
 * Created by Administrator on 2017/5/8.
 */
import {Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

import { MyServiceService } from '../../core/app.service';

@Component({
  selector: 'search-input',
  outputs: ['keywordSearch'],
  templateUrl: './search-input.component.html'
})

export class SearchInputComponent implements OnInit {

  keywordSearch: EventEmitter<any>;
  keywordSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  ishide = true;
  data = {
    timeFrom: '',
    timeTo: ''
  };
  keywordSearchOption = {keyword: '', offset: 0, limit: 10, sortBy: '', ascending: false};
  advancedSearchOption = {};


  constructor(public fb: FormBuilder, public service: MyServiceService, public router: Router) {
    this.keywordSearch = new EventEmitter();
    this.createForm();
  }

  //关键字搜索
  keywordSubmit(form: any) {

    this.keywordSearchOption.keyword = this.keywordSearchForm.get('keyword').value;
    this.keywordSearch.emit(this.keywordSearchOption)

  }

  toggleAdvancedBox() {
    this.ishide = !this.ishide;
  }



  // 提交高级搜索条件
  advancedSearchSubmit() {
    console.log(this.advancedSearchForm.value);

  }

  ngOnInit() {

  }

  //创建表单
  createForm() {
    this.keywordSearchForm = this.fb.group({
      keyword: [this.keywordSearchOption.keyword, Validators.required]
    })

    this.advancedSearchForm = this.fb.group({
      keyword: '',
      source: '',
      charge: '',
      dataType: '',
      serviceMethod: '',
      collectionMethod: '',
      dataSamples: '',
      area: ''
    })
  }
}
