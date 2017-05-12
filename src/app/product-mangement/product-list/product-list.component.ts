import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit{
  proList = [
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'},
    {proName:'wind万得资讯数据终端',userName:'王明',userType:'已注册未认证用户',isMoney:'是',state:'进行中',updateTime:'207-03-23'}
  ]

  ngOnInit() {}
}
