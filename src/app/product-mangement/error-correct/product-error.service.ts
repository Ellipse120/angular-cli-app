import {Injectable} from '@angular/core';
import {YslHttpService} from '../../core/ysl-http.service';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ProductErrorService {
  private apiPre= '';
  constructor(
        yslHttpService: YslHttpService,
        public http: Http
      ) {
      this.apiPre = yslHttpService.url;
  }

  list(params?): Observable<any> {
    return this.http.get(
      this.apiPre + 'api/product/errata',
      {
        params: params || {} ,
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      }
    ).map(resp => resp.json());
  }

  /**
   * 更新纠错处理状态：设为已处理或未处理
   * @param errataId
   *    纠错记录ID
   * @param status
   *    2表示未处理，3表示已处理
   * @returns {Observable<Response>}
   */
  status(errataId, status) {
    return this.http.put(
      this.apiPre + `api/product/errata/${errataId}/status/${status}`,
      null,
      {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    ).map(resp => resp.text());
  }


}
