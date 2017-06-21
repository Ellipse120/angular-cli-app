/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationStart} from '@angular/router';
import { Location } from '@angular/common';


import { YslHttpService } from '../../../core/ysl-http.service'
import {YslCommonService} from "../../../core/ysl-common.service";
import {CookieService} from "ngx-cookie";
import {YslPopupDirective} from "../../../core/directive/ysl-popup.directive";
import {ProductErrataComponent} from "./product-errata.component";
import {SearchService} from "../../search.service";


@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls:['./data-detail.component.css']
})

export class DataDetailComponent implements OnInit{

  @ViewChild(YslPopupDirective)
  private yslPopup: YslPopupDirective;
  id: string;
  userId;
  commentRemark = '';
  commentError = '';
  errataPopupOpt: any;
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

  constructor(private route: ActivatedRoute,
              private service: YslHttpService,
              private commonService: YslCommonService,
              private router: Router,
              private cookie: CookieService,
              private location: Location,
              private searchService: SearchService) {
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
    this.getUserId();
    this.productParams = this.route.snapshot.params;
    this.getProductDetail(this.productParams.productId);
    this.searchService.loginSuccessEvent.subscribe(() => {
      this.getUserId();
    })
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        // this.getProductDetail(this.productParams.productId);
        window.scroll(0,0);
      }
    });
    window.scroll(0, 0);
  }

  // 获取用户ID
  getUserId() {
    this.userId = this.cookie.getObject('yslUserInfo') ?　this.cookie.getObject('yslUserInfo')['id'] : undefined;
  }

  // 搜索
  keywordSearch(data) {
    console.log('详情页搜索 data', data);
  }

  // 获取详情信息
  getProductDetail(productId) {
    this.searchService.getAdvancedInfo()
      .then(data => {
        let advancedKey = data;
        this.service.getProductDetail(productId)
          .then(res => {
            this.getUserProp();
            this.productDetail = res;
            this.productDetail.premium = this.productDetail.premium ? '是' : '否';
            this.productDetail.modifiedOn = this.commonService.getDateForDay(this.productDetail.modifiedOn);
            for (const key in advancedKey) {
              switch (key) {
                case 'data_category':
                  advancedKey[key].forEach(item => {
                    if (this.productDetail['dataCategory'] ==item.entryCode) {
                      this.productDetail['dataCategory'] = item.entryValue;
                    }
                  })
                  break;
                case 'data_collection':
                  advancedKey[key].forEach(item => {
                    if (this.productDetail['collectionMethod'] == item.entryCode) {
                      this.productDetail['collectionMethod'] = item.entryValue;
                    }
                  })
                  break;
                case 'data_service':
                  advancedKey[key].forEach(item => {
                    if (this.productDetail['serviceMethod'] == item.entryCode) {
                      this.productDetail['serviceMethod'] = item.entryValue;
                    }
                  })
                  break;
                case 'data_source':
                  advancedKey[key].forEach(item => {
                    if (this.productDetail['dataSource'] == item.entryCode) {
                      this.productDetail['dataSource'] = item.entryValue;
                    }
                  })
                  break;
              }
            }
            this.productDetail['dataSince'] = this.productDetail['dataSince'] ? this.commonService.getDateForDay(this.productDetail['dataSince']): null;
            this.productDetail['dataUntil'] = this.productDetail['dataUntil'] ? this.commonService.getDateForDay(this.productDetail['dataUntil']): null;
            this.productDetail.averageScore = this.productDetail.averageScore ? (this.productDetail.averageScore).toFixed(1) : undefined;
            this.favoredCount = this.productDetail.favoredCount;
            this.getRelatedProducts();
            this.getComment();
          });
      })
  }

  // 获取产品是否点赞收藏
  getUserProp() {
    if (!this.userId) { return }
    this.service.getProductUserProp(this.productParams.productId, this.userId)
      .then(res => {
        console.log('favor', res)
        this.isThumbsUp = res['productFavor'];
      })
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
        this.relatedProductList = res['items'];
      })
  }

  // 查看相关产品详情
  relatedProductDetail(item) {
    console.log('related', item)
    this.router.navigate(['/datadetail', {productId: item.productId}]);
    this.getProductDetail(item.productId);
    window.scroll(0,0)
  }

  // 点赞
  thumbsUp() {
    if (!this.userId) {
      this.showLogin();
      return
    }
    this.isThumbsUp = !this.isThumbsUp;
    let option = {productId: this.productDetail.productId, status: this.isThumbsUp, data: {'userId': this.userId}};
    this.service.createProductFavor(option)
      .then(res => {
        this.favoredCount = res['favoredCount'];
        this.isThumbsUp = res['favor']
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
  createErrata() {
    if (!this.userId) {
      this.showLogin();
      return
    }
    this.searchService.errataInfo = {productId: this.productParams.productId, userId: this.userId, status: this.productDetail.status};
    this.yslPopup.toggle(ProductErrataComponent)
      .then(data => {
        console.log('errata', data)
      })
  }

  // 发表评价
  sendComment() {
    this.commentError = '';
    if (!this.userId) { this.showLogin(); return }
    if (!this.commentRemark) {
      this.commentError = '请填写评语';
      return;
    }
    for (let i = 0; i < this.score.length; i ++) {
      if (!this.score[i].score) {
        this.commentError = '请打分';
        return
      }
    }
    let score = {productId: this.productParams.productId, data: {userId: this.userId}};
    this.score.forEach(item => {
      score.data[item.key] = item.score
    })
    if (this.commentRemark) {
      score.data['remark'] = this.commentRemark;
    }
    console.log('comment pass')
    this.service.addProductComment(score)
      .then(res => {
        this.getProductDetail(this.productParams.productId);
      })
  }

  // 获取产品评论
  getComment() {
    this.service.getProductComment({productId: this.productDetail.productId, data: {limit: 5, offset: 0}})
      .then(res => {
        if (!res.items) { return }
        let items: any = res.items;
        items.forEach(item => {
          item.modifiedOn = this.commonService.getDateForTime(item.modifiedOn);
          if (item['items']) {
            item['items'].forEach(reply => {
              reply.modifiedOn = this.commonService.getDateForTime(reply.modifiedOn);
            })
          }
          // let timeDis = (new Date).getTime() - item.modifiedOn;
          item.averageScore = ((item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity)/4).toFixed(1);
          item.showSecond = false;
          // if (timeDis < 3600000) {
          //   item.modifiedOn = (new Date(item.modifiedOn)).getMinutes() + '分钟前';
          // } else if (timeDis < 86400000) {
          //   item.modifiedOn = (new Date(item.modifiedOn)).getHours() + '小时前';
          // } else if (timeDis < 86400000*3) {
          //   item.modifiedOn = (new Date(item.modifiedOn)).getDay() + '天前';
          // } else {
          //   item.modifiedOn = this.commonService.getDateForDay(item.modifiedOn)
          // }
        })
        this.productComment = res;
      })
  }

  showReply(ind) {
    if (!this.userId) {
      this.showLogin();
      return
    }
    let isShow = this.productComment['items'][ind]['showSecond'];
    console.log('form', this.productComment)
    this.productComment['items'].forEach(item => {
      if (isShow) {
        item.showSecond = false;
        this.productComment['items'][ind]['showSecond'] = true
      } else {
        item.showSecond = false;
      }
    })
    this.productComment['items'][ind]['showSecond'] = !this.productComment['items'][ind]['showSecond']
  }

  // 回复评论
  replyComment(common, ind) {
    if (!this.userId) { this.showLogin(); }
    if (!this.replyCommentCont) { return }
    let option = {productId: this.productDetail.productId, data: {remark: this.replyCommentCont, replyTo: common.id, userId: this.userId}};
    this.service.addProductComment(option)
      .then(res => {
        this.productComment['items'][ind]['showSecond'] = false;
        this.getProductDetail(this.productDetail.productId);
      })
  }

  // 未登录处理
  //  显示登录框
  showLogin(): void {
    this.searchService.loginEvent.emit();
  }
}
