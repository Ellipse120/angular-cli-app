import {Injectable} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
/**
 * Created by liangdi on 6/23/17.
 */

@Injectable()
export class ProductService {
  api = '';
  constructor(private service: YslHttpService, private http: Http) {
    this.api = this.service.url + 'api/product';
  }


  get(productId): Observable<any> {
    return this.http.get(this.api + `/${productId}`)
      .map(resp => resp.json());
  }
}
