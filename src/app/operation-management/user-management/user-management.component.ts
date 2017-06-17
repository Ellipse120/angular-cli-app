import {Component} from '@angular/core';
import {YslHttpService} from "../../core/ysl-http.service";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['../operation-management.component.css']
})

export class UserManagementComponent {


  rows = [];
  selected = [];
  userInfo = [];
  newUser = false;
  showUserInfo = false;
  showEdit = true;

  constructor(public service:YslHttpService){
    this.service.getUserList()
    .then(data => {
      this.rows = data.items;
    })
  }

  // 查看用户信息
  showInfo(row){
    JSON.stringify(row);
    this.showUserInfo = true;
    this.userInfo = row;
  }

  //  增加用户
  addUser() {
    this.newUser = true;
  }

  // 修改用户信息
  editInfo() {
    this.showEdit = false
  }
  closeUser() {
    this.newUser = false;
    this.showUserInfo = false;
  }
  onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);

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



}
