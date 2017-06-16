/**
 * Created by Lusai on 6/13/17.
 */

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class ProductListService {

  private productConstant = {
    productListApi: 'http://localhost:1337/ysl.dev.cjzc.net.cn/ysl-ws/api/product'
  };

  constructor(private http: Http) {
  }

  getProductList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.productConstant.productListApi)
        .toPromise()
        .then(res => resolve(res.json()))
        .catch(this.handleError)
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.productConstant.productListApi);

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
