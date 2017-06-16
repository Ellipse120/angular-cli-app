import { Component, OnInit } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-operation-management',
  templateUrl: './operation-management.component.html',
  styleUrls: ['./operation-management.component.css']
})
export class OperationManagementComponent implements OnInit {

  index = 0;
  operateTag = [
    {text: '用户管理', path: 'userManage'},
    {text: '产品管理',path: 'productlist',children: [
      {text: '产品管理', path: 'productlist'},
      {text: '纠错处理', path: 'error'}
    ]}
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('operation root')
    this.handlePath();
  }

  tab(i) {
    this.index = i;
  }

  prePropagation(event) {
    console.log('hello')
    event.stopPropagation();
  }

  handlePath() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        console.log('path', e.url)
      }
    })
  }

}
