import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {UserInfoComponent} from "./user-info/user-info.component";
import {UserBaseInfoComponent} from "./user-info/user-base-info.component";
import {NameCertifyComponent} from "./user-info/name-certify.component";
import {PsdModifyComponent} from "./user-info/psd-modify.component";
import {UserCenterComponent} from "./user-center.component";
import {ThumbsUpComponent} from "./thumbs-up/thumbs-up.component";
import {ProductCommentComponent} from "./comment/comment.component";
import {ProductLikesComponent} from "./likes/likes.component";
import {ProductManagementComponent} from "./product-management/product-management.component";
import {ProductListComponent} from "./product-management/product-list.component";
import {ProductErrataComponent} from "./product-management/product-errata.component";
import {organizationInfoComponent} from "./user-info/organization-info.component";
import {ProductImportComponent} from "./product-management/product-import.component";

// 定义个人中心第三级路由
// 产品管理
const productManageChild: Routes = [
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: 'errata',
    component: ProductErrataComponent
  },
  {
    path: 'import',
    component: ProductImportComponent,
    outlet:'importoutlet'
  },
  {
    path: 'edit/:productId',
    component: ProductImportComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
// 个人资料
const userCenterChild: Routes = [
  {
    path: 'userBaseInfo',
    component: UserBaseInfoComponent
  },
  {
    path: 'organizationInfo',
    component: organizationInfoComponent
  },
  {
    path: 'userVerify',
    component: NameCertifyComponent
  },
  {
    path: 'userPsdModify',
    component: PsdModifyComponent
  },
  {
    path: '**',redirectTo: 'userBaseInfo'
  }
];

// 定义用户中心管理嵌套路由二级
const childUserCenterRoutes:Routes = [
  // 重定向路由
  {
    path: 'productManagement',
    component: ProductManagementComponent,
    children: productManageChild
  },
  {
    path: 'comment',
    component: ProductCommentComponent,
    children: userCenterChild
  },
  {
    path: 'favorite',
    component: ThumbsUpComponent,
    children: userCenterChild
  },
  {
    path: 'likes',
    component: ProductLikesComponent,
    children: userCenterChild
  },
  {
    path: 'userInfo',
    component: UserInfoComponent,
    children: userCenterChild
  },
  {
    path: '**',redirectTo: 'userInfo'
  }
];

const userCenterRoutes: Routes = [
  {
    path: 'userCenter',
    component: UserCenterComponent,
    children: childUserCenterRoutes
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class UserCenterRoutingModule {}
