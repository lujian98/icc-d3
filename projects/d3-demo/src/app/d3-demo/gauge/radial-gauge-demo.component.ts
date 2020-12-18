import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IccD3Options } from 'icc';

@Component({
  selector: 'app-radial-gauge-demo',
  styles: [':host {height: 100%; display: flex; flex-direction: column;}'],
  template: `
  <div style="height: 100%; display: flex;">
    <icc-d3 [options]="options" [data]="data"></icc-d3>
    <icc-d3 [options]="options2" [data]="data2"></icc-d3>
  </div>
  `,
})
export class AppRadialGaugeDemoComponent implements OnInit {
  options: IccD3Options = {
    chartType: 'radialGauge',
    x: (d) => d.label,
    y: (d) => d.value,
    radialGauge: {
      valueUnit: 'kW',
      range: [
        {
          value: 0,
        },
        {
          value: 1,
        },
        {
          value: 2.,
        },
        {
          value: 3.,
        },
        {
          value: 4.,
        },
        {
          value: 5.0,
        },
        {
          value: 6.0,
        }
      ]
    }
  };

  options2: IccD3Options = {
    chartType: 'radialGauge',
    // y0: (d) => d.values,
    y: (d) => d,
    radialGauge: {
      startAngle: Math.PI * -0,
      endAngle: Math.PI * 2,
      majorGraduations: 12,
      centerOffsetY: 0,
      valueUnit: 'kW',
      range: [
        {
          value: 0,
          color: 'green'
        },
        {
          value: 2,
          color: 'rgb(156, 214, 130)'
        },
        {
          value: 4.,
          color: '#8DCA2F'
        },
        {
          value: 6.,
          color: '#FDC702'
        },
        {
          value: 8.,
          color: '#FF7700'
        },
        {
          value: 10.0,
          color: '#C50200'
        },
        {
          value: 12.0,
          color: 'red'
        }
      ]
    }
  };

  data: any[];

  data2: any[];

  constructor(
    protected cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.data = [{
      values: [ { label: 'A', value: 3} ]
    }];
    let v = 3.0;
    this.data2 = [{
      values: [v],
    }];

    setInterval(() => {
      v += 0.05;
      if (v > 12) {
        v = 0;
      }
      this.data2 = [{
        values: [v]
      }];
      this.cd.detectChanges();
    }, 500);

    setInterval(() => {
      this.data = [{
        values: [
          { label: 'A', value: Math.floor(Math.random() * 70) / 10 },
          { label: 'B', value: Math.floor(Math.random() * 70) / 10 },
          { label: 'C', value: Math.floor(Math.random() * 70) / 10 },
        ]
      }];
      this.cd.detectChanges();
    }, 1000);
  }
}
