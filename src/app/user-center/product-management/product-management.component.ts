import {Component} from "@angular/core";

@Component({
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductManagementComponent {

  userTag = [
    {text: '产品列表', path: 'list'},
    {text: '纠错处理', path: 'errata'}
  ];
}
