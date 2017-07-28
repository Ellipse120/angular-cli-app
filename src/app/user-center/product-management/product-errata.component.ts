import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {ProductErrorService} from '../../product-mangement/error-correct/product-error.service';
import {CookieService} from 'ngx-cookie';
import {Router, ActivatedRoute} from '@angular/router';

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
  page = 1;
  isLoading: boolean;

  isMine = true;

  ngOnInit(): void {

    this.userId = this.cookie.getObject('yslUserInfo')['id'];

    this.getErrorList();
  }

  constructor(public service: ProductErrorService,
              private cookie: CookieService,
              private location: Location,
              private router: Router,
              private route: ActivatedRoute) {
  }

  getErrorList() {
    const params = {};
    params['userId'] = this.userId;
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
        if (item.status === 2) {
          item.statusText = '未修改';
        } else {
          item.statusText = '已修改';
        }
      });
      this.errorLists = data.items;
    });
  }

  editProductError(row) {
    this.router.navigate(['../edit', {productId: row.productId, type: 2}], {relativeTo: this.route});
    return false;
  }

  getErrorPage(e) {
    this.isLoading = true;
    this.page = e;
    this.pagingOption.offset = (e - 1) * 10;
    this.pagingOption.userId = this.userId;
    this.getErrorList();
  }


  doViewProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

}
