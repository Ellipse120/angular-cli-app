import {Component, OnInit} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {YslHttpService} from '../../core/ysl-http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {CookieService} from 'ngx-cookie';
import {Location} from '@angular/common';
import {MdSnackBar} from '@angular/material';
import {FileUploader} from 'ng2-file-upload';

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
    dataSince: +'',
    dataUntil: +'',
    sampleFilePath: '',
    tags: []
  };

  isActive = 0;
  tagDimensionsNew = [];
  dataSources = [];
  dataCategories = [];
  dataCollections = [];
  dataServices = [];
  isDisableRipple = true;

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
  pattern = '[^,，。;；]+$';
  public uploader: FileUploader;
  productSamplePath = 'api/file/upload/product/sample/';

  constructor(public service: YslHttpService,
              private router: Router,
              private route: ActivatedRoute,
              private productListService: ProductListService,
              private cookie: CookieService,
              private location: Location,
              private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.uploader = new FileUploader({url: this.service.url + 'api/file/upload'});
    if (!isNullOrUndefined(this.route.snapshot.paramMap.get('productId'))) {
      this.uploader = new FileUploader({url: this.service.url + this.productSamplePath + this.route.snapshot.paramMap.get('productId')});
      this.productListService.getProductDetail(this.route.snapshot.paramMap.get('productId'))
        .subscribe(data => {
          this.product = data;

          const a = new Date(this.product.dataSince);
          const b = new Date(this.product.dataUntil);

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
        this.tagDimensionsNew = data;
      });

    this.getSelectionOption();
  }

  selectedFileChange(event) {
    this.uploader.queue[this.uploader.queue.length - 1].onSuccess = (response, status, headers) => {
      if (status === 200) {
        if (!isNullOrUndefined(this.route.snapshot.paramMap.get('productId'))) {
          const res = JSON.parse(response);
          this.product.sampleFilePath = res['sampleFilePath'];
        } else {
          this.product.sampleFilePath = response;
        }
      }
      this.snackbar.open('数据样本上传成功', '', {
        duration: 1000,
        extraClasses: ['ysl-snack-bar']
      });
    };
    this.uploader.queue[this.uploader.queue.length - 1].upload();
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
      if (!isNullOrUndefined(tag.items)) {
        tag.items.forEach(item => {
          if (item.id === id) {
            ret = true;
          }
        });
      }
    });
    return ret;
  }

  doProductSubmit(): any {
    this.product.userId = this.userInfo;
    this.product.name = this.product.name.trim();
    if (this.route.routeConfig.path === 'import') {
      this.productListService.doProductImport(this.product)
        .then(res => {
          this.snackbar.open('产品录入成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
          setTimeout(() => {
            this.router.navigate(['../list'], {relativeTo: this.route});
          }, 2500);
        });
    } else {
      this.productListService.doProductUpdate(this.product)
        .then(res => {
          this.snackbar.open('产品修改成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
          setTimeout(() => {
            this.router.navigate(['../../list'], {relativeTo: this.route});
          }, 2500);
        });
    }
  }

  getSelectionOption() {
    this.service.getAdvancedSearchInfo()
      .then((res) => {
        const options: any = res;

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

  goBackList() {
    this.router.navigate(['../list'], {relativeTo: this.route});
  }

}
