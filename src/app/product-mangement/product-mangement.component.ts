import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-mangement',
  templateUrl: './product-mangement.component.html',
  styleUrls: ['./product-mangement.component.css']
})
export class ProductMangementComponent implements OnInit {

  proMangeTag = [
    {text: '产品管理',children: [
      {text: '产品列表', path: 'productlist'},
      {text: '纠错处理', path: 'error'}
    ]}
  ]

  ngOnInit() {
  }

}
