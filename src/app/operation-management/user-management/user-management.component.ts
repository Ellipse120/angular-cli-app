import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './user-management.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class UserManagementComponent implements OnInit {

  userTag = [
    {text: '用户管理', path: 'list'}
  ];

  url: string;
  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.url = this.location.path();
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.url = e.url;
        this.setTabText();
      }
    });
    this.setTabText();
  }

  // 设置tab内容
  setTabText() {
    if (this.url.includes('add')) {
      this.userTag = [{text: '新增用户', path: 'add'}];
    } else if (this.url.includes('user-info')) {
      this.userTag = [{text: '用户详情', path: 'user-info'}];
    } else {
      this.userTag = [
        {text: '用户管理', path: 'list'}
      ];
    }
  }
}
