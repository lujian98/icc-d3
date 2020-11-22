import { Component, OnInit } from '@angular/core';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-stacked-horizontal-bar-chart-demo',
  styles: [':host { height: 100%; display: flex;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  `,
})
export class AppStackedHorizontalBarDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'stackedHorizontalBarChart',
    xScaleType: 'linear',
    yScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.value,
    y: (d) => d.label,
    drawColor: (d, i) => d.key,
    // colors: ['red', 'green', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  };

  /*
      x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.value,
    y: (d) => d.label
    */

  options2: IccD3Options = {
    chartType: 'stackedBarChart',
    xScaleType: 'band',
    yScaleType: 'linear',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.label,
    y: (d) => d.value,
    drawColor: (d, i) => d.key,
  };

  data = [{
    key: 'Series1',
    // color: 'red',
    values: [{

      label: 'Group A',
      value: -1.8746444827653
    },
    {
      label: 'Group B',
      value: -8.0961543492239
    },
    {
      label: 'Group C',
      value: -0.57072943117674
    },
    {
      label: 'Group D',
      value: -2.4174010336624
    },
    {
      label: 'Group E',
      value: -0.72009071426284
    },
    {
      label: 'Group F',
      value: -0.77154485523777
    },
    {
      label: 'Group G',
      value: -0.90152097798131
    },
    {
      label: 'Group H',
      value: 7.91445417330854
    },
    {
      label: 'Group I',
      value: 3.055746319141851
    }]
  },
  {
    key: 'Series2',
    // color: '#1f77b4',
    values: [{
      label: 'Group A',
      value: 25.307646510375
    },
    {
      label: 'Group B',
      value: 16.756779544553
    },
    {
      label: 'Group C',
      value: 18.451534877007
    },
    {
      label: 'Group D',
      value: 8.6142352811805
    },
    {
      label: 'Group E',
      value: 7.8082472075876
    },
    {
      label: 'Group F',
      value: 5.259101026956
    },
    {
      label: 'Group G',
      value: 0.30947953487127
    },
    {
      label: 'Group H',
      value: 2.3
    },
    {
      label: 'Group I',
      value: 8.9
    }]
  }];

  ngOnInit() {
  }
}

