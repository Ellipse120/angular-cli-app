import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isActive=0;
  types=[
    {text:'对外贸易',children:[
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'},
      {text:'对外贸易-child1'}

    ]},
    {text:'经济主题',children:[
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
      {text:'经济主题-child1'},
    ]},
    {text:'item3'},
    {text:'item4'},
    {text:'item5'}
  ]


  changeTab(i){
    this.isActive=i;
    console.log(i)
  }

  ngOnInit() {
  }

}
