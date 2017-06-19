import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie";

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
  ];

  constructor(private cookie: CookieService){}

  userEmail;

  ngOnInit() {
    this.userEmail = this.cookie.getObject('yslUserInfo') ? this.cookie.getObject('yslUserInfo')['contactMail'] : undefined
  }

}
