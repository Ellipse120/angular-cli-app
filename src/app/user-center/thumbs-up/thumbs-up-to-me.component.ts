import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
  page = 1;
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
              private router: Router) {
    this.userId = this.cookie.getObject('yslUserInfo')['id'];
    this.getThumbsToMe();
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
    this.page = e;
    this.pagingOption.offset = (e - 1 ) * 10;
    this.pagingOption.userId = this.userId;
    this.getThumbsToMe();
  }

  doViewThumbedProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

  ngOnInit() {
  }

}
