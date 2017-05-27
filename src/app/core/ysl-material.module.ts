import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MdDialogModule, MdTabsModule } from '@angular/material';

const MdList = [
  BrowserModule,
  MdDialogModule,
  MdTabsModule
]

@NgModule({
  imports: MdList,
  exports: MdList
})

export class YslMaterialModule {}
