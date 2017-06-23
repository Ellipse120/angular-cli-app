import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MyDatePickerModule } from 'mydatepicker';

import {ProductMangementComponent} from './product-mangement.component';
import {ProductListComponent} from './product-list/product-list.component';
import {ErrorCorrectComponent} from './error-correct/error-correct.component';
import {ProductImportComponent} from './product-import/product-import.component';
import {YslMaterialModule} from '../core/ysl-material.module';
import {ProductErrorService} from "./error-correct/product-error.service";
import {CommonsUtilsModule} from "../core/commons/commons-utils.module";
import {ProductService} from "./service/product.service";


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
    MyDatePickerModule,
    YslMaterialModule,
    CommonsUtilsModule
  ],
  entryComponents: [
    ProductImportComponent
  ],
  providers: [
    ProductErrorService,
    ProductService
  ]
})

export class ProductMangementModule {

}
