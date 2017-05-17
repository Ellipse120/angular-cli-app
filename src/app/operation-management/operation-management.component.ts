import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operation-management',
  templateUrl: './operation-management.component.html',
  styleUrls: ['./operation-management.component.css']
})
export class OperationManagementComponent implements OnInit {

  index;
  operateTag = [
    {text: '用户管理', path: 'userManage'},
    {text: '产品管理',path: 'productlist',children: [
      {text: '产品管理', path: 'productlist'},
      {text: '纠错处理', path: 'error'}
    ]}
  ]

  tab(i) {
    this.index = i;
  }

  prePropagation(event) {
    console.log('hello')
    event.stopPropagation();
  }
  constructor() { }

  ngOnInit() {
  }

}
