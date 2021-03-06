import {Component, EventEmitter, OnInit} from '@angular/core';
import {YslHttpService} from '../../../core/ysl-http.service';
import {SearchService} from '../../search.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  templateUrl: `./search-advanced.component.html`,
  styleUrls: ['../search-input.component.css']
})

export class SearchAdvancedComponent implements OnInit {

  popupClose = new EventEmitter<any>();
  advancedSearchForm: FormGroup;
  premiumChecked = [{text: '是', value: true, checked: false}, {text: '否', value: false, checked: false}];
  sampleFileChecked = [{text: '有', value: true, checked: false}, {text: '无', value: false, checked: false}];
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

  constructor(private httpService: YslHttpService,
              private searchService: SearchService,
              private fb: FormBuilder,
              private router: Router) {}

  ngOnInit() {
    this.getAdvancedInfo();
    this.createForm();
  }

  // 获取高级搜索字段
  getAdvancedInfo() {
    this.httpService.getAdvancedSearchInfo()
      .then((res) => {
        const data: any = res;
        const advanced = this.advanceInfo;

        for (const type in advanced) {
          if (advanced.hasOwnProperty(type)) {
            data.forEach((item) => {
              if (item.categoryCode === type) {
                this.advanceInfo[type].push(item);
              }
            });
          }
        }
        // this.searchService.advancedKeys = this.advanceInfo;
      });
  }

  // 变多选为单选
  transRadio(ind, t) {
    if (t === 'p') {
      this.premiumChecked[ind]['checked'] = !this.premiumChecked[ind]['checked'];
      if (this.premiumChecked[ind]['checked']) {
        this.premiumChecked.forEach(item => {
          item['checked'] = false;
          this.premiumChecked[ind]['checked'] = true;
        });
      }
    } else {
      this.sampleFileChecked[ind]['checked'] = !this.sampleFileChecked[ind]['checked'];
      if (this.sampleFileChecked[ind]['checked']) {
        this.sampleFileChecked.forEach(item => {
          item['checked'] = false;
          this.sampleFileChecked[ind]['checked'] = true;
        });
      }
    }
  }

  // 提交高级搜索
  advancedSearchSubmit() {
    if (!this.advancedSearchForm) { return; }
    const form = this.advancedSearchForm;
    const data = {};
    for (const key in form.value) {
      if (form.value[key]) {
        if (form.value[key] instanceof Object) {
          data[key] = form.value[key].epoc;
        } else {
          data[key] = form.value[key];
        }
      }
    }

    const navigationExtras: NavigationExtras = {
      queryParams: data
    };
    this.router.navigate(['datalist'], navigationExtras);
  }

  createForm() {
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
    });
  }

  // my-date-picker
  setDate(): void {
    // Set today date using the setValue function
    const date = new Date();
    this.advancedSearchForm.setValue({dataSince: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
    this.advancedSearchForm.setValue({dataUntil: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
  }
}
