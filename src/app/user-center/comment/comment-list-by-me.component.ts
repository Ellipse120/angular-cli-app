import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie";
import {YslHttpService} from "../../core/ysl-http.service";
import {YslCommonService} from "../../core/ysl-common.service";
import {Router, ActivatedRoute, NavigationExtras} from "@angular/router";
import {MdSnackBar} from "@angular/material";

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
              public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.averageScore = Array(5).fill(1).map((x, i) => i);
    this.route.queryParams
      .subscribe((params) => {
        let param = Object.assign({}, params);
        this.pagination.offset = param['offset'] ? param['offset'] : 0;
        this.currPage = param['offset'] ? ((param['offset']/this.pagination['limit']) + 1) : 1;
        this.getCommentToMe();
      });
  }

  // 获取评论列表
  getCommentToMe() {
    if (!this.userId) { return };
    let options = {userId: this.userId, offset: this.pagination.offset, limit: this.pagination.limit};
    this.httpService.getCommentByMe(options)
      .then(res => {
        this.comments = res;
        this.comments['items'].forEach(item => {
          item.createdOn = this.commonService.getDateForDay(item.createdOn);
          item.averageScore = item.scoreOnTimeliness ? ((item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity)/4).toFixed(1) : 0;
        });

        if (this.pagination.offset >= 5) {
          if (!res['items'].length) {
            console.log('offset', this.pagination.offset, this.pagination['offset'])
            this.pagination['offset'] = (this.currPage - 2) * (this.pagination['limit']);
            let navigationExtras: NavigationExtras = {
              queryParams: {offset: this.pagination.offset}
            };
            this.router.navigate(['userCenter/comment/list-by-me'], navigationExtras);
          }
        }
      });
  }

  // 删除评论
  deleteMyComment(comment) {
    this.httpService.deleteMyComment(comment.id)
      .then(res => {
        this.getCommentToMe();
        this.snackBar.open('评论删除成功', '', {
          duration: 3000
        });
      });
  }

  // 下一页
  toNextPage(e) {
    this.pagination['offset'] = (e - 1) * (this.pagination['limit']);
    let navigationExtras: NavigationExtras = {
      queryParams: {offset: this.pagination.offset}
    }
    this.router.navigate(['userCenter/comment/list-by-me'], navigationExtras);
  }
}
