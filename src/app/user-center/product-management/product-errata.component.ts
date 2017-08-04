import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {ProductErrorService} from '../../product-mangement/error-correct/product-error.service';
import {CookieService} from 'ngx-cookie';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  templateUrl: './product-errata.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductErrataComponent implements OnInit {

  userId: any;
  errorLists = [];
  count: number;
  pagingOption = {
    type: 1,
    productName: '',
    userId: 0,
    userName: '',
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: false
  };
  isLoading: boolean;
  isMine = true;
  page: any;

  constructor(public service: ProductErrorService,
              private cookie: CookieService,
              private commonService: YslCommonService,
              private location: Location,
              private snackBar: MdSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userId = this.cookie.getObject('yslUserInfo')['id'];
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.page = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.pagingOption['offset'] = param['offset'];
        this.getErrorList();
      });
  }

  getErrorList() {
    const params = {};
    params['userId'] = this.userId;
    this.pagingOption['userId'] = this.userId;
    if (this.router.url.split('/').pop().split('-').includes('by')) {
      params['type'] = 1;
      this.pagingOption.type = 1;
      this.isMine = true;
    } else {
      params['type'] = 2;
      this.pagingOption.type = 2;
      this.isMine = false;
    }

    this.service.list(this.pagingOption).subscribe(data => {
      this.count = data.totalLength;
      data.items.forEach(item => {
        if (item.status === 1) {
          item.statusText = '未处理';
        } else {
          item.statusText = '已处理';
        }
      });
      this.errorLists = data.items;
    }, error => {
      this.commonService.requestErrorHandle(error);
    });
  }

  editProductError(row) {
    this.router.navigate(['../edit', {productId: row.productId, type: 2}], {relativeTo: this.route});
    return false;
  }

  getErrorPage(e) {
    this.isLoading = true;
    this.pagingOption.offset = (e - 1) * 10;
    this.pagingOption.userId = this.userId;
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset}
    };
    this.router.navigate(['userCenter/productManagement/errata-for-me'], navigationExtras);
  }


  doViewProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

  // 更改纠错状态
  modifyErrataStatus(product, ind) {
    this.service.status(product['id'], 2)
      .subscribe(resp => {
        this.errorLists[ind]['status'] = 2;
        this.errorLists[ind]['statusText'] = '已处理';
        this.snackBar.open('标记处理成功', '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

}
