import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { RouterModule , Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {UserManagementComponent} from './user-management/user-management.component';
import {OperationManagementComponent} from './operation-management.component';
import {YslSidebarComponent} from '../core/sidebar/sidebar.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OperationalReportComponent } from './operational-report/operational-report.component';
import {OperationProductListComponent} from './product-management/product-list.component';
import {OperationProductErrataComponent} from './product-management/product-errata.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {OperationProductAddComponent} from './product-management/product-add.component';
import {YslMaterialModule} from '../core/ysl-material.module';
import {MyDatePickerModule} from 'mydatepicker';
import {YslLoadingComponent} from '../core/loading/loading.component';
import {OperationService} from './service/operation-service';
import { UserAddComponent } from './user-management/user-add.component';
import { UserListComponent } from './user-management/user-list.component';
import { UserInfoComponent } from './user-management/user-info.component';
import {EchartsNg2Module} from 'echarts-ng2';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  declarations: [
    OperationManagementComponent,
    UserManagementComponent,
    YslSidebarComponent,
    ProductManagementComponent,
    OperationalReportComponent,
    OperationProductErrataComponent,
    OperationProductListComponent,
    OperationProductAddComponent,
    YslLoadingComponent,
    UserAddComponent,
    UserListComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgxDatatableModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    YslMaterialModule,
    MyDatePickerModule,
    EchartsNg2Module,
    FileUploadModule
  ],
  providers: [OperationService],
  exports: [YslSidebarComponent, YslLoadingComponent]
})

export class OperationManagementModule {

}
