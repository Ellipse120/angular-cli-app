import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule,Routes} from '@angular/router';






import {UserCenterComponent} from './user-center.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {PsdModifyComponent} from './psd-modify/psd-modify.component';
import {NameCertifyComponent} from './name-certify/name-certify.component';
import {YslHttpService} from '../core/ysl-http.service';


@NgModule({
  declarations: [
    UserCenterComponent,
    UserInfoComponent,
    PsdModifyComponent,
    NameCertifyComponent

  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [YslHttpService]
})

export class UserCenterModule {

}
