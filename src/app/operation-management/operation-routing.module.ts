import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';


import {OperationManagementComponent} from './operation-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {ProManageComponent} from "./pro-manage/pro-manage.component";


const operationChildRouters:Routes = [
  {
    path: 'userManage',
    component: UserManagementComponent
  },
  {
    path: 'product',
    component: ProManageComponent
  },
  {
    path: '**', redirectTo: 'userManage'
  }
];

const operationRouters = [
  {path: 'operation',component: OperationManagementComponent, children: operationChildRouters}
]

@NgModule({
  imports: [
    RouterModule.forChild(operationRouters)
  ],
  exports: [
    RouterModule
  ]
})

export class OperationRoutingModule {}
