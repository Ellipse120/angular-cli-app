import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';

import {OperationManagementComponent} from './operation-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {ProductListComponent} from '../product-mangement/product-list/product-list.component';
import {ErrorCorrectComponent} from '../product-mangement/error-correct/error-correct.component';
import {ProductManagementComponent} from '../user-center/product-management/product-management.component';
import {OperationalReportComponent} from "./operational-report/operational-report.component";


const operationProductChildRouters: Routes = [
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
    path: 'error',
    component: ErrorCorrectComponent
  },
  {
    path: '**', redirectTo: 'userManage'
  }
];

const operationChildRouters = [
  {
    path: 'userManage',
    component: UserManagementComponent
  },
  {
    path: 'productManagement',
    component: ProductManagementComponent,
    children: operationProductChildRouters
  },
  {
    path: 'operationManagement',
    component: OperationalReportComponent
  },
  {
   path: '**',
    redirectTo: 'productManagement'
  }
];

const operationRouters = [
  {
    path: 'operation',
    component: OperationManagementComponent,
    children: operationChildRouters
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(operationRouters)
  ],
  exports: [
    RouterModule
  ]
})

export class OperationRoutingModule {}
