import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise'
// import reject = Q.reject;

// 此处的@Injectable是一个装饰器
@Injectable()
export class YslHttpService {

  private dataListUrl = './assets/data/';

  //private url = 'http://ysl.dev.cjzc.net.cn/' ;
  private url = 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/' ;
  // private url = 'http://localhost:1337/192.168.19.20:8080/ysl-ws/';
  // REPLACE

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

  // index
  // 获取供应商数量、可用产品产品
  getIndexQuantity() {
    return new Promise(resolve => {
      this.http.get(this.url + 'api/operation/provision/summary')
        .toPromise()
        .then(response => resolve(response.json()))
    })
  }

  // 获取标签
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

  // 注册
  userRegister(mail: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/user/signup', {contactMail: mail, userType: 1, loginId: mail})
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 登录
  userLogin(user): Promise<any> {
    let data = JSON.stringify(user);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/authentication/login', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 退出
  logout(token) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/authentication/logout', {
        headers: new Headers({
          'token': token
        })
      })
        .toPromise()
        .then(response => resolve(response), error => reject(error))
    })
  }

  // 获取高级搜索字段
  getAdvancedSearchInfo() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/dict/data_category,data_source,data_collection,data_service')
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 产品--搜索
  productKeywordSearch(options): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/search', {
        params: options
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
      })
  }

  // 产品--详情
  getProductDetail(productId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/' + productId)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 样本下载
  downloadSampleFile(productId) {
  return new Promise((resolve, reject) => {
    this.http.get(this.url + 'api/product/' + productId +'/file/content')
      .toPromise()
      .then(response => resolve(response.json()), error => reject(error))
  })
  }

  // 产品纠错
  createProductErrata(option):Promise<any> {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify(option.data);
      this.http.post(this.url + 'api/product/' + option.productId + '/errata', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error))
    })
  }

  // 产品评价
  addProductComment(option): Promise<any> {
    let data = JSON.stringify(option.data);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/product/' + option.productId + '/comment', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()))
    })
  }

  // 获取产品评论
  getProductComment(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/' + option.productId + '/comment')
        .toPromise()
        .then(response => resolve(response.json()))
    })
  }

  // 个人中心

  // 编辑信息
  updateUser(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'api/user/' + option.userId, option.data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()))
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
