import { Component, OnInit} from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { ProductListComponent } from '../product-list/product-list.component';
import { MyServiceService } from '../../core/app.service';

@Component({
  selector: 'product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})

export class ProductImportComponent implements OnInit {

  timeFrom = '';
  timeTo = '';
  data = {
    name: '',
    summary: '',
    url:  '',
    from: '',
    type: '',
    collect: '',
    service: '',
    area: ''
  };
  import = true;
  isActive = 0;
  tagDimensions = [];

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd'
  };

  model: Object = { date: { year: 2018, month: 10, day: 9 } };

  constructor(public product: ProductListComponent, public service: MyServiceService){

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
  onSubmit() {
    console.log(this.data);
  }
  ngOnInit() {
    // 获取首页标签数据
    this.service.getTagDimensions()
      .then( data => {
        this.tagDimensions = data;
      });
  }
}
