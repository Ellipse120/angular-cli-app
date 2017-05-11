import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Ng2PaginationModule} from 'ng2-pagination/index';
import { UserCenterComponent } from './user-center/user-center.component';
import {MyServiceService} from './core/app.service';
import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/deta-detail/data-detail.component';
import {Ng2UeditorModule} from 'ng2-ueditor/src/index';
import {SearchInputComponent} from "./search/search-input/search-input.component";
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DatalistComponent,
    SearchInputComponent,
    UserCenterComponent,
    DataDetailComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpModule,
    Ng2PaginationModule,
    Ng2UeditorModule
  ],
  providers: [MyServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
