import {Component, OnInit} from '@angular/core';

import {IMyDateModel, IMyDpOptions} from 'mydatepicker';

import {YslHttpService} from '../../core/ysl-http.service';
import {ProductListService} from '../product-list/product-list.service';
import {CookieService} from 'ngx-cookie';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})

export class ProductImportComponent implements OnInit {

  data = {
    userId: '',
    name: '',
    description: '',
    webSite: '',
    dataSource: '',
    dataCategory: '',
    collectionMethod: '',
    serviceMethod: '',
    area: '',
    premium: '',
    dataSince: Date.now(),
    dataUntil: Date.now(),
    tags: []
  };
  import = true;
  isActive = 0;
  tagDimensions = [];
  dataSources = [];
  dataCategories = [];
  dataCollections = [];
  dataServices = [];

  radioItems = [
    {value: 'true', viewValue: '是'},
    {value: 'false', viewValue: '否'}
  ];

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd'
  };

  model: Object = {date: {year: 2017, month: 6, day: 22}};

  today: Date = new Date();
  timeFrom: Object = {
    date: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    }
  };

  timeTo: Object = {
    date: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    }
  };

  userInfo;
  productTitle = '产品录入';
  isProImport = true;
  pattern = '[^,，.。;；]+$';

  constructor(public service: YslHttpService,
              private productListService: ProductListService,
              private cookie: CookieService,
              public dialogRef: MdDialogRef<ProductImportComponent>) {
  }

  ngOnInit() {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    // 获取首页标签数据
    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensions = data;
      });

    if (!this.isProImport) {
      const a = new Date(this.data.dataSince);
      const b = new Date(this.data.dataUntil);
      this.timeFrom = {
        date: {
          year: a.getFullYear(),
          month: a.getMonth() + 1,
          day: a.getDate()
        }
      };
      this.timeTo = {
        date: {
          year: b.getFullYear(),
          month: b.getMonth() + 1,
          day: b.getDate()
        }
      };
    }

    this.getSelectionOption();

  }

// 切换数据类型
  changeTab(i) {
    this.isActive = i;
  }

  onDateFromChanged(event: IMyDateModel) {
    this.data.dataSince = event.epoc * 1000;
  }

  onDateToChanged(event: IMyDateModel) {
    this.data.dataUntil = event.epoc * 1000;
  }

  proTagImport(tagId) {
    this.data.tags.push({id: tagId});
  }

  onSubmit() {
    this.data.userId = this.userInfo;
    if (this.isProImport) {
      this.productListService.doProductImport(this.data)
        .then(res => {
          this.dialogRef.close();
        });
    } else {
      this.productListService.doProductUpdate(this.data)
        .then(res => {
          this.dialogRef.close();
        });
    }

  }

  /**
   * 检查标签 checked 状态
   * @param id
   * @returns {boolean}
   */
  checkTag(id) {
    let ret = false;
    this.data.tags.forEach(tag => {
      if (tag.id === id) {
        ret = true;
      }
    });
    return ret;
  }

  getSelectionOption() {
    this.service.getAdvancedSearchInfo()
      .then((res) => {
        const options: any = res;

        options.forEach(option => {
          switch (option.categoryCode) {
            case 'data_category': {
              this.dataCategories.push({value: + option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_source': {
              this.dataSources.push({value: + option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_collection': {
              this.dataCollections.push({value: + option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_service': {
              this.dataServices.push({value: + option.entryCode, viewValue: option.entryValue});
              break;
            }
          }
        });
      });
  }
}

