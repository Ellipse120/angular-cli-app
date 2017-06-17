/**
 * Created by Lusai on 6/13/17.
 */

import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class ProductListService {

  private productConstant = {
    listApi: 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/api/product',
    importApi: 'http://localhost:1337/192.168.19.20:8080/ysl-ws/api/product'
  };

  constructor(private http: Http) {
  }

  getProductList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.productConstant.listApi)
        .toPromise()
        .then(res => resolve(res.json()))
        .catch(this.handleError)
    });
  }

  doProductImport(option) {
    return new Promise((resolve, reject) => {
      this.http.post(this.productConstant.listApi, option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(res => resolve(res.json()), error => reject(error))
    })
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.productConstant.listApi);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  private handleError(error: any): Promise<any> {
    console.log('an error occurred.' + error);
    return Promise.reject(error.message || error);
  }

}
