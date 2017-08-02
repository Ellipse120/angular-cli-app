import {Component, OnInit} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {NavigationExtras, Router, ActivatedRoute} from '@angular/router';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  selector: 'app-thumbs-up-by-me',
  templateUrl: './thumbs-up-by-me.component.html',
  styleUrls: ['./thumbs-up-by-me.component.css']
})
export class ThumbsUpByMeComponent implements OnInit {

  userId: number;
  thumbs = [];
  totalThumbsNum: number;
  isLoading: boolean;
  pagingOption = {
    userId: 0,
    limit: 10,
    offset: 0,
    sortBy: '',
    ascending: true
  };
  page: any;

  constructor(private yslHttpService: YslHttpService,
              private commonService: YslCommonService,
              private cookie: CookieService,
              private router: Router,
              private route: ActivatedRoute) {}

  getThumbsByMe() {
    this.pagingOption.userId = this.userId;
    this.yslHttpService.getThumbsUpByMe(this.pagingOption)
      .then((data) => {
        this.totalThumbsNum = data.totalLength;
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
    this.router.navigate(['../by-me'], navigationExtras);
  }

  doViewThumbProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);

  }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo')['id'];
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.page = param['offset'] ? ((param['offset'] / this.pagingOption['limit']) + 1) : 1;
        this.pagingOption['offset'] = param['offset'];
        this.getThumbsByMe();
      });
  }

}
