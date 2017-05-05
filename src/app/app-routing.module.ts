import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router'
import {IndexComponent} from "./index/index.component";
import {DatalistComponent} from "./datalist/datalist.component";

const appRouters:Routes=[
  {path:'index',component:IndexComponent},
  {path:'datalist',component:DatalistComponent},
  //重定向路由
  {path:'',redirectTo:'/index',pathMatch:'full'},
  {path:'**',component:IndexComponent}
]
//@NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule ({
  imports:[
    RouterModule.forRoot(appRouters)
  ],
  exports:[
    RouterModule
  ]
})

export class AppRoutingModule{}
