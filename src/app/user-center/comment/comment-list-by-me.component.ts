import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../../core/ysl-http.service';
import {YslCommonService} from '../../core/ysl-common.service';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {MdDialog, MdSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from '../../core/commons/confirm-dialog.component';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-comment-list-by-me',
  templateUrl: './comment-list-by-me.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentListByMeComponent implements OnInit {

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
              private router: Router,
              public snackBar: MdSnackBar,
              private dialog: MdDialog) { }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.averageScore = Array(5).fill(1).map((x, i) => i);
    this.route.queryParams
      .subscribe((params) => {
        const param = Object.assign({}, params);
        this.pagination.offset = param['offset'] ? param['offset'] : 0;
        this.currPage = param['offset'] ? ((param['offset'] / this.pagination['limit']) + 1) : 1;
        this.getCommentToMe();
      });
  }

  // 获取评论列表
  getCommentToMe() {
    if (!this.userId) { return; }
    const options = {userId: this.userId, offset: this.pagination.offset, limit: this.pagination.limit};
    this.httpService.getCommentByMe(options)
      .then(res => {
        this.comments = res;
        if (!isNullOrUndefined(this.comments['items']) && this.comments['items'].length) {
          this.comments['items'].forEach(item => {
            item.createdOn = this.commonService.getDateForDay(item.createdOn);
            item.averageScore = item.scoreOnTimeliness ? ((item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity) / 4).toFixed(1) : 0;
          });
        }

        // 当前页评论删完回到上一页
        if (this.pagination.offset >= 5) {
          if (!res['items'].length) {
            this.pagination['offset'] = (this.currPage - 2) * (this.pagination['limit']);
            const navigationExtras: NavigationExtras = {
              queryParams: {offset: this.pagination.offset}
            };
            this.router.navigate(['userCenter/comment/list-by-me'], navigationExtras);
          }
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }
  // 删除评论
  deleteMyComment(comment) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '确认删除评论？'
      }
    }).afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.httpService.deleteMyComment(comment.id)
          .then(res => {
            this.getCommentToMe();
            this.snackBar.open('评论删除成功', '', {
              duration: 3000,
              extraClasses: ['ysl-snack-bar']
            });
          });
      }
    });
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}]);
  }

  // 下一页
  toNextPage(e) {
    this.pagination['offset'] = (e - 1) * (this.pagination['limit']);
    const navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagination.offset}
    };
    this.router.navigate(['userCenter/comment/list-by-me'], navigationExtras);
  }
}
