import { Component, OnInit } from '@angular/core';
import { SP500 } from '../shared';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options } from 'icc';

interface Stock {
  date: Date;
  price: number;
}

@Component({
  selector: 'd3-bullet-chart-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: column;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
  `,
})
export class AppBulletChartDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'bulletChart',
    xScaleType: 'linear',
    maxDrawHeight: 40,
    margin: { top: 0, right: 10, bottom: 0, left: 60 },
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.value,
    y: (d) => d.label,
    drawColor: (d, i) => d.key,
    legend: {
      enabled: false,
    },
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: false,
      verticalOff: true,
      verticalBrushShow: false
    },
    popover: {
      // enabled: false,
      axisFormatter: (d) => d3TimeFormat.timeFormat('%x')(d)
    },
  };

  data = [{
    key: 'Series1',
    values: [{
        label: 'Group A',
        color: 'red',
        value: 60
      },
      {
        label: 'Group B',
        color: 'red',
        value: 260
      },
      {
        label: 'Group B',
        color: 'orange',
        value: 240
      },
      {
        label: 'Group I',
        color: 'green',
        value: 200
      }]
  }];


  ngOnInit() {
  }

}

