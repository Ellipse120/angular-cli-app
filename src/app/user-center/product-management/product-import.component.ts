/**
 * Created by Lusai on 30/06/2017.
 */

import {Component, OnInit} from "@angular/core";
import {IMyDateModel, IMyDpOptions} from "mydatepicker";
import {YslHttpService} from "../../core/ysl-http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {ProductListService} from "../../product-mangement/product-list/product-list.service";
import {CookieService} from "ngx-cookie";


@Component({
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})
export class ProductImportComponent implements OnInit {


  product = {
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

  isActive = 0;
  tagDimensions = [];
  dataSources = [];
  dataCategories = [];
  dataCollections = [];
  dataServices = [];

  radioItems = [
    {value: true, viewValue: '是'},
    {value: false, viewValue: '否'}
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
  pattern ='[^,，.。;；]+$';

  constructor(public service: YslHttpService,
              private router: Router,
              private route: ActivatedRoute,
              private productListService: ProductListService,
              private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;

    if (!isNullOrUndefined(this.route.snapshot.paramMap.get('productId'))){
      this.service.getProductDetail(this.route.snapshot.paramMap.get('productId'))
        .then(data => {
          this.product = data;

          let a = new Date(this.product.dataSince);
          let b = new Date(this.product.dataUntil);

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
        });
    }

    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensions = data;
      });

    this.getSelectionOption();
  }

  changeTab(i) {
    this.isActive = i;
  }

  onDateFromChanged(event: IMyDateModel) {
    this.product.dataSince = event.epoc * 1000;
  }

  onDateToChanged(event: IMyDateModel) {
    this.product.dataUntil = event.epoc * 1000;
  }

  proTagImport(tagId) {
    this.product.tags.push({id: tagId});
  }

  checkedTag(id) {
    let ret = false;
    this.product.tags.forEach(tag => {
      if(!isNullOrUndefined(tag.items)){
        tag.items.forEach(item => {
          if (item.id === id) {
            ret = true;
          }
        })
      }
    });
    return ret;
  }

  doProductSubmit(): any {
    this.product.userId = this.userInfo;

    if(this.route.routeConfig.path === 'import'){
      this.productListService.doProductImport(this.product)
        .then(res => {
          this.router.navigate(['../list'],{relativeTo: this.route})
        });
    } else {
      this.productListService.doProductUpdate(this.product)
        .then(res => {
          this.router.navigate(['../../list'],{relativeTo: this.route})
        });
    }
  }

  getSelectionOption() {
    this.service.getAdvancedSearchInfo()
      .then((res) => {
        let options: any = res;

        options.forEach(option => {
          switch (option.categoryCode) {
            case 'data_category': {
              this.dataCategories.push({value: +option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_source': {
              this.dataSources.push({value: +option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_collection': {
              this.dataCollections.push({value: +option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_service': {
              this.dataServices.push({value: +option.entryCode, viewValue: option.entryValue});
              break;
            }
          }
        });
      });
  }

}
