import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';

import {OperationManagementComponent} from './operation-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {ProductManagementComponent} from './product-management/product-management.component';
import {OperationalReportComponent} from './operational-report/operational-report.component';
import {OperationProductListComponent} from './product-management/product-list.component';
import {OperationProductErrataComponent} from 'app/operation-management/product-management/product-errata.component';


const operationProductChildRouters: Routes = [
  {
    path: 'list',
    component: OperationProductListComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'errata',
    component: OperationProductErrataComponent
  },
  {
    path: '**', redirectTo: 'list'
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
    path: 'operationalReport',
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
