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
            backgroundColor : 'rgba(0,0,0,0.3)'
          }
        } else {
          this.outerWrapperStyle = {
            background: '#fff'
          };
          this.yslNavStyle = {
            backgroundColor: '#070224'
          }
        }
      }
    })
  }
}
