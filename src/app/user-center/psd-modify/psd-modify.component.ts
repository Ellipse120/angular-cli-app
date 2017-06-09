import {Component , OnInit} from '@angular/core';
import {YslHttpService} from "../../core/ysl-http.service";

@Component({
  selector: 'psd-modify',
  templateUrl: './psd-modify.component.html',
  styleUrls: ['../user-center.component.css']
})

export class PsdModifyComponent implements OnInit{

  modify = {
    old: '',
    new: '',
    new2: ''
  };
  constructor(public httpService: YslHttpService) {

  }

  ngOnInit() {
  }
}
