import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';



import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {ProductMangementComponent} from './product-mangement.component';


// 定义产品管理嵌套路由
const childRoutes: Routes = [
  // 重定向路由
  {
    path: 'productlist',
    component: ProductListComponent
  },
  {
    path: 'error',
    component: ErrorCorrectComponent
  },
  {
    path: '**', redirectTo: 'productlist'
  }
];

const productRouters: Routes = [
  // 重定向路由

  {path: 'promange', component: ProductMangementComponent, children: childRoutes}
 ];

// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    RouterModule.forChild(productRouters)
  ],
  exports: [
    RouterModule
  ]
})

export class ProductRoutingModule {

}
