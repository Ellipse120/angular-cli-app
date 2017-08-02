import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'footer',
  template: `<div class="text-center footer"><div class="container">
                <div class="footer-top">
                  <span class="logo"><img src="../../../assets/images/cjzc-logo.png" alt=""></span>
                  <ul>
                    <li><a href="http://www.cjzc.net.cn/" target="_blank">关于我们</a></li>
                    <li><a routerLink="/service" [target]="'_blank'">服务协议</a></li>
                    <li><a routerLink="/privacy" [target]="'_blank'">隐私协议</a></li>
                  </ul>
                </div>
                <p>版权所有 : 长江众创 Copyright&nbsp;&copy;&nbsp;2017 All Rights Reserved 版本 1.5.9</p>
                <p class="tel">客服电话：021-60872888</p>
            </div></div>`
})

export class FooterComponent {}
