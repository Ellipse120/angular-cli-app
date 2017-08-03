import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {YslHttpService} from '../../core/ysl-http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {CookieService} from 'ngx-cookie';
import {MdSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {FileUploader} from 'ng2-file-upload';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})

export class OperationProductAddComponent implements OnInit {

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

  editType: number;
  productId: any;
  isActive = 0;
  isDisabled = false;
  tagDimensionsNew = [];
  dataSources = [{value: '', viewValue: '请选择'}];
  dataCategories = [{value: '', viewValue: '请选择'}];
  dataCollections = [{value: '', viewValue: '请选择'}];
  dataServices = [{value: '', viewValue: '请选择'}];
  isDisableRipple = true;
  premiumChecked = [{text: '是', value: true, checked: false}, {text: '否', value: false, checked: false}];

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
  // websitePattern = '^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$';
  websitePattern = '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]\\.[^\\s]{2,})';

  public sampleUploader: FileUploader;
  productSamplePath = 'api/file/upload/product/sample/';
  @ViewChild('uploadEl') uploadElRef: ElementRef;

  constructor(public service: YslHttpService,
              private router: Router,
              private route: ActivatedRoute,
              private productListService: ProductListService,
              private commonService: YslCommonService,
              private cookie: CookieService,
              private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.sampleUploader = new FileUploader({url: this.service.url + 'api/file/upload'});
    this.sampleUploader.onAfterAddingFile = (fileItem => {
      this.uploadElRef.nativeElement.value = '';
    });
    this.route.params.subscribe(param => {
      this.editType = param['editType'] - 0;
      if (!isNullOrUndefined(param['productId'])) {
        this.sampleUploader = new FileUploader({url: this.service.url + this.productSamplePath + this.route.snapshot.paramMap.get('productId')});
        this.sampleUploader.onAfterAddingFile = (fileItem => {
          this.uploadElRef.nativeElement.value = '';
        });
        this.productListService.getProductDetail(this.route.snapshot.paramMap.get('productId'))
          .subscribe(data => {
            this.product = data;
            if (data.premium) {
              this.product.premium = 'true';
              this.premiumChecked[0].checked = true;
            } else {
              this.product.premium = 'false';
              this.premiumChecked[1].checked = true;
            }

            const a = !isNullOrUndefined(this.product.dataSince) ? new Date(this.product.dataSince) : new Date();
            const b = !isNullOrUndefined(this.product.dataUntil) ? new Date(this.product.dataUntil) : new Date();

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
            if (!isNullOrUndefined(data['tags'])) {
              data['tags'].forEach(tag => {
                if (!isNullOrUndefined(tag['items'])) {
                  tag['items'].forEach(t => {
                    this.checkedTag(t['id']);
                  });
                }
              });
            }
          });
      }
    });

    this.service.getTagDimensions()
      .then(data => {
        this.tagDimensionsNew = data;
        this.tagDimensionsNew.forEach(tagParent => {
          if (tagParent['items'] && tagParent['items'].length) {
            tagParent['items'].forEach(tag => {
              tag.checked = false;
            });
          }
        });
      });

    this.getSelectionOption();
  }

  uploadFile() {
    const len = this.sampleUploader.queue.length;
    this.sampleUploader.queue[len - 1].onSuccess = (response, status, headers) => {
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
    this.sampleUploader.queue[len - 1].upload();
  }

  cancelFile() {
    this.sampleUploader.clearQueue();
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

  setChecked(id) {
    this.tagDimensionsNew.forEach(parentTag => {
      if (!isNullOrUndefined(parentTag['items'])) {
        parentTag['items'].forEach(tag => {
          if (tag.id === id) {
            tag['checked'] = !tag['checked'];
          }
        });
      }
    });
  }

  proTagImport() {
    this.product.tags = [];
    this.tagDimensionsNew.forEach(parentTag => {
      if (!isNullOrUndefined(parentTag['items'])) {
        parentTag['items'].forEach(tag => {
          if (tag['checked']) {
            this.product.tags.push({id: tag['id']});
          }
        });
      }
    });
  }

  // 默认标签选中
  checkedTag(id) {
    this.tagDimensionsNew.forEach(tag => {
      if (!isNullOrUndefined(tag.items)) {
        tag.items.forEach(item => {
          if (item.id === id) {
            item.checked = true;
          }
        });
      }
    });
  }

  transRadio2(ind) {
    this.premiumChecked[ind]['checked'] = !this.premiumChecked[ind]['checked'];
    if (this.premiumChecked[ind]['checked']) {
      this.premiumChecked.forEach(item => {
        item['checked'] = false;
        this.premiumChecked[ind]['checked'] = true;
        if (item.checked) {
          this.product.premium = 'false';
        } else {
          this.product.premium = 'true';
        }
      });
    }
  }

  doProductSubmit(): any {
    this.isDisabled = true;
    this.proTagImport();
    this.product.userId = this.userInfo;
    this.product.name = this.product.name.trim();
    if (this.route.routeConfig.path === 'add') {
      this.productListService.doProductImport(this.product)
        .then(res => {
          this.isDisabled = false;
          if (this.sampleUploader.queue.length) {
            this.uploadFile();
          }
          this.snackbar.open('产品录入成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
          setTimeout(() => {
            this.router.navigate(['../list'], {relativeTo: this.route});
          });
        }, (error) => {
          this.isDisabled = false;
          this.commonService.loginTimeout(error);
          this.commonService.requestErrorHandle(error);
        });
    } else {
      this.productListService.doProductUpdate(this.product)
        .then(res => {
          this.isDisabled = false;
          if (this.sampleUploader.queue.length) {
            this.uploadFile();
          }
          this.snackbar.open('产品修改成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
          setTimeout(() => {
            if (this.editType === 1) {
              this.router.navigate(['../list'], {relativeTo: this.route});
            } else {
              this.router.navigate(['../errata'], {relativeTo: this.route});
            }
          });
        }, error => {
          this.isDisabled = false;
          this.commonService.loginTimeout(error);
          this.commonService.requestErrorHandle(error);
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
              this.dataCategories.push({value: option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_source': {
              this.dataSources.push({value: option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_collection': {
              this.dataCollections.push({value: option.entryCode, viewValue: option.entryValue});
              break;
            }
            case 'data_service': {
              this.dataServices.push({value: option.entryCode, viewValue: option.entryValue});
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
