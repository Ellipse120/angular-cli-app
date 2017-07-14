import {Component, OnInit} from '@angular/core';
import {YslHttpService} from "../../core/ysl-http.service";
import {CookieService} from "ngx-cookie";
import {Router} from "@angular/router";

@Component({
  selector: 'app-thumbs-up-by-me',
  templateUrl: './thumbs-up-by-me.component.html',
  styleUrls: ['./thumbs-up-by-me.component.css']
})
export class ThumbsUpByMeComponent implements OnInit {

  userId: number;
  thumbs = [];
  totalThumbsNum: number;
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
              private cookie: CookieService,
              private router: Router,) {
    this.userId = this.cookie.get('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
    this.getThumbsByMe();
  }

  getThumbsByMe() {
    this.pagingOption.userId = this.userId;
    this.yslHttpService.getThumbsUpByMe(this.pagingOption)
      .then((data) => {
        this.totalThumbsNum = data.totalLength;
        this.thumbs = data.items;
        console.log(data);
      });
  }

  getPage(e) {
    this.isLoading = true;
    this.page = e;
    this.pagingOption.offset = (e - 1 ) * 10;
    this.pagingOption.userId = this.userId;
    this.getThumbsByMe();
  }

  doViewThumbProductDetail(item) {
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

  ngOnInit() {
  }

}
