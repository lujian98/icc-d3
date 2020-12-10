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
    x: (d) => d.min,
    y: (d) => d.max,
    pie: {
      startAngle: Math.PI * -2 / 3,
      endAngle: Math.PI * 2 / 3
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
      max: 1.5,
      color: '#DEDEDE'
    },
    {
      min: 1.5,
      max: 2.5,
      color: '#8DCA2F'
    },
    {
      min: 2.5,
      max: 3.5,
      color: '#FDC702'
    },
    {
      min: 3.5,
      max: 4.5,
      color: '#FF7700'
    },
    {
      min: 4.5,
      max: 6.0,
      color: '#C50200'
    }
  ];
  data: any[];
  ngOnInit(): void {
    this.data = [{
      key: 'Radial Chart',
      values: this.ranges,
    }];
  }
}
