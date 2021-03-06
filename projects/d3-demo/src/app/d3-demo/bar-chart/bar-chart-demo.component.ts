import { Component, OnInit } from '@angular/core';
import * as d3Format from 'd3-format';
import { IccD3Options } from 'icc';
import { STATISTICS } from '../shared';

@Component({
  selector: 'app-bar-chart-demo',
  styles: [':host { height: 100%; display: flex;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options3" [data]="data3"></icc-d3>
  `,
})
export class AppBarChartDemoComponent implements OnInit {
  data: any;
  options: IccD3Options = {
    chartType: 'barChart',
    xScaleType: 'band',
    x0: (d) => d.label,
    y0: (d) => d.values,
    x: (d) => d.letter,
    y: (d) => d.frequency,
    useInteractiveGuideline: true,
    duration: 2000,
    popover: {
      valueFormatter: (d) => d3Format.format(',.3f')(d)
    },
  };

  options3: IccD3Options = {
    chartType: 'barChart',
    xScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.label,
    y: (d) => d.value,
    drawColor: (d, i) => d.label,
    // useInteractiveGuideline: true,
    duration: 2000
  };

  data3 = [
    {
      key: 'Cumulative Return',
      color: 'cyan',
      values: [
        {
          label: 'A',
          color: 'blue',
          value: 59.765957771107
        },
        {
          label: 'B',
          color: 'green',
          value: 30
        },
        {
          label: 'C',
          color: 'orange',
          value: 32.807804682612
        },
        {
          label: 'D',
          color: 'red',
          value: 196.45946739256
        },
        {
          label: 'E',
          value: -39.434030906893
        },
        {
          label: 'F',
          value: 98.079782601442
        },
        {
          label: 'G',
          value: -33.925743130903
        },
        {
          label: 'H',
          value: 25.1387322875705
        }
      ]
    }
  ];

  ngOnInit() {
    const data = [{
      label: 'Frequency',
      chartType: 'lineChart',
      color: 'blue',
      values: STATISTICS
    }, {
      label: 'Frequency',
      chartType: 'barChart',
      color: 'green',
      values: STATISTICS
    }];
    this.data = data;
  }
}

