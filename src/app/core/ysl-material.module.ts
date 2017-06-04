import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MdDialogModule, MdTabsModule, MdMenuModule} from '@angular/material';

const MdList = [
  BrowserModule,
  MdDialogModule,
  MdTabsModule,
  MdMenuModule
]

@NgModule({
  imports: MdList,
  exports: MdList
})

export class YslMaterialModule {}
