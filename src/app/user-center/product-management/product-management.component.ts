import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {NavigationStart, Router} from '@angular/router';

@Component({
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductManagementComponent implements OnInit {

  userTag = [
    {text: '产品列表', path: 'list'},
    {text: '我的纠错', path: 'errata-by-me'},
    {text: '错误反馈', path: 'errata-for-me'}
  ];

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit(): void {
    const path = this.location.path();
    this.setTabText(path);
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.setTabText(e.url);
      }
    });
  }

  setTabText(path) {
    if (path.includes('import')) {
      this.userTag = [{text: '录入产品', path: 'import'}];
    } else if (path.includes('edit')) {
      this.userTag = [{text: '修改产品', path: 'edit'}];
    } else {
      this.userTag = [
        {text: '产品列表', path: 'list'},
        {text: '我的纠错', path: 'errata-by-me'},
        {text: '错误反馈', path: 'errata-for-me'}
      ];
    }
  }

}
