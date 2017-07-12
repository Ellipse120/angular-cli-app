import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-failure',
  templateUrl: './verify-failure.component.html',
  styleUrls: ['./verify-failure.component.css']
})
export class VerifyFailureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /**
   * 重新发送邮件
   */
  resendMail() {
    console.log('重新发送邮件');
  }
}
