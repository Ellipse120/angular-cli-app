import { Component, OnInit } from '@angular/core';
import {MyServiceService} from "../app.service";
import {DataType} from "../data-type";

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {


  state=false;
  num:number=0;
  count:number=384354;
  dataList:DataType;
  typeList=[
    {text:'时间分类',children:[
      {text:'时间不限'},
      {text:'2016-2017年'},
      {text:'2015-2016年'},
      {text:'2014-2015年'}
    ]},
    {text:'按照关系排序',children:[
      {text:'从大到小'},
      {text:'从小到大'},
      {text:'按价格'},
      {text:'按名称'}
    ]},
    {text:'按照特点排序'}
  ];

  constructor(public service:MyServiceService){
    //this.dataList=this.service.getList();
    this.getData();
  }

  //二级菜单
  showMenu(i){
    this.state=!this.state;
    this.num=i;
    console.log(this.num);
  }

  //获取数据
  getData():void{
    this.service
        .getList()
        //.then((function(data){this.dataList=data}))
        .then(dataList =>{
          this.dataList = dataList;
          console.log(this.dataList);
        })

  }
  ngOnInit() {

  }

}
