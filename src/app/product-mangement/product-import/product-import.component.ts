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
    dataSince: '' + Date.now(),
    dataUntil: '' + Date.now(),
    tags: []
  };
  import = true;
  isActive = 0;
  tagDimensions = [];
  dataSources = [
    {value: 1, viewValue: '中央政府机构'},
    {value: 2, viewValue: '地方政府机构'},
    {value: 3, viewValue: '行业协会'},
    {value: 4, viewValue: '第三方机构'},
    {value: 5, viewValue: '国际组织'},
    {value: 6, viewValue: '多渠道综合'},
    {value: 7, viewValue: '企业'},
    {value: 8, viewValue: '个人'}
  ];
  dataCategories = [
    {value: 1, viewValue: '面板数据'},
    {value: 2, viewValue: '截面数据'},
    {value: 3, viewValue: '时间序列数据'},
    {value: 4, viewValue: '混合数据'}
  ];
  dataCollections = [
    {value: 1, viewValue: '单位申报'},
    {value: 2, viewValue: '抽样调查'},
    {value: 3, viewValue: '调研访问'},
    {value: 4, viewValue: '市场交易'},
    {value: 5, viewValue: '统计整理'}
  ];
  dataServices = [
    {value: 1, viewValue: 'API调用'},
    {value: 2, viewValue: '数据文件'},
    {value: 3, viewValue: '应用程序'},
    {value: 4, viewValue: '网页应用'},
  ];

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
      day: this.today.getDay()
    }
  };

  timeTo: Object = {
    date: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDay()
    }
  };

  userInfo;
  productTitle = '产品录入';
  isProImport = true;

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

  }

// 切换数据类型
  changeTab(i) {
    this.isActive = i;
  }

  onDateFromChanged(event: IMyDateModel) {
    this.data.dataSince = '' + event.epoc * 1000;
  }

  onDateToChanged(event: IMyDateModel) {
    this.data.dataUntil = '' + event.epoc * 1000;
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
      if (tag.id == id) {
        ret = true;
      }
    });
    return ret;
  }
}

