import {Component} from '@angular/core';

@Component({
  templateUrl: './likes.component.html'
})

export class ProductLikesComponent {

  userTag = [
    {text: '收藏列表', path: 'list'}
  ];
}
