import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  config = {
    title: '',
    message: ''
  };

  /**
   *  this.dialog.open(ConfirmDialogComponent,{
   *    data:{
   *      title:"标题",
   *      message:"提示信息"
   *    }
   *  })
   * @param dialogRef
   * @param data
   *  {
   *    title:
   *    message
   *  }
   */
  constructor(public dialogRef: MdDialogRef<ConfirmDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.config = this.data;
  }

  ngOnInit() {
  }

}
