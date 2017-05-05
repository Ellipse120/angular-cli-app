import {Injectable} from '@angular/core';
//import {InMemoryDataService} from "./in-memory-data.service";
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise'
import {DataType} from "./data-type";

//此处的@Injectable是一个装饰器
@Injectable()
export class MyServiceService {

  private dataListUrl='../assets/data/';
  dataList=[
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'手动阀是否个发挥功能空间点发货速度快公布收到分公司的好看更合适的恐惧感深度国际开发收到货分公司'},
    {title:'万里春风',content:'水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守' +
    '法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低首付好的话风格还是对哦你' +
    '水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公' +
    '守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低发过的发水电费坚实的发动机开发商东方生栋覆屋我哦能发的贷款' +
    '水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低水电费客户第三方公司电话奉公守法低纠纷 的福建省地方很多事水电费关' +
    '键是得分后卫'},
  ]

  constructor(public http:Http){}
  //获得数据列表
  getList():Promise<any>{
    return Promise.resolve(this.dataList as DataType[]);
    //return this.http.get(this.dataListUrl+'list.json')
    //.toPromise()
    //.then(response => response.json().data as DataType[])
    //.catch(this.handleError);
   //return this.http.get(this.dataListUrl + "list.json");
  }

  private handleError(error:any):Promise<any>{
    console.error('An error occurred',error);
    return Promise.reject(error.message || error);
  }
}
