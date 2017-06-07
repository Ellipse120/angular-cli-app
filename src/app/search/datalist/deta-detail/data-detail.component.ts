/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'


import { MyServiceService } from '../../../core/app.service'
import {UEditorComponent} from "ngx-ueditor";

@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css']
})

export class DataDetailComponent implements OnInit{

  isShowSearch = true;
  zanNum = 0;
  nozanNum = 0;
  id: string;
  showProblem = false;
  commentRemark = '';
  isHidden = true;
  productId;
  productDetail;
  score;
  averageScore: Array<any>;
  stars: Array<number>;

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
    this.productDetail = {name: ''};
    this.stars =  Array(5).fill(1).map((x, i) => i);
    this.averageScore = this.stars;
    this.score = [
      {title: '准确性', key: 'scoreOnAccuracy', stars: this.stars, score: 0, curr: -1},
      {title: '及时性', key: 'scoreOnTimeliness', stars: this.stars, score: 0, curr: -1},
      {title: '完整性', key: 'scoreOnIntegrity', stars: this.stars, score: 0, curr: -1},
      {title: '规范性', key: 'scoreOnNormalization', stars: this.stars, score: 0, curr: -1}
    ]
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
        this.productDetail.premium = this.productDetail.premium ? '是' : '否';
        this.productDetail.modifiedOn = this.timeToDate(this.productDetail.modifiedOn);
        console.log('time', this.timeToDate(this.productDetail.createdOn));
      });
  }

  // 评价星星
  productScore(parentInd, ind) {
    this.score.forEach((item, i) => {
      if (i == parentInd) {
        item.curr = ind;
        item.score = ind + 1
      }
    })
  }

  // 发表评价
  sendComment() {
    if (!this.score[0].score || !this.score[1].score || !this.score[2].score || !this.score[3].score) { return }
    let score = {}
    this.score.forEach(item => {
      score[item.key] = item.score
    })
    if (this.commentRemark) {
      score['remark'] = this.commentRemark;
    }
    console.log('score', score)
  }

  // 处理时间
  timeToDate(time) {
    let date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate();
    };
    return date.toLocaleString();
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params;
    this.getProductDetail();
  }
}
