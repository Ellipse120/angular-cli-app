import { Component, OnInit } from '@angular/core';
import {LikeService} from './service/like-service';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.component.html',
  styleUrls: ['./like-list.component.css']
})
export class LikeListComponent implements OnInit {

  userInfo: any;
  likes = [];
  constructor(private likeService: LikeService,
              private cookie: CookieService,
      ) { }

  ngOnInit() {
    this.userInfo = this.cookie.getObject('yslUserInfo');
    console.log('userInfo:', this.userInfo);
    this.getLikes();
  }

  getLikes() {
    this.likeService.getLikeList({
      userId: this.userInfo.id,
      offset: 0,
      limit: 10
    }).subscribe(data => {
      console.log('data:', data);
    });
  }

}
