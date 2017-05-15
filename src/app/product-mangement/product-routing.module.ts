import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';


import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {ProductMangementComponent} from "./product-mangement.component";



//const childRoutes:Routes = [
//  // 重定向路由
//  //{path: '', redirectTo: '/promange', pathMatch: 'full'},
//  {
//    path: 'promange',
//    component: ProductMangementComponent,
//    children: [
//      {
//        path: 'productlist',
//        component: ProductListComponent
//      },
//      {
//        path: 'error',
//        component: ErrorCorrectComponent
//      }
//    ]
//  }
//]
// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    //RouterModule.forChild(childRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ProductRoutingModule {

}
