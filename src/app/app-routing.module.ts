import {NgModule} from '@angular/core';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';


import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/data-detail/data-detail.component';
import {RegisterComponent} from './register/register.component';
import {ProductRoutingModule} from './product-mangement/product-routing.module';
import {OperationRoutingModule} from './operation-management/operation-routing.module';
import {YslPrivacyComponent} from './statement/privacy.component';
import {ServiceAgreementComponent} from './statement/service-agreement.component';
import {UserCenterRoutingModule} from './user-center/user-center-routing.module';
import {VerifySuccessComponent} from './register/verify-success.component';
import {VerifyFailureComponent} from './register/verify-failure.component';
import construct = Reflect.construct;

// 定义普通路由
const appRouters: Routes = [
  // 重定向路由
  {path: '', redirectTo: 'index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'datalist', component: DatalistComponent},
  {path: 'datadetail', component: DataDetailComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify-success', component: VerifySuccessComponent},
  {path: 'verify-failure', component: VerifyFailureComponent},
  {path: 'privacy', component: YslPrivacyComponent},
  {path: 'service', component: ServiceAgreementComponent},
  {path: '**', component: IndexComponent}
];

// @NgModule是一个装饰函数，它接收一个用来描述模块属性的元数据对象
@NgModule({
  imports: [
    RouterModule.forRoot(appRouters),
    ProductRoutingModule,
    OperationRoutingModule,
    UserCenterRoutingModule
  ],
  exports: [
    RouterModule
  ],
  providers: []
})


export class AppRoutingModule {
}
