import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {UserCenterComponent} from './user-center.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {PsdModifyComponent} from './user-info/psd-modify.component';
import {NameCertifyComponent} from './user-info/name-certify.component';
import {YslHttpService} from '../core/ysl-http.service';
import {UserBaseInfoComponent} from './user-info/user-base-info.component';
import {OperationManagementModule} from '../operation-management/operation-management.module';
import {ProductLikesComponent} from './likes/likes.component';
import {ProductManagementComponent} from './product-management/product-management.component';
import {ThumbsUpComponent} from './thumbs-up/thumbs-up.component';
import {ProductCommentComponent} from './comment/comment.component';
import {ProductListComponent} from './product-management/product-list.component';
import {ProductErrataComponent} from './product-management/product-errata.component';
import {organizationInfoComponent} from './user-info/organization-info.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {YslMaterialModule} from '../core/ysl-material.module';
import {MyDatePickerModule} from 'mydatepicker';
import {FileUploadModule} from 'ng2-file-upload';
import {ProductImportComponent} from './product-management/product-import.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { CommentListComponent } from './comment/comment-list.component';
import { LikeListComponent } from './likes/like-list.component';
import { ThumbsUpToMeComponent } from './thumbs-up/thumbs-up-to-me.component';
import { ThumbsUpByMeComponent } from './thumbs-up/thumbs-up-by-me.component';
import { CommentListByMeComponent } from './comment/comment-list-by-me.component';


@NgModule({
  declarations: [
    UserCenterComponent,
    UserInfoComponent,
    PsdModifyComponent,
    NameCertifyComponent,
    UserBaseInfoComponent,
    ProductLikesComponent,
    ProductManagementComponent,
    ThumbsUpComponent,
    ProductCommentComponent,
    ProductListComponent,
    ProductErrataComponent,
    organizationInfoComponent,
    ProductImportComponent,
    CommentListComponent,
    LikeListComponent,
    ThumbsUpToMeComponent,
    ThumbsUpByMeComponent,
    CommentListByMeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OperationManagementModule,
    YslMaterialModule,
    NgxDatatableModule,
    MyDatePickerModule,
    FileUploadModule,
    NgxPaginationModule
  ],
  providers: [YslHttpService]
})

export class UserCenterModule {

}
