import { Component, OnInit } from '@angular/core';
import {LikeService} from './service/like-service';
import {CookieService} from 'ngx-cookie';
import {YslHttpService} from '../../core/ysl-http.service';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.component.html',
  styleUrls: ['./like-list.component.css']
})
export class LikeListComponent implements OnInit {

  userInfo: any;
  items = [];
  constructor(private likeService: LikeService,
              private yslHttpService: YslHttpService,
              private cookie: CookieService,
      ) { }

  ngOnInit() {
    this.userInfo = this.cookie.getObject('yslUserInfo');
    console.log('userInfo:', this.userInfo);
    this.getLikes();
  }

  getLikes() {
    this.likeService.favoriteList({
      userId: this.userInfo.id,
      offset: 0,
      limit: 10
    }).subscribe(data => {
      console.log('data:', data);
      if ( data['totalLength'] > 0) {
        this.items = data.items;
      } else {
        this.items = [];
      }
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
}
