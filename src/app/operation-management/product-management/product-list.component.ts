import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie';
import {isNullOrUndefined} from 'util';
import {ProductListService} from '../../product-mangement/product-list/product-list.service';
import {YslCommonService} from '../../core/ysl-common.service';
import {YslHttpService} from '../../core/ysl-http.service';
import {LoginComponent} from '../../login/login.component';
import {MdDialog, MdSnackBar} from '@angular/material';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {FileUploader} from 'ng2-file-upload';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class OperationProductListComponent implements OnInit {

  searchFilterForm: FormGroup;
  userInfo: any;
  isShowLoading: any;
  listIsNull: any;
  userTypes = [
    {value: 1, viewValue: '未认证用户'},
    {value: 2, viewValue: '未认证用户'},
    {value: 10, viewValue: '认证用户'},
    {value: 20, viewValue: '认证用户'},
    {value: 30, viewValue: '运营方用户'}
  ];
  status = [
    {value: 1, viewValue: '待发布'},
    {value: 2, viewValue: '已发布'},
    {value: 3, viewValue: '禁用'}
  ];
  pagingOption: any = {
    limit: 10,
    offset: 0,
    sortBy: 'modifiedOn',
    ascending: false,
    userName: '',
    userType: '',
    status: '',
    keyword: ''
  };
  dataItems = [];
  currentPage: any;
  totalLength: any;
  uploadUrl = 'api/file/upload/product/sample/';
  public uploader: FileUploader = new FileUploader({url: this.uploadUrl});

  constructor(private fb: FormBuilder,
              private cookie: CookieService,
              private productListService: ProductListService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private route: ActivatedRoute,
              private router: Router,
              private service: YslHttpService,
              public snackbar: MdSnackBar) {
  }

  ngOnInit() {
    this.createForm();
    this.userInfo = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo') : null;
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;

        this.getProducts();this.pagingOption['offset'] = param['offset'];
      });
  }

  getProducts() {
    if (!isNullOrUndefined(this.userInfo)) {
      this.isShowLoading = true;
      this.productListService.getOperateProductList(this.pagingOption).subscribe((data) => {
        this.isShowLoading = false;
        this.dataItems = data.items;
        this.totalLength = data.totalLength;
        this.listIsNull = !this.dataItems.length;
        this.dataItems.forEach(item => {
          switch ('' + item.userType) {
            case  '1': {
              item.userType = '未认证用户';
              break;
            }
            case  '2': {
              item.userType = '未认证用户';
              break;
            }
            case  '10': {
              item.userType = '认证用户';
              break;
            }
            case  '20': {
              item.userType = '认证用户';
              break;
            }
            case  '30': {
              item.userType = '运营方用户';
              break;
            }
            default: {
              break;
            }
          }

          item.premium = item.premium ? '是' : '否';
          item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn);
        });
      }, (error) => {
        this.isShowLoading = false;
        this.commonService.loginTimeout(error);
      });
    } else {
      // this.showLoginComp();
    }
  }

  // // 登录判断
  // showLoginComp() {
  //   const dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
  //   dialogLog.afterClosed().subscribe(result => {
  //     if (!result) {
  //       return;
  //     }
  //     this.cookie.putObject('yslUserInfo', result.userLoginInfo);
  //     this.getProducts();
  //   });
  // }

  // 启用或禁用
  openOrClose(product, ind) {
    let status;
    status = (product['status'] === 1 || product['status'] === 3) ? 2 : 3;
    this.productListService.doChangeStatus(product.productId, status)
      .then(res => {
        const productStatus = this.dataItems[ind]['status'];
        this.dataItems[ind]['status'] = (productStatus === 1 || productStatus === 3) ? 2 : 3;
        if (productStatus === 1 || productStatus === 3) {
          this.dataItems[ind]['status'] = 2;
          this.snackbar.open('激活成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
        } else {
          this.dataItems[ind]['status'] = 3;
          this.snackbar.open('禁用成功', '', {
            duration: 2000,
            extraClasses: ['ysl-snack-bar']
          });
        }
      }, error => {
        this.commonService.loginTimeout(error);
      });
  }

  // 筛选
  filter(type) {
    const form = this.searchFilterForm['value'];
    const userNameControl = this.searchFilterForm.controls['userName'];
    if (type === 1 && userNameControl.dirty) {
      this.pagingOption['userName'] = form['userName'];
      this.getProducts();
      this.searchFilterForm.reset(form);
    } else if (type === 2) {
      this.pagingOption['userType'] = form['userType'];
      this.pagingOption['status'] = form['status'];
      this.getProducts();
    }
  }

  // 关键字搜索
  keywordSearch() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['keyword'] = form['keyword'];
    this.getProducts();
  }

  // 分页
  toNextPage(e) {
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['operation/productManagement/list'], navigationExtras);
  }

  // 添加产品
  addProduct() {
    this.router.navigate(['operation/productManagement/add']);
  }

  // 修改产品
  editProduct(product) {
    this.router.navigate(['../edit', {productId: product.productId, editType: 1}], {relativeTo: this.route});
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  createForm() {
    this.searchFilterForm = this.fb.group({
      userName: '',
      userType: '',
      status: '',
      keyword: ''
    });
  }

  onFileChange(event, item) {
    this.uploadUrl = this.service.url + 'api/file/upload/product/sample/' + item.productId;
    this.uploader.setOptions({
      'url': this.uploadUrl
    });
    this.uploader.queue[this.uploader.queue.length - 1].onSuccess = (response, status, headers) => {
      if (status === 200) {
        const res = JSON.parse(response);
        item.sampleFilePath = res['sampleFilePath'];
        this.productListService.doProductUpdate(item);
        this.snackbar.open('数据样本上传成功', '', {
          duration: 1000,
          extraClasses: ['ysl-snack-bar']
        });
      }
    };
    this.uploader.queue[this.uploader.queue.length - 1].upload();
  }

}
