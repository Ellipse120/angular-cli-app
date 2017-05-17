import { Component,OnInit } from '@angular/core';
import {MyServiceService} from "../../core/app.service";

@Component({
  selector: 'error-correct',
  templateUrl: './error-correct.component.html',
  styleUrls: ['./error-correct.component.css']
})

export class ErrorCorrectComponent implements OnInit {

  rows = [];
  selected = [];
  error = [];
  errorEdit = false;
  columns = [
    {name: 'proName'},
    {name: 'userName'},
    {name: 'problem'},
    {name: 'submitTime'},
    {name: 'option'}
  ]

  constructor(public service: MyServiceService) {
    this.service.getError(data => {
      this.rows = data;
      console.log(this.rows)
    })
  }

  closeError() {
    this.errorEdit = false;
  }


  modifyError(content) {
    console.log(content);
    this.error = content;
    this.errorEdit = true;
  }

  onSelect({ selected }) {
    this.selected.push(selected)
    console.log(this.selected);

    //this.selected.splice(0, this.selected.length);
    //this.selected.push(...selected);
  }

  onActivate(event) {
    //console.log('Activate Event', event.value);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [ this.rows[1], this.rows[3] ];
  }

  remove() {
    this.selected = [];
  }
//  this.service
//.getList()
//  // .then((function(data){this.dataList=data}))
//.then(dataList => {
//  this.dataList = dataList;
//  console.log(this.dataList);
//})
  // 获取纠错数据



  ngOnInit() {}
}
