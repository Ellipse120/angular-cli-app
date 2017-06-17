import {Component, OnInit} from '@angular/core';

import {IMyDateModel, IMyDpOptions} from 'mydatepicker';

import {ProductListComponent} from '../product-list/product-list.component';
import {YslHttpService} from '../../core/ysl-http.service';
import {ProductListService} from "../product-list/product-list.service";
import {CookieService} from "ngx-cookie";

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
    dataSince: '',
    dataUntil: '',
    tags: []
  };
  import = true;
  isActive = 0;
  tagDimensions = [];
  dataSourceMap = {
    'centerGov': '中央政府机构',
    'localGov': '地方政府机构',
    'industryAssociation': '行业协会',
    'thirdPartyOrganization': '第三方机构',
    'internationalOrganization': '国际组织',
    'multiChannelAggregation': '多渠道综合',
    'company': '企业',
    'individual': '个人'
  };
  dataCategoryMap = {
    'dashboard': '面板数据',
    'cross': '截面数据',
    'timeseries': '时间序列数据',
    'hybrid': '混合数据'
  };
  dataCollectionMap = {
    'declaration': '单位申报',
    'survey': '抽样调查',
    'research': '调研访问',
    'deal': '市场交易',
    'compilation': '统计整理'
  };
  dataServiceMap = {
    'api': 'API调用',
    'file': '数据文件',
    'client': '应用程序',
    'web': '网页应用'
  };
  radioItems = '是 否'.split(' ');

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd'
  };
  model: Object = {date: {year: 2018, month: 10, day: 9}};
  userInfo;

  constructor(public product: ProductListComponent,
              public service: YslHttpService,
              private productListService: ProductListService,
              private cookie: CookieService) {
  }

  ngOnInit() {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    // 获取首页标签数据
    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensions = data;
      });
  }

// 关闭弹框
  close() {
    this.product.import = false;
  }

// 切换数据类型
  changeTab(i) {
    this.isActive = i;
    console.log(i);
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
    this.productListService.doProductImport(this.data)
      .then(res => {
        this.close();
        window.location.reload();
      });
  }

}
