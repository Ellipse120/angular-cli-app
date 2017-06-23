import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {PromptDialogComponent} from './prompt-dialog.component';
import {AlertDialogComponent} from './alert-dialog.component';
import {YslMaterialModule} from '../ysl-material.module';
import {FormsModule} from '@angular/forms';
/**
 * Created by liangdi on 5/26/17.
 */


@NgModule({
  imports: [
    FormsModule,
    YslMaterialModule,
    CommonModule
  ],
  declarations: [
    ConfirmDialogComponent,
    PromptDialogComponent,
    AlertDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    PromptDialogComponent,
    AlertDialogComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CommonsUtilsModule {}
