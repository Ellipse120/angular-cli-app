/**
 * Created by Administrator on 2017/5/10.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationStart} from '@angular/router';

import { YslHttpService } from '../../../core/ysl-http.service';
import {YslCommonService} from '../../../core/ysl-common.service';
import {CookieService} from 'ngx-cookie';
import {YslPopupDirective} from '../../../core/directive/ysl-popup.directive';
import {ProductErrataComponent} from './product-errata.component';
import {SearchService} from '../../search.service';
import {MdSnackBar} from '@angular/material';


@Component({
  selector: 'data-detail',
  templateUrl: './data-detail.component.html',
  styleUrls: ['./data-detail.component.css']
})

export class DataDetailComponent implements OnInit {

  @ViewChild(YslPopupDirective)
  private yslPopup: YslPopupDirective;
  id: string;
  userId;
  isShowLoading: boolean;
  commentRemark = '';
  commentError = '';
  currCommentPage = 0;
  isMoreComment: boolean;
  isShowCommentLoading: boolean;
  commentPagination = {limit: 5, offset: 0};
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
  // if the product is star by user
  isStar = false;
  downloadUrl;

  constructor(private route: ActivatedRoute,
              private service: YslHttpService,
              private commonService: YslCommonService,
              private router: Router,
              private cookie: CookieService,
              private searchService: SearchService,
              public snackBar: MdSnackBar) {
    this.productDetail = {name: ''};
    this.stars =  Array(5).fill(1).map((x, i) => i);
    this.averageScore = this.stars;
    this.score = [
      {title: '准确性', key: 'scoreOnAccuracy', stars: this.stars, score: 0, curr: -1},
      {title: '及时性', key: 'scoreOnTimeliness', stars: this.stars, score: 0, curr: -1},
      {title: '完整性', key: 'scoreOnIntegrity', stars: this.stars, score: 0, curr: -1},
      {title: '规范性', key: 'scoreOnNormalization', stars: this.stars, score: 0, curr: -1}
    ];
  }

  ngOnInit(): void {
    this.getUserId();
    this.route.params.subscribe(e => {
      this.productParams = e;
      this.getProductDetail(this.productParams.productId);
    });
    this.commonService.getLoginStatus().subscribe((data) => {
      this.userId = data.loginStatus ? data['userInfo']['id'] : undefined;
    });
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        // this.getProductDetail(this.productParams.productId);
        window.scroll(0, 0);
      }
    });
    window.scroll(0, 0);
  }

  // 获取用户ID
  getUserId() {
    this.userId = this.cookie.getObject('yslUserInfo') ? 　this.cookie.getObject('yslUserInfo')['id'] : undefined;
  }

  // 搜索
  keywordSearch(data) {
    console.log('详情页搜索 data', data);
  }

  // 获取详情信息
  getProductDetail(productId) {
    this.isShowLoading = true;
    this.searchService.getAdvancedInfo()
      .then(data => {
        const advancedKey = data;
        this.service.getProductDetail(productId)
          .then(res => {
            this.getUserProp();
            this.productDetail = res;
            this.productDetail.premium = this.productDetail.premium ? '是' : '否';
            this.productDetail.modifiedOn = this.commonService.getDateForDay(this.productDetail.modifiedOn);
            if (this.productDetail.logoFilePath) {
              this.productDetail.logoFilePath = 'ysl-ws/api/file/' + this.productDetail.logoFilePath + '/download';
            }

            if ( this.productDetail.sampleFilePath ) {
               this.downloadUrl = 'ysl-ws/api/file/' + this.productDetail.sampleFilePath + '/download';
            }
            for (const key in advancedKey) {
              if (advancedKey.hasOwnProperty(key)) {
                switch (key) {
                  case 'data_category':
                    advancedKey[key].forEach(item => {
                      if (this.productDetail['dataCategory'] === (item.entryCode - 0)) {
                        this.productDetail['dataCategory'] = item.entryValue;
                      }
                    });
                    break;
                  case 'data_collection':
                    advancedKey[key].forEach(item => {
                      if (this.productDetail['collectionMethod'] === (item.entryCode - 0)) {
                        this.productDetail['collectionMethod'] = item.entryValue;
                      }
                    });
                    break;
                  case 'data_service':
                    advancedKey[key].forEach(item => {
                      if (this.productDetail['serviceMethod'] === (item.entryCode - 0)) {
                        this.productDetail['serviceMethod'] = item.entryValue;
                      }
                    });
                    break;
                  case 'data_source':
                    advancedKey[key].forEach(item => {
                      if (this.productDetail['dataSource'] === (item.entryCode - 0)) {
                        this.productDetail['dataSource'] = item.entryValue;
                      }
                    });
                    break;
                }
              }
            }
            this.productDetail['dataSince'] = this.productDetail['dataSince'] ? this.commonService.getDateForDay(this.productDetail['dataSince']) : null;
            this.productDetail['dataUntil'] = this.productDetail['dataUntil'] ? this.commonService.getDateForDay(this.productDetail['dataUntil']) : null;
            this.productDetail.averageScore = this.productDetail.averageScore ? (this.productDetail.averageScore).toFixed(1) : undefined;
            this.favoredCount = this.productDetail.favoredCount;
            this.getRelatedProducts();
            this.getComment();
            this.isShowLoading = false;
          });
      });
  }

  // 获取产品是否点赞收藏
  getUserProp() {
    if (!this.userId) { return; }
    this.service.getProductUserProp(this.productParams.productId, this.userId)
      .then(res => {
        this.isThumbsUp = res['productFavor'];
        this.isStar = res['userFavorite'];
      });
  }

  // 下载数据样本
  downloadSampleFile() {
    // this.service.downloadSampleFile(this.productDetail.productId)
    this.service.downloadSampleFile(this.productDetail.sampleFilePath)
      .then(res => {
        // console.log('下载成功', res);
      });
  }

  // 获取相关产品
  getRelatedProducts() {
    const option = {type: 'organization', productId: this.productDetail.productId};
    this.service.getRelatedProducts(option)
      .then(res => {
        this.relatedProductList = res['items'];
      });
  }

  // 查看相关产品详情
  relatedProductDetail(item) {
    console.log('related', item);
    this.router.navigate(['/datadetail', {productId: item.productId}]);
    this.getProductDetail(item.productId);
    window.scroll(0, 0);
  }

  // 点赞
  thumbsUp() {
    if (!this.userId) {
      this.showLogin();
      return;
    }
    this.isThumbsUp = !this.isThumbsUp;
    const option = {productId: this.productDetail.productId, status: this.isThumbsUp, data: {'userId': this.userId}};
    this.service.createProductFavor(option)
      .then(res => {
        this.favoredCount = res['favoredCount'];
        this.isThumbsUp = res['favor'];
      }, error => {
        this.commonService.loginTimeout(error);
      });
  }


  // 评价星星
  productScore(parentInd, ind) {
    this.score.forEach((item, i) => {
      if (i === parentInd) {
        item.curr = ind;
        item.score = ind + 1;
      }
    });
  }

  // 纠错
  createErrata() {
    if (!this.userId) {
      this.showLogin();
      return;
    }
    this.searchService.errataInfo = {productId: this.productParams.productId, userId: this.userId, status: this.productDetail.status};
    this.yslPopup.toggle(ProductErrataComponent)
      .then(data => {
        this.snackBar.open('纠错提交成功', '', {
          duration: 2000,
          extraClasses: ['ysl-snack-bar']
        });
      });
  }

  // 发表评价
  sendComment() {
    this.commentError = '';
    if (!this.userId) { this.showLogin(); return; }
    // if (!this.commentRemark) {
    //   this.commentError = '请填写评语';
    //   return;
    // }
    for (let i = 0; i < this.score.length; i ++) {
      if (!this.score[i].score) {
        this.commentError = '请打分';
        return;
      }
    }
    const score = {productId: this.productParams.productId, data: {userId: this.userId}};
    this.score.forEach(item => {
      score.data[item.key] = item.score;
    });
    if (this.commentRemark) {
      score.data['remark'] = this.commentRemark;
    }
    this.service.addProductComment(score)
      .then(res => {
        this.snackBar.open('评论成功', '', {
          duration: 3000,
          extraClasses: ['ysl-snack-bar']
        });
        this.productComment['items'] = [];
        this.getComment();
      }, error => {
        this.commonService.loginTimeout(error);
      });
  }

  // 获取产品评论
  getComment() {
    this.isShowCommentLoading = true;
    return new Promise(resolve => {
      this.service.getProductComment({productId: this.productDetail.productId, data: this.commentPagination})
        .then(res => {
          if (!res.items) { return; }
          const items: any = res.items;
          items.forEach(item => {
            item.modifiedOn = this.commonService.getDateForTime(item.modifiedOn);
            if (item['items']) {
              item['items'].forEach(reply => {
                reply.modifiedOn = this.commonService.getDateForTime(reply.modifiedOn);
              });
            }
            // let timeDis = (new Date).getTime() - item.modifiedOn;
            item.averageScore = ((item.scoreOnTimeliness + item.scoreOnNormalization + item.scoreOnAccuracy + item.scoreOnIntegrity) / 4).toFixed(1);
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
          });
          this.productComment['totalLength'] = res['totalLength'];
          res['items'].forEach(com => {
            if (!com.remark) { com.remark = '该用户未写评语'; }
            if (!com.userName) { com.userName = '匿名'; }
            this.productComment['items'].push(com);
          });
          this.isMoreComment = (parseInt(this.productComment.totalLength, 10) > ((this.currCommentPage + 1) * this.commentPagination['limit'])) ? true : false;
          this.isShowCommentLoading = false;
        });
    });
  }

  // 加载更多评论
  loadMoreComment() {
    const page = Math.ceil(parseInt(this.productComment['totalLength'], 10) / this.commentPagination.limit);
    if ((this.currCommentPage + 1) < page) {
      this.currCommentPage ++;
      this.commentPagination['offset'] = this.currCommentPage * this.commentPagination['limit'];
      this.getComment();
    }
  }

  showReply(ind) {
    if (!this.userId) {
      this.showLogin();
      return;
    }
    const isShow = this.productComment['items'][ind]['showSecond'];
    this.productComment['items'].forEach(item => {
      if (isShow) {
        item.showSecond = false;
        this.productComment['items'][ind]['showSecond'] = true;
      } else {
        item.showSecond = false;
      }
    });
    this.productComment['items'][ind]['showSecond'] = !this.productComment['items'][ind]['showSecond'];
  }

  // 回复评论
  replyComment(common, ind) {
    if (!this.userId) { this.showLogin(); }
    if (!this.replyCommentCont) { return; }
    const option = {productId: this.productDetail.productId, data: {remark: this.replyCommentCont, replyTo: common.id, userId: this.userId}};
    this.service.addProductComment(option)
      .then(res => {
        this.productComment['items'][ind]['showSecond'] = false;
        this.service.getProductComment({productId: this.productDetail.productId, data: this.commentPagination}).then(data => {
          data['items'].forEach(com => {
            if (com['id'] === common['id']) {
              this.productComment['items'][ind]['items'] = com['items'];
            }
          });
        });
      }, error => {
        this.commonService.loginTimeout(error);
      });
  }

  // 未登录处理
  //  显示登录框
  showLogin(): void {
    this.searchService.loginEvent.emit();
  }

  star() {

    if (!this.userId) {
      this.showLogin();
      return;
    }

    if (this.isStar) { // delete status
      this.service.updateFavorite({
        favorite: false,
        productId: this.productDetail.productId,
        userId: this.userId
      }).subscribe(data => {
        this.getUserProp();
      }, error => {
        this.commonService.loginTimeout(error);
      });
    } else {
      this.service.updateFavorite({
        favorite: true,
        productId: this.productDetail.productId,
        userId: this.userId
      }).subscribe( () => {
         this.getUserProp();
      }, error => {
        this.commonService.loginTimeout(error);
      });
    }
  }
}
