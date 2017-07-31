import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {reject} from 'q';
import {Observable} from 'rxjs/Observable';
// import reject = Q.reject;

// 此处的@Injectable是一个装饰器
@Injectable()
export class YslHttpService {

  private dataListUrl = './assets/data/';

  // public url = 'http://ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://192.168.19.11:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://192.168.14.17:1337/192.168.9.70:8080/ysl-ws/';
  public url = 'http://192.168.14.17:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://192.168.14.17:1337/192.168.9.96:8080/ysl-ws/';
  // public url = 'http://192.168.14.17:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
  // public url = 'http://192.168.14.14:1337/ysl.dev.cjzc.net.cn/ysl-ws/';
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
        .then(response => resolve(response.json()));
    });
  }

  // 获取标签
  getTagDimensions(): Promise<any> {
    // var headers = new Headers({ 'Content-Type': 'application/json' });
    // var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      this.http.get(this.url + 'api/tag/dimension/hierarchy')
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 获得用户列表
  getUser(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'userList.json')
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 获得数据列表
  getList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.dataListUrl + 'list.json')
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 获得产品数据列表
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/productlist.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  // 获得纠错信息数据
  getError(callback) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/error.json');
    req.onload = () => {
      callback(JSON.parse(req.response));
    };

    req.send();
  }

  getErrorData(): Promise<any> {
    return new Promise(resolve => {
        this.http.get(this.dataListUrl + 'error.json')
          .toPromise()
          .then(response => resolve(response.json()));
      }
    );

  }

  // 获得用户信息
  // getUserList(): Promise<any> {
  //   return Promise.resolve(this.user);
  // }

  // 注册
  userRegister(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/user/signup/checksmscode', option)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 登录
  userLogin(user): Promise<any> {
    const data = JSON.stringify(user);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/authentication/login', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
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
        .then(response => resolve(response), error => reject(error));
    });
  }

  // 获取高级搜索字段
  getAdvancedSearchInfo() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/dict/data_category,data_source,data_collection,data_service')
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 产品--搜索
  productKeywordSearch(options): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/search', {
        params: options
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 产品--详情
  getProductDetail(productId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/' + productId)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 获取用户是否点赞收藏/userproperties/{productId}/{userId}
  getProductUserProp(productId, userId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/userproperties/' + productId + '/' + userId, {withCredentials: true})
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 样本下载
  downloadSampleFile(sampleFilePath) {
    return new Promise((resolve, reject) => {
      // this.http.get(this.url + 'api/product/' + productId + '/file/content')
      this.http.get(this.url + 'api/file/' + sampleFilePath + '/download')
        .toPromise()
        .then(response => resolve(response), error => reject(error));
    });
  }

  // 获取相关产品
  getRelatedProducts(option) {
    // type: tag, organization
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/related/' + option.type + '/' + option.productId)
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 产品点赞
  createProductFavor(option) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(option.data);
      this.http.post(this.url + 'api/product/' + option.productId + '/favor/' + option.status, data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 产品纠错
  createProductErrata(option): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(option.data);
      this.http.post(this.url + 'api/product/' + option.productId + '/errata', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  // 产品评价
  addProductComment(option): Promise<any> {
    const data = JSON.stringify(option.data);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'api/product/' + option.productId + '/comment', data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response.json()), err => reject(err));
    });
  }

  // 获取产品评论
  getProductComment(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/' + option.productId + '/comment', {params: option.data})
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 个人中心
  // 获取个人信息
  getUserInfo(userId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/user/' + userId)
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 编辑信息
  updateUser(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'api/user/' + option.id, option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(), error => reject());
    });
  }

  // 修改密码
  updatePass(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'api/user/' + option.userId + '/passcode', option.data, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(response), error => reject(error));
    });
  }

  // 个人中心/认证/手机验证码
  getValidateCode(phone) {
    return new Promise((resolve, reject) => {
      // this.http.get(this.url + 'api/authentication/sms', {params: {phone: phone}})
      this.http.get(this.url + 'api/user/signup/' + phone)
        .toPromise()
        .then(res => resolve(res), error => reject(error));
    });
  }

  // 个人中心/认证/个人
  verifyIndividual(option) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'api/user/individual/verify', option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(), error => reject());
    });
  }

  // 个人中心/认证/组织
  verifyOrganization(option) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'api/user/organization/verify', option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(response => resolve(), error => reject());
    });
  }

  // 个人中心/评论我的
  getCommentToMe(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/commented/' + option.userId, {params: option})
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 个人中心/我评论的
  getCommentByMe(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/comment/' + option.userId, {params: option})
        .toPromise()
        .then(response => resolve(response.json()));
    });
  }

  // 个人中心/删除评价
  deleteMyComment(commentId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.url + 'api/product/comment/' + commentId)
        .toPromise()
        .then(response => resolve(response));
    });
  }


  // 运营中心/用户管理/获取用户列表
  getUserList(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/user', {params: option})
        .toPromise()
        .then(response => resolve(response.json()), error => reject(error));
    });
  }

  /*
  * 我赞过的产品列表API
  */
  getThumbsUpByMe(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/favor/list/' + option.userId, {
        params: option
      })
        .toPromise()
        .then(res => resolve(res.json()));
    });
  }

  /*
  * 产品收到的赞列表API
  */
  getThumbsToMe(option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'api/product/favored/list/' + option.userId, {
        params: option
      })
        .toPromise()
        .then(res => resolve(res.json()));
    });
  }

  /**
   * udate favorite status
   * @param params
   * @returns {Observable<R>}
   */
  updateFavorite(params): Observable<any> {
    let api = `api/product/${params.productId}/favorite`;
    if (!params.favorite) {
      api = `api/product/${params.productId}/favorite/${params.userId}`;
      return this.http.delete(this.url + api);
    }

    return this.http.post(this.url + api, {
      userId: params['userId']
    })
      .map(resp => resp.json());
  }


}
