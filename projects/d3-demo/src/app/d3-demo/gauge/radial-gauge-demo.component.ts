import { Component, OnInit } from '@angular/core';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-radial-gauge-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data"></icc-d3>
  </div>
  `,
})
export class AppRadialGaugeDemoComponent implements OnInit {

  options: IccD3Options = {
    chartType: 'radialGauge',
    xScaleType: 'band',
    x0: (d) => d.key,
    y0: (d) => d.ranges,
    x: (d) => d.min,
    y: (d) => d.max,
    pie: {
      startAngle: Math.PI * -2 / 3,
      endAngle: Math.PI * 2 / 3,
      donut: 0.7
    },
    legend: {
      position: 'top',
    },
    zoom: {
      enabled: false,
    }
  };

  ranges = [
    {
      min: 0,
      max: 1.,
      color: 'rgb(156, 214, 130)'
    },
    {
      min: 1.,
      max: 2.,
      color: '#8DCA2F'
    },
    {
      min: 2.,
      max: 3.,
      color: '#FDC702'
    },
    {
      min: 3.,
      max: 4.,
      color: '#FF7700'
    },
    {
      min: 4.,
      max: 5.0,
      color: '#C50200'
    },
    {
      min: 5.,
      max: 6.0,
      color: 'red'
    }
  ];
  data: any[];
  ngOnInit(): void {
    this.data = [{
      key: 'Radial Chart',
      value: 2.5,
      ranges: this.ranges,
    }];
  }
}
