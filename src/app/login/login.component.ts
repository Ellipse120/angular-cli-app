import { Component } from '@angular/core';
import { MdDialogRef } from "@angular/material";


@Component({
  selector: 'ysl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent  {

  constructor(public dialogRef: MdDialogRef<LoginComponent>) {}
}

