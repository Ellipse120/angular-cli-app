/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'


import { MyServiceService } from '../../../core/app.service'
import { UEditorComponent } from 'ngx-ueditor';
import {YslMenuService} from "../../../core/Directive/ysl-menu.service";


@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css'],
  providers: [YslMenuService]
})

export class DataDetailComponent implements OnInit{

  isShowSearch = true;
  zanNum = 0;
  nozanNum = 0;
  id: string;
  commentRemark = '';
  errataRemark: string;
  productParams;
  productDetail;
  score;
  averageScore: Array<any>;
  stars: Array<number>;
  productComment = {items: []};

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

  constructor(public route: ActivatedRoute,
              public service: MyServiceService,
              private yslMenu: YslMenuService) {
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

  ngOnInit(): void {
    this.productParams = this.route.snapshot.params;
    this.getProductDetail();
    this.getComment();
  }

  // 赞
  zan() {
    this.zanNum++;
  }

  // 搜索
  keywordSearch(data) {
    console.log('详情页搜索', data);
  }

  // 获取详情信息
  getProductDetail() {
    this.service.getProductDetail(this.productParams.productId)
      .then(res => {
        this.productDetail = res;
        this.productDetail.premium = this.productDetail.premium ? '是' : '否';
        this.productDetail.modifiedOn = this.timeToDate(this.productDetail.modifiedOn);
        console.log('time', this.timeToDate(this.productDetail.createdOn));
      });
  }

  // 下载数据样本
  downloadSampleFile() {
    console.log('样本')
    this.service.downloadSampleFile(this.productDetail.productId)
      .then(res => {
        console.log('下载成功', res)
      })
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

  // 纠错
  submitErrata() {
    if (!this.errataRemark) { return }
    let option = {productId: this.productParams.productId, data: {userId: this.productDetail.userId, status: this.productDetail.status, comment: this.errataRemark}};
    console.log('remark', option)
    this.service.createProductErrata(option)
      .then(res => {
        console.log('纠错成功', res)
      })
  }

  // 发表评价
  sendComment() {
    if (!this.score[0].score || !this.score[1].score || !this.score[2].score || !this.score[3].score) { return }
    let score = {productId: this.productParams.productId, data: {}}
    this.score.forEach(item => {
      score.data[item.key] = item.score
    })
    if (this.commentRemark) {
      score.data['remark'] = this.commentRemark;
    }
    this.service.addProductComment(score)
      .then(res => {
        console.log('评价', res)
      })

    // todo
    // 匿名
  }

  // 获取产品评论
  getComment() {
    this.service.getProductComment({productId: 32})
      .then(res => {
        let data: any = res;
        data.items.forEach(item => {
          let timeDis = (new Date).getTime() - item.modifiedOn;
          item.averageScore = (item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity)/4;
          item.secondComment = false;
          if (timeDis < 3600000) {
            item.modifiedOn = (new Date(item.modifiedOn)).getMinutes() + '分钟前';
          } else if (timeDis < 86400000) {
            item.modifiedOn = (new Date(item.modifiedOn)).getHours() + '小时前';
          } else if (timeDis < 86400000*3) {
            item.modifiedOn = (new Date(item.modifiedOn)).getDay() + '天前';
          } else {
            item.modifiedOn = this.timeToDate(item.modifiedOn)
          }
        })
        this.productComment = res;
      })
  }

  // 处理时间
  timeToDate(time) {
    let date =  new Date(time);
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '.' + (this.getMonth() + 1) + '.' + this.getDate();
    };
    return date.toLocaleString();
  }
}
