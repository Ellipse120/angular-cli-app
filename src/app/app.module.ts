import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import {AppRoutingModule} from "./app-routing.module";
import { DatalistComponent } from './datalist/datalist.component';
import {MyServiceService} from "./app.service";
import {SearchInputComponent} from "./commonComponent/search-input.component";
import {Ng2PaginationModule} from "ng2-pagination/index";
import { UserCenterComponent } from './user-center/user-center.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DatalistComponent,
    SearchInputComponent,
    UserCenterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpModule,
    Ng2PaginationModule
  ],
  providers: [MyServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
