import {Component, OnInit, ViewChild} from '@angular/core';
import { EChartOption, ECharts } from 'echarts-ng2';
import {OperationService} from '../service/operation-service';

@Component({
  selector: 'app-operational-report',
  templateUrl: './operational-report.component.html',
  styleUrls: ['../operation-management.component.css']
})
export class OperationalReportComponent implements OnInit {

  @ViewChild('echarts') echarts: ECharts;
  chartOption: any;
  dataFilter = {
    startTime: 0,
    endTime: 0,
    rangeType: 'year'
  };
  constructor(private apiService: OperationService) { }

  ngOnInit() {
    this.chartOption = {
      tooltip : {
        trigger: 'axis'
      },
      backgroundColor: '#f6faf9',
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {}},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    this.getChartsData();
    window.onresize = () => {
      this.echarts.resize();
    };
  }

  getChartsData() {
    this.getOnlineUser();
    this.getProvisionSummary();
    this.signupUserCount();
  }

  // 在线用户数
  getOnlineUser() {
    const option = {startTime: this.dataFilter.startTime, endTime: this.dataFilter.endTime};
    this.apiService.getOnlineUserCount(this.dataFilter.rangeType, option)
      .subscribe(data => {
        console.log('用户数', data);
      });
  }

  // 用户注册统计
  signupUserCount() {
    const option = {startTime: this.dataFilter.startTime, endTime: this.dataFilter.endTime};
    this.apiService.signupUserCount(this.dataFilter.rangeType, option)
      .subscribe(data => {
        console.log('注册统计', data);
      });
  }

  // 产品统计
  getProvisionSummary() {
    this.apiService.getProvisionSummary()
      .subscribe(data => {
        console.log('数据统计', data);
      });
  }

}
