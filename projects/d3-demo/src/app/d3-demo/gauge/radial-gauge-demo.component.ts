import { Component, OnInit } from '@angular/core';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-radial-gauge-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data2"></icc-d3>
  </div>
  `,
})
export class AppRadialGaugeDemoComponent implements OnInit {

  options: IccD3Options = {
    chartType: 'radialGauge',
    xScaleType: 'band',
    x: (d) => d.key,
    y: (d) => d.y,
    drawColor: (d, i) => d.key,
    pie: {
      startAngle: Math.PI * -2 / 3,
      endAngle: Math.PI * 2 / 3
    },
    legend: {
      position: 'top',
    },
    zoom: {
      enabled: false,
      horizontalOff: false,
      horizontalBrushShow: true,
      verticalOff: false,
      verticalBrushShow: true
    }
  };

  data = [{
    key: 'One',
    y: 5
  },
  {
    key: 'Two',
    y: 2
  },
  {
    key: 'Three',
    y: 9
  },
  {
    key: 'Four',
    y: 7
  },
  {
    key: 'Five',
    y: 4
  },
  {
    key: 'Six',
    y: 3
  },
  {
    key: 'Seven',
    y: .5
  }];

  data2: any[];

  ngOnInit(): void {
    this.data2 = [{
      key: 'Radial Chart',
      values: this.data,
    }];
  }
}
