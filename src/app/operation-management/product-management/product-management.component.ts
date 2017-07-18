import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
