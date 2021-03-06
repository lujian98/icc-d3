import { Component, OnInit } from '@angular/core';
import * as d3Format from 'd3-format';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-line-chart-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options1" [dataSource]="data"></icc-d3>
    <icc-d3 [options]="options2" [dataSource]="data"></icc-d3>
  </div>
  <div style="height: 100%; display: flex; margin-top: 20px;">
    <icc-d3 [options]="options3" [dataSource]="data"></icc-d3>
    <icc-d3 [options]="options4" [dataSource]="data"></icc-d3>
  </div>
  `,
})
/*
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options1" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  </div>
  <div style="height: 100%; display: flex; margin-top: 20px;">
    <icc-d3 [options]="options3" [data]="data"></icc-d3>
    <icc-d3 [options]="options4" [data]="data"></icc-d3>
  </div>
  */
export class AppLineChartDemoComponent implements OnInit {
  data: any;
  options1: IccD3Options = {
    chartType: 'lineChart',
    xScaleType: 'linear',
    margin: { top: 50, right: 80, bottom: 10, left: 10 },
    useInteractiveGuideline: true,
    x0: (d) => d.key,
    y0: (d) => d.values,
    drawColor: (d, i) => d.key,
    xAxis: {
      position: 'top',
      axisLabelDistance: -30,
      axisLabel: 'Time (ms)',
      // rotate: -90
    },
    yAxis: {
      position: 'right',
      axisLabelDistance: 50,
      axisLabel: 'Voltage (v)',
      rotate: -90
    },
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: false,
      verticalOff: false,
      verticalBrushShow: false
    }
  };
  options2: IccD3Options = {
    chartType: 'lineChart',
    xScaleType: 'linear',
    x0: (d) => d.key,
    y0: (d) => d.values,
    drawColor: (d, i) => d.key,
    margin: { left: 80 },
    xAxis: {
      axisLabel: 'Time (ms)',
      textAnchor: 'start',
    },
    yAxis: {
      axisLabel: 'Voltage (v)',
      textAnchor: 'start',
    },
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: true,
      verticalOff: true,
      verticalBrushShow: false
    }
  };

  options3: IccD3Options = {
    chartType: 'lineChart',
    xScaleType: 'linear',
    useInteractiveGuideline: true,
    x0: (d) => d.key,
    y0: (d) => d.values,
    drawColor: (d, i) => d.key,
    xAxis: {
      axisLabel: 'Time (ms)',
      textAnchor: 'end',
    },
    yAxis: {
      axisLabel: 'Voltage (v)',
      textAnchor: 'end',
      rotate: -90,
      axisLabelDistance: -40,
    },
    zoom: {
      enabled: true,
      horizontalOff: true,
      horizontalBrushShow: false,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  options4: IccD3Options = {
    chartType: 'lineChart',
    xScaleType: 'linear',
    useInteractiveGuideline: true,
    x0: (d) => d.key,
    y0: (d) => d.values,
    drawColor: (d, i) => d.key,
    xAxis: {
      axisLabel: 'Time (ms)',
    },
    yAxis: {
      axisLabel: 'Voltage (v)',
    },
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: true,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  ngOnInit() {
    this.data = this.getData();
    // console.log(' n data =', this.data);
  }

  private getData(): any[] {
    const sin = []; const sin2 = []; const cos = [];
    for (let i = 0; i < 100; i++) {
      sin.push({ x: i, y: Math.sin(i / 10) });
      sin2.push({ x: i, y: i % 10 === 5 ? null : Math.sin(i / 10) * 0.25 + 0.5 });
      cos.push({ x: i, y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10 });
    }
    return [{
      values: sin,      // values - represents the array of {x,y} data points
      key: 'Sine Wave', // key  - the name of the series.
      color: '#ff7f0e'  // color - optional: choose your own line color.
    },
    {
      values: sin2,
      key: 'Another sine wave',
      color: '#7777ff',
      chartType: 'areaChart'      // area - set to true if you want this line to turn into a filled area chart.
    },
    {
      values: cos,
      key: 'Cosine Wave',
      color: '#2ca02c'
    }];
  }
}

