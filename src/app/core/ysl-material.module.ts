import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MdDialogModule, MdTabsModule, MdMenuModule, MdSidenavModule, MdInputModule, MdSelectModule, MdRadioModule} from '@angular/material';

const MdList = [
  BrowserModule,
  MdDialogModule,
  MdTabsModule,
  MdMenuModule,
  MdSidenavModule,
  MdInputModule,
  MdSelectModule,
  MdRadioModule
]

@NgModule({
  imports: MdList,
  exports: MdList
})

export class YslMaterialModule {}
