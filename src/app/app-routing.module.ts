import {NgModule} from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {RouterModule,Routes, ActivatedRoute} from '@angular/router';


import {UserCenterComponent} from './user-center/user-center.component';
import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/deta-detail/data-detail.component';
import {RegisterComponent} from './register/register.component';
import {ProductMangementComponent} from './product-mangement/product-mangement.component';
import {ProductListComponent} from "./product-mangement/product-list/product-list.component";
import {ErrorCorrectComponent} from "./product-mangement/error-correct/error-correct.component";

// 定义嵌套路由
const childRoutes:Routes = [
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
    path: '**',redirectTo: 'productlist'
  }
];

// 定义普通路由
const appRouters:Routes = [
  // 重定向路由
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'datalist', component: DatalistComponent},
  {path: 'usercenter', component: UserCenterComponent},
  {path: 'datadetail/:id', component: DataDetailComponent},
  {path:'register',component: RegisterComponent},
  {path:'promange',component:ProductMangementComponent, children: childRoutes},

  {path: '**', component: IndexComponent}
]
// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    RouterModule.forRoot(appRouters)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: LocationStrategy ,useClass: HashLocationStrategy }
  ]
})

export class AppRoutingModule {

}
