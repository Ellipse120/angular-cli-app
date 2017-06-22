import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MdDialogModule, MdTabsModule, MdMenuModule, MdSidenavModule, MdInputModule, MdSelectModule, MdRadioModule, MdSnackBarModule} from '@angular/material';

const MdList = [
  BrowserModule,
  MdDialogModule,
  MdTabsModule,
  MdMenuModule,
  MdSidenavModule,
  MdInputModule,
  MdSelectModule,
  MdRadioModule,
  MdSnackBarModule
];

@NgModule({
  imports: MdList,
  exports: MdList
})

export class YslMaterialModule {}
