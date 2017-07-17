import {Component, OnInit} from '@angular/core';

@Component({
  templateUrl: './thumbs-up.component.html'
})

export class ThumbsUpComponent implements OnInit {

  tags = [
    {text: '收到的赞', path: 'to-me'},
    {text: '我赞过的', path: 'by-me'}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
