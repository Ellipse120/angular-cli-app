import { Component, OnInit } from '@angular/core';
import {LikeService} from './service/like-service';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../../core/ysl-http.service';
import {NavigationExtras, Router, ActivatedRoute} from '@angular/router';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.component.html',
  styleUrls: ['./like-list.component.css']
})
export class LikeListComponent implements OnInit {

  userInfo: any;
  items = [];
  pagination = {
    offset: 0, limit: 5
  };
  totalLength: any;
  currPage: any;
  constructor(private likeService: LikeService,
              private yslHttpService: YslHttpService,
              private cookie: CookieService,
              private commonService: YslCommonService,
              private router: Router,
              private route: ActivatedRoute
      ) { }

  ngOnInit() {
    this.userInfo = this.cookie.getObject('yslUserInfo');
    this.getLikes();
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.pagination.offset = param['offset'] ? param['offset'] : 0;
        this.currPage = param['offset'] ? ((param['offset'] / this.pagination['limit']) + 1) : 1;
        this.getLikes();
      });
  }

  getLikes() {
    this.likeService.favoriteList({
      userId: this.userInfo.id,
      offset: this.pagination.offset,
      limit: this.pagination.limit
    }).subscribe(data => {
      if ( data['totalLength'] > 0) {
        this.items = data.items;
        this.totalLength = data['totalLength'];
        this.items.forEach(item => {
          item.createdOn = this.commonService.getDateForDay(item.createdOn);
        });
        if (this.pagination.offset >= 5) {      // 当前页收藏删完回到上一页
          if (!data['items'].length) {
            this.pagination['offset'] = (this.currPage - 2) * (this.pagination['limit']);
            const navigationExtras: NavigationExtras = {
              queryParams: {offset: this.pagination.offset}
            };
            this.router.navigate(['userCenter/likes/list'], navigationExtras);
          }
        }
      } else {
        this.items = [];
      }
    }, error => {
      this.commonService.loginTimeout(error);
    });
  }

  deleteFavorite(item) {
    this.yslHttpService.updateFavorite({
      favorite: false,
      userId:  this.userInfo.id,
      productId: item.id
    }).subscribe(() => {
        this.getLikes();
    });
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.id}]);
  }

  // 下一页
  toNextPage(e) {
    this.pagination['offset'] = (e - 1) * (this.pagination['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagination.offset}
    };
    this.router.navigate(['userCenter/likes/list'], navigationExtras);
  }
}
