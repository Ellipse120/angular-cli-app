import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductManagementComponent implements OnInit {

  userTag = [
    {text: '产品列表', path: 'list'},
    {text: '纠错处理', path: 'errata'}
  ];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (this.router.url.split('/').includes('import')) {
        this.userTag = [{text: '录入产品', path: 'import'}];
      } else if (this.router.url.split('/').includes('edit')) {
        this.userTag = [{text: '修改产品', path: 'edit'}];
      } else {
        this.userTag = [
          {text: '产品列表', path: 'list'},
          {text: '纠错处理', path: 'errata'}
        ];
      }
    });
  }

}
