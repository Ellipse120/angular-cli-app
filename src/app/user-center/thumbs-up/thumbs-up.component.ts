import {Component} from "@angular/core";

@Component({
  templateUrl: './thumbs-up.component.html'
})

export class ThumbsUpComponent {

  userTag = [
    {text: '个人信息', path: 'userBaseInfo'},
    {text: '修改密码', path: 'userPsdModify'},
    {text: '手机绑定', path: 'userVerify'}
  ];
}
