import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MyServiceService} from '../../core/app.service';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {


  state = false;
  num: number;
  numc: number = 0;
  count: number = 384354;
  keywordOptions;
  product = {};
  typeList = [
    {
      text: '时间分类', children: [
      {text: '时间不限'},
      {text: '2016-2017年'},
      {text: '2015-2016年'},
      {text: '2014-2015年'}
    ]
    },
    {
      text: '按照关系排序', children: [
      {text: '从大到小'},
      {text: '从小到大'},
      {text: '按价格'},
      {text: '按名称'}
    ]
    },
    {text: '按照特点排序'}
  ];

  constructor(public service: MyServiceService, public route: ActivatedRoute, public router: Router) {
    this.keywordOptions = this.route.params;
    this.getProjectList();
    // this.getData();
  }

  // 二级菜单
  showMenu(i) {
    this.num = i;
  }

  showSecondMenu(i) {
    this.numc = i;
  }
  // 获取数据
  // getData(): void {
  //   this.service
  //     .getList()
  //     // .then((function(data){this.dataList=data}))
  //     .then(dataList => {
  //       this.productList = dataList;
  //       console.log(this.productList);
  //     })
  //
  // }

  ngOnInit() {

  }

  getProjectList() {
    this.service.productKeywordSearch(this.keywordOptions.value)
      .then(res => {
        this.product = res
      })
  }

  gotoProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.productId}])
  }

}
