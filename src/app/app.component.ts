import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  outerWrapperStyle = {};
  yslNavStyle = {};

  constructor(private router: Router) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url.includes('/index')) {
          console.log('index')
          this.outerWrapperStyle = {
            background: 'url(assets/images/index-bg.jpg) no-repeat left top/cover'
          }
          this.yslNavStyle = {
            backgroundColor : 'transparent'
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
