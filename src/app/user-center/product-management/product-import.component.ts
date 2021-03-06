import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { YslHttpService } from '../../core/ysl-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ProductListService } from '../../product-mangement/product-list/product-list.service';
import { CookieService } from 'ngx-cookie';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { YslCommonService } from '../../core/ysl-common.service';

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
  tags = [];

  isActive = 0;
  tagDimensionsNew = [];
  dataSources = [{value: '', viewValue: '请选择'}];
  dataCategories = [{value: '', viewValue: '请选择'}];
  dataCollections = [{value: '', viewValue: '请选择'}];
  dataServices = [{value: '', viewValue: '请选择'}];
  isDisabled = false;
  isDisableRipple = true;
  checked = false;
  editType: any;
  premiumChecked = [{text: '是', value: true, checked: false}, {text: '否', value: false, checked: false}];

  radioItems = [
    {value: true, viewValue: '是'},
    {value: false, viewValue: '否'}
  ];

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd'
  };

  model: Object = {date: {year: 2017, month: 6, day: 22}};

  timeFrom: Object = {};

  timeTo: Object = {};

  userInfo;
  pattern = '[^,，。;；]+$';
  websitePattern = '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]\\.[^\\s]{2,})';
  public uploader: FileUploader;
  productSamplePath = 'api/file/upload/product/sample/';
  @ViewChild('uploadEl') uploadElRef: ElementRef;

  constructor(public service: YslHttpService,
              private router: Router,
              private route: ActivatedRoute,
              private commonService: YslCommonService,
              private productListService: ProductListService,
              private cookie: CookieService,
              private location: Location,
              private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.uploader = new FileUploader({url: this.service.url + 'api/file/upload'});
    this.uploader.onAfterAddingFile = (fileItem => {
      this.uploadElRef.nativeElement.value = '';
    });
    this.route.params.subscribe(p => {
      this.editType = p.type;
      if (!isNullOrUndefined(p['productId'])) {
        this.uploader = new FileUploader({url: this.service.url + this.productSamplePath + this.route.snapshot.paramMap.get('productId')});
        this.uploader.onAfterAddingFile = (fileItem => {
          this.uploadElRef.nativeElement.value = '';
        });
        this.productListService.getProductDetail(this.route.snapshot.paramMap.get('productId'))
          .subscribe(data => {
            if (data.premium) {
              this.product.premium = 'true';
              this.premiumChecked[0].checked = true;
            } else {
              this.product.premium = 'false';
              this.premiumChecked[1].checked = true;
            }
            this.product = data;

            if (!this.product.dataSince && !this.product.dataUntil) {
              this.timeFrom = {};
              this.timeFrom = {};
            } else {
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
            }
            setTimeout(() => {
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
            // if (!isNullOrUndefined(data['tags'])) {
            //   data['tags'].forEach(parentTag => {
            //     if (!isNullOrUndefined(parentTag['items'])) {
            //       parentTag['items'].forEach(tag => {
            //         this.tags.push({id: tag.id});
            //       });
            //     }
            //   });
            // }
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

  uploadFile() {
    const len = this.uploader.queue.length;
    this.uploader.onAfterAddingFile = (fileItem => {
      this.uploadElRef.nativeElement.value = '';
    });
    this.uploader.queue[len - 1].onSuccess = (response, status, headers) => {
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
    this.uploader.queue[len - 1].upload();
  }

  cancelFile() {
    this.uploader.clearQueue();
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

  // proTagImport(tagId, e) {
  //   const isChecked = e.currentTarget.checked;
  //   if (isChecked) {
  //     this.tags.push({id: tagId});
  //   } else {
  //     if (!isNullOrUndefined(this.tags)) {
  //       this.tags.forEach((tag, ind) => {
  //         if (tag.id === tagId) {
  //           this.tags.splice(ind, 1);
  //         }
  //       });
  //     }
  //   }
  // }

  // checkedTag(id) {
  //   let ret = false;
  //   this.product.tags.forEach(tag => {
  //     if (!isNullOrUndefined(tag.items)) {
  //       tag.items.forEach(item => {
  //         if (item.id === id) {
  //           ret = true;
  //         }
  //       });
  //     }
  //   });
  //   return ret;
  // }

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
        if (item.checked === true) {
          this.product.premium = 'false';
        } else if (item.checked === false) {
          this.product.premium = 'true';
        } else {
          this.product.premium = '';
        }
      });
    }
  }

  doProductSubmit(): any {
    this.isDisabled = true;
    this.product.userId = this.userInfo;
    this.product.name = this.product.name.trim();
    // this.product.tags = this.tags;
    this.proTagImport();
    if (this.route.routeConfig.path === 'import') {
      this.productListService.doProductImport(this.product)
        .then(res => {
          this.isDisabled = false;
          if (this.uploader.queue.length) {
            this.uploadFile();
          }
          this.snackbar.open('产品录入成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
          setTimeout(() => {
            this.router.navigate(['../list'], {relativeTo: this.route});
          });
        }, error => {
          this.isDisabled = false;
          this.commonService.requestErrorHandle(error);
        });
    } else {
      this.productListService.doProductUpdate(this.product)
        .then(res => {
          if (this.uploader.queue.length) {
            this.uploadFile();
          }
          if ((this.editType - 0) === 1) {
            this.snackbar.open('产品修改成功', '', {
              duration: 2000,
              extraClasses: ['ysl-snack-bar']
            });
            setTimeout(() => {
              this.router.navigate(['../list'], {relativeTo: this.route});
            });
          } else {
            this.snackbar.open('纠错处理成功', '', {
              duration: 2000,
              extraClasses: ['ysl-snack-bar']
            });
            setTimeout(() => {
              this.router.navigate(['../errata-for-me'], {relativeTo: this.route});
            });
          }
        }, error => {
          this.isDisabled = false;
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
