/**
 * Created by Lusai on 6/13/17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {YslHttpService} from '../../core/ysl-http.service';
import {CookieService} from 'ngx-cookie';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import {YslCommonService} from '../../core/ysl-common.service';

@Injectable()
export class ProductListService {

  private productConstant = {
    devApi: 'http://localhost:1337/192.168.19.20:8080/ysl-ws/api/product'
  };
  userId: any;
  str = 'test';

  constructor(private http: Http,
              private yslHttpservice: YslHttpService,
              private commonService: YslCommonService,
              private cookie: CookieService) {
    this.userId = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['id'] : undefined;
  }

  // 个人中心产品列表
  getProductList(option): Promise<any> {
    return new Promise(resolve => {
      if (!isNullOrUndefined(this.userId)) {
        this.http.get(this.yslHttpservice.url + 'api/product', {
          params: option,
          withCredentials: true
        })
          .toPromise()
          .then(res => resolve(res.json()))
          .catch(this.handleError);
      }
    });
  }

  // 产品管理产品列表
  getOperateProductList(option): Observable<any> {
    return this.http.get(this.yslHttpservice.url + 'api/product', {params: option, withCredentials: true})
      .map(res => res.json());
  }

  getProductDetail(productId): Observable<any> {
    return this.http.get(this.yslHttpservice.url + 'api/product/' + productId + '?viewCount=1')
      .map(res => res.json());
  }

  doProductImport(option) {
    return new Promise((resolve, reject) => {
      this.http.post(this.yslHttpservice.url + 'api/product', option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(res => resolve(res.json()), (error) => reject(error));
    });
  }

  doProductUpdate(option) {
    return new Promise((resolve, reject) => {
      this.http.put(this.yslHttpservice.url + 'api/product/' + option.productId, option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        }), withCredentials: true
      })
        .toPromise()
        .then(res => resolve(res), error => reject(error));
    });
  }

  doChangeStatus(productId, newStatus) {
    return new Promise((resolve, reject) => {
      this.http.put(this.yslHttpservice.url + 'api/product/' + productId + '/status/' + newStatus, {}, {
        headers: new Headers({
          'Content-type': 'application/json'
        }),
        withCredentials: true
      })
        .toPromise()
        .then(res => resolve(res), error => reject(error));
    });
  }

  private handleError(error: any): Promise<any> {
    console.log('an error occurred:', error);
    this.commonService.requestErrorHandle(error);

    return Promise.reject(error.message || error);
  }

}
