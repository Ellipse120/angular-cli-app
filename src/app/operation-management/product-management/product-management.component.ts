import { Component, OnInit } from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {

  userTag = [
    {text: '产品列表', path: 'list'},
    {text: '纠错处理', path: 'errata'}
  ];
  url: string;
  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.url = location.pathname;
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
      this.userTag = [{text: '录入产品', path: 'add'}];
    } else if (this.url.includes('edit')) {
      this.userTag = [{text: '修改产品', path: 'edit'}];
    } else {
      this.userTag = [
        {text: '产品列表', path: 'list'},
        {text: '纠错处理', path: 'errata'}
      ];
    }
  }

}
