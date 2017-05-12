import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-mangement',
  templateUrl: './product-mangement.component.html',
  styleUrls: ['./product-mangement.component.css']
})
export class ProductMangementComponent implements OnInit {

  index = 0;
  indexCld = 0;
  proMage = [
    {text:'用户管理',children:[
      {text:''}
    ]},
    {text:'产品管理',children:[
      {text:'产品管理'},
      {text:'纠错处理'}
    ]}
  ];

  selected(i) {
    this.index = i;
    //console.log(i)
  }

  selectedCld(i) {
    this.indexCld = i;
    console.log(this.indexCld);
  }
  ngOnInit() {
  }

}
