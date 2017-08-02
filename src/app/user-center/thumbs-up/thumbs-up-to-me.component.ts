import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../../core/ysl-http.service';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  selector: 'app-thumbs-up-to-me',
  templateUrl: './thumbs-up-to-me.component.html',
  styleUrls: ['./thumbs-up-to-me.component.css']
})
export class ThumbsUpToMeComponent implements OnInit {

  userId: number;
  thumbs = [];
  totalThumbedNum: number;
  page: any;
  isLoading: boolean;
  pagingOption = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true
  };

  constructor(private yslHttpService: YslHttpService,
              private commonService: YslCommonService,
              private cookie: CookieService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo')['id'];
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.page = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.pagingOption['offset'] = param['offset'];
        this.getThumbsToMe();
      });
  }

  getThumbsToMe() {
    this.pagingOption.userId = this.userId;
    this.yslHttpService.getThumbsToMe(this.pagingOption)
      .then((data) => {
        this.totalThumbedNum = data.totalLength;
        this.thumbs = data.items;
      }, error => {
        this.commonService.loginTimeout(error);
      });
  }

  getPage(e) {
    this.isLoading = true;
    this.pagingOption['offset'] = (e - 1) * (this.pagingOption['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagingOption.offset},
      relativeTo: this.route
    };
    this.router.navigate(['../to-me'], navigationExtras);
  }

  doViewThumbedProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

}
