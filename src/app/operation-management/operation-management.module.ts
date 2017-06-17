import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { RouterModule , Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {UserManagementComponent} from './user-management/user-management.component';
import {OperationManagementComponent} from './operation-management.component';
import {YslSidebarComponent} from "../core/sidebar/sidebar.component";

@NgModule({
  declarations: [
    OperationManagementComponent,
    UserManagementComponent,
    YslSidebarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgxDatatableModule,
    FormsModule
  ],
  exports: [YslSidebarComponent]
})

export class OperationManagementModule {

}
