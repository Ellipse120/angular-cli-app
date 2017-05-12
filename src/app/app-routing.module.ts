import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {UserCenterComponent} from './user-center/user-center.component';
import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/deta-detail/data-detail.component';
import {RegisterComponent} from "./register/register.component";
import {ProductMangementComponent} from "./product-mangement/product-mangement.component";

const appRouters:Routes = [
  {path: 'index', component: IndexComponent},
  {path: 'datalist', component: DatalistComponent},
  {path: 'usercenter', component: UserCenterComponent},
  {path: 'datadetail', component: DataDetailComponent},
  {path:'register',component: RegisterComponent},
  {path:'promange',component:ProductMangementComponent},
  // 重定向路由
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: '**', component: IndexComponent}
]
// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    RouterModule.forRoot(appRouters)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
