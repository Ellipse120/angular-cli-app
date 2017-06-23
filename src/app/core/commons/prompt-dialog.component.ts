import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent implements OnInit {
  config = {
    title:"",
    placeholder:"",
    value:""
  };
  constructor(public dialogRef: MdDialogRef<PromptDialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.config = this.data;
  }

  ngOnInit() {
  }

}
