import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';


import {ProductMangementComponent} from './product-mangement.component';
import {MyServiceService} from '../core/app.service';
import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {Ng2PaginationModule} from 'ng2-pagination/index';
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
    Ng2PaginationModule,
    NgxDatatableModule
  ]
})

export class ProductMangementModule {

}
