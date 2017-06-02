/**
 * Created by Administrator on 2017/5/8.
 */
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { MyServiceService } from '../../core/app.service';

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
  data = {
    timeFrom: '',
    timeTo: ''
  };
  keywordSearchOption = {keyword: '', offset: 0, limit: 10, sortBy: '', ascending: false};
  advancedSearchOption = {};


  constructor(public fb: FormBuilder,
              public service: MyServiceService,
              public router: Router) {
    this.keywordSearch = new EventEmitter();
    this.showAdvancedBox = new EventEmitter();
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
    console.log('show')
    this.isShowAdvancedBox = !this.isShowAdvancedBox;
    this.showAdvancedBox.emit({isShowAdvancedBox: this.isShowAdvancedBox})
  }



  // 提交高级搜索
  advancedSearchSubmit() {
    console.log(this.advancedSearchForm.value);
  }


  ngOnInit() {
  }

  //创建表单
  createForm() {
    this.keywordSearchForm = this.fb.group({
      keyword: [this.keywordSearchOption.keyword, Validators.required]
    });
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
