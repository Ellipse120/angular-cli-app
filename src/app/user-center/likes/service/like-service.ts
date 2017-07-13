import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {YslHttpService} from '../../../core/ysl-http.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LikeService {

  constructor(
    private http: Http,
    private yslService: YslHttpService
  ) {

  }

  /**
   * 获取收藏列表
   * @param params
   * @returns {Observable<R>}
   */
  getLikeList(params: any): Observable<any> {
    return this.http.get(
      this.yslService.url + `api/product/${params.userId}/favorite`,
      {
        params
      }
    ).map(resp => resp.json());
  }

}
