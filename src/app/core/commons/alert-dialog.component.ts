import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  config = {
    title:"",
    message:""
  };
  constructor(public dialogRef: MdDialogRef<AlertDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.config = this.data;
  }

  ngOnInit() {
  }

}
