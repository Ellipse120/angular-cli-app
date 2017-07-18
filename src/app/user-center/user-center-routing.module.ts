import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserInfoComponent} from './user-info/user-info.component';
import {UserBaseInfoComponent} from './user-info/user-base-info.component';
import {NameCertifyComponent} from './user-info/name-certify.component';
import {PsdModifyComponent} from './user-info/psd-modify.component';
import {UserCenterComponent} from './user-center.component';
import {ThumbsUpComponent} from './thumbs-up/thumbs-up.component';
import {ProductCommentComponent} from './comment/comment.component';
import {ProductLikesComponent} from './likes/likes.component';
import {ProductManagementComponent} from './product-management/product-management.component';
import {ProductListComponent} from './product-management/product-list.component';
import {ProductErrataComponent} from './product-management/product-errata.component';
import {organizationInfoComponent} from './user-info/organization-info.component';
import {ProductImportComponent} from './product-management/product-import.component';
import {CommentListComponent} from './comment/comment-list.component';
import {LikeListComponent} from './likes/like-list.component';
import {ThumbsUpByMeComponent} from './thumbs-up/thumbs-up-by-me.component';
import {ThumbsUpToMeComponent} from './thumbs-up/thumbs-up-to-me.component';
import {CommentListByMeComponent} from './comment/comment-list-by-me.component';

// 定义个人中心第三级路由
// 产品
const productManageChild: Routes = [
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'import',
    component: ProductImportComponent
  },
  {
    path: 'errata-by-me',
    component: ProductErrataComponent
  },
  {
    path: 'errata-for-me',
    component: ProductErrataComponent
  },
  {
    path: 'edit/:productId',
    component: ProductImportComponent
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
    path: '**', redirectTo: 'userBaseInfo'
  }
];

// 定义用户中心管理嵌套路由二级
const childUserCenterRoutes: Routes = [
  // 重定向路由
  {
    path: 'productManagement',
    component: ProductManagementComponent,
    children: productManageChild
  },
  {
    path: 'comment',
    component: ProductCommentComponent,
    children: [
      {
        path: 'list',
        component: CommentListComponent
      },
      {
        path: 'list-by-me',
        component: CommentListByMeComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
  {
    path: 'favorite',
    component: ThumbsUpComponent,
    children: [
      {
        path: 'by-me',
        component: ThumbsUpByMeComponent
      },
      {
        path: '',
        redirectTo: 'by-me',
        pathMatch: 'full'
      },
      {
        path: 'to-me',
        component: ThumbsUpToMeComponent
      },
      {
        path: '**',
        redirectTo: 'to-me'
      }
    ]
  },
  {
    path: 'likes',
    component: ProductLikesComponent,
    children: [
      {
        path: 'list',
        component: LikeListComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
  {
    path: 'userInfo',
    component: UserInfoComponent,
    children: userCenterChild
  },
  {
    path: '**',
    redirectTo: 'userInfo'
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

export class UserCenterRoutingModule {
}
