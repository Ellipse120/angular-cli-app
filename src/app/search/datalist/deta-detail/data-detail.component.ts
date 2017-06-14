/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router'


import { YslHttpService } from '../../../core/ysl-http.service'
import {YslMenuService} from "../../../core/Directive/ysl-menu.service";
import {YslCommonService} from "../../../core/ysl-common.service";
import {CookieService} from "ngx-cookie";


@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css'],
  providers: [YslMenuService]
})

export class DataDetailComponent implements OnInit{

  isShowSearch = true;
  id: string;
  commentRemark = '';
  errataRemark: string;
  productParams;
  productDetail;
  relatedProductList = [];
  isThumbsUp: boolean;
  favoredCount: number;
  score;
  averageScore: Array<any>;
  stars: Array<number>;
  replyCommentCont: string;
  productComment = {items: [], totalLength: ''};

  constructor(public route: ActivatedRoute,
              public service: YslHttpService,
              private yslMenu: YslMenuService,
              private commonService: YslCommonService,
              private router: Router,
              private cookie: CookieService) {
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
        this.productDetail.modifiedOn = this.commonService.getDateForDay(this.productDetail.modifiedOn);
        this.isThumbsUp = this.productDetail.favor;
        this.favoredCount = this.productDetail.favoredCount;
        this.getRelatedProducts();
        this.getComment();
      });
  }

  // 下载数据样本
  downloadSampleFile() {
    this.service.downloadSampleFile(this.productDetail.productId)
      .then(res => {
        console.log('下载成功', res)
      })
  }

  // 获取相关产品
  getRelatedProducts() {
    let option = {type: 'organization', productId: this.productDetail.productId};
    this.service.getRelatedProducts(option)
      .then(res => {
        console.log('相关产品', res)
        this.relatedProductList = res['items'];
      })
  }

  relatedProductDetail(item) {
    console.log('item', item)
    this.router.navigate(['datadetail', {productId: item.productId}]);
  }

  // 点赞
  thumbsUp() {
    this.isThumbsUp = !this.isThumbsUp;
    const userId = this.cookie.getObject('yslUserInfo')['id'];
    let option = {productId: this.productDetail.productId, status: this.isThumbsUp, data: {'userId': userId}};
    this.service.createProductFavor(option)
      .then(res => {
        this.favoredCount = res['favoredCount']
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
  }

  // 获取产品评论
  getComment() {
    this.service.getProductComment({productId: this.productDetail.productId, data: {limit: 5, offset: 0}})
      .then(res => {
        if (!res.items) { return }
        let items: any = res.items;
        items.forEach(item => {
          let timeDis = (new Date).getTime() - item.modifiedOn;
          item.averageScore = (item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity)/4;
          item.secondComment = false;
          // item.replyRemark = '';
          if (timeDis < 3600000) {
            item.modifiedOn = (new Date(item.modifiedOn)).getMinutes() + '分钟前';
          } else if (timeDis < 86400000) {
            item.modifiedOn = (new Date(item.modifiedOn)).getHours() + '小时前';
          } else if (timeDis < 86400000*3) {
            item.modifiedOn = (new Date(item.modifiedOn)).getDay() + '天前';
          } else {
            item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn)
          }
        })
        this.productComment = res;
      })
  }

  showReply(ind) {
    let isShow = this.productComment['items'][ind]['secondComment'];
    console.log('form', this.productComment)
    if (isShow) {
      // this.productComment['items']
    }
    this.productComment['items']['secondComment'] = !this.productComment['items']['secondComment']

  }
  // 回复评论
  replyComment(common, ind) {
    console.log('common', common, ind)
    if (!this.replyCommentCont) { return };
    let option = {productId: this.productDetail.productId, data: {remark: this.replyCommentCont, replyTo: common.id}};
    // productComment['items'] secondComment
    // this.service.addProductComment(option)
    //   .then(res => {
    //     console.log('reply', res)
    //   })
  }
}
