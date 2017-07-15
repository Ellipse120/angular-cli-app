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
   * get favorite list
   * @param params
   *    {
   *        userId,
   *        offset,
   *        limit,
   *        sortBy,
   *        ascending:boolean
   *    }
   * @returns {Observable<R>}
   */
  favoriteList(params): Observable<any> {
    const api = `api/product/${params.userId}/favorite/list`;

    return this.http.get(this.yslService.url + api, {
      params: params
    }).map( resp => resp.json());
  }
}
