import {NgModule} from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {RouterModule,Routes,Router, ActivatedRoute} from '@angular/router';


import {UserCenterComponent} from './user-center/user-center.component';
import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/data-detail/data-detail.component';
import {RegisterComponent} from './register/register.component';
import {UserInfoComponent} from './user-center/user-info/user-info.component';
import {NameCertifyComponent} from './user-center/name-certify/name-certify.component';
import {PsdModifyComponent} from './user-center/psd-modify/psd-modify.component';
import {ProductRoutingModule} from './product-mangement/product-routing.module';
import {OperationRoutingModule} from './operation-management/operation-routing.module';
import construct = Reflect.construct;
import {YslPrivacyComponent} from "./statement/privacy.component";
import {ServiceAgreementComponent} from "./statement/service-agreement.component";


//// 定义用户中心管理嵌套路由
const childUserCenterRoutes:Routes = [
  // 重定向路由
  {
    path: 'userInfo',
    component: UserInfoComponent
  },
  {
    path: 'nameCertify',
    component: NameCertifyComponent
  },
  {
    path: 'psdModify',
    component: PsdModifyComponent
  },
  {
    path: '**',redirectTo: 'userInfo'
  }
];


// 定义普通路由
const appRouters:Routes = [
  // 重定向路由
  {path: '', redirectTo: 'index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'datalist', component: DatalistComponent},
  {path: 'usercenter', component: UserCenterComponent, children: childUserCenterRoutes},
  {path: 'datadetail', component: DataDetailComponent},
  {path:'register',component: RegisterComponent},
  {path:'privacy',component: YslPrivacyComponent},
  {path:'service',component: ServiceAgreementComponent},
  {path: '**', component: IndexComponent}
]
// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    RouterModule.forRoot(appRouters),
    ProductRoutingModule,
    OperationRoutingModule
  ],
  exports: [
    RouterModule
  ],
  providers: []
})


export class AppRoutingModule {
}
