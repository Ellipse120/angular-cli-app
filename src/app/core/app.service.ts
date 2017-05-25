import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise'

// 此处的@Injectable是一个装饰器
@Injectable()
export class MyServiceService {

  private dataListUrl = './assets/data/';

  //private url = 'http://ysl.dev.cjzc.net.cn/' ;
  // private url = 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/' ;
  private url = 'http://localhost:1337/192.168.19.12:8085/';

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

  //通过标签获取数据
  getTagDimensions():Promise<any>{
    //var headers = new Headers({ 'Content-Type': 'application/json' });
    //var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      this.http.get(this.url + 'api/tag/dimension/hierarchy')
          .toPromise()
          .then(response => resolve(response.json()))
    })
  }

  // 获得用户列表
  getUser():Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'userList.json')
        .toPromise()
        .then(response => resolve(response.json()))
    })
  }

  // 获得数据列表
  getList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'list.json')
        .toPromise()
        .then(response =>resolve(response.json()))
    });
  }

  // 获得产品数据列表
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/productlist.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    }

    req.send();
  }

  // 获得纠错信息数据
  getError(callback) {
    const req = new XMLHttpRequest();
    req.open('GET',`assets/data/error.json`);
    req.onload = () => {
      callback(JSON.parse(req.response));
    }

    req.send();
  }

  getErrorData(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'error.json')
      .toPromise()
      .then(response => resolve(response.json()))
    }

    )
  }
  // 获得用户信息
  getUserInfo(): Promise<any> {
    return Promise.resolve(this.user);
  }

  // 产品--关键字搜索
  productKeywordSearch(options): Promise<any> {
    return new Promise((resolve,reject) => {
      this.http.get(this.url + 'api/product/search?keyword=' + options.keyword + '&offset=' + options.offset  + '&limit=' + options.limit + '&sortBy=' + options.sortBy + '&ascending=' + options.ascending)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
      })
  }

  // 产品--详情
  getProductDetail(projectId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/' + projectId)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 注册
  userRegister(mail: string): Promise<any> {
    return new Promise((resolve,reject) => {
      this.http.post(this.url + 'api/user/signup', {contactMail: mail, userType: 1, loginId: 'CB1'})
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 运营中心/用户管理/获取用户列表
  getUserList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/user/userList')
        .toPromise()
        .then(response => resolve(response.json()))
    })
  }
}
