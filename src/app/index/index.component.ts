import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  state=false;


  changeTab(){
    this.state=!this.state;
    console.log(this.state)
  }

  ngOnInit() {
  }

}
