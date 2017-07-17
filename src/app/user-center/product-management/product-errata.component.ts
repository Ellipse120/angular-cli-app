import {Component, OnInit} from '@angular/core';
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
    userId: 0,
    userName: '',
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true
  };
  page = 1;
  isLoading: boolean;

  ngOnInit(): void {

    this.userId =  this.cookie.getObject('yslUserInfo')['id'];

    this.getErrorList();
  }

  constructor(public service: ProductErrorService,
              private cookie: CookieService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  getErrorList() {
    const params = {};
    // if (this.user['userType'] !== 30) {
    //   params['userName']  = this.user['userName'];
    // }
    this.service.list(params).subscribe(data => {
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
    this.router.navigate(['../edit', row.productId], {relativeTo: this.route});
    return false;
  }

  getErrorPage(e) {
    this.isLoading = true;
    this.page = e;
    this.pagingOption.offset = (e - 1) * 10;
    this.pagingOption.userId = this.userId;
    this.getErrorList();
  }

}
