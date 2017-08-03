import { Component, OnInit } from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {YslCommonService} from '../../core/ysl-common.service';
import {NavigationExtras, Router, ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentListComponent implements OnInit {

  userId: any;
  comments = {items: []};
  pagination = {
    offset: 0, limit: 5
  };
  currPage: any;
  averageScore: Array<any>;
  constructor(private httpService: YslHttpService,
              private cookie: CookieService,
              private commonService: YslCommonService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.averageScore = Array(5).fill(1).map((x, i) => i);
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.currPage = param['offset'] ? ((param['offset'] / this.pagination['limit']) + 1) : 1;
        this.getCommentToMe();
      });
  }

  // 获取评论列表
  getCommentToMe() {
    if (!this.userId) { return; }
    const options = {userId: this.userId, offset: this.pagination.offset, limit: this.pagination.limit};
    this.httpService.getCommentToMe(options)
      .then(res => {
        this.comments = res;
        if (!isNullOrUndefined(this.comments['items']) && this.comments['items'].length) {
          this.comments['items'].forEach(item => {
            item.createdOn = this.commonService.getDateForDay(item.createdOn);
          });
        }

        // 当前页评论删完回到上一页
        if (this.pagination.offset >= 5) {
          if (!res['items'].length) {
            console.log('offset', this.pagination.offset, this.pagination['offset']);
            this.pagination['offset'] = (this.currPage - 2) * (this.pagination['limit']);
            const navigationExtras: NavigationExtras = {
              queryParams: {offset: this.pagination.offset}
            };
            this.router.navigate(['userCenter/comment/list'], navigationExtras);
          }
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 分页
  toNextPage(e) {
    this.pagination['offset'] = (e - 1) * (this.pagination['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagination.offset}
    };
    this.router.navigate(['userCenter/comment/list'], navigationExtras);
  }
}
