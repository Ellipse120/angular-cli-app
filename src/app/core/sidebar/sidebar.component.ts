/**
 * Created by Administrator on 2017-06-17.
 */
import {Component, OnInit, Input} from "@angular/core";
import {Location} from "@angular/common";
import {Router, NavigationStart} from "@angular/router";


@Component({
  selector: 'ysl-sidebar',
  template: `<ul class="ysl-sidebar-nav">
      <li *ngFor="let item of yslSides;let i = index" [routerLink]="[item.path]" class="ysl-sidebar-item" routerLinkActive="active">
        <span class="primary-nav">{{item.text}}</span>
        <ul class="ysl-sidebar-sub" *ngIf="(currSideIndex == i) && item.children">
          <li *ngFor="let itemc of item.children; let ind = index;" [class.bg-lightblue]="currSideChild == ind" (click)="$event.stopPropagation();" [routerLink]="[itemc.path]">{{itemc.text}}</li>
        </ul>
      </li>
    </ul>`
})

export class YslSidebarComponent implements OnInit {
  @Input('ysl-sides') yslSides: any;
  currSideIndex: any;
  currSideChild: any;

  constructor(private router: Router, private location: Location) {}
  ngOnInit() {
    this.handlePath()
  }

  handlePath() {
    let path = this.location.path();
    let findCurrSide = path => {
      this.yslSides.forEach((item, index) => {
        if (path.includes(item.path)) {
          this.currSideIndex = index;
        }
        if (item['children']) {
          item['children'].forEach((child, ind) => {
            if (path.includes(child.path)) {
              this.currSideIndex = index;
              this.currSideChild = ind;
            }
          })
        }
      })
    }
    findCurrSide(path)
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        findCurrSide(e.url)
      }
    })
  }
}
