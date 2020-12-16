import { Component, OnInit } from '@angular/core';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options } from 'icc';

@Component({
  selector: 'd3-bullet-chart-demo',
  template: `
    <icc-d3 [options]="options" [data]="data" style="height: 60px"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2" style="height: 60px"></icc-d3>
  `,
})
export class AppBulletChartDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'bulletChart',
    xScaleType: 'linear',
    maxDrawHeight: 40,
    margin: { top: 0, right: 20, bottom: 0, left: 60 },
    x0: (d) => d.key,
    y0: (d) => d.measures,
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
    },
  };

  options2: IccD3Options = {
    chartType: 'bulletChart',
    xScaleType: 'linear',
    maxDrawHeight: 40,
    margin: { top: 0, right: 20, bottom: 0, left: 100 },
    x0: (d) => d.key,
    y0: (d) => d.measures,
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
    },
  };

  data = [{
    key: 'Power',
    unit: '(kw)',
    range: [{
      label: 'Group A',
      color: 'red',
      value: 200
    },
    {
      label: 'Group B',
      color: 'red',
      value: 3000
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 2400
    },
    {
      label: 'Group I',
      color: 'green',
      value: 2000
    }],
    measures: [{
      label: 'Group B',
      color: 'red',
      value: 2500
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 2150
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 1450
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 1000
    },
    {
      label: 'Group I',
      color: 'green',
      value: 500
    }],
    markerLines: [1000, 1750, 2300]
  }];

  data2 = [{
    key: 'Temperature',
    unit: '(F)',
    range: [{
      label: 'Group A',
      color: 'red',
      value: 40
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
    }],
    measures: [{
      label: 'Group B',
      color: 'red',
      value: 250
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 215
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 145
    },
    {
      label: 'Group B',
      color: 'orange',
      value: 142
    },
    {
      label: 'Group I',
      color: 'green',
      value: 140
    }],
    markerLines: [100, 175, 230]
  }];

  ngOnInit() {

  }


}

