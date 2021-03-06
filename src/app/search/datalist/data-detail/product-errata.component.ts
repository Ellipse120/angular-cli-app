
import {Component, EventEmitter} from "@angular/core";
import {YslHttpService} from "../../../core/ysl-http.service";
import {SearchService} from "../../search.service";
import {YslCommonService} from "../../../core/ysl-common.service";
@Component({
  template: `<div class="errata-write">
        <textarea autofocus="autofocus" placeholder="请填写问题描述" class="no-border error-area" [(ngModel)]="errataRemark"></textarea>
        <button class="ysl-btn error-submit ysl-menu-close" (click)="submitErrata()">提交</button>
      </div>`,
  styles:[`
      :host{
        position: absolute;
        width: 60%;
        right: 0;
        top: 42px;
        box-shadow: 0 0 12px #eee;
        background-color: #fff;
        z-index: 1;
      }
      .errata-write{
        width: 100%;
        height: 135px;
        padding: 20px;
        background-color: #fff;
      }
      .errata-write:after{
        content: "";
        display: inline-block;
        height: 0;
        width: 0;
        border: 8px solid transparent;
        border-bottom-color: #eee;
        position: absolute;
        top: -16px;
        right: 32px;
      }
      .no-border{
        border:none;
        outline: none;
        width: 100%;
      }
      .error-area{
        min-height: 70px;
        font-family: '微软雅黑';
        font-size: 12px;
        line-height: 24px;
      }
      .error-submit{
        width: 50px;
        line-height: 20px;
        background: #39baf6;
        text-align: center;
        color: #fff;
        position: absolute;
        bottom: 20px;
        right:20px;
        -webkit-border-radius:5px;
        -moz-border-radius:5px;
        border-radius:5px;
        cursor: pointer;
      }
    @media screen and (max-width: 768px) {
      :host{
        width: 90%;
      }
    }
  `]
})

export class ProductErrataComponent {
  errataRemark: string;
  popupClose = new EventEmitter<any>();

  constructor(private service: YslHttpService, private searchService: SearchService, private commonService: YslCommonService) {}
  // submitErrata() {
  //   this.popupClose.emit({data: this.errataRemark})
  // }

  // 纠错
  submitErrata() {
    const data = this.searchService.errataInfo;
    if ((!this.errataRemark) || (!data.userId)) { return; }
    const option = {productId: data.productId, data: {userId: data.userId, status: data.status, comment: this.errataRemark}};
    this.service.createProductErrata(option)
      .then(res => {
        this.popupClose.emit();
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }
}
