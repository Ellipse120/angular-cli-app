import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {YslHttpService} from'../../core/ysl-http.service';

@Injectable()
export class OperationService {

  constructor(private http: Http, private httpService: YslHttpService) {}

  // 用户状态激活/禁用
  changeUserStatus(userId, newStatus): Observable<any> {
    return this.http.put(this.httpService.url + 'api/user/' + userId + '/status/' + newStatus, {}, {
      headers: new Headers({
        'Content-type': 'application/json'
      }),
      withCredentials: true
    })
      .map(res => res);
  }

  // 在线用户数
  getOnlineUserCount(type, option): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/status/onlineuser/' + type, {params: option})
      .map(res => res.json());
  }

  // 热词排行

  // 点击查看排行

  // 注册统计
  signupUserCount(type, option): Observable<any> {
    return this.http.get(this.httpService.url + 'api/stats/signupuser/' + type, {params: option})
      .map(res => res.json());
  }

  // 产品统计
  getProvisionSummary(): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/provision/summary')
      .map(res => res.json());
  }
}
