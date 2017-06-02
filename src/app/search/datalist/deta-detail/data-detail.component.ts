/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Ng2Ueditor } from 'ng2-ueditor/src/index';
import { ActivatedRoute, Params } from '@angular/router'


import { MyServiceService } from '../../../core/app.service'

@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css']
})

export class DataDetailComponent implements OnInit{

  @ViewChild('ueditor') ueditor: Ng2Ueditor;

  isShowSearch = true;
  zanNum = 0;
  nozanNum = 0;
  id: string;
  showProblem = false;
  full_source = '请输入评论';
  isHidden = true;
  productId;
  productDetail = {
    name: '',
    webSite: ''
  };

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

  constructor(public route: ActivatedRoute, public service: MyServiceService) {

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

  // 搜索
  keywordSearch(data) {
    console.log('详情页搜索', data);
  }

  // 获取详情信息
  getProductDetail() {
    this.service.getProductDetail(this.productId.productId)
      .then(res => {
        this.productDetail = res;
      });
  }


  ngOnInit(): void {
    this.productId = this.route.snapshot.params;
    this.getProductDetail();
  }
}
