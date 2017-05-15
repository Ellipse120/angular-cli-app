import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';


import {ProductMangementComponent} from './product-mangement.component';
import {MyServiceService} from '../core/app.service';
import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {ProductImportComponent} from './product-import/product-import.component';
import {ProductRoutingModule} from "./product-routing.module";

@NgModule({
  declarations: [
    ProductMangementComponent,
    ProductListComponent,
    ErrorCorrectComponent,
    ProductImportComponent

  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    RouterModule,
    FormsModule
  ]
})

export class ProductMangementModule {

}
