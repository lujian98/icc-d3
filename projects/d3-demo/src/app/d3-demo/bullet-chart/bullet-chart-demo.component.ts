import { Component, OnInit } from '@angular/core';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options, IccD3BulletChartData } from 'icc';

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
    bullet: {
      label: 'Power',
      unit: 'kw',
    },
  };

  options2: IccD3Options = {
    chartType: 'bulletChart',
    margin: { left: 100 },
    bullet: {
      label: 'Temperature',
      unit: 'F',
    },
  };

  data: IccD3BulletChartData[] = [{
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
      name: 'Group B',
      color: 'red',
      x: 2500
    },
    {
      name: 'Group C',
      color: 'orange',
      x: 2150
    },
    {
      name: 'Group B',
      color: 'orange',
      x: 1450
    },
    {
      name: 'Group B',
      color: 'orange',
      x: 1000
    },
    {
      name: 'Group I',
      color: 'green',
      x: 500
    }],
    markerLines: [1000, 1750, 2300]
  }];

  data2: IccD3BulletChartData[] = [{
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
      name: 'Group B',
      color: 'red',
      x: 250
    },
    {
      name: 'Group B',
      color: 'orange',
      x: 215
    },
    {
      name: 'Group B',
      color: 'orange',
      x: 142
    },
    {
      name: 'Group B',
      color: 'orange',
      x: 142
    },
    {
      name: 'Group I',
      color: 'green',
      x: 142
    }],
    markerLines: [100, 175, 230]
  }];

  ngOnInit() {

  }


}

