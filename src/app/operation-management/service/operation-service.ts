import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {YslHttpService} from'../../core/ysl-http.service';

@Injectable()
export class OperationService {
  constructor(private http: Http, private httpService: YslHttpService) {}

  changeUserStatus(userId, newStatus): Observable<any> {
    return this.http.put(this.httpService.url + 'api/user/' + userId + '/status/' + newStatus, {}, {
      headers: new Headers({
        'Content-type': 'application/json'
      }),
      withCredentials: true
    })
      .map(res => res);
  }
}
