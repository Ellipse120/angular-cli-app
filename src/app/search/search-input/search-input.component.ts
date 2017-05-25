/**
 * Created by Administrator on 2017/5/8.
 */
import {Component,OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'

import { MyServiceService } from '../../core/app.service';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html'
})

export class SearchInputComponent implements OnInit {

  keyWordForm: FormGroup;
  ishide = true;
  advancedArr = [];
  data = {
    timeFrom: '',
    timeTo: ''
  };
  keywordOption = {
    keyword: '',
    offset: 0,
    limit: 10,
    sortBy: '',
    ascending: false
  };


  constructor(public fb: FormBuilder, public service: MyServiceService, public router: Router) {
    this.createForm();
  }

  //关键字搜索
  keywordSubmit(form: any) {

    this.keywordOption.keyword = this.keyWordForm.get('keyword').value;
    console.log('option', this.keywordOption)
    this.router.navigate(['datalist', {keyword: this.keywordOption.keyword, offset: this.keywordOption.offset, limit: this.keywordOption.limit, sortBy: this.keywordOption.sortBy, ascending: this.keywordOption.ascending}])
  }

  toggleAdvancedBox() {
    this.ishide = !this.ishide;
  }

  // 获取是否收费
  selectMoney(info) {
    console.log(info)
  }


  // 提交高级搜索条件
  submitAdvancedSearch() {
    console.log(this.advancedArr);

  }

  ngOnInit() {

  }

  createForm() {
    this.keyWordForm = this.fb.group({
      keyword: [this.keywordOption.keyword, Validators.required]
    })
  }
}
