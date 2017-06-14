import {Component, OnInit} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  outerWrapperStyle = {};
  yslNavStyle = {};
  yslFooterStyle = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.setStyle();
  }

  setStyle() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url.includes('/index') || e.url == '/') {
          this.outerWrapperStyle = {
            // background: 'url(assets/images/index-bg.jpg) no-repeat left top/cover'
            backgroundColor: '#242424'
          }
          this.yslNavStyle = {
            background : 'rgba(0,0,0,0.3)'
          }
          this.yslFooterStyle = {
            backgroundColor: 'transparent'
          }
        } else {
          this.outerWrapperStyle = {
            background: '#fff'
          };
          this.yslNavStyle = {
            background: 'linear-gradient(#323232, #3d3d3d, #414141)'
          }
          this.yslFooterStyle = {
            backgroundColor: '#333'
          }
        }
      }
    })
  }
}
