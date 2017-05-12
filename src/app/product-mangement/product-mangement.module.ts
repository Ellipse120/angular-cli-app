import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {ProductMangementComponent} from './product-mangement.component';
import {MyServiceService} from '../core/app.service';
import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {Ng2PaginationModule} from "ng2-pagination/index";

@NgModule({
  declarations: [
    ProductMangementComponent,
    ProductListComponent,
    ErrorCorrectComponent

  ],
  imports: [
    BrowserModule,
    Ng2PaginationModule
  ]
})

export class ProductMangementModule {

}
