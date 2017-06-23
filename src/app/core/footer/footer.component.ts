import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from "@angular/router";

@Component({
  selector: 'footer',
  template: `<div class="text-center footer"><div class="container">
                  <ul>
                  <li><a href="http://www.cjzc.net.cn/" target="_blank">关于我们</a></li>
                  <li><a routerLink="/service" [target]="'_blank'">服务协议</a></li>
                  <li><a routerLink="/privacy" [target]="'_blank'">隐私协议</a></li>
                  </ul>
                  <p>版权所有 : 长江众创 Copyright@2010 All Rights Reserved 版本 1.0.1</p>
             </div></div>`
})

export class FooterComponent {}
