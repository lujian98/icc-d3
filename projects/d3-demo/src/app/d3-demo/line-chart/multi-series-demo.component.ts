import { Component, OnInit } from '@angular/core';
import * as d3TimeFormat from 'd3-time-format';
import { TEMPERATURES } from '../shared';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-multi-series-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: column;}'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  `,
})
export class AppMultiSeriesDemoComponent implements OnInit {
  data = TEMPERATURES;
  options = {
    chartType: 'lineChart',
    useInteractiveGuideline: true,
    x0: (d) => d.id,
    y0: (d) => d.values,
    x: (d) => d.date,
    y: (d) => d.temperature,
    drawColor: (d, i) => d.id,
    popover: {
      labelFormatter: (d) => d3TimeFormat.timeFormat('%x')(d)
    },
  };

  data2: any;
  options2 = {
    chartType: 'areaChart',
    useInteractiveGuideline: true,
    x0: (d) => d.id,
    y0: (d) => d.values,
    x: (d) => d.date,
    y: (d) => d.temperature,
    drawColor: (d, i) => d.id,
    popover: {
      labelFormatter: (d) => d3TimeFormat.timeFormat('%x')(d)
    },
  };

  ngOnInit() {

  }
}



