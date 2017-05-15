import { Component , OnInit} from '@angular/core';

import {ProductListComponent} from '../product-list/product-list.component';

@Component({
  selector: 'product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})

export class ProductImportComponent implements OnInit {

  data = [];
  import = true;

  constructor(public product: ProductListComponent){}
  // 关闭弹框
  close() {
    this.product.import = false;
  }

  onSubmit() {
    console.log(this.data);
  }
  ngOnInit() {}
}
