import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../../core/ysl-common.service';
import {LoginComponent} from '../../login/login.component';
import {MdDialog, MdSnackBar} from '@angular/material';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ProductErrorService} from '../../product-mangement/error-correct/product-error.service';
import {YslHttpService} from '../../core/ysl-http.service';
import {IMyCalendarViewChanged, IMyDateModel, IMyDpOptions} from 'mydatepicker';

@Component({
  templateUrl: './product-errata.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class OperationProductErrataComponent implements OnInit {

  searchFilterForm: FormGroup;
  userId: any;
  userInfo: any;
  isShowLoading: any;
  listIsNull: any;
  status = [
    {value: 1, viewValue: '注册'},
    {value: 2, viewValue: '激活'},
    {value: 3, viewValue: '禁用'}
  ];
  pagingOption: any = {
    productName: '',
    limit: 10,
    offset: 0,
    sortBy: 'modifiedOn',
    ascending: false,
    dateSince: null,
    dateUntil: null
  };
  dataItems = [];
  currentPage: any;
  totalLength: any;
  datePickerSinceOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd',
    inline: false,
    showClearDateBtn: false
  };
  datePickerUntilOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd',
    inline: false,
    showClearDateBtn: false
  };
  constructor(private fb: FormBuilder,
              private cookie: CookieService,
              private productErrorService: ProductErrorService,
              private httpService: YslHttpService,
              private commonService: YslCommonService,
              private dialog: MdDialog,
              private snackbar: MdSnackBar,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.setDate();
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.getUserInfo().then(() => {
      this.route.queryParams
        .subscribe((params) => {
          const param = Object.assign({}, params);
          this.currentPage = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
          this.pagingOption['offset'] = param['offset'];
          this.listError();
        });
    }, error => {
      this.commonService.requestErrorHandle(error);
    });
  }

  getUserInfo() {
    if (!this.userId) { return; }
    return new Promise(resolve => {
      this.httpService.getUserInfo(this.userId)
        .then(res => {
          this.userInfo = res;
          resolve();
        }, error => {
          this.commonService.requestErrorHandle(error);
        });
    });
  }

  listError() {
    this.isShowLoading = true;
    this.productErrorService.list(this.pagingOption).subscribe(data => {
      this.isShowLoading = false;
      this.totalLength = data.totalLength;
      this.dataItems = data.items;
      this.listIsNull = !this.dataItems.length;
      this.dataItems.forEach(item => {
        item.submitTime = this.commonService.getDateForDay(item.submitTime);
        if (item.status === 1) {
          item.statusText = '未处理';
        } else {
          item.statusText = '已处理';
        }
      });
    }, error => {
      this.isShowLoading = false;
      this.commonService.requestErrorHandle(error);
    });
  }

  // 登录判断
  showLoginComp() {
    const dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
    }, error => {
      this.commonService.requestErrorHandle(error);
    });
  }

  enterKey(e) {
    if (e.keyCode === 13) {
      this.filter(1);
    }
  }

  // 筛选
  filter(type) {
    const form = this.searchFilterForm['value'];
    const userNameControl = this.searchFilterForm.controls['productName'];
    if (type === 1 && userNameControl.dirty) {
      this.pagingOption['productName'] = form['productName'];
      this.listError();
      this.searchFilterForm.reset(form);
    }
  }

  // 关键字搜索
  keywordSearch() {
    const form = this.searchFilterForm['value'];
    this.pagingOption['keyword'] = form['keyword'];
  }

  onDateChanged(event: IMyDateModel, type) {
    const time = event.epoc * 1000;
    if (type === 1) {
      this.pagingOption.dateSince = time;
    } else {
      this.pagingOption.dateUntil = time;
    }
    this.listError();
  }

  // 分页
  toNextPage(e) {
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['operation/productManagement/errata'], navigationExtras);
  }

  // 修改产品
  processingError(product) {
    this.router.navigate(['../edit', {productId: product.productId, editType: 2}], {relativeTo: this.route});
  }

  // 更改纠错状态
  modifyErrataStatus(product, ind) {
    this.productErrorService.status(product['id'], 2)
      .subscribe(resp => {
        this.dataItems[ind]['status'] = 2;
        this.dataItems[ind]['statusText'] = '已处理';
        this.snackbar.open('标记成功', '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  createForm() {
    this.searchFilterForm = this.fb.group({
      productName: '',
      dataSince: null,
      dataUntil: null
    });
  }

  // my-date-picker
  setDate(): void {
    // Set today date using the setValue function
    const date = new Date();
    this.searchFilterForm.patchValue({dataSince: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
    this.searchFilterForm.patchValue({dataUntil: {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()}
    }});
  }

}

