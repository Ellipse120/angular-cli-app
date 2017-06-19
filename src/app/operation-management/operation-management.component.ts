import { Component, OnInit } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-operation-management',
  templateUrl: './operation-management.component.html',
  styleUrls: ['./operation-management.component.css']
})
export class OperationManagementComponent implements OnInit {

  currSideIndex: number;
  currSideChild: number;
  operateTag = [
    {text: '用户管理', path: 'userManage'},
    {text: '产品管理',path: 'productlist',children: [
      {text: '产品列表', path: 'productlist'},
      {text: '纠错处理', path: 'error'}
    ]}
  ];

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
  }
}
