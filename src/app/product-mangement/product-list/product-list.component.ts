import { Component,OnInit} from '@angular/core';
import {Page} from "ng2-pagination/dist/pagination-controls.directive";
import {MyServiceService} from "../../core/app.service";

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit{


  import = false;
  //定义table
  rows = [];
  selected = [];

  constructor(public service: MyServiceService) {
    //获取产品列表数据
    this.service.fetch((data) => {
      this.rows = data;
      console.log(this.rows)
    })
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [ this.rows[1], this.rows[3] ];
  }

  remove() {
    this.selected = [];
  }
  //录入产品
  proImport() {
    this.import = true;
  }
  ngOnInit() {}
}
