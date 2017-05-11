import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SearchInputComponent} from './commonComponent/search-input.component';
import {Ng2PaginationModule} from 'ng2-pagination/index';
import { UserCenterComponent } from './user-center/user-center.component';
import {MyServiceService} from './core/app.service';
import {IndexComponent} from './search/index/index.component';
import {DatalistComponent} from './search/datalist/datalist.component';
import {DataDetailComponent} from './search/datalist/deta-detail/data-detail.component';
import {Ng2UeditorModule} from 'ng2-ueditor/src/index';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DatalistComponent,
    SearchInputComponent,
    UserCenterComponent,
    DataDetailComponent
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
