import { Component, OnInit } from '@angular/core';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options, IccD3BulletChartData } from 'icc';

@Component({
  selector: 'd3-bullet-chart-demo',
  template: `
    <icc-d3 [options]="options" [data]="data" style="height: 60px"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2" style="height: 60px"></icc-d3>
    <icc-d3 [options]="options3" [data]="data3" style="height: 90px"></icc-d3>
  `,
})
export class AppBulletChartDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'bulletChart',
    margin: { left: 100 },
    yAxis: {
      axisLabel: 'Power (kw)',
      // textAnchor: 'end',
      axisLabelDistance: -40,
      rotate: 0
    },
  };

  options2: IccD3Options = {
    chartType: 'bulletChart',
    margin: { left: 120 },
    bullet: {
      markerLineWidth: 4
    },
    yAxis: {
      axisLabel: 'Temperature (F)',
      textAnchor: 'end',
      axisLabelDistance: -10,
      rotate: 0
    },
  };

  options3: IccD3Options = {
    chartType: 'bulletChart',
    x: (d) => d.value,
    margin: { left: 120, bottom: 50 },
    bullet: {
      markerLineWidth: 8
    },
    yAxis: {
      axisLabel: 'Temperature (F)',
      textAnchor: 'end',
      axisLabelDistance: -10,
      rotate: 0
    },

    xAxis: {
      axisLabel: 'Temperature (F)',
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
      color: 'deepskyblue',
      x: 2500
    },
    {
      name: 'Group C',
      color: 'dodgerblue',
      x: 2150
    },
    {
      name: 'Group B',
      color: 'steelblue',
      x: 1450
    },
    {
      name: 'Group B',
      color: 'royalblue',
      x: 1000
    },
    {
      name: 'Group I',
      color: 'blue',
      x: 500
    }],
    markerLines: [
      { x: 1000, color: 'red' },
      { x: 1750, color: 'orange' },
      { x: 2300, color: 'black' }
    ]
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
      color: 'lightskyblue',
      x: 250
    },
    {
      name: 'Group B',
      color: 'dodgerblue',
      x: 215
    },
    {
      name: 'Group B',
      color: 'blue',
      x: 140
    },
    {
      name: 'Group B',
      color: 'steelblue',
      x: 142
    },
    {
      name: 'Group I',
      color: 'deepskyblue',
      x: 146
    }],
    markerLines: [
      { x: 100, color: 'red' },
      { x: 175, color: 'orange' },
      { x: 230, color: 'black' }
    ]
  }];

  data3: IccD3BulletChartData[] = [{
    range: [{
      label: 'Group A',
      value: 40
    },
    {
      label: 'Group B',
      color: '#eee',
      value: 260
    },
    {
      label: 'Group B',
      color: '#ddd',
      value: 240
    },
    {
      label: 'Group I',
      color: '#ccc',
      value: 200
    }],
    measures: [{
      name: 'Group B',
      color: 'red',
      value: 250
    },
    {
      name: 'Group B',
      color: 'blue',
      value: 215
    },
    {
      name: 'Group B',
      color: 'lightsteelblue',
      value: 180
    },
    {
      name: 'Group B',
      color: 'orange',
      value: 182
    },
    {
      name: 'Group I',
      color: 'steelblue',
      value: 120
    }],
    markerLines: [
      { value: 100, color: 'green' },
      { value: 175, color: 'orange' },
      { value: 230, color: 'blue' }
    ]
  }];

  ngOnInit() {

  }


}

