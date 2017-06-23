import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

import { YslHttpService } from '../../core/ysl-http.service';
import {ProductErrorService} from './product-error.service';
import {CookieService} from 'ngx-cookie';
import {MdDialog} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {LoginComponent} from '../../login/login.component';
import {ConfirmDialogComponent} from "../../core/commons/confirm-dialog.component";
import {YslCommonService} from "../../core/ysl-common.service";
import {ProductService} from "../service/product.service";
import {ProductImportComponent} from "../product-import/product-import.component";

const USER_COOKIE = 'yslUserInfo';

@Component({
  selector: 'app-error-correct',
  templateUrl: './error-correct.component.html',
  styleUrls: ['./error-correct.component.css']
})

export class ErrorCorrectComponent implements OnInit {

  rows = [];
  selected = [];
  error = [];
  errorEdit = false;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy.mm.dd'
  };

  model: Object = { date: { year: 2018, month: 10, day: 9 } };

  columns = [
    {name: 'proName'},
    {name: 'userName'},
    {name: 'problem'},
    {name: 'submitTime'},
    {name: 'option'}
  ];


  user: any;
  constructor(public service: ProductErrorService,
              private commonService: YslCommonService,
              private productService: ProductService,
              private dialog: MdDialog,
              private cookie: CookieService) {

  }

  closeError() {
    this.errorEdit = false;
  }

  /**
   * 修改产品
   * @param content
   */
  modifyError(row) {
    console.log(row);
    this.productService.get(row.productId)
      .subscribe(data => {
        console.log('data:', data);


        const dialogRef = this.dialog.open(ProductImportComponent, {data: {
          'data': data,
          'productTitle': data['name']
        }, disableClose: true});
        dialogRef.componentInstance.productTitle = data['name'];
        dialogRef.componentInstance.isProImport = false;
        dialogRef.componentInstance.data = data;

        dialogRef.afterClosed().subscribe(res => {

        });
      });
  }

  modifyStatus(row) {
    console.log('row:', row);

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '确认改变纠错状态',
        message: '确定要将当前纠错信状态改变为已修改吗?'
      }
    }).afterClosed().subscribe(result => {
      if (result === 'OK') {
          this.service.status(row.id, '3')
            .subscribe(data => {
                console.log('处理完成');

                this.listError();
            });
      }
    });
  }

  onSelect({ selected }) {
    // this.selected.push(selected);
    console.log(this.selected);

    // this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
  }

  onActivate(event) {
    // console.log('Activate Event', event.value);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [ this.rows[1], this.rows[3] ];
  }

  remove() {
    this.selected = [];
  }

  ngOnInit() {

    this.user  =  this.cookie.getObject(USER_COOKIE);

    console.log('userInfo:', this.user);

   if (isNullOrUndefined(this.user)) {
     this.showLoginComp();
   } else {
     this.listError();
   }

  }

  listError() {
    var params = {};
    if (this.user['userType'] === 20) {
      params['userName'] = this.user['name'];
    }
    this.service.list(params).subscribe(data => {
      console.log('data:', data);
      let total = data.totalLength;
      let items = data.items;
      items.forEach(item => {
        item.submitTime = this.commonService.getDateForDay(item.submitTime);
        if (item.status === 2) {
          item.statusText = '未修改';
        } else {
          item.statusText = '已修改';
        }
      })
      this.rows = items;
    });
  }

  showLoginComp() {
    const dialogLog = this.dialog.open(LoginComponent, {disableClose: true});
    dialogLog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.cookie.putObject('yslUserInfo', result.userLoginInfo);
      this.listError();
    });
  }
}
