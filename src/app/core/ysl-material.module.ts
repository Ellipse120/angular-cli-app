import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MdDialogModule, MdTabsModule } from '@angular/material';

import { LoginComponent } from '../login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MdDialogModule,
    MdTabsModule
  ],
  entryComponents: [
    LoginComponent
  ]
})

export class YslMaterialModule {}
