/**
 * Created by Administrator on 2017/5/8.
 */
import {Component,OnInit} from '@angular/core';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html'
})

export class SearchInputComponent implements OnInit {

  ishide = true;
  advancedArr = [];

  toggleAdvancedBox() {
    this.ishide = !this.ishide;
  }

  // 提交高级搜索条件
  submitAdvancedSearch() {
    console.log(this.advancedArr);

  }

  ngOnInit() {

  }
}
