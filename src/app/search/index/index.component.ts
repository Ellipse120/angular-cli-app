import { Component, OnInit } from '@angular/core';
import {MyServiceService} from "../../core/app.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isActive = 0;
  tagDimensions = [];

  constructor(public service: MyServiceService) {

    // 获取首页标签数据
    this.service.getTagDimensions()
        .then( data => {
          this.tagDimensions = data;
          console.log(this.tagDimensions);
        })
  }

  changeTab(i) {
    this.isActive = i;
    console.log(i)
  }

  ngOnInit() {
  }

}
