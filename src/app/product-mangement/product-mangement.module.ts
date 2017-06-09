import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MyDatePickerModule } from 'mydatepicker';
import {ProductRoutingModule} from './product-routing.module';


import {ProductMangementComponent} from './product-mangement.component';
import {YslHttpService} from '../core/ysl-http.service';
import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {ProductImportComponent} from './product-import/product-import.component';



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
    FormsModule,
    MyDatePickerModule
  ]
})

export class ProductMangementModule {

}
