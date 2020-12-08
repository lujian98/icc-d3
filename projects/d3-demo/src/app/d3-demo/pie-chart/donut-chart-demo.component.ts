import { Component, OnInit } from '@angular/core';
import * as d3Format from 'd3-format';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-pie-chart-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2"></icc-d3>
  </div>
  `,
}) //     <icc-d3 [options]="options2" [data]="data2"></icc-d3>
export class AppDonutChartDemoComponent implements OnInit {

  options: IccD3Options = {
    chartType: 'pieChart',
    xScaleType: 'band',
    x: (d) => d.name,
    y: (d) => d.value,
    drawColor: (d, i) => d.name,
    legend: {
      position: 'bottom',
    },
    popover: {
      valueFormatter: (d) => d3Format.format(',.0f')(d)
    },
    pie: {
      donut: 0.50
    },
    zoom: {
      enabled: false
    }
  };

  options2: IccD3Options = {
    chartType: 'pieChart',
    xScaleType: 'band',
    x: (d) => d.name,
    y: (d) => d.value,
    drawColor: (d, i) => d.name,
    legend: {
      position: 'right',
    },
    pie: {
      donut: 0.66,
      startAngle: Math.PI * 0.5,
      endAngle: Math.PI * -1.0
    },
    zoom: {
      enabled: false,
    }
  };

  data = [
    { name: '<5', value: 19912018 },
    { name: '5-9', value: 20501982 },
    { name: '10-14', value: 20679786 },
    { name: '15-19', value: 21354481 },
    { name: '20-24', value: 22604232 },
    { name: '25-29', value: 21698010 },
    { name: '30-34', value: 21183639 },
    { name: '35-39', value: 19855782 },
    { name: '40-44', value: 20796128 },
    { name: '45-49', value: 21370368 },
    { name: '50-54', value: 22525490 },
    { name: '55-59', value: 21001947 },
    { name: '60-64', value: 18415681 },
    { name: '65-69', value: 14547446 },
    { name: '70-74', value: 10587721 },
    { name: '75-79', value: 7730129 },
    { name: '80-84', value: 5811429 },
    { name: '≥85', value: 5938752 }
  ];

  data2: any[];

  ngOnInit(): void {
    this.data2 = [{
      key: 'Pie Chart',
      values: this.data,
    }];
  }
}

