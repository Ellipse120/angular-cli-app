import {Component, OnInit, ViewChild} from '@angular/core';
import { EChartOption, ECharts } from 'echarts-ng2';
import {OperationService} from '../service/operation-service';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {YslCommonService} from '../../core/ysl-common.service';

@Component({
  selector: 'app-operational-report',
  templateUrl: './operational-report.component.html',
  styleUrls: ['../operation-management.component.css']
})
export class OperationalReportComponent implements OnInit {

  @ViewChild('onlineChart') onlineChart: ECharts;
  @ViewChild('singnupChart') singnupChart: ECharts;
  @ViewChild('productLineChart') productLineChart: ECharts;
  dataFilter = {
    startTime: 1999,
    endTime: 2017,
    rangeType: 'YEAR'
  };
  currentOnlineAmount: any;
  onlineAmountOption: any;
  hotProducts = [];
  signupAmountOption: any;
  productAmountOption: any;

  constructor(private apiService: OperationService,
              private router: Router,
              private commonService: YslCommonService) { }

  ngOnInit() {
    this.getChartsData();
    window.onresize = () => {
      this.onlineChart.resize();
      this.singnupChart.resize();
      this.productLineChart.resize();
    };
  }

  getChartsData() {
    this.currentOnlineAmountStats();
    this.OnlineAmountStats();
    this.getHotProducts();
    this.signupAmountStats();
    this.productAmountStats();
  }

  // 当前用户在线数
  currentOnlineAmountStats() {
    this.apiService.currentOnlineAmountStats()
      .subscribe(data => {
        if (!isNullOrUndefined(data['items']) && data['items'].length) {
          this.currentOnlineAmount = data['items'][0]['amount'];
        } else {
          this.currentOnlineAmount = 0;
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 在线数统计
  OnlineAmountStats() {
    const option = {startTime: this.dataFilter.startTime, endTime: this.dataFilter.endTime};
    const startTime = '' + new Date().getFullYear() + '01';
    const endTime = '' + new Date().getFullYear() + (new Date().getMonth() + 1);
    this.apiService.OnlineAmountStats('MONTH', {startTime: startTime, endTime: endTime})
      .subscribe(data => {
        const onlineAmount = {xData: [], data: []};
        if (!isNullOrUndefined(data['items']) && data['items'].length) {
          data['items'].forEach(item => {
            onlineAmount.xData.push(item['time']);
            onlineAmount.data.push(item['amount']);
          });
          this.onlineAmountOption = {
            tooltip : {
              trigger: 'axis'
            },
            backgroundColor: '#f6faf9',
            legend: {
              left: 'left',
              data: ['月度在线用户数']
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '8%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data : onlineAmount.xData
              }
            ],
            yAxis : [
              {
                type : 'value',
                axisLine: {show: false},
                axisLabel: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
              }
            ],
            series : [
              {
                name: '月度在线用户数',
                type: 'line',
                lineStyle: {normal: {color: '#ff4307'}},
                areaStyle: {normal: {color: 'transparent'}},
                data: onlineAmount.data
              }
            ]
          };
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 点击排行
  getHotProducts() {
    this.apiService.getHotProducts()
      .subscribe(data => {
        if (!isNullOrUndefined(data['items']) && data['items'].length) {
          this.hotProducts = data['items'].splice(0, 10);
          // this.hotProducts = this.hotProducts.splice(0, 9);
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 用户注册统计
  signupAmountStats() {
    const option = {startTime: this.dataFilter.startTime, endTime: this.dataFilter.endTime};
    const startTime = '' + new Date().getFullYear() + (this.getWeek() - 10);
    const endTime = '' + new Date().getFullYear() + this.getWeek();
    this.apiService.signupAmountStats('WEEK', {startTime: startTime, endTime: endTime})
      .subscribe(data => {
        const signupAmount = {xData: [], data: []};
        if (!isNullOrUndefined(data['items']) && data['items'].length) {
          data['items'].forEach(item => {
            signupAmount.xData.push(item['time']);
            signupAmount.data.push(item['amount']);
          });
          this.signupAmountOption = {
            tooltip : {
              trigger: 'axis'
            },
            backgroundColor: '#f6faf9',
            legend: {
              left: 'left',
              data: ['用户注册数']
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '8%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data : signupAmount.xData
              }
            ],
            yAxis : [
              {
                type : 'value',
                axisLine: {show: false},
                axisLabel: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
              }
            ],
            series : [
              {
                name: '用户注册数',
                type: 'line',
                lineStyle: {normal: {color: '#ff4307'}},
                areaStyle: {normal: {color: 'transparent'}},
                data: signupAmount.data
              }
            ]
          };
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 产品统计
  productAmountStats() {
    const option = {startTime: this.dataFilter.startTime, endTime: this.dataFilter.endTime};
    const startTime = '' + new Date().getFullYear() + (this.getWeek() - 10);
    const endTime = '' + new Date().getFullYear() + this.getWeek();
      this.apiService.productAmountStats('WEEK', {startTime: startTime, endTime: endTime})
      .subscribe(data => {
        const chartOption = {xData: [], data: []};
        if (!isNullOrUndefined(data['items']) && data['items'].length) {
          data['items'].forEach(item => {
            chartOption.xData.push(item['time']);
            chartOption.data.push(item['amount']);
          });
          this.productAmountOption = {
            tooltip : {
              trigger: 'axis'
            },
            backgroundColor: '#f6faf9',
            legend: {
              left: 'left',
              data: ['产品数量']
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '8%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data : chartOption.xData
              }
            ],
            yAxis : [
              {
                type : 'value',
                axisLine: {show: false},
                axisLabel: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
              }
            ],
            series : [
              {
                name: '产品数量',
                type: 'line',
                lineStyle: {normal: {color: '#ff4307'}},
                areaStyle: {normal: {color: 'transparent'}},
                data: chartOption.data
              }
            ]
          };
        }
      }, error => {
        this.commonService.requestErrorHandle(error);
      });
  }

  // 产品详情
  toProductDetail(product) {
    this.router.navigate(['datadetail', {productId: product.id}]);
  }

  // 获取第几周
  getWeek() {
    const d1 = new Date();
    const d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    const rq = d1.getTime() - d2.getTime();
    const s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
    return Math.ceil(s1 / 7);
  }
}
