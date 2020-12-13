import { Component, OnInit } from '@angular/core';
import * as d3Array from 'd3-array';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-linear-stacked-bar-chart',
  styles: [':host { height: 100%; display: flex; flex-direction: column;'],
  template: `
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  `,
})
export class AppLinearStackedBarChartComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'stackedBarChart',
    xScaleType: 'linear',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.x,
    y: (d) => d.y,
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: true,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  options2: IccD3Options = {
    chartType: 'groupedBarChart',
    xScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.values,
    x: (d) => d.x,
    y: (d) => d.y,
    zoom: {
      enabled: true,
      horizontalOff: false,
      horizontalBrushShow: true,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  data: any[];
  ngOnInit() {
    this.data = this.getData();
    console.log(' data =', this.data);
  }

  private getData() {
    return this.stream_layers(3, 10 + Math.random() * 10, .1)
      .map((data, i) => {
        return { key: 'Stream' + i, values: data };
      });
  }

  stream_layers(n, m, o) {
    if (arguments.length < 3) {
      o = 0;
    }
    return d3Array.range(n).map(() => {
      const a = [];
      for (let i = 0; i < m; i++) {
        a[i] = o + o * Math.random();
      }
      for (let i = 0; i < 5; i++) {
        this.bump(a, m);
      }
      return a.map((d, index) => {
        return { x: index, y: Math.max(0, d) };
      });
    });
  }

  private bump(a, m) {
    const x = 1 / (.1 + Math.random());
    const y = 2 * Math.random() - .5;
    const z = 10 / (.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
}

