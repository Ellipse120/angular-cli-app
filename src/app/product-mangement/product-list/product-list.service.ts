/**
 * Created by Lusai on 6/13/17.
 */
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {YslHttpService} from "../../core/ysl-http.service";

@Injectable()
export class ProductListService {

  private productConstant = {
    devApi: 'http://localhost:1337/192.168.19.20:8080/ysl-ws/api/product'
  };

  constructor(private http: Http, private yslHttpservice: YslHttpService) {
  }

  getProductList(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.yslHttpservice.url + 'api/product')
        .toPromise()
        .then(res => resolve(res.json()))
        .catch(this.handleError)
    });
  }

  doProductImport(option) {
    return new Promise((resolve, reject) => {
      this.http.post(this.yslHttpservice.url + 'api/product', option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(res => resolve(res.json()), error => reject(error))
    })
  }

  doProductUpdate(option) {
    return new Promise((resolve, reject) => {
      this.http.put(this.yslHttpservice.url + 'api/product/' + option.productId, option, {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .toPromise()
        .then(res => resolve(res), error => reject(error))
    })
  }

  private handleError(error: any): Promise<any> {
    console.log('an error occurred.' + error);
    return Promise.reject(error.message || error);
  }

}
