import { Component, OnInit } from '@angular/core';
import * as d3Format from 'd3-format';
import { IccD3Options } from 'icc';
import { POPULATION } from '../shared/population2';

@Component({
  selector: 'app-stacked-horizontal-bar-chart-demo',
  styles: [':host { height: 100%; display: flex;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
  `,
})
export class AppStackedNormalizedHorizontalBarDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'stackedNormalizedHorizontalBarChart',
    xScaleType: 'linear',
    yScaleType: 'band',
    x0: (d) => d.label,
    y0: (d) => d.values,
    x: (d) => d.value,
    y: (d) => d.name,
    drawColor: (d, i) => d.label,
    popover: {
      valueFormatter: (d) => d3Format.format(',.0f')(d),
    },
    zoom: {
      enabled: true,
      horizontalOff: true,
      horizontalBrushShow: true,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  data: any;

  ngOnInit(): void {
    this.data = this.formatData(POPULATION);
  }

  private formatData(data): any[] {
    const keys = ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '\u226580']
    const ndata = [];
    keys.forEach((d) => {
      ndata.push({
        label: d,
        values: []
      });
    });
    data.forEach((d, i) => {
      keys.forEach((key, j) => {
        const t = {
          name: d.name,
          value: d[key]
        };
        ndata[j].values.push(t);
      });
    });
    return ndata;
  }
}

