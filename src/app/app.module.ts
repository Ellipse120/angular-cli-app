import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductMangementModule } from './product-mangement/product-mangement.module';
import { YslMaterialModule } from './core/ysl-material.module';
import { UserCenterModule } from './user-center/user-center.module';
import { OperationManagementModule } from './operation-management/operation-management.module';
import { AppRoutingModule } from './app-routing.module';
import { MyDatePickerModule } from 'mydatepicker';

import { YslHttpService } from './core/ysl-http.service';

import { SearchInputComponent } from './search/search-input/search-input.component';
import { NavComponent } from './core/nav/nav.component';
import { FooterComponent } from './core/footer/footer.component';
import { AppComponent } from './app.component';
import { IndexComponent } from './search/index/index.component';
import { RegisterComponent } from './register/register.component';
import { DatalistComponent } from './search/datalist/datalist.component';
import { DataDetailComponent } from './search/datalist/data-detail/data-detail.component';
import { LoginComponent } from './login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { YslMenuDirective } from './core/Directive/ysl-menu.directive';
import { UEditorModule } from 'ngx-ueditor';
import {CookieModule} from "ngx-cookie";
import {YslCommonService} from "./core/ysl-common.service";
import {SearchService} from "./search/search.service";
import {ProductListService} from "./product-mangement/product-list/product-list.service";
import {YslPopupDirective} from "./core/Directive/ysl-popup.directive";
import {SearchAdvancedComponent} from "./search/search-input/searc-advanced.component";


let ueditorPath = {
  path: 'assets/ueditor/',
  options: {
    themePath: '/assets/ueditor/themes/'
  }
}

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
    LoginComponent,
    YslMenuDirective,
    YslPopupDirective,
    SearchAdvancedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    HttpModule,
    NgxPaginationModule,
    MyDatePickerModule,
    ProductMangementModule,
    UserCenterModule,
    OperationManagementModule,
    BrowserAnimationsModule,
    YslMaterialModule,
    CookieModule.forRoot(),
    UEditorModule.forRoot(ueditorPath)
  ],
  entryComponents: [
    LoginComponent,
    SearchAdvancedComponent
  ],
  providers: [
    YslHttpService,
    YslCommonService,
    SearchService,
    ProductListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
