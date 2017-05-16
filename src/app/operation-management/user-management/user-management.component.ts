import {Component} from '@angular/core';
import {MyServiceService} from "../../core/app.service";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class UserManagementComponent {


  rows = [];
  selected = [];

  constructor(public service:MyServiceService){
    this.service.getUser()
    .then(data => {
      this.rows=data;
      console.log(this.rows)
    })
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
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


  //  增加用户
  addUser() {

  }
}
