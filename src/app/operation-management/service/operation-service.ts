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

  // 当前在线用户数
  currentOnlineAmountStats(): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/stats/onlineuser')
      .map(res => res.json());
  }

  // 在线用户数
  OnlineAmountStats(type, option): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/stats/onlineuser/' + type, {params: option})
      .map(res => res.json());
  }

  // 热词排行

  // 点击查看排行
  getHotProducts() {
    return this.http.get(this.httpService.url + 'api/product/hot')
      .map(res => res.json());
  }

  // 注册统计
  signupAmountStats(type, option): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/stats/signupuser/' + type, {params: option})
      .map(res => res.json());
  }

  // 产品统计
  productAmountStats(type, option): Observable<any> {
    return this.http.get(this.httpService.url + 'api/operation/stats/product/' + type, {params: option})
      .map(res => res.json());
  }

}
