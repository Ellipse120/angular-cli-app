import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { RouterModule , Routes } from '@angular/router';


import {UserManagementComponent} from './user-management/user-management.component';
import {OperationManagementComponent} from './operation-management.component';
import {ProManageComponent} from './pro-manage/pro-manage.component';

@NgModule({
  declarations: [
    OperationManagementComponent,
    UserManagementComponent,
    ProManageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgxDatatableModule
  ]
})

export class OperationManagementModule {

}
