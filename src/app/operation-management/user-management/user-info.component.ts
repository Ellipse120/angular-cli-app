import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {YslHttpService} from '../../core/ysl-http.service';
import { YslCommonService } from '../../core/ysl-common.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['../operation-management.component.css']
})
export class UserInfoComponent implements OnInit {

  showEdit = true;
  userInfo: any;
  constructor(private route: ActivatedRoute,
              private commonService: YslCommonService,
              private httpService: YslHttpService) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (!isNullOrUndefined(p['userId'])) {
        this.httpService.getUserInfo(p['userId'])
          .then(res => {
            this.userInfo = res;
            console.log('user', this.userInfo);
          }, error => {
            this.commonService.requestErrorHandle(error);
          });
      }
    });
  }

  // 修改用户信息
  editInfo() {
    this.showEdit = false;
  }

}
