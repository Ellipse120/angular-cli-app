import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise'

// 此处的@Injectable是一个装饰器
@Injectable()
export class MyServiceService {

  private dataListUrl = './assets/data/';

  // 用户信息
  user = {
    count: '123@qq.com',
    username: 'wangming',
    truename: '王明',
    sex: '男',
    birthday: '1996-3-14',
    address: '上海',
    phone: 1234254325,
    job: 'web',
    logintime: '2017.03.05'
  };

  constructor(public http: Http) {
  }

  // 获得数据列表
  getList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'list.json')
        .toPromise()
        .then(response =>resolve(response.json()))
    });
  }

  // 获得用户信息
  getUserInfo(): Promise<any> {
    return Promise.resolve(this.user);
  }
}
