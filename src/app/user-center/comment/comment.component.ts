import {Component} from "@angular/core";

@Component({
  templateUrl: './comment.component.html'
})

export class ProductCommentComponent {

  userTag = [
    {text: '个人信息', path: 'userBaseInfo'},
    {text: '修改密码', path: 'userPsdModify'},
    {text: '手机绑定', path: 'userVerify'}
  ];
}
