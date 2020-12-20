import { Component, OnInit } from '@angular/core';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options, IccD3BulletChartData } from 'icc';

@Component({
  selector: 'd3-vertical-bullet-chart-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: row;'],
  template: `
  <div style="height: 100%; display: flex; flex-direction: column;">
    <icc-d3 [options]="options" [data]="data" style="width: 90px"></icc-d3>
  </div>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <icc-d3 [options]="options2" [data]="data2" style="width: 140px"></icc-d3>
  </div>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <icc-d3 [options]="options3" [data]="data3" style="width: 140px"></icc-d3>
  </div>
  `,
})

export class AppVerticalBulletChartDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'bulletChart',
    bullet: {
      type: 'vertical',
      label: 'Power',
      unit: 'kw',
    },

    yScaleType: 'linear',
    margin: { top: 20, right: 0, bottom: 40, left: 40 },
    y0: (d) => d.measures,
    x: (d) => d.label,
    y: (d) => d.x,

    zoom: {
      enabled: true,
      horizontalOff: true,
      horizontalBrushShow: false,
      verticalOff: false,
      verticalBrushShow: false
    }
  };

  options2: IccD3Options = {
    chartType: 'bulletChart',
    bullet: {
      type: 'vertical',
      label: 'Temperature',
      unit: 'F',
      markerLineWidth: 4
    },

    yScaleType: 'linear',
    margin: { top: 20, right: 0, bottom: 40, left: 90 },
    y0: (d) => d.measures,
    x: (d) => d.label,
    y: (d) => d.x,

    zoom: {
      enabled: true,
      horizontalOff: true,
      horizontalBrushShow: false,
      verticalOff: false,
      verticalBrushShow: false
    }
  };

  options3: IccD3Options = {
    chartType: 'bulletChart',
    // x: (d) => d.value,

    bullet: {
      type: 'vertical',
      label: 'Temperature',
      unit: 'F',
      markerLineWidth: 8
    },

    yScaleType: 'linear',
    margin: { top: 20, right: 0, bottom: 40, left: 90 },
    y0: (d) => d.measures,
    x: (d) => d.label,

    y: (d) => d.value,

    zoom: {
      enabled: true,
      horizontalOff: true,
      horizontalBrushShow: false,
      verticalOff: false,
      verticalBrushShow: false
    }
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

