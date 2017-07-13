import {Component} from '@angular/core';

@Component({
  templateUrl: './comment.component.html'
})

export class ProductCommentComponent {

  userTag = [
    {text: '评论我的', path: 'list'},
    {text: '我的评论', path: 'list-by-me'}
  ];
}
