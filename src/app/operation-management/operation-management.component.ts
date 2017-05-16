import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operation-management',
  templateUrl: './operation-management.component.html',
  styleUrls: ['./operation-management.component.css']
})
export class OperationManagementComponent implements OnInit {

  index = 0;
  operateTag = [
    {text: '用户管理', path: 'userManage'},
    {text: '产品管理', path: 'product',children: [
      {text: '产品管理', path: 'productlist'},
      {text: '纠错处理', path: 'errorlist'}
    ]}
  ]

  tab(i) {
    this.index = i;
  }
  constructor() { }

  ngOnInit() {
  }

}
