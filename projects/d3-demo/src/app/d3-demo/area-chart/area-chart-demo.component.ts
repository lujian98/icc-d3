import { Component, OnInit } from '@angular/core';
import { SP500 } from '../shared';
import * as d3TimeFormat from 'd3-time-format';
import { IccD3Options } from 'icc';

interface Stock {
  date: Date;
  price: number;
}

@Component({
  selector: 'd3-demo-area-chart-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: column;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  `,
})
export class AppAreaChartDemoComponent implements OnInit {
  data: any;
  options: IccD3Options = {
    chartType: 'areaChart',
    x0: (d) => d.key,
    x: (d) => d.date,
    y: (d) => d.price,
    drawColor: (d, i) => d.key
  };

  options2: IccD3Options = {
    chartType: 'lineChart',
    x0: (d) => d.key,
    x: (d) => d.date,
    y: (d) => d.price,
    drawColor: (d, i) => d.key
  };

  private parseDate = d3TimeFormat.timeParse('%b %Y');

  ngOnInit() {
    const data = [{
      key: 'SP500',
      // color: 'red',
      values: this.parseData(SP500)
    }];
    this.data = data;
  }

  private parseData(data: any[]): Stock[] {
    return data.map(v => {
      const ret = { date: this.parseDate(v.date), price: v.price };
      return ret;
    });
  }
}

