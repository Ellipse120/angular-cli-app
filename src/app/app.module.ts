import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Ng2UeditorModule } from 'ng2-ueditor/src/index';
import { ProductMangementModule } from './product-mangement/product-mangement.module';
import { YslMaterialModule } from './core/ysl-material.module';
import { UserCenterModule } from './user-center/user-center.module';
import { OperationManagementModule } from './operation-management/operation-management.module';
import { AppRoutingModule } from './app-routing.module';

import { MyServiceService } from './core/app.service';
import { SearchService } from "./search/search.service";

import { SearchInputComponent } from './search/search-input/search-input.component';
import { NavComponent } from './core/nav/nav.component';
import { FooterComponent } from './core/footer/footer.component';
import { AppComponent } from './app.component';
import { IndexComponent } from './search/index/index.component';
import { RegisterComponent } from './register/register.component';
import { DatalistComponent } from './search/datalist/datalist.component';
import { DataDetailComponent } from './search/datalist/deta-detail/data-detail.component';
import { LoginComponent } from './login/login.component';
import {NgxPaginationModule} from 'ngx-pagination';




@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DatalistComponent,
    SearchInputComponent,
    DataDetailComponent,
    RegisterComponent,
    NavComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    HttpModule,
    NgxPaginationModule,
    Ng2UeditorModule,
    ProductMangementModule,
    UserCenterModule,
    OperationManagementModule,
    BrowserAnimationsModule,
    YslMaterialModule
  ],
  entryComponents: [
    LoginComponent
  ],
  providers: [MyServiceService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
