/**
 * Created by Administrator on 2017/5/10.
 */
import {Component,ViewChild} from '@angular/core';
import {Ng2Ueditor} from 'ng2-ueditor/src/index';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css']
})

export class DataDetailComponent {
  @ViewChild('ueditor') ueditor: Ng2Ueditor;

  zanNum = 0;
  nozanNum = 0;
  id: string;
  showProblem = false;
  full_source = '请输入评论';
  isHidden = true;

  setting = {
    // 这里可以选择自己需要的工具按钮名称,此处仅选择如下几个
    toolbars: [['insertimage', 'Undo', 'Redo', 'Bold', 'forecolor', 'emotion']],
    // focus时自动清空初始化的内容
    autoClearinitialContent: false,
    //  关闭字数统计
    wordCount: false,
    //  关闭elementPath
    elementPathEnabled: false,
    //  默认的编辑区域高度
    initialFrameHeight: 250,
    //  默认的编辑器的宽度
    initialFrameWidth: '100%'

  }

//  赞
  zan() {
    this.zanNum++;
  }

//  纠错
  writeProblem() {
    this.showProblem = !this.showProblem;
  }

//  点击评论出现评论框
  showComment() {
    this.isHidden = !this.isHidden;
  }
}
