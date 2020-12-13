import { Component, OnInit } from '@angular/core';
import { SAMPLE_DATA, SAMPLE_DATA1 } from '../shared/';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-stacked-bar-chart-demo',
  styles: [':host { height: 100%; display: flex; flex-direction: column;'],
  template: `
    <icc-d3 [options]="options1" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data"></icc-d3>
  `,
})
export class AppStackedBarChartDemoComponent implements OnInit {
  data = SAMPLE_DATA;

  options1: IccD3Options = {
    chartType: 'stackedBarChart',
    xScaleType: 'band',
    margin: { right: 50, left: 60 },
    x0: (d) => d.label,
    y0: (d) => d.values,
    x: (d) => d.State,
    y: (d) => d.value,
    drawColor: (d, i) => d.label,
    colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  };

  options2: IccD3Options = {
    chartType: 'stackedNormalizedBarChart',
    xScaleType: 'band',
    x0: (d) => d.label,
    y0: (d) => d.values,
    x: (d) => d.State,
    y: (d) => d.value,
    drawColor: (d, i) => d.label,
    colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'],
    legend: {
      align: 'left',
    },
  };

  ngOnInit() {
    this.data = this.formatData(this.data);
    console.log( ' this.data =', this.data)
  }

  private formatData(data) {
    const keys = ['Under 5 Years', '5 to 13 Years', '14 to 17 Years', '18 to 24 Years', '25 to 44 Years', '45 to 64 Years', '65 Years and Over']
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
          State: d.State,
          value: d[key]
        };
        ndata[j].values.push(t);
      });
    });

    console.log( ' ndata =', ndata)
    return ndata;
  }
}

