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
    x: (d) => d.min,
    y: (d) => d.max,
    radialGauge: {
      valueUnit: 'kW',
      range: [
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
      ]
    }
  };

  options2: IccD3Options = {
    chartType: 'radialGauge',
    x: (d) => d.min,
    y: (d) => d.max,
    radialGauge: {
      startAngle: Math.PI * 0,
      endAngle: Math.PI * 2,
      majorGraduations: 12,
      centerOffsetY: 0,
      range: [
        {
          min: 0,
          max: 2.,
          color: 'rgb(156, 214, 130)'
        },
        {
          min: 2.,
          max: 4.,
          color: '#8DCA2F'
        },
        {
          min: 4.,
          max: 6.,
          color: '#FDC702'
        },
        {
          min: 6.,
          max: 8.,
          color: '#FF7700'
        },
        {
          min: 8.,
          max: 10.0,
          color: '#C50200'
        },
        {
          min: 10.,
          max: 12.0,
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
      values: 3.75,
    }];
    this.data2 = [{
      values: 0,
    }];
    let v = 0.0;
    setInterval(() => {
      v += 0.05;
      if (v > 12) {
        v = 0;
      }
      this.data2 = [{
        values: v
      }];
      this.cd.detectChanges();
    }, 500);

    setInterval(() => {
      this.data = [{
        values: Math.floor(Math.random() * 7)
      }];
      this.cd.detectChanges();
    }, 2000);
  }
}
